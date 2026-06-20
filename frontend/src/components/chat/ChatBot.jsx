import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useAuthStore } from "../../store/authStore";
import { perks } from "../../mock/perks";
import "./ChatBot.css";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama3-8b-8192";
const LS_KEY = "perx-groq-key";

function buildSystemPrompt(user, preferences) {
  const activePerks = perks
    .filter((p) => p.status === "active")
    .map(
      (p) =>
        `• [${p.id}] "${p.title}" — ${p.category}, ${p.price} ALL (${p.discount}% off = ${Math.round(p.price * (1 - p.discount / 100))} ALL), tags: ${p.tags.join(", ")}`
    )
    .join("\n");

  return `You are Perxa, a friendly AI assistant inside the Perx employee benefits platform. Your job is to help employees discover and choose perks that suit their lifestyle and interests.

Employee context:
- Name: ${user?.name || "Employee"}
- Department: ${user?.department || "Unknown"}
- Interests/preferences: ${preferences.length > 0 ? preferences.join(", ") : "not specified yet"}
- Currency: Albanian Lek (ALL). Budget is typically 300–500 ALL per month.

Available active perks:
${activePerks}

Guidelines:
- Suggest perks that match the employee's interests or department.
- When recommending combinations, explain WHY they pair well together and what the total cost would be.
- Keep responses concise and friendly. Use bullet points for perk lists.
- When referencing a perk, mention its name and discounted price.
- If the employee hasn't shared interests, ask one brief follow-up question.
- Never make up perks that aren't in the list above.
- You can suggest 1–3 perks or a combination package.`;
}

export function ChatBot() {
  const role = useAuthStore((s) => s.role);
  const user = useAuthStore((s) => s.user);
  const preferences = useAuthStore((s) => s.preferences);

  const [open, setOpen] = useState(false);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem(LS_KEY) || "");
  const [keyDraft, setKeyDraft] = useState("");
  const [setupDone, setSetupDone] = useState(() => !!localStorage.getItem(LS_KEY));
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `Hi ${user?.name?.split(" ")[0] || "there"}! 👋 I'm Perxa, your perk advisor. Tell me what you're in the mood for — fitness, food, wellness, learning — and I'll suggest the best perks for you.`,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef();

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  if (role !== "employee") return null;

  function saveKey() {
    const k = keyDraft.trim();
    if (!k.startsWith("gsk_")) {
      setError("Groq API keys start with gsk_");
      return;
    }
    localStorage.setItem(LS_KEY, k);
    setApiKey(k);
    setSetupDone(true);
    setError("");
  }

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    setError("");

    const userMsg = { role: "user", content: text };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setLoading(true);

    try {
      const res = await fetch(GROQ_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: MODEL,
          messages: [
            { role: "system", content: buildSystemPrompt(user, preferences) },
            ...updated,
          ],
          temperature: 0.7,
          max_tokens: 512,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        if (res.status === 401) {
          setError("Invalid API key. Check your Groq key and try again.");
          localStorage.removeItem(LS_KEY);
          setSetupDone(false);
          setApiKey("");
        } else {
          setError(body?.error?.message || `Error ${res.status}`);
        }
        setLoading(false);
        return;
      }

      const data = await res.json();
      const reply = data.choices?.[0]?.message?.content || "Sorry, I couldn't get a response.";
      setMessages((m) => [...m, { role: "assistant", content: reply }]);
    } catch (err) {
      setError("Network error. Check your connection.");
    } finally {
      setLoading(false);
    }
  }

  function handleKey(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  const panel = (
    <div className={`chat-panel ${open ? "open" : ""}`}>
      <div className="chat-panel-header">
        <div className="chat-header-info">
          <div className="chat-avatar-ring">P</div>
          <div>
            <strong>Perxa</strong>
            <span>Perk advisor · AI</span>
          </div>
        </div>
        <button className="chat-close-btn" onClick={() => setOpen(false)} aria-label="Close chat">
          ✕
        </button>
      </div>

      {!setupDone ? (
        <div className="chat-setup">
          <div className="chat-setup-icon">🔑</div>
          <p className="chat-setup-title">Connect to AI</p>
          <p className="chat-setup-desc">
            Perxa uses the <strong>Groq API</strong> (free). Get your key at{" "}
            <a href="https://console.groq.com/keys" target="_blank" rel="noreferrer">
              console.groq.com
            </a>
          </p>
          <input
            className="chat-key-input"
            type="password"
            placeholder="gsk_..."
            value={keyDraft}
            onChange={(e) => { setKeyDraft(e.target.value); setError(""); }}
            onKeyDown={(e) => e.key === "Enter" && saveKey()}
          />
          {error && <p className="chat-error">{error}</p>}
          <button className="chat-connect-btn" onClick={saveKey}>
            Connect
          </button>
        </div>
      ) : (
        <>
          <div className="chat-messages">
            {messages.map((m, i) => (
              <div key={i} className={`chat-bubble ${m.role}`}>
                <p>{m.content}</p>
              </div>
            ))}
            {loading && (
              <div className="chat-bubble assistant">
                <div className="chat-typing">
                  <span /><span /><span />
                </div>
              </div>
            )}
            {error && <p className="chat-inline-error">{error}</p>}
            <div ref={bottomRef} />
          </div>

          <div className="chat-input-row">
            <textarea
              className="chat-textarea"
              rows={1}
              placeholder="Ask about perks…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
            />
            <button
              className="chat-send-btn"
              onClick={sendMessage}
              disabled={!input.trim() || loading}
              aria-label="Send"
            >
              ↑
            </button>
          </div>
        </>
      )}
    </div>
  );

  return (
    <>
      <button
        className={`chat-fab ${open ? "active" : ""}`}
        onClick={() => setOpen((v) => !v)}
        aria-label="Open perk advisor"
      >
        {open ? (
          <span style={{ fontSize: "1.1rem" }}>✕</span>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )}
        {!open && messages.length > 1 && (
          <span className="chat-fab-badge">{Math.floor((messages.length - 1) / 2)}</span>
        )}
      </button>
      {createPortal(panel, document.body)}
    </>
  );
}
