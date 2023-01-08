import Head from 'next/head'
import Script from 'next/script'

import {
  createDOMRenderer,
  FluentProvider,
  SSRProvider,
  RendererProvider,
  webDarkTheme,
} from '@fluentui/react-components'

import '/styles/globals.css'

function App({ Component, pageProps, renderer }) {
  return (
    <>
    <Head>
      <title>UMod</title>

      <meta charSet='UTF-8' />
      <meta name='viewport' content='width=device-width, initial-scale=1' />
      <meta name='description' content='UMod is the best Discord bot for autonomous moderation. It automatically moderates all types of data: texts, links, images, QR codes, files, etc.!' />
      <meta name='keywords' content='discord, bot, autonomous, moderation' />
      <meta name='theme-color' content='#5865f2' />
      <link rel='icon' href='/favicon.ico' />
      <link rel='canonical' href={process.env.BASE_URL} />

      <meta property='og:type' content='website' />
      <meta property='og:url' content={process.env.BASE_URL} />
      <meta property='og:title' content='UMod' />
      <meta property='og:description' content='UMod is the best Discord bot for autonomous moderation. It automatically moderates all types of data: texts, links, images, QR codes, files, etc.!' />
      <meta property='og:image' content={process.env.BASE_URL + '/icon.webp'} />
      
      <meta name='twitter:card' content='summary_large_image' />
      <meta name='twitter:url' content={process.env.BASE_URL} />
      <meta name='twitter:title' content='UMod' />
      <meta name='twitter:description' content='UMod is the best Discord bot for autonomous moderation. It automatically moderates all types of data: texts, links, images, QR codes, files, etc.!' />
      <meta name='twitter:image' content={process.env.BASE_URL + '/icon.webp'} />
    </Head>

    <Script src={'https://www.googletagmanager.com/gtag/js?id=' + process.env.GA_MEASUREMENT_ID} strategy="afterInteractive" />
    <Script id='google-analytics' strategy='afterInteractive'>
      {`
        window.dataLayer = window.dataLayer || [];
        function gtag(){window.dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${process.env.GA_MEASUREMENT_ID}');
      `}
    </Script>

    <RendererProvider renderer={renderer || createDOMRenderer()}>
      <SSRProvider>
        <FluentProvider theme={webDarkTheme}>
          <Component {...pageProps} />
        </FluentProvider>
      </SSRProvider>
    </RendererProvider>
    </>
  )
}

export default App