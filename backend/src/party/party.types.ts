export type RoomState = {
  id: string;

  hostId: string;
  createdBy: string;
  createdAt: Date;

  name: string;
  isPrivate: boolean;
  password?: string;

  isPlaying: boolean;
  position: number;
  duration: number;
  updatedAt: number;

  audio: any | null;
};
