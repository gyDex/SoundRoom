import { PlaylistPage } from '@/_pages'
import Loader from '@/widgets/Loader/Loader'
import { Suspense } from 'react'

const Playlist = () => {
  return (
    <Suspense fallback={<Loader />}>
      <PlaylistPage />
    </Suspense>
  )
}

export default Playlist
