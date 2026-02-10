'use client';

import { IoSearchSharp } from 'react-icons/io5';
import './Searcher.scss';
import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { Track, useTracks } from '@/shared/hooks/useTracks';
import { useRouter } from 'next/navigation';

export const Searcher = () => {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const searcherRef = useRef<HTMLDivElement | null>(null);
    const modalRef = useRef<HTMLDivElement | null>(null);

    const { data: tracks = [], isLoading } = useTracks();
    const router = useRouter();

    const [isShow, setShow] = useState(false);
    const [value, setValue] = useState('');

    const handleFocus = () => {
        setShow(true);
    };

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                !searcherRef.current?.contains(e.target as Node) &&
                !modalRef.current?.contains(e.target as Node)
            ) {
                setShow(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
        setShow(true);
    };

    const handleItemClick = (id: string) => {
        setShow(false);
        setValue('');
        router.push(`/track/${id}`);
    };

    const filteredTracks = useMemo(() => {
        if (value === '') {
            return tracks;
        }

        const query = value.toLowerCase();

        return tracks.filter(
            (track) =>
                track.name.toLowerCase().includes(query) ||
                track.artist.name.toLowerCase().includes(query)
        );
    }, [value, tracks]);


    return (
        <>
            <div ref={searcherRef} className="searcher">
                <IoSearchSharp size={18} color="white" className="shrink-0" />

                <input
                    ref={inputRef}
                    value={value}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    placeholder="Search"
                    className="searcher__input"
                    type="text"
                />
            </div>

            {isShow && (
    <div ref={modalRef} className="searcher__modal">
        <span className="searcher__title">Tracks</span>

        <ul className="searcher__list">
            {isLoading && <li>Loading...</li>}

            {!isLoading && filteredTracks.length === 0 && (
                <li>Nothing found</li>
            )}

            {!isLoading &&
                filteredTracks.map((item: Track) => (
                    <li
                        key={item.id}
                        className="searcher__item"
                        onClick={() => handleItemClick(item.id)}
                    >
                        <Image
                            className="searcher__item-image"
                            alt="cover"
                            height={48}
                            width={48}
                            src="/images/def.png"
                        />

                        <div className="searcher__item-right">
                            <span className="searcher__item-name">
                                {item.name}
                            </span>
                            <span className="searcher__item-artist">
                                {item.artist.name}
                            </span>
                        </div>
                    </li>
                ))}
        </ul>
    </div>
)}
        </>
    );
};
