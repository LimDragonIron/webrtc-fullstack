// src/chat.gateway.ts
import { ClassSerializerInterceptor, Logger, UseFilters, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RedisService } from 'src/redis/redis.service';

import { BadRequestExceptionFilter } from "../utils/filters"

@UseInterceptors(ClassSerializerInterceptor)
@UseFilters(BadRequestExceptionFilter)
@UsePipes(
  new ValidationPipe({
    transform: true,
    forbidNonWhitelisted: true,
    whitelist: true,
  }),
)
@WebSocketGateway(4000, { namespace: 'chat' })
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;
  private readonly logger = new Logger(ChatGateway.name);
  constructor(private readonly redisService: RedisService) {}

  afterInit(server: Server) {
    this.logger.debug('WebSocket server initialized');
  }

  handleConnection(client: Socket) {
    this.logger.debug(`Client connected: ${client.id}`);
  }

  

  handleDisconnect(client: Socket) {
    this.logger.debug(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @MessageBody() data: { room: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(data.room);
    await this.redisService.addUserToRoom(data.room, client.id);
    client.emit('joinedRoom', data.room);
    this.server.to(data.room).emit('userJoined', client.id);
  }

  @SubscribeMessage('leaveRoom')
  async handleLeaveRoom(
    @MessageBody() data: { room: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.leave(data.room);
    await this.redisService.removeUserFromRoom(data.room, client.id);
    client.emit('leftRoom', data.room);
    this.server.to(data.room).emit('userLeft', client.id);
  }

  @SubscribeMessage('listRooms')
  async handleListRooms(@ConnectedSocket() client: Socket) {
    const rooms = await this.redisService.getRooms();
    this.logger.debug(rooms);
    client.emit('roomsList', rooms);
  }

  @SubscribeMessage('listUsersInRoom')
  async handleListUsersInRoom(
    @MessageBody() data: { room: string },
    @ConnectedSocket() client: Socket,
  ) {
    const users = await this.redisService.getUsersInRoom(data.room);
    this.logger.debug(users);
    client.emit('usersList', users);
  }

  @SubscribeMessage('message')
  async handleMessage(
    @MessageBody() data: { room: string; message: string },
    @ConnectedSocket() client: Socket,
  ) {
    await this.redisService.saveMessage(data.room, client.id, data.message);
    this.server
      .to(data.room)
      .emit('message', { user: client.id, message: data.message });
  }
}
