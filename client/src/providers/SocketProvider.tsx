'use client'

import { useAccountStore } from '@/stores'
import { useRouter } from 'next/navigation'
import { createContext, useContext, useEffect, useState } from 'react'
import { io as ClientIO } from 'socket.io-client'

type ScoketContextType = {
  socket: any | null
  isConnected: boolean
}

const SokectContext = createContext<ScoketContextType>({
  socket: null,
  isConnected: false
})

export const useSocket = () => {
  return useContext(SokectContext)
}

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<any | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const { accountInfo } = useAccountStore()
  const router = useRouter();

  useEffect(() => {
    if (!socket) {
      return
    }

    socket.on('disconnect', async () => {
      setIsConnected(false)
    })
  }, [socket])

  useEffect(() => {
    const token = accountInfo.access_token
    const socketInstance = new (ClientIO as any)(
      `${process.env.NEXT_PUBLIC_BACK_SOCKET_URL}/socket/chat`,
      {
        withCredentials: true,
        extraHeaders: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    socketInstance.on('connect', async () => {
      setIsConnected(true)
    })

    socketInstance.on('connect_error', (error: any) => {
      alert('Failed to connect to the server. Please try again later.');
      router.back(); // Navigate back to the previous page
    });

    setSocket(socketInstance)

    return () => {
      socketInstance.disconnect()
    }
  }, [accountInfo])

  return (
    <SokectContext.Provider value={{ socket, isConnected }}>
      {children}
    </SokectContext.Provider>
  )
}
