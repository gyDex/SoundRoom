'use client'

import React, { useEffect, useState } from 'react';
import type { FormProps, GetProp, UploadProps } from 'antd';
import { Button, Flex, Form, Input, message, Modal, Select, Space, Upload } from 'antd';
import { useTracks } from '@/shared/hooks/useTracks';

import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { createPlaylist } from '@/shared/hooks/createPlaylist';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/shared/lib/graphql/useAuth';
import { usePlaylist } from '@/shared/lib/graphql/usePlaylist';
import { useMe } from '@/shared/hooks/auth/useMe';
import { getMe } from '@/shared/hooks/auth/getMe';

type Props = {
    IsModalOpen?: boolean,
    setIsModalOpen?: (value: boolean) => void;
}

type FieldType = {
    name?: string;
    tracks?: any;
};

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

export const CreateModalPlaylist: React.FC<Props> = ({IsModalOpen, setIsModalOpen}) => {
    const [items, setItems] = useState() as any;

    const { data: tracks, isLoading } =  useTracks();

    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState<string>('/images/def.png');

    const [selectTracks, setSelectTracks] = useState([]);

    const { data: user } = useQuery({ queryKey: ['user'], queryFn: getMe }) as any;

    const { refetchUser } = useAuth();

    const { refetchPlaylist } = usePlaylist();

    useEffect(() => {
        if (tracks) setItems(tracks?.map((item: any) => {
            return {
                value: item.id,
                label: item.name,
            }
        }))
    }, [tracks])

    const queryClient = useQueryClient();

    const handleOk = () => setIsModalOpen?.(true)

    const handleCancel = () => setIsModalOpen?.(false)

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        console.log(user)

        if (user) {

            await createPlaylist({
                userId: user.id,
                name: values.name ?? '',
                tracks: selectTracks ?? [],
                imageUrl: imageUrl ?? '',
            })
    
            queryClient.invalidateQueries({ queryKey: ['playlistId'] });    
            refetchUser();
            refetchPlaylist();    
        }

        if (setIsModalOpen) setIsModalOpen(false)
    };

    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const beforeUpload = (file: FileType) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
        }
        return isJpgOrPng && isLt2M;
    };

    const handleChange: UploadProps['onChange'] = (info) => {
        if (info.file.status === 'uploading') {
            setLoading(true);
            return;
        }

        if (info.file.status === 'done') {
            setLoading(false);
            const response = info.file.response; 
            if (response?.fileUrl) {
            setImageUrl(response.fileUrl);
            message.success('Image uploaded successfully');
            } else {
            message.error('Upload failed');
            }
        }

        if (info.file.status === 'error') {
            setLoading(false);
            message.error('Image upload failed');
        }
        };

    const uploadButton = (
        <button style={{ border: 0, background: 'none' }} type="button">
        {loading ? <LoadingOutlined /> : <PlusOutlined />}
        <div style={{ marginTop: 8 }}>Upload</div>
        </button>
    );

    return (
        <Modal 
            className={'music-group__modal'}
            title="Create playlist" 
            open={IsModalOpen ?? false} 
            onOk={handleOk} 
            onCancel={handleCancel}
            footer={false}
        >
            <Form
                name="basic"
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
                className='flex flex-col'
            >
            <Flex gap="middle" wrap>
                <Upload
                    name="file"
                    listType="picture-card"
                    className="avatar-uploader"
                    showUploadList={false}
                    action="http://localhost:4000/upload/image"
                    withCredentials
                    beforeUpload={beforeUpload}
                    onChange={handleChange}
                >
                    {imageUrl ? (
                        <img draggable={false} src={imageUrl} alt="avatar" style={{ width: '100%' }} />
                    ) : (
                    uploadButton
                    )}
                </Upload>
                </Flex>

                <Form.Item<FieldType>
                    label="Name Playlist"
                    name="name"
                    style={{ width: '100%', marginTop: '20px' }}
                    rules={[{ message: 'Please input your playlist!' }]}
                >
                    <Input />
                </Form.Item>

                <Space style={{ width: '100%' }} direction="vertical">
                    <Select
                        mode="multiple"
                        allowClear
                        style={{ width: '100%' }}
                        placeholder="Please select"
                        defaultValue={[] as any}
                        value={selectTracks}
                        onChange={(info) => setSelectTracks(info)}
                        options={items}
                    />
                </Space>

                <Form.Item style={{
                    marginTop: '20px'
                }} label={null}>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default CreateModalPlaylist
