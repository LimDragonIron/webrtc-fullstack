"use client"

import React, { useEffect, useState } from 'react';
import { useCalculateVoiceVolume } from '@/hooks';
import { Video, VideoContainer, VoiceVisualizer } from '../atoms';

interface RemoteVideoProps extends React.ComponentPropsWithoutRef<typeof Video> {
  id: string;
}

export const RemoteVideo: React.FC<RemoteVideoProps> = (props) => {
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);

  useCalculateVoiceVolume(mediaStream, props.id);

  useEffect(() => {
    const interval = setInterval(() => {
      const videoElement = document.getElementById(props.id) as HTMLVideoElement | null;
      const stream = videoElement?.srcObject as MediaStream | null;

      if (stream) {
        setMediaStream(stream);
        clearInterval(interval);
      }
    }, 100);

    return () => {
      clearInterval(interval);
    };
  }, [props.id]);

  return (
    <VideoContainer>
      <VoiceVisualizer id={props.id} />
      <Video {...props} />
    </VideoContainer>
  );
};