import { Injectable } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';

@Injectable()
export class TokenBlacklistService {
  constructor(private readonly cache: CacheModule) {}

  async blacklistToken(token: string): Promise<void> {
    await this.cache.set(token, true, { ttl: 3600 }); // TTL of 1 hour
  }

  async isTokenBlacklisted(token: string): Promise<boolean> {
    const blacklisted = await this.cache.get(token);
    return !!blacklisted;
  }
}
