import { IoRadio } from "react-icons/io5";
import { LuMicVocal } from "react-icons/lu";
import { MdAudiotrack } from "react-icons/md";
import { PiPlaylistBold, PiVinylRecord } from "react-icons/pi";

export const musicMenuConfig = [
    {
        key: "mixes",
        label: "Mixes and Radio",
        icon: IoRadio,
        value: "mixes",
    },
    {
        key: "playlists",
        label: "Playlists",
        icon: PiPlaylistBold,
        value: "playlists",
    },
    {
        key: "albums",
        label: "Albums",
        icon: PiVinylRecord,
        value: "albums",
    },
    {
        key: "tracks",
        label: "Tracks",
        icon: MdAudiotrack,
        value: "tracks",
    },
    {
        key: "artists",
        label: "Artists",
        icon: LuMicVocal,
        value: "artists",
    },
];