import { createDOMRenderer, renderToStyleElements } from '@fluentui/react-components'
import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const renderer = createDOMRenderer()
    const originalRenderPage = ctx.renderPage

    ctx.renderPage = () =>
      originalRenderPage({
        enhanceApp: App =>
          function EnhancedApp(props) {
            const enhancedProps = {
              ...props,
              renderer,
            }

            return <App {...enhancedProps} />
          },
      })

    const initialProps = await Document.getInitialProps(ctx)
    const styles = renderToStyleElements(renderer)

    return {
      ...initialProps,
      styles: (
        <>
          {initialProps.styles}
          {styles}
        </>
      ),
    }
  }

  render() {
    return (
      <Html>
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument