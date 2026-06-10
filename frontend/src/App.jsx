import { useState, useEffect, useRef } from "react";
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

const IMAGES = {
  hero: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80",
  student: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&q=80",
  dashboard: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&q=80",
  ai: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&q=80",
  books: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&q=80",
  timer: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=400&q=80",
  streak: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400&q=80",
  empty: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=400&q=80",
};

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap');
  :root {
    --primary: #6366F1; --primary-dark: #4F46E5; --primary-light: #818CF8;
    --primary-glow: rgba(99,102,241,0.3);
    --bg: #0A0A0F; --bg2: #111118; --bg3: #1A1A28; --card: #16161F;
    --card-hover: #1E1E2D;
    --border: rgba(99,102,241,0.15); --border-hover: rgba(99,102,241,0.3);
    --text: #F1F1F5; --text-muted: #A0A0C0; --text-dim: #6B6B8A;
    --success: #22C55E; --warning: #F59E0B; --danger: #EF4444; --info: #3B82F6; --teal: #14B8A6;
  }
  * { margin:0; padding:0; box-sizing:border-box; }
  body { background:var(--bg); color:var(--text); font-family:'Inter',sans-serif; min-height:100vh; }
  h1,h2,h3,h4,h5,h6 { font-family:'Space Grotesk',sans-serif; }

  @keyframes fadeInUp { from { opacity:0; transform:translateY(30px); } to { opacity:1; transform:translateY(0); } }
  @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
  @keyframes spin { to { transform:rotate(360deg); } }
  @keyframes toastSlide { from { transform:translateX(100%); opacity:0; } to { transform:translateX(0); opacity:1; } }
  @keyframes toastSlideOut { from { transform:translateX(0); opacity:1; } to { transform:translateX(100%); opacity:0; } }
  @keyframes pulse { 0%,100% { transform:scale(1); } 50% { transform:scale(1.05); } }
  @keyframes float { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-10px); } }

  .navbar { background:rgba(10,10,15,0.95); backdrop-filter:blur(20px); border-bottom:1px solid var(--border); padding:0.8rem 2rem; position:sticky; top:0; z-index:1000; display:flex; align-items:center; justify-content:space-between; }
  .nav-brand { font-family:'Space Grotesk',sans-serif; font-size:1.4rem; font-weight:700; background:linear-gradient(135deg, var(--primary-light), #C084FC); -webkit-background-clip:text; -webkit-text-fill-color:transparent; cursor:pointer; display:flex; align-items:center; gap:0.5rem; }
  .nav-brand-icon { font-size:1.6rem; }
  .nav-links { display:flex; gap:0.6rem; align-items:center; }
  .nav-btn { background:none; border:1px solid transparent; color:var(--text-muted); padding:0.5rem 1.2rem; border-radius:10px; cursor:pointer; font-size:0.875rem; font-weight:500; transition:all 0.2s; }
  .nav-btn:hover { background:rgba(99,102,241,0.1); border-color:var(--border); color:var(--text); }
  .nav-btn.active { background:var(--primary); border-color:var(--primary); color:#fff; box-shadow:0 0 20px rgba(99,102,241,0.3); }
  .nav-btn-primary { background:linear-gradient(135deg, var(--primary), var(--primary-dark)); border:none; color:#fff; padding:0.5rem 1.4rem; border-radius:10px; cursor:pointer; font-size:0.875rem; font-weight:600; transition:all 0.2s; box-shadow:0 4px 15px rgba(99,102,241,0.3); }
  .nav-btn-primary:hover { transform:translateY(-2px); box-shadow:0 6px 25px rgba(99,102,241,0.4); }
  .avatar { width:36px; height:36px; border-radius:50%; object-fit:cover; border:2px solid var(--border); transition:all 0.2s; }
  .avatar:hover { border-color:var(--primary-light); }

  .hero { min-height:100vh; display:flex; align-items:center; justify-content:center; padding:4rem 2rem; position:relative; overflow:hidden; }
  .hero::before { content:''; position:absolute; top:-50%; left:-50%; width:200%; height:200%; background:radial-gradient(ellipse at 30% 20%, rgba(99,102,241,0.12), transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(192,132,252,0.08), transparent 50%); animation:float 8s ease-in-out infinite; }
  .hero-container { display:grid; grid-template-columns:1fr 1fr; gap:4rem; align-items:center; max-width:1200px; width:100%; position:relative; z-index:2; }
  @media(max-width:900px){ .hero-container { grid-template-columns:1fr; text-align:center; } }
  .hero-content { animation:fadeInUp 0.6s ease-out; }
  .hero-badge { display:inline-flex; align-items:center; gap:0.5rem; background:rgba(99,102,241,0.12); border:1px solid var(--border); color:var(--primary-light); padding:0.4rem 1.2rem; border-radius:99px; font-size:0.85rem; margin-bottom:1.5rem; font-weight:500; }
  .hero h1 { font-size:clamp(2.8rem,5vw,4.5rem); font-weight:700; line-height:1.1; margin-bottom:1.5rem; }
  .hero-gradient { background:linear-gradient(135deg, var(--primary-light), #C084FC, #F472B6); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
  .hero p { font-size:1.15rem; color:var(--text-muted); line-height:1.8; margin-bottom:2.5rem; max-width:500px; }
  .hero-btns { display:flex; gap:1rem; flex-wrap:wrap; }
  .hero-image { width:100%; max-width:500px; border-radius:24px; box-shadow:0 25px 50px rgba(0,0,0,0.4); animation:fadeInUp 0.6s ease-out 0.2s both; border:1px solid var(--border); }
  @media(max-width:900px){ .hero-btns { justify-content:center; } .hero p { margin:0 auto 2.5rem; } .hero-image { margin:0 auto; } }

  .btn-main { background:linear-gradient(135deg, var(--primary), var(--primary-dark)); color:#fff; border:none; padding:0.9rem 2.5rem; border-radius:12px; font-size:1.05rem; font-weight:600; cursor:pointer; transition:all 0.3s; font-family:'Space Grotesk',sans-serif; box-shadow:0 4px 20px rgba(99,102,241,0.4); position:relative; overflow:hidden; }
  .btn-main:hover { transform:translateY(-3px); box-shadow:0 8px 30px rgba(99,102,241,0.5); }
  .btn-outline { background:none; color:var(--text); border:1.5px solid var(--border); padding:0.9rem 2.5rem; border-radius:12px; font-size:1.05rem; font-weight:500; cursor:pointer; transition:all 0.3s; font-family:'Space Grotesk',sans-serif; }
  .btn-outline:hover { border-color:var(--primary-light); color:var(--primary-light); background:rgba(99,102,241,0.05); }

  .stats-bar { display:flex; justify-content:center; gap:5rem; flex-wrap:wrap; padding:4rem 2rem; border-top:1px solid var(--border); border-bottom:1px solid var(--border); background:var(--bg2); }
  .stat { text-align:center; animation:fadeInUp 0.5s ease-out both; }
  .stat:nth-child(1) { animation-delay:0s; } .stat:nth-child(2) { animation-delay:0.1s; } .stat:nth-child(3) { animation-delay:0.2s; } .stat:nth-child(4) { animation-delay:0.3s; }
  .stat-num { font-family:'Space Grotesk',sans-serif; font-size:2.5rem; font-weight:700; background:linear-gradient(135deg, var(--primary-light), #C084FC); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
  .stat-label { color:var(--text-muted); font-size:0.9rem; margin-top:0.3rem; font-weight:500; }

  .section-title { font-size:2.2rem; font-weight:700; text-align:center; margin-bottom:0.5rem; background:linear-gradient(135deg, var(--text), var(--primary-light)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
  .section-subtitle { text-align:center; color:var(--text-muted); font-size:1rem; margin-bottom:3rem; }

  .features { display:grid; grid-template-columns:repeat(auto-fit,minmax(300px,1fr)); gap:1.5rem; padding:4rem 2rem; max-width:1200px; margin:0 auto; }
  .feature-card { background:var(--card); border:1px solid var(--border); border-radius:20px; padding:2rem; transition:all 0.3s; position:relative; overflow:hidden; }
  .feature-card::before { content:''; position:absolute; top:0; left:0; right:0; height:3px; background:linear-gradient(90deg, var(--primary), var(--primary-light), #C084FC); opacity:0; transition:opacity 0.3s; }
  .feature-card:hover::before { opacity:1; }
  .feature-card:hover { transform:translateY(-6px); border-color:var(--border-hover); box-shadow:0 20px 40px rgba(0,0,0,0.3); }
  .feature-image { width:100%; height:160px; object-fit:cover; border-radius:12px; margin-bottom:1.2rem; border:1px solid var(--border); }
  .feature-icon { font-size:2.5rem; margin-bottom:1.2rem; display:inline-flex; align-items:center; justify-content:center; width:60px; height:60px; background:linear-gradient(135deg, rgba(99,102,241,0.15), rgba(192,132,252,0.1)); border-radius:16px; }
  .feature-card h3 { font-size:1.2rem; margin-bottom:0.6rem; }
  .feature-card p { color:var(--text-muted); font-size:0.95rem; line-height:1.7; }

  .how-it-works { padding:4rem 2rem; max-width:1000px; margin:0 auto; }
  .steps { display:grid; grid-template-columns:repeat(auto-fit,minmax(250px,1fr)); gap:2rem; margin-top:2rem; }
  .step { text-align:center; padding:2rem; background:var(--card); border:1px solid var(--border); border-radius:20px; position:relative; }
  .step-number { width:50px; height:50px; background:linear-gradient(135deg, var(--primary), var(--primary-dark)); border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:700; font-size:1.2rem; margin:0 auto 1rem; color:#fff; }
  .step h4 { font-size:1.1rem; margin-bottom:0.5rem; }
  .step p { color:var(--text-muted); font-size:0.9rem; line-height:1.6; }

  .cta-section { padding:5rem 2rem; text-align:center; background:linear-gradient(180deg, var(--bg), var(--bg2), var(--bg)); position:relative; }
  .cta-section h2 { font-size:2.5rem; font-weight:700; margin-bottom:1rem; background:linear-gradient(135deg, var(--text), var(--primary-light)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
  .cta-section p { color:var(--text-muted); font-size:1.1rem; max-width:500px; margin:0 auto 2rem; line-height:1.7; }

  .footer { border-top:1px solid var(--border); padding:3rem 2rem 2rem; background:var(--bg2); }
  .footer-content { max-width:1200px; margin:0 auto; display:grid; grid-template-columns:repeat(auto-fit,minmax(200px,1fr)); gap:2rem; }
  .footer-brand { font-family:'Space Grotesk',sans-serif; font-size:1.3rem; font-weight:700; background:linear-gradient(135deg, var(--primary-light), #C084FC); -webkit-background-clip:text; -webkit-text-fill-color:transparent; margin-bottom:0.5rem; }
  .footer-desc { color:var(--text-muted); font-size:0.9rem; line-height:1.6; }
  .footer h4 { font-size:1rem; margin-bottom:1rem; color:var(--text); }
  .footer-links { list-style:none; }
  .footer-links li { margin-bottom:0.5rem; }
  .footer-links a { color:var(--text-muted); text-decoration:none; font-size:0.9rem; transition:color 0.2s; cursor:pointer; }
  .footer-links a:hover { color:var(--primary-light); }
  .footer-bottom { text-align:center; padding-top:2rem; margin-top:2rem; border-top:1px solid var(--border); color:var(--text-dim); font-size:0.85rem; }

  .auth-page { min-height:100vh; display:flex; align-items:center; justify-content:center; padding:2rem; background:radial-gradient(ellipse 60% 60% at 50% 0%, rgba(99,102,241,0.08), transparent); }
  .auth-card { background:var(--card); border:1px solid var(--border); border-radius:24px; padding:3rem; width:100%; max-width:440px; box-shadow:0 25px 50px rgba(0,0,0,0.3); animation:fadeInUp 0.5s ease-out; }
  .auth-card h2 { font-size:2rem; margin-bottom:0.5rem; }
  .auth-card .subtitle { color:var(--text-muted); margin-bottom:2rem; font-size:0.95rem; }
  .form-group { margin-bottom:1.3rem; }
  .form-group label { display:block; margin-bottom:0.5rem; font-size:0.875rem; color:var(--text-muted); font-weight:500; }
  .form-input { width:100%; background:var(--bg3); border:1.5px solid var(--border); color:var(--text); padding:0.8rem 1rem; border-radius:12px; font-size:0.95rem; outline:none; transition:all 0.2s; }
  .form-input:focus { border-color:var(--primary); box-shadow:0 0 0 3px rgba(99,102,241,0.1); }
  .form-input option { background:var(--bg3); }
  .btn-full { width:100%; background:linear-gradient(135deg, var(--primary), var(--primary-dark)); color:#fff; border:none; padding:0.9rem; border-radius:12px; font-size:1rem; font-weight:600; cursor:pointer; font-family:'Space Grotesk',sans-serif; margin-top:0.5rem; transition:all 0.3s; box-shadow:0 4px 15px rgba(99,102,241,0.3); }
  .btn-full:hover { transform:translateY(-2px); box-shadow:0 6px 25px rgba(99,102,241,0.4); }
  .btn-full:disabled { opacity:0.6; cursor:not-allowed; transform:none; }
  .auth-switch { text-align:center; margin-top:1.5rem; font-size:0.875rem; color:var(--text-muted); }
  .auth-switch a { color:var(--primary-light); cursor:pointer; font-weight:500; }
  .auth-switch a:hover { text-decoration:underline; }

  .error-msg { background:rgba(239,68,68,0.08); border:1px solid rgba(239,68,68,0.2); color:#FCA5A5; padding:0.8rem 1rem; border-radius:10px; font-size:0.875rem; margin-bottom:1rem; display:flex; align-items:center; gap:0.5rem; }
  .success-msg { background:rgba(34,197,94,0.08); border:1px solid rgba(34,197,94,0.2); color:#86EFAC; padding:0.8rem 1rem; border-radius:10px; font-size:0.875rem; margin-bottom:1rem; display:flex; align-items:center; gap:0.5rem; }

  .page { padding:2rem; width:100%; max-width:1400px; margin:0 auto; }
  .page-title { font-size:1.8rem; font-weight:700; margin-bottom:0.3rem; }
  .page-sub { color:var(--text-muted); font-size:0.9rem; margin-bottom:2rem; }
  .stats-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); gap:1.2rem; margin-bottom:2rem; }
  .stat-card { background:var(--card); border:1px solid var(--border); border-radius:16px; padding:1.5rem; transition:all 0.3s; position:relative; overflow:hidden; }
  .stat-card:hover { transform:translateY(-3px); border-color:var(--border-hover); box-shadow:0 10px 30px rgba(0,0,0,0.2); }
  .stat-card-icon { width:48px; height:48px; border-radius:12px; display:flex; align-items:center; justify-content:center; font-size:1.5rem; margin-bottom:1rem; }
  .stat-card-icon.indigo { background:rgba(99,102,241,0.15); }
  .stat-card-icon.green { background:rgba(34,197,94,0.15); }
  .stat-card-icon.yellow { background:rgba(245,158,11,0.15); }
  .stat-card-icon.purple { background:rgba(192,132,252,0.15); }
  .stat-card-icon.teal { background:rgba(20,184,166,0.15); }
  .stat-card-label { color:var(--text-muted); font-size:0.75rem; text-transform:uppercase; letter-spacing:0.08em; margin-bottom:0.5rem; font-weight:600; }
  .stat-card-val { font-family:'Space Grotesk',sans-serif; font-size:2.2rem; font-weight:700; }
  .stat-card-val.indigo { color:var(--primary-light); }
  .stat-card-val.green { color:var(--success); }
  .stat-card-val.yellow { color:var(--warning); }
  .stat-card-val.purple { color:#C084FC; }
  .stat-card-val.teal { color:var(--teal); }

  .charts-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(400px,1fr)); gap:1.5rem; margin-bottom:2rem; }
  .chart-card { background:var(--card); border:1px solid var(--border); border-radius:16px; padding:1.5rem; transition:all 0.3s; }
  .chart-card:hover { border-color:var(--border-hover); }
  .chart-card h4 { font-size:1rem; margin-bottom:1.2rem; color:var(--text-muted); display:flex; align-items:center; gap:0.5rem; }

  .table-card { background:var(--card); border:1px solid var(--border); border-radius:16px; padding:1.5rem; overflow-x:auto; }
  .table-card h4 { font-size:1rem; margin-bottom:1.2rem; color:var(--text); display:flex; align-items:center; gap:0.5rem; }
  .sessions-table { width:100%; border-collapse:collapse; }
  .sessions-table th { text-align:left; padding:0.8rem 1rem; color:var(--text-muted); font-size:0.75rem; text-transform:uppercase; letter-spacing:0.05em; border-bottom:1px solid var(--border); font-weight:600; }
  .sessions-table td { padding:0.9rem 1rem; border-bottom:1px solid rgba(99,102,241,0.06); font-size:0.9rem; }
  .sessions-table tr:hover td { background:rgba(99,102,241,0.03); }
  .sessions-table tr:last-child td { border-bottom:none; }

  .badge { display:inline-flex; align-items:center; gap:0.3rem; padding:0.25rem 0.8rem; border-radius:99px; font-size:0.75rem; font-weight:600; }
  .badge-high { background:rgba(34,197,94,0.12); color:#86EFAC; }
  .badge-medium { background:rgba(245,158,11,0.12); color:#FCD34D; }
  .badge-low { background:rgba(239,68,68,0.12); color:#FCA5A5; }

  .logger-grid { display:grid; grid-template-columns:1fr 1fr; gap:1.5rem; }
  @media(max-width:900px){ .logger-grid { grid-template-columns:1fr; } }
  .logger-card { background:var(--card); border:1px solid var(--border); border-radius:20px; padding:2rem; transition:all 0.3s; }
  .logger-card:hover { border-color:var(--border-hover); }
  .logger-card h3 { font-size:1.3rem; margin-bottom:1.5rem; display:flex; align-items:center; gap:0.5rem; }
  .result-box { background:var(--bg3); border:1px solid var(--border); border-radius:16px; padding:1.5rem; margin-top:1rem; }
  .result-row { display:flex; justify-content:space-between; align-items:center; padding:0.6rem 0; border-bottom:1px solid var(--border); }
  .result-row:last-child { border-bottom:none; }
  .result-label { color:var(--text-muted); font-size:0.875rem; }
  .result-val { font-weight:600; font-size:1.1rem; }

  .timer-container { max-width:450px; margin:2rem auto; text-align:center; background:var(--card); border:1px solid var(--border); border-radius:24px; padding:3rem 2.5rem; box-shadow:0 25px 50px rgba(0,0,0,0.3); animation:fadeInUp 0.5s ease-out; }
  .timer-mode-badge { display:inline-flex; align-items:center; gap:0.5rem; padding:0.5rem 1.5rem; border-radius:99px; font-size:0.85rem; font-weight:600; margin-bottom:2rem; text-transform:uppercase; letter-spacing:0.05em; }
  .timer-display { font-size:6rem; font-weight:700; font-family:'Space Grotesk',sans-serif; line-height:1; margin-bottom:2rem; text-shadow:0 0 30px var(--primary-glow); }
  .timer-progress { width:100%; height:6px; background:var(--bg3); border-radius:99px; margin-bottom:2rem; overflow:hidden; }
  .timer-progress-bar { height:100%; border-radius:99px; transition:width 1s linear; }
  .timer-controls { display:flex; gap:1rem; justify-content:center; margin-bottom:1.5rem; }
  .timer-btn { padding:0.8rem 2rem; border-radius:12px; font-size:1rem; font-weight:600; cursor:pointer; transition:all 0.3s; border:none; font-family:'Space Grotesk',sans-serif; }
  .timer-btn-main { background:linear-gradient(135deg, var(--primary), var(--primary-dark)); color:#fff; box-shadow:0 4px 15px rgba(99,102,241,0.3); }
  .timer-btn-main:hover { transform:translateY(-2px); box-shadow:0 6px 25px rgba(99,102,241,0.4); }
  .timer-btn-outline { background:none; color:var(--text); border:1.5px solid var(--border); }
  .timer-btn-outline:hover { border-color:var(--primary-light); color:var(--primary-light); }
  .timer-info { margin-top:1.5rem; padding:1rem; background:var(--bg3); border-radius:12px; font-size:0.85rem; color:var(--text-muted); line-height:1.6; }

  .empty-state { text-align:center; padding:4rem 2rem; color:var(--text-muted); }
  .empty-state .icon { font-size:4rem; margin-bottom:1rem; display:block; }
  .empty-state h3 { font-size:1.2rem; color:var(--text); margin-bottom:0.5rem; }
  .empty-state p { font-size:0.9rem; line-height:1.6; max-width:400px; margin:0 auto; }
  .empty-state img { width:200px; height:200px; object-fit:cover; border-radius:20px; margin-bottom:1.5rem; border:1px solid var(--border); opacity:0.7; }

  .spinner { display:inline-block; width:18px; height:18px; border:2px solid rgba(255,255,255,0.3); border-top-color:#fff; border-radius:50%; animation:spin 0.6s linear infinite; margin-right:0.5rem; vertical-align:middle; }

  .toast-container { position:fixed; top:80px; right:20px; z-index:9999; display:flex; flex-direction:column; gap:0.5rem; }
  .toast { background:var(--card); border:1px solid var(--border); border-radius:12px; padding:1rem 1.5rem; box-shadow:0 10px 30px rgba(0,0,0,0.3); display:flex; align-items:center; gap:0.8rem; min-width:250px; animation:toastSlide 0.3s ease-out; font-size:0.9rem; color:var(--text); }
  .toast.success { border-left:3px solid var(--success); }
  .toast.error { border-left:3px solid var(--danger); }
  .toast.info { border-left:3px solid var(--info); }
  .toast-exit { animation:toastSlideOut 0.3s ease-in forwards; }

  .export-btn { background:none; border:1.5px solid var(--border); color:var(--text-muted); padding:0.5rem 1rem; border-radius:10px; cursor:pointer; font-size:0.85rem; font-weight:500; transition:all 0.2s; display:flex; align-items:center; gap:0.5rem; }
  .export-btn:hover { border-color:var(--success); color:var(--success); background:rgba(34,197,94,0.05); }

  @media(max-width:768px){
    .hero-container { grid-template-columns:1fr; }
    .hero h1 { font-size:2.5rem; }
    .timer-display { font-size:4rem; }
    .stats-bar { gap:2rem; }
    .charts-grid { grid-template-columns:1fr; }
    .page { padding:1rem; }
  }
`;

const focusLabel = (n) => ["Low", "Medium", "High"][n] ?? "—";
const focusBadge = (n) => ["badge-low", "badge-medium", "badge-high"][n] ?? "";
const timeOfDayEncode = (t) => ({ morning: 0, afternoon: 1, evening: 2, night: 3 }[t] ?? 0);
const timeOfDayDecode = (n) => ["Morning", "Afternoon", "Evening", "Night"][n] ?? "—";

function useToast() {
  const [toasts, setToasts] = useState([]);
  const addToast = (message, type = "info", duration = 3000) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.map(t => t.id === id ? { ...t, exiting: true } : t));
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, 300);
    }, duration);
  };
  return { toasts, addToast };
}

function ToastContainer({ toasts }) {
  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast ${t.type} ${t.exiting ? 'toast-exit' : ''}`}>
          <span>{t.type === 'success' ? '✅' : t.type === 'error' ? '❌' : 'ℹ️'}</span>
          {t.message}
        </div>
      ))}
    </div>
  );
}

function AnimatedCounter({ target, suffix = "" }) {
  const [count, setCount] = useState(0);
  const countRef = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        let start = 0;
        const end = target;
        const duration = 1500;
        const increment = end / (duration / 16);
        const timer = setInterval(() => {
          start += increment;
          if (start >= end) { setCount(end); clearInterval(timer); }
          else { setCount(Math.floor(start)); }
        }, 16);
        observer.disconnect();
      }
    });
    if (countRef.current) observer.observe(countRef.current);
    return () => observer.disconnect();
  }, [target]);
  return <span ref={countRef}>{count}{suffix}</span>;
}

export default function App() {
  const [page, setPage] = useState("landing");
  const [user, setUser] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loggerForm, setLoggerForm] = useState({
    subject: "Mathematics",
    duration: "",
    sessions_per_day: "1",
    break_time: "",
    time_of_day: "morning"
  });
  const { toasts, addToast } = useToast();

  useEffect(() => {
    const protectedPages = ["dashboard", "timer", "logger"];
    if (protectedPages.includes(page) && !user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPage("login");
    }
  }, [page, user]);

  const handleLogout = () => {
    setUser(null);
    setSessions([]);
    setPage("landing");
    addToast("Logged out successfully", "success");
  };

  return (
    <>
      <style>{STYLES}</style>
      <ToastContainer toasts={toasts} />
      <Navbar page={page} setPage={setPage} user={user} onLogout={handleLogout} />
      {page === "landing" && <Landing setPage={setPage} />}
      {page === "login" && <Login setPage={setPage} setUser={setUser} setSessions={setSessions} addToast={addToast} />}
      {page === "register" && <Register setPage={setPage} addToast={addToast} />}
      {page === "dashboard" && <Dashboard user={user} sessions={sessions} setSessions={setSessions} setPage={setPage} addToast={addToast} />}
      {page === "timer" && <PomodoroTimer setPage={setPage} setForm={setLoggerForm} addToast={addToast} />}
      {page === "logger" && <SessionLogger user={user} sessions={sessions} setSessions={setSessions} setPage={setPage} prefillForm={loggerForm} addToast={addToast} />}
    </>
  );
}

function Navbar({ page, setPage, user, onLogout }) {
  return (
    <nav className="navbar">
      <div className="nav-brand" onClick={() => setPage(user ? "dashboard" : "landing")}>
        <span className="nav-brand-icon">🎓</span>
        Study<span style={{ background: 'linear-gradient(135deg, #C084FC, #F472B6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Buddy</span>
      </div>
      <div className="nav-links">
        {!user ? (
          <>
            <button className="nav-btn" onClick={() => setPage("login")}>Login</button>
            <button className="nav-btn-primary" onClick={() => setPage("register")}>Get Started</button>
          </>
        ) : (
          <>
            <button className={`nav-btn ${page === "dashboard" ? "active" : ""}`} onClick={() => setPage("dashboard")}>📊 Dashboard</button>
            <button className={`nav-btn ${page === "timer" ? "active" : ""}`} onClick={() => setPage("timer")}>⏱ Timer</button>
            <button className={`nav-btn ${page === "logger" ? "active" : ""}`} onClick={() => setPage("logger")}>📝 Log</button>
            <img src={IMAGES.student} alt="User" className="avatar" />
            <span style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>{user.name}</span>
            <button className="nav-btn" onClick={onLogout}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}

function Landing({ setPage }) {
  const features = [
    { icon: "🧠", image: IMAGES.ai, title: "AI Predictions", desc: "ML models predict your focus level and productivity score after every session." },
    { icon: "📊", image: IMAGES.dashboard, title: "Smart Dashboard", desc: "Visualize your study habits with beautiful charts and real-time stats." },
    { icon: "📝", image: IMAGES.books, title: "Session Logger", desc: "Log every study session — duration, breaks, and time of day." },
    { icon: "🎯", image: IMAGES.streak, title: "Study Streaks", desc: "Build consistency with daily streak tracking and motivation." },
    { icon: "⏱", image: IMAGES.timer, title: "Pomodoro Timer", desc: "Stay focused with built-in 25-minute study timer and break reminders." },
    { icon: "🔥", image: IMAGES.student, title: "Personalized Tips", desc: "Discover your peak study times and optimal session length." },
  ];

  const steps = [
    { num: 1, title: "Create Account", desc: "Sign up in seconds and set your daily study goals." },
    { num: 2, title: "Log Sessions", desc: "Record your study sessions with our smart logger." },
    { num: 3, title: "Get AI Insights", desc: "Receive instant focus and productivity predictions." },
    { num: 4, title: "Track Progress", desc: "Watch your streaks grow and habits improve over time." },
  ];

  return (
    <>
      <section className="hero">
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-badge">✨ AI-Powered Study Analytics</div>
            <h1>
              Study Smarter,<br />
              <span className="hero-gradient">Not Harder</span>
            </h1>
            <p>
              Track sessions, get AI predictions on focus and productivity, 
              and unlock your full academic potential with data-driven insights.
            </p>
            <div className="hero-btns">
              <button className="btn-main" onClick={() => setPage("register")}>
                Start for Free →
              </button>
              <button className="btn-outline" onClick={() => setPage("login")}>
                Already have an account?
              </button>
            </div>
          </div>
          <img src={IMAGES.hero} alt="Student studying" className="hero-image" />
        </div>
      </section>

      <div className="stats-bar">
        <div className="stat">
          <div className="stat-num"><AnimatedCounter target={50000} suffix="+" /></div>
          <div className="stat-label">Active Students</div>
        </div>
        <div className="stat">
          <div className="stat-num">4.9★</div>
          <div className="stat-label">User Rating</div>
        </div>
        <div className="stat">
          <div className="stat-num"><AnimatedCounter target={2000000} suffix="+" /></div>
          <div className="stat-label">Sessions Logged</div>
        </div>
        <div className="stat">
          <div className="stat-num"><AnimatedCounter target={35} suffix="+" /></div>
          <div className="stat-label">Countries</div>
        </div>
      </div>

      <section style={{ padding: '4rem 2rem' }}>
        <h2 className="section-title">Powerful Features</h2>
        <p className="section-subtitle">Everything you need to supercharge your study sessions</p>
        <div className="features">
          {features.map((f, i) => (
            <div className="feature-card" key={f.title} style={{ animationDelay: `${i * 0.1}s` }}>
              <img src={f.image} alt={f.title} className="feature-image" />
              <span className="feature-icon">{f.icon}</span>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="how-it-works">
        <h2 className="section-title">How It Works</h2>
        <p className="section-subtitle">Get started in four simple steps</p>
        <div className="steps">
          {steps.map((s) => (
            <div className="step" key={s.num}>
              <div className="step-number">{s.num}</div>
              <h4>{s.title}</h4>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="cta-section">
        <h2>Ready to Transform Your Studies?</h2>
        <p>Join thousands of students who are already studying smarter with AI-powered analytics.</p>
        <button className="btn-main" onClick={() => setPage("register")}>
          Get Started for Free →
        </button>
      </section>

      <footer className="footer">
        <div className="footer-content">
          <div>
            <div className="footer-brand">StudyBuddy</div>
            <p className="footer-desc">AI-powered study analytics platform for students who want to excel.</p>
          </div>
          <div>
            <h4>Product</h4>
            <ul className="footer-links">
              <li><a onClick={() => setPage("landing")}>Features</a></li>
              <li><a>Pricing</a></li>
              <li><a>Roadmap</a></li>
            </ul>
          </div>
          <div>
            <h4>Company</h4>
            <ul className="footer-links">
              <li><a>About</a></li>
              <li><a>Blog</a></li>
              <li><a>Contact</a></li>
            </ul>
          </div>
          <div>
            <h4>Legal</h4>
            <ul className="footer-links">
              <li><a>Privacy</a></li>
              <li><a>Terms</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          © 2026 StudyBuddy. Built with ❤️ for SZABIST University AI Lab.
        </div>
      </footer>
    </>
  );
}

function Login({ setPage, setUser, setSessions, addToast }) {
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
        addToast(`Welcome back, ${res.data.user.name}!`, "success");
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
        {error && <div className="error-msg">⚠️ {error}</div>}
        <div className="form-group"><label>Email</label><input className="form-input" name="email" type="email" placeholder="you@email.com" value={form.email} onChange={handle} /></div>
        <div className="form-group"><label>Password</label><input className="form-input" name="password" type="password" placeholder="••••••••" value={form.password} onChange={handle} /></div>
        <button className="btn-full" onClick={submit} disabled={loading}>{loading && <span className="spinner" />}Login</button>
        <div className="auth-switch">No account? <a onClick={() => setPage("register")}>Register</a></div>
      </div>
    </div>
  );
}

function Register({ setPage, addToast }) {
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
        addToast("Account created successfully!", "success");
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
        {error && <div className="error-msg">⚠️ {error}</div>}
        {success && <div className="success-msg">✅ {success}</div>}
        <div className="form-group"><label>Full Name</label><input className="form-input" name="name" placeholder="Your name" value={form.name} onChange={handle} /></div>
        <div className="form-group"><label>Email</label><input className="form-input" name="email" type="email" placeholder="you@email.com" value={form.email} onChange={handle} /></div>
        <div className="form-group"><label>Password</label><input className="form-input" name="password" type="password" placeholder="Min 6 characters" value={form.password} onChange={handle} /></div>
        <button className="btn-full" onClick={submit} disabled={loading}>{loading && <span className="spinner" />}Create Account</button>
        <div className="auth-switch">Already have an account? <a onClick={() => setPage("login")}>Login</a></div>
      </div>
    </div>
  );
}

function Dashboard({ user, sessions, setSessions, setPage, addToast }) {
  const [streak, setStreak] = useState({ streak: 0, longest_streak: 0, today_minutes: 0, studied_today: false });
  const [dailyGoal, setDailyGoal] = useState(60);
  const [newGoal, setNewGoal] = useState(60);
  const [showGoalEdit, setShowGoalEdit] = useState(false);
  const [loading, setLoading] = useState(true);

  const chartOpts = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: "#A0A0C0", font: { family: "'Inter', sans-serif", size: 12 } } },
      tooltip: {
        backgroundColor: "rgba(22,22,31,0.95)",
        borderColor: "rgba(99,102,241,0.3)",
        borderWidth: 1,
        padding: 12,
        cornerRadius: 10,
        titleFont: { family: "'Space Grotesk', sans-serif", size: 13 },
        bodyFont: { family: "'Inter', sans-serif", size: 12 },
      }
    },
    scales: {
      x: { ticks: { color: "#A0A0C0", font: { size: 11 } }, grid: { color: "rgba(99,102,241,0.06)" } },
      y: { ticks: { color: "#A0A0C0", font: { size: 11 } }, grid: { color: "rgba(99,102,241,0.06)" } },
    },
  };

  useEffect(() => {
    if (!user) { setPage("login"); return; }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    Promise.all([
      axios.get(`${API}/sessions.php?user_id=${user.id}`),
      axios.get(`${API}/streak.php?user_id=${user.id}`)
    ]).then(([sRes, stRes]) => {
      if (sRes.data.success) setSessions(sRes.data.sessions || []);
      if (stRes.data.success) setStreak(stRes.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [setPage, setSessions, user]);

  const updateGoal = async () => {
    try {
      await axios.post(`${API}/update_goal.php`, { user_id: user.id, daily_goal: newGoal });
      setDailyGoal(newGoal);
      setShowGoalEdit(false);
      addToast("Daily goal updated!", "success");
    } catch { addToast("Failed to update goal", "error"); }
  };

  const exportCSV = () => {
    if (!sessions.length) { addToast("No sessions to export", "error"); return; }
    const headers = ["Subject", "Duration", "Time", "Break", "Productivity", "Focus", "Date"];
    const rows = sessions.map(s => [s.subject, s.duration, timeOfDayDecode(s.time_of_day), s.break_time, s.productivity_score, focusLabel(s.focus_level), s.created_at]);
    const csv = [headers, ...rows].map(r => r.join(",")).join(String.fromCharCode(10));
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `study-data-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    addToast("Data exported to CSV!", "success");
  };

  const totalMins = sessions.reduce((s, x) => s + Number(x.duration || 0), 0);
  const avgProd = sessions.length ? Math.round(sessions.reduce((s, x) => s + Number(x.productivity_score || 0), 0) / sessions.length) : 0;
  const highFocus = sessions.filter(s => Number(s.focus_level) === 2).length;
  const goalPercent = Math.min((streak.today_minutes / dailyGoal) * 100, 100);

  const last7 = sessions.slice(-7);
  const barData = {
    labels: last7.map(s => s.subject || "—"),
    datasets: [{
      label: "Duration (min)",
      data: last7.map(s => s.duration),
      backgroundColor: "rgba(99,102,241,0.7)",
      borderRadius: 8,
      borderSkipped: false,
    }]
  };
  const lineData = {
    labels: last7.map((_, i) => `S${i + 1}`),
    datasets: [{
      label: "Productivity",
      data: last7.map(s => s.productivity_score || 0),
      borderColor: "#818CF8",
      backgroundColor: "rgba(99,102,241,0.1)",
      tension: 0.4,
      fill: true,
      pointBackgroundColor: "#818CF8",
      pointBorderColor: "#fff",
      pointBorderWidth: 2,
      pointRadius: 5,
      pointHoverRadius: 7,
    }]
  };
  const pieData = {
    labels: ["Low", "Medium", "High"],
    datasets: [{
      data: [0, 1, 2].map(n => sessions.filter(s => Number(s.focus_level) === n).length),
      backgroundColor: ["#EF4444", "#F59E0B", "#22C55E"],
      borderWidth: 0,
      hoverOffset: 10,
    }]
  };

  if (loading) {
    return (
      <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner" style={{ width: 40, height: 40, borderWidth: 3, display: 'block', margin: '0 auto 1rem' }} />
          <p style={{ color: 'var(--text-muted)' }}>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.3rem", flexWrap: "wrap", gap: "1rem" }}>
        <div className="page-title">Dashboard</div>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", background: "var(--card)", border: "1px solid var(--border)", borderRadius: "10px", padding: "0.5rem 1rem" }}>
            <span style={{ fontSize: "1.5rem", marginRight: "0.3rem" }}>{streak.streak > 0 ? "🔥" : "⚡"}</span>
            <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, color: "var(--warning)" }}>{streak.streak}</span>
            <span style={{ color: "var(--text-muted)", fontSize: "0.8rem", marginLeft: "0.3rem" }}>day streak</span>
          </div>
          <button onClick={exportCSV} className="export-btn">
            📥 Export CSV
          </button>
        </div>
      </div>
      <div className="page-sub">Welcome back, {user?.name} 👋 {streak.studied_today ? "Great job studying today!" : "Log a session to keep your streak alive!"}</div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-icon indigo">📚</div>
          <div className="stat-card-label">Total Sessions</div>
          <div className="stat-card-val indigo">{sessions.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon green">⏱</div>
          <div className="stat-card-label">Total Minutes</div>
          <div className="stat-card-val green">{totalMins}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon purple">📈</div>
          <div className="stat-card-label">Avg Productivity</div>
          <div className="stat-card-val purple">{avgProd}%</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon yellow">🎯</div>
          <div className="stat-card-label">High Focus</div>
          <div className="stat-card-val yellow">{highFocus}</div>
        </div>
        <div className="stat-card" style={{ position: "relative" }}>
          <div className="stat-card-icon teal">🎯</div>
          <div className="stat-card-label">Daily Goal</div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div className="stat-card-val teal">{streak.today_minutes}/{dailyGoal}m</div>
            <button onClick={() => setShowGoalEdit(!showGoalEdit)} style={{ background: "none", border: "1px solid var(--border)", color: "var(--text-muted)", padding: "0.2rem 0.6rem", borderRadius: "6px", fontSize: "0.75rem", cursor: "pointer" }}>Edit</button>
          </div>
          {showGoalEdit && (
            <div style={{ marginTop: "0.8rem", display: "flex", gap: "0.5rem" }}>
              <input type="number" value={newGoal} onChange={(e) => setNewGoal(Number(e.target.value))} style={{ width: "60px", background: "var(--bg3)", border: "1px solid var(--border)", color: "var(--text)", padding: "0.3rem", borderRadius: "6px", fontSize: "0.8rem" }} />
              <button onClick={updateGoal} style={{ background: "var(--success)", color: "#fff", border: "none", padding: "0.3rem 0.8rem", borderRadius: "6px", fontSize: "0.8rem", cursor: "pointer" }}>Save</button>
            </div>
          )}
          <div style={{ marginTop: "0.8rem", height: "6px", background: "var(--bg3)", borderRadius: "99px", overflow: "hidden" }}>
            <div style={{ width: `${goalPercent}%`, height: "100%", background: "var(--success)", borderRadius: "99px", transition: "width 0.5s" }} />
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon indigo">🏆</div>
          <div className="stat-card-label">Longest Streak</div>
          <div className="stat-card-val indigo">{streak.longest_streak} days</div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card"><h4>📅 Session Duration</h4><div style={{ height: 280 }}><Bar data={barData} options={chartOpts} /></div></div>
        <div className="chart-card"><h4>📈 Productivity Trend</h4><div style={{ height: 280 }}><Line data={lineData} options={chartOpts} /></div></div>
        <div className="chart-card"><h4>🎯 Focus Distribution</h4><div style={{ height: 280 }}><Pie data={pieData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: "#A0A0C0" } } } }} /></div></div>
      </div>

      <div className="table-card">
        <h4>📋 Recent Sessions</h4>
        {sessions.length === 0 ? (
          <div className="empty-state">
            <img src={IMAGES.empty} alt="No sessions" />
            <h3>No sessions yet</h3>
            <p><a style={{ color: "var(--primary-light)", cursor: "pointer" }} onClick={() => setPage("logger")}>Log your first session!</a></p>
          </div>
        ) : (
          <table className="sessions-table">
            <thead><tr><th>Subject</th><th>Duration</th><th>Time of Day</th><th>Break</th><th>Productivity</th><th>Focus</th></tr></thead>
            <tbody>
              {[...sessions].reverse().slice(0, 10).map((s, i) => (
                <tr key={i}>
                  <td>{s.subject}</td>
                  <td>{s.duration} min</td>
                  <td style={{ textTransform: "capitalize" }}>{timeOfDayDecode(s.time_of_day)}</td>
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

function PomodoroTimer({ setPage, setForm, addToast }) {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState("study");

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1);
        } else if (minutes > 0) {
          setMinutes(minutes - 1);
          setSeconds(59);
        } else {
          clearInterval(interval);
          setIsActive(false);
          if (mode === "study") {
            setMode("break");
            setMinutes(5);
            setSeconds(0);
            addToast("Study session complete! Take a break.", "success");
          } else {
            setMode("study");
            setMinutes(25);
            setSeconds(0);
            addToast("Break over! Ready to study?", "info");
          }
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, minutes, seconds, mode, addToast]);

  const toggle = () => setIsActive(!isActive);
  const reset = () => {
    setIsActive(false);
    setMode("study");
    setMinutes(25);
    setSeconds(0);
  };

  const logSession = () => {
    const duration = 25 - minutes + (seconds === 0 ? 0 : 1);
    if (duration > 0) {
      setForm(prev => ({ ...prev, duration: String(duration) }));
    }
    setPage("logger");
  };

  const progress = mode === "study" ? ((25 - minutes - (seconds / 60)) / 25) * 100 : ((5 - minutes - (seconds / 60)) / 5) * 100;

  return (
    <div className="page">
      <div className="page-title">Pomodoro Timer</div>
      <div className="page-sub">Stay focused with timed study sessions</div>

      <div style={{ maxWidth: "400px", margin: "2rem auto", textAlign: "center", background: "var(--card)", border: "1px solid var(--border)", borderRadius: "20px", padding: "2.5rem" }}>
        <div style={{ display: "inline-block", background: mode === "study" ? "rgba(99,102,241,0.15)" : "rgba(34,197,94,0.15)", color: mode === "study" ? "var(--primary-light)" : "var(--success)", padding: "0.4rem 1.2rem", borderRadius: "99px", fontSize: "0.85rem", fontWeight: "600", marginBottom: "1.5rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          {mode === "study" ? "🔥 Focus Mode" : "☕ Break Time"}
        </div>

        <div style={{ fontSize: "5rem", fontWeight: "700", fontFamily: "'Space Grotesk',sans-serif", color: mode === "study" ? "var(--text)" : "var(--success)", marginBottom: "1.5rem", lineHeight: 1 }}>
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>

        <div style={{ width: "100%", height: "8px", background: "var(--bg3)", borderRadius: "99px", marginBottom: "2rem", overflow: "hidden" }}>
          <div style={{ width: `${progress}%`, height: "100%", background: mode === "study" ? "var(--primary)" : "var(--success)", borderRadius: "99px", transition: "width 1s linear" }} />
        </div>

        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", marginBottom: "1.5rem" }}>
          <button className="btn-main" onClick={toggle} style={{ minWidth: "120px" }}>
            {isActive ? "⏸ Pause" : "▶ Start"}
          </button>
          <button className="btn-outline" onClick={reset} style={{ minWidth: "100px" }}>
            ↺ Reset
          </button>
        </div>

        {!isActive && mode === "study" && minutes < 25 && (
          <button className="btn-full" onClick={logSession} style={{ background: "var(--success)", marginTop: "0.5rem" }}>
            ✅ Log This Session ({25 - minutes} min)
          </button>
        )}

        <div style={{ marginTop: "1.5rem", padding: "1rem", background: "var(--bg3)", borderRadius: "10px", fontSize: "0.85rem", color: "var(--text-muted)" }}>
          <strong style={{ color: "var(--text)" }}>How it works:</strong><br/>
          25 min study → 5 min break → Repeat<br/>
          After 4 cycles, take a 15 min long break
        </div>
      </div>
    </div>
  );
}

function SessionLogger({ user, setSessions, prefillForm, addToast }) {
  
  const [form, setForm] = useState(prefillForm || { subject: "Mathematics", duration: "", sessions_per_day: "1", break_time: "", time_of_day: "morning" });
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  if (!user) return <div className="page"><div className="empty-state"><div className="icon">🔒</div><p>Please login first.</p></div></div>;

  const submit = async () => {
    if (!form.subject || !form.duration || !form.break_time) { setError("Please fill in all fields."); return; }
    if (!/^[a-zA-Z\s]+$/.test(form.subject)) { setError("Subject must contain letters only."); return; }
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
        setResult({ productivity_score: res.data.productivity_score, focus_level: res.data.focus_level });
        setForm({ subject: "", duration: "", sessions_per_day: "1", break_time: "", time_of_day: "morning" });
        axios.get(`${API}/sessions.php?user_id=${user.id}`).then(r => { if (r.data.success) setSessions(r.data.sessions || []); });
        addToast("Session logged successfully!", "success");
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
          <div className="form-group"><label>Subject</label><input className="form-input" name="subject" placeholder="e.g. Mathematics, Physics, History..." value={form.subject} onChange={handle} /></div>
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