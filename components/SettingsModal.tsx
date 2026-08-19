import { useEffect, useState } from 'react'
import {
  ActionIcon,
  Button,
  Group,
  Modal,
  Switch,
  Table,
  TextInput,
  Tooltip,
} from '@mantine/core'
import { IconArrowDown, IconArrowUp, IconSettings } from '@tabler/icons-react'
import { MonitorTarget } from '@/types/config'
import { useDisplaySettings } from './DisplaySettingsProvider'
import { useTranslation } from 'react-i18next'

type Row = {
  id: string
  name: string
  domain: string
  hidden: boolean
}

export default function SettingsModal({
  monitors,
  opened,
  onClose,
}: {
  monitors: MonitorTarget[]
  opened: boolean
  onClose: () => void
}) {
  const { t } = useTranslation('common')
  const { settings, save, reset } = useDisplaySettings()
  const [rows, setRows] = useState<Row[]>([])

  useEffect(() => {
    if (!opened) return
    const order = settings.order.length ? settings.order : monitors.map((m) => m.id)
    setRows(
      monitors.map((m) => ({
        id: m.id,
        name: settings.names[m.id] || m.name,
        domain: settings.domains[m.id] || m.statusPageLink || '',
        hidden: !!settings.hidden[m.id],
      }))
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opened])

  const move = (index: number, dir: -1 | 1) => {
    setRows((prev) => {
      const target = index + dir
      if (target < 0 || target >= prev.length) return prev
      const next = [...prev]
      ;[next[index], next[target]] = [next[target], next[index]]
      return next
    })
  }

  const saveAll = () => {
    save({
      order: rows.map((r) => r.id),
      names: Object.fromEntries(rows.map((r) => [r.id, r.name])),
      domains: Object.fromEntries(rows.map((r) => [r.id, r.domain])),
      hidden: Object.fromEntries(rows.map((r) => [r.id, r.hidden])),
    })
    onClose()
  }

  const resetAll = () => {
    reset()
    setRows(
      monitors.map((m) => ({
        id: m.id,
        name: m.name,
        domain: m.statusPageLink || '',
        hidden: false,
      }))
    )
  }

  return (
    <Modal opened={opened} onClose={onClose} title={t('Settings')} size="lg">
      <Table.ScrollContainer minWidth={0}>
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th style={{ width: 90 }}></Table.Th>
              <Table.Th>{t('Name')}</Table.Th>
              <Table.Th>{t('Domain')}</Table.Th>
              <Table.Th style={{ width: 80 }}>{t('Hidden')}</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {rows.map((row, i) => (
              <Table.Tr key={row.id}>
                <Table.Td>
                  <Group gap={2} wrap="nowrap">
                    <Tooltip label={t('Move up')}>
                      <ActionIcon
                        variant="subtle"
                        size="sm"
                        onClick={() => move(i, -1)}
                        disabled={i === 0}
                      >
                        <IconArrowUp size={16} />
                      </ActionIcon>
                    </Tooltip>
                    <Tooltip label={t('Move down')}>
                      <ActionIcon
                        variant="subtle"
                        size="sm"
                        onClick={() => move(i, 1)}
                        disabled={i === rows.length - 1}
                      >
                        <IconArrowDown size={16} />
                      </ActionIcon>
                    </Tooltip>
                  </Group>
                </Table.Td>
                <Table.Td>
                  <TextInput
                    value={row.name}
                    onChange={(e) =>
                      setRows((prev) =>
                        prev.map((r, idx) => (idx === i ? { ...r, name: e.target.value } : r))
                      )
                    }
                  />
                </Table.Td>
                <Table.Td>
                  <TextInput
                    value={row.domain}
                    placeholder="https://..."
                    onChange={(e) =>
                      setRows((prev) =>
                        prev.map((r, idx) => (idx === i ? { ...r, domain: e.target.value } : r))
                      )
                    }
                  />
                </Table.Td>
                <Table.Td>
                  <Switch
                    checked={row.hidden}
                    onChange={(e) =>
                      setRows((prev) =>
                        prev.map((r, idx) =>
                          idx === i ? { ...r, hidden: e.currentTarget.checked } : r
                        )
                      )
                    }
                  />
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>

      <Group justify="space-between" mt="md">
        <Button variant="subtle" color="red" leftSection={<IconSettings size={16} />} onClick={resetAll}>
          {t('Reset')}
        </Button>
        <Group>
          <Button variant="default" onClick={onClose}>
            {t('Close')}
          </Button>
          <Button onClick={saveAll}>{t('Save')}</Button>
        </Group>
      </Group>
    </Modal>
  )
}