import { useState, useRef } from "react";
import { Avatar }      from "../../components/ui/Avatar";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { ProgressBar } from "../../components/ui/ProgressBar";
import { Modal }       from "../../components/ui/Modal";
import { useEmployeeStore }       from "../../store/employeeStore";
import { toast }                  from "../../store/notificationStore";
import { BirthdayGiftChatbot }    from "../../components/employer/BirthdayGiftChatbot";
import { formatPrice }            from "../../lib/utils";
import "../../components/shared/PerkCard.css";
import "../employee/EmployeePages.css";
import "./EmployerPages.css";

const DEPARTMENTS = ["Engineering", "Design", "Marketing", "Sales", "HR", "Finance", "Operations"];
const EMPTY_FORM  = { name: "", email: "", department: "Engineering", budgetTotal: 5000, password: "" };

/* Pre-written alternative AI summaries shown on "Regenerate" */
const SUMMARY_ALTS = {
  'emp-1': 'Updated analysis: Ana continues to lead in fitness engagement. Her recent activity confirms an accelerating pattern — gym visits are now complemented by yoga and mindfulness sessions, signalling an evolution toward holistic wellbeing. For her birthday, a premium annual gym-and-spa bundle or a curated wellness retreat would be the most impactful gift choice.',
  'emp-2': "Refreshed profile: Erion's benefit mix shows natural growth from pure skill-building into experiential exploration. Tech courses remain a staple, but he has now added travel and cultural dining — suggesting a creative professional seeking broader inspiration outside the screen. For his birthday, a photography workshop, a city-break voucher, or an immersive culinary experience would resonate deeply.",
  'emp-3': "Updated summary: Mira remains the team's most benefit-engaged member. New data confirms she consistently pairs dining events with group wellness sessions — an integrated approach that reflects her social leadership style. A birthday gift combining a premium restaurant experience with a spa or yoga retreat would be an exceptional and personal choice.",
  'emp-4': "Refreshed data: Bledi shows a meaningful shift toward mind-body balance — yoga sessions now appear alongside his regular gym visits, hinting at an expanding definition of fitness. For his birthday, a meditation retreat, a premium sports massage series, or a high-end wellness day experience would represent a meaningful upgrade to his current self-care pattern.",
  'emp-5': "Updated profile: Sara's choices this quarter reinforce a dual focus on professional development and holistic health. She completed a coding module while maintaining regular health checkups — a balanced approach reflecting her HR background. A birthday gift that bridges both dimensions (a leadership coaching programme or a premium digital wellness subscription) would feel deeply personal.",
}

/* ── Birthday helpers ── */
function getBirthdayStatus(birthday) {
  if (!birthday) return null
  const today  = new Date()
  const b      = new Date(birthday)
  let target   = new Date(today.getFullYear(), b.getMonth(), b.getDate())
  let diff     = Math.round((target - today) / 86400000)
  if (diff < 0) {
    target = new Date(today.getFullYear() + 1, b.getMonth(), b.getDate())
    diff   = Math.round((target - today) / 86400000)
  }
  if (diff === 0) return { label: '🎂 Today!', urgent: true,  days: 0 }
  if (diff <= 14) return { label: `🎂 in ${diff}d`, urgent: false, days: diff }
  return null
}

/* ── Typewriter effect ── */
function streamText(text, onUpdate, onDone, speed = 12) {
  let i = 0
  const tick = setInterval(() => {
    i++
    onUpdate(text.slice(0, i))
    if (i >= text.length) { clearInterval(tick); onDone() }
  }, speed)
  return () => clearInterval(tick)
}

/* ═══════════════════════════════════════════ */
export function EmployeeManagement() {
  const employees      = useEmployeeStore((s) => s.employees);
  const addEmployee    = useEmployeeStore((s) => s.addEmployee);
  const updateEmployee = useEmployeeStore((s) => s.updateEmployee);

  /* existing state */
  const [modalOpen, setModalOpen] = useState(false);
  const [form,   setForm]         = useState(EMPTY_FORM);
  const [errors, setErrors]       = useState({});
  const [editing, setEditing]     = useState(null);
  const [draft,   setDraft]       = useState(0);

  /* AI summary state */
  const [summaries,    setSummaries]    = useState(() =>
    Object.fromEntries(employees.map(e => [e.id, e.aiSummary ?? null]))
  );
  const [streamingId,  setStreamingId]  = useState(null);
  const [generatingId, setGeneratingId] = useState(null);
  const stopStreamRef = useRef(null);

  /* birthday chatbot */
  const [chatbotEmployee, setChatbotEmployee] = useState(null);

  /* derived */
  const totalBudget   = employees.reduce((s, e) => s + e.budgetTotal, 0);
  const activeCount   = employees.filter((e) => e.status === "active").length;
  const birthdayCount = employees.filter(e => getBirthdayStatus(e.birthday) !== null).length;

  /* form helpers */
  function field(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: null }));
  }

  function validate() {
    const e = {};
    if (!form.name.trim())  e.name  = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
    if (!form.password || form.password.length < 6) e.password = "Password must be at least 6 characters";
    if (Number(form.budgetTotal) <= 0) e.budgetTotal = "Budget must be greater than 0";
    return e;
  }

  function handleCreate() {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    addEmployee(form);
    toast.success(`Account created for ${form.name}`);
    setModalOpen(false);
    setForm(EMPTY_FORM);
    setErrors({});
  }

  function startEdit(emp) { setEditing(emp.id); setDraft(emp.budgetTotal); }

  function confirmEdit(id) {
    updateEmployee(id, { budgetTotal: Math.max(employees.find(e => e.id === id).budgetUsed, draft) });
    setEditing(null);
  }

  /* summary regeneration */
  function handleRegenerate(emp) {
    stopStreamRef.current?.();
    setGeneratingId(emp.id);
    setSummaries(s => ({ ...s, [emp.id]: '' }));

    setTimeout(() => {
      const next = SUMMARY_ALTS[emp.id] ?? emp.aiSummary ?? 'No summary available for this employee yet.';
      setGeneratingId(null);
      setStreamingId(emp.id);
      stopStreamRef.current = streamText(
        next,
        text => setSummaries(s => ({ ...s, [emp.id]: text })),
        ()   => setStreamingId(null),
      );
    }, 1600);
  }

  return (
    <div className="dashboard-feed employer-employees">
      <header className="feed-header">
        <p className="feed-kicker">Employees</p>
        <h1>Team management</h1>
        <p className="feed-copy">
          Create accounts, view benefit usage, and adjust budgets.
          AI-generated profiles power personalised birthday gifts.
        </p>
      </header>

      <section className="dashboard-metrics">
        <div className="dashboard-metric-card">
          <span>Total employees</span>
          <strong>{employees.length}</strong>
        </div>
        <div className="dashboard-metric-card">
          <span>Active</span>
          <strong>{activeCount}</strong>
        </div>
        <div className="dashboard-metric-card">
          <span>Budget allocated</span>
          <strong>{formatPrice(totalBudget, 'ALL')}</strong>
        </div>
        {birthdayCount > 0 && (
          <div className="dashboard-metric-card emp-birthday-metric">
            <span>Birthdays soon</span>
            <strong>🎂 {birthdayCount}</strong>
          </div>
        )}
      </section>

      <div className="employer-toolbar">
        <p style={{ margin: 0, color: "rgba(226,232,240,0.55)", fontSize: "0.84rem" }}>
          {employees.length} member{employees.length !== 1 ? "s" : ""}
        </p>
        <button className="budget-save-btn" onClick={() => setModalOpen(true)}>
          + Add employee
        </button>
      </div>

      <div className="employer-list">
        {employees.map((emp) => {
          const pct        = emp.budgetUsed / emp.budgetTotal;
          const color      = pct >= 1 ? "red" : pct >= 0.8 ? "amber" : "cyan";
          const isEditing  = editing === emp.id;
          const bdStatus   = getBirthdayStatus(emp.birthday);
          const summary    = summaries[emp.id] ?? null;
          const isStream   = streamingId  === emp.id;
          const isGenerate = generatingId === emp.id;

          return (
            <div
              className={`employer-row employer-row-expandable ${bdStatus?.urgent ? 'employer-row-birthday' : ''}`}
              key={emp.id}
            >
              {/* ── Main row ── */}
              <div className="employer-row-main">
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <Avatar name={emp.name} size="sm" />
                  {bdStatus && (
                    <span
                      className={`emp-bday-dot ${bdStatus.urgent ? 'emp-bday-dot-urgent' : ''}`}
                      title={bdStatus.label}
                    />
                  )}
                </div>

                <div className="employer-row-center">
                  <div className="employer-row-info">
                    <strong>
                      {emp.name}
                      {bdStatus && (
                        <span className={`emp-bday-badge ${bdStatus.urgent ? 'emp-bday-badge-urgent' : ''}`}>
                          {bdStatus.label}
                        </span>
                      )}
                    </strong>
                    <span>{emp.email}</span>
                  </div>

                  <div className="employer-row-budget">
                    <ProgressBar value={emp.budgetUsed} max={emp.budgetTotal} color={color} showPercent />
                    <div className="employer-budget-amounts">
                      <span>{emp.department}</span>
                      <span>{formatPrice(emp.budgetUsed, 'ALL')} / {formatPrice(emp.budgetTotal, 'ALL')}</span>
                    </div>
                  </div>

                  {isEditing ? (
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <input
                        type="number"
                        className="budget-cap-input"
                        value={draft}
                        min={emp.budgetUsed}
                        step={500}
                        onChange={(e) => setDraft(Number(e.target.value))}
                        autoFocus
                      />
                      <button className="employer-btn-approve" onClick={() => confirmEdit(emp.id)}>Save</button>
                      <button className="employer-btn-reject"  onClick={() => setEditing(null)}>✕</button>
                    </div>
                  ) : <span />}
                </div>

                <div className="employer-row-right">
                  <StatusBadge status={emp.status} />
                  {!isEditing && (
                    <button className="employer-btn-approve" onClick={() => startEdit(emp)}>Adjust</button>
                  )}
                </div>
              </div>

              {/* ── AI Summary section ── */}
              <div className="employer-ai-section">
                <div className="employer-ai-header">
                  <span className="employer-ai-label">🤖 AI Summary</span>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    {bdStatus && (
                      <button
                        className="emp-bday-btn"
                        onClick={() => setChatbotEmployee(emp)}
                        title={`Plan a birthday gift for ${emp.name.split(' ')[0]}`}
                      >
                        🎂 Birthday Gift
                      </button>
                    )}
                    <button
                      className="employer-ai-regen"
                      disabled={isGenerate || isStream}
                      onClick={() => handleRegenerate(emp)}
                    >
                      {isGenerate ? '⟳ Generating…' : '↻ Regenerate'}
                    </button>
                  </div>
                </div>

                <div className={`employer-ai-body ${isStream ? 'employer-ai-body-streaming' : ''}`}>
                  {isGenerate
                    ? <span className="employer-ai-thinking"><span /><span /><span /></span>
                    : summary
                      ? summary
                      : <span className="employer-ai-empty">No summary yet — click Regenerate to generate one.</span>
                  }
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Birthday chatbot */}
      <BirthdayGiftChatbot
        employee={chatbotEmployee}
        isOpen={!!chatbotEmployee}
        onClose={() => setChatbotEmployee(null)}
      />

      {/* Add employee modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setForm(EMPTY_FORM); setErrors({}); }}
        title="Create employee account"
        size="md"
        footer={
          <>
            <button
              className="employer-btn-reject"
              style={{ padding: "9px 18px", borderRadius: 10 }}
              onClick={() => { setModalOpen(false); setForm(EMPTY_FORM); setErrors({}); }}
            >
              Cancel
            </button>
            <button className="budget-save-btn" onClick={handleCreate}>
              Create account
            </button>
          </>
        }
      >
        <div className="emp-modal-form">
          <div className="emp-modal-row">
            <div className="emp-modal-field">
              <label>Full name</label>
              <input
                className={`emp-modal-input ${errors.name ? "input-error" : ""}`}
                placeholder="Ana Koci"
                value={form.name}
                onChange={(e) => field("name", e.target.value)}
              />
              {errors.name && <span className="emp-modal-error">{errors.name}</span>}
            </div>
            <div className="emp-modal-field">
              <label>Email address</label>
              <input
                type="email"
                className={`emp-modal-input ${errors.email ? "input-error" : ""}`}
                placeholder="ana@company.al"
                value={form.email}
                onChange={(e) => field("email", e.target.value)}
              />
              {errors.email && <span className="emp-modal-error">{errors.email}</span>}
            </div>
          </div>
          <div className="emp-modal-row">
            <div className="emp-modal-field">
              <label>Department</label>
              <select
                className="emp-modal-input"
                value={form.department}
                onChange={(e) => field("department", e.target.value)}
              >
                {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div className="emp-modal-field">
              <label>Monthly budget (ALL)</label>
              <input
                type="number"
                className={`emp-modal-input ${errors.budgetTotal ? "input-error" : ""}`}
                placeholder="5000"
                value={form.budgetTotal}
                min={0}
                step={500}
                onChange={(e) => field("budgetTotal", e.target.value)}
              />
              {errors.budgetTotal && <span className="emp-modal-error">{errors.budgetTotal}</span>}
            </div>
          </div>
          <div className="emp-modal-field">
            <label>Initial password</label>
            <input
              type="password"
              className={`emp-modal-input ${errors.password ? "input-error" : ""}`}
              placeholder="Min. 6 characters"
              value={form.password}
              onChange={(e) => field("password", e.target.value)}
            />
            {errors.password && <span className="emp-modal-error">{errors.password}</span>}
          </div>
          <p className="emp-modal-hint">
            Share this password with the employee. They can change it from their profile after logging in.
          </p>
        </div>
      </Modal>
    </div>
  );
}
