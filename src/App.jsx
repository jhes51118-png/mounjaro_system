import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithCustomToken, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, onSnapshot, doc, setDoc, deleteDoc } from 'firebase/firestore';

// --- Firebase Initialization ---
// 這裡使用您稍早提供的真實 Firebase 金鑰，並將資料存在根目錄
const firebaseConfig = {
  apiKey: "AIzaSyCRCbbLWZJVmDlMgNYW8PvVOcRvYJDyaP8",
  authDomain: "mounjaro-system2.firebaseapp.com",
  projectId: "mounjaro-system2",
  storageBucket: "mounjaro-system2.firebasestorage.app",
  messagingSenderId: "1033378209723",
  appId: "1:1033378209723:web:6d5506c3e6a40e8659ae9e"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const SyringeIcon = ({ className = 'text-indigo-600' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m18 2 4 4"/><path d="m17 7 3-3"/><path d="M19 9 8.7 19.3c-1-1-2.5-1-3.4 0l-.6.6c-.9.9-.9 2.5 0 3.4 1 1 2.5 1 3.4 0l.6-.6c.9-.9.9-2.5 0-3.4L19 9"/><path d="m9 11 4 4"/><path d="m5 19-3 3"/><path d="m14 4 6 6"/>
  </svg>
);
const AlertTriangle = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500">
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/>
  </svg>
);
const InfoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
    <circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>
  </svg>
);
const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/>
  </svg>
);
const BookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>
  </svg>
);
const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
    <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
  </svg>
);
const PencilIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/>
  </svg>
);
const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const XIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
  </svg>
);
const UsersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-500">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);
const ChevronLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m15 18-6-6 6-6"/>
  </svg>
);

const ComicBeagleIcon = ({ className = '' }) => (
  <svg viewBox="0 0 96 96" role="img" aria-label="開心的小獵犬" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M31 27c-12-11-24-5-22 9 1 10 11 17 23 15" fill="#252525" stroke="#252525" strokeWidth="4" strokeLinejoin="round"/>
    <path d="M65 27c12-11 24-5 22 9-1 10-11 17-23 15" fill="#252525" stroke="#252525" strokeWidth="4" strokeLinejoin="round"/>
    <path d="M24 44c0-20 11-32 24-32s24 12 24 32c0 22-10 38-24 38S24 66 24 44Z" fill="#FFFDF7" stroke="#252525" strokeWidth="4"/>
    <ellipse cx="39" cy="43" rx="3" ry="5" fill="#252525"/>
    <ellipse cx="57" cy="43" rx="3" ry="5" fill="#252525"/>
    <ellipse cx="48" cy="56" rx="7" ry="5" fill="#252525"/>
    <path d="M39 64c5 6 13 6 18 0" stroke="#252525" strokeWidth="3" strokeLinecap="round"/>
    <path d="M69 72c8-2 13 1 16 6" stroke="#D94A43" strokeWidth="5" strokeLinecap="round"/>
  </svg>
);

const SnoopyImage = ({ className = '' }) => {
  const [failed, setFailed] = useState(false);
  if (failed) return <ComicBeagleIcon className={className} />;
  return <img src="/snoopy.png" alt="史努比" title="Snoopy © Peanuts Worldwide LLC" className={`object-contain ${className}`} onError={() => setFailed(true)} />;
};

const PEN_OPTIONS = [2.5, 5, 7.5, 10, 12.5, 15]; 
const COMMON_DOSES = [2.5, 3.0, 3.5, 4.0, 4.5, 5.0, 6.0, 7.0, 8.0, 9.0, 10]; 
const STANDARD_TITRATION = [2.5, 5, 7.5, 10, 12.5, 15];
const SESSION_KEY = 'mounjaroRememberedUser';
const COMMON_SYMPTOMS = ['噁心', '嘔吐', '腹瀉', '便秘', '胃脹', '胃痛', '食慾下降', '頭暈', '頭痛', '疲倦', '口渴', '注射處不適'];
const MOOD_OPTIONS = ['很好', '平穩', '普通', '低落', '焦慮', '煩躁', '疲憊'];

const COMIC_THEME_STYLES = `
  :root { color-scheme: light; }
  body { margin: 0; background: #f7f0df; }
  .comic-shell {
    color-scheme: light;
    color: #343434;
    isolation: isolate;
    background:
      radial-gradient(circle at 10% 8%, rgba(246, 209, 95, .45), transparent 22%),
      radial-gradient(circle at 92% 24%, rgba(125, 185, 232, .32), transparent 24%),
      linear-gradient(160deg, #fffaf0 0%, #f8f2e4 54%, #f1f7f4 100%);
  }
  .comic-shell::before {
    content: '';
    position: fixed;
    inset: 0;
    z-index: -2;
    pointer-events: none;
    opacity: .32;
    background-image: radial-gradient(#6a6a6a 0.7px, transparent 0.7px);
    background-size: 18px 18px;
  }
  .comic-shell::after {
    content: '';
    position: fixed;
    inset: 0;
    z-index: -1;
    pointer-events: none;
    background: linear-gradient(180deg, rgba(255,255,255,.18), rgba(255,250,240,.38));
  }
  .comic-shell h1,
  .comic-shell h2,
  .comic-shell h3 { letter-spacing: -.02em; }
  .comic-shell input,
  .comic-shell select,
  .comic-shell textarea {
    outline: none;
    color: #2c2c2c !important;
    border-color: #cfc8b9 !important;
    background: #fffef9 !important;
    box-shadow: inset 0 1px 0 rgba(255,255,255,.8);
    transition: border-color .18s ease, box-shadow .18s ease, transform .18s ease;
  }
  .comic-shell input:focus,
  .comic-shell select:focus,
  .comic-shell textarea:focus {
    border-color: #4f8fc2 !important;
    box-shadow: 0 0 0 3px rgba(125,185,232,.25), 3px 3px 0 rgba(36,36,36,.08) !important;
    background: #fff !important;
  }
  .comic-shell input::placeholder,
  .comic-shell textarea::placeholder { color: #9c978d !important; }
  .comic-shell select option { color: #2c2c2c; background: #fffef9; }
  .comic-shell button { -webkit-tap-highlight-color: transparent; }
  .comic-shell button:hover:not(:disabled) { filter: saturate(1.04); }
  .comic-shell button:active:not(:disabled) { transform: translateY(1px); }
  .comic-shell button:disabled { filter: saturate(.45); opacity: .58; }

  /* Forecast cards sit on dark gradients, so their translucent surfaces must
     not be converted into the light comic-card treatment below. */
  .comic-shell .forecast-glass {
    background: rgba(255,255,255,.14) !important;
    border-color: rgba(255,255,255,.28) !important;
    box-shadow: none !important;
    color: #fff !important;
  }
  .comic-shell .forecast-badge {
    background: rgba(255,255,255,.18) !important;
    border-color: rgba(255,255,255,.3) !important;
    box-shadow: none !important;
    color: #fff !important;
  }
  .comic-shell .goal-date-input {
    display: block;
    box-sizing: border-box;
    width: 100% !important;
    min-width: 0 !important;
    max-width: 100% !important;
    -webkit-appearance: none;
    appearance: none;
  }

  .comic-shell .bg-white,
  .comic-shell [class*="bg-white/"] {
    background-color: rgba(255,253,247,.94) !important;
    border-color: rgba(67,63,56,.16) !important;
    box-shadow: 4px 5px 0 rgba(43,43,43,.08), 0 12px 28px rgba(85,72,48,.07);
  }
  .comic-shell .bg-slate-50,
  .comic-shell [class*="bg-slate-50/"] { background-color: #fbf8f0 !important; }
  .comic-shell .bg-slate-100,
  .comic-shell [class*="bg-slate-100/"] { background-color: #f0ece2 !important; }
  .comic-shell .bg-slate-200 { background-color: #e6e0d4 !important; }
  .comic-shell .bg-indigo-50,
  .comic-shell [class*="bg-indigo-50/"] { background-color: #eef5fb !important; }
  .comic-shell .bg-indigo-100 { background-color: #dcecf8 !important; }
  .comic-shell .bg-blue-50 { background-color: #eef7fc !important; }
  .comic-shell .bg-blue-100 { background-color: #d9edf9 !important; }
  .comic-shell .bg-sky-50 { background-color: #eff8fc !important; }
  .comic-shell .bg-sky-100 { background-color: #dff1fa !important; }
  .comic-shell .bg-emerald-50,
  .comic-shell [class*="bg-emerald-50/"] { background-color: #eff8f0 !important; }
  .comic-shell .bg-emerald-100 { background-color: #dbefdc !important; }
  .comic-shell .bg-green-50 { background-color: #f0f8ed !important; }
  .comic-shell .bg-amber-50 { background-color: #fff8dc !important; }
  .comic-shell .bg-amber-100 { background-color: #fcebb3 !important; }
  .comic-shell .bg-red-50 { background-color: #fff1ee !important; }
  .comic-shell .bg-red-100 { background-color: #f9ddd8 !important; }

  .comic-shell [class*="from-indigo-50"],
  .comic-shell [class*="from-emerald-50"],
  .comic-shell [class*="from-sky-50"] {
    background-image: linear-gradient(145deg, #fffef9, #f3f8f4) !important;
    border-color: rgba(67,63,56,.16) !important;
    box-shadow: 4px 5px 0 rgba(43,43,43,.07), 0 12px 28px rgba(85,72,48,.06);
  }
  .comic-shell [class*="from-violet-600"] {
    background-image: linear-gradient(135deg, #6c78bd, #588fc8) !important;
    border-color: #474f8e !important;
    box-shadow: 4px 5px 0 rgba(43,43,43,.12) !important;
  }
  .comic-shell [class*="from-emerald-500"] {
    background-image: linear-gradient(135deg, #6eaf79, #4f9b8b) !important;
    border-color: #477a59 !important;
    box-shadow: 4px 5px 0 rgba(43,43,43,.12) !important;
  }

  .comic-shell .text-slate-900 { color: #252525 !important; }
  .comic-shell .text-slate-800 { color: #303030 !important; }
  .comic-shell .text-slate-700 { color: #454545 !important; }
  .comic-shell .text-slate-600 { color: #5e5e5e !important; }
  .comic-shell .text-slate-500 { color: #73706a !important; }
  .comic-shell .text-slate-400 { color: #8c877e !important; }
  .comic-shell .text-indigo-800,
  .comic-shell .text-indigo-700,
  .comic-shell .text-indigo-900 { color: #405f96 !important; }
  .comic-shell .text-indigo-600,
  .comic-shell .text-indigo-500 { color: #4d76ad !important; }
  .comic-shell .text-blue-800,
  .comic-shell .text-blue-700 { color: #3975a5 !important; }
  .comic-shell .text-sky-800,
  .comic-shell .text-sky-700,
  .comic-shell .text-sky-600 { color: #347ca7 !important; }
  .comic-shell .text-emerald-800,
  .comic-shell .text-emerald-700,
  .comic-shell .text-emerald-900,
  .comic-shell .text-green-600 { color: #3f8056 !important; }
  .comic-shell .text-amber-800,
  .comic-shell .text-amber-700,
  .comic-shell .text-amber-600,
  .comic-shell .text-amber-900 { color: #8b6816 !important; }
  .comic-shell .text-red-800,
  .comic-shell .text-red-700,
  .comic-shell .text-red-600 { color: #bd453e !important; }

  .comic-shell .border-slate-100,
  .comic-shell .border-slate-200 { border-color: #e2dccf !important; }
  .comic-shell .border-slate-300 { border-color: #cbc4b7 !important; }
  .comic-shell .border-indigo-100,
  .comic-shell .border-indigo-200 { border-color: #c7dced !important; }
  .comic-shell .border-emerald-100,
  .comic-shell .border-emerald-200 { border-color: #c9e3ca !important; }
  .comic-shell .border-blue-100 { border-color: #c8e1f0 !important; }
  .comic-shell .border-amber-100,
  .comic-shell .border-amber-200 { border-color: #edd998 !important; }
  .comic-shell .border-red-200 { border-color: #efc4bd !important; }
  .comic-shell .shadow-indigo-200,
  .comic-shell .shadow-indigo-100,
  .comic-shell .shadow-sky-200,
  .comic-shell .shadow-emerald-200,
  .comic-shell .shadow-amber-200 { --tw-shadow-color: rgba(69,62,49,.15) !important; }
  .comic-shell ::selection { color: #252525; background: #f6d15f; }
  .comic-card { border: 2px solid #343434; box-shadow: 5px 6px 0 rgba(52,52,52,.12); }
  .comic-sticker { border: 2px solid #343434; box-shadow: 3px 3px 0 rgba(52,52,52,.13); }

  @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes floatSoft { 0%, 100% { transform: translate3d(0, 0, 0) rotate(-2deg); } 50% { transform: translate3d(0, -8px, 0) rotate(2deg); } }
  @keyframes pulseComic { 0%,100% { box-shadow: 3px 3px 0 rgba(52,52,52,.12); } 50% { box-shadow: 5px 6px 0 rgba(52,52,52,.08); } }
  .animation-fade-in { animation: fadeIn .35s ease-out; }
  .comic-live { animation: pulseComic 2.8s ease-in-out infinite; }
  .hide-scrollbar::-webkit-scrollbar { display: none; }
  .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  @media (prefers-reduced-motion: reduce) {
    .animation-fade-in, .decorative-blob, .comic-live { animation: none !important; }
  }
`;

const normalizeSymptoms = (symptoms) => Array.isArray(symptoms) ? symptoms.filter(Boolean) : [];
const isInjectionLog = (log) => log?.recordType !== 'weight' && Number.isFinite(Number(log?.dose)) && Number(log.dose) > 0;
const formatLogDate = (dateValue) => {
  if (!dateValue) return '';
  const parsedDate = new Date(`${dateValue}T12:00:00`);
  if (Number.isNaN(parsedDate.getTime())) return dateValue;
  const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
  return `${parsedDate.getMonth() + 1}/${parsedDate.getDate()}(${weekdays[parsedDate.getDay()]})`;
};

const getSuggestedDoseFromSchedule = (scheduleRecord) => {
  if (!scheduleRecord?.schedule?.length) return '';
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const scheduleItems = scheduleRecord.schedule
    .map(item => ({
      ...item,
      parsedDate: item.date?.toDate ? item.date.toDate() : new Date(item.date)
    }))
    .filter(item => !Number.isNaN(item.parsedDate.getTime()) && Number(item.dose) > 0)
    .sort((a, b) => a.parsedDate - b.parsedDate);
  const suggestedItem = scheduleItems.find(item => item.parsedDate >= today) || scheduleItems[scheduleItems.length - 1];
  return suggestedItem ? String(suggestedItem.dose) : '';
};

const toLocalDateKey = (dateValue) => {
  const parsedDate = dateValue instanceof Date ? dateValue : new Date(dateValue);
  if (Number.isNaN(parsedDate.getTime())) return '';
  const year = parsedDate.getFullYear();
  const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
  const day = String(parsedDate.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getFutureMonthDateKey = (months, fromDate = new Date()) => {
  const result = new Date(fromDate);
  result.setHours(12, 0, 0, 0);
  const originalDay = result.getDate();
  result.setDate(1);
  result.setMonth(result.getMonth() + months);
  const lastDay = new Date(result.getFullYear(), result.getMonth() + 1, 0).getDate();
  result.setDate(Math.min(originalDay, lastDay));
  return toLocalDateKey(result);
};

const calculateDoseExhaustion = (remainingMg, plannedEntries) => {
  if (remainingMg <= 0) return { exhausted: true, exhaustionEntry: null, remainingAfterPlan: 0 };
  let projectedRemaining = remainingMg;
  for (const entry of plannedEntries) {
    projectedRemaining -= Number(entry.dose || 0);
    if (projectedRemaining <= 0) {
      return { exhausted: false, exhaustionEntry: entry, remainingAfterPlan: 0 };
    }
  }
  return { exhausted: false, exhaustionEntry: null, remainingAfterPlan: Math.max(0, projectedRemaining) };
};

const roundHealthValue = (value, digits = 1) => Number.isFinite(value) ? Number(value.toFixed(digits)) : null;

const buildHealthSnapshot = (logs, profile) => {
  const weightLogs = logs
    .filter(log => Number.isFinite(Number(log.weight)) && log.date)
    .map(log => ({ date: log.date, weight: Number(log.weight) }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));
  const injectionLogs = logs
    .filter(isInjectionLog)
    .map(log => ({ date: log.date, doseMg: Number(log.dose), symptoms: normalizeSymptoms(log.symptoms) }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  if (weightLogs.length === 0) return {
    firstWeightKg: null, latestWeightKg: null, totalChangeKg: null,
    weeklyLossKg: null, weeklyLossPercent: null, bmi: null, trendDays: 0,
    weightEntryCount: 0, injectionLogs
  };

  const firstLog = weightLogs[0];
  const latestLog = weightLogs[weightLogs.length - 1];
  const latestDate = new Date(`${latestLog.date}T12:00:00`);
  const trendStart = new Date(latestDate);
  trendStart.setDate(trendStart.getDate() - 42);
  let trendLogs = weightLogs.filter(log => new Date(`${log.date}T12:00:00`) >= trendStart);
  if (trendLogs.length < 2) trendLogs = weightLogs;
  const trendFirst = trendLogs[0];
  const trendLast = trendLogs[trendLogs.length - 1];
  const trendDays = Math.max(0, Math.round((new Date(`${trendLast.date}T12:00:00`) - new Date(`${trendFirst.date}T12:00:00`)) / 86400000));
  const weeklyLossKg = trendDays >= 7 ? ((trendFirst.weight - trendLast.weight) / trendDays) * 7 : null;
  const weeklyLossPercent = weeklyLossKg !== null && trendFirst.weight > 0 ? (weeklyLossKg / trendFirst.weight) * 100 : null;
  const totalChangeKg = latestLog.weight - firstLog.weight;
  const heightCm = Number(profile?.heightCm);
  const age = Number(profile?.age);
  const bmi = age >= 20 && heightCm >= 120 ? latestLog.weight / Math.pow(heightCm / 100, 2) : null;
  return {
    firstWeightKg: firstLog.weight,
    latestWeightKg: latestLog.weight,
    totalChangeKg: roundHealthValue(totalChangeKg),
    weeklyLossKg: roundHealthValue(weeklyLossKg, 2),
    weeklyLossPercent: roundHealthValue(weeklyLossPercent, 2),
    bmi: roundHealthValue(bmi), trendDays,
    weightEntryCount: weightLogs.length,
    injectionLogs
  };
};

function LogExtraDetails({ log, noteClassName = 'bg-slate-50' }) {
  const symptoms = normalizeSymptoms(log.symptoms);
  return (
    <div className="mt-3 space-y-2">
      {symptoms.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {symptoms.map(symptom => (
            <span key={symptom} className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100">
              {symptom}
            </span>
          ))}
        </div>
      )}
      {log.mood && (
        <div className="text-sm text-slate-600">
          <span className="font-medium text-slate-700">心情：</span>{log.mood}
        </div>
      )}
      {log.notes && <div className={`text-sm text-slate-600 p-3 rounded-lg ${noteClassName}`}>{log.notes}</div>}
    </div>
  );
}

function TrendChart({ logs }) {
  const [rangeDays, setRangeDays] = useState(30);
  const sortedLogs = [...(logs || [])].sort((a, b) => new Date(a.date) - new Date(b.date));
  const latestDate = sortedLogs.length ? new Date(`${sortedLogs[sortedLogs.length - 1].date}T12:00:00`) : null;
  const chartData = rangeDays === 'all' || !latestDate
    ? sortedLogs
    : sortedLogs.filter(log => {
        const logDate = new Date(`${log.date}T12:00:00`);
        return (latestDate.getTime() - logDate.getTime()) <= (rangeDays - 1) * 24 * 60 * 60 * 1000;
      });

  // 資料少於2筆不畫圖
  if (!logs || logs.length < 2) {
    return (
      <div className="flex flex-col items-center justify-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-200">
        <span className="text-2xl mb-2">📊</span>
        <p className="text-sm text-slate-400">目前紀錄不足，新增至少 2 筆資料即可產生趨勢圖表</p>
      </div>
    );
  }

  // 計算體重與劑量的最大/最小值，用來做圖表比例尺
  const weights = chartData.map(d => d.weight);
  const injectionData = chartData.filter(isInjectionLog);
  const doses = injectionData.map(d => Number(d.dose));
  const maxWeight = Math.max(...weights) + 1;
  const minWeight = Math.min(...weights) - 1;
  const maxDose = doses.length > 0 ? Math.max(...doses) + 1 : 5;
  const minDose = 0; // 劑量從 0 開始畫比較直覺

  const rangeW = maxWeight - minWeight === 0 ? 10 : maxWeight - minWeight;
  const rangeD = maxDose - minDose === 0 ? 5 : maxDose - minDose;

  // 手機一次呈現更多資料點；資料越多時稍微壓縮間距，再降低標籤密度避免重疊
  const pointGap = chartData.length > 20 ? 36 : chartData.length > 12 ? 40 : 44;
  const svgW = Math.max(440, (chartData.length - 1) * pointGap + 80);
  const svgH = 250;
  const padX = 40; const padY = 38;
  const innerW = svgW - padX * 2;
  const innerH = svgH - padY * 2;
  const labelStep = Math.max(1, Math.ceil(chartData.length / 10));

  // 比例換算函式
  const getX = (idx) => padX + (idx / (chartData.length - 1)) * innerW;
  const getYW = (val) => svgH - padY - ((val - minWeight) / rangeW) * innerH;
  const getYD = (val) => svgH - padY - ((val - minDose) / rangeD) * innerH;

  // 產生多邊形線條屬性
  const weightPoints = chartData.map((d, i) => `${getX(i)},${getYW(d.weight)}`).join(' ');
  const dosePoints = chartData
    .map((d, i) => isInjectionLog(d) ? `${getX(i)},${getYD(Number(d.dose))}` : null)
    .filter(Boolean)
    .join(' ');

  return (
    <div className="bg-white p-3 sm:p-4 rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center mb-3 px-1 sm:px-2">
        <h3 className="font-bold text-slate-700 text-sm">體重與劑量趨勢</h3>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs font-medium">
          <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-blue-500 mr-1.5"></span>體重 (kg)</div>
          <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-emerald-400 mr-1.5"></span>劑量 (mg)</div>
        </div>
      </div>
      <div className="mb-3 grid grid-cols-3 gap-2 px-1 sm:max-w-xs sm:px-2" aria-label="趨勢顯示範圍">
        {[{ value: 7, label: '最近 7 天' }, { value: 30, label: '最近 30 天' }, { value: 'all', label: '全部' }].map(option => (
          <button key={option.value} type="button" aria-pressed={rangeDays === option.value} onClick={() => setRangeDays(option.value)} className={`min-h-[44px] rounded-lg border px-2 py-2 text-xs font-bold ${rangeDays === option.value ? 'border-sky-500 bg-sky-100 text-sky-800' : 'border-slate-200 bg-white text-slate-600'}`}>
            {option.label}
          </button>
        ))}
      </div>
      {chartData.length < 2 ? (
        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">此區間不足 2 筆紀錄，請切換較長範圍。</div>
      ) : (
      <>
      {chartData.length > 10 && <p className="mb-2 px-1 text-[11px] font-medium text-slate-500 sm:px-2">← 左右滑動可查看全部 {chartData.length} 筆紀錄 →</p>}
      
      {/* 讓圖表在手機上可以滑動 */}
      <div className="overflow-x-auto overscroll-x-contain pb-2">
          <svg viewBox={`0 0 ${svgW} ${svgH}`} width={svgW} height={svgH} role="img" aria-label={`體重與劑量趨勢圖，共 ${chartData.length} 筆紀錄`} className="block max-w-none drop-shadow-sm">
            {/* 畫背景輔助線 */}
            <line x1={padX} y1={padY} x2={svgW-padX} y2={padY} stroke="#f1f5f9" strokeWidth="1" />
            <line x1={padX} y1={svgH/2} x2={svgW-padX} y2={svgH/2} stroke="#f1f5f9" strokeWidth="1" />
            <line x1={padX} y1={svgH-padY} x2={svgW-padX} y2={svgH-padY} stroke="#e2e8f0" strokeWidth="2" />

            {/* 畫劑量線 (綠色) */}
            {injectionData.length > 1 && <polyline points={dosePoints} fill="none" stroke="#34d399" strokeWidth="3" strokeLinejoin="round" />}
            {/* 畫體重線 (藍色) */}
            <polyline points={weightPoints} fill="none" stroke="#3b82f6" strokeWidth="3" strokeLinejoin="round" />

            {/* 畫資料點與標籤 */}
            {chartData.map((d, i) => {
              const x = getX(i); const yw = getYW(d.weight); const yd = isInjectionLog(d) ? getYD(Number(d.dose)) : null;
              const showLabel = i === 0 || i === chartData.length - 1 || i % labelStep === 0;
              // 日期格式化 MM/DD
              const dateStr = d.date.substring(5).replace('-', '/');
              return (
                <g key={i}>
                  {/* 綠點 (劑量) */}
                  {yd !== null && (
                    <>
                      <circle cx={x} cy={yd} r="4" fill="#10b981" stroke="white" strokeWidth="2"><title>{`日期: ${d.date}\n劑量: ${d.dose} mg`}</title></circle>
                      {showLabel && <text x={x} y={yd - 10} fontSize="10" fill="#059669" textAnchor="middle" fontWeight="bold">{d.dose}</text>}
                    </>
                  )}
                  
                  {/* 藍點 (體重) */}
                  <circle cx={x} cy={yw} r="5" fill="#2563eb" stroke="white" strokeWidth="2"><title>{`日期: ${d.date}\n體重: ${d.weight} kg`}</title></circle>
                  {showLabel && <text x={x} y={yw - 12} fontSize="11" fill="#1d4ed8" textAnchor="middle" fontWeight="bold">{d.weight}</text>}
                  
                  {/* X軸日期 */}
                  {showLabel && <text x={x} y={svgH - 11} fontSize="10" fill="#64748b" textAnchor="middle">{dateStr}</text>}
                </g>
              );
            })}
          </svg>
      </div>
      </>
      )}
    </div>
  );
}

function SingleDoseTracker({ appUser, allLogs, inventory, penStrength }) {
  const earliestOwnLogDate = allLogs
    .filter(log => log.username === appUser.username && isInjectionLog(log) && log.date)
    .map(log => log.date)
    .sort()[0];
  const [startDate, setStartDate] = useState(inventory?.startDate || earliestOwnLogDate || new Date().toISOString().split('T')[0]);
  const [startDateTouched, setStartDateTouched] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (inventory?.startDate) {
      setStartDate(inventory.startDate);
      return;
    }
    if (!startDateTouched && earliestOwnLogDate) setStartDate(earliestOwnLogDate);
  }, [inventory?.startDate, earliestOwnLogDate, startDateTouched]);

  const includedLogs = allLogs
    .filter(log => log.username === appUser.username && isInjectionLog(log) && log.date >= startDate)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
  const totalMg = penStrength * 4;
  const usedMg = includedLogs.reduce((sum, log) => sum + Number(log.dose || 0), 0);
  const remainingMg = Math.max(0, totalMg - usedMg);
  const exceededMg = Math.max(0, usedMg - totalMg);
  const latestDose = includedLogs.length > 0 ? Number(includedLogs[0].dose) : 0;
  const remainingDoseCount = latestDose > 0 ? Math.floor(remainingMg / latestDose) : 0;
  const hasUnsavedChanges = !inventory || inventory.startDate !== startDate || Number(inventory.penStrength) !== Number(penStrength);

  const handleSaveInventory = async () => {
    if (!db || !startDate || isSaving) return;
    setIsSaving(true);
    setSaveMessage('');
    try {
      await setDoc(doc(db, 'mounjaroDoseInventories', appUser.username), {
        username: appUser.username,
        startDate,
        penStrength: Number(penStrength),
        updatedAt: new Date().toISOString()
      }, { merge: true });
      setSaveMessage('單人剩餘量設定已同步到雲端。');
    } catch (error) {
      console.error('儲存單人剩餘量設定失敗:', error);
      setSaveMessage('儲存失敗，請稍後再試。');
    }
    setIsSaving(false);
  };

  return (
    <div className="overflow-hidden rounded-3xl border border-sky-200/70 bg-gradient-to-br from-sky-50 via-white to-cyan-50 shadow-lg shadow-sky-100/50">
      <div className="p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-5">
          <div>
            <span className="inline-flex items-center rounded-full bg-sky-100 px-3 py-1 text-xs font-bold text-sky-700">個人用量追蹤</span>
            <h2 className="mt-2 text-xl font-black text-slate-800">我的預估剩餘劑量</h2>
            <p className="mt-1 text-sm text-slate-500">依目前這支筆開始使用後的施打紀錄自動扣除。</p>
          </div>
          <div className="rounded-2xl bg-white/80 px-4 py-3 text-center shadow-sm ring-1 ring-sky-100">
            <p className="text-xs font-medium text-sky-600">目前規格</p>
            <p className="text-2xl font-black text-sky-800">{penStrength} <span className="text-xs">mg</span></p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3 items-end mb-5">
          <div>
            <label className="block text-sm font-bold text-slate-600 mb-1">這支筆納入紀錄的起始日期</label>
            <input type="date" value={startDate} onChange={event => { setStartDate(event.target.value); setStartDateTouched(true); setSaveMessage(''); }} className="w-full rounded-xl border border-sky-200 bg-white px-4 py-3 focus:ring-2 focus:ring-sky-400" />
          </div>
          <button type="button" disabled={!hasUnsavedChanges || isSaving} onClick={handleSaveInventory} className="rounded-xl bg-sky-600 px-5 py-3 font-bold text-white shadow-sm hover:bg-sky-700 disabled:bg-slate-300 disabled:shadow-none">
            {isSaving ? '儲存中...' : hasUnsavedChanges ? '儲存設定' : '已同步'}
          </button>
        </div>

        {saveMessage && <p className={`mb-4 rounded-xl px-4 py-3 text-sm ${saveMessage.includes('失敗') ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'}`}>{saveMessage}</p>}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
            <p className="text-xs font-bold text-slate-400">標稱總量</p>
            <p className="mt-1 text-2xl font-black text-slate-800">{totalMg.toFixed(1)} <span className="text-xs font-medium">mg</span></p>
          </div>
          <div className="rounded-2xl bg-amber-50 p-4 ring-1 ring-amber-100">
            <p className="text-xs font-bold text-amber-600">已記錄使用</p>
            <p className="mt-1 text-2xl font-black text-amber-800">{usedMg.toFixed(1)} <span className="text-xs font-medium">mg</span></p>
          </div>
          <div className={`rounded-2xl p-4 ring-1 ${exceededMg > 0 ? 'bg-red-50 ring-red-200' : 'bg-emerald-50 ring-emerald-100'}`}>
            <p className={`text-xs font-bold ${exceededMg > 0 ? 'text-red-600' : 'text-emerald-600'}`}>{exceededMg > 0 ? '超出標稱量' : '預估剩餘'}</p>
            <p className={`mt-1 text-2xl font-black ${exceededMg > 0 ? 'text-red-800' : 'text-emerald-800'}`}>{(exceededMg > 0 ? exceededMg : remainingMg).toFixed(1)} <span className="text-xs font-medium">mg</span></p>
          </div>
          <div className="rounded-2xl bg-indigo-50 p-4 ring-1 ring-indigo-100">
            <p className="text-xs font-bold text-indigo-600">約可再施打</p>
            <p className="mt-1 text-2xl font-black text-indigo-800">{latestDose > 0 && exceededMg === 0 ? remainingDoseCount : '—'} <span className="text-xs font-medium">次</span></p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <span className="rounded-full bg-white px-3 py-1.5 ring-1 ring-slate-100">已納入 {includedLogs.length} 筆施打紀錄</span>
          {latestDose > 0 && <span className="rounded-full bg-white px-3 py-1.5 ring-1 ring-slate-100">最近劑量 {latestDose} mg</span>}
          <span className="rounded-full bg-white px-3 py-1.5 ring-1 ring-slate-100">起始日 {formatLogDate(startDate)}</span>
        </div>

        {exceededMg > 0 && <p className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">目前紀錄已超過這支筆的標稱總量，請確認起始日期是否包含上一支筆的紀錄。</p>}
        <p className="mt-4 text-xs leading-relaxed text-slate-400">估算不包含排氣耗損與不可使用的殘留藥液；請依照醫師、藥師及原廠使用指示用藥。</p>
      </div>
    </div>
  );
}

function SharedDosePlanner({ appUser, usersList, allLogs, allSchedules, sharingPlans, penStrength }) {
  const [shareUsername, setShareUsername] = useState('');
  const [shareStartDate, setShareStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [shareMessage, setShareMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const isParticipant = (plan) => plan?.participants?.includes(appUser.username)
    || plan?.requester === appUser.username
    || plan?.partner === appUser.username;
  const planIncludesUser = (plan, username) => plan?.participants?.includes(username)
    || plan?.requester === username
    || plan?.partner === username;
  const relatedPlans = sharingPlans.filter(isParticipant);
  const activePlan = relatedPlans.find(plan => plan.status === 'active');
  const incomingRequests = relatedPlans.filter(plan => plan.status === 'pending' && plan.partner === appUser.username);
  const outgoingRequest = relatedPlans.find(plan => plan.status === 'pending' && plan.requester === appUser.username);
  const hasOpenPlan = Boolean(activePlan || incomingRequests.length > 0 || outgoingRequest);
  const availableShareUsers = usersList.filter(user => user.username !== appUser.username && !sharingPlans.some(plan => ['pending', 'active'].includes(plan.status) && planIncludesUser(plan, user.username)));

  const handleShareUserChange = (event) => {
    const username = event.target.value;
    setShareUsername(username);
    setShareMessage('');
    if (!username) return;
    const earliestDate = allLogs
      .filter(log => [appUser.username, username].includes(log.username) && isInjectionLog(log) && log.date)
      .map(log => log.date)
      .sort()[0];
    setShareStartDate(earliestDate || new Date().toISOString().split('T')[0]);
  };

  const handleSendRequest = async () => {
    if (!db || !shareUsername || !shareStartDate || hasOpenPlan || isSaving) return;
    const partnerHasOpenPlan = sharingPlans.some(plan => ['pending', 'active'].includes(plan.status) && planIncludesUser(plan, shareUsername));
    if (partnerHasOpenPlan) {
      setShareMessage('對方目前已有等待中或進行中的綁定，暫時無法邀請。');
      return;
    }
    setIsSaving(true);
    setShareMessage('');
    try {
      const requestRef = doc(collection(db, 'mounjaroSharingPlans'));
      await setDoc(requestRef, {
        requester: appUser.username,
        partner: shareUsername,
        participants: [appUser.username, shareUsername],
        status: 'pending',
        penStrength: Number(penStrength),
        startDate: shareStartDate,
        createdAt: new Date().toISOString()
      });
      setShareMessage(`已送出邀請，等待 ${shareUsername} 同意。`);
      setShareUsername('');
    } catch (error) {
      console.error('送出共用規劃邀請失敗:', error);
      setShareMessage('邀請送出失敗，請稍後再試。');
    }
    setIsSaving(false);
  };

  const handlePlanStatus = async (plan, status) => {
    if (!db || !plan?.id || isSaving) return;
    setIsSaving(true);
    setShareMessage('');
    try {
      if (status === 'active') {
        const participants = plan?.participants?.length === 2 ? plan.participants : [plan.requester, plan.partner];
        const conflictingPlan = sharingPlans.find(item => item.id !== plan.id && item.status === 'active' && participants.some(username => planIncludesUser(item, username)));
        if (conflictingPlan) {
          setShareMessage('其中一位使用者已有進行中的綁定，無法接受這次邀請。');
          setIsSaving(false);
          return;
        }
        const otherPendingPlans = sharingPlans.filter(item => item.id !== plan.id && item.status === 'pending' && participants.some(username => planIncludesUser(item, username)));
        await Promise.all([
          setDoc(doc(db, 'mounjaroSharingPlans', plan.id), {
            status: 'active',
            acceptedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }, { merge: true }),
          ...otherPendingPlans.map(item => setDoc(doc(db, 'mounjaroSharingPlans', item.id), {
            status: 'cancelled',
            updatedAt: new Date().toISOString()
          }, { merge: true }))
        ]);
      } else {
        await setDoc(doc(db, 'mounjaroSharingPlans', plan.id), {
          status,
          updatedAt: new Date().toISOString()
        }, { merge: true });
      }
      setShareMessage(status === 'active' ? '已接受邀請，雙方紀錄已開始合併估算。' : status === 'rejected' ? '已拒絕邀請。' : status === 'cancelled' ? '已取消邀請。' : '已結束這組規劃。');
    } catch (error) {
      console.error('更新共用規劃失敗:', error);
      setShareMessage('更新失敗，請稍後再試。');
    }
    setIsSaving(false);
  };

  const activeParticipants = activePlan?.participants?.length === 2
    ? activePlan.participants
    : activePlan ? [activePlan.requester, activePlan.partner] : [];
  const activeLogs = activePlan
    ? allLogs
      .filter(log => activeParticipants.includes(log.username) && isInjectionLog(log) && log.date >= activePlan.startDate)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
    : [];
  const planTotalMg = Number(activePlan?.penStrength || 0) * 4;
  const usedByUser = activeParticipants.reduce((totals, username) => ({
    ...totals,
    [username]: activeLogs
      .filter(log => log.username === username)
      .reduce((sum, log) => sum + Number(log.dose || 0), 0)
  }), {});
  const totalUsedMg = Object.values(usedByUser).reduce((sum, dose) => sum + dose, 0);
  const remainingMg = Math.max(0, planTotalMg - totalUsedMg);
  const exceededMg = Math.max(0, totalUsedMg - planTotalMg);
  const getLatestDose = (username) => {
    const latestLog = allLogs.find(log => log.username === username && isInjectionLog(log));
    if (latestLog) return Number(latestLog.dose);
    const userSchedule = allSchedules.find(item => item.id === username || item.username === username);
    return Number(getSuggestedDoseFromSchedule(userSchedule)) || 0;
  };
  const activePartner = activeParticipants.find(username => username !== appUser.username);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sm:p-6">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-slate-800 flex items-center">
          <UsersIcon /> <span className="ml-2">兩人用量規劃</span>
        </h2>
        <p className="text-sm text-slate-500 mt-1">邀請對方同意綁定後，系統才會合併雙方的施打紀錄進行估算。</p>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-800 mb-5">
        <p className="font-bold">⚠️ 注射筆不可與他人共用</p>
        <p className="mt-1 leading-relaxed">原廠規定同一支 KwikPen 只能由單一病人使用，即使更換針頭也不能共用。本區僅供雙方用量與庫存紀錄估算，兩人必須各自使用自己的注射筆。</p>
      </div>

      {shareMessage && (
        <div className={`mb-4 rounded-xl border px-4 py-3 text-sm ${shareMessage.includes('失敗') || shareMessage.includes('無法') ? 'bg-red-50 border-red-200 text-red-700' : 'bg-emerald-50 border-emerald-200 text-emerald-700'}`}>
          {shareMessage}
        </div>
      )}

      {incomingRequests.map(request => (
        <div key={request.id} className="mb-4 rounded-xl border-2 border-amber-300 bg-amber-50 p-4">
          <p className="font-bold text-amber-900">收到 {request.requester} 的規劃邀請</p>
          <p className="text-sm text-amber-800 mt-1">規格 {request.penStrength} mg，納入 {formatLogDate(request.startDate)} 起的雙方施打紀錄。</p>
          <div className="flex gap-2 mt-3">
            <button type="button" disabled={isSaving} onClick={() => handlePlanStatus(request, 'active')} className="flex-1 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-700 disabled:bg-slate-400">接受並綁定</button>
            <button type="button" disabled={isSaving} onClick={() => handlePlanStatus(request, 'rejected')} className="rounded-lg bg-white border border-slate-300 px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50 disabled:text-slate-300">拒絕</button>
          </div>
        </div>
      ))}

      {outgoingRequest && !activePlan && (
        <div className="mb-4 rounded-xl border border-indigo-200 bg-indigo-50 p-4">
          <p className="font-bold text-indigo-900">等待 {outgoingRequest.partner} 同意</p>
          <p className="text-sm text-indigo-700 mt-1">規格 {outgoingRequest.penStrength} mg，從 {formatLogDate(outgoingRequest.startDate)} 起納入紀錄。</p>
          <button type="button" disabled={isSaving} onClick={() => handlePlanStatus(outgoingRequest, 'cancelled')} className="mt-3 rounded-lg bg-white border border-indigo-200 px-4 py-2 text-sm font-bold text-indigo-700 hover:bg-indigo-100 disabled:text-slate-300">取消邀請</button>
        </div>
      )}

      {activePlan && (
        <div className="space-y-4 animation-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-xl bg-emerald-50 border border-emerald-200 p-4">
            <div>
              <p className="font-bold text-emerald-900">已與 {activePartner} 綁定</p>
              <p className="text-sm text-emerald-700 mt-1">規格 {activePlan.penStrength} mg・從 {formatLogDate(activePlan.startDate)} 起計算</p>
            </div>
            <button type="button" disabled={isSaving} onClick={() => window.confirm('確定要結束這組兩人用量規劃嗎？') && handlePlanStatus(activePlan, 'ended')} className="shrink-0 rounded-lg bg-white border border-emerald-300 px-4 py-2 text-sm font-bold text-emerald-700 hover:bg-emerald-100 disabled:text-slate-300">解除綁定</button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl bg-indigo-50 border border-indigo-100 p-3">
              <p className="text-xs text-indigo-500">標稱總量</p>
              <p className="text-xl font-black text-indigo-800 mt-1">{planTotalMg.toFixed(1)} <span className="text-xs font-medium">mg</span></p>
            </div>
            <div className="rounded-xl bg-amber-50 border border-amber-100 p-3">
              <p className="text-xs text-amber-600">已記錄用量</p>
              <p className="text-xl font-black text-amber-800 mt-1">{totalUsedMg.toFixed(1)} <span className="text-xs font-medium">mg</span></p>
            </div>
            <div className={`rounded-xl border p-3 ${exceededMg > 0 ? 'bg-red-50 border-red-200' : 'bg-emerald-50 border-emerald-100'}`}>
              <p className={`text-xs ${exceededMg > 0 ? 'text-red-600' : 'text-emerald-600'}`}>{exceededMg > 0 ? '已超出總量' : '預估剩餘量'}</p>
              <p className={`text-xl font-black mt-1 ${exceededMg > 0 ? 'text-red-800' : 'text-emerald-800'}`}>{(exceededMg > 0 ? exceededMg : remainingMg).toFixed(1)} <span className="text-xs font-medium">mg</span></p>
            </div>
            <div className="rounded-xl bg-slate-50 border border-slate-200 p-3">
              <p className="text-xs text-slate-500">納入施打紀錄</p>
              <p className="text-xl font-black text-slate-800 mt-1">{activeLogs.length} <span className="text-xs font-medium">筆</span></p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {activeParticipants.map(username => {
              const latestDose = getLatestDose(username);
              const remainingDoseCount = latestDose > 0 ? Math.floor(remainingMg / latestDose) : 0;
              return (
                <div key={username} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="font-bold text-slate-700">{username}{username === appUser.username ? '（您）' : ''}</p>
                  <p className="text-sm text-slate-500 mt-1">已納入 {Number(usedByUser[username] || 0).toFixed(1)} mg</p>
                  {exceededMg === 0 && latestDose > 0 && <p className="text-sm text-slate-500 mt-1">依最近劑量 {latestDose} mg，全部剩餘量約可施打 {remainingDoseCount} 次</p>}
                </div>
              );
            })}
          </div>

          {exceededMg > 0 && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              紀錄用量已超過這支規格的標稱總量，請確認起始日期是否包含其他支筆的施打紀錄；需要重新計算時，可解除綁定後建立新的規劃。
            </div>
          )}

          <div className="rounded-xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700">已納入的施打紀錄</div>
            {activeLogs.length === 0 ? (
              <p className="px-4 py-5 text-sm text-slate-400">指定日期後尚無施打紀錄。</p>
            ) : (
              <div className="divide-y divide-slate-100">
                {activeLogs.slice(0, 12).map(log => (
                  <div key={log.id} className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
                    <div><span className="font-bold text-indigo-700">{log.username}</span><span className="ml-2 text-slate-500">{formatLogDate(log.date)}</span></div>
                    <span className="font-bold text-emerald-700">{log.dose} mg</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">估算依雲端施打紀錄自動更新，不包含排氣耗損與不可使用的殘留藥液，也不能取代醫師或藥師的用藥指示。</p>
        </div>
      )}

      {!hasOpenPlan && (
        <div className="space-y-4">
          {availableShareUsers.length === 0 ? (
            <div className="text-sm text-slate-500 bg-slate-50 border border-dashed border-slate-200 rounded-xl p-4">目前沒有可邀請的使用者；其他帳號可能已有等待中或進行中的綁定。</div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">選擇共同規劃使用者</label>
                  <select value={shareUsername} onChange={handleShareUserChange} className="w-full border border-slate-300 rounded-xl px-3 py-3 bg-white focus:ring-2 focus:ring-indigo-500">
                    <option value="">請選擇使用者</option>
                    {availableShareUsers.map(user => <option key={user.id} value={user.username}>{user.username}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">納入紀錄起始日期</label>
                  <input type="date" value={shareStartDate} onChange={event => setShareStartDate(event.target.value)} className="w-full border border-slate-300 rounded-xl px-3 py-3 focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>
              <div className="rounded-xl bg-blue-50 border border-blue-100 p-4 text-sm text-blue-700">
                將以目前選擇的 <strong>{penStrength} mg</strong> 規格建立邀請，並納入起始日期後雙方的所有施打紀錄。若過去紀錄來自不同支筆，請調整起始日期。
              </div>
              <button type="button" disabled={!shareUsername || !shareStartDate || isSaving} onClick={handleSendRequest} className="w-full rounded-xl bg-indigo-600 px-4 py-3 font-bold text-white hover:bg-indigo-700 disabled:bg-slate-400 disabled:cursor-not-allowed">
                {isSaving ? '送出中...' : '送出綁定邀請'}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function CalculatorView({ appUser, usersList, allLogs, allSchedules, sharingPlans, inventory }) {
  const [penStrength, setPenStrength] = useState(10); 
  const [targetDose, setTargetDose] = useState(2.5); 
  const [customDose, setCustomDose] = useState(''); 
  const [clicks, setClicks] = useState(0);
  const [exactClicks, setExactClicks] = useState(0);
  const [totalDoses, setTotalDoses] = useState(0);
  const [isExceeding, setIsExceeding] = useState(false);

  useEffect(() => {
    if (Number(inventory?.penStrength) > 0) setPenStrength(Number(inventory.penStrength));
  }, [inventory?.penStrength]);

  useEffect(() => {
    if (targetDose > 0 && penStrength > 0) {
      const calculatedExactClicks = (targetDose / penStrength) * 60;
      setExactClicks(calculatedExactClicks);
      setClicks(Math.round(calculatedExactClicks));
      const totalMgInPen = penStrength * 4;
      setTotalDoses(totalMgInPen / targetDose);
      setIsExceeding(targetDose > totalMgInPen);
    } else {
      setClicks(0); setExactClicks(0); setTotalDoses(0); setIsExceeding(false);
    }
  }, [penStrength, targetDose]);

  const handlePresetDose = (dose) => { setTargetDose(dose); setCustomDose(''); };
  const handleCustomDoseChange = (e) => {
    const val = e.target.value;
    setCustomDose(val);
    const numVal = parseFloat(val);
    if (!isNaN(numVal) && numVal > 0) setTargetDose(numVal);
    else setTargetDose(0);
  };

  let fullInjections = 0, remainingClicks = clicks;
  if (clicks > 60) {
    fullInjections = Math.floor(clicks / 60);
    remainingClicks = clicks % 60;
  }
  const completeDoseCount = targetDose > 0 ? Math.floor(totalDoses + 0.0001) : 0;
  const remainingDoseMg = targetDose > 0 ? Math.max(0, (penStrength * 4) - (completeDoseCount * targetDose)) : 0;

  return (
    <div className="space-y-6 animation-fade-in">
      <div className="bg-gradient-to-br from-indigo-50 via-white to-violet-50 rounded-2xl shadow-sm border border-indigo-100 p-5 sm:p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
          <span className="bg-indigo-600 text-white w-6 h-6 rounded-full inline-flex items-center justify-center text-sm mr-2 shadow-sm">1</span>
          您購買的筆針規格？
        </h2>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {PEN_OPTIONS.map((strength) => (
            <button key={strength} onClick={() => setPenStrength(strength)}
              className={`py-3 rounded-xl border text-sm font-medium transition-all duration-200 ${penStrength === strength ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-600' : 'border-slate-200 bg-white text-slate-600 hover:border-indigo-300 hover:bg-slate-50'}`}
            >
              {strength} mg
            </button>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-br from-emerald-50 via-white to-cyan-50 rounded-2xl shadow-sm border border-emerald-100 p-5 sm:p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
          <span className="bg-indigo-600 text-white w-6 h-6 rounded-full inline-flex items-center justify-center text-sm mr-2 shadow-sm">2</span>
          這次要施打的劑量？
        </h2>
        <div className="flex flex-wrap gap-2 mb-5">
          {COMMON_DOSES.map((dose) => (
            <button key={dose} onClick={() => handlePresetDose(dose)}
              className={`px-3 py-2 rounded-xl border text-sm font-medium transition-all duration-200 ${targetDose === dose && customDose === '' ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm ring-1 ring-emerald-500' : 'border-slate-200 bg-white text-slate-600 hover:border-emerald-200 hover:bg-slate-50'}`}
            >
              {dose} mg
            </button>
          ))}
        </div>
        <div className="pt-4 border-t border-slate-100">
          <label className="block text-sm font-medium text-slate-600 mb-2">或輸入自訂劑量 (mg)：</label>
          <input type="number" value={customDose} onChange={handleCustomDoseChange} placeholder="例如：3.5" step="0.1"
            className="w-full sm:w-1/2 border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800" />
        </div>
      </div>

      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl shadow-lg p-1">
        <div className="bg-white/95 backdrop-blur-sm rounded-[14px] p-6 sm:p-8">
          <h3 className="text-center text-slate-500 font-medium mb-2">換算結果（格數）</h3>
          {isExceeding ? (
            <div className="text-center py-6">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mb-3"><AlertTriangle /></div>
              <h4 className="text-lg font-bold text-red-600 mb-2">錯誤：劑量超出整支筆容量</h4>
              <p className="text-sm text-slate-600">您輸入的劑量 ({targetDose}mg) 已經超過了這支筆的總含藥量 ({penStrength * 4}mg)。</p>
            </div>
          ) : targetDose > 0 ? (
            <div className="flex flex-col items-center">
              <div className="flex items-baseline space-x-2 my-2">
                <span className="text-6xl sm:text-7xl font-black text-indigo-600 tracking-tighter">{clicks}</span>
                <span className="text-xl text-slate-500 font-medium pb-2">格</span>
              </div>
              {Math.abs(exactClicks - clicks) > 0.01 && (
                <p className="text-xs text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg mb-4 flex items-center">
                  <AlertTriangle /><span className="ml-1">精確值 {exactClicks.toFixed(1)} 格，已四捨五入。</span>
                </p>
              )}
              {fullInjections > 0 && (
                <div className="w-full bg-blue-50 border border-blue-100 rounded-xl p-4 mt-2 mb-4">
                  <p className="font-semibold text-blue-800 mb-2 flex items-center text-sm">
                    <InfoIcon /> <span className="ml-2">此劑量已超過單次轉動上限 (60格)</span>
                  </p>
                  <ul className="list-decimal pl-5 space-y-1 text-xs text-blue-700">
                    <li>請先轉滿 <strong>60格</strong> 並施打 ({fullInjections}次)。</li>
                    {remainingClicks > 0 && <li>拔出換新針頭後，再次轉 <strong>{remainingClicks}格</strong> 並施打。</li>}
                  </ul>
                </div>
              )}
              <div className="w-full grid grid-cols-2 gap-4 mt-4 border-t border-slate-100 pt-4">
                <div className="text-center">
                  <p className="text-xs text-slate-400 mb-1">可完整施打</p>
                  <p className="text-lg font-bold text-slate-700">約 {completeDoseCount} <span className="text-xs font-normal text-slate-500">次</span></p>
                  {remainingDoseMg > 0.05 && <p className="mt-1 text-[11px] text-slate-500">估算剩餘 {remainingDoseMg.toFixed(1)} mg</p>}
                </div>
                <div className="text-center">
                  <p className="text-xs text-slate-400 mb-1">預估使用時間</p>
                  <p className="text-lg font-bold text-slate-700">{completeDoseCount} <span className="text-xs font-normal text-slate-500">週</span></p>
                </div>
              </div>
              <div className="mt-4 w-full rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-medium leading-relaxed text-amber-900">
                僅供劑量與庫存換算，不作為施打指示；實際劑量與操作方式請依醫師、藥師及原廠說明。
              </div>
            </div>
          ) : (
            <div className="text-center py-10 text-slate-400">請輸入欲施打的劑量</div>
          )}
        </div>
      </div>

      <SingleDoseTracker
        appUser={appUser}
        allLogs={allLogs}
        inventory={inventory}
        penStrength={penStrength}
      />

      <SharedDosePlanner
        appUser={appUser}
        usersList={usersList}
        allLogs={allLogs}
        allSchedules={allSchedules}
        sharingPlans={sharingPlans}
        penStrength={penStrength}
      />
    </div>
  );
}

function ScheduleView({ appUser, userSchedule, allLogs, inventory, sharingPlans, allSchedules }) {
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [startDose, setStartDose] = useState(2.5);
  const [schedule, setSchedule] = useState([]);
  const [isCustomized, setIsCustomized] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editDate, setEditDate] = useState('');
  const [editDose, setEditDose] = useState('');
  const [lastSavedHash, setLastSavedHash] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [hasLoadedPlan, setHasLoadedPlan] = useState(false);

  const serializePlan = (date, dose, items, customized) => JSON.stringify({
    startDate: date,
    startDose: Number(dose),
    schedule: items.map(item => ({
      week: item.week,
      date: item.date instanceof Date ? item.date.toISOString() : new Date(item.date).toISOString(),
      dose: Number(item.dose)
    })),
    isCustomized: Boolean(customized)
  });

  useEffect(() => {
    if (!appUser) return;

    if (userSchedule?.schedule?.length) {
      const restoredSchedule = userSchedule.schedule.map(item => ({
        ...item,
        date: item.date?.toDate ? item.date.toDate() : new Date(item.date)
      }));
      const incomingHash = serializePlan(
        userSchedule.startDate,
        userSchedule.startDose,
        restoredSchedule,
        userSchedule.isCustomized
      );
      const localHash = schedule.length > 0
        ? serializePlan(startDate, startDose, schedule, isCustomized)
        : '';

      // 使用者正在編輯時，不讓其他即時快照覆蓋尚未同步的內容。
      if (hasLoadedPlan && localHash && localHash !== lastSavedHash) return;
      if (hasLoadedPlan && incomingHash === lastSavedHash) return;

      setStartDate(userSchedule.startDate);
      setStartDose(Number(userSchedule.startDose));
      setSchedule(restoredSchedule);
      setIsCustomized(Boolean(userSchedule.isCustomized));
      setLastSavedHash(incomingHash);
      setHasLoadedPlan(true);
      return;
    }

    const saved = localStorage.getItem(`schedule_${appUser.username}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setStartDate(parsed.startDate);
        setStartDose(parsed.startDose);
        if (parsed.schedule) {
          const restoredSchedule = parsed.schedule.map(item => ({ ...item, date: new Date(item.date) }));
          setSchedule(restoredSchedule);
          setIsCustomized(Boolean(parsed.isCustomized));
        }
      } catch (error) {
        console.error('Restore local schedule error:', error);
      }
    }
    setHasLoadedPlan(true);
  }, [appUser, userSchedule, hasLoadedPlan]);

  useEffect(() => {
    // 必須先完成雲端／本機計畫還原，才能建立預設計畫。
    // 否則重新整理時，預設值會在同一輪 effect 中蓋掉剛載入的微調內容。
    if (hasLoadedPlan && !isCustomized) generateSchedule();
  }, [startDate, startDose, isCustomized, hasLoadedPlan]);

  useEffect(() => {
    if (appUser && schedule.length > 0) {
      localStorage.setItem(`schedule_${appUser.username}`, JSON.stringify({ startDate, startDose, schedule, isCustomized }));
    }
  }, [schedule, startDate, startDose, isCustomized, appUser]);

  const currentPlanHash = schedule.length > 0
    ? serializePlan(startDate, startDose, schedule, isCustomized)
    : '';
  const hasUnsavedChanges = Boolean(currentPlanHash && currentPlanHash !== lastSavedHash);

  const todayKey = toLocalDateKey(new Date());
  const buildUpcomingEntries = (items, username) => (items || [])
    .map(item => {
      const parsedDate = item.date?.toDate ? item.date.toDate() : new Date(item.date);
      return { ...item, username, parsedDate, dateKey: toLocalDateKey(parsedDate), dose: Number(item.dose) };
    })
    .filter(item => item.dateKey && item.dateKey >= todayKey && item.dose > 0)
    .filter(item => !allLogs.some(log => log.username === username && isInjectionLog(log) && log.date === item.dateKey))
    .sort((a, b) => a.parsedDate - b.parsedDate);

  const ownIncludedLogs = inventory ? allLogs.filter(log => log.username === appUser.username && isInjectionLog(log) && log.date >= inventory.startDate) : [];
  const ownTotalMg = inventory ? Number(inventory.penStrength) * 4 : 0;
  const ownUsedMg = ownIncludedLogs.reduce((sum, log) => sum + Number(log.dose || 0), 0);
  const ownRemainingMg = Math.max(0, ownTotalMg - ownUsedMg);
  const ownFutureEntries = buildUpcomingEntries(schedule, appUser.username);
  const ownProjection = inventory ? calculateDoseExhaustion(ownRemainingMg, ownFutureEntries) : null;

  const activeSharedPlan = sharingPlans.find(plan => plan.status === 'active' && (plan?.participants?.includes(appUser.username) || plan.requester === appUser.username || plan.partner === appUser.username));
  const sharedParticipants = activeSharedPlan?.participants?.length === 2 ? activeSharedPlan.participants : activeSharedPlan ? [activeSharedPlan.requester, activeSharedPlan.partner] : [];
  const sharedTotalMg = activeSharedPlan ? Number(activeSharedPlan.penStrength) * 4 : 0;
  const sharedUsedMg = activeSharedPlan ? allLogs
    .filter(log => sharedParticipants.includes(log.username) && isInjectionLog(log) && log.date >= activeSharedPlan.startDate)
    .reduce((sum, log) => sum + Number(log.dose || 0), 0) : 0;
  const sharedRemainingMg = Math.max(0, sharedTotalMg - sharedUsedMg);
  const sharedFutureEntries = activeSharedPlan ? sharedParticipants.flatMap(username => {
    if (username === appUser.username) return buildUpcomingEntries(schedule, username);
    const participantSchedule = allSchedules.find(item => item.id === username || item.username === username);
    return buildUpcomingEntries(participantSchedule?.schedule || [], username);
  }).sort((a, b) => a.parsedDate - b.parsedDate) : [];
  const sharedProjection = activeSharedPlan ? calculateDoseExhaustion(sharedRemainingMg, sharedFutureEntries) : null;

  const generateSchedule = () => {
    if (!startDate) return;
    const newSchedule = [];
    let currentDate = new Date(startDate);
    let currentDoseIndex = STANDARD_TITRATION.findIndex(d => d >= startDose);
    if (currentDoseIndex === -1) currentDoseIndex = 0;
    let currentDoseValue = STANDARD_TITRATION[currentDoseIndex];

    for (let week = 1; week <= 16; week++) {
      newSchedule.push({ week, date: new Date(currentDate), dose: currentDoseValue });
      if (week % 4 === 0) {
        currentDoseIndex = Math.min(currentDoseIndex + 1, STANDARD_TITRATION.length - 1);
        currentDoseValue = STANDARD_TITRATION[currentDoseIndex];
      }
      currentDate.setDate(currentDate.getDate() + 7);
    }
    setSchedule(newSchedule);
  };

  const handleEditClick = (index, item) => {
    setEditingIndex(index);
    const dateString = new Date(item.date.getTime() - (item.date.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
    setEditDate(dateString);
    setEditDose(item.dose);
  };

  const handleSaveEdit = (index) => {
    const updated = [...schedule];
    updated[index] = { ...updated[index], date: new Date(editDate), dose: parseFloat(editDose) || updated[index].dose };
    setSchedule(updated);
    setEditingIndex(null);
    setIsCustomized(true);
  };

  const handleSaveToCloud = async () => {
    if (!appUser || schedule.length === 0 || isSaving) return;
    setIsSaving(true);
    setSaveError('');

    const normalizedSchedule = schedule.map(item => ({
      week: item.week,
      date: item.date instanceof Date ? item.date.toISOString() : new Date(item.date).toISOString(),
      dose: Number(item.dose)
    }));

    try {
      await setDoc(doc(db, 'mounjaroSchedules', appUser.username), {
        username: appUser.username,
        startDate,
        startDose: Number(startDose),
        schedule: normalizedSchedule,
        isCustomized: Boolean(isCustomized),
        updatedAt: new Date().toISOString()
      });
      setLastSavedHash(serializePlan(startDate, startDose, schedule, isCustomized));
    } catch (error) {
      console.error('Save schedule error:', error);
      setSaveError('雲端儲存失敗，請確認網路後再試一次。');
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if (!hasLoadedPlan || !hasUnsavedChanges || isSaving || saveError || schedule.length === 0) return;

    const autoSaveTimer = setTimeout(() => {
      handleSaveToCloud();
    }, 800);

    return () => clearTimeout(autoSaveTimer);
  }, [currentPlanHash, hasLoadedPlan, hasUnsavedChanges, isSaving, lastSavedHash, saveError]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sm:p-6 animation-fade-in">
      <div className={`mb-5 rounded-xl border p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${saveError ? 'bg-red-50 border-red-200' : hasUnsavedChanges ? 'bg-amber-50 border-amber-200' : 'bg-emerald-50 border-emerald-200'}`}>
        <div>
          <p className={`text-sm font-bold ${saveError ? 'text-red-700' : hasUnsavedChanges ? 'text-amber-800' : 'text-emerald-800'}`}>
            {saveError ? '雲端同步失敗' : isSaving ? '正在自動儲存計畫...' : hasUnsavedChanges ? '偵測到調整，準備同步...' : '計畫已自動同步至雲端'}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            {hasUnsavedChanges ? '停止調整後會自動儲存，不需要另外按按鈕。' : '每次調整日期或劑量後，系統都會自動更新雲端計畫。'}
          </p>
          {saveError && <p className="text-xs text-red-600 font-medium mt-2">{saveError}</p>}
        </div>
        {saveError ? (
          <button onClick={handleSaveToCloud} disabled={isSaving} className="shrink-0 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-lg shadow-sm transition-colors disabled:bg-slate-300 flex items-center justify-center">
            <span>重新儲存</span>
          </button>
        ) : (
          <span className={`shrink-0 inline-flex items-center px-3 py-2 rounded-lg text-xs font-bold ${hasUnsavedChanges ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
            <CheckIcon /><span className="ml-1.5">{hasUnsavedChanges ? '自動同步中' : '雲端已更新'}</span>
          </span>
        )}
      </div>

      <div className={`grid gap-4 mb-6 ${activeSharedPlan ? 'lg:grid-cols-2' : 'grid-cols-1'}`}>
        <div className="relative overflow-hidden rounded-2xl border border-violet-200 bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-600 p-5 text-white shadow-lg shadow-indigo-200/60">
          <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full border-[18px] border-white/10"></div>
          <div className="relative">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-indigo-100">單人用量預測</p>
                <h3 className="mt-1 text-lg font-black">目前這支筆何時用完？</h3>
              </div>
              {inventory && <span className="forecast-badge shrink-0 rounded-full px-3 py-1 text-xs font-bold ring-1 ring-white/20">{inventory.penStrength} mg 規格</span>}
            </div>
            {!inventory ? (
              <div className="forecast-glass mt-5 rounded-xl p-4 text-sm text-white ring-1 ring-white/15">
                請先到「劑量計算」儲存目前這支筆的起始日期，系統即可依計畫表推算用完時間。
              </div>
            ) : (
              <div className="mt-5">
                <p className="text-sm text-indigo-100">目前預估剩餘</p>
                <p className="mt-1 text-4xl font-black">{ownRemainingMg.toFixed(1)} <span className="text-sm font-bold">mg</span></p>
                <div className="forecast-glass mt-4 rounded-xl p-4 ring-1 ring-white/20">
                  {ownProjection.exhausted ? (
                    <><p className="font-black text-amber-200">已達標稱總量</p><p className="mt-1 text-sm text-indigo-100">請建立新一支筆的起始日期。</p></>
                  ) : ownProjection.exhaustionEntry ? (
                    <><p className="text-xl font-black">預估 {formatLogDate(ownProjection.exhaustionEntry.dateKey)} 用完</p><p className="mt-1 text-sm text-indigo-100">第 {ownProjection.exhaustionEntry.week} 週施打 {ownProjection.exhaustionEntry.dose} mg 後達到標稱總量。</p></>
                  ) : (
                    <><p className="font-black text-emerald-200">目前計畫期間內尚不會用完</p><p className="mt-1 text-sm text-indigo-100">依現有計畫結束後，預估仍剩 {ownProjection.remainingAfterPlan.toFixed(1)} mg。</p></>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {activeSharedPlan && (
          <div className="relative overflow-hidden rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 p-5 text-white shadow-lg shadow-emerald-200/60">
            <div className="absolute -right-8 -bottom-10 h-32 w-32 rounded-full bg-white/10 blur-sm"></div>
            <div className="relative">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-emerald-50">雙方綁定預測</p>
                  <h3 className="mt-1 text-lg font-black">兩人合併用量何時用完？</h3>
                </div>
                <span className="forecast-badge shrink-0 rounded-full px-3 py-1 text-xs font-bold ring-1 ring-white/20">{activeSharedPlan.penStrength} mg 規格</span>
              </div>
              <div className="mt-5">
                <p className="text-sm text-emerald-50">合併預估剩餘</p>
                <p className="mt-1 text-4xl font-black">{sharedRemainingMg.toFixed(1)} <span className="text-sm font-bold">mg</span></p>
                <div className="forecast-glass mt-4 rounded-xl p-4 ring-1 ring-white/20">
                  {sharedProjection.exhausted ? (
                    <><p className="font-black text-amber-100">已達標稱總量</p><p className="mt-1 text-sm text-emerald-50">請解除綁定並建立新一組規劃。</p></>
                  ) : sharedProjection.exhaustionEntry ? (
                    <><p className="text-xl font-black">預估 {formatLogDate(sharedProjection.exhaustionEntry.dateKey)} 用完</p><p className="mt-1 text-sm text-emerald-50">計入 {sharedProjection.exhaustionEntry.username} 的 {sharedProjection.exhaustionEntry.dose} mg 計畫後達到標稱總量。</p></>
                  ) : (
                    <><p className="font-black text-cyan-100">目前兩人的計畫期間內尚不會用完</p><p className="mt-1 text-sm text-emerald-50">依現有計畫結束後，預估仍剩 {sharedProjection.remainingAfterPlan.toFixed(1)} mg。</p></>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mb-4 flex flex-col sm:flex-row sm:items-end gap-4 bg-slate-50 p-4 rounded-xl relative">
        <div className="flex-1">
          <label className="block text-sm font-medium text-slate-600 mb-1">第一針施打日期</label>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} disabled={isCustomized}
            className={`w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 ${isCustomized ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-white'}`} />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-slate-600 mb-1">起始劑量</label>
          <select value={startDose} onChange={(e) => setStartDose(parseFloat(e.target.value))} disabled={isCustomized}
            className={`w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 ${isCustomized ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-white'}`}>
            {STANDARD_TITRATION.map(dose => <option key={dose} value={dose}>{dose} mg</option>)}
          </select>
        </div>
      </div>
      
      {isCustomized && (
        <div className="mb-6 flex justify-end">
          <button onClick={() => { setIsCustomized(false); setEditingIndex(null); }} className="min-h-[44px] text-sm px-3 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors flex items-center shadow-sm border border-indigo-100">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
            重置為標準遞增計畫
          </button>
        </div>
      )}

      <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 mb-6 text-sm text-indigo-800">
        <p className="flex items-start">
          <span className="mt-0.5 mr-2"><InfoIcon /></span>
          <span>此計畫表依據原廠建議遞增。<strong>點擊每週卡片右上角的鉛筆圖示</strong>，即可調整日期與劑量。實際施打請依醫囑為準。</span>
        </p>
      </div>

      <div className="relative border-l-2 border-indigo-100 ml-3 sm:ml-4 space-y-6">
        {schedule.map((item, index) => {
          const isDoseChange = index === 0 || item.dose !== schedule[index - 1].dose;
          const isEditing = editingIndex === index;
          return (
            <div key={item.week} className="relative pl-6 group">
              <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-white ${isDoseChange ? 'bg-indigo-500' : 'bg-slate-300'}`}></div>
              <div className={`p-4 rounded-xl border transition-all duration-200 ${isEditing ? 'bg-indigo-50/50 border-indigo-400 shadow-md ring-1 ring-indigo-400' : isDoseChange ? 'bg-white border-indigo-200 shadow-sm' : 'bg-slate-50 border-slate-100 hover:border-indigo-200'}`}>
                {isEditing ? (
                  <div className="space-y-3 animation-fade-in">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-bold text-indigo-700 flex items-center"><PencilIcon /> <span className="ml-1.5">微調第 {item.week} 週</span></span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">預計施打日期</label>
                        <input type="date" value={editDate} onChange={e => setEditDate(e.target.value)} className="w-full border border-indigo-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 bg-white" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">預計劑量 (mg)</label>
                        <input type="number" step="0.1" value={editDose} onChange={e => setEditDose(e.target.value)} className="w-full border border-indigo-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 bg-white" />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-2 border-t border-indigo-100 mt-3">
                      <button onClick={() => setEditingIndex(null)} className="min-h-[44px] px-3 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 flex items-center transition-colors">
                        <XIcon /> <span className="ml-1">取消</span>
                      </button>
                      <button onClick={() => handleSaveEdit(index)} className="min-h-[44px] px-3 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 flex items-center shadow-sm transition-colors">
                        <CheckIcon /> <span className="ml-1">儲存微調</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-semibold text-slate-500">第 {item.week} 週</span>
                      <div className="flex items-center space-x-3">
                        <span className="text-sm text-slate-500">{item.date.toLocaleDateString('zh-TW')}</span>
                        <button onClick={() => handleEditClick(index, item)} className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-indigo-50 hover:text-indigo-600 md:opacity-0 md:group-hover:opacity-100 focus:opacity-100" title="手動微調" aria-label={`微調第 ${item.week} 週計畫`}>
                          <PencilIcon />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center mt-2">
                      <span className="text-slate-700 mr-2 text-sm">預計施打劑量：</span>
                      <span className={`font-bold px-2 py-1 rounded text-sm shadow-sm border ${isDoseChange ? 'bg-indigo-50 text-indigo-700 border-indigo-100' : 'bg-white text-slate-700 border-slate-200'}`}>
                        {item.dose} mg
                      </span>
                      {isDoseChange && !isCustomized && <span className="ml-2 text-xs text-indigo-500 font-medium">(標準遞增)</span>}
                      {isCustomized && isDoseChange && <span className="ml-2 text-xs text-amber-500 font-medium">(劑量變化)</span>}
                    </div>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function HealthInsightPanel({ appUser, logs }) {
  const [profile, setProfile] = useState(null);
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [heightCm, setHeightCm] = useState('');
  const [age, setAge] = useState('');
  const [targetWeightKg, setTargetWeightKg] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [targetDateChoice, setTargetDateChoice] = useState('custom');
  const [showDemographicsEditor, setShowDemographicsEditor] = useState(false);
  const [profileMessage, setProfileMessage] = useState('');
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [goalMessage, setGoalMessage] = useState('');
  const [isSavingGoal, setIsSavingGoal] = useState(false);

  useEffect(() => {
    if (!db || !appUser?.username) return undefined;
    const profileRef = doc(db, 'mounjaroProfiles', appUser.username);
    return onSnapshot(profileRef, (snapshot) => {
      setProfile(snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null);
      setProfileLoaded(true);
    }, error => console.error('Fetch own profile error:', error));
  }, [appUser?.username]);

  useEffect(() => {
    setHeightCm(profile?.heightCm ? String(profile.heightCm) : '');
    setAge(profile?.age ? String(profile.age) : '');
    setTargetWeightKg(profile?.targetWeightKg ? String(profile.targetWeightKg) : '');
    setTargetDate(profile?.targetDate || '');
    setTargetDateChoice('custom');
  }, [profile?.heightCm, profile?.age, profile?.targetWeightKg, profile?.targetDate]);

  useEffect(() => {
    if (profileLoaded && (!profile?.heightCm || !profile?.age)) setShowDemographicsEditor(true);
  }, [profileLoaded, profile?.heightCm, profile?.age]);

  const effectiveProfile = {
    heightCm: Number(profile?.heightCm) || null,
    age: Number(profile?.age) || null
  };
  const snapshot = buildHealthSnapshot(logs, effectiveProfile);
  const latestInjection = snapshot.injectionLogs[snapshot.injectionLogs.length - 1];
  const savedTargetWeight = Number(profile?.targetWeightKg);
  const hasSavedTarget = Number.isFinite(savedTargetWeight) && savedTargetWeight >= 20 && savedTargetWeight <= 300;
  const hasGoal = hasSavedTarget
    && snapshot.firstWeightKg !== null
    && savedTargetWeight < snapshot.firstWeightKg;
  const goalRange = hasGoal ? snapshot.firstWeightKg - savedTargetWeight : 0;
  const goalProgress = hasGoal && goalRange > 0
    ? Math.min(100, Math.max(0, ((snapshot.firstWeightKg - snapshot.latestWeightKg) / goalRange) * 100))
    : 0;
  const remainingToGoal = hasGoal ? Math.max(0, snapshot.latestWeightKg - savedTargetWeight) : null;
  const goalReached = hasGoal && snapshot.latestWeightKg <= savedTargetWeight;
  const savedTargetDate = profile?.targetDate || '';
  const todayKey = toLocalDateKey(new Date());
  const oneMonthDateKey = getFutureMonthDateKey(1);
  const twoMonthDateKey = getFutureMonthDateKey(2);
  const goalDaysRemaining = savedTargetDate
    ? Math.round((new Date(`${savedTargetDate}T12:00:00`) - new Date(`${todayKey}T12:00:00`)) / 86400000)
    : null;
  const targetDateLabel = savedTargetDate
    ? new Date(`${savedTargetDate}T12:00:00`).toLocaleDateString('zh-TW', { year: 'numeric', month: 'numeric', day: 'numeric', weekday: 'short' })
    : '';

  const resetDemographicsEditor = () => {
    setHeightCm(profile?.heightCm ? String(profile.heightCm) : '');
    setAge(profile?.age ? String(profile.age) : '');
    setProfileMessage('');
    setShowDemographicsEditor(false);
  };

  const handleSaveProfile = async (event) => {
    event.preventDefault();
    const parsedHeight = Number(heightCm);
    const parsedAge = Number(age);
    if (!Number.isFinite(parsedHeight) || parsedHeight < 120 || parsedHeight > 230 || !Number.isInteger(parsedAge) || parsedAge < 18 || parsedAge > 100) {
      setProfileMessage('請輸入 120–230 公分的身高，以及 18–100 歲的整數年齡。');
      return;
    }
    setIsSavingProfile(true);
    setProfileMessage('');
    try {
      await setDoc(doc(db, 'mounjaroProfiles', appUser.username), {
        username: appUser.username,
        heightCm: parsedHeight,
        age: parsedAge,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      setProfileMessage('身高與年齡已更新。');
      setShowDemographicsEditor(false);
    } catch (error) {
      console.error('儲存個人健康資料失敗:', error);
      setProfileMessage('儲存失敗，請稍後再試。');
    }
    setIsSavingProfile(false);
  };

  const handleSaveGoal = async (event) => {
    event.preventDefault();
    const parsedTargetWeight = targetWeightKg === '' ? null : Number(targetWeightKg);
    if (parsedTargetWeight !== null && (!Number.isFinite(parsedTargetWeight) || parsedTargetWeight < 20 || parsedTargetWeight > 300)) {
      setGoalMessage('目標體重請輸入 20–300 kg。');
      return;
    }
    if (parsedTargetWeight !== null && snapshot.firstWeightKg !== null && parsedTargetWeight >= snapshot.firstWeightKg) {
      setGoalMessage(`目標體重需低於第一筆紀錄 ${snapshot.firstWeightKg} kg。`);
      return;
    }
    if (targetDate && targetDate < todayKey) {
      setGoalMessage('預計達成日期不可早於今天。');
      return;
    }
    if (parsedTargetWeight === null && targetDate) {
      setGoalMessage('請先輸入目標體重，再設定預計達成日期。');
      return;
    }
    setIsSavingGoal(true);
    setGoalMessage('');
    try {
      await setDoc(doc(db, 'mounjaroProfiles', appUser.username), {
        username: appUser.username,
        targetWeightKg: parsedTargetWeight,
        targetDate: parsedTargetWeight === null ? null : targetDate || null,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      setGoalMessage(parsedTargetWeight === null ? '目標設定已清除。' : '目標體重與日期已更新。');
    } catch (error) {
      console.error('儲存目標設定失敗:', error);
      setGoalMessage('目標儲存失敗，請稍後再試。');
    }
    setIsSavingGoal(false);
  };

  return (
    <section className="comic-card overflow-hidden rounded-3xl bg-[#fffdf7]">
      <div className="border-b-2 border-[#343434] bg-gradient-to-r from-[#e9f5fb] via-[#fffdf7] to-[#fff2bf] p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="comic-sticker rounded-full bg-[#7db9e8] px-3 py-1 text-[10px] font-black tracking-[0.12em] text-[#252525]">健康概況</span>
            </div>
            <h2 className="mt-3 text-xl font-black text-slate-900">體重與個人目標</h2>
            <p className="mt-1 text-sm text-slate-600">集中查看目前數值與目標完成進度。</p>
            <button
              type="button"
              onClick={() => {
                if (showDemographicsEditor) {
                  resetDemographicsEditor();
                } else {
                  setHeightCm(profile?.heightCm ? String(profile.heightCm) : '');
                  setAge(profile?.age ? String(profile.age) : '');
                  setProfileMessage('');
                  setShowDemographicsEditor(true);
                }
              }}
              className="mt-3 inline-flex min-h-[40px] items-center rounded-full border-2 border-[#343434] bg-white px-4 py-2 text-xs font-black text-slate-700 shadow-[2px_2px_0_rgba(52,52,52,.1)] hover:bg-[#e9f5fb]"
            >
              {showDemographicsEditor ? '收合身高／年齡' : '✎ 更新身高／年齡'}
            </button>
            {!showDemographicsEditor && profileMessage && <p className="mt-2 text-xs font-bold text-emerald-700">{profileMessage}</p>}
          </div>
          <div className="rounded-2xl border-2 border-[#343434] bg-[#fff4bd] px-4 py-3 text-xs leading-relaxed text-[#5f4c19] shadow-[3px_3px_0_rgba(52,52,52,.1)] sm:max-w-xs">
            請勿只依體重趨勢自行調整劑量；任何調整都應由開藥醫療人員評估。
          </div>
        </div>
      </div>

      <div className="space-y-5 p-5 sm:p-6">
        {showDemographicsEditor && (
          <form onSubmit={handleSaveProfile} className="animation-fade-in rounded-2xl border border-slate-200 bg-[#fbf8f0] p-4">
            <div className="grid gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
              <div>
                <label className="mb-1 block text-xs font-bold text-slate-600">身高（cm）</label>
                <input type="number" min="120" max="230" step="0.1" value={heightCm} onChange={event => { setHeightCm(event.target.value); setProfileMessage(''); }} placeholder="例如 168" className="w-full rounded-xl border px-3 py-2.5" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold text-slate-600">年齡</label>
                <input type="number" min="18" max="100" step="1" value={age} onChange={event => { setAge(event.target.value); setProfileMessage(''); }} placeholder="例如 35" className="w-full rounded-xl border px-3 py-2.5" />
              </div>
              <div className="grid grid-cols-2 gap-2 sm:flex">
                <button type="button" onClick={resetDemographicsEditor} className="min-h-[44px] rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-slate-600">取消</button>
                <button type="submit" disabled={isSavingProfile} className="min-h-[44px] rounded-xl border-2 border-[#343434] bg-[#7db9e8] px-5 py-2.5 text-sm font-black text-[#252525] shadow-[3px_3px_0_rgba(52,52,52,.12)] hover:bg-[#92c7ed] disabled:bg-slate-200">
                  {isSavingProfile ? '同步中...' : '儲存'}
                </button>
              </div>
            </div>
            {profileMessage && <p className="mt-2 text-xs font-bold text-red-600">{profileMessage}</p>}
          </form>
        )}

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">最新體重</p>
            <p className="mt-2 text-xl font-black text-slate-900">{snapshot.latestWeightKg ?? '—'} <small className="text-xs text-slate-500">kg</small></p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-[#eef7fc] p-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">每週變化</p>
            <p className="mt-2 text-xl font-black text-sky-700">{snapshot.weeklyLossKg === null ? '—' : `${snapshot.weeklyLossKg >= 0 ? '−' : '+'}${Math.abs(snapshot.weeklyLossKg)}`} <small className="text-xs text-slate-500">kg</small></p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-[#fff8dc] p-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">成人 BMI</p>
            <p className="mt-2 text-xl font-black text-amber-700">{snapshot.bmi ?? '—'}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-[#eff8f0] p-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">最近劑量</p>
            <p className="mt-2 text-xl font-black text-emerald-700">{latestInjection?.doseMg ?? '—'} <small className="text-xs text-slate-500">mg</small></p>
          </div>
        </div>

        <div className="rounded-2xl border-2 border-[#343434] bg-gradient-to-r from-[#e9f5fb] to-[#eff8f0] p-4 shadow-[3px_3px_0_rgba(52,52,52,.1)] sm:p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-sm font-black text-slate-800">目標體重進度</p>
              <p className="mt-1 text-xs text-slate-500">從第一筆體重開始計算</p>
              {savedTargetDate && (
                <p className={`mt-1 text-xs font-bold ${goalDaysRemaining < 0 && !goalReached ? 'text-red-600' : 'text-sky-700'}`}>
                  預計 {targetDateLabel}
                  {goalReached
                    ? '・目標已達成'
                    : goalDaysRemaining > 0
                      ? `・剩餘 ${goalDaysRemaining} 天`
                      : goalDaysRemaining === 0
                        ? '・預計今天達成'
                        : `・已超過 ${Math.abs(goalDaysRemaining)} 天`}
                </p>
              )}
            </div>
            {hasGoal && (
              <span className={`rounded-full px-3 py-1 text-xs font-black ${goalReached ? 'bg-emerald-100 text-emerald-800' : 'bg-white text-sky-800'}`}>
                {goalReached ? '🎉 已達成目標' : `已完成 ${Math.round(goalProgress)}%`}
              </span>
            )}
          </div>

          <form onSubmit={handleSaveGoal} className="mt-4 grid min-w-0 gap-3 rounded-xl border border-slate-200 bg-white/70 p-3 sm:grid-cols-[.85fr_1.6fr_auto] sm:items-end">
            <div className="min-w-0">
              <label className="mb-1 block text-xs font-bold text-slate-600">目標體重（kg）</label>
              <input type="number" min="20" max="300" step="0.1" value={targetWeightKg} onChange={event => { setTargetWeightKg(event.target.value); setGoalMessage(''); }} placeholder="例如 75" className="w-full rounded-xl border px-3 py-2.5" />
            </div>
            <div className="min-w-0 overflow-hidden">
              <label className="mb-1 block text-xs font-bold text-slate-600">預計達成時間（選填）</label>
              <div className="grid grid-cols-3 gap-1.5">
                <button type="button" aria-pressed={targetDateChoice === 'oneMonth'} onClick={() => { setTargetDateChoice('oneMonth'); setTargetDate(oneMonthDateKey); setGoalMessage(''); }} className={`min-h-[44px] rounded-lg border px-2 py-1.5 text-[11px] font-black leading-tight ${targetDateChoice === 'oneMonth' ? 'border-sky-500 bg-sky-100 text-sky-800 ring-1 ring-sky-400' : 'border-slate-200 bg-white text-slate-600'}`}>
                  1 個月後<span className="mt-0.5 block text-[9px] font-medium opacity-75">{formatLogDate(oneMonthDateKey)}</span>
                </button>
                <button type="button" aria-pressed={targetDateChoice === 'twoMonths'} onClick={() => { setTargetDateChoice('twoMonths'); setTargetDate(twoMonthDateKey); setGoalMessage(''); }} className={`min-h-[44px] rounded-lg border px-2 py-1.5 text-[11px] font-black leading-tight ${targetDateChoice === 'twoMonths' ? 'border-emerald-500 bg-emerald-100 text-emerald-800 ring-1 ring-emerald-400' : 'border-slate-200 bg-white text-slate-600'}`}>
                  2 個月後<span className="mt-0.5 block text-[9px] font-medium opacity-75">{formatLogDate(twoMonthDateKey)}</span>
                </button>
                <button type="button" aria-pressed={targetDateChoice === 'custom'} onClick={() => { setTargetDateChoice('custom'); setGoalMessage(''); }} className={`min-h-[44px] rounded-lg border px-2 py-1.5 text-[11px] font-black ${targetDateChoice === 'custom' ? 'border-amber-500 bg-amber-100 text-amber-800 ring-1 ring-amber-400' : 'border-slate-200 bg-white text-slate-600'}`}>
                  指定日期
                </button>
              </div>
              {targetDateChoice === 'custom' && <input type="date" min={todayKey} value={targetDate} onChange={event => { setTargetDate(event.target.value); setGoalMessage(''); }} className="goal-date-input mt-2 rounded-xl border px-3 py-2.5" />}
            </div>
            <button type="submit" disabled={isSavingGoal} className="min-h-[44px] rounded-xl border-2 border-[#343434] bg-[#86bf8c] px-5 py-2.5 text-sm font-black text-[#252525] shadow-[3px_3px_0_rgba(52,52,52,.12)] hover:bg-[#9bcca0] disabled:bg-slate-200">
              {isSavingGoal ? '同步中...' : hasSavedTarget ? '更新目標' : '設定目標'}
            </button>
          </form>
          {goalMessage && (
            <p className={`mt-2 text-xs font-bold ${goalMessage.includes('已更新') || goalMessage.includes('已清除') ? 'text-emerald-700' : 'text-red-600'}`}>
              {goalMessage}
            </p>
          )}

          {!hasGoal ? (
            <div className="mt-4 rounded-xl border border-dashed border-sky-300 bg-white/70 px-4 py-5 text-center text-sm text-slate-600">
              {snapshot.firstWeightKg === null
                ? '新增第一筆體重後，即可開始計算目標進度。'
                : hasSavedTarget
                  ? `目標體重需低於起始的 ${snapshot.firstWeightKg} kg，請在上方更新。`
                  : '請在上方設定目標體重，開始追蹤完成進度。'}
            </div>
          ) : (
            <>
              <div className="mt-4 h-4 overflow-hidden rounded-full border border-slate-300 bg-white">
                <div className="h-full rounded-full bg-gradient-to-r from-[#7db9e8] via-[#86bf8c] to-[#f6d15f] transition-all duration-500" style={{ width: `${goalProgress}%` }}></div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                <div className="rounded-xl bg-white p-3">
                  <p className="text-[10px] font-bold text-slate-500">起始</p>
                  <p className="mt-1 text-sm font-black text-slate-800">{snapshot.firstWeightKg} kg</p>
                </div>
                <div className="rounded-xl bg-white p-3">
                  <p className="text-[10px] font-bold text-slate-500">目前</p>
                  <p className="mt-1 text-sm font-black text-sky-700">{snapshot.latestWeightKg} kg</p>
                </div>
                <div className="rounded-xl bg-white p-3">
                  <p className="text-[10px] font-bold text-slate-500">目標</p>
                  <p className="mt-1 text-sm font-black text-emerald-700">{savedTargetWeight} kg</p>
                </div>
              </div>
              <p className="mt-3 text-center text-sm font-bold text-slate-700">
                {goalReached
                  ? snapshot.latestWeightKg < savedTargetWeight
                    ? `目前已比目標少 ${Math.abs(snapshot.latestWeightKg - savedTargetWeight).toFixed(1)} kg`
                    : '目前已達目標體重'
                  : `距離目標還差 ${remainingToGoal.toFixed(1)} kg`}
              </p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

function LogView({ appUser, allLogs }) {
  const [recordType, setRecordType] = useState('injection');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [weight, setWeight] = useState('');
  const [dose, setDose] = useState('2.5');
  const [notes, setNotes] = useState('');
  const [symptoms, setSymptoms] = useState([]);
  const [mood, setMood] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingLogId, setEditingLogId] = useState(null);
  const [editRecordType, setEditRecordType] = useState('injection');
  const [editDate, setEditDate] = useState('');
  const [editWeight, setEditWeight] = useState('');
  const [editDose, setEditDose] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [editSymptoms, setEditSymptoms] = useState([]);
  const [editMood, setEditMood] = useState('');
  const [editError, setEditError] = useState('');
  const [duplicateLog, setDuplicateLog] = useState(null);
  const [historyLimit, setHistoryLimit] = useState(10);
  const [collapsedHistoryMonths, setCollapsedHistoryMonths] = useState([]);

  const myLogs = allLogs.filter(log => log.username === appUser.username);

  const toggleSymptom = (symptom) => {
    setSymptoms(current => current.includes(symptom) ? current.filter(item => item !== symptom) : [...current, symptom]);
  };

  const toggleEditSymptom = (symptom) => {
    setEditSymptoms(current => current.includes(symptom) ? current.filter(item => item !== symptom) : [...current, symptom]);
  };

  const saveNewLog = async (replaceLogId = null) => {
    if (!date || !weight || (recordType === 'injection' && !dose) || !db || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const logRef = replaceLogId ? doc(db, 'mounjaroLogs', replaceLogId) : doc(collection(db, 'mounjaroLogs'));
      const logData = {
        username: appUser.username,
        recordType,
        date,
        weight: parseFloat(weight),
        dose: recordType === 'injection' ? parseFloat(dose) : null,
        symptoms,
        mood,
        notes,
        ...(replaceLogId ? { updatedAt: new Date().toISOString() } : { createdAt: new Date().toISOString() })
      };
      if (replaceLogId) await setDoc(logRef, logData, { merge: true });
      else await setDoc(logRef, logData);
      setWeight('');
      setNotes('');
      setSymptoms([]);
      setMood('');
      setDuplicateLog(null);
    } catch (error) {
      console.error("寫入紀錄失敗:", error);
    }
    setIsSubmitting(false);
  };

  const handleAddLog = async (e) => {
    e.preventDefault();
    const sameDateLog = myLogs.find(log => log.date === date);
    if (sameDateLog) {
      setDuplicateLog(sameDateLog);
      return;
    }
    await saveNewLog();
  };

  const handleDelete = async (id) => {
    if (!db) return;
    if (!window.confirm('確定要刪除這筆紀錄嗎？')) return;
    try {
      await deleteDoc(doc(db, 'mounjaroLogs', id));
    } catch (error) {
      console.error("刪除紀錄失敗:", error);
    }
  };

  const startEditLog = (log) => {
    setEditingLogId(log.id);
    setEditRecordType(isInjectionLog(log) ? 'injection' : 'weight');
    setEditDate(log.date || '');
    setEditWeight(String(log.weight ?? ''));
    setEditDose(String(log.dose ?? ''));
    setEditNotes(log.notes || '');
    setEditSymptoms(normalizeSymptoms(log.symptoms));
    setEditMood(log.mood || '');
    setEditError('');
  };

  const cancelEditLog = () => {
    setEditingLogId(null);
    setEditRecordType('injection');
    setEditDate('');
    setEditWeight('');
    setEditDose('');
    setEditNotes('');
    setEditSymptoms([]);
    setEditMood('');
    setEditError('');
  };

  const handleUpdateLog = async (e) => {
    e.preventDefault();
    if (!editingLogId || !editDate || !editWeight || (editRecordType === 'injection' && !editDose) || !db || isSubmitting) return;

    setIsSubmitting(true);
    setEditError('');
    try {
      await setDoc(doc(db, 'mounjaroLogs', editingLogId), {
        recordType: editRecordType,
        date: editDate,
        weight: parseFloat(editWeight),
        dose: editRecordType === 'injection' ? parseFloat(editDose) : null,
        symptoms: editSymptoms,
        mood: editMood,
        notes: editNotes,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      cancelEditLog();
    } catch (error) {
      console.error("更新紀錄失敗:", error);
      setEditError('更新失敗，請稍後再試。');
    }
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-6 animation-fade-in">
      <HealthInsightPanel appUser={appUser} logs={myLogs} />

      {/* 📊 顯示個人趨勢圖表 */}
      <TrendChart logs={myLogs} />

      <div className="bg-gradient-to-br from-emerald-50 via-white to-teal-50 rounded-2xl shadow-sm border border-emerald-100 p-5 sm:p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
          <span className="rounded-xl bg-emerald-100 p-2 text-emerald-700"><BookIcon /></span><span className="ml-2">新增健康紀錄 <small className="font-medium text-emerald-600">雲端同步</small></span>
        </h2>
        <form onSubmit={handleAddLog} className="space-y-4">
          <fieldset>
            <legend className="block text-sm font-medium text-slate-600 mb-2">今天要記錄什麼？</legend>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRecordType('weight')}
                aria-pressed={recordType === 'weight'}
                className={`rounded-xl border px-3 py-3 text-left transition-all ${recordType === 'weight' ? 'border-blue-500 bg-blue-50 text-blue-800 ring-1 ring-blue-500' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`}
              >
                <span className="block text-sm font-bold">⚖️ 只記錄體重</span>
                <span className="mt-1 block text-xs opacity-75">今天沒有施打</span>
              </button>
              <button
                type="button"
                onClick={() => setRecordType('injection')}
                aria-pressed={recordType === 'injection'}
                className={`rounded-xl border px-3 py-3 text-left transition-all ${recordType === 'injection' ? 'border-emerald-500 bg-emerald-50 text-emerald-800 ring-1 ring-emerald-500' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`}
              >
                <span className="block text-sm font-bold">💉 施打＋體重</span>
                <span className="mt-1 block text-xs opacity-75">記錄本次施打劑量</span>
              </button>
            </div>
          </fieldset>
          <div className={`grid grid-cols-2 gap-4 ${recordType === 'injection' ? 'md:grid-cols-3' : ''}`}>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">日期</label>
              <input type="date" required value={date} onChange={e => setDate(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">體重 (kg)</label>
              <input type="number" step="0.1" required value={weight} onChange={e => setWeight(e.target.value)} placeholder="例如 75.5"
                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500" />
            </div>
            {recordType === 'injection' && (
              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-medium text-slate-600 mb-1">施打劑量 (mg)</label>
                <input type="number" min="0.1" step="0.1" required value={dose} onChange={e => setDose(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500" />
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">常見不舒服症狀 (可複選)</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {COMMON_SYMPTOMS.map(symptom => (
                <label key={symptom} className={`flex min-h-[44px] items-center gap-2 px-3 py-2 rounded-lg border text-sm cursor-pointer transition-colors ${symptoms.includes(symptom) ? 'bg-amber-50 border-amber-300 text-amber-800' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                  <input
                    type="checkbox"
                    checked={symptoms.includes(symptom)}
                    onChange={() => toggleSymptom(symptom)}
                    className="rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                  />
                  <span>{symptom}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">心情 (選填)</label>
            <select value={mood} onChange={e => setMood(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 bg-white">
              <option value="">請選擇今天心情</option>
              {MOOD_OPTIONS.map(option => <option key={option} value={option}>{option}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">身體狀況或感受筆記 (選填)</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder={recordType === 'injection' ? '例如：打完第二天有點微噁心、食慾明顯下降...' : '例如：今天精神不錯、食慾正常...'} rows="2"
              className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 resize-none"></textarea>
          </div>
          {duplicateLog && (
            <div role="alert" className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
              <p className="font-black">{formatLogDate(date)} 已有一筆紀錄</p>
              <p className="mt-1 text-xs leading-relaxed">請選擇更新原紀錄，或保留原資料並新增另一筆。</p>
              <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
                <button type="button" disabled={isSubmitting} onClick={() => saveNewLog(duplicateLog.id)} className="min-h-[44px] rounded-lg bg-amber-600 px-3 py-2 text-xs font-bold text-white disabled:bg-slate-300">更新原紀錄</button>
                <button type="button" disabled={isSubmitting} onClick={() => saveNewLog()} className="min-h-[44px] rounded-lg border border-amber-400 bg-white px-3 py-2 text-xs font-bold text-amber-800 disabled:text-slate-400">仍新增一筆</button>
                <button type="button" onClick={() => setDuplicateLog(null)} className="min-h-[44px] rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-600">返回修改</button>
              </div>
            </div>
          )}
          <button type="submit" disabled={isSubmitting} className={`w-full font-medium py-3 rounded-xl transition-colors shadow-sm ${isSubmitting ? 'bg-slate-400 text-white cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}>
            {isSubmitting ? '儲存中...' : recordType === 'injection' ? '儲存施打與體重' : '儲存體重紀錄'}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sm:p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">歷史紀錄</h2>
        {myLogs.length === 0 ? (
          <div className="text-center py-8 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            尚無紀錄，請在上方新增您的第一筆資料。
          </div>
        ) : (
          <div className="space-y-3">
            {myLogs.slice(0, historyLimit).map((log, index, visibleLogs) => {
              let weightDiff = null;
              if (index < myLogs.length - 1) {
                const prevWeight = myLogs[index + 1].weight;
                weightDiff = (log.weight - prevWeight).toFixed(1);
              }
              const monthKey = log.date?.slice(0, 7) || 'unknown';
              const showMonthHeader = index === 0 || visibleLogs[index - 1]?.date?.slice(0, 7) !== monthKey;
              const isMonthCollapsed = collapsedHistoryMonths.includes(monthKey);
              const monthLabel = monthKey === 'unknown' ? '日期未設定' : new Date(`${monthKey}-01T12:00:00`).toLocaleDateString('zh-TW', { year: 'numeric', month: 'long' });
              return (
                <React.Fragment key={log.id}>
                {showMonthHeader && (
                  <button type="button" aria-expanded={!isMonthCollapsed} onClick={() => setCollapsedHistoryMonths(months => months.includes(monthKey) ? months.filter(item => item !== monthKey) : [...months, monthKey])} className="flex min-h-[44px] w-full items-center justify-between rounded-xl bg-slate-100 px-4 py-2 text-left text-sm font-black text-slate-700">
                    <span>{monthLabel}</span><span aria-hidden="true">{isMonthCollapsed ? '＋' : '－'}</span>
                  </button>
                )}
                {!isMonthCollapsed && (
                <div key={log.id} className="relative group bg-white border border-slate-200 p-4 rounded-xl hover:border-indigo-300 transition-colors">
                  {editingLogId === log.id ? (
                    <form onSubmit={handleUpdateLog} className="space-y-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-500 mb-2">紀錄類型</label>
                        <div className="grid grid-cols-2 gap-2">
                          <button type="button" onClick={() => setEditRecordType('weight')} className={`min-h-[44px] rounded-lg border px-3 py-2 text-xs font-bold ${editRecordType === 'weight' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-500'}`}>⚖️ 只記錄體重</button>
                          <button type="button" onClick={() => setEditRecordType('injection')} className={`min-h-[44px] rounded-lg border px-3 py-2 text-xs font-bold ${editRecordType === 'injection' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-200 text-slate-500'}`}>💉 施打＋體重</button>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-slate-500 mb-1">日期</label>
                          <input type="date" required value={editDate} onChange={e => setEditDate(e.target.value)}
                            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-500 mb-1">體重 (kg)</label>
                          <input type="number" step="0.1" required value={editWeight} onChange={e => setEditWeight(e.target.value)}
                            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500" />
                        </div>
                        {editRecordType === 'injection' && (
                          <div className="col-span-2 md:col-span-1">
                            <label className="block text-xs font-medium text-slate-500 mb-1">施打劑量 (mg)</label>
                            <input type="number" min="0.1" step="0.1" required value={editDose} onChange={e => setEditDose(e.target.value)}
                              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500" />
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-500 mb-2">常見不舒服症狀</label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {COMMON_SYMPTOMS.map(symptom => (
                            <label key={symptom} className={`flex min-h-[44px] items-center gap-2 px-3 py-2 rounded-lg border text-xs cursor-pointer transition-colors ${editSymptoms.includes(symptom) ? 'bg-amber-50 border-amber-300 text-amber-800' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                              <input
                                type="checkbox"
                                checked={editSymptoms.includes(symptom)}
                                onChange={() => toggleEditSymptom(symptom)}
                                className="rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                              />
                              <span>{symptom}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">心情</label>
                        <select value={editMood} onChange={e => setEditMood(e.target.value)}
                          className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 bg-white">
                          <option value="">未記錄</option>
                          {MOOD_OPTIONS.map(option => <option key={option} value={option}>{option}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">身體狀況或感受筆記</label>
                        <textarea value={editNotes} onChange={e => setEditNotes(e.target.value)} rows="2"
                          className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 resize-none"></textarea>
                      </div>
                      {editError && <p className="text-sm text-red-500">{editError}</p>}
                      <div className="flex justify-end gap-2">
                        <button type="button" onClick={cancelEditLog} className="px-4 py-2 text-sm rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200">取消</button>
                        <button type="submit" disabled={isSubmitting} className="px-4 py-2 text-sm rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-slate-400">
                          {isSubmitting ? '儲存中...' : '儲存修改'}
                        </button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <div className="flex flex-wrap justify-between items-start gap-2">
                        <div>
                          <div className="text-sm font-semibold text-slate-700 mb-1">{formatLogDate(log.date)}</div>
                          <div className="flex flex-wrap gap-2">
                            {isInjectionLog(log) ? (
                              <>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">施打紀錄</span>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">💉 {log.dose} mg</span>
                              </>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">僅體重紀錄</span>
                            )}
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">⚖️ {log.weight} kg</span>
                            {weightDiff !== null && (
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${weightDiff > 0 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                                {weightDiff > 0 ? '↑' : '↓'} {Math.abs(weightDiff)} kg
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <button onClick={() => startEditLog(log)} className="min-h-[44px] px-3 py-2 text-xs font-medium text-indigo-600 hover:text-indigo-700 transition-colors rounded-lg hover:bg-indigo-50">
                            修改
                          </button>
                          <button onClick={() => handleDelete(log.id)} className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-red-50 hover:text-red-500" aria-label={`刪除 ${formatLogDate(log.date)} 的紀錄`}>
                            <TrashIcon />
                          </button>
                        </div>
                      </div>
                      <LogExtraDetails log={log} />
                    </>
                  )}
                </div>
                )}
                </React.Fragment>
              );
            })}
            {historyLimit < myLogs.length && (
              <button type="button" onClick={() => setHistoryLimit(limit => limit + 10)} className="min-h-[44px] w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-100">
                顯示更多（尚有 {myLogs.length - historyLimit} 筆）
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function AdminView({ appUser, usersList, allLogs, allSchedules, allProfiles, sharingPlans }) {
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isDeletingUser, setIsDeletingUser] = useState(false);
  
  // 🕵️ 紀錄管理員目前選中了哪一個使用者來查看詳細資料
  const [selectedUser, setSelectedUser] = useState(null);
  const [adminDetailTab, setAdminDetailTab] = useState('logs');
  const [logUserFilter, setLogUserFilter] = useState('all');
  const [logTypeFilter, setLogTypeFilter] = useState('all');
  const [logDateRange, setLogDateRange] = useState('30');
  const [visibleAdminLogs, setVisibleAdminLogs] = useState(10);
  const [adminDetailLimit, setAdminDetailLimit] = useState(10);
  const [collapsedAdminMonths, setCollapsedAdminMonths] = useState([]);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setErrorMsg(''); setSuccessMsg('');
    if (!newUsername || !newPassword) return;

    if (usersList.some(u => u.username === newUsername)) {
      setErrorMsg('此帳號已存在！');
      return;
    }

    try {
      const userRef = doc(collection(db, 'mounjaroUsers'));
      await setDoc(userRef, {
        username: newUsername,
        password: newPassword, 
        role: 'user',
        createdAt: new Date().toISOString()
      });
      setSuccessMsg(`成功建立帳號：${newUsername}`);
      setNewUsername('');
      setNewPassword('');
    } catch (err) {
      setErrorMsg('建立失敗，請稍後再試。');
    }
  };

  const handleDeleteUser = async (targetUser, event) => {
    event.stopPropagation();
    setErrorMsg('');
    setSuccessMsg('');

    if (!db || isDeletingUser) return;
    if (targetUser.username === appUser.username) {
      setErrorMsg('不能刪除目前登入中的管理者帳號。');
      return;
    }
    if (targetUser.role === 'admin') {
      setErrorMsg('為了安全，管理者帳號不開放在此刪除。');
      return;
    }
    if (!window.confirm(`確定要刪除帳號「${targetUser.username}」嗎？該帳號的健康紀錄、雲端計畫與兩人綁定資料也會一起刪除。`)) return;

    setIsDeletingUser(true);
    try {
      const logsToDelete = allLogs.filter(log => log.username === targetUser.username);
      const sharingPlansToDelete = sharingPlans.filter(plan => plan?.participants?.includes(targetUser.username) || plan.requester === targetUser.username || plan.partner === targetUser.username);
      await Promise.all([
        deleteDoc(doc(db, 'mounjaroUsers', targetUser.id)),
        deleteDoc(doc(db, 'mounjaroSchedules', targetUser.username)),
        deleteDoc(doc(db, 'mounjaroDoseInventories', targetUser.username)),
        deleteDoc(doc(db, 'mounjaroProfiles', targetUser.username)),
        ...logsToDelete.map(log => deleteDoc(doc(db, 'mounjaroLogs', log.id))),
        ...sharingPlansToDelete.map(plan => deleteDoc(doc(db, 'mounjaroSharingPlans', plan.id)))
      ]);
      if (selectedUser?.username === targetUser.username) {
        setSelectedUser(null);
        setAdminDetailTab('logs');
      }
      setSuccessMsg(`已刪除帳號：${targetUser.username}`);
    } catch (err) {
      console.error('刪除使用者失敗:', err);
      setErrorMsg('刪除失敗，請稍後再試。');
    }
    setIsDeletingUser(false);
  };

  const managedUsers = usersList.filter(user => user.role !== 'admin');
  const managedUsernames = new Set(managedUsers.map(user => user.username));
  const managedLogs = allLogs.filter(log => managedUsernames.has(log.username));
  const filteredManagedLogs = managedLogs.filter(log => {
    if (logUserFilter !== 'all' && log.username !== logUserFilter) return false;
    if (logTypeFilter === 'injection' && !isInjectionLog(log)) return false;
    if (logTypeFilter === 'weight' && isInjectionLog(log)) return false;
    if (logDateRange !== 'all') {
      const cutoff = new Date();
      cutoff.setHours(0, 0, 0, 0);
      cutoff.setDate(cutoff.getDate() - (Number(logDateRange) - 1));
      if (new Date(`${log.date}T12:00:00`) < cutoff) return false;
    }
    return true;
  });

  // 如果點擊了某個使用者，顯示專屬詳細檔案與圖表
  if (selectedUser) {
    const targetUserLogs = allLogs.filter(log => log.username === selectedUser.username);
    const targetUserSchedule = allSchedules.find(item => item.id === selectedUser.username || item.username === selectedUser.username);
    const targetUserProfile = allProfiles.find(item => item.id === selectedUser.username || item.username === selectedUser.username);
    const targetHealthSnapshot = buildHealthSnapshot(targetUserLogs, targetUserProfile);
    const targetGoalWeight = Number(targetUserProfile?.targetWeightKg);
    const targetHasGoal = Number.isFinite(targetGoalWeight)
      && targetGoalWeight >= 20
      && targetGoalWeight <= 300
      && targetHealthSnapshot.firstWeightKg !== null
      && targetGoalWeight < targetHealthSnapshot.firstWeightKg;
    const targetGoalProgress = targetHasGoal
      ? Math.min(100, Math.max(0, ((targetHealthSnapshot.firstWeightKg - targetHealthSnapshot.latestWeightKg) / (targetHealthSnapshot.firstWeightKg - targetGoalWeight)) * 100))
      : null;
    return (
      <div className="space-y-6 animation-fade-in">
        <div className="flex items-center gap-3 mb-2">
          <button onClick={() => { setSelectedUser(null); setAdminDetailTab('logs'); }} className="p-2 bg-white rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-indigo-600 shadow-sm transition-colors flex items-center">
            <ChevronLeftIcon /> 返回列表
          </button>
          <h2 className="text-xl font-bold text-slate-800">
            使用者 <span className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">{selectedUser.username}</span> 的詳細檔案
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
            <p className="text-xs text-slate-400 mb-1">健康紀錄總數</p>
            <p className="text-2xl font-bold text-slate-800">{targetUserLogs.length} <span className="text-xs font-normal text-slate-400">筆</span></p>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
            <p className="text-xs text-slate-400 mb-1">雲端計畫</p>
            <p className={`text-sm font-bold mt-2 ${targetUserSchedule ? 'text-emerald-600' : 'text-slate-400'}`}>{targetUserSchedule ? '已建立並同步' : '尚未建立'}</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
            <p className="text-xs text-slate-400 mb-1">身高／年齡</p>
            <p className="mt-2 text-sm font-bold text-slate-700">
              {targetUserProfile?.heightCm ? `${targetUserProfile.heightCm} cm` : '未設定'}
              <span className="mx-1 text-slate-300">・</span>
              {targetUserProfile?.age ? `${targetUserProfile.age} 歲` : '未設定'}
            </p>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
            <p className="text-xs text-slate-400 mb-1">目標體重進度</p>
            <p className={`mt-2 text-sm font-bold ${targetHasGoal ? 'text-sky-700' : 'text-slate-400'}`}>
              {targetHasGoal ? `${targetHealthSnapshot.latestWeightKg} → ${targetGoalWeight} kg（${Math.round(targetGoalProgress)}%）` : '尚未設定完整目標'}
            </p>
            {targetUserProfile?.targetDate && <p className="mt-1 text-[11px] text-slate-500">預計 {new Date(`${targetUserProfile.targetDate}T12:00:00`).toLocaleDateString('zh-TW', { year: 'numeric', month: 'numeric', day: 'numeric', weekday: 'short' })}</p>}
          </div>
        </div>

        <div className="flex bg-slate-200/70 rounded-xl p-1 gap-1">
          <button onClick={() => setAdminDetailTab('logs')} className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${adminDetailTab === 'logs' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
            施打紀錄與體重
          </button>
          <button onClick={() => setAdminDetailTab('schedule')} className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${adminDetailTab === 'schedule' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
            擬定計畫與進度
          </button>
        </div>

        {adminDetailTab === 'logs' && (
          <div className="space-y-6 animation-fade-in">
            <TrendChart logs={targetUserLogs} />

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sm:p-6">
          <h3 className="font-semibold text-slate-800 mb-4">歷史紀錄清單</h3>
          {targetUserLogs.length === 0 ? (
            <p className="text-sm text-slate-400">此使用者尚無任何紀錄。</p>
          ) : (
            <div className="space-y-3">
              {targetUserLogs.slice(0, adminDetailLimit).map((log, index, visibleLogs) => {
                let weightDiff = null;
                if (index < targetUserLogs.length - 1) {
                  const prevWeight = targetUserLogs[index + 1].weight;
                  weightDiff = (log.weight - prevWeight).toFixed(1);
                }
                const monthKey = log.date?.slice(0, 7) || 'unknown';
                const showMonthHeader = index === 0 || visibleLogs[index - 1]?.date?.slice(0, 7) !== monthKey;
                const isMonthCollapsed = collapsedAdminMonths.includes(monthKey);
                const monthLabel = monthKey === 'unknown' ? '日期未設定' : new Date(`${monthKey}-01T12:00:00`).toLocaleDateString('zh-TW', { year: 'numeric', month: 'long' });
                return (
                  <React.Fragment key={log.id}>
                  {showMonthHeader && (
                    <button type="button" aria-expanded={!isMonthCollapsed} onClick={() => setCollapsedAdminMonths(months => months.includes(monthKey) ? months.filter(item => item !== monthKey) : [...months, monthKey])} className="flex min-h-[44px] w-full items-center justify-between rounded-xl bg-slate-100 px-4 py-2 text-left text-sm font-black text-slate-700">
                      <span>{monthLabel}</span><span aria-hidden="true">{isMonthCollapsed ? '＋' : '－'}</span>
                    </button>
                  )}
                  {!isMonthCollapsed && (
                  <div key={log.id} className="bg-slate-50 border border-slate-100 p-4 rounded-xl">
                    <div className="flex flex-wrap justify-between items-start gap-2">
                      <div>
                        <div className="text-sm font-semibold text-slate-700 mb-1">{formatLogDate(log.date)}</div>
                        <div className="flex flex-wrap gap-2">
                          {isInjectionLog(log) ? (
                            <>
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">施打紀錄</span>
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">💉 {log.dose} mg</span>
                            </>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">僅體重紀錄</span>
                          )}
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">⚖️ {log.weight} kg</span>
                          {weightDiff !== null && (
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${weightDiff > 0 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                              {weightDiff > 0 ? '↑' : '↓'} {Math.abs(weightDiff)} kg
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <LogExtraDetails log={log} noteClassName="bg-white border border-slate-100" />
                  </div>
                  )}
                  </React.Fragment>
                );
              })}
              {adminDetailLimit < targetUserLogs.length && (
                <button type="button" onClick={() => setAdminDetailLimit(limit => limit + 10)} className="min-h-[44px] w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700">
                  顯示更多（尚有 {targetUserLogs.length - adminDetailLimit} 筆）
                </button>
              )}
            </div>
              )}
            </div>
          </div>
        )}

        {adminDetailTab === 'schedule' && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sm:p-6 animation-fade-in">
            <div className="flex flex-wrap justify-between items-start gap-3 mb-5">
              <div>
                <h3 className="font-semibold text-slate-800">雲端療程計畫</h3>
                <p className="text-xs text-slate-400 mt-1">對照預定日期與實際施打紀錄</p>
              </div>
              {targetUserSchedule?.updatedAt && (
                <span className="text-xs text-slate-400 bg-slate-50 px-3 py-1.5 rounded-full">更新於 {new Date(targetUserSchedule.updatedAt).toLocaleString('zh-TW')}</span>
              )}
            </div>

            {!targetUserSchedule?.schedule?.length ? (
              <div className="text-center py-12 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-sm text-slate-400">此使用者尚未將計畫同步到雲端。</div>
            ) : (
              <div className="space-y-2">
                {targetUserSchedule.schedule.map(item => {
                  const plannedDate = item.date?.toDate ? item.date.toDate() : new Date(item.date);
                  const nearbyLog = targetUserLogs.filter(isInjectionLog).find(log => {
                    const actualDate = new Date(`${log.date}T12:00:00`);
                    return Math.abs(actualDate.getTime() - plannedDate.getTime()) <= 3 * 24 * 60 * 60 * 1000;
                  });
                  const isPast = plannedDate.getTime() < Date.now();
                  return (
                    <div key={item.week} className="grid grid-cols-[54px_1fr_auto] sm:grid-cols-[70px_1fr_90px_130px] items-center gap-3 bg-slate-50 border border-slate-100 rounded-xl p-3">
                      <span className="text-xs font-bold text-slate-500">第 {item.week} 週</span>
                      <div>
                        <p className="text-sm font-semibold text-slate-700">{plannedDate.toLocaleDateString('zh-TW')}</p>
                        <p className="text-xs text-slate-400 sm:hidden">預計 {item.dose} mg</p>
                      </div>
                      <span className="hidden sm:block text-sm font-bold text-indigo-600">{item.dose} mg</span>
                      <span className={`col-span-3 sm:col-span-1 justify-self-start sm:justify-self-end text-xs font-bold px-2.5 py-1 rounded-full ${nearbyLog ? 'bg-emerald-100 text-emerald-700' : isPast ? 'bg-amber-100 text-amber-700' : 'bg-slate-200 text-slate-500'}`}>
                        {nearbyLog ? `已記錄 ${nearbyLog.dose} mg` : isPast ? '尚無施打紀錄' : '尚未到期'}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // 預設的管理員列表總覽
  return (
    <div className="space-y-6 animation-fade-in">
      <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-5 sm:p-6 shadow-sm">
        <h2 className="text-lg font-bold text-indigo-900 mb-4 flex items-center">
          <UsersIcon /> <span className="ml-2">管理員中心：建立新帳號</span>
        </h2>
        <form onSubmit={handleCreateUser} className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-end">
          <label className="flex-1 text-xs font-bold text-indigo-900">新帳號名稱
            <input type="text" placeholder="輸入新帳號名稱" value={newUsername} onChange={e => setNewUsername(e.target.value)} required className="mt-1 min-h-[44px] w-full border border-indigo-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500" />
          </label>
          <label className="flex-1 text-xs font-bold text-indigo-900">初始密碼
            <input type="text" placeholder="設定密碼" value={newPassword} onChange={e => setNewPassword(e.target.value)} required className="mt-1 min-h-[44px] w-full border border-indigo-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500" />
          </label>
          <button type="submit" className="min-h-[44px] bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-2 rounded-xl transition-colors shadow-sm">新增帳號</button>
        </form>
        {errorMsg && <p className="text-red-500 text-sm mt-3">{errorMsg}</p>}
        {successMsg && <p className="text-green-600 text-sm mt-3">{successMsg}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sm:p-6">
          <h3 className="font-semibold text-slate-800 mb-4">現有使用者列表 <span className="text-xs font-normal text-slate-400 ml-2">(點擊查看詳情)</span></h3>
          <ul className="space-y-2">
            {managedUsers.map(u => (
              <li key={u.id} className="group flex items-center gap-2 rounded-lg border border-slate-100 bg-slate-50 p-2 transition-all hover:border-indigo-200 hover:bg-indigo-50">
                <button type="button" onClick={() => { setSelectedUser(u); setAdminDetailLimit(10); }} className="min-h-[44px] min-w-0 flex-1 rounded-lg px-2 text-left" aria-label={`查看 ${u.username} 的詳細紀錄`}>
                  <span className="font-medium text-slate-700 group-hover:text-indigo-700">{u.username} <span className="text-xs text-slate-400 font-normal ml-1">({u.role})</span></span>
                </button>
                <div className="flex shrink-0 items-center gap-2">
                  <span className="text-xs text-slate-400">密碼: {u.password}</span>
                  {u.username !== appUser.username && u.role !== 'admin' && (
                    <button
                      type="button"
                      onClick={(event) => handleDeleteUser(u, event)}
                      disabled={isDeletingUser}
                      className="min-h-[44px] px-3 py-2 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50"
                      aria-label={`刪除帳號 ${u.username}`}
                    >
                      刪除帳號
                    </button>
                  )}
                </div>
              </li>
            ))}
            {managedUsers.length === 0 && <li className="rounded-lg border border-dashed border-slate-200 bg-slate-50 p-4 text-center text-sm text-slate-400">尚未建立一般使用者</li>}
          </ul>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sm:p-6">
          <h3 className="font-semibold text-slate-800 mb-4">全體數據總覽</h3>
          <div className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-3" aria-label="全體紀錄篩選">
            <label className="text-[11px] font-bold text-slate-500">使用者
              <select value={logUserFilter} onChange={event => { setLogUserFilter(event.target.value); setVisibleAdminLogs(10); }} className="mt-1 min-h-[44px] w-full rounded-lg border px-2 py-2 text-sm">
                <option value="all">全部使用者</option>
                {managedUsers.map(user => <option key={user.username} value={user.username}>{user.username}</option>)}
              </select>
            </label>
            <label className="text-[11px] font-bold text-slate-500">紀錄類型
              <select value={logTypeFilter} onChange={event => { setLogTypeFilter(event.target.value); setVisibleAdminLogs(10); }} className="mt-1 min-h-[44px] w-full rounded-lg border px-2 py-2 text-sm">
                <option value="all">全部類型</option><option value="injection">施打紀錄</option><option value="weight">僅體重</option>
              </select>
            </label>
            <label className="text-[11px] font-bold text-slate-500">日期範圍
              <select value={logDateRange} onChange={event => { setLogDateRange(event.target.value); setVisibleAdminLogs(10); }} className="mt-1 min-h-[44px] w-full rounded-lg border px-2 py-2 text-sm">
                <option value="7">最近 7 天</option><option value="30">最近 30 天</option><option value="all">全部日期</option>
              </select>
            </label>
          </div>
          <div className="space-y-3 max-h-96 overflow-y-auto pr-2 hide-scrollbar">
            {filteredManagedLogs.slice(0, visibleAdminLogs).map(log => (
              <div key={log.id} className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-sm flex justify-between items-center">
                <div>
                  <div className="font-bold text-indigo-600 mb-1">{log.username}</div>
                  <div className="flex gap-2 text-xs font-medium">
                    {isInjectionLog(log) ? (
                      <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">💉 {log.dose} mg</span>
                    ) : (
                      <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded">僅體重</span>
                    )}
                    <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded">⚖️ {log.weight}</span>
                  </div>
                </div>
                <span className="text-slate-400 text-xs">{formatLogDate(log.date)}</span>
              </div>
            ))}
            {filteredManagedLogs.length === 0 && <p className="rounded-lg border border-dashed border-slate-200 bg-slate-50 p-4 text-center text-sm text-slate-400">目前篩選條件沒有紀錄</p>}
            {visibleAdminLogs < filteredManagedLogs.length && (
              <button type="button" onClick={() => setVisibleAdminLogs(count => count + 10)} className="min-h-[44px] w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-bold text-slate-700">載入更多（尚有 {filteredManagedLogs.length - visibleAdminLogs} 筆）</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MounjaroApp() {
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [appUser, setAppUser] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [allLogs, setAllLogs] = useState([]);
  const [allSchedules, setAllSchedules] = useState([]);
  const [allProfiles, setAllProfiles] = useState([]);
  const [sharingPlans, setSharingPlans] = useState([]);
  const [doseInventories, setDoseInventories] = useState([]);
  const [usersLoaded, setUsersLoaded] = useState(false);
  const [sessionChecked, setSessionChecked] = useState(false);
  
  const [activeTab, setActiveTab] = useState('calculator');
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    if (!auth) return;
    const initAuth = async () => {
      try {
        await signInAnonymously(auth);
      } catch (error) {
        console.error("Auth error:", error);
      }
    };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, setFirebaseUser);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!firebaseUser || !db) return;

    const usersRef = collection(db, 'mounjaroUsers');
    const unsubUsers = onSnapshot(usersRef, (snapshot) => {
      const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsersList(users);
      setUsersLoaded(true);
    }, err => {
      console.error("Fetch users error:", err);
      setUsersLoaded(true);
    });

    const logsRef = collection(db, 'mounjaroLogs');
    const unsubLogs = onSnapshot(logsRef, (snapshot) => {
      const logs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      logs.sort((a, b) => new Date(b.date) - new Date(a.date));
      setAllLogs(logs);
    }, err => console.error("Fetch logs error:", err));

    const schedulesRef = collection(db, 'mounjaroSchedules');
    const unsubSchedules = onSnapshot(schedulesRef, (snapshot) => {
      const schedules = snapshot.docs.map(scheduleDoc => ({ id: scheduleDoc.id, ...scheduleDoc.data() }));
      setAllSchedules(schedules);
    }, err => console.error("Fetch schedules error:", err));

    const sharingPlansRef = collection(db, 'mounjaroSharingPlans');
    const unsubSharingPlans = onSnapshot(sharingPlansRef, (snapshot) => {
      const plans = snapshot.docs.map(planDoc => ({ id: planDoc.id, ...planDoc.data() }));
      setSharingPlans(plans);
    }, err => console.error('Fetch sharing plans error:', err));

    const doseInventoriesRef = collection(db, 'mounjaroDoseInventories');
    const unsubDoseInventories = onSnapshot(doseInventoriesRef, (snapshot) => {
      const inventories = snapshot.docs.map(inventoryDoc => ({ id: inventoryDoc.id, ...inventoryDoc.data() }));
      setDoseInventories(inventories);
    }, err => console.error('Fetch dose inventories error:', err));

    return () => {
      unsubUsers();
      unsubLogs();
      unsubSchedules();
      unsubSharingPlans();
      unsubDoseInventories();
    };
  }, [firebaseUser]);

  useEffect(() => {
    if (!firebaseUser || appUser?.role !== 'admin') {
      setAllProfiles([]);
      return undefined;
    }
    const profilesRef = collection(db, 'mounjaroProfiles');
    return onSnapshot(profilesRef, (snapshot) => {
      const profiles = snapshot.docs.map(profileDoc => ({ id: profileDoc.id, ...profileDoc.data() }));
      setAllProfiles(profiles);
    }, err => console.error('Fetch profiles error:', err));
  }, [firebaseUser, appUser?.role]);

  useEffect(() => {
    if (!firebaseUser || !usersLoaded || sessionChecked) return;

    const rememberedUsername = localStorage.getItem(SESSION_KEY);
    if (rememberedUsername) {
      const rememberedUser = usersList.find(user => user.username === rememberedUsername);
      if (rememberedUser) {
        setAppUser({ username: rememberedUser.username, role: rememberedUser.role });
        setActiveTab(rememberedUser.role === 'admin' ? 'admin' : 'calculator');
      } else {
        localStorage.removeItem(SESSION_KEY);
      }
    }
    setSessionChecked(true);
  }, [firebaseUser, usersLoaded, usersList, sessionChecked]);

  const rememberUser = (user) => {
    localStorage.setItem(SESSION_KEY, user.username);
    setAppUser({ username: user.username, role: user.role });
    setActiveTab(user.role === 'admin' ? 'admin' : 'calculator');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');

    if (usersList.length === 0 && loginUser === 'admin' && loginPass === 'admin123') {
      try {
        const adminRef = doc(collection(db, 'mounjaroUsers'));
        await setDoc(adminRef, { username: 'admin', password: 'admin123', role: 'admin' });
        rememberUser({ username: 'admin', role: 'admin' });
      } catch (err) {
        setLoginError('無法初始化管理員帳號，請確認連線。');
      }
      return;
    }

    const foundUser = usersList.find(u => u.username === loginUser && u.password === loginPass);
    if (foundUser) {
      rememberUser(foundUser);
    } else {
      setLoginError('帳號或密碼錯誤！');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(SESSION_KEY);
    setAppUser(null);
    setLoginUser('');
    setLoginPass('');
    setActiveTab('calculator');
    setSessionChecked(true);
  };

  if (!firebaseUser || !usersLoaded || !sessionChecked) {
    return (
      <div className="comic-shell relative min-h-screen overflow-hidden flex items-center justify-center p-4 font-sans">
        <style>{COMIC_THEME_STYLES}</style>
        <div className="relative comic-card bg-[#fffdf7] rounded-[2rem] px-10 py-9 text-center">
          <SnoopyImage className="comic-live mx-auto mb-4 h-24 w-24" />
          <p className="font-black text-slate-900">正在整理今天的健康日誌</p>
          <p className="mt-2 text-xs font-bold tracking-[0.12em] text-sky-700">資料同步中，馬上就好…</p>
        </div>
      </div>
    );
  }

  if (!appUser) {
    return (
      <div className="comic-shell relative min-h-screen overflow-hidden flex items-center justify-center p-4 font-sans">
        <style>{COMIC_THEME_STYLES}</style>
        <div className="decorative-blob pointer-events-none absolute -left-20 top-16 h-56 w-56 rounded-full bg-[#f6d15f]/35 blur-2xl"></div>
        <div className="decorative-blob pointer-events-none absolute -right-20 bottom-12 h-64 w-64 rounded-full bg-[#7db9e8]/25 blur-2xl"></div>
        <div className="comic-card relative max-w-md w-full bg-[#fffdf7] rounded-[2rem] p-7 sm:p-9 animation-fade-in">
          <div className="text-center mb-8">
            <div className="comic-live relative mx-auto mb-5 flex h-24 w-24 items-center justify-center rounded-full border-2 border-[#343434] bg-[#fff4bd]">
              <SnoopyImage className="h-20 w-20" />
            </div>
            <span className="comic-sticker mb-3 inline-flex -rotate-2 rounded-full bg-[#7db9e8] px-3 py-1 text-xs font-black tracking-[0.12em] text-[#252525]">MY WELLNESS DIARY</span>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">猛健樂健康日誌</h1>
            <p className="mt-2 text-sm text-slate-600">每天記一點，慢慢看見自己的進步</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-black text-slate-700">帳號</label>
              <input type="text" required value={loginUser} onChange={e => setLoginUser(e.target.value)}
                className="w-full border border-slate-200 bg-slate-50/80 rounded-2xl px-4 py-3.5 focus:bg-white focus:ring-2 focus:ring-indigo-400" placeholder="輸入您的帳號" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-black text-slate-700">密碼</label>
              <input type="password" required value={loginPass} onChange={e => setLoginPass(e.target.value)}
                className="w-full border border-slate-200 bg-slate-50/80 rounded-2xl px-4 py-3.5 focus:bg-white focus:ring-2 focus:ring-indigo-400" placeholder="輸入密碼" />
            </div>
            {loginError && <div className="text-red-500 text-sm text-center font-medium bg-red-50 py-2 rounded-lg">{loginError}</div>}
            
            <button type="submit" disabled={!firebaseUser} className="w-full rounded-2xl border-2 border-[#343434] bg-[#d94a43] py-3.5 font-black tracking-wide text-white shadow-[4px_5px_0_rgba(52,52,52,.16)] transition-all hover:bg-[#c83f39] disabled:bg-slate-200 disabled:text-slate-500 disabled:shadow-none">
              {firebaseUser ? '開始記錄' : '連線中…'}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-500">
            {usersList.length === 0 && <p>💡 系統初次啟動，請使用預設管理員登入：<br/>帳號 <strong>admin</strong> / 密碼 <strong>admin123</strong></p>}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="comic-shell wellness-shell relative min-h-screen overflow-hidden py-4 px-3 sm:py-7 sm:px-5 font-sans">
      <style>{COMIC_THEME_STYLES}</style>
      <div className="decorative-blob pointer-events-none fixed -left-24 top-20 h-80 w-80 rounded-full bg-[#f6d15f]/25 blur-3xl" style={{ animation: 'floatSoft 8s ease-in-out infinite' }}></div>
      <div className="decorative-blob pointer-events-none fixed -right-28 top-1/3 h-96 w-96 rounded-full bg-[#7db9e8]/20 blur-3xl" style={{ animation: 'floatSoft 10s ease-in-out infinite reverse' }}></div>

      <div className="relative z-10 max-w-5xl mx-auto space-y-5 sm:space-y-6">
        <header className="comic-card relative overflow-hidden rounded-[1.5rem] bg-[#fffdf7] p-4 sm:rounded-[2rem] sm:p-7">
          <div className="absolute -right-10 -top-16 h-44 w-44 rounded-full border-[28px] border-[#7db9e8]/30"></div>
          <div className="absolute bottom-0 right-1/4 h-24 w-24 translate-y-1/2 rounded-full bg-[#f6d15f]/35 blur-xl"></div>
          <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-5">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="comic-live inline-flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-[#343434] bg-white sm:h-16 sm:w-16"><SnoopyImage className="h-10 w-10 sm:h-14 sm:w-14" /></div>
              <div>
                <p className="hidden text-xs font-black tracking-[0.12em] text-sky-700 sm:block">MY WELLNESS DIARY</p>
                <h1 className="text-xl font-black tracking-tight text-slate-900 sm:mt-1 sm:text-3xl">猛健樂健康日誌</h1>
                <p className="mt-0.5 text-xs text-slate-600 sm:mt-1 sm:text-sm">嗨，<strong className="text-[#c83f39]">{appUser.username}</strong>・{new Date().toLocaleDateString('zh-TW', { month: 'long', day: 'numeric', weekday: 'long' })}</p>
              </div>
            </div>
            <div className="flex w-full sm:w-auto items-center gap-2">
              <span className="flex-1 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-center text-xs font-bold text-emerald-700 sm:flex-none"><span className="mr-1 text-emerald-500">●</span> 已同步雲端</span>
              <button onClick={handleLogout} className="min-h-[44px] rounded-full border-2 border-[#343434] bg-white px-4 py-2 text-sm font-black text-slate-700 shadow-[2px_2px_0_rgba(52,52,52,.1)] transition-colors hover:bg-[#fff4bd]">登出</button>
            </div>
          </div>
        </header>

        <nav aria-label="主要功能" className={`sticky top-3 z-30 grid ${appUser.role === 'admin' ? 'grid-cols-1' : 'grid-cols-3'} gap-1 rounded-2xl border-2 border-[#343434] bg-[#fffdf7]/95 p-1.5 shadow-[4px_5px_0_rgba(52,52,52,.12)] backdrop-blur-xl sm:gap-1.5`}>
          {appUser.role !== 'admin' && <button onClick={() => setActiveTab('calculator')} aria-current={activeTab === 'calculator' ? 'page' : undefined} className={`min-h-[58px] min-w-0 whitespace-nowrap rounded-xl px-1 py-2 text-[11px] font-black leading-tight transition-all sm:min-h-[48px] sm:px-3 sm:py-3 sm:text-sm ${activeTab === 'calculator' ? 'bg-[#7db9e8] text-[#252525] shadow-[2px_2px_0_rgba(52,52,52,.13)]' : 'text-slate-600 hover:bg-sky-50 hover:text-sky-800'}`}>
            <span aria-hidden="true" className="mb-1 block text-sm sm:mb-0 sm:mr-1.5 sm:inline">✦</span>劑量計算
          </button>}
          {appUser.role !== 'admin' && <button onClick={() => setActiveTab('schedule')} aria-current={activeTab === 'schedule' ? 'page' : undefined} className={`min-h-[58px] min-w-0 whitespace-nowrap rounded-xl px-1 py-2 text-[11px] font-black leading-tight transition-all sm:min-h-[48px] sm:px-3 sm:py-3 sm:text-sm ${activeTab === 'schedule' ? 'bg-[#f6d15f] text-[#252525] shadow-[2px_2px_0_rgba(52,52,52,.13)]' : 'text-slate-600 hover:bg-amber-50 hover:text-amber-800'}`}>
            <span aria-hidden="true" className="mb-1 block text-sm sm:mb-0 sm:mr-1.5 sm:inline">▦</span>計畫表
          </button>}
          {appUser.role !== 'admin' && (
            <button onClick={() => setActiveTab('log')} aria-current={activeTab === 'log' ? 'page' : undefined} className={`min-h-[58px] min-w-0 whitespace-nowrap rounded-xl px-1 py-2 text-[11px] font-black leading-tight transition-all sm:min-h-[48px] sm:px-3 sm:py-3 sm:text-sm ${activeTab === 'log' ? 'bg-[#86bf8c] text-[#252525] shadow-[2px_2px_0_rgba(52,52,52,.13)]' : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-800'}`}>
              <span aria-hidden="true" className="mb-1 block text-sm sm:mb-0 sm:mr-1.5 sm:inline">♡</span>健康紀錄
            </button>
          )}
          {appUser.role === 'admin' && (
            <button onClick={() => setActiveTab('admin')} aria-current={activeTab === 'admin' ? 'page' : undefined} className={`min-h-[58px] min-w-0 whitespace-nowrap rounded-xl px-1 py-2 text-[11px] font-black leading-tight transition-all sm:min-h-[48px] sm:px-3 sm:py-3 sm:text-sm ${activeTab === 'admin' ? 'bg-[#e98f88] text-[#252525] shadow-[2px_2px_0_rgba(52,52,52,.13)]' : 'text-slate-600 hover:bg-red-50 hover:text-red-700'}`}>
              <span aria-hidden="true" className="mb-1 block text-sm sm:mb-0 sm:mr-1.5 sm:inline">⚙</span>系統管理
            </button>
          )}
        </nav>

        <main className="pb-8">
          {activeTab === 'calculator' && appUser.role !== 'admin' && <CalculatorView appUser={appUser} usersList={usersList} allLogs={allLogs} allSchedules={allSchedules} sharingPlans={sharingPlans} inventory={doseInventories.find(item => item.id === appUser.username || item.username === appUser.username)} />}
          {activeTab === 'schedule' && appUser.role !== 'admin' && (
            <ScheduleView
              appUser={appUser}
              userSchedule={allSchedules.find(item => item.id === appUser.username || item.username === appUser.username)}
              allLogs={allLogs}
              inventory={doseInventories.find(item => item.id === appUser.username || item.username === appUser.username)}
              sharingPlans={sharingPlans}
              allSchedules={allSchedules}
            />
          )}
          {activeTab === 'log' && appUser.role !== 'admin' && <LogView appUser={appUser} allLogs={allLogs} />}
          {activeTab === 'admin' && appUser.role === 'admin' && <AdminView appUser={appUser} usersList={usersList} allLogs={allLogs} allSchedules={allSchedules} allProfiles={allProfiles} sharingPlans={sharingPlans} />}
        </main>
      </div>
    </div>
  );
}
