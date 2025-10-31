import Playlist from '@/app/(home)/playlist/page'
import { PlaylistContent, PlaylistTop } from '@/widgets'
import MusicGroup from '@/widgets/MusicGroup/MusicGroup'
import React from 'react'

export const FavoritePage = () => {
    const testTracks = [
        {
            id: '1',
            name: 'Test 1',
            ulrImage: '/images/def.png',
            link: '/playlist/'
        },
        {
            id: '2',
            name: 'Test 2',
            ulrImage: '/images/def2.png',
            link: '/playlist/'
        },
        {
            id: '3',
            name: 'Test 2',
            ulrImage: '/images/def.png',
            link: '/playlist/'
        },
        {
            id: '4',
            name: 'Test 2',
            ulrImage: '/images/def2.png',
            link: '/playlist/'
        },
        {
            id: '5',
            name: 'Test 2',
            ulrImage: '/images/default2.png',
            link: '/playlist/'
        }
    ] as IGroup[]

    return (
        <>
            <PlaylistTop name='Избранное' />
            <PlaylistContent  />  
        </>
    )
}
