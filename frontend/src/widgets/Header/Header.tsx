'use client'

import './Header.scss';
import { MdArrowBackIosNew, MdArrowForwardIos } from 'react-icons/md';
import { Searcher } from '../Searcher/Searcher';
import { useRouter } from 'next/navigation';
import SwitchLanguages from '../SwitchLanguages/SwitchLanguages';
import { RxHamburgerMenu } from 'react-icons/rx';
import { mobileMenuStore } from '@/shared/stores/mobile-menu.store';
import { observer } from 'mobx-react-lite';

export const Header = observer(() => {
    const router = useRouter()

    return (
        <header className='header'>
            <div className='header__wrapper'>
                <div className='header__left'>
                    <button onClick={() => router.back()} className='header__btn header__btn_arrow'>
                        <MdArrowBackIosNew color='white' />
                    </button>

                    <button  onClick={() => router.forward()} className='header__btn header__btn_arrow'>
                        <MdArrowForwardIos color='white' />
                    </button>

                    <button  onClick={() => {mobileMenuStore.toggleMenu()}} className='header__btn header__btn_menu'>
                        <RxHamburgerMenu  color='white' />
                    </button>

                    <SwitchLanguages />
                </div>

                <div className='header__right'>
                    <Searcher />
                </div>
            </div>
        </header>
    )
})
