import { makeAutoObservable, toJS } from "mobx";

export type PlayElement = {
    id?: string;
    name?: string;
    file?: any;
    album?: string;
    group?: string;
    image?: string,

    audio?: string,
    urlFile?: string,
}

class PlayerStore {
    isPlay = false;
    progressTrack = 0;
    currentPlay: PlayElement | null = null;
    duration =  0;

    currentPlaylist: any;
    selectedPlaylist: PlayElement[] = [];
    private indexPlaylist: number = 0;
    private uuidTrack: string = '';

    currentTime = 0;

    audio?: string;

    roomId?: string;
    isHost = false;

    // sync state
    serverPosition = 0;
    serverUpdatedAt = 0;

    isRoom = false;

    isUnlocked = false;

    unlock() {
        this.isUnlocked = true;
    }

    startSolo() {
        this.isRoom = false;
        this.roomId = undefined;
        this.isHost = true;
    }

    joinRoom(roomId: string, isHost: boolean) {
        this.isRoom = true;
        this.roomId = roomId;
        this.isHost = isHost;
    }

    leaveRoom() {
        this.isRoom = false;
        this.roomId = undefined;
        this.isHost = false;
    }

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
        const playlist = toJS(this.selectedPlaylist);

        if (!playlist || playlist.length === 0) {
            console.log('Плейлист пуст');
            return;
        }
        console.log(playlist)

        if (this.indexPlaylist === 0) return;
        
        this.indexPlaylist -= 1;
        const track = toJS(playlist[this.indexPlaylist])

        this.currentPlay = track;
        this.currentPlay.audio = track.urlFile;
        this.isPlay = true;

        console.log('Текущий трек:', this.currentPlay);
    }

    nextTrack() {
        const playlist = toJS(this.selectedPlaylist);
        
        if (!playlist || playlist.length === 0) {
            console.log('Плейлист пуст');
            return;
        }
        
        if (this.indexPlaylist >= playlist.length - 1) {
            console.log('Это последний трек в плейлисте');
            return;
        }

        console.log(playlist)
        
        this.indexPlaylist += 1;

        const track = toJS(playlist[this.indexPlaylist])

        this.currentPlay = track;
        // this.currentPlay.group = 
        this.currentPlay.audio = toJS(track.urlFile as any);
        this.isPlay = true;
        
        console.log('Текущий трек:', this.currentPlay);
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

    applyServerState(state?: {
        isPlaying: boolean;
        position: number;
        updatedAt: number;
        audio: PlayElement,
    }) {
        if (!state) {
            console.warn('applyServerState: empty state');
            return;
        }
        console.log('applyServerState')
        this.currentPlay = state.audio
        this.isPlay = state.isPlaying;
        this.serverPosition = state.position;
        this.progressTrack = state.position;
        this.serverUpdatedAt = state.updatedAt;

        this.currentTime =
            state.position + (Date.now() - state.updatedAt) / 1000;
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