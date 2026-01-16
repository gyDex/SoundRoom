'use client'

import { Button, Dropdown, DropDownProps, Space } from "antd"
import AddFriends from "../AddFriends/AddFriends"
import ListFriends from "../ListFriends/ListFriends"
import { SendRequest } from "../SendRequest/SendRequest"
import type { DropdownProps, MenuProps } from 'antd';
import { createStyles } from 'antd-style';
import { IoIosArrowDown } from "react-icons/io"
import { useState } from "react"
import { FaUserFriends } from "react-icons/fa"
import { MdMail } from "react-icons/md"
import { IoPersonAdd } from "react-icons/io5"

export const FriendsContent = () => {

    const [content, setContent] = useState<'send' | 'add' | 'list'>('add');

    const useStyles = createStyles(({ token }) => ({
    root: {
        backgroundColor: token.colorFillAlter,
        border: `1px solid ${token.colorBorder}`,
        borderRadius: token.borderRadius,
        width: '100%'
    },
    }));


    const items: MenuProps['items'] = [
        {
            key: '1',
            label: 'Добавить друга',
            icon: <IoPersonAdd  color={'white'} size={18}/>,
            onClick: () => setContent('add')
        },
        {
            key: '2',
            label: 'Ваши друзья',
            icon: <FaUserFriends color={'white'} size={18} />,
            onClick: () => setContent('list')
        },
        {
            key: '3',
            label: 'Приглашения',
            icon: <MdMail color={'white'} size={18} />,
            onClick: () => setContent('send')
        },
    ];

    const functionStyles: DropDownProps['styles'] = (info) => {
    const { props } = info;
    const isClick = props.trigger?.includes('click');
    if (isClick) {
        return {
        root: {
            borderColor: '#1890ff',
            borderRadius: '8px',
        },
        } satisfies DropdownProps['styles'];
    }
    return {};
    };

    const { styles } = useStyles();

    const sharedProps: DropdownProps = {
        menu: { items },
        placement: 'bottomLeft',
        classNames: { root: styles.root },
    };


    return (
        <>
            <Dropdown {...sharedProps} className="w-full flex !justify-start" styles={functionStyles} trigger={['click']}>
                <Button type="primary">
                    <Space>
                        { content === 'add' && 'Добавить друга'}
                        { content === 'list' && 'Ваши друзья'}
                        { content === 'send' && 'Приглашения'}
                        <IoIosArrowDown size={16} color="white" />
                    </Space>
                </Button>
            </Dropdown>

            {
                content === 'add' && <AddFriends />
            }
            {
                content === 'list' && <ListFriends />
            }
            {
                content === 'send' && <SendRequest />
            }
        </>
    )
}
