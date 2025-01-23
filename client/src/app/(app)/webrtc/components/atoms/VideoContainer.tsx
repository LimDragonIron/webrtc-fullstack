'use client'
import React, { useEffect, useRef, useState } from 'react';

export interface VideoContainerProps {
    children: React.ReactNode;
}

export const VideoContainer: React.FC<VideoContainerProps> = ({children})=> {
    return (
      <div
        className="w-auto h-auto bg-gray-700 box-border relative"
      >
        {children}
      </div>
    );
  };

