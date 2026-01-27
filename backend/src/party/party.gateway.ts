import {
  WebSocketGateway,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RoomService } from './party.service';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000',
    credentials: true,
  },
})
export class PartyGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly roomService: RoomService) {
    console.log('🔥 PartyGateway initialized');
  }

  @SubscribeMessage('create-room')
  async createRoom(
    @MessageBody() { roomId, audio, state },
    @ConnectedSocket() socket: Socket,
  ) {
    const userId = socket.handshake.auth.userId;

    const room = await this.roomService.create(roomId, userId, audio, state);
    
    socket.join(roomId);

    // console.log(userId, roomId)

    // await this.roomService.join(userId, roomId, state.password, this.server)
    
    // console.log(room)

    socket.emit('room-created', {
      roomId,
      isHost: true,
      state: room,
    });

    console.log('✅ ROOM CREATED', roomId);
  }

  @SubscribeMessage('leave-room')
  async leaveRoom(
    @MessageBody() { roomId, userId },
    @ConnectedSocket() socket: Socket,
  ) {
    console.log('leave-room triggered for room:', roomId);

    console.log(roomId)
    
    try {
      if (!userId) {
        socket.emit('error', { message: 'User not authenticated' });
        return;
      }

      // Удаляем из базы данных
      const updatedParty = await this.roomService.leave(userId, roomId);

      // Покидаем комнату Socket.IO
      socket.leave(roomId);

      this.server.to(roomId).emit('room-deleted', { roomId });

      this.server.to(roomId).emit('user-left', {
        userId,
        state: updatedParty,
      });

      console.log(`👋 User ${userId} left room ${roomId}`);
      
      // Отправляем подтверждение пользователю
      socket.emit('room-left', { userId, roomId, success: true });
      
    } catch (error) {
      console.error('Error leaving room:', error.message);
      socket.emit('error', { message: error.message });
    }
  }

  @SubscribeMessage('host-state')
  async handleHostState(
    @MessageBody() data,
    @ConnectedSocket() socket: Socket,
  ) {
    const { roomId, ...state } = data;

    // this.roomService.set(roomId, state);

    await this.roomService.update(roomId, state);

    this.server.to(roomId).emit('sync-state', {
      roomId,
      ...state,
    });
  }


@SubscribeMessage('join-room')
async joinRoom(
  @MessageBody() { roomId, password },
  @ConnectedSocket() socket: Socket,
) {
  const userId = socket.handshake.auth.userId;

  await this.roomService.join(userId, roomId, password);

  socket.join(roomId);

  const runtime = await this.roomService.getRuntime(roomId);

  console.log(runtime, 'runtime')

  if (!runtime) {
    socket.emit('error', { message: 'Room has no active state' });
    return;
  }

  socket.emit('room-joined', {
    roomId,
    isHost: runtime.hostId === userId,
    state: runtime,
  });
}


  @SubscribeMessage('change-track')
  async changeTrack(
    @MessageBody() { roomId, audio, position },
    @ConnectedSocket() socket: Socket,
  ) {
    const userID = socket.handshake.auth.userId;
    const room = await this.roomService.getRuntime(roomId);
      

    if (!room || room.hostId  !== userID) return;
    console.log('change-track')
    console.log(room, 'room')
    console.log(audio, 'audio')

    const updated =  await this.roomService.update(roomId, {
      audio: audio,
      position: position,
      isPlaying: true,
      updatedAt: Date.now(),
    });

    this.server.to(roomId).emit('change-track', updated);
  }

  @SubscribeMessage('play')
  async play(
    @MessageBody() { roomId, position, audio, duration },
    @ConnectedSocket() socket: Socket,
  ) {
    console.log('play')

    const userId = socket.handshake.auth.userId;
    const room = await this.roomService.getRuntime(roomId);
    if (!room || room.hostId  !== userId) return;

    const updated = await this.roomService.update(roomId, {
      isPlaying: true,
      position,
      audio: audio,
      duration,
      updatedAt: Date.now(),
    });

    this.server.to(roomId).emit('sync-state', updated);
  }

  @SubscribeMessage('pause')
  async pause(
    @MessageBody() { roomId, position, audio, duration },
    @ConnectedSocket() socket: Socket,
  ) {
    console.log('pause')

    const userId = socket.handshake.auth.userId;
    const room = await this.roomService.getRuntime(roomId);
    if (!room || room.hostId  !== userId) return;


    const updated = await this.roomService.update(roomId, {
      isPlaying: false,
      position,
      audio: audio,
      // duration,
      updatedAt: Date.now(),
    });

    this.server.to(roomId).emit('sync-state', updated);
  }

  @SubscribeMessage('seek')
  async seek(
    @MessageBody() { roomId, position,duration },
    @ConnectedSocket() socket: Socket,
  ) {
  console.log('seek')
  const userId = socket.handshake.auth.userId;
  const room = await this.roomService.getRuntime(roomId);
  if (!room || room.hostId  !== userId) return;

  const updated = await this.roomService.update(roomId, {
    position,
    duration,
    updatedAt: Date.now(),
  });

  this.server.to(roomId).emit('sync-state', updated);
}

}
