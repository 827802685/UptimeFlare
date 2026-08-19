import { ActionIcon, Container, Group, Image, Tooltip } from '@mantine/core'
import classes from '@/styles/Header.module.css'
import { pageConfig } from '@/uptime.config'
import { PageConfigLink } from '@/types/config'
import { useTranslation } from 'react-i18next'
import { Fragment, useState } from 'react'
import { IconSettings } from '@tabler/icons-react'
import SettingsModal from './SettingsModal'
import { MonitorTarget } from '@/types/config'

export default function Header({
  style,
  monitors,
}: {
  style?: React.CSSProperties
  monitors?: MonitorTarget[]
}) {
  const { t } = useTranslation('common')
  const [settingsOpened, setSettingsOpened] = useState(false)
  const linkToElement = (link: PageConfigLink, i: number) => {
    return (
      <a
        key={i}
        href={link.link}
        target={link.link.startsWith('/') ? undefined : '_blank'}
        className={classes.link}
        data-active={link.highlight}
      >
        {link.label}
      </a>
    )
  }

  const settingsButton = (
    <Tooltip label={t('Settings')}>
      <ActionIcon
        variant="subtle"
        size="lg"
        onClick={() => setSettingsOpened(true)}
        aria-label={t('Settings')}
      >
        <IconSettings size={20} />
      </ActionIcon>
    </Tooltip>
  )

  const renderLinks = (links: PageConfigLink[]) => {
    const result = []
    links.forEach((link, i) => {
      result.push(<Fragment key={i}>{linkToElement(link, i)}</Fragment>)
      if (link.highlight) result.push(settingsButton)
    })
    return result
  }

  const links = [{ label: t('Incidents'), link: '/incidents' }, ...(pageConfig.links || [])]

  return (
    <header className={classes.header} style={style}>
      <Container size="md" className={classes.inner}>
        <div>
          <a
            href={location.pathname == '/' ? 'https://github.com/827802685/UptimeFlare' : '/'}
            target={location.pathname == '/' ? '_blank' : undefined}
          >
            <Image
              src={pageConfig.logo ?? '/logo.svg'}
              h={56}
              w={{ base: 140, sm: 190 }}
              fit="contain"
              alt="logo"
            />
          </a>
        </div>

        <Group gap={5} visibleFrom="sm">
          {renderLinks(links)}
        </Group>

        <Group gap={5} hiddenFrom="sm">
          {renderLinks(links?.filter((link) => link.highlight || link.link.startsWith('/')))}
        </Group>
      </Container>

      <SettingsModal
        opened={settingsOpened}
        onClose={() => setSettingsOpened(false)}
        monitors={monitors || []}
      />
    </header>
  )
}