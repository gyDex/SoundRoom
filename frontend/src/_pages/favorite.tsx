'use client'

import { useFavTracks } from '@/shared/hooks/useFavTracks'
import { PlaylistContent, PlaylistTop } from '@/widgets'
import Loader from '@/widgets/Loader/Loader'
import { useParams } from 'next/navigation'
import React from 'react'

export const FavoritePage = () => {

    const { id } = useParams() as any;
    const {data: favorites, isLoading} = useFavTracks();

    return (
        <>
            <PlaylistTop isFavourites={true} id={id} isActiveDeleteBtn={false} name='Избранное' />
            {
                !isLoading ?
                    <PlaylistContent items={favorites}  />
                :  
                <Loader />
            }
        </>
    )
}
