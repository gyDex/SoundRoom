import { Button, Flex, Input } from 'antd';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSocket } from '@/shared/providers/SocketProvider';

const createRoomSchema = z.object({
  name: z
    .string()
    .min(3, 'Имя слишком короткое')
    .max(64, 'Имя слишком длинное'),
  password: z.string().optional(),
});

const CreateToRoomForm = () => {
  return (
    <div>
      
    </div>
  )
}

export default CreateToRoomForm
