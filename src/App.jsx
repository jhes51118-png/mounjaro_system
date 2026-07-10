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

const SyringeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600">
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
  const doses = chartData.map(d => d.dose);
  const maxWeight = Math.max(...weights) + 1;
  const minWeight = Math.min(...weights) - 1;
  const maxDose = Math.max(...doses) + 1;
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
  const dosePoints = chartData.map((d, i) => `${getX(i)},${getYD(d.dose)}`).join(' ');

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
            <polyline points={dosePoints} fill="none" stroke="#34d399" strokeWidth="3" strokeLinejoin="round" />
            {/* 畫體重線 (藍色) */}
            <polyline points={weightPoints} fill="none" stroke="#3b82f6" strokeWidth="3" strokeLinejoin="round" />

            {/* 畫資料點與標籤 */}
            {chartData.map((d, i) => {
              const x = getX(i); const yw = getYW(d.weight); const yd = getYD(d.dose);
              // 日期格式化 MM/DD
              const dateStr = d.date.substring(5).replace('-', '/');
              return (
                <g key={i}>
                  {/* 綠點 (劑量) */}
                  <circle cx={x} cy={yd} r="4" fill="#10b981" stroke="white" strokeWidth="2"><title>{`日期: ${d.date}\n劑量: ${d.dose} mg`}</title></circle>
                  <text x={x} y={yd - 10} fontSize="10" fill="#059669" textAnchor="middle" fontWeight="bold">{d.dose}</text>
                  
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

function CalculatorView() {
  const [penStrength, setPenStrength] = useState(10); 
  const [targetDose, setTargetDose] = useState(2.5); 
  const [customDose, setCustomDose] = useState(''); 
  const [clicks, setClicks] = useState(0);
  const [exactClicks, setExactClicks] = useState(0);
  const [totalDoses, setTotalDoses] = useState(0);
  const [isExceeding, setIsExceeding] = useState(false);

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
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sm:p-6">
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

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sm:p-6">
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
    </div>
  );
}

function ScheduleView({ appUser, userSchedule }) {
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
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [weight, setWeight] = useState('');
  const [dose, setDose] = useState('2.5');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingLogId, setEditingLogId] = useState(null);
  const [editDate, setEditDate] = useState('');
  const [editWeight, setEditWeight] = useState('');
  const [editDose, setEditDose] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [editError, setEditError] = useState('');

  const myLogs = allLogs.filter(log => log.username === appUser.username);

  const handleAddLog = async (e) => {
    e.preventDefault();
    if (!date || !weight || !dose || !db || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const logRef = doc(collection(db, 'mounjaroLogs'));
      await setDoc(logRef, {
        username: appUser.username,
        date,
        weight: parseFloat(weight),
        dose: parseFloat(dose),
        notes,
        createdAt: new Date().toISOString()
      });
      setWeight('');
      setNotes('');
    } catch (error) {
      console.error("寫入紀錄失敗:", error);
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (id) => {
    if (!db) return;
    if (!window.confirm('確定要刪除這筆施打紀錄嗎？')) return;
    try {
      await deleteDoc(doc(db, 'mounjaroLogs', id));
    } catch (error) {
      console.error("刪除紀錄失敗:", error);
    }
  };

  const startEditLog = (log) => {
    setEditingLogId(log.id);
    setEditDate(log.date || '');
    setEditWeight(String(log.weight ?? ''));
    setEditDose(String(log.dose ?? ''));
    setEditNotes(log.notes || '');
    setEditError('');
  };

  const cancelEditLog = () => {
    setEditingLogId(null);
    setEditDate('');
    setEditWeight('');
    setEditDose('');
    setEditNotes('');
    setEditError('');
  };

  const handleUpdateLog = async (e) => {
    e.preventDefault();
    if (!editingLogId || !editDate || !editWeight || !editDose || !db || isSubmitting) return;

    setIsSubmitting(true);
    setEditError('');
    try {
      await setDoc(doc(db, 'mounjaroLogs', editingLogId), {
        date: editDate,
        weight: parseFloat(editWeight),
        dose: parseFloat(editDose),
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

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sm:p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
          <BookIcon /> <span className="ml-2">新增施打紀錄 (雲端同步)</span>
        </h2>
        <form onSubmit={handleAddLog} className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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
            <div className="col-span-2 md:col-span-1">
              <label className="block text-sm font-medium text-slate-600 mb-1">施打劑量 (mg)</label>
              <input type="number" step="0.1" required value={dose} onChange={e => setDose(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">副作用或感受筆記 (選填)</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="例如：打完第二天有點微噁心、食慾明顯下降..." rows="2"
              className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 resize-none"></textarea>
          </div>
          <button type="submit" disabled={isSubmitting} className={`w-full font-medium py-3 rounded-xl transition-colors shadow-sm ${isSubmitting ? 'bg-slate-400 text-white cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}>
            {isSubmitting ? '儲存中...' : '儲存紀錄'}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sm:p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">歷史紀錄</h2>
        {myLogs.length === 0 ? (
          <div className="text-center py-8 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            尚無紀錄，請在上方新增您的第一筆施打資料。
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
                        <div className="col-span-2 md:col-span-1">
                          <label className="block text-xs font-medium text-slate-500 mb-1">施打劑量 (mg)</label>
                          <input type="number" step="0.1" required value={editDose} onChange={e => setEditDose(e.target.value)}
                            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">副作用或感受筆記</label>
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
                          <div className="text-sm font-semibold text-slate-700 mb-1">{log.date}</div>
                          <div className="flex flex-wrap gap-2">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">💉 {log.dose} mg</span>
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
                      {log.notes && <div className="mt-3 text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">{log.notes}</div>}
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

function AdminView({ appUser, usersList, allLogs, allSchedules }) {
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
    if (!window.confirm(`確定要刪除帳號「${targetUser.username}」嗎？該帳號的施打紀錄與雲端計畫也會一起刪除。`)) return;

    setIsDeletingUser(true);
    try {
      const logsToDelete = allLogs.filter(log => log.username === targetUser.username);
      await Promise.all([
        deleteDoc(doc(db, 'mounjaroUsers', targetUser.id)),
        deleteDoc(doc(db, 'mounjaroSchedules', targetUser.username)),
        ...logsToDelete.map(log => deleteDoc(doc(db, 'mounjaroLogs', log.id)))
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
            <p className="text-xs text-slate-400 mb-1">施打紀錄</p>
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
                        <div className="text-sm font-semibold text-slate-700 mb-1">{log.date}</div>
                        <div className="flex gap-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">💉 {log.dose} mg</span>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">⚖️ {log.weight} kg</span>
                          {weightDiff !== null && (
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${weightDiff > 0 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                              {weightDiff > 0 ? '↑' : '↓'} {Math.abs(weightDiff)} kg
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    {log.notes && <div className="mt-3 text-sm text-slate-600 bg-white border border-slate-100 p-3 rounded-lg">{log.notes}</div>}
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
                  const nearbyLog = targetUserLogs.find(log => {
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
                    <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">💉 {log.dose}</span>
                    <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded">⚖️ {log.weight}</span>
                  </div>
                </div>
                <span className="text-slate-400 text-xs">{log.date}</span>
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

    return () => {
      unsubUsers();
      unsubLogs();
      unsubSchedules();
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
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 font-sans text-slate-800">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 px-8 py-7 text-center">
          <div className="w-10 h-10 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-bold text-slate-700">正在恢復登入狀態...</p>
          <p className="text-xs text-slate-400 mt-1">請稍候，正在連接雲端資料。</p>
        </div>
      </div>
    );
  }

  if (!appUser) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 font-sans text-slate-800">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-200 p-8 animation-fade-in">
          <div className="text-center mb-8">
            <div className="bg-indigo-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-indigo-600">
              <SyringeIcon />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">猛健樂管理系統</h1>
            <p className="text-slate-500 text-sm mt-2">請登入您的專屬帳號以存取數據</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">帳號</label>
              <input type="text" required value={loginUser} onChange={e => setLoginUser(e.target.value)}
                className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500" placeholder="輸入您的帳號" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">密碼</label>
              <input type="password" required value={loginPass} onChange={e => setLoginPass(e.target.value)}
                className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500" placeholder="輸入密碼" />
            </div>
            {loginError && <div className="text-red-500 text-sm text-center font-medium bg-red-50 py-2 rounded-lg">{loginError}</div>}
            
            <button type="submit" disabled={!firebaseUser} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-colors shadow-sm disabled:bg-slate-400">
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
    <div className="min-h-screen bg-slate-100 py-6 px-4 font-sans text-slate-800">
      <style>{`
        .animation-fade-in { animation: fadeIn 0.3s ease-in-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
      
      <div className="max-w-3xl mx-auto space-y-6">
        
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 text-center sm:text-left">
          <div className="flex items-center space-x-4">
            <div className="bg-indigo-50 p-3 rounded-xl inline-flex"><SyringeIcon /></div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">猛健樂管理系統</h1>
              <p className="text-slate-500 text-sm mt-1">哈囉，<strong>{appUser.username}</strong>！歡迎回來。</p>
            </div>
          </div>
          <button onClick={handleLogout} className="px-4 py-2 text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg font-medium transition-colors">
            登出
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-1 flex overflow-x-auto hide-scrollbar">
          <button onClick={() => setActiveTab('calculator')} className={`flex-1 whitespace-nowrap flex items-center justify-center py-3 px-4 text-sm font-medium rounded-lg transition-all ${activeTab === 'calculator' ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}`}>
            <span className="mr-2 hidden sm:inline"><SyringeIcon /></span> 劑量換算
          </button>
          <button onClick={() => setActiveTab('schedule')} className={`flex-1 whitespace-nowrap flex items-center justify-center py-3 px-4 text-sm font-medium rounded-lg transition-all ${activeTab === 'schedule' ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}`}>
            <span className="mr-2"><CalendarIcon /></span> 計畫表
          </button>
          <button onClick={() => setActiveTab('log')} className={`flex-1 whitespace-nowrap flex items-center justify-center py-3 px-4 text-sm font-medium rounded-lg transition-all ${activeTab === 'log' ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}`}>
            <span className="mr-2"><BookIcon /></span> 施打紀錄
          </button>
          {appUser.role === 'admin' && (
            <button onClick={() => setActiveTab('admin')} className={`flex-1 whitespace-nowrap flex items-center justify-center py-3 px-4 text-sm font-bold rounded-lg transition-all ${activeTab === 'admin' ? 'bg-amber-100 text-amber-800 shadow-sm' : 'text-amber-600 hover:bg-amber-50'}`}>
              <span className="mr-2"><UsersIcon /></span> 系統管理
            </button>
          )}
        </div>

        <div>
          {activeTab === 'calculator' && <CalculatorView />}
          {activeTab === 'schedule' && (
            <ScheduleView
              appUser={appUser}
              userSchedule={allSchedules.find(item => item.id === appUser.username || item.username === appUser.username)}
            />
          )}
          {activeTab === 'log' && <LogView appUser={appUser} allLogs={allLogs} />}
          {activeTab === 'admin' && appUser.role === 'admin' && <AdminView appUser={appUser} usersList={usersList} allLogs={allLogs} allSchedules={allSchedules} />}
        </div>
      </div>
    </div>
  );
}
