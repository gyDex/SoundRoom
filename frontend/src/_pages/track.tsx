'use client'

import { getTrackByID } from '@/shared/hooks/track/useTrackById';
import Loader from '@/widgets/Loader/Loader';
import TrackContent from '@/widgets/Track/TrackContent/TrackContent'
import TrackTop from '@/widgets/Track/TrackTop/TrackTop'
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import React from 'react'

const TrackPage = () => {
    const { id } = useParams() as any;

    const { data, isLoading, error } = useQuery({
        queryKey: ['trackId', id],
        queryFn: () => getTrackByID(id),
        enabled: !!id
    });

    if (isLoading) return <Loader />;
    if (error) return <div>Error loading playlist</div>;

  return (
    <>
        <TrackTop data={data.track}  description={data?.track?.description} 
                    imageUrl={data?.track?.imageUrl ?? '/images/def.png'} 
                    name={data?.track?.name ?? ''} />
        <TrackContent description='' />
    </>
  )
}

export default TrackPage
