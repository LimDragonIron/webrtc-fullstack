"use client"

import React, { forwardRef } from 'react';

interface VideoProps {
    autoplay?: boolean;
    controls?: boolean;
}

export const Video = forwardRef<HTMLVideoElement,VideoProps>((props,ref) => {
    return (
      <video
        className="w-full h-full" // Tailwind CSS 클래스 사용
        ref={ref}
        {...props}
      />
    );
})
