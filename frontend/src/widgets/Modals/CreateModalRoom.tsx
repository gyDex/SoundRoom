'use client'

import React, { useState } from 'react';
import type { FormProps } from 'antd';
import { 
  Button, 
  Checkbox, 
  Form, 
  Input, 
  message, 
  Modal,  
  Space, 
} from 'antd';
import { useSocket } from '@/shared/providers/SocketProvider';
import { playerStore } from '@/shared/stores/player';
import { roomStore } from '@/shared/stores/room.store';

type Props = {
  IsModalOpen?: boolean,
  setIsModalOpen?: (value: boolean) => void;
}

type FieldType = {
  name?: string;
  description?: string;
  maxUsers?: number;
  isPrivate?: boolean;
  password?: string;
};

export const CreateModalRoom: React.FC<Props> = ({ IsModalOpen, setIsModalOpen }) => {
    const [loading, setLoading] = useState(false);
    const [isPrivate, setPrivate] = useState(false);
    const [form] = Form.useForm(); // Добавляем form instance

    const handleOk = () => setIsModalOpen?.(true);
    const handleCancel = () => setIsModalOpen?.(false);

    const socket = useSocket();

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        console.log('Form values:', values);
        
        try {
        setLoading(true);

        roomStore.setLoading(true);
        
        if (values.isPrivate && !values.password) {
            message.error('Password is required for private room!');
            return;
        }
        
        const roomId = crypto.randomUUID();
        socket?.emit('create-room', { roomId, audio: playerStore.currentPlay, state: values });
        
        message.success('Room created successfully!');
        setIsModalOpen?.(false);
        form.resetFields();
        
        } catch (error) {
            console.error('Error creating room:', error);
            message.error('Failed to create room');
        } finally {
            setLoading(false);
            roomStore.setLoading(false);
        }
    };

    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
        message.error('Please check the form for errors');
    };

    const handlePrivateChange = (e: any) => {
        const checked = e.target.checked;
        setPrivate(checked);
        
        // Если комната становится публичной, очищаем пароль
        if (!checked) {
        form.setFieldsValue({ password: undefined });
        }
    };

    return (
        <Modal 
            className={'music-group__modal'}
            title="Create Room" 
            open={IsModalOpen ?? false} 
            onOk={handleOk} 
            onCancel={handleCancel}
            footer={false}
            confirmLoading={loading}
        >
        <Form
            form={form} // Привязываем form instance
            name="create-room"
            initialValues={{ 
                name: 'Name',
                description: 'Test',
                remember: true,
                is_private: false,
                maxUsers: 10 // Дефолтное значение
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            className='flex flex-col'
            layout="vertical" // Вертикальное расположение
        >
            {/* Название комнаты - ОБЯЗАТЕЛЬНОЕ поле */}
            <Form.Item
            label="Room Name"
            name="name"
            className=''
            rules={[
                { required: true, message: 'Please input room name!' },
                { min: 3, message: 'Name must be at least 3 characters' },
                { max: 50, message: 'Name must be less than 50 characters' }
            ]}
            validateTrigger={['onChange', 'onBlur']}
            >
            <Input 
                placeholder="Enter room name" 
                disabled={loading}
            />
            </Form.Item>

            {/* Описание - необязательное */}
            <Form.Item
            label="Description"
            name="description"
            className=''
            rules={[
                { max: 200, message: 'Description must be less than 200 characters' }
            ]}
            >
            <Input.TextArea 
                rows={3} 
                placeholder="Optional room description"
                disabled={loading}
            />
            </Form.Item>

            {/* Максимальное количество пользователей */}
            <Form.Item
            label="Max Users"
            name="maxUsers"
            className=''
            normalize={(value) => Number(value) || 0}
            rules={[
                { required: true, message: 'Please input max users count!' },
                { type: 'number', min: 1, max: 100, message: 'Must be between 1 and 100' }
            ]}
            >
            <Input 
                type="number" 
                min={1}
                max={100}
                placeholder={"10"}
                disabled={loading}
            />
            </Form.Item>

            {/* Приватная комната */}
            <Form.Item
            name="isPrivate"
            valuePropName="checked"
            >
            <Checkbox 
                checked={isPrivate} 
                defaultChecked={isPrivate}
                onChange={handlePrivateChange}
                disabled={loading}
            >
                Private room
            </Checkbox>
            </Form.Item>

            {/* Пароль (только для приватной комнаты) */}
            {isPrivate && (
            <Form.Item
                label="Room Password"
                name="password"
                rules={[
                { required: true, message: 'Password is required for private room!' },
                { min: 4, message: 'Password must be at least 4 characters' }
                ]}
                validateTrigger={['onChange', 'onBlur']}
                
            >
                <Input.Password 
                placeholder="Enter password" 
                disabled={loading}
                />
            </Form.Item>
            )}

            {/* Кнопка отправки */}
            <Form.Item style={{ marginTop: '24px' }}>
            <Space>
                <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading}
                disabled={loading}
                >
                {loading ? 'Creating...' : 'Create Room'}
                </Button>
                <Button 
                onClick={handleCancel}
                disabled={loading}
                >
                Cancel
                </Button>
            </Space>
            </Form.Item>
        </Form>
        </Modal>
    );
};

export default CreateModalRoom;