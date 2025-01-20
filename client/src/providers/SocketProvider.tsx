'use client'

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

  useEffect(() => {
    if (!socket) {
      return
    }

    socket.on('disconnect', async () => {
      setIsConnected(false)
    })
  }, [])

  useEffect(() => {
    const socketInstance = new (ClientIO as any)(
      process.env.NEXT_PUBLIC_BACK_URL,
      {
        path: '/api/v1/socket/chat',
        addTrailingSlash: false
      }
    )

    socketInstance.on('connect', async () => {
      setIsConnected(true)
    })

    setSocket(socketInstance)

    return () => {
      socketInstance.disconnect()
    }
  }, [])

  return (
    <SokectContext.Provider value={{ socket, isConnected }}>
      {children}
    </SokectContext.Provider>
  )
}
