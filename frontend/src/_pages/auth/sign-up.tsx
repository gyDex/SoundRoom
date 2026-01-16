'use client'

import { useForm } from 'react-hook-form'
import './auth.scss'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema } from '@/entities/schema/loginSchema'
import z from 'zod'
import Image from 'next/image'
import { FaUserAlt } from 'react-icons/fa'
import { FcGoogle } from "react-icons/fc";
import { InputAuth } from '@/shared/compontents/InputAuth/InputAuth'
import Link from 'next/link'
import { MdEmail } from 'react-icons/md'
import { TbLockPassword } from "react-icons/tb";
import { GiConfirmed } from "react-icons/gi";
import { signupSchema } from '@/entities/schema/signUpSchema'
import { signup } from '@/shared/hooks/auth/signup'
import { GoogleLoginButton } from '@/widgets/auth/GoogleLoginButton'

type FormSchema = z.infer<typeof signupSchema>

export const SignUpPage = () => {
  const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormSchema>({resolver: zodResolver(signupSchema), defaultValues: {
      confirmPassword: '',
      email:'',
      password: '',
      username: ''
    }})

    const onSubmit = async({email, password, username} : any) => {
      await signup({email, password, username})
      // reset();

    }

    return (
        <div className='auth'>
            <div className='auth__wrapper'>
                <div className='auth__right'>
                    <Image className='auth__image auth__image_signup' src={'/images/signup.jpg'} quality={100} height={1500} 
                    width={1500} alt=''/>
                </div>
                <div className='auth__left'>
                    <h1 className='auth__title'>Create an account</h1>

                    <span className='auth__description'>
                        Already have an account.
                        <Link className='auth__link' href={'/login'}>Log in</Link>
                    </span>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <InputAuth errors={errors.username} register={register('username')} placeholder='Username' Icon={FaUserAlt} />

                        <InputAuth type='email' errors={errors.email} register={register('email')} placeholder='Email' Icon={MdEmail} />

                        <InputAuth  type='password' errors={errors.password} register={register('password')} placeholder='Password' Icon={TbLockPassword} />

                        <InputAuth type='password' errors={errors.confirmPassword} register={register('confirmPassword')} placeholder='Confirm password' Icon={GiConfirmed} />

                        <button className='auth__btn auth__btn_create'>
                            Create account
                        </button>

                        <div className='auth__line' />  

                        <GoogleLoginButton />    
                        

                        {/* <button className='auth__btn auth__btn_social'>
                          <FcGoogle size={25} /> Continue with Google
                        </button> */}
                    </form>
                </div>
            </div>
        </div>
    )
}
