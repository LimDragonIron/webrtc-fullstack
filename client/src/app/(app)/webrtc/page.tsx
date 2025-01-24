"use client"

import { useSocket } from '@/providers/SocketProvider';
import React, { useEffect, useRef, useState } from 'react';

export interface WebRtcChatPageProps {

}
const WebRtcChatPage = () => {
    const { socket } = useSocket()
    console.log("this Web Rtc Main")
    console.log(socket)
    return (
        <div>
            WebRtc Page
        </div>
    );
}

export default WebRtcChatPage;