'use client'

import { IoSearchSharp } from 'react-icons/io5'
import './Searcher.scss'
import { InputHTMLAttributes, useRef } from 'react'

export const Searcher = () => {
    const inputRef = useRef<HTMLInputElement | null>(null);

    const handleClick = () => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }
    
    return (
        <div onClick={handleClick} className='searcher'>
            <IoSearchSharp size={18} color='white' className='shrink-0' />

            <input placeholder='Search' ref={inputRef} className='searcher__input' type="text" />
        </div>
    )
}