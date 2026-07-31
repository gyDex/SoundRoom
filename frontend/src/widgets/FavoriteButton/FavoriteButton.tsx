'use client'

import { addFav } from '@/shared/hooks/track/addFav'
import './FavoriteButton.scss'
import { CSSProperties, useEffect, useState } from "react"
import { MdFavorite, MdFavoriteBorder } from "react-icons/md"
import { checkFavorite } from '@/shared/hooks/track/checkFav'
import { useQueryClient } from '@tanstack/react-query'

const FavoriteButton = ({id, title, style}: {id: string, title?: string, style?: CSSProperties}) => {

    const [isFav, setFav] = useState(false);

    const queryClient = useQueryClient();

    const [loading, setLoading] = useState(false)

    const handleClick = async (e: any) => {
        e.stopPropagation();

        if (loading) return;    

        setLoading(true)

        await addFav({ trackId: id }).then((res) => {
            setFav(res.addFavorite)
        }).catch(() => {
            setFav(false)
        }).finally(() => {
            setLoading(false)
        })

        queryClient.invalidateQueries({ queryKey: ['favorite'] });    
    }

    useEffect(() => {
        checkFavorite({trackId: id}).then((res) => {
            setFav(res.checkFavorite)
        })
    },[])

    return (
        <button disabled={loading} onClick={handleClick}
            style={style} 
            className={`fav-btn ${isFav ?'fav-btn_active' : 'fav-btn_unactive'}`}
        >
            { isFav ? <MdFavorite color='white' size={15} /> : <MdFavoriteBorder size={15} color="white" /> }

            {
                title && <span className='fav-btn__title'>{title}</span>
            }
        </button>
    )
}

export default FavoriteButton
