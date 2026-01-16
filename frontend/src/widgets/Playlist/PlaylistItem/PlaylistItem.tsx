'use client'

import Image from 'next/image'
import './PlaylistItem.scss'
import {useState } from 'react'
import { FaPause, FaPlay } from 'react-icons/fa'
import { playerStore } from '@/shared/stores/player'
import { observer } from 'mobx-react-lite'
import { conversionToTime } from '@/features/ConversionToTime'
import { useRouter } from 'next/navigation'
import FavoriteButton from '@/widgets/FavoriteButton/FavoriteButton'
import { useFavTracks } from '@/shared/hooks/useFavTracks'
import { useSocket } from '@/shared/providers/SocketProvider'
import { useAuth } from '@/shared/lib/graphql/useAuth'

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
}

export const PlaylistItem: React.FC<Props> = observer(({ playlist, index, id, name, urlFile, duration, artist, createAt  }) => {
    
    const [isHover, setHover] = useState(false);

    const socket = useSocket();
    const { user } = useAuth();

    const router = useRouter();

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

    const isCurrentTrack = playerStore.current?.id === id;
    const showIcon = isHover || isCurrentTrack;
    const showPause = isCurrentTrack && playerStore.IsPlay;
    const showPlay = !showPause;

    return (
        <div 
            key={id}
            onClick={() => router.push(`/track/${id}`)}
            className='playlist-item'
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            <div onClick={handleClick}  className='playlist-item__image-wrap'>
                <Image 
                    className='playlist-item__image' 
                    src={'/images/def.png'} 
                    width={100} 
                    height={100} 
                    alt='poster' 
                />
                
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

            <FavoriteButton id={id} />
            <span className='playlist-item__date'>{`${createAt.toLocaleDateString()}`}</span>
        </div>
    );
})