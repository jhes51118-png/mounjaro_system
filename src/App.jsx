// ... existing code ...
const ChevronLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m15 18-6-6 6-6"/>
  </svg>
);
const CloudIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>
  </svg>
);

const PEN_OPTIONS = [2.5, 5, 7.5, 10, 12.5, 15]; 
// ... existing code ...
function CalculatorView() {
// ... existing code ...
  );
}

function ScheduleView({ appUser, db, userSchedule }) {
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [startDose, setStartDose] = useState(2.5);
  const [schedule, setSchedule] = useState([]);
  const [isCustomized, setIsCustomized] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editDate, setEditDate] = useState('');
  const [editDose, setEditDose] = useState('');
  
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // 1. 載入雲端資料或初始化
  useEffect(() => {
    if (userSchedule) {
      setStartDate(userSchedule.startDate);
      setStartDose(userSchedule.startDose);
      setSchedule(userSchedule.schedule);
      setIsCustomized(userSchedule.isCustomized);
    } else if (schedule.length === 0) {
      generateSchedule(startDate, startDose);
    }
  }, [userSchedule]);

  // 2. 當尚未客製化時，若起始日或劑量改變，自動重算
  useEffect(() => {
    if (!isCustomized && (!userSchedule || startDate !== userSchedule.startDate || startDose !== userSchedule.startDose)) {
      generateSchedule(startDate, startDose);
    }
  }, [startDate, startDose, isCustomized]);

  // 3. 檢查是否有未儲存的變更，決定是否顯示「儲存按鈕」
  useEffect(() => {
    if (schedule.length === 0) return;
    const currentHash = JSON.stringify({ startDate, startDose, schedule, isCustomized });
    const cloudHash = userSchedule ? JSON.stringify({
      startDate: userSchedule.startDate,
      startDose: userSchedule.startDose,
      schedule: userSchedule.schedule,
      isCustomized: userSchedule.isCustomized
    }) : null;
    setHasUnsavedChanges(currentHash !== cloudHash);
  }, [startDate, startDose, schedule, isCustomized, userSchedule]);

  const generateSchedule = (dateStr, dose) => {
    if (!dateStr) return;
    const newSchedule = [];
    let currentDate = new Date(dateStr);
    let currentDoseIndex = STANDARD_TITRATION.findIndex(d => d >= dose);
    if (currentDoseIndex === -1) currentDoseIndex = 0;
    let currentDoseValue = STANDARD_TITRATION[currentDoseIndex];

    for (let week = 1; week <= 16; week++) {
      newSchedule.push({ week, date: currentDate.toISOString().split('T')[0], dose: currentDoseValue });
      if (week % 4 === 0) {
        currentDoseIndex = Math.min(currentDoseIndex + 1, STANDARD_TITRATION.length - 1);
        currentDoseValue = STANDARD_TITRATION[currentDoseIndex];
      }
      currentDate.setDate(currentDate.getDate() + 7);
    }
    setSchedule(newSchedule);
  };

  const handleSaveToCloud = async () => {
    if (!db || !appUser) return;
    setIsSaving(true);
    try {
      await setDoc(doc(db, 'mounjaroSchedules', appUser.username), {
        username: appUser.username,
        startDate,
        startDose,
        schedule,
        isCustomized,
        updatedAt: new Date().toISOString()
      });
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error("儲存計畫表失敗:", error);
    }
    setIsSaving(false);
  };

  const handleEditClick = (index, item) => {
    setEditingIndex(index);
    setEditDate(item.date);
    setEditDose(item.dose);
  };

  const handleSaveEdit = (index) => {
    const updated = [...schedule];
    updated[index] = { ...updated[index], date: editDate, dose: parseFloat(editDose) || updated[index].dose };
    setSchedule(updated);
    setEditingIndex(null);
    setIsCustomized(true);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sm:p-6 animation-fade-in">
      
      {/* 💾 儲存提示區塊 */}
      {hasUnsavedChanges && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex flex-col sm:flex-row items-center justify-between shadow-sm animation-fade-in">
          <div className="flex items-center text-amber-800 mb-3 sm:mb-0 text-sm font-medium">
            <AlertTriangle />
            <span className="ml-2">您有尚未儲存的計畫表變更。</span>
          </div>
          <button
            onClick={handleSaveToCloud}
            disabled={isSaving}
            className="w-full sm:w-auto px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold rounded-lg shadow-sm transition-colors flex items-center justify-center disabled:opacity-50"
          >
            <CloudIcon />
            <span className="ml-2">{isSaving ? '儲存中...' : '儲存至雲端'}</span>
          </button>
        </div>
      )}

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
          <button onClick={() => { setIsCustomized(false); setEditingIndex(null); generateSchedule(startDate, startDose); }} className="text-sm px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors flex items-center shadow-sm border border-indigo-100">
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
                        <span className="text-sm text-slate-500">{item.date.replace(/-/g, '/')}</span>
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
// ... existing code ...
function AdminView({ usersList, allLogs, allSchedules }) {
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  // 🕵️ 紀錄管理員目前選中了哪一個使用者來查看詳細資料
  const [selectedUser, setSelectedUser] = useState(null);
  const [adminTab, setAdminTab] = useState('logs'); // 'logs' 紀錄圖表 或 'schedule' 計畫表

  const handleCreateUser = async (e) => {
// ... existing code ...
    } catch (err) {
      setErrorMsg('建立失敗，請稍後再試。');
    }
  };

  // 如果點擊了某個使用者，顯示專屬詳細檔案與圖表
  if (selectedUser) {
    const targetUserLogs = allLogs.filter(log => log.username === selectedUser.username);
    const targetUserSchedule = allSchedules.find(s => s.id === selectedUser.username);

    return (
      <div className="space-y-6 animation-fade-in">
        <div className="flex items-center gap-3 mb-2">
          <button onClick={() => { setSelectedUser(null); setAdminTab('logs'); }} className="p-2 bg-white rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-indigo-600 shadow-sm transition-colors flex items-center">
            <ChevronLeftIcon /> 返回列表
          </button>
          <h2 className="text-xl font-bold text-slate-800">
            使用者 <span className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">{selectedUser.username}</span> 的檔案
          </h2>
        </div>

        {/* 📋 雙切換按鈕區塊 */}
        <div className="flex space-x-2 bg-slate-200/60 p-1 rounded-xl w-full max-w-sm mb-4">
          <button onClick={() => setAdminTab('logs')} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${adminTab === 'logs' ? 'bg-white shadow text-indigo-700' : 'text-slate-500 hover:text-slate-700'}`}>施打紀錄</button>
          <button onClick={() => setAdminTab('schedule')} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${adminTab === 'schedule' ? 'bg-white shadow text-indigo-700' : 'text-slate-500 hover:text-slate-700'}`}>專屬計畫表</button>
        </div>

        {adminTab === 'logs' && (
          <div className="animation-fade-in">
            {/* 顯示該使用者的圖表 */}
            <TrendChart logs={targetUserLogs} />

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sm:p-6 mt-6">
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

        {adminTab === 'schedule' && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sm:p-6 animation-fade-in">
            <h3 className="font-semibold text-slate-800 mb-4 flex items-center">
              <CalendarIcon /> <span className="ml-2">雲端同步計畫表</span>
            </h3>
            {!targetUserSchedule ? (
              <div className="text-center py-10 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                此使用者尚未儲存任何計畫表至雲端。
              </div>
            ) : (
              <div>
                <div className="flex gap-4 mb-6 bg-indigo-50 p-4 rounded-xl text-sm border border-indigo-100 flex-wrap">
                  <div>
                    <span className="text-indigo-500 block mb-1 text-xs">計畫狀態</span>
                    <span className={`font-bold ${targetUserSchedule.isCustomized ? 'text-amber-600' : 'text-indigo-700'}`}>
                      {targetUserSchedule.isCustomized ? '已手動微調' : '標準遞增計畫'}
                    </span>
                  </div>
                  <div className="border-l border-indigo-200 pl-4">
                    <span className="text-indigo-500 block mb-1 text-xs">第一針起始日</span>
                    <span className="font-bold text-slate-700">{targetUserSchedule.startDate.replace(/-/g, '/')}</span>
                  </div>
                  <div className="border-l border-indigo-200 pl-4 hidden sm:block">
                    <span className="text-indigo-500 block mb-1 text-xs">最後更新時間</span>
                    <span className="font-bold text-slate-700">{new Date(targetUserSchedule.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  {targetUserSchedule.schedule.map((item, index) => {
                    const isDoseChange = index === 0 || item.dose !== targetUserSchedule.schedule[index - 1].dose;
                    return (
                      <div key={item.week} className={`p-3 rounded-xl flex justify-between items-center transition-colors ${isDoseChange ? 'bg-indigo-50 border border-indigo-200 shadow-sm' : 'bg-slate-50 border border-slate-100'}`}>
                        <div>
                          <span className="text-sm font-bold text-slate-700">第 {item.week} 週</span>
                          <span className="ml-3 text-sm text-slate-500">{item.date.replace(/-/g, '/')}</span>
                        </div>
                        <span className={`font-bold px-2 py-1 rounded text-sm ${isDoseChange ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white text-slate-700 border border-slate-200'}`}>
                          {item.dose} mg
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // 預設的管理員列表總覽
  return (
// ... existing code ...
export default function MounjaroApp() {
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [appUser, setAppUser] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [allLogs, setAllLogs] = useState([]);
  const [allSchedules, setAllSchedules] = useState([]);
  
  const [activeTab, setActiveTab] = useState('calculator');
// ... existing code ...
    const logsRef = collection(db, 'mounjaroLogs');
    const unsubLogs = onSnapshot(logsRef, (snapshot) => {
      const logs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      logs.sort((a, b) => new Date(b.date) - new Date(a.date));
      setAllLogs(logs);
    }, err => console.error("Fetch logs error:", err));

    const schedulesRef = collection(db, 'mounjaroSchedules');
    const unsubSchedules = onSnapshot(schedulesRef, (snapshot) => {
      const schedules = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAllSchedules(schedules);
    }, err => console.error("Fetch schedules error:", err));

    return () => {
      unsubUsers();
      unsubLogs();
      unsubSchedules();
    };
  }, [firebaseUser]);

  const handleLogin = async (e) => {
// ... existing code ...
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
        {activeTab === 'schedule' && <ScheduleView appUser={appUser} db={db} userSchedule={allSchedules.find(s => s.id === appUser.username)} />}
        {activeTab === 'log' && <LogView appUser={appUser} allLogs={allLogs} />}
        {activeTab === 'admin' && appUser.role === 'admin' && <AdminView usersList={usersList} allLogs={allLogs} allSchedules={allSchedules} />}
      </div>
    </div>
  </div>
);
}
