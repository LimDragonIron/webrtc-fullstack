'use client'

import {
  QueryCache,
  QueryClient,
  QueryClientProvider
} from '@tanstack/react-query'
import React, { useState } from 'react'

const ClientQueryProvider = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache(),
        defaultOptions: {
          queries: {
            staleTime: 30000,
          }
        }
      })
  )

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

export default ClientQueryProvider
