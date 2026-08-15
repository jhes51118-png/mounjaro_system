# 猛健樂健康日誌

## Gemini 個人化健康鼓勵

`api/health-advice.js` 使用伺服器端環境變數 `GEMINI_API_KEY` 呼叫 Gemini。請只在 Vercel 專案的 Environment Variables 中設定此金鑰，適用於 Production、Preview 與 Development；不要使用 `VITE_` 前綴，也不要把金鑰寫入前端程式或提交到 Git。

若未設定金鑰，前端仍會顯示本機循證智慧分析；Gemini 個人化按鈕則會清楚說明尚未連接。
