import Head from 'next/head'

import { Inter } from 'next/font/google'
import { MonitorTarget } from '@/types/config'
import { maintenances, pageConfig } from '@/uptime.config'
import OverallStatus from '@/components/OverallStatus'
import Header from '@/components/Header'
import MonitorList from '@/components/MonitorList'
import { Center, Text } from '@mantine/core'
import MonitorDetail from '@/components/MonitorDetail'
import Footer from '@/components/Footer'
import { useDisplaySettings } from '@/components/DisplaySettingsProvider'
import { useTranslation } from 'react-i18next'
import { CompactedMonitorStateWrapper, getFromStore } from '@/worker/src/store'
import { getCustomMonitors } from '@/util/customMonitors'

export const runtime = 'experimental-edge'
const inter = Inter({ subsets: ['latin'] })

export default function Home({
  compactedStateStr,
  monitors,
}: {
  compactedStateStr: string
  monitors: MonitorTarget[]
  tooltip?: string
  statusPageLink?: string
}) {
  const { t } = useTranslation('common')
  const { apply } = useDisplaySettings()
  const displayedMonitors = apply(monitors)
  const state = new CompactedMonitorStateWrapper(compactedStateStr).uncompact()

  // Compute overall up/down only from visible (non-hidden) monitors
  let visibleUp = 0
  let visibleDown = 0
  for (const monitor of displayedMonitors) {
    const incidents = state.incident[monitor.id]
    if (!incidents || incidents.length === 0) continue
    const lastIncident = incidents[incidents.length - 1]
    if (lastIncident.end === null) {
      visibleDown++
    } else {
      visibleUp++
    }
  }

  // Specify monitorId in URL hash to view a specific monitor (can be used in iframe)
  const monitorId = window.location.hash.substring(1)
  if (monitorId) {
    const monitor = displayedMonitors.find((monitor) => monitor.id === monitorId)
    if (!monitor || !state) {
      return <Text fw={700}>{t('Monitor not found', { id: monitorId })}</Text>
    }
    return (
      <div style={{ maxWidth: '810px' }}>
        <MonitorDetail monitor={monitor} state={state} />
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>{pageConfig.title}</title>
        <link rel="icon" href={pageConfig.favicon ?? '/favicon.png'} />
      </Head>

      <main className={inter.className}>
        <Header monitors={monitors} />

        {state.lastUpdate === 0 ? (
          <Center>
            <Text fw={700}>{t('Monitor State not defined')}</Text>
          </Center>
        ) : (
          <div>
            <OverallStatus
              state={{
                ...state,
                overallUp: visibleUp,
                overallDown: visibleDown,
              }}
              monitors={displayedMonitors}
              maintenances={maintenances}
            />
            <MonitorList monitors={displayedMonitors} state={state} />
          </div>
        )}

        <Footer />
      </main>
    </>
  )
}

export async function getServerSideProps() {
  const { workerConfig } = await import('@/uptime.config')
  // Read state as string from storage, to avoid hitting server-side cpu time limit
  const compactedStateStr = await getFromStore(process.env as any, 'state')

  const customMonitors = await getCustomMonitors(process.env as any)

  const mapMonitor = (monitor: any) => {
    return {
      id: monitor.id,
      name: monitor.name,
      // @ts-ignore
      tooltip: monitor?.tooltip,
      // @ts-ignore
      statusPageLink: monitor?.statusPageLink,
      // @ts-ignore
      hideLatencyChart: monitor?.hideLatencyChart,
      custom: !!monitor.custom,
    }
  }

  // Only present these values to client
  const monitors = [
    ...workerConfig.monitors.map(mapMonitor),
    ...customMonitors.map((m) => ({
      ...mapMonitor(m),
      custom: true,
      statusPageLink: m.statusPageLink || m.target,
    })),
  ]

  return { props: { compactedStateStr, monitors } }
}