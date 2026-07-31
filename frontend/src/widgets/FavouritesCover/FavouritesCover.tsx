import style from './FavouritesCover.module.scss';
import { BsFillBookmarksFill } from "react-icons/bs";

const FavouritesCover = () => {
    return (
        <>
            <div className={`${style['fav-cover']}`}>
                <BsFillBookmarksFill size={72} color='rgb(235 235 255 / 75%)' />
            </div> 
        </>
    )
}

export default FavouritesCover