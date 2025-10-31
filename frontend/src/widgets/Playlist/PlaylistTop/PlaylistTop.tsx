'use client'

import Image from 'next/image'
import './PlaylistTop.scss'
import React from 'react'

type Props = {
    name: string,
}

export const PlaylistTop:React.FC<Props> = ({name}) => {
  return (
    <section className='playlist-top'>
        <Image className='playlist-top__image' src={'/images/def.png'} width={100} height={100} alt='poster' />

        <Image className='playlist-top__bg' height={128} width={128} src={'/images/def.png'} alt=''/>
        
        <div className='playlist-top__content'>
            <h2 className='playlist-top__title'>
                {name}
            </h2>
        </div>
    </section>
  )
}