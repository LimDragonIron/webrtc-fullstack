// src/redis.service.ts
import { Injectable } from '@nestjs/common';
import { createClient } from 'redis';

@Injectable()
export class RedisService {
  private client = createClient({ url: 'redis://localhost:6379' });

  constructor() {
    this.client.connect();
  }

  async addUserToRoom(room: string, userId: string) {
    await this.client.sAdd(`room:${room}:users`, userId);
  }

  async findUserInRoom(room: string, userId: string){
    const isMember = await this.client.sIsMember(`room:${room}:users`, userId);
    return isMember
  }

  async removeUserFromRoom(room: string, userId: string) {
    await this.client.sRem(`room:${room}:users`, userId);
  }

  async getUsersInRoom(room: string): Promise<string[]> {
    return this.client.sMembers(`room:${room}:users`);
  }

  async getRooms(): Promise<string[]> {
    const keys = await this.client.keys('room:*:users');
    return keys.map((key) => key.split(':')[1]);
  }

  async getKeys(key:string):Promise<string[]> {
    const keys = await this.client.keys(key);
    return keys
  }

  async saveMessage(room: string, userId: string, message: string) {
    const timestamp = new Date().toISOString();
    await this.client.rPush(
      `room:${room}:messages`,
      JSON.stringify({ userId, message, timestamp }),
    );
  }
}
