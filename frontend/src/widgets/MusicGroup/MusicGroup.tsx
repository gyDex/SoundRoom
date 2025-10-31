'use client'

import { Suspense, useRef } from 'react';
import './MusicGroup.scss'
import { MdArrowBackIosNew, MdArrowForwardIos } from 'react-icons/md';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import { Splide as SplideCore } from '@splidejs/splide';
import Card from '../Card/Card';

type Props = {
    tracks: IGroup[],
    nameGroup: string,
}

const MusicGroup:React.FC<Props> = ({tracks, nameGroup}) => {
    const splideRef = useRef<SplideCore | null>(null);

    const optionsSlider = {
        type: 'slide',
        perPage: 5,
        gap: '5px',
        arrows: false,
        breakpoints: {
            1600: {
                perPage: 5, 
            },
            1440: {
                perPage: 4, 
            },
            1200: {
                perPage: 3,
            },
            992: {
                perPage: 3,
            },
            768: {
                perPage: 3, 
            },
            576: {
                perPage: 2, 
            },
            375: {
                perPage: 1,
            },
            0: {
                perPage: 1,
            }
        },
    };

    const goNext = () => {
        if (splideRef.current) {
            splideRef.current.go('+1');
        }
    };

    const goPrev = () => {
        if (splideRef.current) {
            splideRef.current.go('-1');
        }
    };


    return (
        <section className='music-group'>
            <div className='music-group__top'>
                <h1 className='music-group__title'>
                    {nameGroup}
                </h1>

                <div className='music-group__right'>
                    <button className='music-group__btn'  onClick={goPrev}>
                        <MdArrowBackIosNew />
                    </button>

                    <button className='music-group__btn'  onClick={goNext}>
                        <MdArrowForwardIos />
                    </button>
                </div>
            </div>

            <div className='music-group__content'>
                <Suspense name='music-group' fallback={<>Loading...</>}>
                    <Splide onMounted={(splide: any) => {
                        splideRef.current = splide;
                    }} options={optionsSlider} className={'w-full'} aria-label="Album">
                        {
                            tracks && tracks !== null && tracks.map((item) =>
                                <SplideSlide key={item.id} className={'shrink-0'}>
                                    <Card link={item.link} urlImage={item.ulrImage} variation='default'/>            
                                </SplideSlide> 
                            )
                        }
                    </Splide>
                </Suspense>
            </div>
        </section>
    )
}

export default MusicGroup
