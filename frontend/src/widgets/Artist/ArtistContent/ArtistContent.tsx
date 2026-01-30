import { DateUtils } from '@/shared/classes/DateUtils'
import React from 'react'
import { ArtistItem } from '../ArtistItem/ArtistItem'

type Props = {
  items: any[]
}

type Item = {
  name: string,
  id: string,
  urlFile: string,
  artist: string,
  duration: number,
  created_at: any,
}

const ArtistContent:React.FC<Props> = ({items}) => {
  return (
    <section className='playlist-content'>
      {
          items && items !== null && items.map((item: Item, index: number) => 
            <ArtistItem key={index} index={index} playlist={items} createAt={DateUtils.isoToDate(item.created_at)} artist={item.artist} duration={item.duration}   urlFile={item.urlFile} id={item.id} name={item.name} />
          )
      }
    </section>
  )
}

export default ArtistContent
