import Image from 'next/image'
import React from 'react'

import './TrackTop.scss'
import { playerStore } from '@/shared/stores/player'
import { FaPause, FaPlay } from 'react-icons/fa'
import { observer } from 'mobx-react-lite'
import Link from 'next/link'
import { DateUtils } from '@/shared/classes/DateUtils'
import FavoriteButton from '@/widgets/FavoriteButton/FavoriteButton'

type Props = {
    name: string,
    imageUrl: string,
    description: string,

    data: any,
}

const TrackTop:React.FC<Props> = observer(({data, name, imageUrl, description}) => {
    console.log(data)

  return (
    <section className='track-top'>
        <Image className='track-top__image' src={imageUrl ?? '/images/def.png'} width={100} height={100} alt='poster' />

        <Image className='track-top__bg' height={128} width={128} src={imageUrl ??'/images/def.png'} alt=''/>
        
        <div className='track-top__content'>
            <div className='track-top__top'>
                <div style={{
                    display:'flex',
                    gap:'10px'
                }}>
                    <Link href={`/artist/${data.artist_id}`} className='track-top__artist'>{data.artist}</Link>
                    · 
                    <span style={{
                        color: 'white'
                    }}>{DateUtils.isoToDate(data.created_at).toLocaleDateString().split('.')[2]}</span> 
                </div>
                 
                <h2 className='track-top__title'>
                    {name}
                </h2>


                <span className='track-top__description'>
                    {description ?? 'У трека отсутствует описание'}
                </span>
            </div>

            <div className='track-top__bottom'>
                <button onClick={(e) => {
                    e.stopPropagation();

                    console.log(playerStore.currentPlay?.id === data.id)
                    console.log(playerStore.IsPlay)

                    if (playerStore.currentPlay?.id === data.id) {
                        playerStore.togglePlay();
                        playerStore.setCurrentTime(0);
                        playerStore.changeIndexPlaylist(0, data.id);
                    }
                    else {    
                        playerStore.pause();
                        playerStore.reset();
                        playerStore.selectPlay({
                            album: '',
                            file: '',
                            audio: data.urlFile,
                            group: data.artist,
                            id: data.id,
                            image: '/images/def.png',
                            name: data.name,
                        });
                        playerStore.play();
                    }
                }} className='card__player track-top__player'>
                    {
                        (playerStore.IsPlay && playerStore.currentPlay?.id === data.id) ?
                        <FaPause color='black' />
                        :
                        <FaPlay color='black' />
                    }
                </button>

                <FavoriteButton id={data.id} />
            </div>
        </div>

    </section>
  )
})

export default TrackTop
