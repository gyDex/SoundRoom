import { useRouter } from "next/navigation";
import { SidebarPlaylistItem } from "./types";
import Image from "next/image";

interface SidebarPlaylistGroupProps {
    playlists: SidebarPlaylistItem[];
    loading: boolean;
}

export const SidebarPlaylistGroup:React.FC<SidebarPlaylistGroupProps> = ({ loading, playlists }) => {
    
    const router = useRouter();

    return (
        <>
            <div className='sidebar__group mb-[32px]'>
                <span className='sidebar__group-name'>MY PLAYLIST</span>
                
                {
                    !loading &&
                    <ul className='sidebar__group-list sidebar__group-list_myplaylist'>
                        {
                            playlists && playlists.map((item) => <li onClick={() => router.push(`/playlist/${item.id}`)} key={item.id} className='sidebar__group-item'>
                                <Image src={item.urlImage} height={100} width={100} className='sidebar__group-image' alt={item.name} />
                                {item.name}
                            </li>)
                        }
                    </ul>
                }

                {
                    loading && <span className='block'>Loading...</span>
                }
            </div>
        </>
    )
}
