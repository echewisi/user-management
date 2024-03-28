import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  Index,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  firstname: string;

  @Column({ length: 100 })
  lastname: string;

  @Column({ length: 100 })
  email: string;

  @Column({ unique: true })
  phonenumber: number;

  @Column({ length: 100 })
  password: string;

  @Column({ nullable: true, unique: true }) // Allow roomNumber to be null and enforce uniqueness for non-null values
  @Index({ unique: true, where: '(roomNumber IS NOT NULL)' }) // Partial unique index
  roomNumber: string;

  @Column({ nullable: true, unique: true }) // Allow ticketNumber to be null and enforce uniqueness for non-null values
  @Index({ unique: true, where: '(ticketNumber IS NOT NULL)' }) // Partial unique index
  ticketNumber: string;

  @BeforeInsert()
  async generateId() {
    if (!this.id) {
      this.id = uuidv4();
    }
  }
}
