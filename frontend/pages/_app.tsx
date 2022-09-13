import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { useEffect } from 'react';
import { useUserStore } from '@/lib/store';

function MyApp({ Component, pageProps }: AppProps) {
  const documentIsReady = typeof window !== undefined;
  const [user, updateUser] = useUserStore((state) => [state.user, state.updateUser]);

  useEffect(() => {
    if (!documentIsReady) {
      return;
    }

    const getJwtCookie = () => {
      const cookies = document.cookie;
      const jwtToken = cookies
        .split('; ')
        .find((cookie) => cookie.startsWith('jwt='))
        ?.split('=')[1];
      return jwtToken as string;
    };

    updateUser(getJwtCookie());
  }, [documentIsReady]);

  return <Component {...pageProps} />;
}

export default MyApp;
