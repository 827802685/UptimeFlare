import { useEffect, useState } from 'react'
import {
  ActionIcon,
  Alert,
  Button,
  Group,
  Modal,
  PasswordInput,
  Switch,
  Table,
  TextInput,
  Tooltip,
} from '@mantine/core'
import { IconArrowDown, IconArrowUp, IconSettings, IconTrash, IconPlus } from '@tabler/icons-react'
import { MonitorTarget } from '@/types/config'
import { useDisplaySettings } from './DisplaySettingsProvider'
import { useTranslation } from 'react-i18next'

type Row = {
  id: string
  name: string
  domain: string
  hidden: boolean
  custom: boolean
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
  const [authed, setAuthed] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)
  const [newName, setNewName] = useState('')
  const [newDomain, setNewDomain] = useState('')
  const [newError, setNewError] = useState('')
  const [deleteError, setDeleteError] = useState('')

  useEffect(() => {
    if (!opened) return
    const order = settings.order.length ? settings.order : monitors.map((m) => m.id)
    const rowMap = new Map(
      monitors.map((m) => [
        m.id,
        {
          id: m.id,
          name: settings.names[m.id] || m.name,
          domain: settings.domains[m.id] || m.statusPageLink || '',
          hidden: !!settings.hidden[m.id],
          custom: !!m.custom,
        },
      ])
    )
    const sorted = order.map((id) => rowMap.get(id)).filter(Boolean) as Row[]
    const rest = monitors
      .filter((m) => !order.includes(m.id))
      .map((m) => rowMap.get(m.id)!)
    setRows([...sorted, ...rest])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opened])

  const doLogin = async () => {
    setLoginLoading(true)
    setLoginError('')
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      const data = (await res.json()) as { ok?: boolean }
      if (data.ok) {
        setAuthed(true)
      } else {
        setLoginError(t('Invalid credentials'))
      }
    } catch {
      setLoginError(t('Invalid credentials'))
    } finally {
      setLoginLoading(false)
    }
  }

  const addMonitor = async () => {
    setNewError('')
    if (!newName.trim() || !newDomain.trim()) {
      setNewError(t('Name and domain required'))
      return
    }
    if (!/^https?:\/\//.test(newDomain.trim())) {
      setNewError(t('Domain must start with http(s)://'))
      return
    }
    try {
      const res = await fetch('/api/custom-monitors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, name: newName.trim(), target: newDomain.trim() }),
      })
      const data = (await res.json()) as { ok?: boolean }
      if (!data.ok) {
        setNewError(t('Failed to add monitor'))
        return
      }
      setNewName('')
      setNewDomain('')
      window.location.reload()
    } catch {
      setNewError(t('Failed to add monitor'))
    }
  }

  const removeMonitor = async (id: string) => {
    setDeleteError('')
    try {
      const res = await fetch('/api/custom-monitors', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, id }),
      })
      const data = (await res.json()) as { ok?: boolean }
      if (!data.ok) {
        setDeleteError(t('Failed to remove monitor'))
        return
      }
      window.location.reload()
    } catch {
      setDeleteError(t('Failed to remove monitor'))
    }
  }

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
        custom: !!m.custom,
      }))
    )
  }

  if (!authed) {
    return (
      <Modal opened={opened} onClose={onClose} title={t('Settings')} size="sm">
        <TextInput
          label={t('Username')}
          value={username}
          onChange={(e) => setUsername(e.currentTarget.value)}
          mb="sm"
        />
        <PasswordInput
          label={t('Password')}
          value={password}
          onChange={(e) => setPassword(e.currentTarget.value)}
          mb="sm"
          onKeyDown={(e) => {
            if (e.key === 'Enter') doLogin()
          }}
        />
        {loginError && (
          <Alert color="red" variant="light" mb="sm" p="sm">
            {loginError}
          </Alert>
        )}
        <Button fullWidth loading={loginLoading} onClick={doLogin}>
          {t('Login')}
        </Button>
      </Modal>
    )
  }

  return (
    <Modal opened={opened} onClose={onClose} title={t('Settings')} size="lg">
      <Alert color="blue" variant="light" p="sm" mb="md">
        {t('Settings tip')}
      </Alert>

      <Table.ScrollContainer minWidth={0}>
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th style={{ width: 90 }}></Table.Th>
              <Table.Th>{t('Name')}</Table.Th>
              <Table.Th>{t('Domain')}</Table.Th>
              <Table.Th style={{ width: 80 }}>{t('Hidden')}</Table.Th>
              <Table.Th style={{ width: 60 }}></Table.Th>
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
                <Table.Td>
                  {row.custom && (
                    <Tooltip label={t('Remove')}>
                      <ActionIcon variant="subtle" color="red" size="sm" onClick={() => removeMonitor(row.id)}>
                        <IconTrash size={16} />
                      </ActionIcon>
                    </Tooltip>
                  )}
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>

      {deleteError && (
        <Alert color="red" variant="light" mt="sm" p="sm">
          {deleteError}
        </Alert>
      )}

      <Group align="end" mt="md">
        <TextInput
          label={t('New monitor name')}
          value={newName}
          onChange={(e) => setNewName(e.currentTarget.value)}
          style={{ flex: 1 }}
        />
        <TextInput
          label={t('New monitor domain')}
          placeholder="https://example.com"
          value={newDomain}
          onChange={(e) => setNewDomain(e.currentTarget.value)}
          style={{ flex: 1 }}
        />
        <Button leftSection={<IconPlus size={16} />} onClick={addMonitor}>
          {t('Add')}
        </Button>
      </Group>
      {newError && (
        <Alert color="red" variant="light" mt="sm" p="sm">
          {newError}
        </Alert>
      )}

      <Group justify="space-between" mt="md">
        <Group>
          <Button variant="subtle" color="red" leftSection={<IconSettings size={16} />} onClick={resetAll}>
            {t('Reset')}
          </Button>
        </Group>
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