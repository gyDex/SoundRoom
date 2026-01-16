'use client';

import { Button, Flex, Input } from 'antd';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSocket } from '@/shared/providers/SocketProvider';

const connectRoomSchema = z.object({
  roomId: z
    .string()
    .min(3, 'Room ID слишком короткий')
    .max(64, 'Room ID слишком длинный'),
  password: z.string().optional(),
});

type ConnectRoomForm = z.infer<typeof connectRoomSchema>;

export const ConnectToRoomForm = () => {
  const socket = useSocket();

  const {
    control,
    handleSubmit,
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

  const onSubmit = (data: ConnectRoomForm) => {
    socket?.emit('join-room', {
      roomId: data.roomId.replace('#', ''),
      password: data.password,
    });

    console.log(data)

    reset();
  };

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
          <div style={{ color: 'red', fontSize: 12 }}>
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
          <div style={{ color: 'red', fontSize: 12 }}>
            {errors.password.message}
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
