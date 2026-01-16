'use client'

import './Sidebar.scss';
import { IoIosArrowForward, IoIosMore, IoMdHome } from 'react-icons/io';
import { IRoute, my_collection } from '@/shared/routes/my-collection';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { LuLogOut } from 'react-icons/lu';
import { MdFavoriteBorder } from 'react-icons/md';
import { CiSettings } from 'react-icons/ci';
import { logout } from '@/shared/hooks/auth/logout';
import { useAuth } from '@/shared/lib/graphql/useAuth';
import { useEffect } from 'react';
import { Playlist } from '@/shared/hooks/usePlaylistUser';
import { usePlaylist } from '@/shared/lib/graphql/usePlaylist';
import { FaUserFriends } from 'react-icons/fa';

export const Sidebar = () => {
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

                        <div onClick={() => route.push('/favorite')} className='sidebar__group mb-[10px]'>
                            <div className='sidebar__group-item'>
                                <MdFavoriteBorder  size={25} />

                                Favorite
                            </div>
                        </div>

                        <div onClick={() => route.push('/friends')} className='sidebar__group mb-[10px]'>
                            <div className='sidebar__group-item'>
                                <FaUserFriends   size={25} />

                                Friends
                            </div>
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
}
