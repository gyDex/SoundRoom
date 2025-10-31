
import { IAlbum } from '@/entities/types/IAlbum'
import { Albums } from '@/widgets'
import MusicGroup from '@/widgets/MusicGroup/MusicGroup'
import React from 'react'

export const HomePage = () => {
  const testAlbum = [
    {
      id: '1',
      name: 'Test 1',
      ulrImage: '/images/def2.png',
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
      ulrImage: '/images/def2.png',
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
      ulrImage: '/images/def2.png',
      link: '/playlist/'
    }
  ] as IAlbum[]

  const testTracks = [
    {
      id: '1',
      name: 'Test 1',
      ulrImage: '/images/def.png',
    },
    {
      id: '2',
      name: 'Test 2',
      ulrImage: '/images/def2.png',
    },
    {
      id: '3',
      name: 'Test 2',
      ulrImage: '/images/def.png',
    },
    {
      id: '4',
      name: 'Test 2',
      ulrImage: '/images/def2.png',
    },
    {
      id: '5',
      name: 'Test 2',
      ulrImage: '/images/default2.png',
    }
  ] as IGroup[]

  return (
    <>
      <Albums nameAlbums='Твоя альбомы' albums={testAlbum} />

      <MusicGroup nameGroup='Твои треки' tracks={testTracks}  />
    </>
  )
}
