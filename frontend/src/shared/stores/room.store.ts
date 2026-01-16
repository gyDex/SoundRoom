import { makeAutoObservable, toJS } from "mobx";
import { Track } from "../hooks/useTracks";
import { IUserRoom } from "@/entities/types/IUser";

type Room = {
    id: string;                  
    name: string;                  
    description?: string;         
    createdAt: Date;               
    createdBy: string;             
    isPrivate: boolean;            
    password?: string;             
    maxUsers?: number;             
    currentTrack?: Track;  
    
    countUsers: number,

    users: IUserRoom[],
}

class RoomStore {
    currentRoom: Room | null = null;

    isLoading: boolean = false;

    hostId: string = '';

    constructor() {
        makeAutoObservable(this);
    }

    changeRoom(room: Room) {
        this.currentRoom = toJS(room);
    }

    setLoading(status: boolean) {
        this.isLoading = status;
    }

    setHostId(hostId: string) {
        this.hostId = hostId
    }

    clearRoom() {
        this.currentRoom = null;
        this.hostId = '';
    }
} 

export const roomStore = new RoomStore();