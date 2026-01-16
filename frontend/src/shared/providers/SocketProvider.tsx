'use client';

import { createContext, useContext, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '@/shared/lib/graphql/useAuth';

const SocketContext = createContext<Socket | null>(null);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const socketRef = useRef<Socket | null>(null);

  if (!socketRef.current && user?.id) {
    socketRef.current = io(process.env.NEXT_PUBLIC_WS_URL!, {
      transports: ['polling', 'websocket'],
      auth: {
        userId: user.id,
      },
    });

    socketRef.current.on('connect', () => {
      console.log('✅ GLOBAL SOCKET CONNECTED', socketRef.current?.id);
    });

    socketRef.current.on('disconnect', (reason) => {
      console.log('❌ GLOBAL SOCKET DISCONNECTED', reason);
    });
  }

  return (
    <SocketContext.Provider value={socketRef.current}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
