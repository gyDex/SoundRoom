'use client'

import './auth.scss'
import Image from 'next/image'
import { useState } from 'react'
import { LoginForm } from '@/widgets/Login/LoginForm'
import { TwoFactorForm } from '@/widgets/Login/TwoFactorForm'

export const LoginPage = () => {

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const [email, setEmail] = useState('');

  const [twoFaToken, setTwoFaToken] = useState('');

  return (
    <div className='auth'>
      <div className='auth__wrapper auth__wrapper_login'>
        {
            twoFactorEnabled ? <TwoFactorForm twoFaToken={twoFaToken} savedEmail={email} /> : <LoginForm setTwoFaToken={setTwoFaToken} setEmail={setEmail} setTwoFactorEnabled={setTwoFactorEnabled} />
        }
        <div className='auth__right'>
          <Image 
            className='auth__image' 
            src={'/images/login.jpg'} 
            quality={100} 
            height={1500} 
            width={1500} 
            alt='Login'
          />
        </div>
      </div>
    </div>
  )
}