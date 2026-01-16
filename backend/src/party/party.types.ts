export interface RoomState {
  roomId: string;
  trackId: string | null;
  isPlaying: boolean;
  position: number; 
  updatedAt: number; 
  hostId: string;
}