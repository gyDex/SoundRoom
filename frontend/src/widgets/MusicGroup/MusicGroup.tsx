'use client'

import { Suspense, useRef } from 'react';
import './MusicGroup.scss'
import { MdArrowBackIosNew, MdArrowForwardIos } from 'react-icons/md';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import { Splide as SplideCore } from '@splidejs/splide';
import Card from '../Card/Card';
import { FaPlus } from 'react-icons/fa';
import CreateModalPlaylist from '../Modals/CreateModalPlaylist';
import Loader from '../Loader/Loader';

type Props = {
    items: IGroup[],
    nameGroup: string,

    variation: 'album' | 'default',

    IsAddPlaylist?: Boolean,

    IsModalOpen?: boolean,

    setIsModalOpen?: (value: boolean) => void;

    subtitle: string,
}

const MusicGroup:React.FC<Props> = ({setIsModalOpen,variation, IsModalOpen, items, nameGroup, IsAddPlaylist, subtitle}) => {
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
            <CreateModalPlaylist IsModalOpen={IsModalOpen} setIsModalOpen={setIsModalOpen} />

            <div className='music-group__top'>
                <h1 className='music-group__title'>
                    {nameGroup}

                    {IsAddPlaylist && 
                        <button onClick={() => setIsModalOpen?.(true)} className=' music-group__btn-add'>
                            <FaPlus size={16} color='white'  />
                        </button>
                    }
                </h1>

                <div className='music-group__right'>
                    <button className='music-group__btn'  onClick={goPrev}>
                        <MdArrowBackIosNew color='white' />
                    </button>

                    <button className='music-group__btn'  onClick={goNext}>
                        <MdArrowForwardIos color='white' />
                    </button>
                </div>
            </div>

            <div className='music-group__content'>
                <Suspense name='music-group' fallback={<Loader />}>
                    <Splide onMounted={(splide: any) => {
                        splideRef.current = splide;
                    }} options={optionsSlider} className={'w-full'} aria-label="Album">
                        {
                            items && items !== null && items.map((item) =>
                                <SplideSlide key={item.id} className={'shrink-0'}>      
                                    <Card id={item.id} subtitle={subtitle} name={item.name} link={item.link} urlImage={item.urlImage} variation={variation}/>            
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
