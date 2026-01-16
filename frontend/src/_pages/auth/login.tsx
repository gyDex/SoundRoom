'use client'

import { useForm } from 'react-hook-form'
import './auth.scss'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema } from '@/entities/schema/loginSchema'
import { z } from 'zod'
import Image from 'next/image'
import { FcGoogle } from "react-icons/fc";
import { InputAuth } from '@/shared/compontents/InputAuth/InputAuth'
import Link from 'next/link'
import { MdEmail } from 'react-icons/md'
import { login } from '@/shared/hooks/auth/login'
import { useAuth } from '@/shared/lib/graphql/useAuth'
import { GoogleLoginButton } from '@/widgets/auth/GoogleLoginButton'
import { useRouter } from 'next/navigation'

type FormSchema = z.infer<typeof loginSchema>

export const LoginPage = () => {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<FormSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onSubmit'
  })

  const router = useRouter();

  const { refetchUser  } = useAuth();

  const onSubmit = async(data: FormSchema) => {
    await login({email: data.email, password: data.password})
    await refetchUser();
    router.push('/')
    reset();
  }

  return (
    <div className='auth'>
      <div className='auth__wrapper auth__wrapper_login'>
        <div className='auth__left'>
          <h1 className='auth__title'>Login</h1>

          <form onSubmit={handleSubmit(onSubmit)}>
            <InputAuth type='email' errors={errors.email} register={register('email')} placeholder='Email' Icon={MdEmail} />

            <InputAuth 
              errors={errors.password} 
              register={register('password')} 
              placeholder='Password' 
              Icon={MdEmail} 
              type="password"
            />

            <button type="submit" className='auth__btn auth__btn_create'>
              Login
            </button>

            <span className='auth__description auth__description_login'>
              Don't have an account?
              <Link className='auth__link' href={'/sign-up'}>Create account</Link>
            </span>

            <div className='auth__line' />                
            
            <GoogleLoginButton />    

            {/* <button type="button" className='auth__btn auth__btn_social'>
              <FcGoogle color='white' size={25} /> Continue with Google
            </button> */}
          </form>
        </div>
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