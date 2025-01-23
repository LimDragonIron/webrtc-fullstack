'use client'
import React from "react"
import { useRouter } from "next/navigation"
import { useAccountStore } from "@/stores"

export interface AppPageProps {

}
const AppPage = () => {
    const router = useRouter()
    const { accountInfo } = useAccountStore();
    const navigateToPage = ( path: string) => {
        router.push(path)
    }

    if(accountInfo.access_token){
        return (
            <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-100">
                <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
                    <h1 className="text-4xl font-bold mb-8">Welcome to the Main Page</h1>
                    <div className="space-x-4">
                        <button
                            onClick={() => navigateToPage('/webrtc')}
                            className="px-4 py-2 m-2 text-white bg-blue-500 rounded hover:bg-blue-600"
                        >
                            Go to WebRTC Page
                        </button>
                    </div>
                </main>
                <footer className="flex items-center justify-center w-full h-24 border-t">
                    <p className="text-gray-600">Powered by Next.js & Tailwind CSS</p>
                </footer>
            </div>
        );
    }

    return (<></>)
    
}

export default AppPage;