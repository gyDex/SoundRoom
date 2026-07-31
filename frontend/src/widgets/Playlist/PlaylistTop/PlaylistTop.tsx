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
import DefaultCover from '@/widgets/DefaultCover/DefaultCover'
import FavouritesCover from '@/widgets/FavouritesCover/FavouritesCover'

type Props = {
    name: string,
    imageUrl?: string,
    isFavourites?: boolean,
    id: string,
    isActiveDeleteBtn?: boolean,
    tracks?: any
}

export const PlaylistTop:React.FC<Props> = ({name, tracks, imageUrl, id, isActiveDeleteBtn = true, isFavourites}) => {
  const router = useRouter();
  const queryClient = useQueryClient();

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
          { 
            (imageUrl && !isFavourites)  &&
            <div className={`playlist-top__img-wrapper`}>
              <Image className='card__image' height={128} width={128} src={imageUrl} alt=''/> 
            </div>
          }

          {
            (!imageUrl && !isFavourites) &&
            <div className={`playlist-top__img-wrapper`}>
              <DefaultCover /> 
            </div>
          }

          {
            (isFavourites) && 
            <div className={`playlist-top__img-wrapper`}>
              <FavouritesCover /> 
            </div>
          }

          <Image className='playlist-top__bg' height={128} width={128} src={imageUrl || ''} alt=''/>
          
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