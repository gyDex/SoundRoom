'use client'

import './Sidebar.scss';
import { IoIosArrowForward, IoIosLogOut, IoIosMore } from 'react-icons/io';
import { IRoute, my_collection } from '@/shared/routes/my-collection';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { LuLogOut } from 'react-icons/lu';
import { MdFavoriteBorder } from 'react-icons/md';
import { CiSettings } from 'react-icons/ci';

export const Sidebar = () => {
    const route = useRouter();

    return (
        <aside className='sidebar'>
            <div className='sidebar__content'>
                <div className='sidebar__profile'>
                    <div className='sidebar__profile-right'>
                        <Image  src="/images/default2.png" className="rounded-full" alt="" height={32} width={32} />

                        Profile
                    </div>

                    <IoIosMore size={25} />
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

                    <ul className='sidebar__group-list'>
                        {
                            <li className='sidebar__group-item'>
                                September
                            </li>
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

                <div className='sidebar__group'>
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
    )
}
