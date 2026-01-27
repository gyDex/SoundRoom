import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema } from '@/entities/schema/loginSchema'
import { z } from 'zod'
import Link from 'next/link'
import { MdEmail } from 'react-icons/md'
import { useAuth } from '@/shared/lib/graphql/useAuth'
import { GoogleLoginButton } from '@/widgets/auth/GoogleLoginButton'
import { useRouter } from 'next/navigation'

import { InputAuth } from '@/shared/compontents/InputAuth/InputAuth'
import { login } from '@/shared/hooks/auth/login'

type FormSchema = z.infer<typeof loginSchema>

type Props = {
    setTwoFactorEnabled: (value: boolean) => void;
    setEmail: (value: string) => void;
    setTwoFaToken: (value: string) => void;
}

export const LoginForm:React.FC<Props> = ({ setTwoFactorEnabled, setEmail, setTwoFaToken }) => {
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
    mode: 'onSubmit',
  })

  const router = useRouter()
  const { refetchUser } = useAuth()

  const onSubmit = async (data: FormSchema) => {
    const res = await login({
      email: data.email,
      password: data.password,
    })

    console.log(res)

    setEmail(data.email)

    setTwoFaToken(res.twoFaToken)

    if (res?.twoFactorRequired) {
      setTwoFactorEnabled(true)
      return
    }

    await refetchUser()
    router.push('/')
    reset()
  }

  return (
    <div className="auth__left">
      <h1 className="auth__title">Login</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <InputAuth
          type="email"
          placeholder="Email"
          Icon={MdEmail}
          register={register('email')}
          errors={errors.email}
        />

        <InputAuth
          type="password"
          placeholder="Password"
          Icon={MdEmail}
          register={register('password')}
          errors={errors.password}
        />

        <button type="submit" className="auth__btn auth__btn_create">
          Login
        </button>

        <span className="auth__description auth__description_login">
          Don't have an account?

          <Link className="auth__link" href="/sign-up">
            Create account
          </Link>
        </span>

        <div className="auth__line" />

        <GoogleLoginButton />
      </form>
    </div>
  )
}
