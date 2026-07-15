'use client'

import styles from './MobileMenu.module.scss'

import { Dropdown, Tag } from 'antd';
import React, { useEffect } from 'react'
import { CiSettings } from 'react-icons/ci';
import { FaUserFriends } from 'react-icons/fa';
import { IoIosArrowDown, IoIosMore, IoMdHome } from 'react-icons/io';
import { MdFavoriteBorder } from 'react-icons/md';
import { SidebarPlaylistGroup } from '../SidebarPlaylistGroup';
import SwitchTheme from '@/widgets/SwitchTheme/SwitchTheme';
import Image from 'next/image';
import { LuLogOut } from 'react-icons/lu';
import { logout } from '@/shared/hooks/auth/logout';
import { SidebarPlaylistItem } from '../types';
import { Playlist } from '@/shared/hooks/usePlaylistUser';
import { useAuth } from '@/shared/lib/graphql/useAuth';
import { useRouter } from 'next/navigation';
import { usePlaylist } from '@/shared/lib/graphql/usePlaylist';
import { useResizable } from '@/shared/hooks/useResizable';
import { AiFillSound } from 'react-icons/ai';
import { friendsMenuItems } from '../data/friendsMenuItems';
import { musicMenuItems } from '../data/music/musicMenuItems';
import { SiApplemusic } from "react-icons/si";
import { mobileMenuStore } from '@/shared/stores/mobile-menu.store';
import { RxCross2 } from 'react-icons/rx';
import { observer } from 'mobx-react-lite';

export const MobileMenu = observer(() => {
    const route = useRouter();
    
    const { resetUser, user } = useAuth();

    const { userLoading, playlistsByUser, getPlaylist, userId, userError } = usePlaylist();

    const { collapsed } = useResizable({ minWidth: 250, maxWidth: 500, collapsedWidth: 40 });
    
    useEffect(() => {
        if (userId !== undefined && userId !== null && !userLoading) {
            console.log('userId',userId)
            getPlaylist();
        }
    },[userId])

    const playlists = playlistsByUser 
        ? (Array.isArray(playlistsByUser) ? playlistsByUser : [playlistsByUser])
    : [];
    

    const playlistsForMusicGroup: SidebarPlaylistItem[] = playlists.map((playlistsByUser: Playlist) => ({
        id: playlistsByUser.id,
        name: playlistsByUser.name,
        urlImage: playlistsByUser.imageUrl || '',
        link: `/playlist/${playlistsByUser.id}`
    }));

    const onSubmit = async() => {
        mobileMenuStore.toggleMenu()
        await logout();
        await resetUser();
        await route.push('/login');
    }

    return (
        <>
            <div className={`${styles['mobile-menu']} ${mobileMenuStore.isActive && styles['mobile-menu_active']}`}>
                {!collapsed && (
                    <div className='sidebar__content'>
                        <div className='sidebar__profile'>
                            <div className='sidebar__profile-left'>
                                <Image  src="/images/default2.png" className="rounded-full" alt="" height={32} width={32} />

                                {user?.username ?? ''}
                            </div>

                            <div className='sidebar__profile-right'>
                                <SwitchTheme />

                                <button onClick={() => { route.push('/'); mobileMenuStore.changeActive(false) }} className='sidebar__profile-btn'>
                                    <IoMdHome  size={25} />
                                </button>

                                {/* <button className='sidebar__profile-btn'>
                                    <IoIosMore  size={25} />                                    
                                </button> */}

                                <button onClick={() => { mobileMenuStore.changeActive(false) }} className='sidebar__profile-btn'>
                                    <RxCross2 size={25} />
                                </button>
                            </div>
                        </div>

                        <div className='sidebar__group mb-[32px]'>
                            <Dropdown menu={{ items: musicMenuItems }} className='w-full sidebar__dropdown'>
                                <a className='w-full flex gap-[10px] justify-between' onClick={(e) => e.preventDefault()}>
                                    <div className='flex gap-[10px]'>
                                        <SiApplemusic    size={25} />

                                        <span className='sidebar__group-wrap'>
                                            My Collection Music 
                                            <Tag  key={'gold'} color={'gold'} >Coming soon</Tag> 
                                        </span>
                                    </div>



                                    <IoIosArrowDown size={25}/>
                                </a>
                            </Dropdown>        
                        </div>

                        { !userError && <SidebarPlaylistGroup loading={userLoading} playlists={playlistsForMusicGroup} /> }

                        <div onClick={() => { route.push('/settings'); mobileMenuStore.toggleMenu()}} className='sidebar__group mb-[10px]'>
                            <div className='sidebar__group-item'>
                                <CiSettings   size={25} />

                                Settings
                            </div>
                        </div>

                        <div onClick={() => { route.push('/rooms');  mobileMenuStore.toggleMenu()}} className='sidebar__group mb-[10px]'>
                            <div className='sidebar__group-item'>
                                <AiFillSound  size={25} />

                                Rooms
                            </div>
                        </div>

                        <div onClick={() => { route.push('/favorite');  mobileMenuStore.toggleMenu() }} className='sidebar__group mb-[10px]'>
                            <div className='sidebar__group-item'>
                                <MdFavoriteBorder  size={25} />

                                Favorite
                            </div>
                        </div>

                        <div  className='sidebar__group mb-[10px]'>
                            <Dropdown menu={{ items: friendsMenuItems }} className='w-full sidebar__group-item'>
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
                )}
            </div>
        </>
    )
})