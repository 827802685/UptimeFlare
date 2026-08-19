import { createContext, useContext, useEffect, useState } from 'react'
import { MonitorTarget } from '@/types/config'
import {
  DisplaySettings,
  applySettings,
  clearSettings,
  emptySettings,
  loadSettings,
  saveSettings,
} from '@/util/displaySettings'

type DisplaySettingsContextType = {
  settings: DisplaySettings
  save: (s: DisplaySettings) => void
  reset: () => void
  apply: (monitors: MonitorTarget[]) => MonitorTarget[]
}

const DisplaySettingsContext = createContext<DisplaySettingsContextType>({
  settings: emptySettings,
  save: () => {},
  reset: () => {},
  apply: (m) => m,
})

export function useDisplaySettings() {
  return useContext(DisplaySettingsContext)
}

export default function DisplaySettingsProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [settings, setSettings] = useState<DisplaySettings>(() => loadSettings())

  useEffect(() => {
    saveSettings(settings)
  }, [settings])

  const save = (s: DisplaySettings) => setSettings(s)
  const reset = () => {
    clearSettings()
    setSettings(emptySettings)
  }
  const apply = (monitors: MonitorTarget[]) => applySettings(monitors, settings)

  return (
    <DisplaySettingsContext.Provider value={{ settings, save, reset, apply }}>
      {children}
    </DisplaySettingsContext.Provider>
  )
}