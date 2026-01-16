'use client'

import Image from 'next/image'
import './ListFriends.scss'
import { IoMdMore } from 'react-icons/io'
import { Dropdown, MenuProps, Space } from 'antd'
import { useFriends } from '@/shared/hooks/useFriends'

const ListFriends = () => {
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

  const { data, isLoading } = useFriends();

  return (
    <div className='list-friends'>
      <ul className='list-friends__content'>
        {
          !isLoading && data && data.map((item: { username: string, tag: string, id: string }) => (
            <li key={item.id} className='list-friends__item'>
                <div className='list-friends__item-left'>
                    <Image className='list-friends__item-image' alt='' height={100} width={100} src={'/images/def.png'} />

                    <div className='list-friends__item-right'>
                        <span className='list-friends__item-name'>{item.username}</span>
                        <span className='list-friends__item-tag'>{item.username}#{item.tag}</span>
                    </div>
                </div>

                <Dropdown menu={{ items }} placement="topCenter" overlayClassName="list-friends__dropdown" trigger={['click']}>
                    <div>
                        <a onClick={(e) => e.preventDefault()} className="dropdown-trigger">
                        <IoMdMore color='white' size={24} />
                        </a>
                    </div>
                </Dropdown>
            </li>
          ))
        }
      </ul>
    </div>
  )
}

export default ListFriends
