'use client';

import { useQuery } from '@tanstack/react-query';
import { Card, List, Typography, Spin, Empty } from 'antd';
import { PlayCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { request } from 'graphql-request';
import { GET_TRACKS } from '@/shared/lib/graphql/tracks';
import Loader from '../Loader/Loader';

const { Title, Text } = Typography;

function getTimeOfDay(): 'morning' | 'day' | 'evening' | 'night' {
  const hour = new Date().getHours();
  
  if (hour >= 6 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 18) return 'day';
  if (hour >= 18 && hour < 22) return 'evening';
  return 'night';
}

const GRAPHQL_ENDPOINT = 'http://localhost:3000/graphql';

function getPlaylistInfo(timeOfDay: string) {
  const info = {
    morning: { title: 'Утренний плейлист', emoji: '☀️', description: 'Бодрое начало дня' },
    day: { title: 'Дневной микс', emoji: '🌤️', description: 'Энергия для продуктивного дня' },
    evening: { title: 'Вечерний вайб', emoji: '🌆', description: 'Расслабление после работы' },
    night: { title: 'Ночные треки', emoji: '🌙', description: 'Спокойная музыка для вечера' },
  };
  return info[timeOfDay as keyof typeof info];
}

export default function DayPlaylist() {
  const timeOfDay = getTimeOfDay();
  const playlistInfo = getPlaylistInfo(timeOfDay);

  const { data, isLoading, error } = useQuery({
    queryKey: ['dayPlaylist', timeOfDay],
    queryFn: async () => {
      const response = await request(GRAPHQL_ENDPOINT, GET_TRACKS, { limit: 20 });
      return response.tracks;
    },
    staleTime: 1000 * 60 * 30, 
  });

  if (isLoading) {
    return (
      <Loader />
    );
  }
  
  console.log(data)

  return (
    <>
    
    </>
    // <Card 
    //     id={data.id}
    //     subtitle={subtitle} 
    //     name={playlistInfo.title} 
    //     link={item.link} 
    //     urlImage={item.urlImage} 
    //     variation={variation}
    // />            
    // <Card className="w-full max-w-2xl mx-auto">
    //   <div className="mb-6">
    //     <div className="flex items-center gap-3 mb-2">
    //       <span className="text-4xl">{playlistInfo.emoji}</span>
    //       <div>
    //         <Title level={3} className="!mb-0">
    //           {playlistInfo.title}
    //         </Title>
    //         <Text type="secondary">{playlistInfo.description}</Text>
    //       </div>
    //     </div>
    //     <div className="flex items-center gap-2 text-sm text-gray-500">
    //       <ClockCircleOutlined />
    //       <span>Обновляется автоматически</span>
    //     </div>
    //   </div>

    //   <List
    //     dataSource={data}
    //     renderItem={(track: any) => (
    //       <List.Item
    //         className="hover:bg-gray-50 cursor-pointer transition-colors rounded-lg px-4 py-3"
    //         onClick={() => console.log('Play track:', track.id)}
    //       >
    //         <List.Item.Meta
    //           avatar={
    //             <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
    //               <PlayCircleOutlined className="text-white text-2xl" />
    //             </div>
    //           }
    //           title={<Text strong>{track.name}</Text>}
    //           description={
    //             <div className="flex items-center gap-3 text-sm">
    //               <Text type="secondary">{track.artist?.name || 'Неизвестный артист'}</Text>
    //               <Text type="secondary">•</Text>
    //               <Text type="secondary">{track.genre}</Text>
    //               {track.bpm && (
    //                 <>
    //                   <Text type="secondary">•</Text>
    //                   <Text type="secondary">{track.bpm} BPM</Text>
    //                 </>
    //               )}
    //             </div>
    //           }
    //         />
    //       </List.Item>
    //     )}
    //   />
    // </Card>
  );
}