import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Avatar }  from '../ui/Avatar'
import { Button }  from '../ui/Button'
import { perks }   from '../../mock/perks'
import { discountedPrice, formatPrice } from '../../lib/utils'
import { toast }   from '../../store/notificationStore'
import './BirthdayGiftChatbot.css'

/* ── helpers ── */

function getBirthdayDays(birthday) {
  if (!birthday) return null
  const today = new Date()
  const b     = new Date(birthday)
  let target  = new Date(today.getFullYear(), b.getMonth(), b.getDate())
  let diff    = Math.round((target - today) / 86400000)
  if (diff < 0) {
    target = new Date(today.getFullYear() + 1, b.getMonth(), b.getDate())
    diff   = Math.round((target - today) / 86400000)
  }
  return diff
}

function extractBudget(text) {
  const m = text.replace(/[,\.]/g, '').match(/\b(\d{3,})\b/)
  if (!m) return null
  const n = parseInt(m[1])
  return n > 0 ? n : null
}

function getSummaryTheme(summary = '') {
  const s = summary.toLowerCase()
  if (s.includes('fitness') || s.includes('gym'))   return 'fitness and wellness'
  if (s.includes('food')    || s.includes('dining')) return 'food and social experiences'
  if (s.includes('learning')|| s.includes('education')) return 'learning and growth'
  if (s.includes('travel'))                          return 'travel and adventure'
  if (s.includes('health'))                          return 'health and wellbeing'
  return 'a range of benefits'
}

function scorePerks(employee, budget) {
  const summary = (employee.aiSummary ?? '').toLowerCase()
  const history = employee.perkHistory ?? []

  return perks
    .filter(p => p.status === 'active')
    .map(p => {
      const finalPrice = Math.round(discountedPrice(p.price, p.discount))
      if (finalPrice > budget) return null
      let score = 0
      if (p.category === 'fitness'  && (summary.includes('fitness') || summary.includes('gym')))    score += 4
      if (p.category === 'wellness' && summary.includes('wellness'))   score += 4
      if (p.category === 'health'   && summary.includes('health'))     score += 4
      if (p.category === 'food'     && (summary.includes('food') || summary.includes('dining')))    score += 4
      if (p.category === 'learning' && (summary.includes('learning') || summary.includes('growth'))) score += 4
      if (p.category === 'travel'   && summary.includes('travel'))     score += 4
      if (history.includes(p.id)) score += 2          // proven favourite
      score += p.discount / 20                        // discount value
      score += (finalPrice / budget) * 2              // closer to budget = better gift
      return { perk: p, score, finalPrice }
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
}

const MEDALS = ['🥇', '🥈', '🥉']
const QUICK_BUDGETS = [3000, 5000, 10000, 20000]

/* ── stream text into a message by ID ── */
function startStream(id, text, setMessages, setIsTyping, onDone, speed = 13) {
  let i = 0
  const tick = setInterval(() => {
    i++
    setMessages(prev =>
      prev.map(m => m.id === id ? { ...m, text: text.slice(0, i), streaming: i < text.length } : m)
    )
    if (i >= text.length) {
      clearInterval(tick)
      setIsTyping(false)
      onDone?.()
    }
  }, speed)
  return () => clearInterval(tick)
}

/* ── Simple bold + newline renderer ── */
function MsgText({ text }) {
  return (
    <>
      {text.split('\n').map((line, li) => (
        <span key={li}>
          {line.split(/(\*\*[^*]+\*\*)/).map((chunk, ci) =>
            chunk.startsWith('**') && chunk.endsWith('**')
              ? <strong key={ci}>{chunk.slice(2, -2)}</strong>
              : chunk
          )}
          {li < text.split('\n').length - 1 && <br />}
        </span>
      ))}
    </>
  )
}

/* ═══════════════════════════════════════════
   Main component
   ═══════════════════════════════════════════ */
export function BirthdayGiftChatbot({ employee, isOpen, onClose }) {
  const [messages,  setMessages]  = useState([])
  const [input,     setInput]     = useState('')
  const [isTyping,  setIsTyping]  = useState(false)
  const [stage,     setStage]     = useState('ask_budget')
  const [recs,      setRecs]      = useState([])
  const bottomRef = useRef()
  const inputRef  = useRef()
  const stopStream = useRef(null)

  /* reset + open intro on each open */
  useEffect(() => {
    if (!isOpen || !employee) return
    stopStream.current?.()
    setMessages([])
    setInput('')
    setStage('ask_budget')
    setRecs([])
    setIsTyping(true)

    const days     = getBirthdayDays(employee.birthday)
    const first    = employee.name.split(' ')[0]
    const theme    = getSummaryTheme(employee.aiSummary)
    const intro    = days === 0
      ? `Hi! 🎂 Today is **${first}'s** birthday!\n\nI've reviewed their benefit history — they consistently gravitate toward **${theme}**. I can recommend the perfect birthday gift based on that profile.\n\nWhat budget do you have in mind? (in Albanian Lek)`
      : `Hi! 🎁 **${first}'s** birthday is in **${days} day${days !== 1 ? 's' : ''}**.\n\nBased on their benefit profile (they love **${theme}**), I can suggest personalized gift options.\n\nWhat budget would you like to allocate? (in ALL)`

    const id = Date.now()
    setMessages([{ id, role: 'bot', text: '', streaming: true }])
    stopStream.current = startStream(id, intro, setMessages, setIsTyping, () => {
      inputRef.current?.focus()
    })

    return () => stopStream.current?.()
  }, [isOpen, employee])

  /* auto-scroll */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function addBotMessage(text, onDone) {
    const id = Date.now()
    setIsTyping(true)
    setMessages(prev => [...prev, { id, role: 'bot', text: '', streaming: true }])
    stopStream.current = startStream(id, text, setMessages, setIsTyping, () => {
      inputRef.current?.focus()
      onDone?.()
    })
  }

  function handleSend(override) {
    const text = (override ?? input).trim()
    if (!text || isTyping) return
    setInput('')
    const userMsg = { id: Date.now() + 1, role: 'user', text }
    setMessages(prev => [...prev, userMsg])
    setTimeout(() => processInput(text), 700)
  }

  function processInput(text) {
    /* stage: ask_budget */
    if (stage === 'ask_budget') {
      const budget = extractBudget(text)
      if (!budget) {
        addBotMessage(`I need a number to work with. Type a budget in ALL — for example **5000** for 5,000 L.`)
        return
      }
      const found = scorePerks(employee, budget)
      setRecs(found)
      setStage('recommending')
      const first = employee.name.split(' ')[0]

      if (found.length === 0) {
        addBotMessage(`I couldn't find any active offers within **${formatPrice(budget, 'ALL')}** that match ${first}'s profile. Could you try a higher budget?`)
        setStage('ask_budget')
        return
      }

      const recLines = found.map((r, i) =>
        `${MEDALS[i]} **${r.perk.title}** — ${r.perk.companyName}\n   ${formatPrice(r.finalPrice, r.perk.currency)}${r.perk.discount > 0 ? ` (${r.perk.discount}% off)` : ''}`
      ).join('\n\n')

      addBotMessage(
        `Great! With a **${formatPrice(budget, 'ALL')}** budget, here are my top picks for ${first}:\n\n${recLines}\n\n` +
        `My recommendation: **${found[0].perk.title}** — it aligns perfectly with ${first}'s interests.\n\nSay **"send"** to confirm my top pick, or name the one you prefer.`
      )
      return
    }

    /* stage: recommending */
    if (stage === 'recommending') {
      const lower = text.toLowerCase()
      const confirming = /\b(send|yes|confirm|ok|sure|go|first|top|1st|#1)\b/i.test(lower)

      let chosen = recs[0]
      recs.forEach((r, i) => {
        const title = r.perk.title.toLowerCase()
        const first = title.split(' ')[0]
        if (lower.includes(first) || lower.includes(String(i + 1)) || lower.includes(MEDALS[i])) {
          chosen = r
        }
      })
      if (lower.includes('second') || lower.includes('2nd')) chosen = recs[1] ?? recs[0]
      if (lower.includes('third')  || lower.includes('3rd')) chosen = recs[2] ?? recs[0]

      if (confirming || chosen !== recs[0] || lower.includes(recs[0]?.perk.title.toLowerCase().split(' ')[0])) {
        setStage('confirmed')
        const first = employee.name.split(' ')[0]
        const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
        addBotMessage(
          `🎉 Birthday gift confirmed!\n\n` +
          `✅ **${chosen.perk.title}** at **${chosen.perk.companyName}**\n` +
          `💰 **${formatPrice(chosen.finalPrice, chosen.perk.currency)}** deducted from company budget\n` +
          `🎂 Tagged as Birthday Gift · ${today}\n\n` +
          `${first} will receive a birthday notification with this gift today. 🎊\n\n` +
          `Want to add a personal note? Or say **done** to close.`
        )
        return
      }

      if (/budget|higher|more|different|change/i.test(lower)) {
        setStage('ask_budget')
        setRecs([])
        addBotMessage(`No problem! What new budget would you like to work with?`)
        return
      }

      addBotMessage(`Just say **"send"** to confirm **${recs[0]?.perk.title}**, or mention the number of your preferred option.`)
      return
    }

    /* stage: confirmed */
    if (stage === 'confirmed') {
      if (/\b(done|close|thanks|thank|bye|finish)\b/i.test(text.toLowerCase())) {
        onClose()
        toast.success(`Birthday gift sent to ${employee.name}! 🎂`)
      } else {
        addBotMessage(`Lovely note! I've added it to the gift. 🎊 Say **done** whenever you're ready to close.`)
      }
    }
  }

  if (!isOpen || !employee) return null
  const days = getBirthdayDays(employee.birthday)

  return createPortal(
    <div className="bgc-backdrop" onClick={onClose}>
      <div className="bgc-modal" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="bgc-header">
          <div className="bgc-header-info">
            <Avatar name={employee.name} size="md" ring />
            <div>
              <div className="bgc-emp-name">{employee.name}</div>
              <div className="bgc-emp-meta">
                {employee.department}
                &nbsp;·&nbsp;
                {days === 0
                  ? <span className="bgc-header-badge">🎂 Birthday Today!</span>
                  : <span className="bgc-header-badge">🎂 in {days} day{days !== 1 ? 's' : ''}</span>
                }
              </div>
            </div>
          </div>
          <button className="bgc-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        {/* Summary context */}
        {employee.aiSummary && (
          <div className="bgc-summary">
            <span className="bgc-summary-label">🤖 AI Profile Summary</span>
            <p className="bgc-summary-text">{employee.aiSummary}</p>
          </div>
        )}

        {/* Messages */}
        <div className="bgc-messages">
          {messages.map(msg => (
            <div key={msg.id} className={`bgc-msg bgc-msg-${msg.role}`}>
              {msg.role === 'bot' && <span className="bgc-bot-icon">🤖</span>}
              <div className={`bgc-bubble ${msg.streaming ? 'bgc-streaming' : ''}`}>
                <MsgText text={msg.text} />
              </div>
            </div>
          ))}
          {isTyping && messages.length === 0 && (
            <div className="bgc-msg bgc-msg-bot">
              <span className="bgc-bot-icon">🤖</span>
              <div className="bgc-bubble bgc-typing"><span /><span /><span /></div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Quick budget chips (only at ask_budget stage) */}
        {stage === 'ask_budget' && !isTyping && (
          <div className="bgc-quick-chips">
            {QUICK_BUDGETS.map(b => (
              <button
                key={b}
                className="bgc-chip"
                onClick={() => handleSend(`${b}`)}
              >
                {formatPrice(b, 'ALL')}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="bgc-input-row">
          <input
            ref={inputRef}
            className="bgc-input"
            placeholder={
              stage === 'ask_budget'    ? 'Enter budget in ALL (e.g. 5000)…'  :
              stage === 'recommending'  ? 'Say "send" to confirm, or pick an option…' :
              'Add a note or say done…'
            }
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            disabled={isTyping}
            autoComplete="off"
          />
          <Button
            variant="primary"
            size="sm"
            onClick={() => handleSend()}
            disabled={isTyping || !input.trim()}
          >
            Send
          </Button>
        </div>

      </div>
    </div>,
    document.body
  )
}
