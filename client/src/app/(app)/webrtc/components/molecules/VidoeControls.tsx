import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

interface VideoControlsProps {
  isScreenShared: boolean;
  onScreenShare: (isSharing: boolean) => void;
  onToggleFullscreen: (isFullscreen: boolean) => void;
}

export const VideoControls: React.FC<VideoControlsProps> = ({ isScreenShared, onScreenShare, onToggleFullscreen }) => {
  const [isFullscreen, setFullscreen] = useState<boolean>(false);

  const handleToggleFullscreen = () => {
    const value = !isFullscreen;
    setFullscreen(value);
    onToggleFullscreen(value);
  };

  const handleScreenShare = () => {
    onScreenShare(!isScreenShared);
  };

  return (
    <div
      style={{
        position: 'absolute',
        bottom: '24px',
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
      }}
    >
      <div>
        <Button onClick={handleScreenShare}>
          {isScreenShared ? 'Cancel Sharing' : 'Share Screen'}
        </Button>
        <Button onClick={handleToggleFullscreen}>
          {isFullscreen ? 'Exit Full Screen' : 'Full Screen'}
        </Button>
      </div>
    </div>
  );
};