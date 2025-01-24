"use client"

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSocket } from '@/providers/SocketProvider';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';

export interface WebRtcChatPageProps {

}
const WebRtcChatPage = () => {
    const router = useRouter()
    const inputRef = useRef<HTMLInputElement|null>(null);
    const joinRoom = () => {
        if(inputRef.current != null){
            router.push(`webrtc/${inputRef.current.value}`)
        }
    }
    return (
        <div className='min-h-screen flex flex-col justify-center items-center'>
            <div className="relative flex items-center justify-center 
                md:ml-0 
                md:flex-col 
                md:items-start 
                md:justify-start 
                md:z-inherit"
            >
                <div className='flex gap-4 bg-white'>
                    <Label className='pt-1 pr-4 text-lg'>
                        Room:
                    </Label>
                    <Input
                    className='bg-blue-200 text-white text-lg'
                    ref={inputRef}
                    type="text"
                    />
                    <Button
                    className=''
                    onClick={()=> joinRoom()}
                    >Join</Button>
                </div>
            </div>
        </div>
    );
}

export default WebRtcChatPage;