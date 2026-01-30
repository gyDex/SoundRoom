'use client'

import React, { useEffect, useState } from 'react';
import type { FormProps, GetProp, UploadProps } from 'antd';
import { Button, Flex, Form, Input, message, Modal, notification, Select, Space, Upload } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { useTracks } from '@/shared/hooks/useTracks';
import { useAuth } from '@/shared/lib/graphql/useAuth';
import { usePlaylist } from '@/shared/lib/graphql/usePlaylist';
import { getMe } from '@/shared/hooks/auth/getMe';
import { createPlaylist } from '@/shared/hooks/playlist/createPlaylist';
import { editPlaylist } from '@/shared/hooks/playlist/editPlaylist';

type Props = {
  IsModalOpen?: boolean;
  setIsModalOpen?: (value: boolean) => void;

  mode?: 'create' | 'edit';
  playlist?: {
    id: string;
    name: string;
    imageUrl?: string;
    tracks?: string[];
  };
};

type FieldType = {
  name?: string;
};

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

export const PlaylistModal: React.FC<Props> = ({
  IsModalOpen,
  setIsModalOpen,
  mode = 'create',
  playlist,
}) => {
  const [form] = Form.useForm<FieldType>();
  const queryClient = useQueryClient();

  const [items, setItems] = useState<any[]>([]);
  const [selectTracks, setSelectTracks] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState<string>('/images/def.png');
  const [loading, setLoading] = useState(false);

  const { data: tracks } = useTracks();
  const { data: user } = useQuery({ queryKey: ['user'], queryFn: getMe }) as any;

  const { refetchUser } = useAuth();
  const { refetchPlaylist } = usePlaylist();

    console.log(tracks)


  /* ---------- tracks ---------- */
  useEffect(() => {
    console.log(tracks)

    if (tracks) {
      setItems(
        tracks.map((item: any) => ({
          value: item.id,
          label: item.name,
        }))
      );
    }
  }, [tracks]);

useEffect(() => {
  console.log(playlist)

  if (mode !== 'edit') return;
  if (!playlist) return;
  if (!playlist.tracks || playlist.tracks.length === 0) return;

  form.setFieldsValue({ name: playlist.name });

  setSelectTracks(
    playlist.tracks.map((track: any) => track.id)
  );

  setImageUrl(playlist.imageUrl ?? '/images/def.png');
}, [mode, playlist?.tracks]);

  const handleCancel = () => setIsModalOpen?.(false);

  /* ---------- submit ---------- */
  const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
    if (!user) return;

    const payload = {
      userId: user.id,
      name: values.name ?? '',
      tracks: selectTracks,
      imageUrl,
    };

    if (mode === 'create') {
      await createPlaylist(payload);

    }

    if (mode === 'edit' && playlist?.id) {
      if (user) {
        await editPlaylist({
          id: playlist.id,
          userId: user.id,
          name: values.name ?? '',
          imageUrl,
          tracks: selectTracks,
        });

      }
    }

    queryClient.invalidateQueries({ queryKey: ['playlistId'] });
    refetchUser();
    refetchPlaylist();
    setIsModalOpen?.(false);
  };

  /* ---------- upload ---------- */
  const beforeUpload = (file: FileType) => {
    const isImage = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isImage) message.error('You can only upload JPG/PNG file!');
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) message.error('Image must smaller than 2MB!');
    return isImage && isLt2M;
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
      className="music-group__modal"
      title={mode === 'create' ? 'Create playlist' : 'Edit playlist'}
      open={IsModalOpen ?? false}
      onCancel={handleCancel}
      footer={false}
    >
      <Form
        form={form}
        name="basic"
        onFinish={onFinish}
        autoComplete="off"
        className="flex flex-col"
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
          rules={[{ required: true, message: 'Please input your playlist!' }]}
        >
          <Input />
        </Form.Item>

        <Space style={{ width: '100%' }} direction="vertical">
          <Select
            mode="multiple"
            allowClear
            style={{ width: '100%' }}
            placeholder="Add tracks to playlist"
            value={selectTracks}
            onChange={setSelectTracks}
            options={items}
          />
        </Space>

        <Form.Item style={{ marginTop: '20px' }}>
          <Button type="primary" htmlType="submit">
            {mode === 'create' ? 'Submit' : 'Save'}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default PlaylistModal;
