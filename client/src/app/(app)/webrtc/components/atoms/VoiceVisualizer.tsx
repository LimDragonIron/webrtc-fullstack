'use client'
import React, { useEffect, useRef, useState } from 'react';

interface VoiceVisualizerProps {
    id: string;
  }
  
export const VoiceVisualizer: React.FC<VoiceVisualizerProps> = ({ id }) => {
  return (
      <div className="absolute w-full flex justify-center" >
        <canvas id={`canvas-${id}`} width="100" height="50" />
      </div>
  );
};
