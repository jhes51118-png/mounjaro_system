const MAX_BODY_BYTES = 50000;

const asFiniteNumber = (value, min, max) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= min && parsed <= max ? parsed : null;
};

const cleanText = (value, maxLength = 180) => typeof value === 'string'
  ? value.replace(/[<>]/g, '').trim().slice(0, maxLength)
  : '';

const cleanStringArray = (value, maxItems = 4, maxLength = 140) => Array.isArray(value)
  ? value.slice(0, maxItems).map(item => cleanText(item, maxLength)).filter(Boolean)
  : [];

const requestCounts = globalThis.__healthAdviceRequestCounts || new Map();
globalThis.__healthAdviceRequestCounts = requestCounts;

const hasUnsafeMedicationAdvice = (value) => /(?:下一劑|改成\s*\d|加到\s*\d|降到\s*\d|(?:建議|應該|可以|自行).{0,12}(?:增加|減少|調高|調低|停用|停藥).{0,8}(?:劑量|藥))/i.test(value || '');

const isRateLimited = (req) => {
  const forwardedFor = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim();
  const requestKey = forwardedFor || req.socket?.remoteAddress || 'unknown';
  const now = Date.now();
  const current = requestCounts.get(requestKey);
  if (!current || now - current.startedAt > 10 * 60 * 1000) {
    requestCounts.set(requestKey, { startedAt: now, count: 1 });
    return false;
  }
  current.count += 1;
  return current.count > 10;
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });
  }

  const contentLength = Number(req.headers['content-length'] || 0);
  if (contentLength > MAX_BODY_BYTES) {
    return res.status(413).json({ error: 'PAYLOAD_TOO_LARGE' });
  }

  const origin = String(req.headers.origin || '');
  const allowedOrigin = origin === 'https://mounjaro-system.vercel.app'
    || origin === 'http://localhost:4173'
    || origin === 'http://127.0.0.1:4173'
    || /^https:\/\/mounjaro-system-[a-z0-9-]+-finn-s-projects16\.vercel\.app$/.test(origin);
  if (origin && !allowedOrigin) {
    return res.status(403).json({ error: 'ORIGIN_NOT_ALLOWED' });
  }
  if (isRateLimited(req)) {
    return res.status(429).json({ error: 'RATE_LIMITED' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(503).json({ error: 'AI_NOT_CONFIGURED' });
  }

  const body = req.body && typeof req.body === 'object' ? req.body : {};
  const profile = body.profile && typeof body.profile === 'object' ? body.profile : {};
  const metrics = body.metrics && typeof body.metrics === 'object' ? body.metrics : {};
  const recentDoses = Array.isArray(body.recentDoses) ? body.recentDoses.slice(0, 12) : [];
  const recentSymptoms = cleanStringArray(body.recentSymptoms, 12, 30);

  const safePayload = {
    profile: {
      age: asFiniteNumber(profile.age, 18, 100),
      heightCm: asFiniteNumber(profile.heightCm, 120, 230)
    },
    metrics: {
      status: cleanText(metrics.status, 30),
      firstWeightKg: asFiniteNumber(metrics.firstWeightKg, 30, 350),
      latestWeightKg: asFiniteNumber(metrics.latestWeightKg, 30, 350),
      totalChangeKg: asFiniteNumber(metrics.totalChangeKg, -200, 200),
      weeklyLossKg: asFiniteNumber(metrics.weeklyLossKg, -20, 20),
      weeklyLossPercent: asFiniteNumber(metrics.weeklyLossPercent, -20, 20),
      bmi: asFiniteNumber(metrics.bmi, 10, 100),
      trendDays: asFiniteNumber(metrics.trendDays, 0, 3650)
    },
    recentDoses: recentDoses.map(item => ({
      date: cleanText(item?.date, 10),
      doseMg: asFiniteNumber(item?.doseMg, 0.1, 30)
    })).filter(item => item.date && item.doseMg !== null),
    recentSymptoms
  };

  if (!safePayload.metrics.latestWeightKg || !safePayload.metrics.status) {
    return res.status(400).json({ error: 'INVALID_INPUT' });
  }

  const prompt = `
你是健康紀錄 App 的支持型文字助理。請使用繁體中文，根據下方已去識別化的資料，提供溫和、具體、非責備式的鼓勵與生活建議。

嚴格安全規則：
1. 不得診斷疾病，不得宣稱劑量造成體重變化。
2. 不得建議開始、停止、增加、減少或分拆 Mounjaro/tirzepatide 劑量，也不得建議特定下一劑；所有藥物調整只能請使用者與開藥醫療人員討論。
3. 不得提供極低熱量飲食、斷食、催吐、瀉藥或快速減重方法。
4. 若趨勢偏快或有嘔吐、腹瀉、胃痛、頭暈，提醒注意補水與進食能力；若症狀持續、嚴重、無法補水或有劇烈腹痛，應儘快聯絡醫療人員。
5. BMI 只稱為成人篩檢值，不做疾病判定。
6. 不要重複輸入數字，不要使用恐嚇語氣。觀察最多 3 點，行動建議最多 3 點。

資料：${JSON.stringify(safePayload)}
`;

  const responseSchema = {
    type: 'OBJECT',
    properties: {
      encouragement: { type: 'STRING' },
      observations: { type: 'ARRAY', items: { type: 'STRING' }, maxItems: 3 },
      suggestions: { type: 'ARRAY', items: { type: 'STRING' }, maxItems: 3 }
    },
    required: ['encouragement', 'observations', 'suggestions']
  };

  try {
    const geminiResponse = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.35,
          maxOutputTokens: 700,
          responseMimeType: 'application/json',
          responseSchema
        }
      })
    });

    if (!geminiResponse.ok) {
      console.error('Gemini request failed:', geminiResponse.status);
      return res.status(502).json({ error: 'AI_UPSTREAM_ERROR' });
    }

    const result = await geminiResponse.json();
    const responseText = result?.candidates?.[0]?.content?.parts?.[0]?.text;
    const parsed = JSON.parse(responseText || '{}');
    const cleanedEncouragement = cleanText(parsed.encouragement, 220);
    const advice = {
      encouragement: hasUnsafeMedicationAdvice(cleanedEncouragement) ? '你願意持續記錄，就是照顧健康很重要的一步。' : cleanedEncouragement,
      observations: cleanStringArray(parsed.observations, 3, 160).filter(item => !hasUnsafeMedicationAdvice(item)),
      suggestions: cleanStringArray(parsed.suggestions, 3, 160).filter(item => !hasUnsafeMedicationAdvice(item))
    };

    if (!advice.encouragement || advice.suggestions.length === 0) {
      return res.status(502).json({ error: 'AI_INVALID_RESPONSE' });
    }

    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json({ advice, model: 'gemini-3.6-flash' });
  } catch (error) {
    console.error('Health advice error:', error);
    return res.status(500).json({ error: 'AI_REQUEST_FAILED' });
  }
}
