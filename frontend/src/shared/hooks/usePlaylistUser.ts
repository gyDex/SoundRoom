import { useQuery } from "@tanstack/react-query";

export interface Playlist {
  id: string;
  name: string;
  imageUrl: string;
  tracks: any[]; 
}

export const fetchUserPlaylists = async (userId: string): Promise<{ playlists: Playlist[] }> => {
  const response = await fetch(`/api/playlists/user/${userId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch playlists');
  }
  return response.json();
};

export const usePlaylistUser = (userId: string) => {
  return useQuery({
    queryKey: ['playlists', userId],
    queryFn: () => fetchUserPlaylists(userId),
    enabled: !!userId,
    staleTime: 2 * 60 * 1000,
  });
};