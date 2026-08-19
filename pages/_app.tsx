import '@mantine/core/styles.css'
import type { AppProps } from 'next/app'
import { MantineProvider } from '@mantine/core'
import NoSsr from '@/components/NoSsr'
import DisplaySettingsProvider from '@/components/DisplaySettingsProvider'
import ScrollToTop from '@/components/ScrollToTop'
import '@/util/i18n'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <NoSsr>
      <MantineProvider defaultColorScheme="auto">
        <DisplaySettingsProvider>
          <Component {...pageProps} />
          <ScrollToTop />
        </DisplaySettingsProvider>
      </MantineProvider>
    </NoSsr>
  )
}