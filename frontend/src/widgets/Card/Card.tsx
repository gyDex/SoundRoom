'use client'

import clsx from 'clsx';
import './Card.scss';
import Image from 'next/image';
import { FaPause, FaPlay } from 'react-icons/fa';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { playerStore } from '@/shared/stores/player';
import { getPlaylistByID } from '@/shared/hooks/usePlaylistById';

interface ICard {
    variation: 'album' | 'default',
    urlImage?: string,
    link?: string,
    name?: string,
    description?: string,
    subtitle: string;
    id: string
}

const Card: React.FC<ICard> = ({id, variation, urlImage, link, name, description, subtitle}) => {

    const [isPlay, setPlay] = useState(false);

    const router = useRouter();

    const { data, isLoading, error } = useQuery({
        queryKey: ['playlistId', id],
        queryFn: () => getPlaylistByID(id),
        enabled: !!id
    });

    return (
        <div onClick={() => {
            router.push(link ?? '')
        }} className={clsx('card', {
            ['card_large']: variation === 'album'
        })}>
            {
                variation === 'default' && <>
                    <Image className='card__image' height={128} width={128} src={urlImage ? urlImage : '/images/default2.png'} alt=''/>

                    <div className='card__content'>
                        <h2 className='card__title'>
                            {name}
                        </h2>

                        <span className='card__description'>
                            {description ?? ''}
                        </span>
                    </div>
                </>
            }

            {
                variation === 'album' && <>
                    <Image className='card__image' height={128} width={128} src={urlImage ? urlImage : '/images/default2.png'} alt=''/>

                    <div className='card__content card__content_large'>
                        {
                            (!isLoading && !error) && 
                            <button onClick={(e) => {
                                e.stopPropagation();
                                setPlay(prev => !prev)
                                playerStore.selectPlaylist(data.playlist, 0);

                                console.log(playerStore.currentPlaylist.id)
                                console.log(id)

                                if (playerStore.current?.id === id) {
                                    playerStore.togglePlay();
                                    playerStore.setCurrentTime(0);
                                    playerStore.changeIndexPlaylist(0, id);
                                }
                                else {    
                                    playerStore.pause();
                                    playerStore.reset();
                                    playerStore.selectPlay({
                                        album: '',
                                        file: '',
                                        audio: data.playlist.tracks[0].urlFile,
                                        group: data.playlist.tracks[0].artist,
                                        id: id,
                                        image: '/images/def.png',
                                        name: data.playlist.tracks[0].name,
                                    });
                                    playerStore.play();
                                }
                            }} className='card__player'>
                                {
                                    (playerStore.currentPlaylist && playerStore.IsPlay && playerStore.currentPlaylist.id === id) ?
                                    <FaPause color='black' />
                                    :
                                    <FaPlay color='black' />
                                }
                            </button>
                        }

                        <Image className='card__content-bg' height={128} width={128} src={urlImage ? urlImage : '/images/default2.png'} alt=''/>

                        <span className='card__subtitle'>
                            {subtitle}
                        </span>

                        <h2 className='card__title'>
                            {name}
                        </h2>

                        <span className='card__description'>
                            {description}
                        </span>
                    </div>
                </>
            }
        </div>
    )
}

export default Card
