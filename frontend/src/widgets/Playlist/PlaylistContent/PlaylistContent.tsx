import { PlaylistItem } from '../PlaylistItem/PlaylistItem'
import './PlaylistContent.scss'

export const PlaylistContent = () => {
  return (
    <section className='playlist-content'>
      <PlaylistItem id='0' name='Name' />
      <PlaylistItem id='1' name='Name' />
      <PlaylistItem id='2' name='Name' />
      <PlaylistItem id='3' name='Name' />
      <PlaylistItem id='4' name='Name' />
      <PlaylistItem id='5' name='Name' />
    </section>
  )
}
