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

  const columns: TableColumnsType<UserRow> = useMemo(() => [
    {
      dataIndex: 'userAvatar',
      key: 'userAvatar',
      render: (src) => (
        <Image
          height={40}
          width={40}
          src={src !== null && src !== undefined && src !== '' ? src : '/images/def.png'}
          className="rounded-[10px] relative z-20 max-w-fit"
          alt=""
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
          {
            roomStore.hostId === record.id && <Tag className='!ml-[10px]'  key={'blue'} color={'blue'} variant={'outlined'}>Admin</Tag>
          }
        </div>
      )
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
    {
      title: 'Action',
      dataIndex: '',
      key: 'x',
      render: () => <Button onClick={onDelete}>Delete</Button>,
    },
  ],[roomStore.hostId, user?.id]);

  const onDelete = () => {
    console.log('leave-room')

    socket?.emit('leave-room', {
      roomId: roomStore.currentRoom?.id,
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

  console.log(roomStore)

  return (
    <section className='room-view'>
        <div className='room-view__top'>
            <h2 className='room-view__title'>
                {roomStore.currentRoom?.name}
            </h2>

            <Tag key={'blue'} color={'blue'} variant={'outlined'}>
              #{roomStore.currentRoom?.id}
            </Tag>
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
