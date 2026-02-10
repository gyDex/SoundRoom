import { friendsTabStore } from "@/shared/stores/friends-tab";
import { MenuProps } from "antd";
import { FaCheck, FaUserFriends } from "react-icons/fa";
import { IoPersonAdd } from "react-icons/io5";
import { MdMail } from "react-icons/md";

export const friendsMenuItems: MenuProps['items'] = [
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