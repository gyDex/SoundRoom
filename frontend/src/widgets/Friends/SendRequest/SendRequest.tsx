'use client'

import { applyFriendRequest } from "@/shared/hooks/friends/applyFriendRequest"
import { rejectFriendRequest } from "@/shared/hooks/friends/rejectFriendRequest"
import { useFriendRequests } from "@/shared/hooks/useFriendRequests"
import { useQueryClient } from "@tanstack/react-query"
import { MenuProps } from "antd"
import Image from "next/image"
import { useEffect, useState } from "react"

export const SendRequest = () => {
    const items: MenuProps['items'] = [
        {
            label: (
                <button onClick={() => {}}>
                    Add to soundroom
                </button>
            ),
            key: '0',
        },
        {
            type: 'divider',
        },
    ];

    const queryClient = useQueryClient();

    useEffect(() => {
        queryClient.invalidateQueries({ queryKey: ['me'] });
    }, [])

    const { data, isLoading } = useFriendRequests();

    const [error, setError] = useState('');

    const handleApplyRequest = async(id: string) => {
        console.log(id)

        try {
            await applyFriendRequest({id: id})
        } 
        catch (error: any) {
            if (error.response?.errors?.[0]?.message) {
                setError(error.response.errors[0].message);
            } else {
                setError('Не удалось отправить запрос. Попробуйте еще раз.');
            }
        }
    }
    

    const handleRejectRequest = async(id: string) => {
        try {
            await rejectFriendRequest({id: id})
        } 
        catch (error: any) {
            if (error.response?.errors?.[0]?.message) {
                setError(error.response.errors[0].message);
            } else {
                setError('Не удалось отправить запрос. Попробуйте еще раз.');
            }
        }
    }

    console.log(data)

    return (
        <div className='list-friends'>
            <ul className='list-friends__content'>
                {
                    isLoading && <>Loading...</>
                }
                {
                    !isLoading && data && data.map((item: any) => (
                        <li className='list-friends__item'>
                            <div className='list-friends__item-left list-friends__item-left_send'>
                                <Image className='list-friends__item-image' alt='' height={100} width={100} src={'/images/def.png'} />

                                <div className='list-friends__item-right'>
                                    <span className='list-friends__item-name'>{item.requester.username}</span>
                                    <span className='list-friends__item-tag'>{item.requester.username}#{item.requester.tag}</span>
                                </div>

                            </div>
                            <div className="list-friends__btn-container">
                                <button onClick={() => handleApplyRequest(item.id)} className="list-friends__btn list-friends__btn_apply">
                                    Принять
                                </button>

                                <button onClick={() => handleRejectRequest(item.id)} className="list-friends__btn list-friends__btn_reject text-rose-600 border-rose-600 border-2 rounded-lg hover:text-[white] hover:bg-rose-600">
                                    Отклонить
                                </button>
                            </div>
                            <span className='text-rose-500 font-semibold text-[14px]'>{error}</span>
                        </li>
                    ))
                }
                {
                    !isLoading && (data === undefined || data === null || data.length === 0) && 'Извините, приглашений в друзья нет.'
                }
            </ul>
        </div>
    )
}
