'use client'

import Image from 'next/image'
import './PlaylistItem.scss';
import '../PlaylistTop/PlaylistTop.scss';
import {useEffect, useRef, useState } from 'react'
import { FaPause, FaPlay } from 'react-icons/fa'
import { playerStore } from '@/shared/stores/player'
import { observer } from 'mobx-react-lite'
import { conversionToTime } from '@/features/ConversionToTime'
import { useRouter } from 'next/navigation'
import FavoriteButton from '@/widgets/FavoriteButton/FavoriteButton'
import { useSocket } from '@/shared/providers/SocketProvider'
import { useAuth } from '@/shared/lib/graphql/useAuth'
import DefaultCover from '@/widgets/DefaultCover/DefaultCover'
import { IoMdMore } from 'react-icons/io'

type Props = {
    id: string;
    name: string;
    order?: number,
    urlFile: string,
    duration: number,
    artist: string,
    createAt: Date,

    index: number,
    playlist: any[];
    imageUrl?: string,
}

export const PlaylistItem: React.FC<Props> = observer(({ imageUrl, playlist, index, id, name, urlFile, duration, artist, createAt  }) => {
    
    const [isHover, setHover] = useState(false);

    const socket = useSocket();
    const { user } = useAuth();

    const router = useRouter();

    const [isActiveSelect, setActiveSelect] = useState(false);

    const selectRef = useRef<HTMLDivElement>(null);
    const moreButtonRef = useRef<HTMLButtonElement>(null);

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        playerStore.selectPlaylist(playlist, index);

        if (playerStore.current?.id === id) {
            playerStore.togglePlay();
            playerStore.setCurrentTime(0);

            
            playerStore.changeIndexPlaylist(index, id);
            socket?.emit('change-track', {
                roomId: playerStore.roomId,
                userId: user.id,
                position: playerStore.progress,
                audio: playerStore.currentPlay,
            });

        } else {    
            playerStore.pause();
            playerStore.reset();
            playerStore.selectPlay({
                album: '',
                file: '',
                audio: urlFile,
                group: artist,
                id: id,
                image: '/images/def.png',
                name: name,
            });
            playerStore.play();

            socket?.emit('change-track', {
                roomId: playerStore.roomId,
                userId: user.id,
                position: playerStore.progress,
                audio: playerStore.currentPlay,
            });
        }
    }

    const handleClickBtnMore = (
        e: React.MouseEvent<HTMLButtonElement>
    ) => {
        e.stopPropagation();
        setActiveSelect(prev => !prev);
    };

useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
        const target = e.target as Node;

        if (
            selectRef.current?.contains(target) ||
            moreButtonRef.current?.contains(target)
        ) {
            return;
        }

        setActiveSelect(false);
    };

    document.addEventListener('mousedown', handleMouseDown);

    return () => {
        document.removeEventListener('mousedown', handleMouseDown);
    };
}, []);

    const isCurrentTrack = playerStore.current?.id === id;
    const showIcon = isHover || isCurrentTrack;
    const showPause = isCurrentTrack && playerStore.IsPlay;
    const showPlay = !showPause;

    return (
        <>
            <div 
                key={id}
                onClick={() => router.push(`/track/${id}`)}
                className='playlist-item'
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
            >
                <div onClick={handleClick}  className='playlist-item__image-wrap'>
                    <div className='playlist-item__image'>
                        { imageUrl ? 
                            <Image className='playlist-item__image' height={128} width={128} src={imageUrl} alt=''/> 
                            :
                            <DefaultCover sizeIcon='32' /> 
                        }
                    </div>
                    
                    {showIcon && (
                        <div className='playlist-item__hover'>
                            {showPause && <FaPause className='playlist-item__play' color='white' />}
                            {showPlay && <FaPlay className='playlist-item__play' color='white' />}
                        </div>
                    )}
                </div>

                <div className='playlist-item__text-wrap'>
                    <span className='playlist-item__title'>{name}</span>
                    <span className='playlist-item__group'>{artist}</span>
                </div>

                <span className='playlist-item__time'>{conversionToTime(duration)}</span>
                <span className='playlist-item__album'>Album</span>

                <div className="playlist-item__favorite">
                    <FavoriteButton id={id} />
                </div>

                <span className='playlist-item__date'>{`${createAt.toLocaleDateString()}`}</span>

                <button ref={moreButtonRef} onClick={handleClickBtnMore} className='playlist-item__btn-more'>
                    <IoMdMore size={32} />
                </button>
            </div>
            
             {isActiveSelect && (
                <div ref={selectRef} className="rounded-[8px] mt-[10px] p-[3px] right-[15px] bg-black/50 fixed
                backdrop-filter">
                    <ul>
                        <li
                            className="flex gap-[10px] items-center  hover:bg-white/5 px-[12px] py-[8px] rounded-[8px]"
                        >
                            <FavoriteButton style={{
                                width: '100%',
                                display: 'flex',
                                justifyContent: 'flex-start',
                                gap: '20px'
                            }} 
                            id={id}
                            title='Add in Favorite' />
                        </li>
                    </ul>
                </div>
                )}
        </>
    );
})