'use client';

import { Button, Flex, Input } from 'antd';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSocket } from '@/shared/providers/SocketProvider';
import { useEffect } from 'react';

const connectRoomSchema = z.object({
  roomId: z
    .string()
    .min(3, 'Room ID слишком короткий')
    .max(64, 'Room ID слишком длинный'),
  password: z.string().optional(),
});

type ConnectRoomForm = z.infer<typeof connectRoomSchema>;

export const ConnectToRoomForm = () => {
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ConnectRoomForm>({
    resolver: zodResolver(connectRoomSchema),
    mode: 'all',
    defaultValues: {
      roomId: '',
      password: '',
    },
  });

  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;

    const onError = ({ message }: any) => {
      console.log(message)
      setError('root', {
        message: message
      })
    };

    socket.on('join-error', onError);

    return () => {
      socket.off('join-error', onError);
    };
  }, [socket]);

  const onSubmit = (data: ConnectRoomForm) => {
    socket?.emit('join-room', {
      roomId: data.roomId.replace('#', ''),
      password: data.password,
    });
    reset();
  };

  console.log(errors.root)

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Flex vertical gap={12}>
        {/* ROOM ID */}
        <Controller
          name="roomId"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              placeholder="Room ID"
              status={errors.roomId ? 'error' : ''}
            />
          )}
        />
        {errors.roomId && (
          <div className='text-rose-500 font-semibold text-[14px]'>
            {errors.roomId.message}
          </div>
        )}

        {/* PASSWORD */}
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <Input.Password
              {...field}
              placeholder="Password (optional)"
              status={errors.password ? 'error' : ''}
            />
          )}
        />
        {errors.password && (
          <div className='text-rose-500 font-semibold text-[14px]'>
            {errors.password.message}
          </div>
        )}

        {errors.root && (
          <div className='text-rose-500 font-semibold text-[14px]'>
            {errors.root.message}
          </div>
        )}

        <Button
          htmlType="submit"
          type="primary"
          loading={isSubmitting}
        >
          Войти
        </Button>
      </Flex>
    </form>
  );
};
