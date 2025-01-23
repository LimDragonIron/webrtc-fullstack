'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAccountStore } from '@/stores';

interface WithAuthProps {
    children: React.ReactNode;
}

const WithAuth = (WrappedComponent: React.ComponentType<WithAuthProps>) => {
    const ComponentWithAuth = (props: WithAuthProps) => {
      const router = useRouter();
      const { accountInfo } = useAccountStore();
  
      useEffect(() => {
        const accessToken = accountInfo.access_token;
        if (accessToken) {
          router.push('/');
        } else if (!accessToken) {
          router.push('/signin');
        }
      }, [accountInfo, router]);
  
      return <WrappedComponent {...props} />;
    };
  
    return ComponentWithAuth;
  };

export default WithAuth;