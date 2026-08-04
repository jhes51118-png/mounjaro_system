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

const PEN_OPTIONS = [2.5, 5, 7.5, 10, 12.5, 15]; 
const COMMON_DOSES = [2.5, 3.0, 3.5, 4.0, 4.5, 5.0, 6.0, 7.0, 8.0, 9.0, 10]; 
const STANDARD_TITRATION = [2.5, 5, 7.5, 10, 12.5, 15];
const SESSION_KEY = 'mounjaroRememberedUser';
const COMMON_SYMPTOMS = ['噁心', '嘔吐', '腹瀉', '便秘', '胃脹', '胃痛', '食慾下降', '頭暈', '頭痛', '疲倦', '口渴', '注射處不適'];
const MOOD_OPTIONS = ['很好', '平穩', '普通', '低落', '焦慮', '煩躁', '疲憊'];

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
  // 資料少於2筆不畫圖
  if (!logs || logs.length < 2) {
    return (
      <div className="flex flex-col items-center justify-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-200">
        <span className="text-2xl mb-2">📊</span>
        <p className="text-sm text-slate-400">目前紀錄不足，新增至少 2 筆資料即可產生趨勢圖表</p>
      </div>
    );
  }

  // 將資料按日期從舊到新排序 (由左至右)
  const chartData = [...logs].sort((a, b) => new Date(a.date) - new Date(b.date));

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

  // SVG 畫布設定
  const svgW = 600; const svgH = 220;
  const padX = 40; const padY = 30;
  const innerW = svgW - padX * 2;
  const innerH = svgH - padY * 2;

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
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-6">
      <div className="flex justify-between items-center mb-4 px-2">
        <h3 className="font-bold text-slate-700 text-sm">體重與劑量趨勢</h3>
        <div className="flex gap-4 text-xs font-medium">
          <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-blue-500 mr-1.5"></span>體重 (kg)</div>
          <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-emerald-400 mr-1.5"></span>劑量 (mg)</div>
        </div>
      </div>
      
      {/* 讓圖表在手機上可以滑動 */}
      <div className="overflow-x-auto hide-scrollbar">
        <div style={{ minWidth: `${Math.max(chartData.length * 50, 400)}px` }}>
          <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full h-auto drop-shadow-sm">
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
              // 日期格式化 MM/DD
              const dateStr = d.date.substring(5).replace('-', '/');
              return (
                <g key={i}>
                  {/* 綠點 (劑量) */}
                  {yd !== null && (
                    <>
                      <circle cx={x} cy={yd} r="4" fill="#10b981" stroke="white" strokeWidth="2"><title>{`日期: ${d.date}\n劑量: ${d.dose} mg`}</title></circle>
                      <text x={x} y={yd - 10} fontSize="10" fill="#059669" textAnchor="middle" fontWeight="bold">{d.dose}</text>
                    </>
                  )}
                  
                  {/* 藍點 (體重) */}
                  <circle cx={x} cy={yw} r="5" fill="#2563eb" stroke="white" strokeWidth="2"><title>{`日期: ${d.date}\n體重: ${d.weight} kg`}</title></circle>
                  <text x={x} y={yw - 12} fontSize="11" fill="#1d4ed8" textAnchor="middle" fontWeight="bold">{d.weight}</text>
                  
                  {/* X軸日期 */}
                  <text x={x} y={svgH - 10} fontSize="10" fill="#64748b" textAnchor="middle">{dateStr}</text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>
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
          <h3 className="text-center text-slate-500 font-medium mb-2">請旋轉筆針撥號盤</h3>
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
                  <p className="text-xs text-slate-400 mb-1">一支筆可打次數</p>
                  <p className="text-lg font-bold text-slate-700">{totalDoses.toFixed(1)} <span className="text-xs font-normal text-slate-500">次</span></p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-slate-400 mb-1">預估使用時間</p>
                  <p className="text-lg font-bold text-slate-700">{Math.floor(totalDoses)} <span className="text-xs font-normal text-slate-500">週</span></p>
                </div>
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
              {inventory && <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold ring-1 ring-white/20">{inventory.penStrength} mg 規格</span>}
            </div>
            {!inventory ? (
              <div className="mt-5 rounded-xl bg-white/10 p-4 text-sm text-indigo-50 ring-1 ring-white/15">
                請先到「劑量計算」儲存目前這支筆的起始日期，系統即可依計畫表推算用完時間。
              </div>
            ) : (
              <div className="mt-5">
                <p className="text-sm text-indigo-100">目前預估剩餘</p>
                <p className="mt-1 text-4xl font-black">{ownRemainingMg.toFixed(1)} <span className="text-sm font-bold">mg</span></p>
                <div className="mt-4 rounded-xl bg-white/10 p-4 ring-1 ring-white/20">
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
                <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold ring-1 ring-white/20">{activeSharedPlan.penStrength} mg 規格</span>
              </div>
              <div className="mt-5">
                <p className="text-sm text-emerald-50">合併預估剩餘</p>
                <p className="mt-1 text-4xl font-black">{sharedRemainingMg.toFixed(1)} <span className="text-sm font-bold">mg</span></p>
                <div className="mt-4 rounded-xl bg-white/10 p-4 ring-1 ring-white/20">
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
          <button onClick={() => { setIsCustomized(false); setEditingIndex(null); }} className="text-sm px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors flex items-center shadow-sm border border-indigo-100">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
            重置為標準遞增計畫
          </button>
        </div>
      )}

      <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 mb-6 text-sm text-indigo-800">
        <p className="flex items-start">
          <span className="mt-0.5 mr-2"><InfoIcon /></span>
          <span>此計畫表依據原廠建議遞增。<strong>游標移至列表右側可點擊修改圖示</strong>，針對特定日期與劑量進行手動微調。實際施打請依醫囑為準。</span>
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
                      <button onClick={() => setEditingIndex(null)} className="px-3 py-1.5 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 flex items-center transition-colors">
                        <XIcon /> <span className="ml-1">取消</span>
                      </button>
                      <button onClick={() => handleSaveEdit(index)} className="px-3 py-1.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 flex items-center shadow-sm transition-colors">
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
                        <button onClick={() => handleEditClick(index, item)} className="text-slate-400 hover:text-indigo-600 transition-colors md:opacity-0 md:group-hover:opacity-100 focus:opacity-100 p-1 rounded hover:bg-indigo-50" title="手動微調">
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

  const myLogs = allLogs.filter(log => log.username === appUser.username);

  const toggleSymptom = (symptom) => {
    setSymptoms(current => current.includes(symptom) ? current.filter(item => item !== symptom) : [...current, symptom]);
  };

  const toggleEditSymptom = (symptom) => {
    setEditSymptoms(current => current.includes(symptom) ? current.filter(item => item !== symptom) : [...current, symptom]);
  };

  const handleAddLog = async (e) => {
    e.preventDefault();
    if (!date || !weight || (recordType === 'injection' && !dose) || !db || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const logRef = doc(collection(db, 'mounjaroLogs'));
      await setDoc(logRef, {
        username: appUser.username,
        recordType,
        date,
        weight: parseFloat(weight),
        dose: recordType === 'injection' ? parseFloat(dose) : null,
        symptoms,
        mood,
        notes,
        createdAt: new Date().toISOString()
      });
      setWeight('');
      setNotes('');
      setSymptoms([]);
      setMood('');
    } catch (error) {
      console.error("寫入紀錄失敗:", error);
    }
    setIsSubmitting(false);
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
                <label key={symptom} className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm cursor-pointer transition-colors ${symptoms.includes(symptom) ? 'bg-amber-50 border-amber-300 text-amber-800' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
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
            {myLogs.map((log, index) => {
              let weightDiff = null;
              if (index < myLogs.length - 1) {
                const prevWeight = myLogs[index + 1].weight;
                weightDiff = (log.weight - prevWeight).toFixed(1);
              }
              return (
                <div key={log.id} className="relative group bg-white border border-slate-200 p-4 rounded-xl hover:border-indigo-300 transition-colors">
                  {editingLogId === log.id ? (
                    <form onSubmit={handleUpdateLog} className="space-y-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-500 mb-2">紀錄類型</label>
                        <div className="grid grid-cols-2 gap-2">
                          <button type="button" onClick={() => setEditRecordType('weight')} className={`rounded-lg border px-3 py-2 text-xs font-bold ${editRecordType === 'weight' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-500'}`}>⚖️ 只記錄體重</button>
                          <button type="button" onClick={() => setEditRecordType('injection')} className={`rounded-lg border px-3 py-2 text-xs font-bold ${editRecordType === 'injection' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-200 text-slate-500'}`}>💉 施打＋體重</button>
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
                            <label key={symptom} className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs cursor-pointer transition-colors ${editSymptoms.includes(symptom) ? 'bg-amber-50 border-amber-300 text-amber-800' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
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
                          <button onClick={() => startEditLog(log)} className="px-3 py-2 text-xs font-medium text-indigo-600 hover:text-indigo-700 transition-colors rounded-lg hover:bg-indigo-50">
                            修改
                          </button>
                          <button onClick={() => handleDelete(log.id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50">
                            <TrashIcon />
                          </button>
                        </div>
                      </div>
                      <LogExtraDetails log={log} />
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function AdminView({ appUser, usersList, allLogs, allSchedules, sharingPlans }) {
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isDeletingUser, setIsDeletingUser] = useState(false);
  
  // 🕵️ 紀錄管理員目前選中了哪一個使用者來查看詳細資料
  const [selectedUser, setSelectedUser] = useState(null);
  const [adminDetailTab, setAdminDetailTab] = useState('logs');

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

  // 如果點擊了某個使用者，顯示專屬詳細檔案與圖表
  if (selectedUser) {
    const targetUserLogs = allLogs.filter(log => log.username === selectedUser.username);
    const targetUserSchedule = allSchedules.find(item => item.id === selectedUser.username || item.username === selectedUser.username);
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

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
            <p className="text-xs text-slate-400 mb-1">健康紀錄總數</p>
            <p className="text-2xl font-bold text-slate-800">{targetUserLogs.length} <span className="text-xs font-normal text-slate-400">筆</span></p>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
            <p className="text-xs text-slate-400 mb-1">雲端計畫</p>
            <p className={`text-sm font-bold mt-2 ${targetUserSchedule ? 'text-emerald-600' : 'text-slate-400'}`}>{targetUserSchedule ? '已建立並同步' : '尚未建立'}</p>
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
              {targetUserLogs.map((log, index) => {
                let weightDiff = null;
                if (index < targetUserLogs.length - 1) {
                  const prevWeight = targetUserLogs[index + 1].weight;
                  weightDiff = (log.weight - prevWeight).toFixed(1);
                }
                return (
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
                );
              })}
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
        <form onSubmit={handleCreateUser} className="flex flex-col sm:flex-row gap-3">
          <input type="text" placeholder="輸入新帳號名稱" value={newUsername} onChange={e => setNewUsername(e.target.value)} required className="flex-1 border border-indigo-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500" />
          <input type="text" placeholder="設定密碼" value={newPassword} onChange={e => setNewPassword(e.target.value)} required className="flex-1 border border-indigo-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500" />
          <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-2 rounded-xl transition-colors shadow-sm">新增帳號</button>
        </form>
        {errorMsg && <p className="text-red-500 text-sm mt-3">{errorMsg}</p>}
        {successMsg && <p className="text-green-600 text-sm mt-3">{successMsg}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sm:p-6">
          <h3 className="font-semibold text-slate-800 mb-4">現有使用者列表 <span className="text-xs font-normal text-slate-400 ml-2">(點擊查看詳情)</span></h3>
          <ul className="space-y-2">
            {usersList.map(u => (
              <li 
                key={u.id} 
                onClick={() => setSelectedUser(u)}
                className="group flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-100 cursor-pointer hover:bg-indigo-50 hover:border-indigo-200 transition-all"
                title={`查看 ${u.username} 的詳細紀錄`}
              >
                <span className="font-medium text-slate-700 group-hover:text-indigo-700">{u.username} <span className="text-xs text-slate-400 font-normal ml-1">({u.role})</span></span>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400">密碼: {u.password}</span>
                  {u.username !== appUser.username && u.role !== 'admin' && (
                    <button
                      type="button"
                      onClick={(event) => handleDeleteUser(u, event)}
                      disabled={isDeletingUser}
                      className="px-2.5 py-1 text-xs font-bold text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50"
                    >
                      刪除
                    </button>
                  )}
                  <span className="text-slate-300 group-hover:text-indigo-500 transition-colors"><EyeIcon /></span>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sm:p-6">
          <h3 className="font-semibold text-slate-800 mb-4">全體數據總覽 (最新50筆)</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto pr-2 hide-scrollbar">
            {allLogs.slice(0, 50).map(log => (
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
            {allLogs.length === 0 && <p className="text-sm text-slate-400">目前尚無任何紀錄</p>}
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
    if (!firebaseUser || !usersLoaded || sessionChecked) return;

    const rememberedUsername = localStorage.getItem(SESSION_KEY);
    if (rememberedUsername) {
      const rememberedUser = usersList.find(user => user.username === rememberedUsername);
      if (rememberedUser) {
        setAppUser({ username: rememberedUser.username, role: rememberedUser.role });
      } else {
        localStorage.removeItem(SESSION_KEY);
      }
    }
    setSessionChecked(true);
  }, [firebaseUser, usersLoaded, usersList, sessionChecked]);

  const rememberUser = (user) => {
    localStorage.setItem(SESSION_KEY, user.username);
    setAppUser({ username: user.username, role: user.role });
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
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-cyan-100 flex items-center justify-center p-4 font-sans text-slate-800">
        <div className="bg-white/85 backdrop-blur-xl rounded-3xl shadow-xl shadow-indigo-100 border border-white px-10 py-9 text-center">
          <div className="relative w-14 h-14 mx-auto mb-5">
            <div className="absolute inset-0 rounded-full bg-indigo-200 animate-ping opacity-40"></div>
            <div className="relative w-14 h-14 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
          </div>
          <p className="font-black text-slate-800">正在為您準備健康資料</p>
          <p className="text-xs text-slate-400 mt-2">連接雲端並恢復登入狀態...</p>
        </div>
      </div>
    );
  }

  if (!appUser) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-indigo-100 via-white to-emerald-100 flex items-center justify-center p-4 font-sans text-slate-800">
        <div className="pointer-events-none absolute -left-24 top-16 h-72 w-72 rounded-full bg-violet-300/30 blur-3xl"></div>
        <div className="pointer-events-none absolute -right-24 bottom-12 h-80 w-80 rounded-full bg-cyan-300/30 blur-3xl"></div>
        <div className="relative max-w-md w-full bg-white/88 backdrop-blur-xl rounded-[2rem] shadow-2xl shadow-indigo-200/50 border border-white p-7 sm:p-9 animation-fade-in">
          <div className="text-center mb-8">
            <div className="bg-gradient-to-br from-indigo-500 to-violet-600 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-5 text-white shadow-lg shadow-indigo-200 rotate-3">
              <SyringeIcon className="text-white" />
            </div>
            <span className="inline-flex rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold tracking-wide text-indigo-600 mb-3">MY WELLNESS JOURNEY</span>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">猛健樂健康日誌</h1>
            <p className="text-slate-500 text-sm mt-2">記錄每一步，讓改變變得看得見</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">帳號</label>
              <input type="text" required value={loginUser} onChange={e => setLoginUser(e.target.value)}
                className="w-full border border-slate-200 bg-slate-50/80 rounded-2xl px-4 py-3.5 focus:bg-white focus:ring-2 focus:ring-indigo-400" placeholder="輸入您的帳號" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">密碼</label>
              <input type="password" required value={loginPass} onChange={e => setLoginPass(e.target.value)}
                className="w-full border border-slate-200 bg-slate-50/80 rounded-2xl px-4 py-3.5 focus:bg-white focus:ring-2 focus:ring-indigo-400" placeholder="輸入密碼" />
            </div>
            {loginError && <div className="text-red-500 text-sm text-center font-medium bg-red-50 py-2 rounded-lg">{loginError}</div>}
            
            <button type="submit" disabled={!firebaseUser} className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold py-3.5 rounded-2xl transition-all shadow-lg shadow-indigo-200 disabled:from-slate-400 disabled:to-slate-400 disabled:shadow-none">
              {firebaseUser ? '登入系統' : '連線中...'}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-400">
            {usersList.length === 0 && <p>💡 系統初次啟動，請使用預設管理員登入：<br/>帳號 <strong>admin</strong> / 密碼 <strong>admin123</strong></p>}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="wellness-shell relative min-h-screen overflow-hidden bg-[#f5f7ff] py-5 px-3 sm:py-7 sm:px-5 font-sans text-slate-800">
      <style>{`
        .animation-fade-in { animation: fadeIn 0.35s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes floatSoft { 0%, 100% { transform: translate3d(0, 0, 0); } 50% { transform: translate3d(0, -14px, 0); } }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .wellness-shell:before { content: ''; position: fixed; inset: 0; pointer-events: none; background-image: radial-gradient(circle at 1px 1px, rgba(99,102,241,.09) 1px, transparent 0); background-size: 28px 28px; mask-image: linear-gradient(to bottom, black, transparent 72%); }
        .wellness-shell input, .wellness-shell select, .wellness-shell textarea { outline: none; transition: border-color .2s ease, box-shadow .2s ease, background-color .2s ease; }
        .wellness-shell button { -webkit-tap-highlight-color: transparent; }
        .wellness-shell .rounded-2xl.bg-white { box-shadow: 0 14px 40px rgba(74, 85, 140, .08); border-color: rgba(226, 232, 240, .8); }
        @media (prefers-reduced-motion: reduce) { .animation-fade-in { animation: none; } .decorative-blob { animation: none !important; } }
      `}</style>
      <div className="decorative-blob pointer-events-none fixed -left-24 top-20 h-80 w-80 rounded-full bg-violet-300/25 blur-3xl" style={{ animation: 'floatSoft 8s ease-in-out infinite' }}></div>
      <div className="decorative-blob pointer-events-none fixed -right-28 top-1/3 h-96 w-96 rounded-full bg-cyan-300/20 blur-3xl" style={{ animation: 'floatSoft 10s ease-in-out infinite reverse' }}></div>

      <div className="relative z-10 max-w-5xl mx-auto space-y-5 sm:space-y-6">
        <header className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-500 p-5 sm:p-7 text-white shadow-2xl shadow-indigo-200/70">
          <div className="absolute -right-10 -top-16 h-44 w-44 rounded-full border-[28px] border-white/10"></div>
          <div className="absolute bottom-0 right-1/4 h-24 w-24 translate-y-1/2 rounded-full bg-cyan-300/20 blur-xl"></div>
          <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 backdrop-blur ring-1 ring-white/25 shadow-lg"><SyringeIcon className="text-white" /></div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-100">Mounjaro Wellness</p>
                <h1 className="mt-1 text-2xl sm:text-3xl font-black tracking-tight">猛健樂健康日誌</h1>
                <p className="mt-1 text-sm text-indigo-100">嗨，<strong className="text-white">{appUser.username}</strong>・{new Date().toLocaleDateString('zh-TW', { month: 'long', day: 'numeric', weekday: 'long' })}</p>
              </div>
            </div>
            <div className="flex w-full sm:w-auto items-center gap-2">
              <span className="flex-1 sm:flex-none rounded-full bg-emerald-300/20 px-3 py-2 text-center text-xs font-bold text-emerald-50 ring-1 ring-emerald-200/30">● 雲端同步</span>
              <button onClick={handleLogout} className="rounded-full bg-white/15 px-4 py-2 text-sm font-bold text-white ring-1 ring-white/25 backdrop-blur hover:bg-white/25 transition-colors">登出</button>
            </div>
          </div>
        </header>

        <nav className="sticky top-3 z-30 flex overflow-x-auto hide-scrollbar gap-1.5 rounded-2xl border border-white/80 bg-white/75 p-1.5 shadow-xl shadow-indigo-100/50 backdrop-blur-xl">
          <button onClick={() => setActiveTab('calculator')} className={`flex-1 min-w-[94px] whitespace-nowrap rounded-xl px-3 py-3 text-sm font-bold transition-all ${activeTab === 'calculator' ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-200' : 'text-slate-500 hover:bg-indigo-50 hover:text-indigo-700'}`}>
            <span className="mr-1.5">🧮</span> 劑量計算
          </button>
          <button onClick={() => setActiveTab('schedule')} className={`flex-1 min-w-[86px] whitespace-nowrap rounded-xl px-3 py-3 text-sm font-bold transition-all ${activeTab === 'schedule' ? 'bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-lg shadow-sky-200' : 'text-slate-500 hover:bg-sky-50 hover:text-sky-700'}`}>
            <span className="mr-1.5">🗓️</span> 計畫表
          </button>
          <button onClick={() => setActiveTab('log')} className={`flex-1 min-w-[94px] whitespace-nowrap rounded-xl px-3 py-3 text-sm font-bold transition-all ${activeTab === 'log' ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-200' : 'text-slate-500 hover:bg-emerald-50 hover:text-emerald-700'}`}>
            <span className="mr-1.5">✨</span> 健康紀錄
          </button>
          {appUser.role === 'admin' && (
            <button onClick={() => setActiveTab('admin')} className={`flex-1 min-w-[94px] whitespace-nowrap rounded-xl px-3 py-3 text-sm font-bold transition-all ${activeTab === 'admin' ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-200' : 'text-amber-600 hover:bg-amber-50'}`}>
              <span className="mr-1.5">👥</span> 系統管理
            </button>
          )}
        </nav>

        <main className="pb-8">
          {activeTab === 'calculator' && <CalculatorView appUser={appUser} usersList={usersList} allLogs={allLogs} allSchedules={allSchedules} sharingPlans={sharingPlans} inventory={doseInventories.find(item => item.id === appUser.username || item.username === appUser.username)} />}
          {activeTab === 'schedule' && (
            <ScheduleView
              appUser={appUser}
              userSchedule={allSchedules.find(item => item.id === appUser.username || item.username === appUser.username)}
              allLogs={allLogs}
              inventory={doseInventories.find(item => item.id === appUser.username || item.username === appUser.username)}
              sharingPlans={sharingPlans}
              allSchedules={allSchedules}
            />
          )}
          {activeTab === 'log' && <LogView appUser={appUser} allLogs={allLogs} />}
          {activeTab === 'admin' && appUser.role === 'admin' && <AdminView appUser={appUser} usersList={usersList} allLogs={allLogs} allSchedules={allSchedules} sharingPlans={sharingPlans} />}
        </main>
      </div>
    </div>
  );
}
