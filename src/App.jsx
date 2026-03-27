import { useState, useEffect, useRef } from "react";

const STORAGE_KEY = "zubair_os_v2";

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
}
function saveData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
}

const PROFILE = {
  name: "Zubair",
  startWeight: 105.4,
  targetWeight: 87.5,
  height: 185,
  age: 42,
  deficitCals: 1700,
  proteinG: 160,
  stepsGoal: 8000,
  waterTarget: 3.0,
};

const MODES = {
  home: { label: "Home Day", emoji: "🏠", color: "#16a34a", bg: "#f0fdf4", desc: "Full control — cook, prep, crush it" },
  social: { label: "Social Day", emoji: "🍽️", color: "#d97706", bg: "#fffbeb", desc: "Dining out or guests — smart choices" },
  travel: { label: "Travel Day", emoji: "✈️", color: "#7c3aed", bg: "#f5f3ff", desc: "On the road — survival mode" },
};

const MEAL_IDEAS = {
  home: {
    breakfast: [
      { name: "Egg white omelette + veggies + 1 paratha", cals: 350, protein: 25 },
      { name: "Greek yogurt + fruit + almonds", cals: 300, protein: 20 },
      { name: "Daal cheela (lentil pancake) + chutney", cals: 280, protein: 22 },
      { name: "2 boiled eggs + multigrain toast + avocado", cals: 380, protein: 24 },
      { name: "Oats porridge + banana + walnuts", cals: 320, protein: 12 },
    ],
    lunch: [
      { name: "Grilled chicken tikka + salad + ½ cup rice", cals: 450, protein: 40 },
      { name: "Daal + 1 roti + raita + sabzi", cals: 420, protein: 18 },
      { name: "Chicken karahi (low oil) + 1 roti", cals: 480, protein: 35 },
      { name: "Keema (lean mince) + salad + 1 roti", cals: 460, protein: 32 },
      { name: "Grilled fish + brown rice + salad", cals: 430, protein: 36 },
    ],
    dinner: [
      { name: "Grilled fish + steamed veggies + small rice", cals: 400, protein: 35 },
      { name: "Chicken shorba (soup) + multigrain bread", cals: 320, protein: 28 },
      { name: "Palak chicken + 1 roti", cals: 420, protein: 33 },
      { name: "Tandoori chicken + cucumber raita + salad", cals: 380, protein: 38 },
    ],
    snacks: [
      { name: "Chana chaat (chickpea salad)", cals: 150, protein: 8 },
      { name: "Protein shake + banana", cals: 200, protein: 25 },
      { name: "Mixed nuts (30g)", cals: 170, protein: 6 },
      { name: "Roasted makhana (fox nuts)", cals: 100, protein: 4 },
    ],
  },
  social: {
    tips: [
      "Start with salad or soup — fill up before mains arrive",
      "Pick ONE carb: either naan OR rice, never both",
      "Go for tikka/grilled over curry — saves 200-300 cals",
      "Skip appetizers (samosas, pakoras) — calorie bombs",
      "Order raita instead of heavy curry on the side",
      "If biryani is happening, small portion + extra raita",
      "No sugary drinks — water, sparkling water, or small lassi",
      "Eat slowly — put fork down between bites, eat 20% less",
    ],
  },
  travel: {
    tips: [
      "Protein first at every meal — keeps you full longer",
      "Skip hotel buffet carbs — go for eggs + fruit",
      "Carry protein bars or nuts in your bag",
      "Walk whenever possible — airport, hotel, meetings",
      "One indulgent meal per day MAX, others are clean",
      "Stay hydrated — dehydration feels like hunger",
      "If you go over, log it and move on — no guilt spiral",
    ],
  },
};

const WORKOUTS = {
  week1_2: {
    label: "Foundation",
    sub: "Weeks 1–2",
    days: [
      { day: "Mon", activity: "Walk 30 min", type: "cardio" },
      { day: "Tue", activity: "Rest / light stretch", type: "rest" },
      { day: "Wed", activity: "Walk 30 min", type: "cardio" },
      { day: "Thu", activity: "Rest / light stretch", type: "rest" },
      { day: "Fri", activity: "Walk 30 min", type: "cardio" },
      { day: "Sat", activity: "Walk 45 min (outdoor)", type: "cardio" },
      { day: "Sun", activity: "Rest", type: "rest" },
    ],
  },
  week3_4: {
    label: "Building",
    sub: "Weeks 3–4",
    days: [
      { day: "Mon", activity: "Walk 30 min + bodyweight circuit", type: "mixed" },
      { day: "Tue", activity: "Walk 20 min", type: "cardio" },
      { day: "Wed", activity: "Gym: Upper body (machines)", type: "strength" },
      { day: "Thu", activity: "Walk 30 min", type: "cardio" },
      { day: "Fri", activity: "Gym: Lower body (machines)", type: "strength" },
      { day: "Sat", activity: "Walk 45 min + stretch", type: "cardio" },
      { day: "Sun", activity: "Rest", type: "rest" },
    ],
  },
  week5_plus: {
    label: "Full Program",
    sub: "Week 5+",
    days: [
      { day: "Mon", activity: "Gym: Push (chest, shoulders, tri)", type: "strength" },
      { day: "Tue", activity: "Walk 30 min + core", type: "mixed" },
      { day: "Wed", activity: "Gym: Pull (back, biceps)", type: "strength" },
      { day: "Thu", activity: "Walk 30 min or light cardio", type: "cardio" },
      { day: "Fri", activity: "Gym: Legs + compounds", type: "strength" },
      { day: "Sat", activity: "Walk 60 min or hike", type: "cardio" },
      { day: "Sun", activity: "Rest + meal prep", type: "rest" },
    ],
  },
};

const MOTIVATIONAL = [
  "You don't have to be extreme, you just have to be consistent.",
  "The best workout is the one you actually do.",
  "A bad day doesn't erase a good week. Keep going.",
  "You're not starting over. You're starting from experience.",
  "Discipline is choosing between what you want now and what you want most.",
  "Progress, not perfection. Every smart choice counts.",
  "The only workout you regret is the one you didn't do.",
  "Six months from now you'll wish you had started today.",
  "Restaurant night? That's Social Mode. You trained for this.",
  "Every kg lost is 4 fewer kg of pressure on each knee.",
  "Cholesterol doesn't fix itself. Every clean meal is medicine.",
  "Consistency beats intensity. Always.",
];

const NUDGES = {
  morning: [
    "☀️ New day, new wins. What mode are you in today?",
    "☀️ Yesterday is done. Today is yours.",
    "☀️ Your future self is counting on you today.",
  ],
  midday: [
    "🔔 Halfway through — how's your water?",
    "🔔 Moved in the last 2 hours? Even 5 min counts.",
    "🔔 Lunch done? Log it. What you track, you manage.",
  ],
  evening: [
    "🌙 Home stretch. Light dinner wins the day.",
    "🌙 No snacking after dinner. Brush teeth early.",
    "🌙 Sleep = recovery = fat loss. Aim for 7+ hours.",
  ],
};

function getToday() { return new Date().toISOString().slice(0, 10); }
function getDayName() { return ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][new Date().getDay()]; }
function getTimeOfDay() {
  const h = new Date().getHours();
  return h < 12 ? "morning" : h < 17 ? "midday" : "evening";
}
function randomFrom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function calcBMI(kg, cm) { return (kg / ((cm/100) ** 2)).toFixed(1); }

const defaultDay = () => ({
  date: getToday(), mode: "home", meals: [], totalCals: 0, totalProtein: 0,
  steps: 0, water: 0, workout: false, workoutNote: "", weight: null, score: 0,
});

const defaultState = () => ({
  currentDay: defaultDay(), history: [], streak: 0, bestStreak: 0,
  weekNumber: 1, startDate: getToday(), latestWeight: PROFILE.startWeight,
});

// ─── Score ───
function calcDayScore(day) {
  let s = 0;
  const target = day.mode === "travel" ? 2000 : day.mode === "social" ? 1900 : PROFILE.deficitCals;
  if (day.totalCals > 0) {
    const diff = Math.abs(day.totalCals - target);
    s += diff < 100 ? 30 : diff < 250 ? 20 : diff < 400 ? 10 : 0;
  }
  if (day.totalProtein >= PROFILE.proteinG) s += 20;
  else if (day.totalProtein >= PROFILE.proteinG * 0.7) s += 12;
  else if (day.totalProtein > 0) s += 5;
  if (day.steps >= PROFILE.stepsGoal) s += 20;
  else if (day.steps >= PROFILE.stepsGoal * 0.6) s += 12;
  else if (day.steps > 0) s += 5;
  if (day.water >= PROFILE.waterTarget) s += 15;
  else if (day.water >= 2) s += 8;
  if (day.workout) s += 15;
  return Math.min(s, 100);
}

// ─── Score Ring ───
function ScoreRing({ score, size = 100, light = true }) {
  const r = (size - 12) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = score >= 80 ? "#16a34a" : score >= 50 ? "#d97706" : "#dc2626";
  const trackColor = light ? "#e5e7eb" : "rgba(255,255,255,0.08)";
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={trackColor} strokeWidth="7" />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="7"
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 0.8s ease" }} />
      <text x={size/2} y={size/2} textAnchor="middle" dominantBaseline="central"
        fill={color} fontSize={size * 0.26} fontWeight="800"
        style={{ transform: "rotate(90deg)", transformOrigin: "center" }}>{score}</text>
    </svg>
  );
}

// ─── Photo Meal Analyzer ───
function PhotoAnalyzer({ onResult, accent }) {
  const [analyzing, setAnalyzing] = useState(false);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);
  const fileRef = useRef();

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);

    // Preview
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target.result);
    reader.readAsDataURL(file);

    // Convert to base64
    setAnalyzing(true);
    try {
      const base64 = await new Promise((res, rej) => {
        const r = new FileReader();
        r.onload = () => res(r.result.split(",")[1]);
        r.onerror = () => rej(new Error("Failed to read file"));
        r.readAsDataURL(file);
      });

      const mediaType = file.type || "image/jpeg";

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: [
              {
                type: "image",
                source: { type: "base64", media_type: mediaType, data: base64 },
              },
              {
                type: "text",
                text: `You are a nutrition estimation expert helping someone on a weight loss journey who eats South Asian / Halal food.

Analyze this meal photo and respond ONLY with a JSON object, no markdown, no backticks, no preamble:

{
  "meal_name": "Brief descriptive name of the meal",
  "items": [
    {"name": "item name", "estimated_cals": number, "estimated_protein_g": number}
  ],
  "total_calories": number,
  "total_protein_g": number,
  "portion_notes": "Brief note about portion size observed",
  "healthier_swap": "One quick suggestion to save 100+ calories next time"
}

Be realistic with South Asian portions. A typical plate of biryani is 400-600 cal, a roti is ~120 cal, a curry serving is 250-400 cal depending on oil/ghee. Estimate conservatively but honestly.`
              }
            ]
          }],
        }),
      });

      const data = await response.json();
      const text = data.content?.map(i => i.text || "").join("") || "";
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      onResult(parsed);
      setPreview(null);
    } catch (err) {
      console.error(err);
      setError("Couldn't analyze the photo. Try again or log manually.");
    }
    setAnalyzing(false);
    if (fileRef.current) fileRef.current.value = "";
  }

  return (
    <div style={{
      background: "#fff", borderRadius: 16, padding: 20,
      border: "1.5px dashed #d1d5db", textAlign: "center", marginBottom: 20,
      position: "relative", overflow: "hidden",
    }}>
      <input ref={fileRef} type="file" accept="image/*" capture="environment"
        onChange={handleFile} style={{ display: "none" }} id="meal-photo" />

      {preview && (
        <div style={{ marginBottom: 12 }}>
          <img src={preview} alt="Meal" style={{
            width: "100%", maxHeight: 200, objectFit: "cover", borderRadius: 12,
          }} />
        </div>
      )}

      {analyzing ? (
        <div style={{ padding: 20 }}>
          <div style={{
            width: 36, height: 36, border: `3px solid ${accent}`,
            borderTopColor: "transparent", borderRadius: "50%",
            margin: "0 auto 12", animation: "spin 1s linear infinite",
          }} />
          <div style={{ fontSize: 14, fontWeight: 600, color: "#374151" }}>Analyzing your meal...</div>
          <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 4 }}>
            Estimating calories & protein from the photo
          </div>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      ) : (
        <label htmlFor="meal-photo" style={{ cursor: "pointer", display: "block", padding: 12 }}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>📸</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#111827", marginBottom: 4 }}>
            Snap Your Meal
          </div>
          <div style={{ fontSize: 12, color: "#6b7280" }}>
            Take a photo or upload — AI estimates calories & protein
          </div>
        </label>
      )}

      {error && (
        <div style={{
          marginTop: 10, padding: "8px 12px", borderRadius: 8,
          background: "#fef2f2", color: "#dc2626", fontSize: 12,
        }}>{error}</div>
      )}
    </div>
  );
}

// ─── Photo Result Card ───
function PhotoResultCard({ result, onAdd, accent }) {
  if (!result) return null;
  return (
    <div style={{
      background: "#f0fdf4", borderRadius: 16, padding: 18,
      border: "1px solid #bbf7d0", marginBottom: 20,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ fontSize: 15, fontWeight: 800, color: "#111827" }}>📸 {result.meal_name}</div>
        <button onClick={() => onAdd({
          name: `📸 ${result.meal_name}`,
          cals: result.total_calories,
          protein: result.total_protein_g,
        })} style={{
          background: accent, color: "#fff", border: "none", borderRadius: 10,
          padding: "8px 16px", fontSize: 12, fontWeight: 700, cursor: "pointer",
        }}>+ Log This</button>
      </div>
      {result.items?.map((item, i) => (
        <div key={i} style={{
          display: "flex", justifyContent: "space-between", padding: "6px 0",
          borderBottom: i < result.items.length - 1 ? "1px solid #dcfce7" : "none",
          fontSize: 13, color: "#374151",
        }}>
          <span>{item.name}</span>
          <span style={{ color: "#6b7280" }}>{item.estimated_cals} cal · {item.estimated_protein_g}g</span>
        </div>
      ))}
      <div style={{
        display: "flex", justifyContent: "space-between", marginTop: 10, paddingTop: 10,
        borderTop: "1.5px solid #bbf7d0", fontWeight: 800, fontSize: 14, color: "#111827",
      }}>
        <span>Total</span>
        <span>{result.total_calories} cal · {result.total_protein_g}g protein</span>
      </div>
      {result.portion_notes && (
        <div style={{ fontSize: 11, color: "#6b7280", marginTop: 8 }}>📏 {result.portion_notes}</div>
      )}
      {result.healthier_swap && (
        <div style={{
          marginTop: 8, padding: "8px 12px", borderRadius: 8,
          background: "#fffbeb", border: "1px solid #fde68a", fontSize: 12, color: "#92400e",
        }}>💡 <strong>Swap tip:</strong> {result.healthier_swap}</div>
      )}
    </div>
  );
}

// ─── Main App ───
export default function ZubairOS() {
  const [state, setState] = useState(() => loadData() || defaultState());
  const [view, setView] = useState("dashboard");
  const [mealCat, setMealCat] = useState("breakfast");
  const [customMeal, setCustomMeal] = useState({ name: "", cals: "", protein: "" });
  const [weightInput, setWeightInput] = useState("");
  const [photoResult, setPhotoResult] = useState(null);
  const [nudgeVisible, setNudgeVisible] = useState(true);
  const [motivationKey, setMotivationKey] = useState(0);
  const [chartRange, setChartRange] = useState("all");
  const [coachLoading, setCoachLoading] = useState(false);
  const [coachFeedback, setCoachFeedback] = useState(null);
  const [coachError, setCoachError] = useState(null);

  useEffect(() => { saveData(state); }, [state]);
  useEffect(() => {
    if (state.currentDay.date !== getToday()) {
      const score = calcDayScore(state.currentDay);
      const updatedDay = { ...state.currentDay, score };
      const newStreak = score >= 50 ? state.streak + 1 : 0;
      setState(prev => ({
        ...prev, history: [...prev.history, updatedDay], currentDay: defaultDay(),
        streak: newStreak, bestStreak: Math.max(prev.bestStreak, newStreak),
      }));
    }
  }, []);

  function setMode(m) { setState(p => ({ ...p, currentDay: { ...p.currentDay, mode: m } })); }
  function addMeal(meal) {
    setState(p => ({
      ...p, currentDay: {
        ...p.currentDay, meals: [...p.currentDay.meals, meal],
        totalCals: p.currentDay.totalCals + meal.cals,
        totalProtein: p.currentDay.totalProtein + meal.protein,
      },
    }));
  }
  function addCustomMeal() {
    if (!customMeal.name || !customMeal.cals) return;
    addMeal({ name: customMeal.name, cals: parseInt(customMeal.cals) || 0, protein: parseInt(customMeal.protein) || 0 });
    setCustomMeal({ name: "", cals: "", protein: "" });
  }
  function updateSteps(v) { setState(p => ({ ...p, currentDay: { ...p.currentDay, steps: Math.max(0, v) } })); }
  function updateWater(d) { setState(p => ({ ...p, currentDay: { ...p.currentDay, water: Math.max(0, +(p.currentDay.water + d).toFixed(2)) } })); }
  function toggleWorkout(note) { setState(p => ({ ...p, currentDay: { ...p.currentDay, workout: !p.currentDay.workout, workoutNote: note || "" } })); }
  function logWeight() {
    const w = parseFloat(weightInput);
    if (!w || w < 50 || w > 200) return;
    setState(p => ({ ...p, currentDay: { ...p.currentDay, weight: w }, latestWeight: w }));
    setWeightInput("");
  }
  function resetAll() { if (confirm("Reset ALL data? Cannot undo.")) setState(defaultState()); }

  const cd = state.currentDay;
  const todayScore = calcDayScore(cd);
  const totalLost = (PROFILE.startWeight - state.latestWeight).toFixed(1);
  const remaining = (state.latestWeight - PROFILE.targetWeight).toFixed(1);
  const weeksLeft = Math.ceil((state.latestWeight - PROFILE.targetWeight) / 0.75);
  const currentBMI = calcBMI(state.latestWeight, PROFILE.height);
  const progressPct = Math.min(100, Math.max(0, ((PROFILE.startWeight - state.latestWeight) / (PROFILE.startWeight - PROFILE.targetWeight)) * 100)).toFixed(0);
  const calTarget = cd.mode === "travel" ? 2000 : cd.mode === "social" ? 1900 : PROFILE.deficitCals;
  const calPct = Math.min(100, (cd.totalCals / calTarget) * 100);
  const calColor = cd.totalCals > calTarget ? "#dc2626" : cd.totalCals > calTarget * 0.85 ? "#d97706" : "#16a34a";
  const mode = MODES[cd.mode];
  const accent = mode.color;
  const timeOfDay = getTimeOfDay();
  const nudge = randomFrom(NUDGES[timeOfDay]);
  const dayName = getDayName();
  const weekNum = state.weekNumber;
  const workoutPhase = weekNum <= 2 ? "week1_2" : weekNum <= 4 ? "week3_4" : "week5_plus";
  const todayWorkout = WORKOUTS[workoutPhase].days.find(d => d.day === dayName);

  const inputStyle = {
    background: "#f9fafb", border: "1.5px solid #e5e7eb", borderRadius: 10,
    padding: "10px 14px", color: "#111827", fontSize: 14, outline: "none", width: "100%",
    boxSizing: "border-box",
  };
  const cardStyle = {
    background: "#fff", borderRadius: 16, padding: 18,
    border: "1px solid #f3f4f6", boxShadow: "0 1px 3px rgba(0,0,0,0.04)", marginBottom: 16,
  };

  const navItems = [
    { id: "dashboard", label: "Home", icon: "📊" },
    { id: "food", label: "Food", icon: "🍽️" },
    { id: "move", label: "Move", icon: "🏃" },
    { id: "progress", label: "Stats", icon: "📈" },
    { id: "coach", label: "Coach", icon: "🧠" },
  ];

  return (
    <div style={{
      fontFamily: "'Outfit', 'DM Sans', system-ui, sans-serif",
      background: "#f8f9fb", color: "#111827", minHeight: "100vh",
      maxWidth: 480, margin: "0 auto", position: "relative", paddingBottom: 80,
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />

      {/* ─── HEADER ─── */}
      <div style={{
        padding: "20px 20px 16px", background: "#fff",
        borderBottom: "1px solid #f3f4f6",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 10, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 2.5, fontWeight: 700, marginBottom: 2 }}>
              ZUBAIR OS
            </div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#111827", letterSpacing: "-0.3px" }}>
              {timeOfDay === "morning" ? "Good Morning" : timeOfDay === "midday" ? "Keep Pushing" : "Almost There"} 👋
            </div>
          </div>
          <div style={{
            background: mode.bg, color: accent, padding: "6px 14px",
            borderRadius: 20, fontSize: 11, fontWeight: 800, border: `1.5px solid ${accent}30`,
            letterSpacing: "0.3px",
          }}>
            {mode.emoji} {mode.label}
          </div>
        </div>
        {nudgeVisible && (
          <div style={{
            marginTop: 12, padding: "10px 14px", borderRadius: 12,
            background: mode.bg, fontSize: 13, color: "#374151",
            display: "flex", justifyContent: "space-between", alignItems: "center",
            border: `1px solid ${accent}20`,
          }}>
            <span>{nudge}</span>
            <button onClick={() => setNudgeVisible(false)} style={{
              background: "none", border: "none", color: "#9ca3af", cursor: "pointer", fontSize: 16, padding: 4,
            }}>×</button>
          </div>
        )}
      </div>

      <div style={{ padding: 20 }}>

        {/* ════════ DASHBOARD ════════ */}
        {view === "dashboard" && (
          <div>
            {/* Mode Selector */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 11, color: "#9ca3af", marginBottom: 8, textTransform: "uppercase", letterSpacing: 1.5, fontWeight: 700 }}>Today's Mode</div>
              <div style={{ display: "flex", gap: 8 }}>
                {Object.entries(MODES).map(([k, m]) => (
                  <button key={k} onClick={() => setMode(k)} style={{
                    flex: 1, padding: "14px 8px", borderRadius: 14,
                    border: `2px solid ${cd.mode === k ? m.color : "#e5e7eb"}`,
                    background: cd.mode === k ? m.bg : "#fff",
                    color: cd.mode === k ? m.color : "#9ca3af",
                    cursor: "pointer", fontSize: 11, fontWeight: 800, textAlign: "center",
                    transition: "all 0.2s",
                  }}>
                    <div style={{ fontSize: 22, marginBottom: 4 }}>{m.emoji}</div>
                    {m.label.split(" ")[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Score + Streak */}
            <div style={{ ...cardStyle, display: "flex", alignItems: "center", gap: 20 }}>
              <ScoreRing score={todayScore} size={100} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 700, letterSpacing: 1, marginBottom: 4 }}>TODAY'S SCORE</div>
                <div style={{ fontSize: 14, color: "#4b5563", lineHeight: 1.5 }}>
                  {todayScore >= 80 ? "Crushing it! 🔥" : todayScore >= 50 ? "Solid — keep logging 💪" : todayScore > 0 ? "Room to improve" : "Start logging to score"}
                </div>
                <div style={{ marginTop: 8, fontSize: 14, fontWeight: 800 }}>
                  🔥 <span style={{ color: state.streak >= 7 ? "#16a34a" : state.streak >= 3 ? "#d97706" : "#111" }}>{state.streak} day streak</span>
                  <span style={{ color: "#d1d5db", marginLeft: 8, fontSize: 12, fontWeight: 500 }}>Best: {state.bestStreak}</span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
              {[
                { label: "Calories", val: cd.totalCals, unit: `/${calTarget}`, icon: "🔥", col: calColor },
                { label: "Protein", val: `${cd.totalProtein}g`, unit: `/${PROFILE.proteinG}g`, icon: "💪", col: cd.totalProtein >= PROFILE.proteinG ? "#16a34a" : "#111" },
                { label: "Steps", val: cd.steps.toLocaleString(), unit: `/${(PROFILE.stepsGoal/1000)}k`, icon: "👟", col: cd.steps >= PROFILE.stepsGoal ? "#16a34a" : "#111" },
                { label: "Water", val: `${cd.water}L`, unit: `/${PROFILE.waterTarget}L`, icon: "💧", col: cd.water >= PROFILE.waterTarget ? "#16a34a" : "#111" },
              ].map((s, i) => (
                <div key={i} style={{
                  background: "#fff", borderRadius: 14, padding: "14px 16px",
                  border: "1px solid #f3f4f6", boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
                }}>
                  <div style={{ fontSize: 11, color: "#9ca3af", marginBottom: 4, fontWeight: 600 }}>{s.icon} {s.label}</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: s.col, letterSpacing: "-0.5px" }}>
                    {s.val}<span style={{ fontSize: 12, fontWeight: 400, color: "#d1d5db", marginLeft: 2 }}>{s.unit}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Calorie Bar */}
            <div style={cardStyle}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#9ca3af", marginBottom: 8 }}>
                <span>Calorie Budget</span>
                <span style={{ fontWeight: 700, color: calColor }}>{cd.totalCals} / {calTarget}</span>
              </div>
              <div style={{ height: 10, borderRadius: 5, background: "#f3f4f6", overflow: "hidden" }}>
                <div style={{
                  height: "100%", width: `${calPct}%`, borderRadius: 5,
                  background: calColor, transition: "width 0.5s ease",
                }} />
              </div>
              <div style={{ fontSize: 11, color: "#d1d5db", marginTop: 6 }}>
                {calTarget - cd.totalCals > 0 ? `${calTarget - cd.totalCals} cal remaining` : `${cd.totalCals - calTarget} cal over budget`}
              </div>
            </div>

            {/* Weight */}
            <div style={cardStyle}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
                <div>
                  <div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 700 }}>CURRENT</div>
                  <div style={{ fontSize: 28, fontWeight: 900, color: "#111" }}>{state.latestWeight} <span style={{ fontSize: 13, fontWeight: 400, color: "#9ca3af" }}>kg</span></div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 700 }}>LOST</div>
                  <div style={{ fontSize: 28, fontWeight: 900, color: parseFloat(totalLost) > 0 ? "#16a34a" : "#111" }}>
                    {parseFloat(totalLost) > 0 ? `−${totalLost}` : "0"} <span style={{ fontSize: 13, fontWeight: 400, color: "#9ca3af" }}>kg</span>
                  </div>
                </div>
              </div>
              <div style={{ fontSize: 11, color: "#9ca3af", marginBottom: 6 }}>
                Target: {PROFILE.targetWeight} kg · {remaining} kg to go · ~{weeksLeft} weeks
              </div>
              <div style={{ height: 8, borderRadius: 4, background: "#f3f4f6", overflow: "hidden", marginBottom: 14 }}>
                <div style={{
                  height: "100%", width: `${progressPct}%`, borderRadius: 4,
                  background: `linear-gradient(90deg, ${accent}, #16a34a)`, transition: "width 0.5s",
                }} />
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <input type="number" value={weightInput} onChange={e => setWeightInput(e.target.value)}
                  placeholder="Log weight (kg)" style={{ ...inputStyle, flex: 1 }} />
                <button onClick={logWeight} style={{
                  background: accent, color: "#fff", border: "none", borderRadius: 10,
                  padding: "10px 20px", fontWeight: 700, fontSize: 13, cursor: "pointer",
                }}>Log</button>
              </div>
            </div>

            {/* Today's Workout */}
            {todayWorkout && (
              <div style={cardStyle}>
                <div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 700, marginBottom: 4 }}>
                  TODAY'S WORKOUT · {WORKOUTS[workoutPhase].label}
                </div>
                <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 12, color: "#111" }}>{todayWorkout.activity}</div>
                <button onClick={() => toggleWorkout(todayWorkout.activity)} style={{
                  background: cd.workout ? "#f0fdf4" : "#f9fafb",
                  border: `2px solid ${cd.workout ? "#16a34a" : "#e5e7eb"}`,
                  color: cd.workout ? "#16a34a" : "#6b7280",
                  borderRadius: 10, padding: "10px", fontSize: 14, fontWeight: 800,
                  cursor: "pointer", width: "100%", transition: "all 0.2s",
                }}>
                  {cd.workout ? "✅ Done!" : "Mark Complete"}
                </button>
              </div>
            )}
          </div>
        )}

        {/* ════════ FOOD ════════ */}
        {view === "food" && (
          <div>
            <div style={{ fontSize: 20, fontWeight: 900, marginBottom: 4, color: "#111" }}>
              {cd.mode === "home" ? "🍳 Meal Planner" : cd.mode === "social" ? "🍽️ Smart Dining" : "✈️ Travel Eating"}
            </div>
            <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 20 }}>
              Budget: {calTarget} cal · Protein: {PROFILE.proteinG}g
            </div>

            {/* Photo Analyzer */}
            <PhotoAnalyzer onResult={setPhotoResult} accent={accent} />
            <PhotoResultCard result={photoResult} onAdd={(m) => { addMeal(m); setPhotoResult(null); }} accent={accent} />

            {cd.mode === "home" ? (
              <>
                <div style={{ display: "flex", gap: 6, marginBottom: 16, overflowX: "auto" }}>
                  {["breakfast", "lunch", "dinner", "snacks"].map(cat => (
                    <button key={cat} onClick={() => setMealCat(cat)} style={{
                      padding: "8px 18px", borderRadius: 20, fontSize: 12, fontWeight: 700,
                      border: `1.5px solid ${mealCat === cat ? accent : "#e5e7eb"}`,
                      background: mealCat === cat ? mode.bg : "#fff",
                      color: mealCat === cat ? accent : "#9ca3af",
                      cursor: "pointer", textTransform: "capitalize", whiteSpace: "nowrap",
                    }}>{cat}</button>
                  ))}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
                  {MEAL_IDEAS.home[mealCat].map((meal, i) => (
                    <button key={i} onClick={() => addMeal(meal)} style={{
                      background: "#fff", border: "1px solid #f3f4f6", borderRadius: 12,
                      padding: "14px 16px", textAlign: "left", cursor: "pointer", width: "100%",
                      color: "#111", transition: "all 0.15s", boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = accent; e.currentTarget.style.background = mode.bg; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "#f3f4f6"; e.currentTarget.style.background = "#fff"; }}>
                      <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 3 }}>{meal.name}</div>
                      <div style={{ fontSize: 12, color: "#9ca3af" }}>{meal.cals} cal · {meal.protein}g protein</div>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
                {(cd.mode === "social" ? MEAL_IDEAS.social.tips : MEAL_IDEAS.travel.tips).map((tip, i) => (
                  <div key={i} style={{
                    ...cardStyle, marginBottom: 0, fontSize: 13, color: "#374151", lineHeight: 1.6,
                  }}>
                    <span style={{ fontWeight: 800, color: accent }}>#{i+1}</span> {tip}
                  </div>
                ))}
              </div>
            )}

            {/* Custom logger */}
            <div style={cardStyle}>
              <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 12, color: "#111" }}>📝 Log Custom Meal</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <input value={customMeal.name} onChange={e => setCustomMeal({...customMeal, name: e.target.value})}
                  placeholder="What did you eat?" style={inputStyle} />
                <div style={{ display: "flex", gap: 8 }}>
                  <input value={customMeal.cals} onChange={e => setCustomMeal({...customMeal, cals: e.target.value})}
                    placeholder="Calories" type="number" style={inputStyle} />
                  <input value={customMeal.protein} onChange={e => setCustomMeal({...customMeal, protein: e.target.value})}
                    placeholder="Protein (g)" type="number" style={inputStyle} />
                </div>
                <button onClick={addCustomMeal} style={{
                  background: accent, color: "#fff", border: "none", borderRadius: 10,
                  padding: "12px", fontWeight: 700, fontSize: 14, cursor: "pointer",
                }}>+ Add Meal</button>
              </div>
            </div>

            {/* Today's log */}
            {cd.meals.length > 0 && (
              <div style={cardStyle}>
                <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 10 }}>Today's Log</div>
                {cd.meals.map((m, i) => (
                  <div key={i} style={{
                    display: "flex", justifyContent: "space-between", padding: "10px 0",
                    borderBottom: i < cd.meals.length - 1 ? "1px solid #f3f4f6" : "none", fontSize: 13,
                  }}>
                    <span style={{ color: "#374151" }}>{m.name}</span>
                    <span style={{ color: "#9ca3af", whiteSpace: "nowrap", marginLeft: 8 }}>{m.cals} · {m.protein}g</span>
                  </div>
                ))}
                <div style={{
                  display: "flex", justifyContent: "space-between", paddingTop: 12,
                  marginTop: 4, borderTop: "2px solid #f3f4f6", fontWeight: 800, fontSize: 14,
                }}>
                  <span>Total</span>
                  <span style={{ color: calColor }}>{cd.totalCals} cal · {cd.totalProtein}g protein</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ════════ MOVE ════════ */}
        {view === "move" && (
          <div>
            <div style={{ fontSize: 20, fontWeight: 900, marginBottom: 4 }}>🏃 Movement</div>
            <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 20 }}>
              {WORKOUTS[workoutPhase].label} · {WORKOUTS[workoutPhase].sub}
            </div>

            {/* Steps */}
            <div style={cardStyle}>
              <div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 700, marginBottom: 8 }}>DAILY STEPS</div>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <button onClick={() => updateSteps(cd.steps - 1000)} style={{
                  background: "#f3f4f6", border: "none", borderRadius: 10,
                  color: "#374151", width: 40, height: 40, fontSize: 20, cursor: "pointer", fontWeight: 700,
                }}>−</button>
                <div style={{ flex: 1, textAlign: "center" }}>
                  <div style={{ fontSize: 36, fontWeight: 900, color: cd.steps >= PROFILE.stepsGoal ? "#16a34a" : "#111" }}>
                    {cd.steps.toLocaleString()}
                  </div>
                  <div style={{ fontSize: 12, color: "#9ca3af" }}>/ {PROFILE.stepsGoal.toLocaleString()} goal</div>
                </div>
                <button onClick={() => updateSteps(cd.steps + 1000)} style={{
                  background: "#f3f4f6", border: "none", borderRadius: 10,
                  color: "#374151", width: 40, height: 40, fontSize: 20, cursor: "pointer", fontWeight: 700,
                }}>+</button>
              </div>
              <input type="range" min="0" max="15000" step="500" value={cd.steps}
                onChange={e => updateSteps(parseInt(e.target.value))}
                style={{ width: "100%", marginTop: 14, accentColor: accent }} />
              <div style={{
                marginTop: 10, padding: "10px 14px", borderRadius: 10,
                background: "#f0f9ff", border: "1px solid #bae6fd", fontSize: 12, color: "#0369a1",
              }}>
                📱 <strong>Tip:</strong> Check Apple Health for your step count, then enter it here. Open Apple Health → Browse → Steps.
              </div>
            </div>

            {/* Water */}
            <div style={cardStyle}>
              <div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 700, marginBottom: 8 }}>WATER INTAKE</div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 20 }}>
                <button onClick={() => updateWater(-0.25)} style={{
                  background: "#f3f4f6", border: "none", borderRadius: 10,
                  color: "#374151", width: 40, height: 40, fontSize: 20, cursor: "pointer", fontWeight: 700,
                }}>−</button>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 36, fontWeight: 900, color: cd.water >= PROFILE.waterTarget ? "#16a34a" : "#111" }}>
                    {cd.water.toFixed(2)} <span style={{ fontSize: 16, fontWeight: 400, color: "#9ca3af" }}>L</span>
                  </div>
                  <div style={{ fontSize: 12, color: "#9ca3af" }}>/ {PROFILE.waterTarget}L goal</div>
                </div>
                <button onClick={() => updateWater(0.25)} style={{
                  background: "#f3f4f6", border: "none", borderRadius: 10,
                  color: "#374151", width: 40, height: 40, fontSize: 20, cursor: "pointer", fontWeight: 700,
                }}>+</button>
              </div>
              <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 12 }}>
                {[0.25, 0.5, 0.75, 1.0].map(v => (
                  <button key={v} onClick={() => updateWater(v)} style={{
                    background: mode.bg, border: `1px solid ${accent}30`, borderRadius: 8,
                    color: accent, padding: "6px 12px", fontSize: 12, fontWeight: 700, cursor: "pointer",
                  }}>+{v}L</button>
                ))}
              </div>
            </div>

            {/* Weekly Plan */}
            <div style={cardStyle}>
              <div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 700, marginBottom: 14 }}>WEEKLY PLAN</div>
              {WORKOUTS[workoutPhase].days.map((d, i) => {
                const isToday = d.day === dayName;
                const typeColors = {
                  strength: { bg: "#ede9fe", text: "#7c3aed" },
                  cardio: { bg: "#f0fdf4", text: "#16a34a" },
                  mixed: { bg: "#fffbeb", text: "#d97706" },
                  rest: { bg: "#f9fafb", text: "#9ca3af" },
                };
                const tc = typeColors[d.type] || typeColors.rest;
                return (
                  <div key={i} style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "12px 0", borderBottom: i < 6 ? "1px solid #f3f4f6" : "none",
                    opacity: isToday ? 1 : 0.55,
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{
                        width: 34, height: 34, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 11, fontWeight: 800,
                        background: isToday ? mode.bg : "#f9fafb",
                        color: isToday ? accent : "#9ca3af",
                        border: isToday ? `2px solid ${accent}` : "1px solid #e5e7eb",
                      }}>{d.day}</div>
                      <span style={{ fontSize: 13, fontWeight: isToday ? 800 : 400, color: "#111" }}>{d.activity}</span>
                    </div>
                    <span style={{
                      fontSize: 10, padding: "4px 10px", borderRadius: 10,
                      background: tc.bg, color: tc.text,
                      fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5,
                    }}>{d.type}</span>
                  </div>
                );
              })}
            </div>

            {/* Week control */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16 }}>
              <button onClick={() => setState(p => ({...p, weekNumber: Math.max(1, p.weekNumber - 1)}))} style={{
                background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10,
                color: "#374151", padding: "8px 16px", fontSize: 13, cursor: "pointer", fontWeight: 600,
              }}>← Prev</button>
              <span style={{ fontSize: 15, fontWeight: 800 }}>Week {weekNum}</span>
              <button onClick={() => setState(p => ({...p, weekNumber: p.weekNumber + 1}))} style={{
                background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10,
                color: "#374151", padding: "8px 16px", fontSize: 13, cursor: "pointer", fontWeight: 600,
              }}>Next →</button>
            </div>
          </div>
        )}

        {/* ════════ PROGRESS ════════ */}
        {view === "progress" && (() => {
          // Chart helpers
          const chartW = 400, chartH = 180, padL = 45, padR = 15, padT = 15, padB = 30;
          const plotW = chartW - padL - padR, plotH = chartH - padT - padB;

          // Weight data (from history entries that have weight logged + current)
          const weightEntries = [
            { date: state.startDate, weight: PROFILE.startWeight },
            ...state.history.filter(d => d.weight).map(d => ({ date: d.date, weight: d.weight })),
            ...(cd.weight ? [{ date: cd.date, weight: cd.weight }] : []),
          ];
          const wMin = Math.min(PROFILE.targetWeight - 2, ...weightEntries.map(e => e.weight));
          const wMax = Math.max(...weightEntries.map(e => e.weight)) + 1;
          const wRange = wMax - wMin || 1;

          // Score data (last 30 days from history)
          const scoreEntries = state.history.slice(-30).map(d => ({
            date: d.date, score: d.score, mode: d.mode,
          }));

          // Time range selector
          const filteredWeight = chartRange === "7d" ? weightEntries.slice(-7)
            : chartRange === "30d" ? weightEntries.slice(-30) : weightEntries;
          const filteredScores = chartRange === "7d" ? scoreEntries.slice(-7)
            : chartRange === "30d" ? scoreEntries.slice(-30) : scoreEntries;

          // Build weight SVG path
          function buildWeightChart(entries) {
            if (entries.length < 2) return null;
            const xStep = plotW / Math.max(entries.length - 1, 1);
            const points = entries.map((e, i) => ({
              x: padL + i * xStep,
              y: padT + plotH - ((e.weight - wMin) / wRange) * plotH,
              ...e,
            }));
            const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
            const areaPath = linePath + ` L${points[points.length-1].x.toFixed(1)},${padT + plotH} L${points[0].x.toFixed(1)},${padT + plotH} Z`;

            // Y-axis labels (5 ticks)
            const yTicks = Array.from({length: 5}, (_, i) => {
              const val = wMin + (wRange * i / 4);
              const y = padT + plotH - (i / 4) * plotH;
              return { val: val.toFixed(0), y };
            });

            // X-axis labels (first, mid, last)
            const xLabels = entries.length >= 2 ? [
              { label: entries[0].date.slice(5), x: points[0].x },
              ...(entries.length >= 3 ? [{ label: entries[Math.floor(entries.length/2)].date.slice(5), x: points[Math.floor(entries.length/2)].x }] : []),
              { label: entries[entries.length-1].date.slice(5), x: points[points.length-1].x },
            ] : [];

            return { points, linePath, areaPath, yTicks, xLabels };
          }

          const wChart = buildWeightChart(filteredWeight);

          // Build score bars
          const scoreBarW = filteredScores.length > 0 ? Math.min(20, (plotW - filteredScores.length * 2) / filteredScores.length) : 10;

          return (
          <div>
            <div style={{ fontSize: 20, fontWeight: 900, marginBottom: 20 }}>📈 Progress</div>

            {/* Summary cards */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
              {[
                { label: "START", val: PROFILE.startWeight, sub: "kg", col: "#111" },
                { label: "CURRENT", val: state.latestWeight, sub: "kg", col: parseFloat(totalLost) > 0 ? "#16a34a" : "#111" },
                { label: "BMI", val: currentBMI, sub: "Target: <25", col: "#111" },
                { label: "PROGRESS", val: `${progressPct}%`, sub: "of goal", col: "#7c3aed" },
              ].map((s, i) => (
                <div key={i} style={{ ...cardStyle, textAlign: "center", marginBottom: 0 }}>
                  <div style={{ fontSize: 10, color: "#9ca3af", fontWeight: 700, letterSpacing: 1 }}>{s.label}</div>
                  <div style={{ fontSize: 26, fontWeight: 900, color: s.col, margin: "4px 0 2px" }}>{s.val}</div>
                  <div style={{ fontSize: 11, color: "#d1d5db" }}>{s.sub}</div>
                </div>
              ))}
            </div>

            {/* Time range selector */}
            <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
              {[
                { key: "7d", label: "7 Days" },
                { key: "30d", label: "30 Days" },
                { key: "all", label: "All Time" },
              ].map(r => (
                <button key={r.key} onClick={() => setChartRange(r.key)} style={{
                  flex: 1, padding: "8px 12px", borderRadius: 10, fontSize: 12, fontWeight: 700,
                  border: `1.5px solid ${chartRange === r.key ? accent : "#e5e7eb"}`,
                  background: chartRange === r.key ? mode.bg : "#fff",
                  color: chartRange === r.key ? accent : "#9ca3af",
                  cursor: "pointer",
                }}>{r.label}</button>
              ))}
            </div>

            {/* Weight Trend Chart */}
            <div style={cardStyle}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <div>
                  <div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 700, letterSpacing: 1 }}>WEIGHT TREND</div>
                  <div style={{ fontSize: 13, color: "#6b7280", marginTop: 2 }}>
                    {parseFloat(totalLost) > 0 ? `↓ ${totalLost} kg lost` : "Start logging to see trend"}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 22, fontWeight: 900, color: parseFloat(totalLost) > 0 ? "#16a34a" : "#111" }}>
                    {state.latestWeight}
                  </div>
                  <div style={{ fontSize: 11, color: "#9ca3af" }}>kg current</div>
                </div>
              </div>

              {filteredWeight.length < 2 ? (
                <div style={{
                  height: chartH, display: "flex", alignItems: "center", justifyContent: "center",
                  background: "#f9fafb", borderRadius: 12, color: "#9ca3af", fontSize: 13,
                }}>
                  📊 Log your weight on at least 2 days to see the trend chart
                </div>
              ) : wChart && (
                <svg viewBox={`0 0 ${chartW} ${chartH}`} style={{ width: "100%", height: "auto" }}>
                  {/* Grid lines */}
                  {wChart.yTicks.map((t, i) => (
                    <g key={i}>
                      <line x1={padL} y1={t.y} x2={chartW - padR} y2={t.y}
                        stroke="#f3f4f6" strokeWidth="1" />
                      <text x={padL - 8} y={t.y + 3} textAnchor="end"
                        fill="#9ca3af" fontSize="9" fontFamily="Outfit, sans-serif">{t.val}</text>
                    </g>
                  ))}
                  {/* Target line */}
                  {(() => {
                    const targetY = padT + plotH - ((PROFILE.targetWeight - wMin) / wRange) * plotH;
                    return targetY >= padT && targetY <= padT + plotH ? (
                      <g>
                        <line x1={padL} y1={targetY} x2={chartW - padR} y2={targetY}
                          stroke="#16a34a" strokeWidth="1" strokeDasharray="4,4" opacity="0.5" />
                        <text x={chartW - padR + 2} y={targetY + 3}
                          fill="#16a34a" fontSize="8" fontFamily="Outfit, sans-serif" fontWeight="700">GOAL</text>
                      </g>
                    ) : null;
                  })()}
                  {/* Area fill */}
                  <path d={wChart.areaPath} fill="url(#weightGrad)" opacity="0.15" />
                  {/* Line */}
                  <path d={wChart.linePath} fill="none" stroke={accent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  {/* Dots */}
                  {wChart.points.map((p, i) => (
                    <circle key={i} cx={p.x} cy={p.y} r={i === wChart.points.length - 1 ? 5 : 3}
                      fill={i === wChart.points.length - 1 ? accent : "#fff"}
                      stroke={accent} strokeWidth="2" />
                  ))}
                  {/* X labels */}
                  {wChart.xLabels.map((l, i) => (
                    <text key={i} x={l.x} y={chartH - 5} textAnchor="middle"
                      fill="#9ca3af" fontSize="9" fontFamily="Outfit, sans-serif">{l.label}</text>
                  ))}
                  {/* Weight labels on last & first point */}
                  {wChart.points.length >= 2 && (
                    <>
                      <text x={wChart.points[0].x} y={wChart.points[0].y - 10} textAnchor="middle"
                        fill="#6b7280" fontSize="9" fontWeight="700" fontFamily="Outfit, sans-serif">
                        {wChart.points[0].weight}
                      </text>
                      <text x={wChart.points[wChart.points.length-1].x} y={wChart.points[wChart.points.length-1].y - 10} textAnchor="middle"
                        fill={accent} fontSize="10" fontWeight="800" fontFamily="Outfit, sans-serif">
                        {wChart.points[wChart.points.length-1].weight}
                      </text>
                    </>
                  )}
                  <defs>
                    <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={accent} />
                      <stop offset="100%" stopColor={accent} stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>
              )}
            </div>

            {/* Daily Score Chart */}
            <div style={cardStyle}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <div>
                  <div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 700, letterSpacing: 1 }}>DAILY SCORES</div>
                  <div style={{ fontSize: 13, color: "#6b7280", marginTop: 2 }}>
                    {scoreEntries.length > 0
                      ? `Avg: ${(scoreEntries.reduce((a, e) => a + e.score, 0) / scoreEntries.length).toFixed(0)}/100`
                      : "Complete days to see scores"}
                  </div>
                </div>
                {scoreEntries.length > 0 && (
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 11, color: "#9ca3af" }}>Best</div>
                    <div style={{ fontSize: 18, fontWeight: 900, color: "#16a34a" }}>
                      {Math.max(...scoreEntries.map(e => e.score))}
                    </div>
                  </div>
                )}
              </div>

              {filteredScores.length === 0 ? (
                <div style={{
                  height: chartH, display: "flex", alignItems: "center", justifyContent: "center",
                  background: "#f9fafb", borderRadius: 12, color: "#9ca3af", fontSize: 13,
                }}>
                  📊 Complete your first day to see score history
                </div>
              ) : (
                <svg viewBox={`0 0 ${chartW} ${chartH + 10}`} style={{ width: "100%", height: "auto" }}>
                  {/* 50-line (passing grade) */}
                  <line x1={padL} y1={padT + plotH * 0.5} x2={chartW - padR} y2={padT + plotH * 0.5}
                    stroke="#f3f4f6" strokeWidth="1" strokeDasharray="4,4" />
                  <text x={padL - 8} y={padT + plotH * 0.5 + 3} textAnchor="end"
                    fill="#d1d5db" fontSize="9" fontFamily="Outfit, sans-serif">50</text>
                  {/* 80-line (great day) */}
                  <line x1={padL} y1={padT + plotH * 0.2} x2={chartW - padR} y2={padT + plotH * 0.2}
                    stroke="#f0fdf4" strokeWidth="1" />
                  <text x={padL - 8} y={padT + plotH * 0.2 + 3} textAnchor="end"
                    fill="#d1d5db" fontSize="9" fontFamily="Outfit, sans-serif">80</text>
                  {/* 0-line */}
                  <text x={padL - 8} y={padT + plotH + 3} textAnchor="end"
                    fill="#d1d5db" fontSize="9" fontFamily="Outfit, sans-serif">0</text>
                  {/* 100-line */}
                  <text x={padL - 8} y={padT + 3} textAnchor="end"
                    fill="#d1d5db" fontSize="9" fontFamily="Outfit, sans-serif">100</text>

                  {/* Bars */}
                  {filteredScores.map((entry, i) => {
                    const totalBarSpace = plotW;
                    const gap = Math.max(2, totalBarSpace * 0.04);
                    const bw = Math.max(6, (totalBarSpace - gap * filteredScores.length) / filteredScores.length);
                    const x = padL + i * (bw + gap) + gap / 2;
                    const barH = (entry.score / 100) * plotH;
                    const y = padT + plotH - barH;
                    const barCol = entry.score >= 80 ? "#16a34a" : entry.score >= 50 ? "#d97706" : "#dc2626";
                    const modeEmoji = MODES[entry.mode]?.emoji || "";
                    return (
                      <g key={i}>
                        <rect x={x} y={y} width={bw} height={barH} rx={Math.min(4, bw/2)}
                          fill={barCol} opacity="0.75" />
                        {/* Score label on top of bar */}
                        {bw >= 12 && (
                          <text x={x + bw/2} y={y - 5} textAnchor="middle"
                            fill={barCol} fontSize="8" fontWeight="700" fontFamily="Outfit, sans-serif">
                            {entry.score}
                          </text>
                        )}
                        {/* Date label */}
                        {(filteredScores.length <= 14 || i % Math.ceil(filteredScores.length / 7) === 0) && (
                          <text x={x + bw/2} y={chartH + 5} textAnchor="middle"
                            fill="#9ca3af" fontSize="8" fontFamily="Outfit, sans-serif">
                            {entry.date.slice(8)}
                          </text>
                        )}
                      </g>
                    );
                  })}
                </svg>
              )}

              {/* Legend */}
              <div style={{ display: "flex", gap: 16, justifyContent: "center", marginTop: 8 }}>
                {[
                  { color: "#16a34a", label: "Great (80+)" },
                  { color: "#d97706", label: "Solid (50-79)" },
                  { color: "#dc2626", label: "Needs work (<50)" },
                ].map((l, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, color: "#9ca3af" }}>
                    <div style={{ width: 8, height: 8, borderRadius: 2, background: l.color, opacity: 0.75 }} />
                    {l.label}
                  </div>
                ))}
              </div>
            </div>

            {/* Calorie & Protein trend (mini sparklines) */}
            {state.history.length >= 3 && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
                {/* Calorie trend */}
                <div style={{ ...cardStyle, marginBottom: 0, padding: 14 }}>
                  <div style={{ fontSize: 10, color: "#9ca3af", fontWeight: 700, marginBottom: 8 }}>🔥 AVG CALORIES</div>
                  <div style={{ fontSize: 20, fontWeight: 900, color: "#111", marginBottom: 6 }}>
                    {(state.history.slice(-7).reduce((a, d) => a + d.totalCals, 0) / Math.min(7, state.history.length)).toFixed(0)}
                  </div>
                  <svg viewBox="0 0 120 32" style={{ width: "100%", height: 32 }}>
                    {(() => {
                      const data = state.history.slice(-14).map(d => d.totalCals);
                      if (data.length < 2) return null;
                      const mn = Math.min(...data) - 50, mx = Math.max(...data) + 50, rng = mx - mn || 1;
                      const pts = data.map((v, i) => `${(i / (data.length-1)) * 116 + 2},${30 - ((v - mn) / rng) * 26}`).join(' ');
                      return <polyline points={pts} fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />;
                    })()}
                  </svg>
                  <div style={{ fontSize: 10, color: "#d1d5db" }}>Last {Math.min(14, state.history.length)} days</div>
                </div>
                {/* Protein trend */}
                <div style={{ ...cardStyle, marginBottom: 0, padding: 14 }}>
                  <div style={{ fontSize: 10, color: "#9ca3af", fontWeight: 700, marginBottom: 8 }}>💪 AVG PROTEIN</div>
                  <div style={{ fontSize: 20, fontWeight: 900, color: "#111", marginBottom: 6 }}>
                    {(state.history.slice(-7).reduce((a, d) => a + d.totalProtein, 0) / Math.min(7, state.history.length)).toFixed(0)}g
                  </div>
                  <svg viewBox="0 0 120 32" style={{ width: "100%", height: 32 }}>
                    {(() => {
                      const data = state.history.slice(-14).map(d => d.totalProtein);
                      if (data.length < 2) return null;
                      const mn = Math.min(...data) - 10, mx = Math.max(...data) + 10, rng = mx - mn || 1;
                      const pts = data.map((v, i) => `${(i / (data.length-1)) * 116 + 2},${30 - ((v - mn) / rng) * 26}`).join(' ');
                      return <polyline points={pts} fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />;
                    })()}
                  </svg>
                  <div style={{ fontSize: 10, color: "#d1d5db" }}>Last {Math.min(14, state.history.length)} days</div>
                </div>
              </div>
            )}

            {/* Recent days list */}
            <div style={cardStyle}>
              <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 12 }}>Recent Days</div>
              {state.history.length === 0 ? (
                <div style={{ color: "#9ca3af", fontSize: 13, padding: 16, textAlign: "center" }}>
                  No history yet — complete today first.
                </div>
              ) : (
                state.history.slice(-10).reverse().map((day, i) => (
                  <div key={i} style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "12px 0", borderBottom: i < Math.min(9, state.history.length - 1) ? "1px solid #f3f4f6" : "none",
                  }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#111" }}>{day.date}</div>
                      <div style={{ fontSize: 11, color: "#9ca3af" }}>
                        {MODES[day.mode]?.emoji} {day.totalCals} cal · {day.totalProtein}g protein · {day.steps} steps
                        {day.weight ? ` · ${day.weight}kg` : ""}
                      </div>
                    </div>
                    <ScoreRing score={day.score} size={40} />
                  </div>
                ))
              )}
            </div>

            <div style={{ textAlign: "center", marginTop: 16 }}>
              <button onClick={resetAll} style={{
                background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626",
                borderRadius: 10, padding: "8px 24px", fontSize: 12, cursor: "pointer", fontWeight: 700,
              }}>Reset All Data</button>
            </div>
          </div>
          );
        })()}

        {/* ════════ COACH ════════ */}
        {view === "coach" && (() => {

          // Build data summary for Claude
          function buildDataSummary() {
            const hist = state.history;
            const last7 = hist.slice(-7);
            const last30 = hist.slice(-30);
            const weightLogs = hist.filter(d => d.weight).map(d => ({ date: d.date, weight: d.weight }));
            const avgScore7 = last7.length > 0 ? (last7.reduce((a, d) => a + d.score, 0) / last7.length).toFixed(0) : "N/A";
            const avgCals7 = last7.length > 0 ? (last7.reduce((a, d) => a + d.totalCals, 0) / last7.length).toFixed(0) : "N/A";
            const avgProtein7 = last7.length > 0 ? (last7.reduce((a, d) => a + d.totalProtein, 0) / last7.length).toFixed(0) : "N/A";
            const avgSteps7 = last7.length > 0 ? (last7.reduce((a, d) => a + d.steps, 0) / last7.length).toFixed(0) : "N/A";
            const avgWater7 = last7.length > 0 ? (last7.reduce((a, d) => a + d.water, 0) / last7.length).toFixed(2) : "N/A";
            const workoutDays7 = last7.filter(d => d.workout).length;
            const socialDays7 = last7.filter(d => d.mode === "social").length;
            const travelDays7 = last7.filter(d => d.mode === "travel").length;
            const homeDays7 = last7.filter(d => d.mode === "home").length;
            const daysOver7 = last7.filter(d => {
              const t = d.mode === "travel" ? 2000 : d.mode === "social" ? 1900 : 1700;
              return d.totalCals > t;
            }).length;
            const lowProteinDays = last7.filter(d => d.totalProtein < 160 && d.totalProtein > 0).length;
            const lowStepDays = last7.filter(d => d.steps < 8000 && d.steps > 0).length;

            return `ZUBAIR'S WEIGHT LOSS DATA — LIVE FROM APP

PROFILE:
- Male, 40+, 6'1" (185 cm), Cholesterol condition
- Halal diet, South Asian cuisine
- Remote/hybrid, sedentary desk job
- Start weight: ${PROFILE.startWeight} kg, Current: ${state.latestWeight} kg, Target: ${PROFILE.targetWeight} kg
- Total lost: ${(PROFILE.startWeight - state.latestWeight).toFixed(1)} kg
- BMI: ${calcBMI(state.latestWeight, PROFILE.height)}
- Current streak: ${state.streak} days, Best streak: ${state.bestStreak} days
- Journey week: ${state.weekNumber}

DAILY TARGETS: 1700 cal (home) / 1900 (social) / 2000 (travel), 160g protein, 8000 steps, 3L water

TODAY (${cd.date}):
- Mode: ${cd.mode}
- Calories: ${cd.totalCals} / ${calTarget} | Protein: ${cd.totalProtein}g / 160g
- Steps: ${cd.steps} / 8000 | Water: ${cd.water}L / 3L
- Workout: ${cd.workout ? "Done" : "Not yet"}
- Meals logged: ${cd.meals.map(m => `${m.name} (${m.cals} cal, ${m.protein}g)`).join("; ") || "None yet"}
- Current score: ${todayScore}/100

LAST 7 DAYS SUMMARY:
- Days tracked: ${last7.length}
- Avg score: ${avgScore7}/100
- Avg calories: ${avgCals7} | Avg protein: ${avgProtein7}g
- Avg steps: ${avgSteps7} | Avg water: ${avgWater7}L
- Workout days: ${workoutDays7}/7
- Mode split: ${homeDays7} home, ${socialDays7} social, ${travelDays7} travel
- Days over calorie budget: ${daysOver7}
- Days under protein target: ${lowProteinDays}
- Days under step goal: ${lowStepDays}

LAST 7 DAYS DETAIL:
${last7.map(d => `${d.date} | ${MODES[d.mode]?.label || d.mode} | ${d.totalCals} cal | ${d.totalProtein}g protein | ${d.steps} steps | ${d.water}L water | ${d.workout ? "Workout ✓" : "No workout"} | Score: ${d.score}`).join("\n") || "No history yet"}

WEIGHT LOG:
${weightLogs.length > 0 ? weightLogs.map(w => `${w.date}: ${w.weight} kg`).join("\n") : "No weight entries yet"}

TOTAL HISTORY: ${hist.length} days tracked`;
          }

          async function getCoachFeedback() {
            setCoachLoading(true);
            setCoachError(null);
            setCoachFeedback(null);
            try {
              const dataSummary = buildDataSummary();
              const response = await fetch("https://api.anthropic.com/v1/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  model: "claude-sonnet-4-20250514",
                  max_tokens: 1000,
                  messages: [{
                    role: "user",
                    content: `You are Zubair's personal weight loss coach. You are direct, no-nonsense, but genuinely supportive — like a tough coach who cares.

Here is Zubair's LIVE data from his tracking app:

${dataSummary}

Based on this data, give him a coaching feedback session. Structure your response EXACTLY as a JSON object (no markdown, no backticks, no preamble):

{
  "greeting": "A short personalized greeting based on time of day and his data (1 sentence)",
  "overall_grade": "A/B/C/D/F",
  "grade_reason": "Why this grade in 1 sentence",
  "wins": ["2-3 specific things he did well based on actual data"],
  "concerns": ["2-3 specific things to improve based on actual data, be specific with numbers"],
  "today_focus": "One specific actionable thing to focus on TODAY based on what's logged so far",
  "meal_suggestion": "One specific South Asian halal meal suggestion for his next meal based on remaining calorie/protein budget",
  "motivation": "A direct, personal motivational message referencing his actual progress (2-3 sentences, mention specific numbers from his data)",
  "cholesterol_tip": "One heart-health tip relevant to what he's been eating",
  "weekly_trend": "A brief analysis of his trend direction — is he improving, plateauing, or slipping? Be honest."
}

Rules:
- Reference ACTUAL numbers from his data, not generic advice
- If data is sparse (few days tracked), acknowledge that and focus on building the tracking habit
- If he had social/travel days, evaluate how well he managed them
- If calories are consistently over, call it out directly
- If protein is consistently low, flag it as priority
- Be specific: "Your avg 1,842 cal is 142 over your home budget" not "try to eat less"
- If he's doing well, celebrate it genuinely`
                  }],
                }),
              });
              const data = await response.json();
              const text = data.content?.map(i => i.text || "").join("") || "";
              const clean = text.replace(/```json|```/g, "").trim();
              const parsed = JSON.parse(clean);
              setCoachFeedback(parsed);
            } catch (err) {
              console.error(err);
              setCoachError("Couldn't connect to your coach right now. Try again in a moment.");
            }
            setCoachLoading(false);
          }

          const gradeColors = { A: "#16a34a", B: "#22c55e", C: "#d97706", D: "#ea580c", F: "#dc2626" };

          return (
          <div>
            <div style={{ fontSize: 20, fontWeight: 900, marginBottom: 4 }}>🧠 Coach</div>
            <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 20 }}>AI-powered feedback based on your real data</div>

            {/* Get Feedback Button */}
            <button onClick={getCoachFeedback} disabled={coachLoading} style={{
              width: "100%", padding: "16px 20px", borderRadius: 14,
              background: coachLoading ? "#e5e7eb" : `linear-gradient(135deg, ${accent}, ${accent}dd)`,
              color: coachLoading ? "#9ca3af" : "#fff",
              border: "none", fontSize: 16, fontWeight: 800, cursor: coachLoading ? "wait" : "pointer",
              marginBottom: 20, transition: "all 0.2s",
              boxShadow: coachLoading ? "none" : `0 4px 14px ${accent}40`,
            }}>
              {coachLoading ? (
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                  <span style={{
                    width: 18, height: 18, border: "2.5px solid #9ca3af",
                    borderTopColor: "transparent", borderRadius: "50%",
                    display: "inline-block", animation: "spin 1s linear infinite",
                  }} />
                  Analyzing your data...
                </span>
              ) : "🧠 Get Coach Feedback"}
            </button>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

            {coachError && (
              <div style={{
                padding: "12px 16px", borderRadius: 12, background: "#fef2f2",
                border: "1px solid #fecaca", color: "#dc2626", fontSize: 13, marginBottom: 20,
              }}>{coachError}</div>
            )}

            {/* Feedback Results */}
            {coachFeedback && (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {/* Grade + Greeting */}
                <div style={{
                  ...cardStyle, marginBottom: 0, display: "flex", alignItems: "center", gap: 16,
                  background: `${gradeColors[coachFeedback.overall_grade] || "#6b7280"}08`,
                  border: `1.5px solid ${gradeColors[coachFeedback.overall_grade] || "#6b7280"}25`,
                }}>
                  <div style={{
                    width: 64, height: 64, borderRadius: 16, display: "flex", alignItems: "center",
                    justifyContent: "center", fontSize: 32, fontWeight: 900,
                    background: `${gradeColors[coachFeedback.overall_grade] || "#6b7280"}15`,
                    color: gradeColors[coachFeedback.overall_grade] || "#6b7280",
                    border: `2px solid ${gradeColors[coachFeedback.overall_grade] || "#6b7280"}30`,
                    flexShrink: 0,
                  }}>
                    {coachFeedback.overall_grade}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#111", marginBottom: 4 }}>
                      {coachFeedback.greeting}
                    </div>
                    <div style={{ fontSize: 12, color: "#6b7280" }}>{coachFeedback.grade_reason}</div>
                  </div>
                </div>

                {/* Wins */}
                <div style={{ ...cardStyle, marginBottom: 0, background: "#f0fdf4", border: "1px solid #bbf7d0" }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: "#16a34a", marginBottom: 10 }}>✅ What You Did Well</div>
                  {coachFeedback.wins?.map((w, i) => (
                    <div key={i} style={{
                      padding: "8px 0", fontSize: 13, color: "#14532d", lineHeight: 1.6,
                      borderBottom: i < coachFeedback.wins.length - 1 ? "1px solid #dcfce7" : "none",
                    }}>• {w}</div>
                  ))}
                </div>

                {/* Concerns */}
                <div style={{ ...cardStyle, marginBottom: 0, background: "#fffbeb", border: "1px solid #fde68a" }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: "#d97706", marginBottom: 10 }}>⚠️ Areas to Improve</div>
                  {coachFeedback.concerns?.map((c, i) => (
                    <div key={i} style={{
                      padding: "8px 0", fontSize: 13, color: "#78350f", lineHeight: 1.6,
                      borderBottom: i < coachFeedback.concerns.length - 1 ? "1px solid #fef3c7" : "none",
                    }}>• {c}</div>
                  ))}
                </div>

                {/* Today's Focus */}
                <div style={{
                  ...cardStyle, marginBottom: 0,
                  background: `${accent}08`, border: `1.5px solid ${accent}25`,
                }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: accent, marginBottom: 6 }}>🎯 Today's Focus</div>
                  <div style={{ fontSize: 14, color: "#111", lineHeight: 1.6, fontWeight: 600 }}>
                    {coachFeedback.today_focus}
                  </div>
                </div>

                {/* Meal Suggestion */}
                <div style={{ ...cardStyle, marginBottom: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: "#111", marginBottom: 6 }}>🍽️ Next Meal Suggestion</div>
                  <div style={{ fontSize: 13, color: "#374151", lineHeight: 1.6 }}>
                    {coachFeedback.meal_suggestion}
                  </div>
                </div>

                {/* Weekly Trend */}
                <div style={{ ...cardStyle, marginBottom: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: "#111", marginBottom: 6 }}>📊 Weekly Trend</div>
                  <div style={{ fontSize: 13, color: "#374151", lineHeight: 1.6 }}>
                    {coachFeedback.weekly_trend}
                  </div>
                </div>

                {/* Cholesterol Tip */}
                <div style={{
                  ...cardStyle, marginBottom: 0, background: "#fef2f2", border: "1px solid #fecaca",
                }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: "#dc2626", marginBottom: 6 }}>❤️ Heart Health Tip</div>
                  <div style={{ fontSize: 13, color: "#7f1d1d", lineHeight: 1.6 }}>
                    {coachFeedback.cholesterol_tip}
                  </div>
                </div>

                {/* Motivation */}
                <div style={{
                  ...cardStyle, marginBottom: 0,
                  background: "linear-gradient(135deg, #f0fdf4, #f0f9ff)",
                  border: "1px solid #bbf7d0",
                }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: "#16a34a", marginBottom: 6 }}>💪 Coach Says</div>
                  <div style={{ fontSize: 14, color: "#111", lineHeight: 1.7, fontWeight: 500 }}>
                    {coachFeedback.motivation}
                  </div>
                </div>
              </div>
            )}

            {/* Motivation card (always visible) */}
            <div onClick={() => setMotivationKey(k => k + 1)} style={{
              ...cardStyle, marginTop: 20, background: mode.bg, border: `1.5px solid ${accent}30`, cursor: "pointer",
            }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: accent, marginBottom: 8 }}>💬 Quick Motivation</div>
              <div style={{ fontSize: 15, lineHeight: 1.7, color: "#374151", fontStyle: "italic" }}>
                "{MOTIVATIONAL[(motivationKey) % MOTIVATIONAL.length]}"
              </div>
              <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 8 }}>Tap for another</div>
            </div>

            {/* 7 Rules */}
            <div style={cardStyle}>
              <div style={{ fontSize: 15, fontWeight: 900, marginBottom: 14 }}>📋 7 Non-Negotiables</div>
              {[
                "Log every meal — even bad ones. What you track, you manage.",
                "8,000 steps daily — walk during calls, park far, take stairs.",
                "Protein at every meal — 160g/day keeps muscle, burns fat.",
                "No liquid calories — no juice, no sugary chai, no soda.",
                "Sleep 7+ hours — poor sleep = cortisol = belly fat.",
                "Social mode ≠ cheat mode — it's smart-choice mode.",
                "Weigh in weekly (Fri AM, after bathroom, before food).",
              ].map((rule, i) => (
                <div key={i} style={{
                  padding: "10px 0", borderBottom: i < 6 ? "1px solid #f3f4f6" : "none",
                  fontSize: 13, color: "#374151", lineHeight: 1.6,
                }}>
                  <span style={{ color: accent, fontWeight: 900, marginRight: 6 }}>{i+1}.</span>{rule}
                </div>
              ))}
            </div>

            {/* Heart health */}
            <div style={{
              ...cardStyle, background: "#fef2f2", border: "1px solid #fecaca",
            }}>
              <div style={{ fontSize: 15, fontWeight: 900, marginBottom: 10, color: "#dc2626" }}>❤️ Heart Health</div>
              {[
                "Olive oil / mustard oil over ghee and butter",
                "Fatty fish (salmon, sardines) 2x/week for omega-3s",
                "Oats for breakfast 3x/week — lowers cholesterol",
                "Limit red meat to 1-2x/week, lean cuts only",
                "Add methi, garlic, turmeric to cooking",
                "Almonds + walnuts daily (30g) — lowers LDL",
              ].map((tip, i) => (
                <div key={i} style={{
                  padding: "8px 0", fontSize: 13, color: "#7f1d1d", lineHeight: 1.5,
                  borderBottom: i < 5 ? "1px solid #fecaca50" : "none",
                }}>
                  ❤️‍🩹 {tip}
                </div>
              ))}
            </div>

            {/* PWA Install */}
            <div style={{
              ...cardStyle, background: "#f0f9ff", border: "1px solid #bae6fd",
            }}>
              <div style={{ fontSize: 15, fontWeight: 900, marginBottom: 8, color: "#0369a1" }}>📱 Install on iPhone</div>
              <div style={{ fontSize: 13, color: "#0c4a6e", lineHeight: 1.7 }}>
                <strong>1.</strong> Open this page in Safari<br/>
                <strong>2.</strong> Tap the Share button (square with arrow)<br/>
                <strong>3.</strong> Scroll down → "Add to Home Screen"<br/>
                <strong>4.</strong> Tap "Add"
              </div>
            </div>
          </div>
          );
        })()}
      </div>

      {/* ─── BOTTOM NAV ─── */}
      <div style={{
        position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
        width: "100%", maxWidth: 480, background: "#fff",
        borderTop: "1px solid #f3f4f6", display: "flex",
        boxShadow: "0 -2px 10px rgba(0,0,0,0.04)", zIndex: 100,
      }}>
        {navItems.map(item => (
          <button key={item.id} onClick={() => setView(item.id)} style={{
            flex: 1, padding: "8px 0 12px", background: "none", border: "none",
            color: view === item.id ? accent : "#9ca3af",
            fontSize: 10, fontWeight: view === item.id ? 800 : 500,
            cursor: "pointer", display: "flex", flexDirection: "column",
            alignItems: "center", gap: 2, transition: "all 0.15s",
            letterSpacing: 0.3,
          }}>
            <span style={{ fontSize: 18 }}>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
