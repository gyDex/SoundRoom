'use client'

import '@splidejs/react-splide/css';

import '@splidejs/react-splide/css/skyblue';
import '@splidejs/react-splide/css/sea-green';

import '@splidejs/react-splide/css/core';

import { IAlbum } from '@/entities/types/IAlbum'
import './Albums.scss'
import React, { Suspense, useRef } from 'react'
import Card from '../Card/Card'
import { Splide, SplideSlide } from '@splidejs/react-splide';
import { Splide as SplideCore } from '@splidejs/splide';
import { MdArrowBackIosNew, MdArrowForwardIos } from 'react-icons/md';
import Loader from '../Loader/Loader';

type Props = {
    albums: IAlbum[],
    nameAlbums: string,
}

export const Albums:React.FC<Props> = ({albums, nameAlbums}) => {

    const splideRef = useRef<SplideCore | null>(null);

    const optionsSlider = {
        type: 'slide',
        perPage: 5,
        gap: '20px',
        arrows: false,
        breakpoints: {
            1600: {
                perPage: 4, 
            },
            1440: {
                perPage: 3, 
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
        <section className='albums'>
            <div className='albums__top'>
                <h1 className='albums__title'>
                    {nameAlbums}
                </h1>

                <div className='albums__right'>
                    <button className='albums__btn'  onClick={goPrev}>
                        <MdArrowBackIosNew color='white' />
                    </button>

                    <button className='albums__btn'  onClick={goNext}>
                        <MdArrowForwardIos color='white' />
                    </button>
                </div>
            </div>

            <div className='albums__content'>
                <Suspense name='album' fallback={<Loader />}>
                    <Splide onMounted={(splide: any) => {
                        splideRef.current = splide;
                    }} options={optionsSlider} className={'w-full'} aria-label="Album">
                        {
                            albums && albums !== null && albums.map((item) =>
                                <SplideSlide key={item.id} className={'shrink-0'}>
                                    <Card link={item.link} urlImage={item.ulrImage} variation='album'/>            
                                </SplideSlide> 
                            )
                        }
                    </Splide>
                </Suspense>
            </div>
        </section>
    )
}