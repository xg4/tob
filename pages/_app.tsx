import { AppProps } from 'next/app'
import Head from 'next/head'
import '../styles/tailwind.css'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Telegram Bot Push - ToB</title>
      </Head>
      <Component {...pageProps} />
    </>
  )
}
