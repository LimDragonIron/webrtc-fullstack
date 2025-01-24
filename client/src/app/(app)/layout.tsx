"use client"

import ClientQueryProvider from "@/providers/ClientQueryProvider";
import { useAccountStore } from "@/stores";
import { useEffect } from "react";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { ErrorBoundary } from 'react-error-boundary';
import { Button } from "@/components/ui/button";

export interface AppLayoutProps {
    children: React.ReactNode
}

const AppLayout = ({children}:AppLayoutProps) => {
    return (
        <ClientQueryProvider>
            <QueryErrorResetBoundary>
                {({ reset }) => (
                    <ErrorBoundary
                        onReset={reset}
                        fallbackRender={({ error, resetErrorBoundary }) => (
                            <div role="alert">
                              There was an error! { error?.message }
                              <Button onClick={() => resetErrorBoundary()}>Try again</Button>
                            </div>
                          )}
                    >
                    <div className="flex flex-1 flex-col">
                        <main className="flex flex-1 flex-col">{children}</main>
                    </div>
                    </ErrorBoundary>
                )}
            </QueryErrorResetBoundary>
        </ClientQueryProvider>
    );
}

export default  AppLayout;