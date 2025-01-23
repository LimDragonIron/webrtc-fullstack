'use client'
import { SocketProvider } from '@/providers/SocketProvider';
import React, { useEffect, useRef, useState } from 'react';

export interface WebRtcLayoutProps {
    children: React.ReactNode
}

const WebRtcLayout = ({children}: WebRtcLayoutProps) => {
    return (
        <SocketProvider>
        <div>
            
        </div>
        </SocketProvider>
    );
}

export default WebRtcLayout;