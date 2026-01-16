import { useMe } from "@/shared/hooks/auth/useMe";
import { getPlaylistByUserID } from "@/shared/hooks/usePlaylistById";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export function usePlaylist() {
    const { user, loading: userLoading, error: userError } = useMe();

    const userId = user?.id;

    const { data: playlistsByUser } = useQuery({
        queryKey: ['playlists', userId],
        queryFn: () => getPlaylistByUserID(userId!),
        enabled: !!userId,
    });

    const queryClient = useQueryClient();

    const refetchPlaylist = () => {
        return queryClient.invalidateQueries({ queryKey: ['playlists'] });
    };

    const getPlaylist = async () => {
        try {
            await getPlaylistByUserID(userId || '');
            return true;
        } catch {
            return false;
        }
    };

    return {
        getPlaylist,
        playlistsByUser,
        userId,
        userLoading,
        userError,
        refetchPlaylist
    };
}