"use client"

import React, { forwardRef } from 'react';

interface VideoProps extends React.VideoHTMLAttributes<HTMLVideoElement>{
  autoPlay?: boolean;
  playsInline?: boolean;
  controls?: boolean;
}

export const Video = forwardRef<HTMLVideoElement,VideoProps>((props,ref) => {
    return (
      <video
        className="w-full h-full"
        ref={ref}
        {...props}
      />
    );
})
