import { useState } from "react";
import { Avatar } from "../../components/ui/Avatar";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { ProgressBar } from "../../components/ui/ProgressBar";
import { Modal } from "../../components/ui/Modal";
import { useEmployeeStore } from "../../store/employeeStore";
import { toast } from "../../store/notificationStore";
import "../../components/shared/PerkCard.css";
import "../employee/EmployeePages.css";
import "./EmployerPages.css";

const DEPARTMENTS = ["Engineering", "Design", "Marketing", "Sales", "HR", "Finance", "Operations"];

const EMPTY_FORM = { name: "", email: "", department: "Engineering", budgetTotal: 300, password: "" };

export function EmployeeManagement() {
  const employees      = useEmployeeStore((s) => s.employees);
  const addEmployee    = useEmployeeStore((s) => s.addEmployee);
  const updateEmployee = useEmployeeStore((s) => s.updateEmployee);

  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm]           = useState(EMPTY_FORM);
  const [errors, setErrors]       = useState({});
  const [editing, setEditing]     = useState(null);
  const [draft, setDraft]         = useState(0);

  const totalBudget = employees.reduce((s, e) => s + e.budgetTotal, 0);
  const activeCount = employees.filter((e) => e.status === "active").length;

  function field(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: null }));
  }

  function validate() {
    const e = {};
    if (!form.name.trim())               e.name  = "Name is required";
    if (!form.email.trim())              e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
    if (!form.password || form.password.length < 6) e.password = "Password must be at least 6 characters";
    if (Number(form.budgetTotal) <= 0)   e.budgetTotal = "Budget must be greater than 0";
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

  function startEdit(emp) {
    setEditing(emp.id);
    setDraft(emp.budgetTotal);
  }

  function confirmEdit(id) {
    updateEmployee(id, { budgetTotal: Math.max(employees.find(e => e.id === id).budgetUsed, draft) });
    setEditing(null);
  }

  return (
    <div className="dashboard-feed employer-employees">
      <header className="feed-header">
        <p className="feed-kicker">Employees</p>
        <h1>Team management</h1>
        <p className="feed-copy">
          Create employee accounts, view benefit usage, and adjust individual
          budgets.
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
          <strong>€{totalBudget}</strong>
        </div>
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
          const pct      = emp.budgetUsed / emp.budgetTotal;
          const color    = pct >= 1 ? "red" : pct >= 0.8 ? "amber" : "cyan";
          const isEditing = editing === emp.id;

          return (
            <div className="employer-row" key={emp.id}>
              <Avatar name={emp.name} size="sm" />
              <div className="employer-row-center">
                <div className="employer-row-info">
                  <strong>{emp.name}</strong>
                  <span>{emp.email}</span>
                </div>
                <div className="employer-row-budget">
                  <ProgressBar value={emp.budgetUsed} max={emp.budgetTotal} color={color} showPercent />
                  <div className="employer-budget-amounts">
                    <span>{emp.department}</span>
                    <span>€{emp.budgetUsed} / €{emp.budgetTotal}</span>
                  </div>
                </div>
                {isEditing ? (
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <input
                      type="number"
                      className="budget-cap-input"
                      value={draft}
                      min={emp.budgetUsed}
                      step={10}
                      onChange={(e) => setDraft(Number(e.target.value))}
                      autoFocus
                    />
                    <button className="employer-btn-approve" onClick={() => confirmEdit(emp.id)}>Save</button>
                    <button className="employer-btn-reject" onClick={() => setEditing(null)}>✕</button>
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
          );
        })}
      </div>

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
              <label>Monthly budget (€)</label>
              <input
                type="number"
                className={`emp-modal-input ${errors.budgetTotal ? "input-error" : ""}`}
                placeholder="300"
                value={form.budgetTotal}
                min={0}
                step={10}
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
            Share this password with the employee. They can change it from their
            profile after logging in.
          </p>
        </div>
      </Modal>
    </div>
  );
}
