"use client"

export interface SignInlayoutProps {
    children: React.ReactNode
  }
  const SignInlayout = ({ children }: SignInlayoutProps) => {
    return (
     <>
        <div className="container-wrapper">
            <div className="container py-6">
                <section className="overflow-hidden rounded-[0.5rem] border bg-background shadow">
                    {children}
                </section>
            </div>
        </div>
     </>
    )
  }
  
  export default SignInlayout
  