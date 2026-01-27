import { useEffect, useState } from "react";

type PlayElement = {
    name: string,
    file: any,
    duration: Date,
    album: string,
    group: string,
    urlFile: string;
}

export function usePlayer () {
    const [isPlay, setPlay] = useState(false);

    const [currentPlay, setCurrentPlay] = useState<PlayElement | null>();

    useEffect(() => {
        
    }, [currentPlay])

    function togglePlay() {
        setPlay(prev => !prev)
    }

    function selectTrack(element: PlayElement) {
        setCurrentPlay(element)
    }

    return {
        isPlay, togglePlay, selectTrack
    }
}
