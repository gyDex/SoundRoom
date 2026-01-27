'use client'

import { useFavTracks } from '@/shared/hooks/useFavTracks'
import { PlaylistContent, PlaylistTop } from '@/widgets'
import Loader from '@/widgets/Loader/Loader'
import { useParams } from 'next/navigation'
import React from 'react'

export const FavoritePage = () => {

    const {data: favorites, isLoading} = useFavTracks();

    const { id } = useParams() as any;

    return (
        <>
            <PlaylistTop id={id} isActiveDeleteBtn={false} imageUrl='/images/favorite.png' name='Избранное' />
            {/* {
                !isLoading ?
                    <PlaylistContent items={favorites}  />
                :  
                <Loader />
            } */}
        </>
    )
}
