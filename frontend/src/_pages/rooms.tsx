'use client';

import { useAuth } from '@/shared/lib/graphql/useAuth';
import { Button, Card, Flex, Input } from 'antd';
import { useEffect, useState } from 'react';
import { useSocket } from '@/shared/providers/SocketProvider';
import { playerStore } from '@/shared/stores/player';
import { roomStore } from '@/shared/stores/room.store';
import { observer } from 'mobx-react-lite';
import CreateModalRoom from '@/widgets/Modals/CreateModalRoom';
import Loader from '@/widgets/Loader/Loader';

import { ConnectToRoomForm } from '@/widgets/Room/ConnectToRoomForm/ConnectToRoomForm';
import { RoomView } from '@/widgets/Room/RoomView/RoomView';
import { RoomPlayer } from '@/widgets/Room/RoomPlayer/RoomPlayer';

export const RoomsPage = observer(() => {
  const tabList = [
    { key: 'create', tab: 'Create Room' },
    { key: 'connect', tab: 'Connect to Room' },
    ...(roomStore.currentRoom
      ? [{ key: 'room', tab: roomStore.currentRoom.name }]
      : []),
  ];

  const [activeTabKey, setActiveTabKey] =
    useState<'create' | 'connect' | 'room'>('create');

  const { user, loading } = useAuth();
  const socket = useSocket();

  const [isOpenModal, setModalOpen] = useState(false);

  useEffect(() => {
    if (!socket) return;

    const onCreated = ({ roomId, isHost, state }: any) => {
      console.log(state, 'state')
      roomStore.changeRoom(state);
      playerStore.joinRoom(roomId, isHost);
      setActiveTabKey('room');
      console.log(state)
      
      socket?.emit('join-room', {
        roomId,
        password: state.password,
      });
    };

    socket.on('room-created', onCreated);

    return () => {
      socket.off('room-created', onCreated);
    };
  }, [socket]);

  useEffect(() => {
    if (!socket) return;

    const onDeleted = ({ userId, state }: any) => {
      if (!state) return; 
      roomStore.changeRoom(state);
    };

    socket.on('user-left', onDeleted);

    return () => {
      socket.off('user-left', onDeleted);
    };
  }, [socket]);

  useEffect(() => {
    if (!socket) return;

    const onDeleted = ({ roomId }: any) => {
      roomStore.clearRoom();
      playerStore.leaveRoom();
      setActiveTabKey('connect');
    };

    socket.on('room-deleted', onDeleted);

    return () => {
      socket.off('room-deleted', onDeleted);
    };
  }, [socket]);

  if (loading || !user || !socket) {
    return <Loader />;
  }

  console.log(roomStore.currentRoom)

  return (
    <section style={{ padding: 24 }}>
      <CreateModalRoom
        IsModalOpen={isOpenModal}
        setIsModalOpen={setModalOpen}
      />

      <Card
        type="inner"
        title="Rooms"
        tabList={tabList as any}
        activeTabKey={activeTabKey}
        onTabChange={(key) => 
          setActiveTabKey(key as 'create' | 'connect')
        }
      >
        {activeTabKey === 'create' && (
          <>
            <Button
              type="primary"
              loading={roomStore.isLoading}
              onClick={() => setModalOpen((prev) => !prev)}
            >
              Создать комнату
            </Button>
          </>
        )}

        {activeTabKey === 'connect' && (
          <ConnectToRoomForm />
        )}
  
        {activeTabKey === 'room' && (
          <RoomView />
        )}
      </Card>
    </section>
  );
});
