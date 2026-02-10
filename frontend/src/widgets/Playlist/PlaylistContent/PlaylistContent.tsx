import { DateUtils } from '@/shared/classes/DateUtils'
import { PlaylistItem } from '../PlaylistItem/PlaylistItem'
import './PlaylistContent.scss'

type Props = {
  items: any[]
}

type Item = {
  name: string,
  id: string,
  urlFile: string,
  artist: {
    name: string
  },
  duration: number,
  created_at: any,
}

export const PlaylistContent:React.FC<Props> = ({items}) => {

  return (
    <section className='playlist-content'>
      {
          items && items !== null && items.map((item: Item, index: number) => 
            <PlaylistItem key={index} index={index} playlist={items} createAt={DateUtils.isoToDate(item.created_at)} artist={item.artist.name} duration={item.duration}   urlFile={item.urlFile} id={item.id} name={item.name} />
          )
      }
    </section>
  )
}
