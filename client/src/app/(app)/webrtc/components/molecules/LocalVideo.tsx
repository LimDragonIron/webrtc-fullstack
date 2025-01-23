'use client'
import React, { forwardRef } from 'react';
import { Video, VideoContainer, VoiceVisualizer } from '../atoms';


export interface LocalVideoProps extends React.VideoHTMLAttributes<HTMLVideoElement>{
    autoPlay?: boolean;
    playsInline?: boolean;
    muted?: boolean;
}
const LocalVideo = forwardRef<HTMLVideoElement, LocalVideoProps>((props,ref) => {
    
    return (
      <VideoContainer>
        <VoiceVisualizer id="local" />
        <Video {...props} ref={ref} /> 
      </VideoContainer>
    );
})

export default LocalVideo;