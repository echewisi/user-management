// user-management/src/kafka/kafka.producer.ts

import { Injectable, Logger } from '@nestjs/common';
import { Kafka, Producer as KafkaProducer, RecordMetadata } from 'kafkajs';

@Injectable()
export class KafkaProducerService {
  private kafkaProducer: KafkaProducer;
  private readonly logger = new Logger(KafkaProducerService.name);

  constructor() {
    const kafka = new Kafka({
      brokers: ['kafka1:9092', 'kafka2:9092'], // Provide your Kafka broker endpoints
    });
    this.kafkaProducer = kafka.producer();
  }

  async sendMessage(topic: string, message: string): Promise<RecordMetadata[]> {
    try {
      await this.kafkaProducer.connect();
      const result = await this.kafkaProducer.send({
        topic,
        messages: [{ value: message }],
      });
      return result;
    } catch (error) {
      this.logger.error(`Error sending message to Kafka: ${error}`);
      throw error;
    } finally {
      await this.kafkaProducer.disconnect();
    }
  }

  async userRegistered(userId: string): Promise<RecordMetadata[]> {
    const message = JSON.stringify({ event: 'user_registered', userId });
    return this.sendMessage('user-events', message);
  }

  async userLoggedIn(userId: string): Promise<RecordMetadata[]> {
    const message = JSON.stringify({ event: 'user_logged_in', userId });
    return this.sendMessage('user-events', message);
  }
}
