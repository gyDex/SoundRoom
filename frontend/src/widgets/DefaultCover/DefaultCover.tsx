import style from './DefaultCover.module.scss';
import { FaMusic } from "react-icons/fa";

interface IProps {
    size?: 'large' | 'middle' | 'tiny';
    sizeIcon?: string;
}

const DefaultCover:React.FC<IProps> = ({ size = 'large', sizeIcon }) => {
    return (
        <>
            {
                size === 'large' && <div className={style['defimg-card']}>
                    <FaMusic size={sizeIcon || 72} color='#ebebff99' />
                </div> 
            }
            {
                size === 'middle' && <div className={`${style['defimg-card']} ${style['defimg-card_middle']}`}>
                    <FaMusic size={sizeIcon || 32} color='#ebebff99' />
                </div> 
            }
            {
                size === 'tiny' && <div className={`${style['defimg-card']} ${style['defimg-card_tiny']}`}>
                    <FaMusic size={sizeIcon || 24} color='#ebebff99' />
                </div> 
            }
        </>
    )
}

export default DefaultCover
