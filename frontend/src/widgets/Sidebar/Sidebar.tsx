'use client'

import './Sidebar.scss';
import { AiFillSound } from "react-icons/ai";
import { IoIosArrowDown, IoIosArrowForward, IoIosMore, IoMdHome } from 'react-icons/io';
import { IRoute, my_collection } from '@/shared/routes/my-collection';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { LuLogOut } from 'react-icons/lu';
import { MdFavoriteBorder, MdMail } from 'react-icons/md';
import { CiSettings } from 'react-icons/ci';
import { logout } from '@/shared/hooks/auth/logout';
import { useAuth } from '@/shared/lib/graphql/useAuth';
import { useEffect } from 'react';
import { Playlist } from '@/shared/hooks/usePlaylistUser';
import { usePlaylist } from '@/shared/lib/graphql/usePlaylist';
import { FaCheck, FaUserFriends } from 'react-icons/fa';
import { Dropdown, MenuProps } from 'antd';
import { IoPersonAdd } from 'react-icons/io5';
import { observer } from 'mobx-react-lite';
import { friendsTabStore } from '@/shared/stores/friends-tab';


export const Sidebar = observer(() => {
    const route = useRouter();

    const { resetUser, user } = useAuth();

    const router = useRouter();

    const { userLoading, playlistsByUser, getPlaylist, userId } = usePlaylist();
    
    useEffect(() => {
        if (userId !== undefined && userId !== null && !userLoading) {
            console.log('userId',userId)
            getPlaylist();
        }
    },[userId])

    const items: MenuProps['items'] = [
    {
        label: (
            <button onClick={() => friendsTabStore.switchTab('add')} className='w-full flex justify-between items-center'>
                <div className='flex gap-[10px]'>
                    <IoPersonAdd  color={'white'} size={18}/>
                    Добавить друга
                </div>

                {
                    friendsTabStore.FriendTab === 'add' && <FaCheck  size={15} />
                }   
            </button>
        ),
        key: '0',
    },
    {
        label: (
            <button onClick={() => friendsTabStore.switchTab('list')} className='w-full flex justify-between items-center'>
                <div className='flex gap-[10px]'>
                    <FaUserFriends color={'white'} size={18} />
                    Ваши друзья
                </div>

                {
                    friendsTabStore.FriendTab === 'list' && <FaCheck  size={15} />
                }   
            </button>
        ),
        key: '1',
    },
    {
        label: (
            <button onClick={() => friendsTabStore.switchTab('send')} className='w-full justify-between flex items-center'>
                <div className='flex gap-[10px]'>
                    <MdMail color={'white'} size={18} />    
                    Приглашения
                </div>

                {
                    friendsTabStore.FriendTab === 'send' && <FaCheck  size={15} />
                }       
            </button>
        ),
        key: '2',
    },
    ];
    
    const playlists = playlistsByUser 
        ? (Array.isArray(playlistsByUser) ? playlistsByUser : [playlistsByUser])
    : [];

    const playlistsForMusicGroup = playlists.map((playlistsByUser: Playlist) => ({
        id: playlistsByUser.id,
        name: playlistsByUser.name,
        urlImage: playlistsByUser.imageUrl || '',
        link: `/playlist/${playlistsByUser.id}`
    }));

    const onSubmit = async() => {
        await logout();
        await resetUser();
        await route.push('/login');
    }

    return (
        <>
            {
                !userLoading &&
                <aside className='sidebar'>
                    <div className='sidebar__content'>
                        <div className='sidebar__profile'>
                            <div className='sidebar__profile-left'>
                                <Image  src="/images/default2.png" className="rounded-full" alt="" height={32} width={32} />

                                {user?.username ?? ''}
                            </div>

                            <div className='sidebar__profile-right'>
                                <button onClick={() => router.push('/')} className='sidebar__profile-btn'>
                                    <IoMdHome  size={25} />
                                </button>

                                <button className='sidebar__profile-btn'>
                                    <IoIosMore  size={25} />                                    
                                </button>
                            </div>

                        </div>

                        <div className='sidebar__group mb-[32px]'>
                            <span className='sidebar__group-name'>MY COLLECTION</span>

                            <ul className='sidebar__group-list'>
                                {
                                    my_collection.map((item: IRoute) => {
                                        const Icon = item.icon;
                                        return (
                                        <li key={item.id} onClick={() => route.push(item.link)} className='sidebar__group-item'>
                                            <Icon size={25} />
                                            {item.name}
                                        </li>
                                        );
                                    })
                                }
                            </ul>

                        </div>

                        <div className='sidebar__group mb-[32px]'>
                            <span className='sidebar__group-name'>MY PLAYLIST</span>

                            <ul className='sidebar__group-list sidebar__group-list_myplaylist'>
                                {
                                    playlistsForMusicGroup && playlistsForMusicGroup.map((item) => <li onClick={() => route.push(`/playlist/${item.id}`)} key={item.id} className='sidebar__group-item'>
                                        <Image src={item.urlImage} height={100} width={100} className='sidebar__group-image' alt={item.name} />
                                        {item.name}
                                    </li>)
                                }
                            </ul>
                        </div>

                        <div className='sidebar__group mb-[10px]'>
                            <div className='sidebar__group-item'>
                                <CiSettings   size={25} />

                                Setting
                            </div>
                        </div>

                        <div onClick={() => route.push('/rooms')} className='sidebar__group mb-[10px]'>
                            <div className='sidebar__group-item'>
                                <AiFillSound  size={25} />

                                Rooms
                            </div>
                        </div>


                        <div onClick={() => route.push('/favorite')} className='sidebar__group mb-[10px]'>
                            <div className='sidebar__group-item'>
                                <MdFavoriteBorder  size={25} />

                                Favorite
                            </div>
                        </div>

                        <div onClick={() => route.push('/friends')} className='sidebar__group mb-[10px]'>
                            <Dropdown menu={{ items }} className='w-full sidebar__group-item'>
                                <a className='w-full flex gap-[10px] justify-between' onClick={(e) => e.preventDefault()}>
                                    <div className='flex gap-[10px]'>
                                        <FaUserFriends  size={25} />
                                        <span>Friends</span>
                                    </div>

                                    <IoIosArrowDown size={25}/>
                                </a>
                            </Dropdown>
                        </div>

                        <div onClick={onSubmit} className='sidebar__group  '>
                            <div className='sidebar__group-item'>

                                <LuLogOut  size={25} />

                                Logout
                            </div>
                        </div>
                    </div>

                    <div className='sidebar__handle'>
                        <IoIosArrowForward  />
                    </div>
                </aside>
            }
        </>
    )
})
