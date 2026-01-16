import { makeAutoObservable } from "mobx";

export type PlayElement = {
    id?: string;
    name?: string;
    file?: any;
    album?: string;
    group?: string;
    image?: string,

    audio?: string,
}

class PlayerStore {
    isPlay = true;
    progressTrack = 0;
    currentPlay: PlayElement | null = null;
    duration =  0;

    currentPlaylist: any;
    selectedPlaylist: PlayElement[] = [];
    private indexPlaylist: number = 0;
    private uuidTrack: string = '';

    currentTime = 0;

    audio?: string;

    constructor() {
        makeAutoObservable(this);
    }

    togglePlay = () => {
        this.isPlay = !this.isPlay;
    }

    play = () => {
        this.isPlay = true;
    }

    pause = () => {
        this.isPlay = false;
    }

    selectPlay = (element: PlayElement) => {
        this.currentPlay = element;
    }

    setProgress = (prog: number) => {
        this.progressTrack = prog;
    }

    reset = () => {
        this.isPlay = false;
        this.progressTrack = 0;
    }

    //Playlist
    selectPlaylist(playlist: PlayElement[], index: number) {
        this.selectedPlaylist = playlist;
        this.indexPlaylist = index;

        this.currentPlaylist = playlist as any;
    }

    changeIndexPlaylist(index: number, uuidTrack: string) {
        this.indexPlaylist = index;
        this.uuidTrack = uuidTrack; 
    }

    subscribe(callback: () => void) {
        const interval = setInterval(callback, 100);
        return () => clearInterval(interval);
    }

    prevTrack() {
        if (this.indexPlaylist === 0) return;
        
        this.indexPlaylist -= 1;
        this.currentPlay = this.selectedPlaylist[this.indexPlaylist];
        this.isPlay = true;
    }

    nextTrack() {
        if (this.indexPlaylist === this.selectedPlaylist.length) return;

        this.indexPlaylist += 1;
        this.currentPlay = this.selectedPlaylist[this.indexPlaylist];
        this.isPlay = true;
    }

    //Getters

    get current() {
        return this.currentPlay;
    }

    get IsPlay() {
        return this.isPlay;
    }

    get progress() {
        return this.progressTrack;
    }

    get audioFile() {
        return this.audio;
    }

    get UUIDTrack() {
        return this.uuidTrack;
    }

    get currentDuration() {
        if (this.duration) 
        {
            const mins = Math.floor((this.duration * this.progress / 100) / 60) ;
            const secs = Math.floor((this.duration * this.progress / 100) % 60) * this.progress;
            return `${mins}:${secs.toString().padStart(2, '0').slice(0,2)}`; 
        }
    }

    setIsPlay(play: boolean) {
        this.isPlay = play;
    }

    setAudioFile(file: string) {
        this.audio = file;
    }

    setCurrentTime(time: number) {
        this.currentTime = time;
    }

    setDuration(dur: number) {
        this.duration = dur;
    }
}

export const playerStore = new PlayerStore();