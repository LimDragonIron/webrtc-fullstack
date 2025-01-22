"use client"
import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import SignInAuthForm from './components/SignInAuthForm'

const SignInPage = () => {
    return (
        <div className='flex h-screen'>
          <div className='w-1/2 hidden md:block bg-cover bg-center '>
          <div className="w-450 h-full relative">
            <Image src={"/images/sample.png"} layout='fill'alt='Authentication'/>
          </div>
          </div>
          <div className="w-full md:w-1/2 bg-gray-100 p-10 flex justify-center">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                Create an account
              </h1>
              <p className="text-sm text-muted-foreground">
                Enter your email below to create your account
              </p>
              <SignInAuthForm />
            </div>
          </div>
          </div>
        </div>
    )
}

export default SignInPage