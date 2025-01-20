"use client"

export interface SignInlayoutProps {
    children: React.ReactNode
  }
  const SignInlayout = ({ children }: SignInlayoutProps) => {
    return (
      <div className='mx-auto flex min-h-screen w-full'>
        <main className='flex-1'>{children}</main>
      </div>
    )
  }
  
  export default SignInlayout
  