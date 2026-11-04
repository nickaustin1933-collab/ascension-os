import { useEffect, useMemo, useState } from 'react'
import { BarChart3, BookOpen, Check, ChevronRight, CircleUserRound, Crosshair, Flame, GitBranch, ListChecks, RotateCcw, Settings, Shield, Sparkles, Target, Trophy, Zap } from 'lucide-react'
import { loadPlayer, savePlayer } from './services/storage'
import { attributeLabels, levelRequirement, starterState, type AttributeKey, type PlayerState, type Quest, type QuestKind } from './types'

type View = 'status' | QuestKind | 'academy' | 'skills' | 'stats' | 'settings'

const navItems: { id: View; label: string; icon: typeof Shield }[] = [
  { id: 'status', label: 'Status', icon: Shield }, { id: 'daily', label: 'Daily Quest', icon: ListChecks },
  { id: 'main', label: 'Main Quest', icon: Target }, { id: 'side', label: 'Side Quest', icon: Crosshair },
  { id: 'academy', label: 'White Room', icon: BookOpen }, { id: 'skills', label: 'Skill Tree', icon: GitBranch },
  { id: 'stats', label: 'Statistics', icon: BarChart3 }, { id: 'settings', label: 'Settings', icon: Settings },
]

function ProgressBar({ value, max, className = '' }: { value: number; max: number; className?: string }) {
  return <div className={`progress ${className}`}><span style={{ width: `${Math.min(100, (value / max) * 100)}%` }} /></div>
}

function QuestCard({ quest, onComplete }: { quest: Quest; onComplete: (id: string) => void }) {
  return <article className={`quest-card ${quest.completed ? 'is-complete' : ''}`}>
    <div className="quest-icon"><Zap size={18} /></div>
    <div className="quest-copy"><span className="eyebrow">{quest.attribute} / +{quest.reward} EXP</span><h3>{quest.title}</h3><p>{quest.description}</p></div>
    <button className="quest-action" disabled={quest.completed} onClick={() => onComplete(quest.id)} aria-label={quest.completed ? 'Quest completed' : `Complete ${quest.title}`}>{quest.completed ? <Check size={18} /> : <ChevronRight size={20} />}</button>
  </article>
}

function Status({ player, onNavigate }: { player: PlayerState; onNavigate: (view: View) => void }) {
  const requirement = levelRequirement(player.level)
  const totalDone = player.quests.filter((quest) => quest.completed).length
  return <>
    <section className="hero-panel panel-grid"><div><span className="eyebrow cyan">PLAYER STATUS / ACTIVE</span><h1>{player.name}</h1><p className="hero-copy">Your next version is built one completed quest at a time.</p><div className="level-row"><strong>LVL {String(player.level).padStart(2, '0')}</strong><span>{player.exp} / {requirement} EXP</span></div><ProgressBar value={player.exp} max={requirement} /></div><div className="level-emblem"><span>RANK</span><strong>A</strong><small>ASCENDER</small></div></section>
    {player.isSample && <div className="sample-note"><Sparkles size={16} /> SAMPLE PROFILE ACTIVE <span>Complete a quest to begin your actual run.</span></div>}
    <div className="stats-grid"><div className="metric panel"><span>QUESTS CLEARED</span><strong>{String(totalDone).padStart(2, '0')}</strong><small>Today&apos;s momentum</small></div><div className="metric panel"><span>CURRENT STREAK</span><strong>{player.streak}<small> DAYS</small></strong><div className="streak"><Flame size={15} /> KEEP THE SIGNAL</div></div><div className="metric panel"><span>ASCENSION SCORE</span><strong>{player.level * 100 + player.exp}</strong><small>Lifetime EXP index</small></div></div>
    <div className="section-heading"><div><span className="eyebrow">SYSTEM READOUT</span><h2>Attribute matrix</h2></div><button className="text-button" onClick={() => onNavigate('stats')}>View all <ChevronRight size={15} /></button></div>
    <div className="attribute-grid">{(Object.keys(player.attributes) as AttributeKey[]).map((key) => <div className="attribute panel" key={key}><div><strong>{key}</strong><span>{attributeLabels[key]}</span></div><b>{player.attributes[key]}</b><ProgressBar value={player.attributes[key]} max={100} /></div>)}</div>
  </>
}

function QuestView({ kind, player, onComplete }: { kind: QuestKind; player: PlayerState; onComplete: (id: string) => void }) {
  const quests = player.quests.filter((quest) => quest.kind === kind)
  const titles = { daily: ['Daily quests', 'Small actions. Compounded power.'], main: ['Main quest', 'The long arc is built in today&apos;s choices.'], side: ['Side quests', 'Optional does not mean inconsequential.'] }
  return <><section className="page-heading"><span className="eyebrow cyan">QUEST LOG / {kind.toUpperCase()}</span><h1>{titles[kind][0]}</h1><p>{titles[kind][1]}</p></section><div className="quest-list">{quests.map((quest) => <QuestCard key={quest.id} quest={quest} onComplete={onComplete} />)}</div>{quests.length === 0 && <div className="empty panel">No quests in this sector yet.</div>}</>
}

function Academy() { return <section className="white-room"><div className="academy-mark"><BookOpen size={22} /><span>WHITE ROOM / ACADEMY</span></div><h1>Make the mind<br /><em>quiet enough</em> to grow.</h1><p>A clean space for deliberate practice, reflection, and deep work. The noise stays outside.</p><div className="academy-grid"><div><span>FOCUS SESSION</span><strong>45:00</strong><button className="dark-button" onClick={() => window.alert('Focus session ready. Start when you are ready.')}>Begin session <ChevronRight size={17} /></button></div><div><span>ACADEMY DIRECTIVE</span><strong>One thing<br />at a time.</strong><small>Today&apos;s practice: protect your attention.</small></div></div></section> }

function Skills({ player }: { player: PlayerState }) { const unlocked = player.level >= 7 ? 3 : 1; return <><section className="page-heading"><span className="eyebrow cyan">PROGRESSION / SKILL TREE</span><h1>Build your arsenal.</h1><p>Unlock capabilities by becoming the kind of person who can hold them.</p></section><div className="skill-tree">{['First Principles', 'Deep Work', 'Emotional Range', 'Financial Clarity', 'Leadership'].map((name, index) => <div className={`skill-node ${index < unlocked ? 'unlocked' : ''}`} key={name}><div className="node-icon">{index < unlocked ? <Check size={17} /> : <GitBranch size={17} />}</div><span>NODE 0{index + 1}</span><strong>{name}</strong><small>{index < unlocked ? 'UNLOCKED' : `REQUIRES LEVEL ${8 + index * 2}`}</small></div>)}</div></> }

function Stats({ player }: { player: PlayerState }) { return <><section className="page-heading"><span className="eyebrow cyan">SYSTEM DATA / STATISTICS</span><h1>Your trajectory.</h1><p>Patterns are evidence. Evidence gives you leverage.</p></section><div className="chart panel"><div className="section-heading"><div><span className="eyebrow">EXP VELOCITY</span><h2>Seven day output</h2></div><span className="chart-total">+{player.exp} EXP</span></div><div className="bars">{['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => <div className="bar-wrap" key={`${day}-${index}`}><div className="bar" style={{ height: `${25 + ((index + player.level) * 13) % 70}%` }} /><span>{day}</span></div>)}</div></div><div className="stats-grid"><div className="metric panel"><span>BEST STREAK</span><strong>{Math.max(player.streak, 12)}<small> DAYS</small></strong><small>Personal record</small></div><div className="metric panel"><span>TOP ATTRIBUTE</span><strong>{(Object.entries(player.attributes).sort(([, a], [, b]) => b - a)[0][0])}</strong><small>Highest current signal</small></div></div></> }

function SettingsView({ player, onReset }: { player: PlayerState; onReset: () => void }) { return <><section className="page-heading"><span className="eyebrow cyan">SYSTEM / CONFIGURATION</span><h1>Settings.</h1><p>Control the conditions of your ascension.</p></section><div className="settings-list panel"><div><span>PLAYER IDENTITY</span><strong>{player.name}</strong><small>Local profile, stored on this device.</small></div><div><span>DATA MODE</span><strong>Local-first persistence</strong><small>Ready for native SQLite migration through Capacitor.</small></div><div><span>DEMO DATA</span><strong>{player.isSample ? 'Sample profile active' : 'Personal progress active'}</strong><button className="outline-button" onClick={onReset}><RotateCcw size={15} /> Reset sample profile</button></div></div></> }

export function App() {
  const [player, setPlayer] = useState<PlayerState | null>(null)
  const [view, setView] = useState<View>('status')
  const [levelUp, setLevelUp] = useState(false)
  useEffect(() => { void loadPlayer().then(setPlayer) }, [])
  const completeQuest = async (id: string) => { if (!player) return; const quest = player.quests.find((item) => item.id === id); if (!quest || quest.completed) return; let exp = player.exp + quest.reward; let level = player.level; while (exp >= levelRequirement(level)) { exp -= levelRequirement(level); level += 1; setLevelUp(true); window.setTimeout(() => setLevelUp(false), 3500) } const next = { ...player, exp, level, isSample: false, lastActive: 'Today', quests: player.quests.map((item) => item.id === id ? { ...item, completed: true } : item), attributes: { ...player.attributes, [quest.attribute]: Math.min(100, player.attributes[quest.attribute] + 2) } }; setPlayer(next); await savePlayer(next) }
  const reset = async () => { setPlayer(starterState); await savePlayer(starterState) }
  const activeTitle = useMemo(() => navItems.find((item) => item.id === view)?.label ?? 'Status', [view])
  if (!player) return <div className="loading"><Zap size={24} /> INITIALIZING SYSTEM...</div>
  return <div className="app-shell"><aside className="sidebar"><div className="brand"><div className="brand-mark">A</div><div><strong>ASCENSION</strong><span>OPERATING SYSTEM</span><small>BY JHONDURD3N</small></div></div><div className="player-mini"><CircleUserRound size={18} /><div><strong>{player.name}</strong><span>LVL {player.level} / RANK A</span></div></div><nav>{navItems.map(({ id, label, icon: Icon }) => <button className={view === id ? 'active' : ''} key={id} onClick={() => setView(id)}><Icon size={17} /><span>{label}</span>{id === 'daily' && player.quests.filter((quest) => quest.kind === 'daily' && !quest.completed).length > 0 && <i />}</button>)}</nav><div className="sidebar-footer"><span>BUILD 001 / ONLINE / JHONDURD3N</span><div className="online-dot" /></div></aside><main><header><button className="mobile-brand" onClick={() => setView('status')}>A / ASCENSION</button><span className="breadcrumb">SYSTEM <ChevronRight size={13} /> {activeTitle.toUpperCase()}</span><div className="header-status"><span className="online-dot" /> LOCAL SYNCED</div></header><div className="content">{view === 'status' && <Status player={player} onNavigate={setView} />}{(view === 'daily' || view === 'main' || view === 'side') && <QuestView kind={view} player={player} onComplete={completeQuest} />}{view === 'academy' && <Academy />}{view === 'skills' && <Skills player={player} />}{view === 'stats' && <Stats player={player} />}{view === 'settings' && <SettingsView player={player} onReset={reset} />}</div></main>{levelUp && <div className="level-toast"><Trophy size={24} /><div><span>ASCENSION CONFIRMED</span><strong>LEVEL {player.level}</strong></div></div>}</div>
}