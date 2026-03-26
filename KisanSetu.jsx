import { useState, useEffect, useRef, useCallback } from "react";

/* ─── Terra Design Tokens ───────────────────────────────────────────────────── */
const C = {
  primary: "#4a7c59",
  primaryLight: "#78a886",
  primaryFixed: "#c8e8d0",
  primaryFixedDim: "#8ecf9e",
  onPrimaryFixed: "#002110",
  onPrimaryFixedVariant: "#2a6038",
  bg: "#faf6f0",
  surface: "#faf6f0",
  surfaceContainer: "#f0ece4",
  surfaceContainerLow: "#f5f1ea",
  surfaceContainerHigh: "#eae6de",
  surfaceVariant: "#e4e0d8",
  onSurface: "#2e3230",
  onSurfaceVariant: "#4a4e4a",
  outlineVariant: "#c4c8bc",
  outline: "#74796e",
  tertiary: "#705c30",
  tertiaryFixed: "#f8e0a8",
  tertiaryContainer: "#c4a66a",
  error: "#b83230",
  errorContainer: "#ffdad8",
  onError: "#ffffff",
  secondary: "#6b6358",
  secondaryContainer: "#f0e8db",
};

const SHADOW = "0 4px 20px rgba(46, 50, 48, 0.06)";
const SHADOW_MED = "0 6px 28px rgba(46, 50, 48, 0.10)";

/* ─── Translations ──────────────────────────────────────────────────────────── */
const T = {
  en: {
    greeting: (n) => `Ram Ram, ${n}!`, sub: "Welcome back to your farm's digital companion.",
    tapSpeak: "Tap to speak in English or Hindi", voicePlaceholder: '"Should I water my crops today?"',
    listening: "Listening…", thinking: "Thinking…",
    alertTitle: "High Humidity Alert", alertMsg: "Do not irrigate Paddy today. Check for brown spots on lower leaves.",
    weather: "WEATHER", waterBudget: "Water Budget", soilMoisture: "Soil Moisture",
    pestCheck: "PEST CHECK", scanCrop: "SCAN CROP",
    markets: "MARKETS", soilHealth: "SOIL HEALTH",
    nitrogenOk: "Nitrogen Levels Optimal", viewReport: "View Lab Report",
    community: "Community Updates", upcomingEvent: "Upcoming Event",
    eventTitle: "Village Organic Workshop - Sat 10 AM", eventSub: "Join 12 others from Pune Mandi.",
    home: "Home", voice: "Voice", scan: "Scan", market: "Market",
    hold: "HOLD", sell: "SELL NOW",
    analyzing: "Analyzing leaf…", pestResult: "Diagnosis",
    playVoice: "Play Advisory",
    good: "Good", low: "Low", critical: "Critical",
    getAdvisory: "Get Advisory", loading: "Analyzing farm data…",
    yieldEst: "Yield Estimate", area: "Area (acres)",
  },
  hi: {
    greeting: (n) => `राम राम, ${n}!`, sub: "आपके खेत के डिजिटल साथी में वापस स्वागत है।",
    tapSpeak: "हिंदी या मराठी में बोलें", voicePlaceholder: '"क्या आज सिंचाई करनी चाहिए?"',
    listening: "सुन रहा हूं…", thinking: "सोच रहा हूं…",
    alertTitle: "उच्च आर्द्रता चेतावनी", alertMsg: "आज धान की सिंचाई न करें। निचली पत्तियों पर भूरे धब्बे देखें।",
    weather: "मौसम", waterBudget: "पानी बजट", soilMoisture: "मिट्टी नमी",
    pestCheck: "कीट जांच", scanCrop: "फसल स्कैन",
    markets: "मंडी", soilHealth: "मिट्टी स्वास्थ्य",
    nitrogenOk: "नाइट्रोजन स्तर उचित", viewReport: "रिपोर्ट देखें",
    community: "सामुदायिक अपडेट", upcomingEvent: "आगामी कार्यक्रम",
    eventTitle: "गांव जैविक कार्यशाला - शनि 10 बजे", eventSub: "पुणे मंडी के 12 अन्य किसानों से जुड़ें।",
    home: "होम", voice: "आवाज़", scan: "स्कैन", market: "मंडी",
    hold: "रोकें", sell: "अभी बेचें",
    analyzing: "पत्ती जांच रहे हैं…", pestResult: "निदान",
    playVoice: "सलाह सुनें",
    good: "अच्छा", low: "कम", critical: "गंभीर",
    getAdvisory: "सलाह लें", loading: "खेत डेटा विश्लेषण…",
    yieldEst: "उपज अनुमान", area: "क्षेत्र (एकड़)",
  },
  mr: {
    greeting: (n) => `राम राम, ${n}!`, sub: "तुमच्या शेताच्या डिजिटल साथीमध्ये परत स्वागत आहे।",
    tapSpeak: "मराठी किंवा हिंदीत बोला", voicePlaceholder: '"आज पाणी द्यायचे का?"',
    listening: "ऐकत आहे…", thinking: "विचार करत आहे…",
    alertTitle: "उच्च आर्द्रता इशारा", alertMsg: "आज भात सिंचन करू नका. खालच्या पानांवर तपकिरी डाग तपासा.",
    weather: "हवामान", waterBudget: "पाणी बजेट", soilMoisture: "माती ओलावा",
    pestCheck: "कीड तपासणी", scanCrop: "पीक स्कॅन",
    markets: "मंडी", soilHealth: "माती आरोग्य",
    nitrogenOk: "नायट्रोजन पातळी योग्य", viewReport: "अहवाल पहा",
    community: "समुदाय अपडेट", upcomingEvent: "येणारा कार्यक्रम",
    eventTitle: "गाव सेंद्रिय कार्यशाळा - शनि सकाळी 10", eventSub: "पुणे मंडीतील 12 इतर शेतकऱ्यांसोबत या.",
    home: "होम", voice: "आवाज", scan: "स्कॅन", market: "मंडी",
    hold: "थांबा", sell: "आत्ता विका",
    analyzing: "पान तपासत आहे…", pestResult: "निदान",
    playVoice: "सल्ला ऐका",
    good: "चांगले", low: "कमी", critical: "गंभीर",
    getAdvisory: "सल्ला घ्या", loading: "शेत डेटा विश्लेषण…",
    yieldEst: "उत्पन्न अंदाज", area: "क्षेत्र (एकर)",
  },
  kn: {
    greeting: (n) => `ನಮಸ್ಕಾರ, ${n}!`, sub: "ನಿಮ್ಮ ಜಮೀನಿನ ಡಿಜಿಟಲ್ ಸಂಗಾತಿಗೆ ಮರಳಿ ಸ್ವಾಗತ.",
    tapSpeak: "ಕನ್ನಡ ಅಥವಾ ಹಿಂದಿಯಲ್ಲಿ ಮಾತನಾಡಿ", voicePlaceholder: '"ಇಂದು ನೀರು ಹಾಕಬೇಕೇ?"',
    listening: "ಕೇಳುತ್ತಿದ್ದೇನೆ…", thinking: "ಯೋಚಿಸುತ್ತಿದ್ದೇನೆ…",
    alertTitle: "ಹೆಚ್ಚಿನ ಆರ್ದ್ರತೆ ಎಚ್ಚರಿಕೆ", alertMsg: "ಇಂದು ಭತ್ತಕ್ಕೆ ನೀರು ಹಾಕಬೇಡಿ. ಕೆಳಗಿನ ಎಲೆಗಳಲ್ಲಿ ಕಂದು ಕಲೆ ಪರೀಕ್ಷಿಸಿ.",
    weather: "ಹವಾಮಾನ", waterBudget: "ನೀರಿನ ಬಜೆಟ್", soilMoisture: "ಮಣ್ಣಿನ ತೇವ",
    pestCheck: "ಕೀಟ ತಪಾಸಣೆ", scanCrop: "ಬೆಳೆ ಸ್ಕ್ಯಾನ್",
    markets: "ಮಂಡಿ", soilHealth: "ಮಣ್ಣಿನ ಆರೋಗ್ಯ",
    nitrogenOk: "ಸಾರಜನಕ ಮಟ್ಟ ಸರಿಯಾಗಿದೆ", viewReport: "ವರದಿ ನೋಡಿ",
    community: "ಸಮುದಾಯ ಅಪ್‌ಡೇಟ್", upcomingEvent: "ಮುಂಬರುವ ಕಾರ್ಯಕ್ರಮ",
    eventTitle: "ಗ್ರಾಮ ಸಾವಯವ ಕಾರ್ಯಾಗಾರ - ಶನಿ ಬೆಳಿಗ್ಗೆ 10", eventSub: "ಪುಣೆ ಮಂಡಿಯ 12 ರೈತರೊಂದಿಗೆ ಸೇರಿ.",
    home: "ಹೋಮ್", voice: "ಧ್ವನಿ", scan: "ಸ್ಕ್ಯಾನ್", market: "ಮಂಡಿ",
    hold: "ಕಾಯಿರಿ", sell: "ಈಗ ಮಾರಿ",
    analyzing: "ಎಲೆ ಪರೀಕ್ಷಿಸುತ್ತಿದ್ದೇನೆ…", pestResult: "ರೋಗನಿರ್ಣಯ",
    playVoice: "ಸಲಹೆ ಕೇಳಿ",
    good: "ಉತ್ತಮ", low: "ಕಡಿಮೆ", critical: "ತೀವ್ರ",
    getAdvisory: "ಸಲಹೆ ಪಡೆಯಿರಿ", loading: "ಜಮೀನು ಡೇಟಾ ವಿಶ್ಲೇಷಣೆ…",
    yieldEst: "ಇಳುವರಿ ಅಂದಾಜು", area: "ಪ್ರದೇಶ (ಎಕರೆ)",
  },
};

const LANG_VOICES = { en: "en-IN", hi: "hi-IN", mr: "mr-IN", kn: "kn-IN" };
const LANG_LABELS = { en: "A", hi: "अ", mr: "अ", kn: "ಅ" };
const CROPS = ["Paddy", "Wheat", "Cotton", "Onion", "Tomato", "Soybean", "Sugarcane", "Maize"];
const MANDI_DATA = {
  Paddy:     { price: 2180, msp: 2183, trend: "stable", forecast: 2240, action: "hold", gain: 60 },
  Wheat:     { price: 2310, msp: 2275, trend: "up",     forecast: 2380, action: "hold", gain: 70 },
  Cotton:    { price: 6720, msp: 6620, trend: "down",   forecast: 6500, action: "sell", gain: 0  },
  Onion:     { price: 1500, msp: 800,  trend: "up",     forecast: 1700, action: "hold", gain: 200},
  Tomato:    { price: 820,  msp: 600,  trend: "up",     forecast: 1100, action: "hold", gain: 280},
  Soybean:   { price: 4180, msp: 4600, trend: "down",   forecast: 4050, action: "sell", gain: 0  },
  Sugarcane: { price: 3150, msp: 3050, trend: "stable", forecast: 3200, action: "hold", gain: 50 },
  Maize:     { price: 1870, msp: 1870, trend: "up",     forecast: 1920, action: "hold", gain: 50 },
};
const W = { temp: 21, humidity: 76, rain: 68, ndvi: 0.61, soilMoisture: 58, soilStatus: "good" };

/* ─── Claude API helper ──────────────────────────────────────────────────────── */
async function askClaude(system, user, imageB64 = null) {
  const content = imageB64
    ? [{ type: "image", source: { type: "base64", media_type: "image/jpeg", data: imageB64 } }, { type: "text", text: user }]
    : user;
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000, system, messages: [{ role: "user", content }] }),
  });
  const d = await res.json();
  return d.content?.[0]?.text ?? "Error";
}

/* ─── Icons (inline SVG) ────────────────────────────────────────────────────── */
const Icon = {
  home: <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>,
  mic:  <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/></svg>,
  cam:  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 15.2A3.2 3.2 0 1 0 12 8.8a3.2 3.2 0 0 0 0 6.4zM9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/></svg>,
  mkt:  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59L5.25 14c-.16.28-.25.61-.25.96C5 16.1 5.9 17 7 17h14v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 5H5.21l-.94-2H1z"/></svg>,
  drop: <svg width="18" height="18" viewBox="0 0 24 24" fill="#3a86c4"><path d="M12 2c-5.33 4.55-8 8.48-8 11.8 0 4.98 3.8 8.2 8 8.2s8-3.22 8-8.2C20 10.48 17.33 6.55 12 2z"/></svg>,
  bug:  <svg width="18" height="18" viewBox="0 0 24 24" fill={C.tertiary}><path d="M20 8h-2.81c-.45-.78-1.07-1.45-1.82-1.96L17 4.41 15.59 3l-2.17 2.17C13 5.06 12.5 5 12 5s-1 .06-1.41.17L8.41 3 7 4.41l1.62 1.63C7.88 6.55 7.26 7.22 6.81 8H4v2h2.09c-.05.33-.09.66-.09 1v1H4v2h2v1c0 .34.04.67.09 1H4v2h2.81c1.04 1.79 2.97 3 5.19 3s4.15-1.21 5.19-3H20v-2h-2.09c.05-.33.09-.66.09-1v-1h2v-2h-2v-1c0-.34-.04-.67-.09-1H20V8zm-6 8h-4v-2h4v2zm0-4h-4v-2h4v2z"/></svg>,
  plant:<svg width="18" height="18" viewBox="0 0 24 24" fill={C.primary}><path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20C19 20 22 3 22 3c-1 2-8 2-8 2 2 0 4 2 4 4s-2 4-4 4-4-2-4-4c0-4 4-4 4-4-2 0-4 2-4 4 0 2.46 1.62 4.47 3.83 5.23L6 20H4v-2H2v4h20S18 6 8 8z"/></svg>,
  trend:{ up: <svg width="16" height="16" viewBox="0 0 24 24" fill={C.primary}><path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/></svg>, down: <svg width="16" height="16" viewBox="0 0 24 24" fill={C.error}><path d="M16 18l2.29-2.29-4.88-4.88-4 4L2 7.41 3.41 6l6 6 4-4 6.3 6.29L22 12v6z"/></svg>, stable: <svg width="16" height="16" viewBox="0 0 24 24" fill={C.tertiary}><path d="M22 12l-4-4v3H3v2h15v3z"/></svg> },
  check:<svg width="16" height="16" viewBox="0 0 24 24" fill={C.primary}><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>,
  warn: <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>,
  lang: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12.87 15.07l-2.54-2.51.03-.03A17.52 17.52 0 0 0 14.07 6H17V4h-7V2H8v2H1v2h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z"/></svg>,
  vol:  <svg width="18" height="18" viewBox="0 0 24 24" fill={C.primary}><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>,
};

/* ─── Sub-components ─────────────────────────────────────────────────────────── */
function Card({ children, style = {}, onClick }) {
  return (
    <div onClick={onClick} style={{
      background: C.surfaceContainer, borderRadius: 16,
      padding: 20, boxShadow: SHADOW,
      border: `1px solid ${C.outlineVariant}40`,
      cursor: onClick ? "pointer" : "default",
      ...style,
    }}>{children}</div>
  );
}

function PillBtn({ label, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      padding: "6px 14px", borderRadius: 999, fontSize: 12, fontWeight: 700,
      fontFamily: "Nunito Sans, sans-serif", cursor: "pointer", whiteSpace: "nowrap",
      border: active ? "none" : `1px solid ${C.outlineVariant}`,
      background: active ? C.primary : "transparent",
      color: active ? "white" : C.onSurfaceVariant,
      transition: "all .18s",
    }}>{label}</button>
  );
}

/* ─── Main App ───────────────────────────────────────────────────────────────── */
export default function KisanSetu() {
  const [lang, setLang] = useState("hi");
  const [tab, setTab] = useState("home");
  const [crop, setCrop] = useState("Paddy");
  const [listening, setListening] = useState(false);
  const [voiceText, setVoiceText] = useState("");
  const [advisory, setAdvisory] = useState("");
  const [advisoryLoading, setAdvisoryLoading] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [pestImg, setPestImg] = useState(null);
  const [pestResult, setPestResult] = useState("");
  const [pestLoading, setPestLoading] = useState(false);
  const [yieldResult, setYieldResult] = useState("");
  const [yieldLoading, setYieldLoading] = useState(false);
  const [area, setArea] = useState("2");
  const fileRef = useRef();
  const t = T[lang];
  const mandi = MANDI_DATA[crop];

  const langName = { en: "English", hi: "Hindi", mr: "Marathi", kn: "Kannada" }[lang];

  /* ── TTS ── */
  const speak = useCallback((text) => {
    if (!text || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = LANG_VOICES[lang]; u.rate = 0.88;
    u.onstart = () => setSpeaking(true);
    u.onend = () => setSpeaking(false);
    window.speechSynthesis.speak(u);
  }, [lang]);

  /* ── STT ── */
  const startListening = useCallback(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { alert("Speech not supported in this browser."); return; }
    const rec = new SR();
    rec.lang = LANG_VOICES[lang];
    rec.onstart = () => { setListening(true); setVoiceText(t.listening); };
    rec.onend = () => setListening(false);
    rec.onresult = async (e) => {
      const q = e.results[0][0].transcript;
      setVoiceText(`"${q}"`);
      setVoiceText(t.thinking);
      setAdvisoryLoading(true);
      const sys = `You are an expert Indian agricultural extension officer. Respond in ${langName}. Be concise (2–3 sentences). No markdown. Give: main risk, immediate action, preventive measure.`;
      const userMsg = `Farmer asked: "${q}". Crop: ${crop}. Weather: ${W.temp}°C, ${W.humidity}% humidity. NDVI: ${W.ndvi}. Soil moisture: ${W.soilMoisture}%. Give actionable advisory.`;
      const result = await askClaude(sys, userMsg);
      setAdvisory(result); setAdvisoryLoading(false);
      setVoiceText(`"${q}"`);
      setTab("voice");
      speak(result);
    };
    rec.onerror = (e) => { setListening(false); setVoiceText(`Error: ${e.error}. Tap to retry.`); };
    rec.start();
  }, [lang, crop, t, speak, langName]);

  /* ── Advisory ── */
  const getAdvisory = useCallback(async () => {
    setAdvisoryLoading(true); setAdvisory("");
    const sys = `You are an expert Indian agricultural extension officer. Respond in ${langName}. Max 3 sentences. No markdown. Include: 1) main risk/condition 2) immediate action 3) preventive measure. Be specific, practical.`;
    const msg = `Crop: ${crop}. Temp: ${W.temp}°C, Humidity: ${W.humidity}%, Rain chance: ${W.rain}%, NDVI: ${W.ndvi}, Soil moisture: ${W.soilMoisture}%. Give today's actionable advisory.`;
    const r = await askClaude(sys, msg);
    setAdvisory(r); setAdvisoryLoading(false);
    speak(r);
  }, [lang, crop, speak, langName]);

  /* ── Pest ID ── */
  const handlePestPhoto = async (e) => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const b64 = ev.target.result.split(",")[1];
      setPestImg(ev.target.result); setPestResult(""); setPestLoading(true);
      const sys = `You are a plant pathologist specializing in Indian crops. Respond in ${langName}. Give: Disease/Pest name, Severity (Low/Medium/High), Immediate action (1 sentence), Chemical treatment with dose. Under 60 words. No markdown.`;
      const r = await askClaude(sys, "Diagnose the disease or pest on this crop leaf and provide treatment advice.", b64);
      setPestResult(r); setPestLoading(false);
    };
    reader.readAsDataURL(file);
  };

  /* ── Yield ── */
  const estimateYield = async () => {
    setYieldLoading(true); setYieldResult("");
    const sys = `You are an agronomist. Respond in ${langName}. Give realistic yield estimate in quintals/acre and total. Include 1 improvement tip. Under 50 words. No markdown.`;
    const r = await askClaude(sys, `Crop: ${crop}. Area: ${area} acres. NDVI: ${W.ndvi}. Soil moisture: ${W.soilMoisture}%. Current Deccan/peninsular India season conditions.`);
    setYieldResult(r); setYieldLoading(false);
  };

  const soilBarPct = { good: "82%", low: "40%", critical: "15%" }[W.soilStatus];
  const soilBarColor = { good: C.primary, low: "#d4a017", critical: C.error }[W.soilStatus];

  /* ── Render ── */
  return (
    <div style={{ fontFamily: "'Nunito Sans', sans-serif", background: C.bg, minHeight: "100vh", maxWidth: 480, margin: "0 auto", color: C.onSurface, paddingBottom: 80 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Literata:ital,opsz,wght@0,7..72,400;0,7..72,700;0,7..72,900;1,7..72,400&family=Nunito+Sans:wght@400;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { display: none; }
        @keyframes micPulse {
          0%   { transform: scale(0.96); box-shadow: 0 0 0 0 rgba(74,124,89,.55); }
          70%  { transform: scale(1);    box-shadow: 0 0 0 18px rgba(74,124,89,0); }
          100% { transform: scale(0.96); box-shadow: 0 0 0 0 rgba(74,124,89,0); }
        }
        @keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        .mic-anim { animation: micPulse 2s infinite; }
        .fade-up { animation: fadeUp .35s ease both; }
        .mic-listen { animation: micPulse .6s infinite !important; }
      `}</style>

      {/* ── TOP APP BAR ── */}
      <header style={{ position: "sticky", top: 0, zIndex: 100, background: `${C.bg}f4`, backdropFilter: "blur(12px)", borderBottom: `1px solid ${C.outlineVariant}60`, padding: "0 16px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {/* Left: logo + location */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ background: `${C.primary}18`, borderRadius: 999, padding: "6px 8px", display: "flex" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill={C.primary}><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
          </div>
          <div>
            <div style={{ fontFamily: "Literata, serif", fontWeight: 900, fontSize: 20, color: C.primary, lineHeight: 1 }}>KisanSetu</div>
            <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: 1.2, color: C.outline, textTransform: "uppercase" }}>PUNE, MAHARASHTRA</div>
          </div>
        </div>
        {/* Right: lang + avatar */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* Lang */}
          <div style={{ display: "flex", gap: 3 }}>
            {Object.entries(LANG_LABELS).map(([k, v]) => (
              <button key={k} onClick={() => setLang(k)} title={k} style={{
                width: 30, height: 30, borderRadius: "50%", border: lang === k ? `2px solid ${C.primary}` : `1px solid ${C.outlineVariant}`,
                background: lang === k ? C.primaryFixed : "transparent", color: lang === k ? C.onPrimaryFixedVariant : C.outline,
                fontWeight: 800, fontSize: 13, cursor: "pointer", fontFamily: "inherit", transition: "all .15s",
              }}>{v}</button>
            ))}
          </div>
          {/* Avatar */}
          <div style={{ width: 38, height: 38, borderRadius: "50%", border: `2px solid ${C.primaryFixed}`, background: C.surfaceVariant, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>
            👨‍🌾
          </div>
        </div>
      </header>

      <main style={{ padding: "0 16px" }}>

        {/* ── HOME TAB ── */}
        {tab === "home" && (
          <div className="fade-up">
            {/* Greeting */}
            <section style={{ marginTop: 20, marginBottom: 20 }}>
              <h1 style={{ fontFamily: "Literata, serif", fontSize: 26, fontWeight: 900, color: C.onSurface, lineHeight: 1.2 }}>{t.greeting("Ramesh")}</h1>
              <p style={{ fontSize: 13, color: C.onSurfaceVariant, marginTop: 4, lineHeight: 1.5 }}>{t.sub}</p>
            </section>

            {/* ── Voice Hero ── */}
            <section style={{ position: "relative", overflow: "hidden", borderRadius: 20, background: C.primaryFixed, padding: "36px 24px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", marginBottom: 16, boxShadow: SHADOW }}>
              {/* Wheat watermark */}
              <svg style={{ position: "absolute", right: -20, bottom: -20, opacity: .08 }} width="180" height="180" viewBox="0 0 100 100" fill={C.onPrimaryFixedVariant}>
                <ellipse cx="50" cy="80" rx="4" ry="20"/>
                <ellipse cx="50" cy="55" rx="10" ry="14" transform="rotate(-20 50 55)"/>
                <ellipse cx="50" cy="55" rx="10" ry="14" transform="rotate(20 50 55)"/>
                <ellipse cx="50" cy="38" rx="9" ry="13" transform="rotate(-25 50 38)"/>
                <ellipse cx="50" cy="38" rx="9" ry="13" transform="rotate(25 50 38)"/>
                <ellipse cx="50" cy="23" rx="7" ry="11" transform="rotate(-15 50 23)"/>
                <ellipse cx="50" cy="23" rx="7" ry="11" transform="rotate(15 50 23)"/>
              </svg>

              {/* Mic */}
              <button
                onClick={() => { startListening(); setTab("voice"); }}
                className={listening ? "mic-listen" : "mic-anim"}
                style={{ width: 88, height: 88, borderRadius: "50%", background: C.primary, color: "white", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20, flexShrink: 0 }}
              >{Icon.mic}</button>
              <h2 style={{ fontFamily: "Literata, serif", fontWeight: 700, fontSize: 17, color: C.onPrimaryFixedVariant, marginBottom: 12 }}>{t.tapSpeak}</h2>
              <div style={{ background: "rgba(255,255,255,.65)", backdropFilter: "blur(6px)", padding: "9px 20px", borderRadius: 999, fontSize: 13, color: C.primary, fontStyle: "italic", border: `1px solid ${C.primary}20`, maxWidth: 280 }}>
                {listening ? t.listening : (voiceText || t.voicePlaceholder)}
              </div>
            </section>

            {/* ── Alert Banner ── */}
            <section style={{ background: C.errorContainer, border: `1.5px solid ${C.error}30`, borderRadius: 16, padding: "14px 16px", display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 16 }}>
              <div style={{ background: C.error, borderRadius: 10, padding: "6px 8px", display: "flex", flexShrink: 0 }}>{Icon.warn}</div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 13, color: C.onSurface }}>{t.alertTitle}</div>
                <div style={{ fontSize: 12, color: C.onSurfaceVariant, marginTop: 3, lineHeight: 1.5 }}>{t.alertMsg}</div>
              </div>
            </section>

            {/* ── Crop selector ── */}
            <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4, marginBottom: 14 }}>
              {CROPS.map((c) => <PillBtn key={c} label={c} active={crop === c} onClick={() => setCrop(c)} />)}
            </div>

            {/* ── 2×2 Grid ── */}
            <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>

              {/* Weather card */}
              <Card style={{ aspectRatio: "1", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: 1.2, color: C.outline, textTransform: "uppercase", marginBottom: 4 }}>{t.weather}</div>
                    <div style={{ fontFamily: "Literata, serif", fontSize: 28, fontWeight: 900, color: C.onSurface }}>{W.temp}°C</div>
                  </div>
                  <div style={{ marginTop: 2 }}>{Icon.drop}</div>
                </div>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, fontWeight: 700, marginBottom: 5 }}>
                    <span style={{ color: C.onSurfaceVariant }}>{t.soilMoisture}</span>
                    <span style={{ color: C.primary }}>{t.good}</span>
                  </div>
                  <div style={{ height: 6, background: C.outlineVariant, borderRadius: 99, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: soilBarPct, background: soilBarColor, borderRadius: 99, transition: "width .7s" }} />
                  </div>
                  <div style={{ fontSize: 10, color: C.outline, marginTop: 5, fontStyle: "italic" }}>Humidity at {W.humidity}%</div>
                </div>
              </Card>

              {/* Pest Check card */}
              <Card style={{ aspectRatio: "1", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: 1.2, color: C.outline, textTransform: "uppercase" }}>{t.pestCheck}</div>
                  <div>{Icon.bug}</div>
                </div>
                <input ref={fileRef} type="file" accept="image/*" capture="environment" style={{ display: "none" }} onChange={handlePestPhoto} />
                <button onClick={() => { fileRef.current?.click(); setTab("scan"); }} style={{ background: C.tertiary, color: "white", border: "none", borderRadius: 12, padding: "12px 0", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontWeight: 800, fontSize: 12, fontFamily: "inherit" }}>
                  {Icon.cam} {t.scanCrop}
                </button>
              </Card>

              {/* Markets card */}
              <Card style={{ aspectRatio: "1", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: 1.2, color: C.outline, textTransform: "uppercase", marginBottom: 4 }}>{t.markets}</div>
                    <div style={{ fontSize: 11, color: C.onSurfaceVariant }}>{crop} (Nashik)</div>
                  </div>
                  <div style={{ marginTop: 4 }}>{Icon.trend[mandi.trend]}</div>
                </div>
                <div>
                  <div style={{ fontFamily: "Literata, serif", fontSize: 22, fontWeight: 900, color: C.onSurface }}>₹{mandi.price.toLocaleString("en-IN")}/qtl</div>
                  <button onClick={() => setTab("market")} style={{ marginTop: 10, background: mandi.action === "sell" ? C.error : C.primary, color: "white", border: "none", borderRadius: 999, padding: "7px 18px", fontSize: 12, fontWeight: 900, cursor: "pointer", fontFamily: "inherit" }}>
                    {mandi.action === "sell" ? t.sell : t.hold}
                  </button>
                </div>
              </Card>

              {/* Soil Health card */}
              <Card style={{ aspectRatio: "1", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: 1.2, color: C.outline, textTransform: "uppercase" }}>{t.soilHealth}</div>
                  {Icon.plant}
                </div>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    {Icon.check}
                    <span style={{ fontSize: 12, fontWeight: 600, color: C.onSurface }}>{t.nitrogenOk}</span>
                  </div>
                  <span style={{ fontSize: 12, color: C.primary, textDecoration: "underline", cursor: "pointer", fontWeight: 700 }}>{t.viewReport}</span>
                </div>
              </Card>
            </section>

            {/* ── Community ── */}
            <section style={{ marginBottom: 24 }}>
              <h2 style={{ fontFamily: "Literata, serif", fontSize: 20, fontWeight: 800, marginBottom: 14 }}>{t.community}</h2>
              <Card style={{ padding: 0, overflow: "hidden" }}>
                {/* Illustration placeholder */}
                <div style={{ background: `linear-gradient(135deg, ${C.primaryFixed}, ${C.secondaryContainer})`, height: 140, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 56 }}>
                  👨‍🌾👩‍🌾👨‍🌾
                </div>
                <div style={{ padding: 16 }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: C.tertiary, textTransform: "uppercase", letterSpacing: 0.8 }}>{t.upcomingEvent}</div>
                  <div style={{ fontFamily: "Literata, serif", fontWeight: 700, fontSize: 15, color: C.onSurface, marginTop: 4 }}>{t.eventTitle}</div>
                  <div style={{ fontSize: 12, color: C.onSurfaceVariant, marginTop: 4 }}>{t.eventSub}</div>
                </div>
              </Card>
            </section>
          </div>
        )}

        {/* ── VOICE / ADVISORY TAB ── */}
        {tab === "voice" && (
          <div className="fade-up" style={{ paddingTop: 20 }}>
            <h2 style={{ fontFamily: "Literata, serif", fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Voice Advisory</h2>
            <p style={{ fontSize: 13, color: C.onSurfaceVariant, marginBottom: 20 }}>Speak your question or get an instant advisory.</p>

            {/* Mic card */}
            <section style={{ background: C.primaryFixed, borderRadius: 20, padding: "32px 24px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", marginBottom: 16, boxShadow: SHADOW }}>
              <button onClick={startListening} className={listening ? "mic-listen" : "mic-anim"} style={{ width: 96, height: 96, borderRadius: "50%", background: C.primary, color: "white", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>{Icon.mic}</button>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.onPrimaryFixedVariant, marginBottom: 10 }}>{listening ? t.listening : t.tapSpeak}</div>
              <div style={{ background: "rgba(255,255,255,.7)", padding: "8px 18px", borderRadius: 999, fontSize: 13, color: C.primary, fontStyle: "italic", border: `1px solid ${C.primary}20` }}>
                {voiceText || t.voicePlaceholder}
              </div>
            </section>

            {/* Crop selector */}
            <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4, marginBottom: 12 }}>
              {CROPS.map((c) => <PillBtn key={c} label={c} active={crop === c} onClick={() => setCrop(c)} />)}
            </div>

            {/* Get advisory btn */}
            <button onClick={getAdvisory} disabled={advisoryLoading} style={{ width: "100%", background: advisoryLoading ? C.primaryLight : C.primary, color: "white", border: "none", borderRadius: 14, padding: "15px", fontSize: 15, fontWeight: 800, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 16, transition: "background .2s" }}>
              {advisoryLoading ? <span style={{ display: "inline-block", animation: "spin 1s linear infinite", fontSize: 18 }}>🔄</span> : "🌾"}
              {advisoryLoading ? t.loading : t.getAdvisory}
            </button>

            {advisory && (
              <Card style={{ background: C.surfaceContainerLow, animation: "fadeUp .35s ease" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: C.primary, textTransform: "uppercase", letterSpacing: 1 }}>📋 Today's Advisory</div>
                  <button onClick={() => speak(advisory)} style={{ background: speaking ? `${C.primary}22` : `${C.primary}11`, border: `1px solid ${C.primary}40`, color: C.primary, borderRadius: 999, padding: "5px 12px", fontSize: 11, cursor: "pointer", fontWeight: 800, display: "flex", alignItems: "center", gap: 5, fontFamily: "inherit" }}>
                    {Icon.vol} {speaking ? "Playing…" : t.playVoice}
                  </button>
                </div>
                <p style={{ fontSize: 15, lineHeight: 1.7, color: C.onSurface }}>{advisory}</p>
              </Card>
            )}
          </div>
        )}

        {/* ── SCAN / PEST ID TAB ── */}
        {tab === "scan" && (
          <div className="fade-up" style={{ paddingTop: 20 }}>
            <h2 style={{ fontFamily: "Literata, serif", fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Pest & Disease Scan</h2>
            <p style={{ fontSize: 13, color: C.onSurfaceVariant, marginBottom: 20 }}>Take a photo of a leaf to get an AI diagnosis.</p>

            <input ref={fileRef} type="file" accept="image/*" capture="environment" style={{ display: "none" }} onChange={handlePestPhoto} />
            <button onClick={() => fileRef.current?.click()} style={{ width: "100%", background: C.surfaceContainer, border: `2px dashed ${C.outlineVariant}`, borderRadius: 16, padding: "36px 24px", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div style={{ background: `${C.tertiary}18`, borderRadius: 999, padding: 18, fontSize: 28, lineHeight: 1 }}>📷</div>
              <span style={{ fontWeight: 800, fontSize: 15, color: C.onSurface }}>Take / Upload Leaf Photo</span>
              <span style={{ fontSize: 12, color: C.outline }}>Tap to open camera or gallery</span>
            </button>

            {pestImg && (
              <div className="fade-up">
                <img src={pestImg} alt="leaf" style={{ width: "100%", borderRadius: 16, maxHeight: 240, objectFit: "cover", marginBottom: 14, border: `1px solid ${C.outlineVariant}` }} />
                {pestLoading ? (
                  <Card style={{ textAlign: "center", padding: 24 }}>
                    <div style={{ fontSize: 32, animation: "spin 1.2s linear infinite", display: "inline-block" }}>🔬</div>
                    <div style={{ marginTop: 10, fontWeight: 600, color: C.onSurfaceVariant }}>{t.analyzing}</div>
                  </Card>
                ) : pestResult ? (
                  <Card style={{ animation: "fadeUp .35s ease" }}>
                    <div style={{ fontSize: 11, fontWeight: 800, color: C.tertiary, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>🧫 {t.pestResult}</div>
                    <p style={{ fontSize: 15, lineHeight: 1.7, color: C.onSurface }}>{pestResult}</p>
                    <button onClick={() => speak(pestResult)} style={{ marginTop: 14, background: `${C.primary}12`, border: `1px solid ${C.primary}30`, color: C.primary, borderRadius: 999, padding: "7px 16px", fontSize: 12, cursor: "pointer", fontWeight: 800, display: "flex", alignItems: "center", gap: 6, fontFamily: "inherit" }}>
                      {Icon.vol} {t.playVoice}
                    </button>
                  </Card>
                ) : null}
              </div>
            )}

            {/* Quick reference */}
            <div style={{ marginTop: 20 }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: C.outline, textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>Common Issues — {crop}</div>
              {[
                { d: "Blast Disease", s: "🟠", sev: "HIGH", treat: "0.5% Copper fungicide" },
                { d: "Brown Plant Hopper", s: "🔴", sev: "MEDIUM", treat: "Imidacloprid 0.3ml/L" },
                { d: "Sheath Blight", s: "🟡", sev: "LOW", treat: "Validamycin 0.1%" },
              ].map((item) => (
                <Card key={item.d} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", marginBottom: 8 }}>
                  <span style={{ fontSize: 20 }}>{item.s}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 13 }}>{item.d}</div>
                    <div style={{ fontSize: 11, color: C.outline, marginTop: 2 }}>💊 {item.treat}</div>
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 800, color: item.sev === "HIGH" ? C.error : item.sev === "MEDIUM" ? C.tertiary : C.primary, background: item.sev === "HIGH" ? `${C.error}18` : `${C.primary}10`, padding: "3px 9px", borderRadius: 999 }}>{item.sev}</span>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* ── MARKET TAB ── */}
        {tab === "market" && (
          <div className="fade-up" style={{ paddingTop: 20 }}>
            <h2 style={{ fontFamily: "Literata, serif", fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Market & Yield</h2>
            <p style={{ fontSize: 13, color: C.onSurfaceVariant, marginBottom: 16 }}>Mandi prices, sell/hold advice, and yield estimator.</p>

            <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4, marginBottom: 16 }}>
              {CROPS.map((c) => <PillBtn key={c} label={c} active={crop === c} onClick={() => setCrop(c)} />)}
            </div>

            {/* Price card */}
            <Card style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 1, color: C.outline, textTransform: "uppercase" }}>{crop} · Local Mandi</div>
                  <div style={{ fontFamily: "Literata, serif", fontSize: 32, fontWeight: 900, color: C.onSurface, marginTop: 4 }}>₹{mandi.price.toLocaleString("en-IN")}<span style={{ fontSize: 14, fontWeight: 600, color: C.outline }}>/qtl</span></div>
                </div>
                <div style={{ marginTop: 6 }}>{Icon.trend[mandi.trend]}</div>
              </div>
              <div style={{ display: "flex", gap: 16, fontSize: 12, color: C.onSurfaceVariant, marginBottom: 14 }}>
                <span>MSP: ₹{mandi.msp}</span>
                <span>7-day forecast: ₹{mandi.forecast}</span>
              </div>
              {mandi.action === "sell" ? (
                <div style={{ background: `${C.error}12`, border: `1px solid ${C.error}30`, borderRadius: 12, padding: "14px 16px", textAlign: "center" }}>
                  <div style={{ fontSize: 18, fontWeight: 900, color: C.error }}>✅ {t.sell}</div>
                  <div style={{ fontSize: 12, color: C.onSurfaceVariant, marginTop: 4 }}>Price likely to fall — sell within 2 days</div>
                </div>
              ) : (
                <div style={{ background: `${C.primary}10`, border: `1px solid ${C.primary}30`, borderRadius: 12, padding: "14px 16px", textAlign: "center" }}>
                  <div style={{ fontSize: 18, fontWeight: 900, color: C.primary }}>⏳ {t.hold} — +₹{mandi.gain}/qtl in {mandi.price < mandi.forecast ? "7" : "5"} days</div>
                  <div style={{ fontSize: 12, color: C.onSurfaceVariant, marginTop: 4 }}>Forecasted rise — holding recommended</div>
                </div>
              )}
            </Card>

            {/* Nearby mandis */}
            <Card style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: C.outline, textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>Nearby Mandis (₹/qtl)</div>
              {[["APMC Pune", -40], ["Hubli", +80], ["Davangere", -10], ["Solapur", +120]].map(([name, delta]) => (
                <div key={name} style={{ display: "flex", justifyContent: "space-between", padding: "9px 0", borderBottom: `1px solid ${C.outlineVariant}50`, fontSize: 13 }}>
                  <span style={{ color: C.onSurfaceVariant }}>{name}</span>
                  <span style={{ fontWeight: 800, color: delta > 0 ? C.primary : C.error }}>₹{(mandi.price + delta).toLocaleString("en-IN")} {delta > 0 ? "↑" : "↓"}</span>
                </div>
              ))}
            </Card>

            {/* Yield estimator */}
            <Card>
              <div style={{ fontSize: 11, fontWeight: 800, color: C.outline, textTransform: "uppercase", letterSpacing: 1, marginBottom: 14 }}>🌾 {t.yieldEst}</div>
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: C.onSurfaceVariant, marginBottom: 8 }}>{t.area}</div>
                <div style={{ display: "flex", gap: 8 }}>
                  {["0.5","1","2","5","10"].map((v) => (
                    <button key={v} onClick={() => setArea(v)} style={{ flex: 1, background: area === v ? C.primary : C.surfaceVariant, color: area === v ? "white" : C.onSurfaceVariant, border: "none", borderRadius: 10, padding: "9px 0", fontSize: 13, cursor: "pointer", fontWeight: area === v ? 800 : 400, transition: "all .15s", fontFamily: "inherit" }}>{v}</button>
                  ))}
                </div>
              </div>
              <button onClick={estimateYield} disabled={yieldLoading} style={{ width: "100%", background: yieldLoading ? C.primaryLight : C.primary, color: "white", border: "none", borderRadius: 12, padding: "13px", fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: "inherit", transition: "background .2s", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: yieldResult ? 14 : 0 }}>
                {yieldLoading ? <span style={{ animation: "spin 1s linear infinite", display: "inline-block" }}>🔄</span> : "📊"}
                {yieldLoading ? "Estimating…" : "Estimate Yield"}
              </button>
              {yieldResult && (
                <div className="fade-up" style={{ background: `${C.primary}10`, borderRadius: 12, padding: 14 }}>
                  <p style={{ fontSize: 14, lineHeight: 1.7, color: C.onSurface }}>{yieldResult}</p>
                  <button onClick={() => speak(yieldResult)} style={{ marginTop: 10, background: "transparent", border: `1px solid ${C.primary}40`, color: C.primary, borderRadius: 999, padding: "6px 14px", fontSize: 12, cursor: "pointer", fontWeight: 800, display: "flex", alignItems: "center", gap: 6, fontFamily: "inherit" }}>
                    {Icon.vol} {t.playVoice}
                  </button>
                </div>
              )}
            </Card>
          </div>
        )}
      </main>

      {/* ── BOTTOM NAV ── */}
      <nav style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 480, background: `${C.bg}f5`, backdropFilter: "blur(14px)", borderTop: `1px solid ${C.outlineVariant}60`, display: "flex", zIndex: 100 }}>
        {[
          { key: "home",   icon: Icon.home, label: t.home },
          { key: "voice",  icon: Icon.mic,  label: t.voice },
          { key: "scan",   icon: Icon.cam,  label: t.scan },
          { key: "market", icon: Icon.mkt,  label: t.market },
        ].map(({ key, icon, label }) => {
          const active = tab === key;
          return (
            <button key={key} onClick={() => setTab(key)} style={{ flex: 1, background: "none", border: "none", cursor: "pointer", padding: "10px 0 12px", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, color: active ? C.primary : C.outline, transition: "color .15s" }}>
              {key === "home" && active ? (
                <div style={{ background: C.primary, borderRadius: 999, padding: "8px 20px", display: "flex", color: "white" }}>{icon}</div>
              ) : icon}
              <span style={{ fontSize: 10, fontWeight: active ? 800 : 600 }}>{label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
