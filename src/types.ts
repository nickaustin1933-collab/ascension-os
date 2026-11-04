export type QuestKind = 'daily' | 'main' | 'side'
export type AttributeKey = 'STR' | 'INT' | 'DISC' | 'END' | 'WIS' | 'SOC' | 'FIN'

export interface Quest {
  id: string
  title: string
  description: string
  kind: QuestKind
  reward: number
  attribute: AttributeKey
  completed: boolean
}

export interface Habit {
  id: string
  title: string
  cue: string
  routine: string
  reward: number
  attribute: AttributeKey
  streak: number
  completedToday: boolean
}

export interface PlayerState {
  name: string
  level: number
  exp: number
  attributes: Record<AttributeKey, number>
  quests: Quest[]
  habits: Habit[]
  streak: number
  isSample: boolean
  lastActive: string
}

export const attributeLabels: Record<AttributeKey, string> = {
  STR: 'Strength', INT: 'Intellect', DISC: 'Discipline', END: 'Endurance',
  WIS: 'Wisdom', SOC: 'Social', FIN: 'Finances',
}

export const levelRequirement = (level: number) => 100 + (level - 1) * 50

export const starterState: PlayerState = {
  name: 'PLAYER ONE', level: 7, exp: 186, streak: 4, isSample: true, lastActive: 'Today',
  attributes: { STR: 42, INT: 58, DISC: 35, END: 47, WIS: 39, SOC: 26, FIN: 31 },
  quests: [
    { id: 'daily-focus', title: 'Focus Protocol', description: 'Complete one uninterrupted 45 minute focus block.', kind: 'daily', reward: 40, attribute: 'DISC', completed: false },
    { id: 'daily-movement', title: 'Body Activation', description: 'Move your body for at least 20 minutes.', kind: 'daily', reward: 25, attribute: 'END', completed: true },
    { id: 'main-foundation', title: 'Build Your Foundation', description: 'Complete 7 focused sessions this week.', kind: 'main', reward: 250, attribute: 'DISC', completed: false },
    { id: 'side-reading', title: 'Expand The Mind', description: 'Read 10 pages of a challenging book.', kind: 'side', reward: 30, attribute: 'WIS', completed: false },
    { id: 'side-connect', title: 'Send A Signal', description: 'Reach out to someone who matters.', kind: 'side', reward: 30, attribute: 'SOC', completed: false },
  ],
  habits: [
    { id: 'habit-morning', title: 'Morning activation', cue: 'After I make coffee', routine: 'Two minutes of movement before the day begins.', reward: 20, attribute: 'END', streak: 3, completedToday: false },
    { id: 'habit-review', title: 'Close the loop', cue: 'Before I sleep', routine: 'Write one line about what moved forward today.', reward: 15, attribute: 'WIS', streak: 6, completedToday: false },
  ],
}