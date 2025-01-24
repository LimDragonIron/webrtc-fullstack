import { useEffect, useMemo, useState, RefObject } from 'react';
import { createPeerConnectionContext } from '../utils/PeerConnectionSession';

interface UseStartPeerSession {
  connectedUsers: string[];
  peerVideoConnection: ReturnType<typeof createPeerConnectionContext>;
  shareScreen: () => Promise<void>;
  cancelScreenSharing: () => Promise<void>;
  isScreenShared: boolean;
}

export const useStartPeerSession = (
  room: string,
  userMediaStream: MediaStream | null,
  localVideoRef: RefObject<HTMLVideoElement | null>,
  token:string
): UseStartPeerSession => {
  const peerVideoConnection = useMemo(() => createPeerConnectionContext(token), []);

  const [displayMediaStream, setDisplayMediaStream] = useState<MediaStream | null>(null);
  const [connectedUsers, setConnectedUsers] = useState<string[]>([]);

  useEffect(() => {
    if (userMediaStream) {
      peerVideoConnection.joinRoom(room);
      peerVideoConnection.onAddUser((user: string) => {
        setConnectedUsers((users) => [...users, user]);
        peerVideoConnection.addPeerConnection(`${user}`, userMediaStream, (_stream) => {
          const videoElement = document.getElementById(user) as HTMLVideoElement;
          videoElement.srcObject = _stream;
        });
        peerVideoConnection.callUser(user);
      });

      peerVideoConnection.onRemoveUser((socketId: string) => {
        setConnectedUsers((users) => users.filter((user) => user !== socketId));
        peerVideoConnection.removePeerConnection(socketId);
      });

      peerVideoConnection.onUpdateUserList(async (users: string[]) => {
        setConnectedUsers(users);
        for (const user of users) {
          peerVideoConnection.addPeerConnection(`${user}`, userMediaStream, (_stream) => {
            const videoElement = document.getElementById(user) as HTMLVideoElement;
            videoElement.srcObject = _stream;
          });
        }
      });

      peerVideoConnection.onAnswerMade((socket: string) => peerVideoConnection.callUser(socket));
    }

    return () => {
      if (userMediaStream) {
        peerVideoConnection.clearConnections();
        userMediaStream?.getTracks()?.forEach((track) => track.stop());
      }
    };
  }, [peerVideoConnection, room, userMediaStream]);

  const cancelScreenSharing = async () => {
    const senders = peerVideoConnection.senders.filter((sender) => sender.track && sender.track.kind === 'video');

    if (senders) {
        senders.forEach((sender) => {
            const videoTrack = userMediaStream?.getTracks().find((track) => track.kind === 'video') as MediaStreamTrack | undefined;
            if (videoTrack) {
                sender.replaceTrack(videoTrack);
            }
        });
    }

    if (localVideoRef.current && userMediaStream) {
        localVideoRef.current.srcObject = userMediaStream;
    }
    displayMediaStream?.getTracks().forEach((track) => track.stop());
    setDisplayMediaStream(null);
  };

  const shareScreen = async () => {
    const stream = displayMediaStream || (await navigator.mediaDevices.getDisplayMedia());

    const senders = peerVideoConnection.senders.filter((sender) => sender.track && sender.track.kind === 'video');

    if (senders) {
      senders.forEach((sender) => sender.replaceTrack(stream.getTracks()[0]));
    }

    stream.getVideoTracks()[0].addEventListener('ended', () => {
      cancelScreenSharing();
    });

    if(localVideoRef.current && stream) {
        localVideoRef.current.srcObject = stream;
    }

    setDisplayMediaStream(stream);
  };

  return {
    connectedUsers,
    peerVideoConnection,
    shareScreen,
    cancelScreenSharing,
    isScreenShared: !!displayMediaStream,
  };
};