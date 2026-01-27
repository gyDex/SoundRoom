import { loginWith2FA } from "@/shared/hooks/auth/loginWith2FA";
import { useAuth } from "@/shared/lib/graphql/useAuth";
import { Input } from "antd"
import { useState } from "react";

type Props = {
    savedEmail: string,
    twoFaToken: string,
}

export const TwoFactorForm:React.FC<Props> = ({savedEmail, twoFaToken}) => {
    
    const [code, setCode] = useState('');

    const { refetchUser } = useAuth();

    const [error, setError] = useState();

    const [isLoading, setLoading] = useState(false);



    const onSubmit = async () => {
        setLoading(true);
        await loginWith2FA({
            email: savedEmail,
            code,
            twoFaToken
        }).then(async(res) =>  {
            console.log(res)

            await refetchUser()
        }).catch((error: any) => {
            if (error.response?.errors?.[0]?.message) {
                setError(error.response.errors[0].message);
            }
        }).finally(() => { setLoading(false) })
    }
    
    return (
        <div className="auth__left">
            <h1 className="auth__title">Enter verification code</h1>

            <form>
                <span className="auth__description auth__description_login">
                    Enter the 6-digit code from your authenticator
                </span>

                <div className="auth__line" />

                <div className="otp-wrapper">
                    <Input.OTP
                        length={6}
                        value={code}
                        onChange={setCode}
                    />
                </div>

                <span className='text-rose-500 font-semibold text-[14px] mt-[10px] block'>{error}</span>

                <button disabled={isLoading} type="button" onClick={onSubmit} className="auth__btn auth__btn_create">
                    Login
                </button>
        </form>
        </div>
    )
}
