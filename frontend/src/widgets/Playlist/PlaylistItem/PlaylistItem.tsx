'use client'

import Image from 'next/image'
import './PlaylistItem.scss'
import { useState } from 'react'
import { FaPause, FaPlay } from 'react-icons/fa'
import { playerStore } from '@/shared/stores/player'
import { observer } from 'mobx-react-lite'

type Props = {
    id: string;
    name: string;
}

export const PlaylistItem: React.FC<Props> = observer(({ id, name }) => {
    const [isHover, setHover] = useState(false);

    const handleClick = () => {
        if (playerStore.current?.id === id) {
            playerStore.togglePlay();
            playerStore.setCurrentTime(0);

        } else {    
            playerStore.pause();
            playerStore.reset();
            playerStore.selectPlay({
                album: '',
                file: '',
                audio: '/mock/music.mp3',
                group: 'Group 1',
                id: id,
                image: '/images/def.png',
                name: name,
            });
            playerStore.play();

            console.log(playerStore)
        }
    }

    const isCurrentTrack = playerStore.current?.id === id;
    const showIcon = isHover || isCurrentTrack;
    const showPause = isCurrentTrack && playerStore.IsPlay;
    const showPlay = !showPause;

    return (
        <div 
            onClick={handleClick} 
            className='playlist-item'
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            <div className='playlist-item__image-wrap'>
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
                <span className='playlist-item__group'>Group 1</span>
            </div>

            <span className='playlist-item__date'>Nov 4, 2023</span>
            <span className='playlist-item__album'>Album</span>
            <span className='playlist-item__time'>2:00</span>
        </div>
    );
})