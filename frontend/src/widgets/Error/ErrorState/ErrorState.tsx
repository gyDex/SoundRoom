import { RiSignalWifiErrorFill } from "react-icons/ri";
import styles from './ErrorState.module.scss';

interface IErrorState {
  text: string
}

export const ErrorState:React.FC<IErrorState> = ({ text }) => {
  return (
    <>
      <div className={`${styles['error-state']}`}>
        <div className={`${styles['error-state__wrapper']}`}>
          <RiSignalWifiErrorFill color="white" size={64} />
          <span className={`${styles['error-state__text']}`}>{text}</span>
        </div>
      </div>
    </>
  )
}