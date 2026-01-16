'use client'

import Image from 'next/image'
import './PlaylistTop.scss'
import React from 'react'
import { MdDelete } from 'react-icons/md'
import { deletePlaylist } from '@/shared/hooks/playlist/deletePlaylist'
import { useRouter } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'

type Props = {
    name: string,
    imageUrl: string,
    id: string,
    isActiveDeleteBtn: boolean,
}

export const PlaylistTop:React.FC<Props> = ({name, imageUrl, id, isActiveDeleteBtn = true}) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  
  const handleClick = async() => {
    await deletePlaylist({ playlistId: id });

    queryClient.invalidateQueries({ queryKey: ['playlists'] });
    queryClient.invalidateQueries({ queryKey: ['playlist', id] });

    router.push('/');
  }

  return (
    <section className='playlist-top'>
        <Image className='playlist-top__image' src={imageUrl ?? '/images/def.png'} width={100} height={100} alt='poster' />

        <Image className='playlist-top__bg' height={128} width={128} src={imageUrl ??'/images/def.png'} alt=''/>
        
        <div className='playlist-top__content'>
            <h2 className='playlist-top__title'>
                {name}
            </h2>

            {
              isActiveDeleteBtn &&
              <button onClick={handleClick} className='playlist-top__btn-delete'>
                  <MdDelete color='white' size={32} />

                  <span className='playlist-top__btn-text'>Delete</span>
              </button>
            }
        </div>
    </section>
  )
}