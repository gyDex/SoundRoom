import { FaUser } from 'react-icons/fa'
import styles from './DefaultProfile.module.scss'

const DefaultProfile = () => {
    return (
        <>
            <div className={styles['defimg-profile']}>
                <FaUser size={72} color='#ebebff99' />
            </div> 
        </>
    )
}

export default DefaultProfile
