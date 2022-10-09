import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { useEffect } from 'react';
import useUserStore from '@/lib/store';
import { getJwtCookie } from '@/lib/cookies';
import Head from 'next/head';

function MyApp({ Component, pageProps }: AppProps) {
  const documentIsReady = typeof window !== 'undefined';
  const { user, updateUser } = useUserStore((state) => ({
    user: state.user,
    updateUser: state.updateUser,
  }));

  useEffect(() => {
    if (!documentIsReady) {
      return;
    }
    const cookie = getJwtCookie();

    updateUser(cookie);
  }, [documentIsReady]);

  return (
    <>
      <Head>
        <title>Leet Deez Nutz</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
