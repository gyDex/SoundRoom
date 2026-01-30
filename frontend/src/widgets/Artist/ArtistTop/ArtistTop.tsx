import './ArtistTop.scss'
import Image from "next/image"
import { MdVerified } from 'react-icons/md'

type Props = {
    name: string,
    imageUrl: string,
    id: string,
    tracks?: any
    description?: any
}


const ArtistTop:React.FC<Props> = ({id, imageUrl, name, tracks, description}) => {
  return (
      <section className='artist-top'>
          <Image className='artist-top__image' src={imageUrl ?? '/images/def.png'} quality={100} width={250} height={250} alt='poster' />

          <Image className='artist-top__bg' height={128} width={128} src={imageUrl ??'/images/def.png'} alt=''/>
          
        <div className='artist-top__content'>
            <div className='artist-top__top'>
                <div style={{
                    display:'flex',
                    gap:'10px',
                    alignItems: 'center'
                }}>
                    <MdVerified color='#679efe' className='relative z-[10]' size={18} /> <div className='artist-top__label'>Verified Artist</div>
                </div>
                 
                <h2 className='artist-top__title'>
                    {name}
                </h2>

                <span className='artist-top__description'>
                    {description ?? 'У трека отсутствует описание'}
                </span>
            </div>
        </div>
      </section>
  )
}

export default ArtistTop
