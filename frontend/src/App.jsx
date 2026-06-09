import { useState, useEffect } from "react";
import axios from "axios";
import { Bar, Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend);

const API = "http://localhost/study-buddy-backend";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@300;400;500&display=swap');
  :root {
    --primary: #6366F1; --primary-dark: #4F46E5; --primary-light: #818CF8;
    --bg: #0A0A0F; --bg2: #111118; --bg3: #1A1A28; --card: #16161F;
    --border: rgba(99,102,241,0.18); --text: #F1F1F5; --text-muted: #8888AA;
    --success: #22C55E; --warning: #F59E0B; --danger: #EF4444;
  }
  * { margin:0; padding:0; box-sizing:border-box; }
  body { background:var(--bg); color:var(--text); font-family:'Inter',sans-serif; min-height:100vh; }
  h1,h2,h3,h4,h5,h6 { font-family:'Space Grotesk',sans-serif; }
  .navbar { background:rgba(10,10,15,0.92); backdrop-filter:blur(16px); border-bottom:1px solid var(--border); padding:0.9rem 2rem; position:sticky; top:0; z-index:100; display:flex; align-items:center; justify-content:space-between; }
  .nav-brand { font-family:'Space Grotesk',sans-serif; font-size:1.3rem; font-weight:700; color:var(--primary-light); cursor:pointer; }
  .nav-brand span { color:var(--text); }
  .nav-links { display:flex; gap:0.5rem; align-items:center; }
  .nav-btn { background:none; border:1px solid var(--border); color:var(--text-muted); padding:0.4rem 1rem; border-radius:8px; cursor:pointer; font-size:0.875rem; transition:all 0.2s; }
  .nav-btn:hover, .nav-btn.active { background:var(--primary); border-color:var(--primary); color:#fff; }
  .nav-btn-primary { background:var(--primary); border-color:var(--primary); color:#fff; padding:0.4rem 1.2rem; border-radius:8px; cursor:pointer; font-size:0.875rem; border:none; transition:all 0.2s; }
  .nav-btn-primary:hover { background:var(--primary-dark); }
  .hero { min-height:90vh; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; padding:4rem 2rem; background:radial-gradient(ellipse 80% 60% at 50% 0%, rgba(99,102,241,0.15), transparent); }
  .hero-badge { display:inline-block; background:rgba(99,102,241,0.12); border:1px solid var(--border); color:var(--primary-light); padding:0.3rem 1rem; border-radius:99px; font-size:0.8rem; margin-bottom:1.5rem; letter-spacing:0.05em; }
  .hero h1 { font-size:clamp(2.5rem,6vw,4.5rem); font-weight:700; line-height:1.1; margin-bottom:1.5rem; }
  .hero h1 span { color:var(--primary-light); }
  .hero p { font-size:1.15rem; color:var(--text-muted); max-width:540px; line-height:1.7; margin-bottom:2.5rem; }
  .hero-btns { display:flex; gap:1rem; flex-wrap:wrap; justify-content:center; }
  .btn-main { background:var(--primary); color:#fff; border:none; padding:0.8rem 2rem; border-radius:10px; font-size:1rem; font-weight:600; cursor:pointer; transition:all 0.2s; font-family:'Space Grotesk',sans-serif; }
  .btn-main:hover { background:var(--primary-dark); transform:translateY(-2px); }
  .btn-outline { background:none; color:var(--text); border:1px solid var(--border); padding:0.8rem 2rem; border-radius:10px; font-size:1rem; font-weight:500; cursor:pointer; transition:all 0.2s; font-family:'Space Grotesk',sans-serif; }
  .btn-outline:hover { border-color:var(--primary); color:var(--primary-light); }
  .features { display:grid; grid-template-columns:repeat(auto-fit,minmax(250px,1fr)); gap:1.5rem; padding:3rem 2rem; max-width:1100px; margin:0 auto; }
  .feature-card { background:var(--card); border:1px solid var(--border); border-radius:16px; padding:1.8rem; transition:transform 0.2s,border-color 0.2s; }
  .feature-card:hover { transform:translateY(-4px); border-color:var(--primary); }
  .feature-icon { font-size:2rem; margin-bottom:1rem; display:inline-block; background:rgba(99,102,241,0.1); border-radius:12px; padding:0.5rem 0.7rem; }
  .feature-card h3 { font-size:1.1rem; margin-bottom:0.5rem; }
  .feature-card p { color:var(--text-muted); font-size:0.9rem; line-height:1.6; }
  .stats-bar { display:flex; justify-content:center; gap:4rem; flex-wrap:wrap; padding:3rem 2rem; border-top:1px solid var(--border); border-bottom:1px solid var(--border); background:var(--bg2); }
  .stat { text-align:center; }
  .stat-num { font-family:'Space Grotesk',sans-serif; font-size:2rem; font-weight:700; color:var(--primary-light); }
  .stat-label { color:var(--text-muted); font-size:0.85rem; margin-top:0.2rem; }
  .auth-page { min-height:100vh; display:flex; align-items:center; justify-content:center; padding:2rem; background:radial-gradient(ellipse 60% 60% at 50% 0%, rgba(99,102,241,0.1), transparent); }
  .auth-card { background:var(--card); border:1px solid var(--border); border-radius:20px; padding:2.5rem; width:100%; max-width:420px; }
  .auth-card h2 { font-size:1.8rem; margin-bottom:0.5rem; }
  .auth-card .subtitle { color:var(--text-muted); margin-bottom:2rem; font-size:0.9rem; }
  .form-group { margin-bottom:1.2rem; }
  .form-group label { display:block; margin-bottom:0.4rem; font-size:0.875rem; color:var(--text-muted); }
  .form-input { width:100%; background:var(--bg3); border:1px solid var(--border); color:var(--text); padding:0.7rem 1rem; border-radius:10px; font-size:0.95rem; outline:none; transition:border 0.2s; }
  .form-input:focus { border-color:var(--primary); }
  .form-input option { background:var(--bg3); }
  .btn-full { width:100%; background:var(--primary); color:#fff; border:none; padding:0.85rem; border-radius:10px; font-size:1rem; font-weight:600; cursor:pointer; font-family:'Space Grotesk',sans-serif; margin-top:0.5rem; transition:all 0.2s; }
  .btn-full:hover { background:var(--primary-dark); }
  .auth-switch { text-align:center; margin-top:1.5rem; font-size:0.875rem; color:var(--text-muted); }
  .auth-switch a { color:var(--primary-light); cursor:pointer; }
  .error-msg { background:rgba(239,68,68,0.1); border:1px solid rgba(239,68,68,0.3); color:#FCA5A5; padding:0.7rem 1rem; border-radius:8px; font-size:0.875rem; margin-bottom:1rem; }
  .success-msg { background:rgba(34,197,94,0.1); border:1px solid rgba(34,197,94,0.3); color:#86EFAC; padding:0.7rem 1rem; border-radius:8px; font-size:0.875rem; margin-bottom:1rem; }
  .page { padding:2rem; max-width:1200px; margin:0 auto; }
  .page-title { font-size:1.8rem; font-weight:700; margin-bottom:0.3rem; }
  .page-sub { color:var(--text-muted); font-size:0.9rem; margin-bottom:2rem; }
  .stats-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(200px,1fr)); gap:1.2rem; margin-bottom:2rem; }
  .stat-card { background:var(--card); border:1px solid var(--border); border-radius:14px; padding:1.5rem; transition:transform 0.2s; }
  .stat-card:hover { transform:translateY(-2px); }
  .stat-card-label { color:var(--text-muted); font-size:0.8rem; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:0.5rem; }
  .stat-card-val { font-family:'Space Grotesk',sans-serif; font-size:2rem; font-weight:700; }
  .stat-card-val.indigo { color:var(--primary-light); }
  .stat-card-val.green { color:var(--success); }
  .stat-card-val.yellow { color:var(--warning); }
  .charts-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(340px,1fr)); gap:1.5rem; margin-bottom:2rem; }
  .chart-card { background:var(--card); border:1px solid var(--border); border-radius:14px; padding:1.5rem; }
  .chart-card h4 { font-size:1rem; margin-bottom:1.2rem; color:var(--text-muted); }
  .sessions-table { width:100%; border-collapse:collapse; }
  .sessions-table th { text-align:left; padding:0.75rem 1rem; color:var(--text-muted); font-size:0.8rem; text-transform:uppercase; letter-spacing:0.05em; border-bottom:1px solid var(--border); }
  .sessions-table td { padding:0.85rem 1rem; border-bottom:1px solid rgba(99,102,241,0.08); font-size:0.9rem; }
  .sessions-table tr:hover td { background:rgba(99,102,241,0.04); }
  .badge { display:inline-block; padding:0.2rem 0.7rem; border-radius:99px; font-size:0.75rem; font-weight:600; }
  .badge-high { background:rgba(34,197,94,0.15); color:#86EFAC; }
  .badge-medium { background:rgba(245,158,11,0.15); color:#FCD34D; }
  .badge-low { background:rgba(239,68,68,0.15); color:#FCA5A5; }
  .logger-grid { display:grid; grid-template-columns:1fr 1fr; gap:1.5rem; }
  @media(max-width:700px){ .logger-grid { grid-template-columns:1fr; } }
  .logger-card { background:var(--card); border:1px solid var(--border); border-radius:16px; padding:2rem; }
  .logger-card h3 { font-size:1.2rem; margin-bottom:1.5rem; }
  .result-box { background:var(--bg3); border:1px solid var(--border); border-radius:14px; padding:1.5rem; margin-top:1rem; }
  .result-row { display:flex; justify-content:space-between; align-items:center; padding:0.5rem 0; border-bottom:1px solid var(--border); }
  .result-row:last-child { border-bottom:none; }
  .result-label { color:var(--text-muted); font-size:0.875rem; }
  .result-val { font-weight:600; font-size:1rem; }
  .empty-state { text-align:center; padding:3rem; color:var(--text-muted); }
  .empty-state .icon { font-size:3rem; margin-bottom:1rem; }
  .spinner { display:inline-block; width:16px; height:16px; border:2px solid rgba(255,255,255,0.3); border-top-color:#fff; border-radius:50%; animation:spin 0.6s linear infinite; margin-right:0.5rem; vertical-align:middle; }
  @keyframes spin { to { transform:rotate(360deg); } }
`;

const focusLabel = (n) => ["Low", "Medium", "High"][n] ?? "—";
const focusBadge = (n) => ["badge-low", "badge-medium", "badge-high"][n] ?? "";
const timeOfDayEncode = (t) => ({ morning: 0, afternoon: 1, evening: 2, night: 3 }[t] ?? 0);

export default function App() {
  const [page, setPage] = useState("landing");
  const [user, setUser] = useState(null);
  const [sessions, setSessions] = useState([]);

  const handleLogout = () => { setUser(null); setSessions([]); setPage("landing"); };

  return (
    <>
      <style>{STYLES}</style>
      <Navbar page={page} setPage={setPage} user={user} onLogout={handleLogout} />
      {page === "landing"   && <Landing setPage={setPage} />}
      {page === "login"     && <Login setPage={setPage} setUser={setUser} setSessions={setSessions} />}
      {page === "register"  && <Register setPage={setPage} />}
      {page === "dashboard" && <Dashboard user={user} sessions={sessions} setSessions={setSessions} setPage={setPage} />}
      {page === "logger"    && <SessionLogger user={user} sessions={sessions} setSessions={setSessions} />}
    </>
  );
}

function Navbar({ page, setPage, user, onLogout }) {
  return (
    <nav className="navbar">
      <div className="nav-brand" onClick={() => setPage(user ? "dashboard" : "landing")}>
        Study<span>Buddy</span>
      </div>
      <div className="nav-links">
        {!user ? (
          <>
            <button className="nav-btn" onClick={() => setPage("login")}>Login</button>
            <button className="nav-btn-primary" onClick={() => setPage("register")}>Get Started</button>
          </>
        ) : (
          <>
            <button className={`nav-btn ${page === "dashboard" ? "active" : ""}`} onClick={() => setPage("dashboard")}>Dashboard</button>
            <button className={`nav-btn ${page === "logger" ? "active" : ""}`} onClick={() => setPage("logger")}>Log Session</button>
            <span style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginLeft: "0.5rem" }}>Hi, {user.name}</span>
            <button className="nav-btn" onClick={onLogout} style={{ marginLeft: "0.5rem" }}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}

function Landing({ setPage }) {
  const features = [
    { icon: "🧠", title: "AI Predictions", desc: "ML models predict your focus level and productivity score after every session." },
    { icon: "📊", title: "Smart Dashboard", desc: "Visualize your study habits with beautiful charts and stats." },
    { icon: "📝", title: "Session Logger", desc: "Log every study session — duration, breaks, and time of day." },
    { icon: "🎯", title: "Personalized Tips", desc: "Discover your peak study times and optimal session length." },
  ];
  return (
    <>
      <section className="hero">
        <span className="hero-badge">✨ AI-Powered Study Analytics</span>
        <h1>Study Smarter,<br /><span>Not Harder</span></h1>
        <p>Track sessions, get AI predictions on focus and productivity, and unlock your full academic potential.</p>
        <div className="hero-btns">
          <button className="btn-main" onClick={() => setPage("register")}>Start for Free</button>
          <button className="btn-outline" onClick={() => setPage("login")}>Login</button>
        </div>
      </section>
      <div className="stats-bar">
        {[["50K+","Students"],["4.9★","Rating"],["2M+","Sessions Logged"],["30+","Countries"]].map(([n,l]) => (
          <div className="stat" key={l}><div className="stat-num">{n}</div><div className="stat-label">{l}</div></div>
        ))}
      </div>
      <div className="features">
        {features.map(f => (
          <div className="feature-card" key={f.title}>
            <span className="feature-icon">{f.icon}</span>
            <h3>{f.title}</h3><p>{f.desc}</p>
          </div>
        ))}
      </div>
    </>
  );
}

function Login({ setPage, setUser, setSessions }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async () => {
    if (!form.email || !form.password) { setError("Please fill in all fields."); return; }
    setLoading(true); setError("");
    try {
      const res = await axios.post(`${API}/login.php`, form);
      if (res.data.success) {
        setUser({ id: res.data.user.id, name: res.data.user.name });
        const s = await axios.get(`${API}/sessions.php?user_id=${res.data.user.id}`);
        if (s.data.success) setSessions(s.data.sessions || []);
        setPage("dashboard");
      } else {
        setError(res.data.message || "Invalid credentials.");
      }
    } catch { setError("Cannot connect to server. Make sure XAMPP is running."); }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Welcome back</h2>
        <p className="subtitle">Login to your StudyBuddy account</p>
        {error && <div className="error-msg">{error}</div>}
        <div className="form-group"><label>Email</label><input className="form-input" name="email" type="email" placeholder="you@email.com" value={form.email} onChange={handle} /></div>
        <div className="form-group"><label>Password</label><input className="form-input" name="password" type="password" placeholder="••••••••" value={form.password} onChange={handle} /></div>
        <button className="btn-full" onClick={submit} disabled={loading}>{loading && <span className="spinner"/>}Login</button>
        <div className="auth-switch">No account? <a onClick={() => setPage("register")}>Register</a></div>
      </div>
    </div>
  );
}

function Register({ setPage }) {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async () => {
    if (!form.name || !form.email || !form.password) { setError("Please fill in all fields."); return; }
    if (form.password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setLoading(true); setError(""); setSuccess("");
    try {
      const res = await axios.post(`${API}/register.php`, form);
      if (res.data.success) {
        setSuccess("Account created! Redirecting to login...");
        setTimeout(() => setPage("login"), 1500);
      } else { setError(res.data.message || "Registration failed."); }
    } catch { setError("Cannot connect to server. Make sure XAMPP is running."); }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Create account</h2>
        <p className="subtitle">Start your AI-powered study journey</p>
        {error && <div className="error-msg">{error}</div>}
        {success && <div className="success-msg">{success}</div>}
        <div className="form-group"><label>Full Name</label><input className="form-input" name="name" placeholder="Your name" value={form.name} onChange={handle} /></div>
        <div className="form-group"><label>Email</label><input className="form-input" name="email" type="email" placeholder="you@email.com" value={form.email} onChange={handle} /></div>
        <div className="form-group"><label>Password</label><input className="form-input" name="password" type="password" placeholder="Min 6 characters" value={form.password} onChange={handle} /></div>
        <button className="btn-full" onClick={submit} disabled={loading}>{loading && <span className="spinner"/>}Create Account</button>
        <div className="auth-switch">Already have an account? <a onClick={() => setPage("login")}>Login</a></div>
      </div>
    </div>
  );
}

function Dashboard({ user, sessions, setSessions, setPage }) {
  const chartOpts = { responsive: true, plugins: { legend: { labels: { color: "#8888AA" } } }, scales: { x: { ticks: { color: "#8888AA" }, grid: { color: "rgba(99,102,241,0.08)" } }, y: { ticks: { color: "#8888AA" }, grid: { color: "rgba(99,102,241,0.08)" } } } };

  useEffect(() => {
    if (!user) { setPage("login"); return; }
    axios.get(`${API}/sessions.php?user_id=${user.id}`)
      .then(r => { if (r.data.success) setSessions(r.data.sessions || []); })
      .catch(() => {});
  }, [user]);

  const totalMins = sessions.reduce((s, x) => s + Number(x.duration || 0), 0);
  const avgProd = sessions.length ? Math.round(sessions.reduce((s, x) => s + Number(x.productivity_score || 0), 0) / sessions.length) : 0;
  const highFocus = sessions.filter(s => Number(s.focus_level) === 2).length;

  const last7 = sessions.slice(-7);
  const barData = { labels: last7.map(s => s.subject || "—"), datasets: [{ label: "Duration (min)", data: last7.map(s => s.duration), backgroundColor: "rgba(99,102,241,0.7)", borderRadius: 6 }] };
  const lineData = { labels: last7.map((_, i) => `S${i+1}`), datasets: [{ label: "Productivity", data: last7.map(s => s.productivity_score || 0), borderColor: "#818CF8", backgroundColor: "rgba(99,102,241,0.1)", tension: 0.4, fill: true }] };
  const pieData = { labels: ["Low","Medium","High"], datasets: [{ data: [0,1,2].map(n => sessions.filter(s => Number(s.focus_level) === n).length), backgroundColor: ["#EF4444","#F59E0B","#22C55E"], borderWidth: 0 }] };

  return (
    <div className="page">
      <div className="page-title">Dashboard</div>
      <div className="page-sub">Welcome back, {user?.name} 👋</div>
      <div className="stats-grid">
        {[
          { label: "Total Sessions", val: sessions.length, cls: "indigo" },
          { label: "Total Minutes", val: totalMins, cls: "indigo" },
          { label: "Avg Productivity", val: `${avgProd}%`, cls: "green" },
          { label: "High Focus Sessions", val: highFocus, cls: "yellow" },
        ].map(s => (
          <div className="stat-card" key={s.label}>
            <div className="stat-card-label">{s.label}</div>
            <div className={`stat-card-val ${s.cls}`}>{s.val}</div>
          </div>
        ))}
      </div>
      <div className="charts-grid">
        <div className="chart-card"><h4>📅 Session Duration</h4><Bar data={barData} options={chartOpts} /></div>
        <div className="chart-card"><h4>📈 Productivity Trend</h4><Line data={lineData} options={chartOpts} /></div>
        <div className="chart-card"><h4>🎯 Focus Distribution</h4><Pie data={pieData} options={{ responsive: true, plugins: { legend: { labels: { color: "#8888AA" } } } }} /></div>
      </div>
      <div className="chart-card">
        <h4 style={{ marginBottom: "1rem", color: "var(--text)" }}>Recent Sessions</h4>
        {sessions.length === 0 ? (
          <div className="empty-state"><div className="icon">📚</div><p>No sessions yet. <a style={{ color: "var(--primary-light)", cursor: "pointer" }} onClick={() => setPage("logger")}>Log your first session!</a></p></div>
        ) : (
          <table className="sessions-table">
            <thead><tr><th>Subject</th><th>Duration</th><th>Time of Day</th><th>Break</th><th>Productivity</th><th>Focus</th></tr></thead>
            <tbody>
              {[...sessions].reverse().slice(0, 10).map((s, i) => (
                <tr key={i}>
                  <td>{s.subject}</td>
                  <td>{s.duration} min</td>
                  <td style={{ textTransform: "capitalize" }}>{["Morning","Afternoon","Evening","Night"][s.time_of_day] || s.time_of_day}</td>
                  <td>{s.break_time} min</td>
                  <td>{s.productivity_score ?? "—"}%</td>
                  <td><span className={`badge ${focusBadge(Number(s.focus_level))}`}>{focusLabel(Number(s.focus_level))}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function SessionLogger({ user, sessions, setSessions }) {
  const [form, setForm] = useState({ subject: "", duration: "", sessions_per_day: "1", break_time: "", time_of_day: "morning" });
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  if (!user) return <div className="page"><div className="empty-state"><div className="icon">🔒</div><p>Please login first.</p></div></div>;

  const submit = async () => {
    if (!form.subject || !form.duration || !form.break_time) { setError("Please fill in all fields."); return; }
    setLoading(true); setError(""); setResult(null);
    const payload = {
      user_id: user.id,
      subject: form.subject,
      duration: Number(form.duration),
      sessions_per_day: Number(form.sessions_per_day),
      break_time: Number(form.break_time),
      time_of_day: timeOfDayEncode(form.time_of_day),
    };
    try {
      const res = await axios.post(`${API}/log_session.php`, payload);
      if (res.data.success) {
        const newSession = { ...payload, productivity_score: res.data.productivity_score, focus_level: res.data.focus_level };
        setSessions([...sessions, newSession]);
        setResult({ productivity_score: res.data.productivity_score, focus_level: res.data.focus_level });
        setForm({ subject: "", duration: "", sessions_per_day: "1", break_time: "", time_of_day: "morning" });
      } else { setError(res.data.message || "Failed to save session."); }
    } catch { setError("Cannot connect to server. Make sure XAMPP and Flask are running."); }
    setLoading(false);
  };

  return (
    <div className="page">
      <div className="page-title">Log Study Session</div>
      <div className="page-sub">Record your session and get AI predictions instantly</div>
      <div className="logger-grid">
        <div className="logger-card">
          <h3>Session Details</h3>
          {error && <div className="error-msg">{error}</div>}
          <div className="form-group"><label>Subject</label><input className="form-input" name="subject" placeholder="e.g. Mathematics" value={form.subject} onChange={handle} /></div>
          <div className="form-group"><label>Duration (minutes)</label><input className="form-input" name="duration" type="number" placeholder="e.g. 60" value={form.duration} onChange={handle} /></div>
          <div className="form-group"><label>Sessions Per Day</label><select className="form-input" name="sessions_per_day" value={form.sessions_per_day} onChange={handle}>{[1,2,3,4,5].map(n=><option key={n} value={n}>{n}</option>)}</select></div>
          <div className="form-group"><label>Break Time (minutes)</label><input className="form-input" name="break_time" type="number" placeholder="e.g. 10" value={form.break_time} onChange={handle} /></div>
          <div className="form-group"><label>Time of Day</label><select className="form-input" name="time_of_day" value={form.time_of_day} onChange={handle}><option value="morning">Morning</option><option value="afternoon">Afternoon</option><option value="evening">Evening</option><option value="night">Night</option></select></div>
          <button className="btn-full" onClick={submit} disabled={loading}>{loading && <span className="spinner"/>}{loading ? "Getting AI Prediction..." : "Save & Predict"}</button>
        </div>
        <div className="logger-card">
          <h3>AI Prediction Result</h3>
          {!result ? (
            <div className="empty-state" style={{ padding: "2rem 0" }}>
              <div className="icon">🤖</div>
              <p>Fill in your session details and click Save & Predict to get AI-powered results.</p>
            </div>
          ) : (
            <div className="result-box">
              <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
                <div style={{ fontSize: "3rem", fontWeight: "700", color: "var(--primary-light)", fontFamily: "'Space Grotesk',sans-serif" }}>{result.productivity_score}%</div>
                <div style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>Productivity Score</div>
              </div>
              <div className="result-row"><span className="result-label">Focus Level</span><span className={`badge ${focusBadge(result.focus_level)}`}>{focusLabel(result.focus_level)}</span></div>
              <div className="result-row"><span className="result-label">Productivity</span><span className="result-val" style={{ color: "var(--success)" }}>{result.productivity_score}%</span></div>
              <div style={{ marginTop: "1rem", padding: "0.75rem", background: "rgba(99,102,241,0.08)", borderRadius: "8px", fontSize: "0.85rem", color: "var(--text-muted)" }}>
                {result.focus_level === 2 ? "🔥 Excellent session! You were highly focused." : result.focus_level === 1 ? "👍 Good session. Try reducing distractions next time." : "💡 Consider a shorter session or a different time of day."}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}