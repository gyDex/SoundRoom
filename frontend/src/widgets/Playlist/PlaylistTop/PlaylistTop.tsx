'use client'

import Image from 'next/image'
import './PlaylistTop.scss'
import React, { useState } from 'react'
import { MdDelete, MdModeEditOutline, MdMore } from 'react-icons/md'
import { deletePlaylist } from '@/shared/hooks/playlist/deletePlaylist'
import { useRouter } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import PlaylistModal from '@/widgets/Modals/PlaylistModal'
import { Select } from '@/widgets/Select/Select'
import { useAuth } from '@/shared/lib/graphql/useAuth'

type Props = {
    name: string,
    imageUrl: string,
    id: string,
    isActiveDeleteBtn?: boolean,
    tracks?: any
}

export const PlaylistTop:React.FC<Props> = ({name, tracks, imageUrl, id, isActiveDeleteBtn = true}) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { user } = useAuth();

  const [IsModalOpen, setIsModalOpen] = useState(false);

  const onDelete = async() => {
    await deletePlaylist({ playlistId: id });

    queryClient.invalidateQueries({ queryKey: ['playlists'] });
    queryClient.invalidateQueries({ queryKey: ['playlist', id] });

    router.push('/');
  }

  return (
    <>
      <PlaylistModal mode='edit' IsModalOpen={IsModalOpen} playlist={{
        id,
        name,
        tracks
      }}
      setIsModalOpen={setIsModalOpen} />
      
      <section className='playlist-top'>
          <Image className='playlist-top__image' src={imageUrl ?? '/images/def.png'} width={100} height={100} alt='poster' />

          <Image className='playlist-top__bg' height={128} width={128} src={imageUrl ??'/images/def.png'} alt=''/>
          
          <div className='playlist-top__content'>
              <h2 className='playlist-top__title'>
                  {name}
              </h2>

              {
                isActiveDeleteBtn &&
                <div className='relative z-[10]'>
                  <Select classNameBtn={'playlist-top__btn-delete'} items={[
                    {
                      Icon: MdDelete,
                      name: 'Delete playlist',
                      onClick: onDelete
                    },
                    {
                      Icon: MdModeEditOutline,
                      name: 'Edit playlist',
                      onClick: () => setIsModalOpen(true)
                    }
                  ]} 
                  />
                        
                </div>
              }
          </div>
      </section>
    </>
  )
}