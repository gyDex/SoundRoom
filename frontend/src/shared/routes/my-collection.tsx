import { IoRadio } from "react-icons/io5"
import { LuMicVocal } from "react-icons/lu"
import { MdAudiotrack } from "react-icons/md"
import { PiPlaylistBold, PiVinylRecord } from "react-icons/pi"

export interface IRoute {
    id: number,
    name: string,
    icon: any,
    link: string
}

export const my_collection: IRoute[] = [
    {
        id: 0,
        name: 'Mixes and Radio',
        icon: IoRadio,
        link: ''
    },
    {
        id: 1,
        name: 'Playlists',
        icon: PiPlaylistBold,
        link: ''
    },
    {
        id: 2,
        name: 'Albums',
        icon: PiVinylRecord,
        link: ''
    },
    {
        id: 3,
        name: 'Tracks',
        icon: MdAudiotrack,
        link: ''
    },
    {
        id: 4,
        name: 'Artists',
        icon: LuMicVocal,
        link: ''
    },
]
