'use client';

import { usePlaylist } from '@/shared/lib/graphql/usePlaylist';
import Loader from '@/widgets/Loader/Loader';
import MusicGroup from '@/widgets/MusicGroup/MusicGroup';
import { useState } from 'react';

export const HomePage = () => {
  const [isModalOpen, setModalOpen] = useState(false);

  const {
    userLoading,
    userError,
    playlistsByUser,
    userId,
  } = usePlaylist();

  if (userLoading) {
    return     <Loader />;
  }

  if (userError) {
    return <div>Ошибка загрузки данных</div>;
  }

  if (!userId) {
    return <div>Пожалуйста, войдите в систему</div>;
  }

  const playlistsForMusicGroup = playlistsByUser && playlistsByUser.map((p: any) => ({
    id: p.id,
    name: p.name,
    urlImage: p.imageUrl || '',
    link: `/playlist/${p.id}`,
  }));

  return (
    <MusicGroup
      subtitle="Your Playlist"
      variation="album"
      IsModalOpen={isModalOpen}
      setIsModalOpen={setModalOpen}
      IsAddPlaylist
      nameGroup="Твои плейлисты"
      items={playlistsForMusicGroup}
    />
  );
};
