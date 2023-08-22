import PlausibleProvider from 'next-plausible'
import type { AppProps } from 'next/app'
import '../styles/tailwind.css'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <PlausibleProvider domain="formbricks.com" selfHosted={true}>
      <Component {...pageProps} />
    </PlausibleProvider>
  )
}
