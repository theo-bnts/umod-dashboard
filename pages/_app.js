import { FluentProvider, webLightTheme, webDarkTheme } from '@fluentui/react-components';

import '/styles/globals.css'

function MyApp({ Component, pageProps }) {
  return (
    <FluentProvider theme={webDarkTheme}>
      <Component {...pageProps} />
    </FluentProvider>
  )
}

export default MyApp