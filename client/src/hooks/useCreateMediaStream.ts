import { useEffect, useState, RefObject } from 'react';

export const useCreateMediaStream = (localVideoRef: RefObject<HTMLVideoElement | null>) => {
  const [userMediaStream, setUserMediaStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    const createMediaStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { min: 640, ideal: 1920 },
            height: { min: 400, ideal: 1080 },
            aspectRatio: { ideal: 1.7777777778 },
          },
          audio: true,
        });

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        setUserMediaStream(stream);
      } catch (error) {
        console.error('Error accessing media devices.', error);
      }
    };

    createMediaStream();
  }, [localVideoRef]);

  return userMediaStream;
};