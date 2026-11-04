import { Preferences } from '@capacitor/preferences'
import type { PlayerState } from '../types'

const STORAGE_KEY = 'ascension-os.player.v2'

export const loadPlayer = async (): Promise<PlayerState> => {
  try {
    const native = await Preferences.get({ key: STORAGE_KEY })
    const raw = native.value ?? localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) as PlayerState : (await savePlayer())
  } catch {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) as PlayerState : (await savePlayer())
  }
}

export const savePlayer = async (state?: PlayerState): Promise<PlayerState> => {
  const next = state ?? (await import('../types')).starterState
  const raw = JSON.stringify(next)
  localStorage.setItem(STORAGE_KEY, raw)
  try { await Preferences.set({ key: STORAGE_KEY, value: raw }) } catch { /* browser fallback */ }
  return next
}