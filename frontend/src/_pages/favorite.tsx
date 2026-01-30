'use client'

import { PlaylistTop } from '@/widgets'
import { useParams } from 'next/navigation'
import React from 'react'

export const FavoritePage = () => {

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
