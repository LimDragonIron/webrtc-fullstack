"use client"

import React, { useEffect, useRef, useState } from 'react';
import {usePathname, useSearchParams, useParams} from 'next/navigation'
import { useCalculateVideoLayout, useCreateMediaStream, useStartPeerSession } from '@/hooks';
import LocalVideo from '../components/molecules/LocalVideo';
import { RemoteVideo } from '../components/molecules/RemoteVideo';
import { VideoControls } from '../components/molecules/VidoeControls';
import { toggleFullscreen } from '@/utils/layoutHelper';

export interface ChatPageProps {

}

const ChatPage = () => {
    const galleryRef = useRef(null);
    const localVideoRef = useRef<HTMLVideoElement|null>(null);
    const mainRef = useRef(null);
    const pathname = usePathname()
    const userMediaStream = useCreateMediaStream(localVideoRef);
    const { connectedUsers, shareScreen, cancelScreenSharing, isScreenShared } = useStartPeerSession(
        pathname.split('/')[2],
        userMediaStream,
        localVideoRef,
        "tokenisTesting"
    );

    useCalculateVideoLayout(galleryRef, connectedUsers.length + 1);
    async function handleScreenSharing(share:boolean) {
        if (share) {
          await shareScreen();
        } else {
          await cancelScreenSharing();
        }
    }
    
    function handleFullscreen(fullscreen:boolean) {
        if(mainRef.current){
            toggleFullscreen(fullscreen, mainRef.current);
        }
    }

    return (
        <div className=' min-h-screen flex-col flex justify-center items-center'>
            <div className=' m-0 flex justify-center items-center h-full bg-chat-main' ref={mainRef}>
                <div className='flex justify-center flex-wrap w-calc-width' ref={galleryRef}>
                    <LocalVideo ref={localVideoRef} autoPlay playsInline muted />
                    {
                        connectedUsers.map((user)=>(
                            <RemoteVideo key={user} id={user} autoPlay playsInline />
                        ))
                    }
                </div>
                <VideoControls
                    isScreenShared={isScreenShared}
                    onScreenShare={handleScreenSharing}
                    onToggleFullscreen={handleFullscreen}
                />
            </div>
        </div>
    );
    
}

export default ChatPage;