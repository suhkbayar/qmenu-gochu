import '../../styles/globals.css';
import type { AppProps } from 'next/app';
import { ApolloProvider } from '@apollo/client';
import { I18nextProvider } from 'react-i18next';
import 'animate.css';
import Head from 'next/head';
import client from '../providers/client';
import i18next from 'i18next';
import { LANG_RESOURCES } from '../constants/constantLang';
import { AuthProvider, getPayload } from '../providers/auth';
import { isEmpty } from 'lodash';
import { ThemeProvider } from 'next-themes';
import { Notification } from '../helpers/notification';
import React, { useEffect, useState } from 'react';
import { AlertModal } from '../helpers/alert';
import SubscriptionProvider from '../providers/SubscriptionProvider';
import { useRouter } from 'next/router';
import 'react-simple-keyboard/build/css/index.css';
import { NotificationProvider } from '../providers/notification';

const payload = getPayload();

const initialLanguage = () => {
  return isEmpty(payload?.languages) || payload?.languages[0] === '' || !payload?.languages[0]
    ? 'mn'
    : payload?.languages[0];
};

i18next.init({
  interpolation: { escapeValue: false },
  lng: initialLanguage(),
  resources: LANG_RESOURCES,
});

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  const [animate, setAnimate] = useState('animate__fadeIn');

  useEffect(() => {
    const handleRouteChangeStart = () => {
      setAnimate('animate__fadeOut');
    };

    const handleRouteChangeComplete = () => {
      setAnimate('animate__fadeIn');
    };

    router.events.on('routeChangeStart', handleRouteChangeStart);
    router.events.on('routeChangeComplete', handleRouteChangeComplete);

    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart);
      router.events.off('routeChangeComplete', handleRouteChangeComplete);
    };
  }, [router.events]);

  return (
    <>
      <Head>
        <title>Gochu Korean Chicken</title>
      </Head>
      <ApolloProvider client={client}>
        <I18nextProvider i18n={i18next}>
          <AuthProvider>
            <NotificationProvider>
              <ThemeProvider attribute="class">
                <Notification />
                {/* <AlertModal /> */}
                <SubscriptionProvider>
                  <div className={`animate__animated ${animate}`}>
                    <Component {...pageProps} />
                  </div>
                </SubscriptionProvider>
              </ThemeProvider>
            </NotificationProvider>
          </AuthProvider>
        </I18nextProvider>
      </ApolloProvider>
    </>
  );
}

export default MyApp;
