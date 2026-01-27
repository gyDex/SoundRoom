'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '@/shared/lib/graphql/useAuth';
import { roomStore } from '../stores/room.store';
import { playerStore } from '../stores/player';

const SocketContext = createContext<Socket | null>(null);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  

  useEffect(() => {
    console.log('user.id',user?.id)

    if (!user?.id) return;

    const s = io(process.env.NEXT_PUBLIC_WS_URL!, {
      transports: ['websocket'],
      auth: { userId: user.id },
    });

    setSocket(s);

    s.on('connect', () => {
      console.log('✅ SOCKET CONNECTED', s.id);

      const activeRoomId = localStorage.getItem('activeRoomId')?.replace('#', '');

      console.log(activeRoomId)
      if (activeRoomId) {
      console.log('🟢 join-room');

        s?.emit('join-room', {
            roomId: activeRoomId,
            password: '',
        });
      }
    });

    s.on('room-joined', ({ roomId, isHost, state }) => {
      console.log('🟢 room-joined payload', state);
      console.log('🟢 isHost', user.id === state.hostId);

      localStorage.setItem('activeRoomId', roomId)
      roomStore.changeRoom(state);
      playerStore.applyServerState({
        isPlaying:state.isPlaying,
        position:state.position,
        audio:state.audio,
        updatedAt:state.updatedAt,
      })
      playerStore.joinRoom(state.id, user.id === state.hostId);
    });

    s.on('room-deleted', ({ roomId }) => {
      if (roomStore.currentRoom?.id === roomId) {
        roomStore.clearRoom();
        playerStore.leaveRoom();
        localStorage.removeItem('activeRoomId');
      }
    });

    return () => {
      s.disconnect();
      setSocket(null);
    };
  }, [user?.id]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
