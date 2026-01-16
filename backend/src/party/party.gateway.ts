import {
  WebSocketGateway,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RoomService } from './party.service';
import { AuthService } from 'src/auth/auth.service';
import { ConnectionPoolClosedEvent } from 'typeorm';

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
    private readonly roomService: RoomService, 
    private readonly authService: AuthService) {
    console.log('🔥 PartyGateway initialized');
  }

// async handleDisconnect(socket: Socket) {
//   const userId = socket.handshake.auth?.userId;
//   if (!userId) return;

//   for (const roomId of socket.rooms) {
//     if (roomId === socket.id) continue;

//     console.log('DISCONNECT → LEAVE', userId, roomId);

//     const updated = await this.roomService.leave(userId, roomId);

//     if (updated === null) {
//       this.server.to(roomId).emit('room-deleted', { roomId });
//     } else {
//       this.server.to(roomId).emit('user-left', {
//         userId,
//         state: updated,
//       });
//     }
//   }
// }

  private cleanMemoryRooms(socket: Socket): void {
    // Очищаем комнаты Socket.IO
    const rooms = Array.from(socket.rooms);
    for (const roomId of rooms) {
      if (roomId !== socket.id) {
        socket.leave(roomId);
      }
    }
  }

  @SubscribeMessage('create-room')
  async createRoom(
    @MessageBody() { roomId, audio, state },
    @ConnectedSocket() socket: Socket,
  ) {
    const userId = socket.handshake.auth.userId;

    const room = await this.roomService.create(roomId, userId, audio, state);
    
    socket.join(roomId);

    console.log(userId, roomId)

    await this.roomService.join(userId, roomId, state.password)
    
    console.log(room)

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


  @SubscribeMessage('join-room')
  async joinRoom(
    @MessageBody() { roomId, password },
    @ConnectedSocket() socket: Socket,
  ) {
    const userId = socket.handshake.auth.userId;

    const room = await this.roomService.join(userId, roomId, password)
    if (!room) return;

    socket.join(roomId);

    console.log('👤 JOIN ROOM', roomId);

    socket.emit('room-joined', {
      roomId,
      isHost: false,
      state: room,
    });
  }

  @SubscribeMessage('change-track')
  async changeTrack(
    @MessageBody() { roomId, audio, position },
    @ConnectedSocket() socket: Socket,
  ) {
    const userID = socket.handshake.auth.userId;
    const room = await this.roomService.get(roomId);
    if (!room || room.hostId !== userID) return;
    console.log('change-track')
    console.log(room, 'room')

    const updated = this.roomService.update(roomId, {
      audio,
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
    const room = await this.roomService.get(roomId);
    if (!room || room.hostId !== userId) return;

    const updated = this.roomService.update(roomId, {
      isPlaying: true,
      position,
      audio,
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
    const room = await this.roomService.get(roomId);
    if (!room || room.hostId !== userId) return;


    const updated = this.roomService.update(roomId, {
      isPlaying: false,
      position,
      audio,
      // duration,
      updatedAt: Date.now(),
    });

    this.server.to(roomId).emit('sync-state', updated);
  }

  @SubscribeMessage('seek')
async seek(
  @MessageBody() { roomId, position },
  @ConnectedSocket() socket: Socket,
) {
  console.log('seek')
  const userId = socket.handshake.auth.userId;
  const room = await this.roomService.get(roomId);
  if (!room || room.hostId !== userId) return;

  const updated = this.roomService.update(roomId, {
    position,
    updatedAt: Date.now(),
  });

  this.server.to(roomId).emit('sync-state', updated);
}

}
