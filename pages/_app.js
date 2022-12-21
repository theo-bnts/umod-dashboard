import {
  createDOMRenderer,
  FluentProvider,
  SSRProvider,
  RendererProvider,
  webDarkTheme,
} from '@fluentui/react-components'

import '/styles/globals.css'

function MyApp({ Component, pageProps, renderer }) {
  return (
    <RendererProvider renderer={renderer || createDOMRenderer()}>
      <SSRProvider>
        <FluentProvider theme={webDarkTheme}>
          <Component {...pageProps} />
        </FluentProvider>
      </SSRProvider>
    </RendererProvider>
  )
}

export default MyApp