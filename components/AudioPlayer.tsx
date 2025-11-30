import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

interface AudioPlayerProps {
  src: string; // The URL to stream from
  title?: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ src, title }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const setAudioData = () => {
      setDuration(audio.duration);
      setCurrentTime(audio.currentTime);
    }

    const setAudioTime = () => setCurrentTime(audio.currentTime);
    const onEnded = () => setIsPlaying(false);

    const handleError = (e: Event) => {
      console.error('Audio loading error:', e);
      const error = audio.error;
      if (error) {
        switch (error.code) {
          case error.MEDIA_ERR_ABORTED:
            console.error('Audio playback aborted');
            break;
          case error.MEDIA_ERR_NETWORK:
            console.error('Network error while loading audio');
            break;
          case error.MEDIA_ERR_DECODE:
            console.error('Audio decoding error');
            break;
          case error.MEDIA_ERR_SRC_NOT_SUPPORTED:
            console.error('Audio source not supported or CORS issue');
            break;
        }
      }
    };

    audio.addEventListener('loadeddata', setAudioData);
    audio.addEventListener('timeupdate', setAudioTime);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('loadeddata', setAudioData);
      audio.removeEventListener('timeupdate', setAudioTime);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', handleError);
    }
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;
    const time = Number(e.target.value);
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    audioRef.current.muted = newMuted;
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '00:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Handle audio loading errors
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleError = (e: Event) => {
      console.error('Audio loading error:', e);
      // Try alternative URL format if the first one fails
      if (src && src.includes('drive.google.com')) {
        const fileId = src.match(/[?&]id=([a-zA-Z0-9_-]+)/)?.[1] || src.match(/\/d\/([a-zA-Z0-9_-]+)/)?.[1];
        if (fileId) {
          // Try alternative format
          const altUrl = `https://docs.google.com/uc?export=download&id=${fileId}`;
          if (audio.src !== altUrl) {
            audio.src = altUrl;
          }
        }
      }
    };

    audio.addEventListener('error', handleError);
    return () => {
      audio.removeEventListener('error', handleError);
    };
  }, [src]);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-brand-grey-light dark:border-gray-600 p-4 w-full transition-colors duration-300">
      <audio 
        ref={audioRef} 
        src={src} 
        preload="metadata"
        crossOrigin="anonymous"
      />
      
      <div className="flex items-center gap-4">
        {/* Play/Pause Button */}
        <button 
          onClick={togglePlay}
          className="w-12 h-12 rounded-full bg-brand-blue dark:bg-sky-600 text-white flex items-center justify-center hover:bg-brand-blue-hover dark:hover:bg-sky-500 transition-colors shadow-md flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-2 dark:focus:ring-offset-gray-900"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />} 
          {/* ml-1 for optical centering of the play triangle */}
        </button>

        <div className="flex-grow flex flex-col gap-1">
          {title && <span className="text-xs font-bold text-brand-grey dark:text-gray-400">{title}</span>}
          
          {/* Progress Bar */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-brand-grey dark:text-gray-400 font-mono w-10 text-center">{formatTime(currentTime)}</span>
            
            <div className="relative w-full h-2 rounded-full bg-gray-200 dark:bg-gray-700 group">
               {/* 
                  Range Input trick for custom slider.
                  The input is invisible but clickable on top.
                  The div below represents the visual bar.
                */}
              <input
                type="range"
                min="0"
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div 
                className="absolute top-0 right-0 h-full bg-brand-blue dark:bg-sky-500 rounded-full pointer-events-none"
                style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
              />
            </div>

            <span className="text-xs text-brand-grey dark:text-gray-400 font-mono w-10 text-center">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Volume Control */}
        <button onClick={toggleMute} className="text-brand-grey dark:text-gray-400 hover:text-brand-blue dark:hover:text-sky-400 transition-colors hidden sm:block">
           {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
      </div>
    </div>
  );
};

export default AudioPlayer;