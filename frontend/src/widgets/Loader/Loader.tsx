import { IoMdMusicalNote } from "react-icons/io";
import { RiLoader3Line } from "react-icons/ri";

import './Loader.scss'

const Loader = ({isActiveTitle = true} : {isActiveTitle?: boolean}) => {
  return (
    <section className='loader'>
        <div className="loader__wrapper">

            <div className="loader__model">
                <div className="loader__note">
                    <IoMdMusicalNote color='white' size={48} />
                </div>
                <RiLoader3Line color='white' className="loader__circle" size={96} />
            </div>
            {
                isActiveTitle &&
                <span className="loader__title">Loading...</span>
            }
        </div>
    </section>
  )
}

export default Loader
