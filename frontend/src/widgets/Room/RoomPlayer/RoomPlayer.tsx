import Image from 'next/image'
import './RoomPlayer.scss'
import { useState } from 'react'
import { playerStore } from '@/shared/stores/player'
import { observer } from 'mobx-react-lite'

interface RoomPlayerProps {
    name?: string
    artist?: string
    imageUrl?: string
    isPlaying?: boolean
    progress?: number
    variant?: 'default' | 'small' | 'large'
}

export const RoomPlayer = observer(({ 
    name = 'Название трека', 
    artist = 'Исполнитель', 
    imageUrl = '/images/def.png',
    isPlaying = true,
    progress = 45,
    variant = 'default'
}: RoomPlayerProps) => {
    
    const playerClass = `room-player ${playerStore.isPlay ? 'playing' : 'paused'} ${variant !== 'default' ? `room-player--${variant}` : ''}`

    return (
        <div className={playerClass}>
            <div className='room-player__album-art'>
                <div className='album-image'>
                    <Image 
                        src={imageUrl} 
                        fill
                        alt={`${name} - ${artist}`}
                        sizes="100px"
                        priority
                    />
                </div>
            </div>
            
            <div className='room-player__content'>
                <span className='room-player__name' title={name}>{name}</span>
                <span className='room-player__artist' title={artist}>{artist}</span>
                
                <div className='room-player__progress'>
                    <div 
                        className='room-player__progress-fill' 
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
            </div>
        </div>
    )
})