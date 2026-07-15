'use client'

import { ChangeEvent, ChangeEventHandler, FormEvent, InputHTMLAttributes, useState } from 'react'
import './AddFriends.scss'
import { useAuth } from '@/shared/lib/graphql/useAuth';
import { sendFriendRequest } from '@/shared/hooks/friends/sendFriendRequest';
import { QRCode } from 'antd';
import Image from 'next/image';

export const AddFriends = () => {
  const [inputTag, setInputTag] = useState('');
  const [error, setError] = useState('');

  const { user } = useAuth();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setInputTag(e.target.value);
  }

  const handleSubmit = async(e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      try {
        await sendFriendRequest({tag: inputTag})
      } 
      catch (error: any) {
        if (error.response?.errors?.[0]?.message) {
          setError(error.response.errors[0].message);
        } else {
          setError('Не удалось отправить запрос. Попробуйте еще раз.');
        }
      }
  }

  const handleCopyTag = (): void => {
    if (user?.username && user?.tag) {
      const fullTag = `${user.username}#${user.tag}`;
      navigator.clipboard.writeText(fullTag)
        .then(() => {
          alert('Тэг скопирован в буфер обмена');
        })
        .catch(err => {
          console.error('Ошибка при копировании:', err);
        });
    }
  }

  return (
    <div className='add-friends'>
      <div className='add-friends__content'>

        <div className='add-friends__panel'>
            <div className='add-friends__panel-top'>
              <Image className='add-friends__panel-avatar' src={'/images/def2.png'} alt='' height={80} width={80} />
              <QRCode
                bordered={false}
                errorLevel="H"
                value={`${user?.username ?? ''}#{user?.tag ?? ''}`}
                icon="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
              />
            </div>
            <div className='add-friends__panel-bottom'>
              <Image className='add-friends__panel-avatar' src={'/images/def2.png'} alt='' height={80} width={80} />

              <QRCode
                bordered={false}
                errorLevel="H"
                value={`${user?.username ?? ''}#{user?.tag ?? ''}`}
                icon="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
              />

              <span className='add-friends__panel-text'>{user?.username ?? 'user'}#{user?.tag ?? '1234'}</span>

              <button onClick={handleCopyTag} className='add-friends__panel-btn'>Копировать тег</button>
            </div>
        </div>

        <span className='add-friends__description'>Введите код дружбы того, кому хотите отправить приглашение.</span>

        <form onSubmit={handleSubmit} className='add-friends__search'>
          <input required onChange={handleInputChange} value={inputTag} placeholder='Введите тэг друга' className='add-friends__search-input' />

          <button className='add-friends__search-btn'>ОТПРАВИТЬ</button>
        </form>
        <span className='text-rose-500 font-semibold text-[14px]'>{error}</span>
      </div>
    </div>
  )
}

export default AddFriends
