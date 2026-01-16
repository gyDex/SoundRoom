'use client'

import { ChangeEvent, ChangeEventHandler, FormEvent, InputHTMLAttributes, useState } from 'react'
import './AddFriends.scss'
import { useAuth } from '@/shared/lib/graphql/useAuth';
import { sendFriendRequest } from '@/shared/hooks/friends/sendFriendRequest';

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
        <span className='add-friends__title'>Ваш тэг для дружбы</span>

        <div className='add-friends__panel'>
            <span className='add-friends__panel-text'>{user?.username ?? ''}#{user?.tag ?? ''}</span>

            <button onClick={handleCopyTag} className='add-friends__panel-btn'>КОПИРОВАТЬ</button>
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
