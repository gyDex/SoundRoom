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
import { FaRegCopy } from 'react-icons/fa';

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
          <div className='flex gap-[2.5px]'>
            {roomStore.hostId === record.id && (
              <Tag className='' color='blue' >
                Admin
              </Tag>
            )}
            {user?.id === record.id && (
              <Tag className='' color='green'>
                You
              </Tag>
            )}
          </div>
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
    console.log('leave-room');

    localStorage.removeItem('lastRoomId');

    socket?.emit('leave-room', {
      roomId: roomStore.currentRoom?.id,
      userId: userID
    });
  }
  
  const { data: data, isLoading } = useRoomUsers(roomStore.currentRoom?.id);

  useEffect(() => {
    if (data?.hostId && data?.hostId !== '') {
      roomStore.setHostId(data.hostId);
    }
  }, [data?.hostId])

  const onChange: TableProps<UserRow>['onChange'] = (pagination, filters, sorter, extra) => {
    console.log('params', pagination, filters, sorter, extra);
  };

  const handleCopyTag = (): void => {
    if (user?.username && user?.tag) {
      const fullTag = `#${roomStore.currentRoom?.id}`;
      navigator.clipboard.writeText(fullTag)
        .then(() => {
        })
        .catch(err => {
          console.error('Ошибка при копировании:', err);
        });
    }
  }
  
  return (
    <section className='room-view'>
        <div className='room-view__top'>
            <div className='room-view__top-right'>
              <h2 className='room-view__title'>
                  {roomStore.currentRoom?.name}
              </h2>

              <Tag className='!flex justify-center items-center gap-[10px]' key={'blue'} color={'blue'}>
                <span className='block'>
                  #{roomStore.currentRoom?.id}
                </span>

                <button onClick={handleCopyTag} className='cursor-pointer'><FaRegCopy size={16} /></button>
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
