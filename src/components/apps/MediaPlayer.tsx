import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, SpeakerHigh, SpeakerSlash } from '@phosphor-icons/react';

export const MediaPlayer: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([70]);
  const [muted, setMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value);
    if (audioRef.current) {
      audioRef.current.volume = value[0] / 100;
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !muted;
      setMuted(!muted);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col h-full items-center justify-center p-8 gap-8">
      <div className="text-center">
        <div className="w-48 h-48 mx-auto mb-4 bg-gradient-to-br from-accent to-primary rounded-lg flex items-center justify-center">
          <SpeakerHigh className="h-24 w-24 text-white" />
        </div>
        <h3 className="text-lg font-medium">Media Player</h3>
        <p className="text-sm text-muted-foreground">No media loaded</p>
      </div>

      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
      />

      <div className="w-full max-w-md space-y-4">
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground w-12">{formatTime(currentTime)}</span>
          <Slider
            value={[currentTime]}
            max={duration || 100}
            step={0.1}
            onValueChange={handleSeek}
            className="flex-1"
          />
          <span className="text-sm text-muted-foreground w-12">{formatTime(duration)}</span>
        </div>

        <div className="flex items-center justify-center gap-4">
          <Button size="lg" variant="default" onClick={togglePlay}>
            {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <Button size="sm" variant="ghost" onClick={toggleMute}>
            {muted ? <SpeakerSlash className="h-5 w-5" /> : <SpeakerHigh className="h-5 w-5" />}
          </Button>
          <Slider value={volume} max={100} step={1} onValueChange={handleVolumeChange} className="flex-1" />
          <span className="text-sm text-muted-foreground w-12">{volume[0]}%</span>
        </div>
      </div>

      <p className="text-sm text-muted-foreground text-center max-w-md">
        This media player is ready to play audio files. In a full implementation, you could load files from the file system.
      </p>
    </div>
  );
};
