"use client"

import ClientQueryProvider from "@/providers/ClientQueryProvider";
import { useAccountStore } from "@/stores";
import { useEffect } from "react";


export interface AppLayoutProps {
    children: React.ReactNode
}

const AppLayout = ({children}:AppLayoutProps) => {
    const store = useAccountStore()

    return (
        <ClientQueryProvider>
        <div className="flex flex-1 flex-col">
            <main className="flex flex-1 flex-col">{children}</main>
        </div>
        </ClientQueryProvider>
    );
}

export default AppLayout;