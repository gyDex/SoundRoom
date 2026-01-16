import { useRoomUsers } from '@/shared/hooks/useRoom';
import './RoomVies.scss'
import { roomStore } from "@/shared/stores/room.store"
import { Button, Divider, Statistic, Table, TableColumnsType, TableProps, Tag } from "antd"
import { useEffect, useMemo } from 'react';
import Image from 'next/image';
import { useAuth } from '@/shared/lib/graphql/useAuth';
import { observer } from 'mobx-react-lite';
import { useSocket } from '@/shared/providers/SocketProvider';
import { RoomPlayer } from '../RoomPlayer/RoomPlayer';
import { playerStore } from '@/shared/stores/player';

interface UserRow {
  id: string;
  userAvatar?: string | null;
  username: string;
  email: string;
  tag: string;
}


export const RoomView = observer(() => {
  const { user } = useAuth();

  const socket = useSocket();

   const isAdmin = useMemo(() => {
    return user?.id === roomStore.hostId;
  }, [user?.id, roomStore.hostId]);

  useEffect(() => {
    if (roomStore?.hostId && roomStore?.hostId !== '') {
      roomStore.setHostId(roomStore.hostId);
    }
  }, [roomStore?.hostId]);

  const baseColumns: TableColumnsType<UserRow> = useMemo(() => [
    {
      dataIndex: 'userAvatar',
      key: 'userAvatar',
      width: 60,
      render: (src) => (
        <Image
          height={40}
          width={40}
          src={src || '/images/def.png'}
          className="rounded-[10px] relative z-20 max-w-fit"
          alt="User avatar"
        />
      ),
    },
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
      render: (value, record: UserRow) => (
        <div className='room-view__list-username'>
          <span>{value}</span>
          {roomStore.hostId === record.id && (
            <Tag className='!ml-[10px]' color='blue' >
              Admin
            </Tag>
          )}
          {user?.id === record.id && (
            <Tag className='!ml-[10px]' color='green'>
              You
            </Tag>
          )}
        </div>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Tag',
      dataIndex: 'tag',
      key: 'tag',
      render: (tag: string, record: UserRow) => (
        <span>{record.username}#{tag}</span>
      ),
    },
  ], [roomStore.hostId, user?.id]);

  const adminColumn: TableColumnsType<UserRow> = useMemo(() => [
    {
      title: 'Action',
      key: 'action',
      width: 100,
      render: (_, record: UserRow) => {
        // Не показываем кнопку удаления для:
        // 1. Текущего пользователя (админа)
        // 2. Другого админа (если он есть)
        const isCurrentUser = record.id === user?.id;
        const isOtherAdmin = record.id === roomStore.hostId && record.id !== user?.id;
        
        if (isCurrentUser || isOtherAdmin) {
          return null;
        }

        return (
          <Button 
            danger 
            size="small"
            onClick={() => onDelete(record.id)}
          >
            Remove
          </Button>
        );
      },
    },
  ], [user?.id, roomStore.hostId]);

  const columns = useMemo(() => {
    return isAdmin ? [...baseColumns, ...adminColumn] : baseColumns;
  }, [isAdmin, baseColumns, adminColumn]);

  const onDelete = (userID: string) => {
    console.log('leave-room')

    socket?.emit('leave-room', {
      roomId: roomStore.currentRoom?.id,
      userId: userID
    });
  }
  
  const { data: data, refetch, isLoading } = useRoomUsers(roomStore.currentRoom?.id);

  useEffect(() => {
    if (data?.hostId && data?.hostId !== '') {
      roomStore.setHostId(data.hostId);
    }
  }, [data?.hostId])

  const onChange: TableProps<UserRow>['onChange'] = (pagination, filters, sorter, extra) => {
    console.log('params', pagination, filters, sorter, extra);
  };
  
  return (
    <section className='room-view'>
        <div className='room-view__top'>
            <div className='room-view__top-right'>
              <h2 className='room-view__title'>
                  {roomStore.currentRoom?.name}
              </h2>

              <Tag key={'blue'} color={'blue'}>
                #{roomStore.currentRoom?.id}
              </Tag>
            </div>

            <div className='room-view__top-left'>
              <Button 
                danger 
                size="middle"
                onClick={() => onDelete(user.id)}
              >
                Leave the room
              </Button>
            </div>
        </div>

        <div className='room-view__content'>
            <p className='room-view__description'>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Adipisci, ipsum sequi, quos explicabo aliquid vel libero facilis ipsam, quo alias magni quibusdam sunt beatae voluptatibus cum. Aut non vero natus.
                {roomStore.currentRoom?.description}
            </p>
        </div>

        <Divider />

        <div className='room-view__list'>
          <Table<UserRow>
              rowKey="id"
              columns={columns}
              onChange={onChange}
              loading={isLoading}
              expandable={{
              rowExpandable: (record) => record.username !== 'Not Expandable',
              }}
              dataSource={data?.connectedUsers ?? []}
              className='room-view__table'
              
          />
          <div className='room-view__count'>
            <RoomPlayer
                name={playerStore.current?.name}
                artist={playerStore.current?.group}
                progress={playerStore.progress}
                />
            <Statistic title="Count Users" value={data?.connectedUsers ? data?.connectedUsers.length : 0} />
          </div>
        </div>
    </section>
  )
})
