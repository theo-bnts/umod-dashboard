import { FluentProvider, webLightTheme, webDarkTheme } from '@fluentui/react-components';

import '/styles/globals.css'

function MyApp({ Component, pageProps }) {
  return (
    <FluentProvider theme={webLightTheme}>
      <Component {...pageProps} />
    </FluentProvider>
  )
}

export default MyApp
