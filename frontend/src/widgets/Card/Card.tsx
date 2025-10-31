'use client'

import clsx from 'clsx';
import './Card.scss';
import Image from 'next/image';
import { FaPause, FaPlay } from 'react-icons/fa';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface ICard {
    variation: 'album' | 'default',
    urlImage?: string,
    link?: string,
}

const Card: React.FC<ICard> = ({variation, urlImage, link}) => {

    const [isPlay, setPlay] = useState(false);

    const router = useRouter();

    return (
        <div onClick={() => router.push(link ?? '')} className={clsx('card', {
            ['card_large']: variation === 'album'
        })}>
            {
                variation === 'default' && <>
                    <Image className='card__image' height={128} width={128} src={urlImage ? urlImage : '/images/default2.png'} alt=''/>

                    <div className='card__content'>
                        <h2 className='card__title'>
                            Blood Sugar Sex Magik (Deluxe Edition)
                        </h2>

                        <span className='card__description'>
                            Red Hot Chili Peppers
                        </span>
                    </div>
                </>
            }

            {
                variation === 'album' && <>
                    <Image className='card__image' height={128} width={128} src={urlImage ? urlImage : '/images/default2.png'} alt=''/>

                    <div className='card__content card__content_large'>
                        <button onClick={() => setPlay(prev => !prev)} className='card__player'>
                            {
                                !isPlay ?
                                <FaPlay color='black' />
                                :
                                <FaPause color='black' />
                            }
                        </button>

                        <Image className='card__content-bg' height={128} width={128} src={urlImage ? urlImage : '/images/default2.png'} alt=''/>

                        <span className='card__subtitle'>
                            New For You
                        </span>

                        <h2 className='card__title'>
                            Blood Sugar Sex Magik (Deluxe Edition)
                        </h2>

                        <span className='card__description'>
                            Red Hot Chili Peppers
                        </span>
                    </div>
                </>
            }
        </div>
    )
}

export default Card
