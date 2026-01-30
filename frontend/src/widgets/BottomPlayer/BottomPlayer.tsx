'use client'
import { HiVolumeOff, HiVolumeUp } from "react-icons/hi";
import Image from 'next/image'
import './BottomPlayer.scss'
import { useEffect, useRef, useState } from 'react'
import { HiMiniPause, HiMiniPlay } from 'react-icons/hi2'
import { observer } from 'mobx-react-lite'
import { playerStore } from '@/shared/stores/player'
import { conversionToTime } from '@/features/ConversionToTime';

import { useSocket } from "@/shared/providers/SocketProvider";
import { roomStore } from "@/shared/stores/room.store";
import { MdOutline1xMobiledata } from "react-icons/md";

export const BottomPlayer = observer(() => {
  const [volume, setVolume] = useState(10);  
  const [playbackRate, setPlaybackRate] = useState<'1x' | '2x'>('1x');  
  const audioRef = useRef<HTMLAudioElement>(null);
  const socket = useSocket();

  const isSeekingRef = useRef(false);

  const handlePlaybackRate = () => {
    const audio = audioRef.current;

    if (audio === null) return;

    setPlaybackRate((prev: any) => {
      if (prev === '1x') {
        audio.playbackRate = 2;
        return '2x'
      }
      audio.playbackRate = 1;
      return '1x'
    })
  }

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  },[])

  useEffect(() => {
    if (!playerStore.isRoom) return;
    if (!playerStore.isHost) return;

    const audio = audioRef.current;
    const track = playerStore.currentPlay;
    if (!audio || !track?.audio) return;

    // audio.pause();
    audio.src = track.audio;
    audio.currentTime = 0;

    playerStore.setProgress(0);
    playerStore.setCurrentTime(0);

    socket?.emit('change-track', {
      roomId: roomStore.currentRoom?.id,
      audio: track,
      position: 0,
      isPlaying: playerStore.IsPlay,
      duration: audio.duration || 0,
      updatedAt: Date.now(),
    });
  }, [playerStore.currentPlay?.id]);

  useEffect(() => {
    if (!playerStore.isRoom) return;
    if (!playerStore.isHost) return;
    if (!playerStore.currentPlay) return;

    const audio = audioRef.current;
    if (!audio) return;

    audio.src = playerStore.currentPlay.audio;
    // audio.currentTime = 0;

    if (playerStore.IsPlay) {
      audio.play().catch(() => {
        // playerStore.pause();
      });
    }

  }, [playerStore.currentPlay?.id, playerStore.isRoom, playerStore.isHost]);

  useEffect(() => {
    if (!socket) return;

    const handler = (state: any) => {
      if (playerStore.isHost) return;

      const audio = audioRef.current;
      if (!audio) return;

      playerStore.applyServerState(state);

      // audio.pause();

      console.log(state, 'change-track')
      audio.src = state.audio.audio;
      audio.currentTime = 0;

      playerStore.setProgress(0);
      playerStore.setCurrentTime(0);

      if (state.isPlaying) {
        audio.play().catch(() => {});
      }
    };

    socket.on('change-track', handler);
    return () => { socket.off('change-track', handler); }
  }, [socket, playerStore.isHost]);

  useEffect(() => {

    if (!socket) return;

    socket.on('connect', () => {
      console.log('✅ SOCKET CONNECTED', socket.id);
    });

    socket.on('disconnect', (reason) => {
      console.log('❌ SOCKET DISCONNECTED', reason);
    });

    socket.on('connect_error', (err) => {
      console.error('❌ CONNECT ERROR', err.message);
    });
  
  }, [socket]);

  // useEffect(() => {
  //   if (!playerStore.isRoom) return;
  //   if (playerStore.isHost) return;

  //   const audio = audioRef.current;
  //   if (!playerStore.currentPlay?.audio) return;

  //   console.log('state', playerStore)

  //   audio.src = playerStore.currentPlay?.audio;
  //   audio.currentTime = playerStore.progress;

  //   // if (playerStore.isPlaying) {
  //   //   audio.play().catch(() => {});
  //   // } else {
  //   //   audio.pause();
  //   // }
  // }, [
  //   playerStore.isRoom,
  //   playerStore.isHost,
  //   playerStore.currentPlay?.audio,
  //   playerStore.progress,
  //   playerStore.audio
  // ]);

  // useEffect(() => {
  //   if (!playerStore.isRoom) return;

  //   const audio = audioRef.current;
  //   if (!audio) return;

  //   audio.src = playerStore.currentPlay?.audio;
  //   audio.currentTime = playerStore.progressTrack;

  //   if (playerStore.isPlay) {
  //     audio.play().catch(() => {});
  //   }
  // }, [playerStore.isRoom, playerStore.progressTrack]);

  // useEffect(() => {
  //   if (!playerStore.isRoom) return;
  //   if (playerStore.isHost) return;

  //   const audio = audioRef.current;
  //   if (!audio || !playerStore.audio) return;

  //   if (!audio.src) return;

  //   audio.src = playerStore.currentPlay?.audio;
  //   audio.currentTime = playerStore.progressTrack;

  //   if (playerStore.isPlay) {
  //     audio.play().catch(() => {});
  //   } else {
  //     audio.pause();
  //   }
  // }, [
  //   playerStore.isRoom,
  //   playerStore.isHost,
  //   playerStore.currentPlay?.audio,
  //   playerStore.progressTrack
  // ]);

//   useEffect(() => {
//   if (!playerStore.isRoom) return;
//   if (playerStore.isHost) return;

//   const audio = audioRef.current;
//   if (!audio) return;

//   const interval = setInterval(() => {
//     if (!audio.duration) return;

//     playerStore.setCurrentTime(audio.currentTime);
//     playerStore.setProgress(
//       (audio.currentTime / audio.duration) * 100
//     );
//   }, 300); // 3–4 раза в секунду достаточно

//   return () => clearInterval(interval);
// }, [playerStore.isRoom, playerStore.isHost]);

  useEffect(() => {
    if (!socket || !playerStore.isRoom) return;

    const audio = audioRef.current;
    if (!audio) return;

    const handler = (state: any) => {
      if (playerStore.isHost) return;

      console.log(state)
      
      console.log('sync-state received:', state);

      playerStore.applyServerState(state);

      const expected = state.position + (Date.now() - state.updatedAt) / 1000;

      if (Math.abs(audio.currentTime - expected) > 1.2) {
        audio.currentTime = expected;
      }

      // ОБНОВЛЕНИЕ: Управление воспроизведением
      if (state.isPlaying && audio.paused) {
        audio.play().catch(e => console.error('Play error:', e));
      } else if (!state.isPlaying && !audio.paused) {
        audio.pause();
      }

      // Обновляем UI
      playerStore.setCurrentTime(expected);
      playerStore.setProgress((expected / state.duration) * 100);
    };

    socket.on('sync-state', handler);
    return () => { socket.off('sync-state', handler); };
  }, [socket, playerStore.isRoom]);

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (!audioRef.current) return;

    const newTime = (value / 100) * playerStore.duration;

    audioRef.current.currentTime = newTime;
    playerStore.setProgress(value);

    if (playerStore.isRoom && playerStore.isHost) {
      console.log('seek')

      socket?.emit('seek', {
        roomId: roomStore.currentRoom?.id,
        position: newTime,
        duration: playerStore.duration,
      });
    }
  };

  const handleVolumeClick = () => {
    if (audioRef.current) {
      if (volume === 0) {
        audioRef.current.volume = 1;
        setVolume(100);
      }
      else{
        setVolume(0)
        audioRef.current.volume = 0;
      }
    }
  }

  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!playerStore.isRoom) {
      playerStore.togglePlay();
      playerStore.IsPlay ? audio.play() : audio.pause();
      return;
    }

    if (!playerStore.isHost) return;

    const position = audio.currentTime;

    if (playerStore.IsPlay) {
      playerStore.pause();
      // audio.pause();

      console.log('pause');

      socket?.emit('pause', {
        roomId: roomStore.currentRoom?.id,
        audio: playerStore.currentPlay,
        position,
        duration: playerStore.duration,
      });
    } 
    else {
      console.log('play');
      playerStore.play(); 
      audio.play();

      socket?.emit('play', {
        roomId: roomStore.currentRoom?.id,
        position,
        duration: playerStore.duration,
        audio: playerStore.currentPlay,
      });
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setVolume(value);
    if (audioRef.current) {
      audioRef.current.volume = value / 100;
    }
  };

  const playAudio = async () => {
      try {
        if (playerStore.IsPlay) {
          await audioRef.current!.play();
        } else {
          audioRef.current!.pause();
        }
      } catch (error) {
        console.error('Playback error:', error);
        playerStore.pause();
      }
  };

  useEffect(() => {
    playAudio();
  }, [playerStore.isPlay]);

  useEffect(() => {
    if (playerStore.isRoom && !playerStore.isHost) return; 

    const audio = audioRef.current;
    if (!audio || !playerStore.currentPlay?.audio) return;

    audio.src = playerStore.currentPlay.audio;
    audio.currentTime = 0;

    playerStore.setProgress(0);
    playerStore.setCurrentTime(0);
  }, [playerStore.currentPlay?.id]);

  useEffect(() => {
    console.log('update')

    const audio = audioRef.current as any;

    if (audio && playerStore.currentPlay) {
      audio.currentTime = (playerStore.progress / 100) * playerStore.duration;

      if (playerStore.currentPlay?.audio) {
        audio.src = playerStore.currentPlay?.audio;
      }

      playAudio();
    }

    if (audio) {
      const handleTimeUpdate = () => {
        if (!audio.duration) return;

        playerStore.setCurrentTime(audio.currentTime);
        playerStore.setProgress(
          (audio.currentTime / audio.duration) * 100
        );
      };

      const handleLoadedMetadata = () => {
        if (!audio.duration) return;

        playerStore.setDuration(audio.duration);

        if (!playerStore.isRoom) {
          audio.currentTime =
            (playerStore.progress / 100) * audio.duration;
        }
      };

      const handleEnded = () => {
        playerStore.pause();
        playerStore.setProgress(0);
        playerStore.setCurrentTime(0);
      };

      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
      audio.addEventListener('ended', handleEnded);

      return () => {
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audio.removeEventListener('ended', handleEnded);
      };
    }
  }, [playerStore.current?.id]);

  console.log(playerStore)

  return (
    <>
      <audio
        ref={audioRef}
        preload="metadata"
        onError={(e) => console.error('Audio element error:', e)}
      />
      {
        playerStore?.currentPlay?.audio &&
        <section className='bottom-player'>
          <div className='bottom-player__left'>
            <Image 
              className='bottom-player__cover' 
              alt='default' 
              height={60} 
              width={60} 
              src={playerStore.current?.image || '/default-cover.jpg'} 
            />

            <div className="bottom-player__left-wrap">
              <h2
                key={playerStore.current?.id}
                className="track-title animate-slide-up"
              >
                {playerStore.current?.name || 'Unknown Track'}
              </h2>

              <span
                key={playerStore.current?.id + '-artist'}
                className="track-artist animate-slide-up"
              >
                {playerStore.current?.group || 'Unknown Artist'}
              </span>
            </div>
          </div>

          <div className='bottom-player__center'>
            <div className='bottom-player__center-top'>
              <div className='flex items-center gap-[15px]'>
                <button onClick={() => playerStore.prevTrack()} className='prev-track'>
                  <svg width="28" height="28" viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M28 28L8 18V28H6L6 4H8L8 14L28 4L28 28Z" />
                  </svg>
                </button>

                <button 
                  onClick={handlePlayPause} 
                  className='bg-[white] hover h-[48px] w-[48px] flex justify-center items-center rounded-[100%]'
                >
                  {!playerStore.IsPlay ?
                    <HiMiniPlay size={'28px'} color='black' /> 
                    :
                    <HiMiniPause size={'28px'} color='black'/>
                  }
                </button>

                <button onClick={() => playerStore.nextTrack()} className='next-track'>
                  <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 4L24 14V4H26V28H24V18L4 28V4Z" fill="white"/>
                  </svg>
                </button>
              </div>            
            </div>

            <div className='bottom-player__progress'>
              <span className='bottom-player__passed'>{conversionToTime(playerStore.currentTime)}</span>
              
              <input
                type="range"
                min={0}
                max={100}
                value={playerStore.progress}
                disabled={!playerStore.isHost && playerStore.isRoom}
                onMouseDown={() => {
                  isSeekingRef.current = true;
                  if (!playerStore.isRoom) playerStore.setIsPlay(false);
                }}

                onMouseUp={() => {
                  isSeekingRef.current = true;
                  if (!playerStore.isRoom) playerStore.setIsPlay(true);
                }}

                onTouchStart={() => {
                  if (!playerStore.isRoom) playerStore.setIsPlay(false);
                }}

                onTouchEnd={() => {
                  if (!playerStore.isRoom) playerStore.setIsPlay(true);
                }}
                onChange={handleProgressChange}

                className="bottom-player__input"
                style={{
                  background: `linear-gradient(to right, #679efe 0%, #679efe ${playerStore.progress}%, #535353 ${playerStore.progress}%, #535353 100%)`
                }}
              />

              <span className='bottom-player__duration'>{conversionToTime(playerStore.duration)}</span>
            </div>
          </div>

          <div className='bottom-player__right'>
            <div className='flex items-center gap-[10px]'>
              <button className="w-[30px]" onClick={handlePlaybackRate}>
                  {
                      playbackRate === '1x' ? <span className="bottom-player__playback-rate">1X</span> : <span className="bottom-player__playback-rate">2X</span>
                  }  
              </button>

              <button className=''>
                <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20.88 9.315H23.67L21.885 11.025C21.8147 11.0947 21.7589 11.1777 21.7208 11.2691C21.6828 11.3605 21.6632 11.4585 21.6632 11.5575C21.6632 11.6565 21.6828 11.7545 21.7208 11.8459C21.7589 11.9373 21.8147 12.0203 21.885 12.09C21.9552 12.1649 22.0399 12.2247 22.1341 12.2655C22.2283 12.3063 22.3299 12.3274 22.4325 12.3274C22.5352 12.3274 22.6367 12.3063 22.7309 12.2655C22.8251 12.2247 22.9098 12.1649 22.98 12.09L26.0775 9.09C26.1504 9.02223 26.209 8.94065 26.25 8.85C26.2952 8.75644 26.3186 8.65389 26.3186 8.55C26.3186 8.4461 26.2952 8.34355 26.25 8.25C26.2158 8.15538 26.1592 8.07045 26.085 8.0025L22.9875 5.0025C22.8385 4.86167 22.6413 4.7832 22.4363 4.7832C22.2312 4.7832 22.034 4.86167 21.885 5.0025C21.8147 5.07222 21.7589 5.15517 21.7208 5.24656C21.6828 5.33796 21.6632 5.43599 21.6632 5.535C21.6632 5.63401 21.6828 5.73203 21.7208 5.82343C21.7589 5.91482 21.8147 5.99777 21.885 6.0675L23.67 7.785H20.88C19.9782 7.76911 19.082 7.93116 18.2428 8.26189C17.4037 8.59262 16.6379 9.08554 15.9894 9.71246C15.3409 10.3394 14.8223 11.088 14.4634 11.9155C14.1044 12.743 13.9122 13.6331 13.8975 14.535C13.8858 15.2363 13.736 15.9284 13.4568 16.5718C13.1775 17.2152 12.7743 17.7973 12.27 18.2848C11.7658 18.7723 11.1704 19.1558 10.518 19.4132C9.86555 19.6706 9.16879 19.7969 8.4675 19.785H4.5825C4.38359 19.785 4.19283 19.864 4.05217 20.0047C3.91152 20.1453 3.8325 20.3361 3.8325 20.535C3.8325 20.7339 3.91152 20.9247 4.05217 21.0653C4.19283 21.206 4.38359 21.285 4.5825 21.285H8.4675C10.2883 21.3151 12.0466 20.621 13.3559 19.3553C14.6652 18.0896 15.4184 16.3558 15.45 14.535C15.4815 13.1239 16.0704 11.7827 17.0879 10.8046C18.1054 9.8264 19.4688 9.29086 20.88 9.315ZM4.5825 9.315H8.4675C9.33651 9.30896 10.1945 9.50987 10.9705 9.90112C11.7464 10.2924 12.4181 10.8627 12.93 11.565C13.1244 11.0391 13.3759 10.5361 13.68 10.065C13.0086 9.34664 12.1952 8.77568 11.2914 8.38835C10.3877 8.00102 9.41324 7.80577 8.43 7.815H4.5825C4.38359 7.815 4.19283 7.89401 4.05217 8.03467C3.91152 8.17532 3.8325 8.36608 3.8325 8.565C3.8325 8.76391 3.91152 8.95467 4.05217 9.09533C4.19283 9.23598 4.38359 9.315 4.5825 9.315Z" fill="#838383"/>
                  <path d="M26.145 20.115C26.1276 20.0833 26.1076 20.0532 26.085 20.025L22.9875 17.025C22.8385 16.8842 22.6413 16.8057 22.4362 16.8057C22.2312 16.8057 22.034 16.8842 21.885 17.025C21.8147 17.0947 21.7589 17.1777 21.7208 17.2691C21.6828 17.3605 21.6631 17.4585 21.6631 17.5575C21.6631 17.6565 21.6828 17.7545 21.7208 17.8459C21.7589 17.9373 21.8147 18.0203 21.885 18.09L23.67 19.8075H20.88C20.0114 19.8111 19.1543 19.6091 18.3787 19.2181C17.6031 18.827 16.9311 18.258 16.4175 17.5575C16.2261 18.0847 15.9744 18.588 15.6675 19.0575C16.3386 19.7762 17.152 20.3474 18.0558 20.7348C18.9596 21.1221 19.9342 21.3172 20.9175 21.3075H23.7075L21.885 23.025C21.7453 23.1655 21.6669 23.3556 21.6669 23.5537C21.6669 23.7519 21.7453 23.942 21.885 24.0825C22.0327 24.2228 22.2287 24.3011 22.4325 24.3011C22.6363 24.3011 22.8323 24.2228 22.98 24.0825L26.0775 21.0825C26.1001 21.0543 26.1201 21.0242 26.1375 20.9925C26.1833 20.948 26.2191 20.8943 26.2425 20.835C26.2865 20.744 26.31 20.6444 26.3113 20.5433C26.3126 20.4422 26.2917 20.3421 26.25 20.25C26.2239 20.1987 26.1883 20.1529 26.145 20.115Z" fill="#838383"/>
                </svg>
              </button>

              <button>
                <svg width="24" height="24" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19.3333 30C19.0663 30 18.8333 29.8746 18.6327 29.6256L15.9661 26.2921C15.6666 25.9178 15.5989 25.4164 15.733 24.9168C15.8997 24.4577 16.2669 24.1257 16.6666 24.1257H20.6666C22.6327 24.1257 24.4659 23.167 25.8672 21.4596C27.2331 19.7489 28 17.4572 28 14.9994C28 9.95669 24.7006 5.83237 20.6667 5.83237H18.3334C17.767 5.83237 17.3334 5.29035 17.3334 4.58232C17.3334 3.8743 17.767 3.33228 18.3334 3.33228H20.6667C25.7994 3.33228 30 8.58331 30 14.9994C30 18.1245 29.0339 21.0413 27.2669 23.2501C25.5 25.4589 23.1666 26.6666 20.6666 26.6666H19.0664L20.0325 27.8743C20.4322 28.374 20.4322 29.1667 20.0325 29.624C19.8333 29.8747 19.6002 30 19.3333 30ZM12.6666 26.6665H9.33329C4.20065 26.6665 0 21.4155 0 14.9994C0 11.8743 0.966129 8.9575 2.73305 6.74867C4.49998 4.53984 6.83337 3.33221 9.33336 3.33221H11.9336L10.9675 2.1245C10.5678 1.62481 10.5678 0.832115 10.9675 0.374764C11.3672 -0.124921 12.0013 -0.124921 12.3672 0.374764L15.0339 3.70822C15.3333 4.08259 15.4011 4.58392 15.2669 5.08361C15.1328 5.58167 14.7331 5.83234 14.3333 5.83234H9.33337C7.36724 5.83234 5.53405 6.79105 4.13272 8.49844C2.76683 10.2498 1.99993 12.5416 1.99993 14.9995C1.99993 20.0422 5.29938 24.1665 9.33323 24.1665H12.6666C13.233 24.1665 13.6665 24.7086 13.6665 25.4166C13.6665 26.1246 13.233 26.6665 12.6666 26.6665Z" fill="#838383"/>
                </svg>
              </button>
            </div>

            <div className='flex items-center gap-[10px]'>
              <button onClick={handleVolumeClick}>
                {
                  volume !== 0 ?
                  <HiVolumeUp  color='white'  size={28}/> :
                  <HiVolumeOff color='white' size={28} />
                }
              </button>

              <input 
                onChange={handleVolumeChange}
                min={0}
                max={100}
                value={volume}
                type='range' 
                className='bottom-player__input' 
                style={{
                  background: `linear-gradient(to right, #679efe 0%, #679efe ${volume}%, #535353 ${volume}%, #535353 100%)`
                }}
              />
            </div>
          </div>
        </section>
      }
    </>
  )
})