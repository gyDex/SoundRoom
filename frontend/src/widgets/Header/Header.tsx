'use client'

import { MdArrowBackIosNew, MdArrowForwardIos } from 'react-icons/md'
import { Searcher } from '../Searcher/Searcher'
import './Header.scss'
import { useRouter } from 'next/navigation'

export const Header = () => {
    const router = useRouter()

    return (
        <header className='header'>
            <div className='header__wrapper'>
                <div className='header__left'>
                    <button onClick={() => router.back()} className='header__btn'>
                        <MdArrowBackIosNew color='white' />
                    </button>

                    <button  onClick={() => router.forward()} className='header__btn'>
                        <MdArrowForwardIos color='white' />
                    </button>
                </div>

                <div className='header__right'>
                    <Searcher />
                </div>
            </div>
        </header>
    )
}
