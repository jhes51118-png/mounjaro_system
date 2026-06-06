import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, onSnapshot, doc, setDoc, deleteDoc } from 'firebase/firestore';

// --- Firebase Initialization (您專屬的雲端設定) ---
const firebaseConfig = {
  apiKey: "AIzaSyCRCbbLWZJVmDlMgNYW8PvVOcRvYJDyaP8",
  authDomain: "mounjaro-system2.firebaseapp.com",
  projectId: "mounjaro-system2",
  storageBucket: "mounjaro-system2.firebasestorage.app",
  messagingSenderId: "1033378209723",
  appId: "1:1033378209723:web:6d5506c3e6a40e8659ae9e"
};

// 啟動 Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// --- Icons Definition ---
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

const PEN_OPTIONS = [2.5, 5, 7.5, 10, 12.5, 15]; 
const COMMON_DOSES = [2.5, 3.0, 3.5, 4.0, 4.5, 5.0, 6.0, 7.0, 8.0, 9.0, 10]; 
const STANDARD_TITRATION = [2.5, 5, 7.5, 10, 12.5, 15];

// ==========================================
// 1. 計算機元件 (CalculatorView)
// ==========================================
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

// ==========================================
// 2. 計畫表元件 (ScheduleView)
// ==========================================
function ScheduleView({ appUser }) {
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [startDose, setStartDose] = useState(2.5);
  const [schedule, setSchedule] = useState([]);
  const [isCustomized, setIsCustomized] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editDate, setEditDate] = useState('');
  const [editDose, setEditDose] = useState('');

  // 讀取個人的計畫設定
  useEffect(() => {
    if (appUser) {
      const saved = localStorage.getItem(`schedule_${appUser.username}`);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setStartDate(parsed.startDate);
          setStartDose(parsed.startDose);
          if (parsed.schedule) {
            const restoredSchedule = parsed.schedule.map(item => ({...item, date: new Date(item.date)}));
            setSchedule(restoredSchedule);
            setIsCustomized(parsed.isCustomized);
            return;
          }
        } catch(e){}
      }
    }
  }, [appUser]);

  useEffect(() => {
    if (!isCustomized) generateSchedule();
  }, [startDate, startDose, isCustomized]);

  useEffect(() => {
    if (appUser && schedule.length > 0) {
      localStorage.setItem(`schedule_${appUser.username}`, JSON.stringify({ startDate, startDose, schedule, isCustomized }));
    }
  }, [schedule, startDate, startDose, isCustomized, appUser]);

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

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sm:p-6 animation-fade-in">
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

// ==========================================
// 3. 紀錄元件 (LogView)
// ==========================================
function LogView({ appUser, allLogs }) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [weight, setWeight] = useState('');
  const [dose, setDose] = useState('2.5');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const myLogs = allLogs.filter(log => log.username === appUser.username);

  const handleAddLog = async (e) => {
    e.preventDefault();
    if (!date || !weight || !dose || !db || isSubmitting) return;

    setIsSubmitting(true);
    try {
      // ✅ 寫入您的 Firebase 根目錄 collection: mounjaroLogs
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
      alert("寫入失敗，請確認您的 Firebase 規則是否已設為 test mode (允許讀寫)");
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (id) => {
    if (!db) return;
    try {
      // ✅ 刪除對應的資料
      await deleteDoc(doc(db, 'mounjaroLogs', id));
    } catch (error) {
      console.error("刪除紀錄失敗:", error);
    }
  };

  return (
    <div className="space-y-6 animation-fade-in">
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
                    <button onClick={() => handleDelete(log.id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50">
                      <TrashIcon />
                    </button>
                  </div>
                  {log.notes && <div className="mt-3 text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">{log.notes}</div>}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ==========================================
// 4. 管理員後台 (AdminView)
// ==========================================
function AdminView({ usersList, allLogs }) {
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setErrorMsg(''); setSuccessMsg('');
    if (!newUsername || !newPassword) return;

    if (usersList.some(u => u.username === newUsername)) {
      setErrorMsg('此帳號已存在！');
      return;
    }

    try {
      // ✅ 寫入您的 Firebase 根目錄 collection: mounjaroUsers
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
      setErrorMsg('建立失敗，請確認 Firebase 規則是否有開通寫入權限。');
    }
  };

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
          <h3 className="font-semibold text-slate-800 mb-4">現有使用者列表</h3>
          <ul className="space-y-2">
            {usersList.map(u => (
              <li key={u.id} className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-100">
                <span className="font-medium text-slate-700">{u.username} <span className="text-xs text-slate-400 font-normal ml-1">({u.role})</span></span>
                <span className="text-xs text-slate-500">密碼: {u.password}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sm:p-6">
          <h3 className="font-semibold text-slate-800 mb-4">全體數據總覽 (最新50筆)</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
            {allLogs.slice(0, 50).map(log => (
              <div key={log.id} className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-sm">
                <div className="flex justify-between mb-1">
                  <span className="font-bold text-indigo-600">{log.username}</span>
                  <span className="text-slate-500">{log.date}</span>
                </div>
                <div className="flex gap-3 text-slate-700">
                  <span>💉 {log.dose}mg</span>
                  <span>⚖️ {log.weight}kg</span>
                </div>
              </div>
            ))}
            {allLogs.length === 0 && <p className="text-sm text-slate-400">目前尚無任何紀錄</p>}
          </div>
        </div>
      </div>
    </div>
  );
}


// ==========================================
// 5. 主應用程式入口 (MounjaroApp)
// ==========================================
export default function MounjaroApp() {
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [appUser, setAppUser] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [allLogs, setAllLogs] = useState([]);
  
  const [activeTab, setActiveTab] = useState('calculator');
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState('');

  // 1. 匿名登入 (連線至您的專屬專案)
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

  // 2. 監聽您的資料庫集合
  useEffect(() => {
    if (!firebaseUser || !db) return;

    const usersRef = collection(db, 'mounjaroUsers');
    const unsubUsers = onSnapshot(usersRef, (snapshot) => {
      const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsersList(users);
    }, err => console.error("Fetch users error (請確認 Firestore 規則):", err));

    const logsRef = collection(db, 'mounjaroLogs');
    const unsubLogs = onSnapshot(logsRef, (snapshot) => {
      const logs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      logs.sort((a, b) => new Date(b.date) - new Date(a.date));
      setAllLogs(logs);
    }, err => console.error("Fetch logs error (請確認 Firestore 規則):", err));

    return () => {
      unsubUsers();
      unsubLogs();
    };
  }, [firebaseUser]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');

    // 如果您的資料庫目前是空的，自動幫您建立第一組管理員帳號
    if (usersList.length === 0 && loginUser === 'admin' && loginPass === 'admin123') {
      try {
        const adminRef = doc(collection(db, 'mounjaroUsers'));
        await setDoc(adminRef, { username: 'admin', password: 'admin123', role: 'admin' });
        setAppUser({ username: 'admin', role: 'admin' });
      } catch (err) {
        setLoginError('無法初始化管理員帳號，請確認您的 Firebase Database 規則已設為 test mode。');
      }
      return;
    }

    const foundUser = usersList.find(u => u.username === loginUser && u.password === loginPass);
    if (foundUser) {
      setAppUser({ username: foundUser.username, role: foundUser.role });
    } else {
      setLoginError('帳號或密碼錯誤！');
    }
  };

  const handleLogout = () => {
    setAppUser(null);
    setLoginUser('');
    setLoginPass('');
    setActiveTab('calculator');
  };

  // --- 登入畫面 ---
  if (!appUser) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 font-sans text-slate-800">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-200 p-8 animation-fade-in">
          <div className="text-center mb-8">
            <div className="bg-indigo-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-indigo-600">
              <SyringeIcon />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">猛健樂管理系統</h1>
            <p className="text-slate-500 text-sm mt-2">已成功連線至您的雲端資料庫</p>
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
            {usersList.length === 0 && <p>💡 您的資料庫目前是空的！<br/>請使用預設管理員登入：<br/>帳號 <strong>admin</strong> / 密碼 <strong>admin123</strong></p>}
          </div>
        </div>
      </div>
    );
  }

  // --- 主系統畫面 ---
  return (
    <div className="min-h-screen bg-slate-100 py-6 px-4 font-sans text-slate-800">
      <style>{`
        .animation-fade-in { animation: fadeIn 0.3s ease-in-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
      
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Header */}
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

        {/* Navigation Tabs */}
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

        {/* Content Area */}
        <div>
          {activeTab === 'calculator' && <CalculatorView />}
          {activeTab === 'schedule' && <ScheduleView appUser={appUser} />}
          {activeTab === 'log' && <LogView appUser={appUser} allLogs={allLogs} />}
          {activeTab === 'admin' && appUser.role === 'admin' && <AdminView usersList={usersList} allLogs={allLogs} />}
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-slate-400 mt-8 mb-4">
          已成功與專案: mounjaro-system2 連線。
        </div>

      </div>
    </div>
  );
}
