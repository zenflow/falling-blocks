import App, { Container } from 'next/app'
import Head from 'next/head'
import { useStaticRendering } from 'mobx-react-lite'

if (!process.browser) {
  useStaticRendering(true)
}

export default class extends App {
  /*
  static async getInitialProps ({Component, ctx}) {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    return {pageProps}
  }
  */
  render () {
    const {Component, pageProps} = this.props;

    return (
      <Container>
        <Head>
          <link href="https://unpkg.com/nes.css@latest/css/nes.min.css" rel="stylesheet"/>
          <link href="https://fonts.googleapis.com/css?family=Press+Start+2P&display=swap" rel="stylesheet"/>
        </Head>
        <Component {...pageProps} />
      </Container>
    )
  }
}
