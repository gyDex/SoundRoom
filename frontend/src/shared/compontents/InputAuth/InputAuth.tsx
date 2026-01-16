'use client'

import React, { InputHTMLAttributes, useRef, useState } from 'react'
import './InputAuth.scss'
import { FieldError, FieldErrors } from 'react-hook-form'
import { FaEye, FaEyeSlash } from 'react-icons/fa'

type Props = {
  Icon: any,
  placeholder?: string,
  register: any,
  errors?: FieldError,
  type?: React.HTMLInputTypeAttribute
}

export const InputAuth: React.FC<Props> = ({
  type = 'text', 
  errors, 
  register, 
  Icon, 
  placeholder
}) => {
  const ref = useRef<HTMLInputElement>(null);

  const [isShow, setShow] = useState(false);

  const handleClick = () => {
    ref.current?.focus();
  }

  return (
    <>
      <div onClick={handleClick} className='input-item'>
        <Icon  color='white' size={18} style={{flexShrink: 0}} />
        <input
          {...register}
          placeholder={placeholder}
          ref={(e) => {
            if (e) {
              ref.current = e
            }
            if (register && register.ref) {
              register.ref(e)
            }
          }}
          type={isShow ? 'text' : type}
          className='input'
        />

        {
            type === 'password' && <button onClick={() => setShow(prev => !prev)}> 
                { 
                    !isShow ? <FaEye  color='white' /> : <FaEyeSlash  color='white' />
                }
            </button>
        }
      </div>
      {errors && (
        <span className='input__errors'>
          {errors.message}
        </span>
      )}
    </>
  )
}