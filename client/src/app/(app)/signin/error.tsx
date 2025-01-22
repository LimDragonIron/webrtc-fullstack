'use client'
 
import { useEffect } from 'react'
 
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])
 
  return (
    <div>
      <h2>Api Response Error</h2>
      <button
        onClick={
          // 재시도
          () => reset()
        }
      >
        Try again
      </button>
    </div>
  )
}  