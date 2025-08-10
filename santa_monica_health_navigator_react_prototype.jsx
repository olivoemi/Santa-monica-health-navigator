import React, { useState, useCallback, useMemo } from "react";

// Hoisted constants and helpers for better performance (avoid re-allocating on each render)
const STATIC_PROVIDERS = [
  {
    id: "ucla_er",
    name: "UCLA Santa Monica Medical Center",
    type: "ER",
    address: "1250 16th St, Santa Monica, CA",
    lat: 34.0194,
    lng: -118.4896,
    phone: "+1-310-319-xxx",
    acceptedInsurances: ["Medicare", "Aetna", "Blue Cross"]
  },
  {
    id: "sm_primary_ocean",
    name: "Santa Monica Primary Care - Ocean Ave",
    type: "Primary Care",
    address: "200 Ocean Ave, Santa Monica, CA",
    lat: 34.0115,
    lng: -118.4921,
    phone: "+1-310-555-1212",
    acceptedInsurances: ["Aetna", "Blue Cross", "UHC"]
  },
  {
    id: "sm_urgent",
    name: "Santa Monica Urgent Care",
    type: "Urgent Care",
    address: "1800 Wilshire Blvd, Santa Monica, CA",
    lat: 34.0396,
    lng: -118.4413,
    phone: "+1-310-555-9876",
    acceptedInsurances: ["Aetna", "UHC"]
  },
  {
    id: "ortho_sm",
    name: "Orthopedics of Santa Monica",
    type: "Specialty",
    specialty: "Orthopedics",
    address: "930 Broadway, Santa Monica, CA",
    lat: 34.0312,
    lng: -118.4466,
    phone: "+1-310-555-3333",
    acceptedInsurances: ["Blue Cross", "UHC"]
  }
];

const REGIONS = [
  { id: "head", label: "Head / Face" },
  { id: "neck", label: "Neck" },
  { id: "chest", label: "Chest" },
  { id: "abdomen", label: "Abdomen" },
  { id: "pelvis", label: "Pelvis / Groin" },
  { id: "leftShoulder", label: "Left Shoulder" },
  { id: "rightShoulder", label: "Right Shoulder" },
  { id: "leftArm", label: "Left Arm" },
  { id: "rightArm", label: "Right Arm" },
  { id: "leftHand", label: "Left Hand / Wrist" },
  { id: "rightHand", label: "Right Hand / Wrist" },
  { id: "leftLeg", label: "Left Leg" },
  { id: "rightLeg", label: "Right Leg" },
  { id: "leftFoot", label: "Left Foot / Ankle" },
  { id: "rightFoot", label: "Right Foot / Ankle" },
  { id: "back", label: "Back" }
];

const COMMON_SYMPTOMS = {
  head: ["Headache", "Dizziness", "Facial swelling", "Vision changes", "Loss of consciousness"],
  neck: ["Stiff neck", "Neck pain", "Swelling"],
  chest: ["Chest pain", "Shortness of breath", "Palpitations", "Coughing blood"],
  abdomen: ["Abdominal pain", "Nausea", "Vomiting", "Severe abdominal pain"],
  pelvis: ["Pelvic pain", "Urinary pain", "Groin swelling"],
  leftShoulder: ["Pain", "Limited range of motion", "Swelling"],
  rightShoulder: ["Pain", "Limited range of motion", "Swelling"],
  leftArm: ["Pain", "Numbness", "Weakness"],
  rightArm: ["Pain", "Numbness", "Weakness"],
  leftHand: ["Wrist pain", "Numb fingers", "Swelling"],
  rightHand: ["Wrist pain", "Numb fingers", "Swelling"],
  leftLeg: ["Pain", "Swelling", "Difficulty walking", "Redness"],
  rightLeg: ["Pain", "Swelling", "Difficulty walking", "Redness"],
  leftFoot: ["Ankle pain", "Difficulty bearing weight", "Swelling"],
  rightFoot: ["Ankle pain", "Difficulty bearing weight", "Swelling"],
  back: ["Lower back pain", "Upper back pain", "Radiating leg pain"]
};

const REGION_ID_TO_LABEL = Object.fromEntries(REGIONS.map(r => [r.id, r.label]));

function mapsDirectionsUrl({ address, lat, lng }) {
  if (lat && lng) return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(lat + ',' + lng)}`;
  if (address) return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
  return 'https://www.google.com/maps';
}

// Memoized SVG component to avoid re-creating the SVG tree on unrelated state changes
const AnatomicalSVG = React.memo(function AnatomicalSVG({ selectedRegion, onRegionClick }) {
  return (
    <svg viewBox="0 0 300 700" className="w-full h-auto" role="img" aria-label="Anatomical body selector">
      <ellipse cx="150" cy="70" rx="45" ry="55" fill={selectedRegion === 'head' ? '#60A5FA' : '#E5E7EB'} onClick={() => onRegionClick('head')} style={{cursor: 'pointer'}} />
      <rect x="135" y="125" width="30" height="20" rx="8" fill={selectedRegion === 'neck' ? '#60A5FA' : '#E5E7EB'} onClick={() => onRegionClick('neck')} style={{cursor: 'pointer'}} />
      <ellipse cx="95" cy="160" rx="35" ry="18" fill={selectedRegion === 'leftShoulder' ? '#60A5FA' : '#E5E7EB'} onClick={() => onRegionClick('leftShoulder')} style={{cursor: 'pointer'}} />
      <ellipse cx="205" cy="160" rx="35" ry="18" fill={selectedRegion === 'rightShoulder' ? '#60A5FA' : '#E5E7EB'} onClick={() => onRegionClick('rightShoulder')} style={{cursor: 'pointer'}} />
      <path d="M110 145 q40 -10 80 0 v80 q-40 10 -80 0 z" fill={selectedRegion === 'chest' ? '#60A5FA' : '#E5E7EB'} onClick={() => onRegionClick('chest')} style={{cursor: 'pointer'}} />
      <rect x="120" y="235" width="60" height="70" rx="14" fill={selectedRegion === 'abdomen' ? '#60A5FA' : '#E5E7EB'} onClick={() => onRegionClick('abdomen')} style={{cursor: 'pointer'}} />
      <rect x="115" y="310" width="70" height="50" rx="10" fill={selectedRegion === 'pelvis' ? '#60A5FA' : '#E5E7EB'} onClick={() => onRegionClick('pelvis')} style={{cursor: 'pointer'}} />
      <rect x="50" y="175" width="40" height="150" rx="20" fill={selectedRegion === 'leftArm' ? '#60A5FA' : '#E5E7EB'} onClick={() => onRegionClick('leftArm')} style={{cursor: 'pointer'}} />
      <rect x="210" y="175" width="40" height="150" rx="20" fill={selectedRegion === 'rightArm' ? '#60A5FA' : '#E5E7EB'} onClick={() => onRegionClick('rightArm')} style={{cursor: 'pointer'}} />
      <rect x="35" y="325" width="28" height="40" rx="8" fill={selectedRegion === 'leftHand' ? '#60A5FA' : '#E5E7EB'} onClick={() => onRegionClick('leftHand')} style={{cursor: 'pointer'}} />
      <rect x="237" y="325" width="28" height="40" rx="8" fill={selectedRegion === 'rightHand' ? '#60A5FA' : '#E5E7EB'} onClick={() => onRegionClick('rightHand')} style={{cursor: 'pointer'}} />
      <rect x="90" y="375" width="120" height="60" rx="12" fill={selectedRegion === 'back' ? '#60A5FA' : '#E5E7EB'} onClick={() => onRegionClick('back')} style={{cursor: 'pointer'}} />
      <rect x="120" y="450" width="36" height="160" rx="14" fill={selectedRegion === 'leftLeg' ? '#60A5FA' : '#E5E7EB'} onClick={() => onRegionClick('leftLeg')} style={{cursor: 'pointer'}} />
      <rect x="164" y="450" width="36" height="160" rx="14" fill={selectedRegion === 'rightLeg' ? '#60A5FA' : '#E5E7EB'} onClick={() => onRegionClick('rightLeg')} style={{cursor: 'pointer'}} />
      <rect x="110" y="615" width="48" height="28" rx="8" fill={selectedRegion === 'leftFoot' ? '#60A5FA' : '#E5E7EB'} onClick={() => onRegionClick('leftFoot')} style={{cursor: 'pointer'}} />
      <rect x="160" y="615" width="48" height="28" rx="8" fill={selectedRegion === 'rightFoot' ? '#60A5FA' : '#E5E7EB'} onClick={() => onRegionClick('rightFoot')} style={{cursor: 'pointer'}} />
    </svg>
  );
});

// Local fallback triage logic (simple, safe)
function localTriageFallback({ symptoms, severity, duration, age }) {
  const redFlagRegex = /(chest pain|shortness of breath|loss of consciousness|severe abdominal pain|uncontrolled bleeding|sudden severe headache)/i;
  if (symptoms.some(s => redFlagRegex.test(s))) {
    return { level: 'emergency', rationale: 'Red-flag symptom detected' };
  }
  if (severity === 'severe') return { level: 'emergency', rationale: 'High severity reported' };
  if (severity === 'moderate' && duration === 'hours') return { level: 'urgent', rationale: 'Moderate and recent' };
  if (severity === 'mild' && duration === 'hours') return { level: 'urgent', rationale: 'Mild but recent' };
  if (age >= 65 && severity !== 'mild') return { level: 'urgent', rationale: 'Older adult with concerns' };
  return { level: 'primary', rationale: 'Routine primary care recommended' };
}

function staticPlacesFallback({ keyword, type }) {
  const kw = (keyword || '').toLowerCase();
  let filtered = STATIC_PROVIDERS;
  if (type) filtered = filtered.filter(p => p.type.toLowerCase() === type.toLowerCase());
  if (kw) filtered = filtered.filter(p => p.name.toLowerCase().includes(kw) || (p.specialty || '').toLowerCase().includes(kw) || p.type.toLowerCase().includes(kw));
  return filtered;
}

async function callTriageBackend(payload) {
  try {
    const res = await fetch('/api/triage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      return localTriageFallback(payload);
    }
    const data = await res.json();
    return data;
  } catch (err) {
    console.warn('Triage backend failed, using local fallback', err);
    return localTriageFallback(payload);
  }
}

async function callPlacesBackend({ zip, keyword, type }) {
  try {
    const params = new URLSearchParams({ zip, keyword: keyword || '', type: type || '' });
    const res = await fetch('/api/places?' + params.toString());
    if (!res.ok) {
      return staticPlacesFallback({ zip, keyword, type });
    }
    const data = await res.json();
    return data.providers || [];
  } catch (err) {
    console.warn('Places backend failed, using static fallback', err);
    return staticPlacesFallback({ zip, keyword, type });
  }
}

// Santa Monica Health Navigator — Full updated prototype
// Changes in this version:
// - More anatomically reasonable SVG with explicit hotspot coordinates
// - Frontend wired to call backend endpoints `/api/triage` and `/api/places` with robust fallbacks
// - Provider results include actionable buttons: Call, Directions (Google Maps), Open in Maps
// - Included (commented) Express backend scaffold for /api/places and /api/triage to run server-side securely
// IMPORTANT
// - Do NOT embed API keys in the client. Use the Express backend scaffold below (or your preferred server) to keep keys secret.
// - Replace placeholder API keys and endpoints in the server code before running.

export default function HealthNavigatorPrototype() {
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [symptoms, setSymptoms] = useState([]);
  const [severity, setSeverity] = useState("mild");
  const [duration, setDuration] = useState("hours");
  const [insurance, setInsurance] = useState("");
  const [zip, setZip] = useState("90401");
  const [age, setAge] = useState(35);
  const [sex, setSex] = useState("unknown");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Helper: reset selection
  const onRegionClick = useCallback((id) => {
    setSelectedRegion(id);
    setSymptoms([]);
    setSeverity("mild");
    setDuration("hours");
    setResult(null);
  }, []);

  const toggleSymptom = useCallback((s) => {
    setSymptoms(prev => (prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]));
  }, []);

  const selectedRegionLabel = useMemo(() => REGION_ID_TO_LABEL[selectedRegion], [selectedRegion]);
  const symptomOptions = useMemo(() => (COMMON_SYMPTOMS[selectedRegion] || []), [selectedRegion]);

  // Core: call triage backend (secure keys server-side). Client sends user answers; backend uses Infermedica or similar and returns structured triage.
  async function evaluateRecommendation() {
    setResult(null);
    setLoading(true);

    const payload = { selectedRegion, symptoms, severity, duration, age, sex, insurance, zip };

    // 1) Triage
    const triage = await callTriageBackend(payload);

    // Map triage to a provider type for Places search
    let targetType = 'Primary Care';
    if (triage.level === 'emergency') targetType = 'ER';
    else if (triage.level === 'urgent') targetType = 'Urgent Care';
    else if (triage.level === 'specialty') targetType = 'Specialty';

    // 2) Search for places via backend
    const providers = await callPlacesBackend({ zip, keyword: targetType });

    // 3) Filter by insurance if provided
    let final = providers;
    if (insurance && insurance.trim() !== '') {
      const ins = insurance.toLowerCase();
      final = providers.filter(p => (p.acceptedInsurances || []).some(i => i.toLowerCase().includes(ins)));
    }

    // 4) If nothing found, broaden
    if (!final || final.length === 0) {
      final = providers.length > 0 ? providers : staticPlacesFallback({ zip, keyword: targetType });
    }

    setResult({ triage, level: targetType, providers: final });
    setLoading(false);
  }

  // --- SVG: more anatomical hotspots ---
  // This SVG uses simplified but anatomically positioned shapes. You can replace with a traced SVG
  function renderAnatomicalSVG() {
    return <AnatomicalSVG selectedRegion={selectedRegion} onRegionClick={onRegionClick} />;
  }

  // UI
  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
      <div className="max-w-6xl w-full bg-white rounded-2xl shadow-md p-6">
        <h1 className="text-2xl font-semibold mb-2">Santa Monica Health Navigator</h1>
        <p className="text-sm text-gray-600 mb-4">Click a body area, answer a few quick questions, and we’ll point you to the best care in Santa Monica — ER, Urgent Care, Primary Care, or Specialty.</p>

        <div className="md:flex md:space-x-6">
          <div className="md:w-1/2">
            <div className="bg-gray-100 rounded-lg p-4">{renderAnatomicalSVG()}</div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              {REGIONS.map(r => (
                <button
                  key={r.id}
                  onClick={() => onRegionClick(r.id)}
                  aria-pressed={selectedRegion === r.id}
                  className={`text-left p-2 rounded-lg ${selectedRegion === r.id ? 'bg-blue-100' : 'bg-white'} border`}
                >
                  {r.label}
                </button>
              ))}
            </div>

            <div className="mt-4 text-xs text-gray-500">Tip: Replace the SVG with a traced anatomical SVG for production. Hotspot ids are stable (e.g. 'chest', 'leftLeg').</div>
          </div>

          <div className="md:w-1/2 mt-4 md:mt-0">
            <div className="bg-white border rounded-lg p-4 shadow-sm">
              {!selectedRegion && <div className="text-gray-600">No body area selected — click the diagram or choose a region to begin.</div>}

              {selectedRegion && (
                <div>
                  <h2 className="font-medium">Selected: {selectedRegionLabel}</h2>

                  <div className="mt-3">
                    <div className="text-sm font-semibold">Common symptoms</div>
                    <div className="mt-2 grid grid-cols-1 gap-2">
                      {symptomOptions.map(s => (
                        <label key={s} className={`flex items-center space-x-2 p-2 border rounded ${symptoms.includes(s) ? 'bg-blue-50' : 'bg-white'}`}>
                          <input type="checkbox" checked={symptoms.includes(s)} onChange={() => toggleSymptom(s)} />
                          <span className="text-sm">{s}</span>
                        </label>
                      ))}

                      <label className="flex items-center space-x-2 p-2 border rounded bg-white">
                        <input type="text" placeholder="Other symptom (press Enter to add)" onKeyDown={(e) => {
                          if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                            toggleSymptom(e.currentTarget.value.trim());
                            e.currentTarget.value = '';
                          }
                        }} className="flex-1 p-1" />
                        <span className="text-xs text-gray-400">press Enter to add</span>
                      </label>
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <div>
                      <div className="text-sm font-semibold">Severity</div>
                      <div className="flex space-x-2 mt-2">
                        <button className={`px-3 py-1 rounded ${severity === 'mild' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`} onClick={() => setSeverity('mild')}>Mild</button>
                        <button className={`px-3 py-1 rounded ${severity === 'moderate' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`} onClick={() => setSeverity('moderate')}>Moderate</button>
                        <button className={`px-3 py-1 rounded ${severity === 'severe' ? 'bg-red-500 text-white' : 'bg-gray-100'}`} onClick={() => setSeverity('severe')}>Severe</button>
                      </div>
                    </div>

                    <div>
                      <div className="text-sm font-semibold">Duration</div>
                      <select value={duration} onChange={e => setDuration(e.target.value)} className="mt-2 border rounded p-2 w-full">
                        <option value="hours">Hours</option>
                        <option value="days">Days</option>
                        <option value="weeks">Weeks</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <div>
                      <div className="text-sm font-semibold">Age</div>
                      <input type="number" value={age} onChange={e => setAge(Number(e.target.value))} className="mt-2 border rounded p-2 w-full" />
                    </div>

                    <div>
                      <div className="text-sm font-semibold">Sex</div>
                      <select value={sex} onChange={e => setSex(e.target.value)} className="mt-2 border rounded p-2 w-full">
                        <option value="unknown">Prefer not to say / unknown</option>
                        <option value="female">Female</option>
                        <option value="male">Male</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-3">
                    <div className="text-sm font-semibold">Insurance (optional)</div>
                    <input value={insurance} onChange={e => setInsurance(e.target.value)} placeholder="Enter insurance name or leave blank" className="mt-2 border rounded p-2 w-full" />
                  </div>

                  <div className="mt-3">
                    <div className="text-sm font-semibold">ZIP code (defaults to Santa Monica)</div>
                    <input value={zip} onChange={e => setZip(e.target.value)} className="mt-2 border rounded p-2 w-full" />
                  </div>

                  <div className="mt-4 flex justify-between items-center">
                    <div className="text-xs text-gray-500">Prototype: triage runs via backend when available, otherwise local fallback used.</div>
                    <div className="space-x-2">
                      <button onClick={() => { setSymptoms([]); setSelectedRegion(null); setResult(null); }} className="px-3 py-2 rounded border">Reset</button>
                      <button onClick={evaluateRecommendation} className="px-4 py-2 rounded bg-blue-600 text-white">Get recommendation</button>
                    </div>
                  </div>
                </div>
              )}

              {loading && <div className="mt-4 text-sm text-gray-600">Working…</div>}

              {result && (
                <div className="mt-4 border-t pt-4">
                  <h3 className="font-semibold">Recommendation: {result.level}</h3>
                  <div className="mt-2 text-sm text-gray-700">Triage note: {result.triage?.rationale || JSON.stringify(result.triage)}</div>

                  <div className="mt-3 text-sm font-semibold">Providers near {zip} (filtered by insurance if provided)</div>
                  <ul className="mt-2 space-y-2">
                    {result.providers.length === 0 && <li className="text-sm text-gray-500">No providers found — check backend connectivity or widen search.</li>}
                    {result.providers.map(p => (
                      <li key={p.id || p.name} className="p-2 border rounded bg-gray-50 flex justify-between items-start">
                        <div>
                          <div className="font-medium">{p.name}</div>
                          <div className="text-xs text-gray-600">{p.address} • {p.phone}</div>
                          <div className="text-xs text-gray-500">Accepted: {(p.acceptedInsurances || []).join(', ') || 'Unknown'}</div>
                        </div>

                        <div className="flex flex-col space-y-2 ml-4">
                          <a href={`tel:${p.phone}`} className="px-3 py-1 border rounded text-xs text-blue-600">Call</a>
                          <a href={mapsDirectionsUrl(p)} target="_blank" rel="noopener noreferrer" className="px-3 py-1 border rounded text-xs text-green-600">Directions</a>
                          <button onClick={() => window.open(mapsDirectionsUrl(p), '_blank')} className="px-3 py-1 border rounded text-xs">Open Map</button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="mt-4 text-xs text-gray-500">Next dev steps: 1) deploy the Express backend scaffold below and add real API keys, 2) replace staticProviders with Google Places results returned by your server, 3) add appointment booking & wait-time integration.</div>
          </div>
        </div>

      </div>

      <div className="mt-6 w-full max-w-6xl text-sm text-gray-600">
        <strong>Developer notes — example Express backend scaffold (place in a separate server file, e.g. server/index.js):</strong>

        <pre className="mt-2 p-3 bg-gray-900 text-white text-xs rounded overflow-auto">{`// Express backend scaffold (example)
// npm i express node-fetch dotenv

// .env
// GOOGLE_API_KEY=your-google-api-key
// INFERMEDICA_APP_ID=your-app-id
// INFERMEDICA_APP_KEY=your-app-key

const express = require('express');
const fetch = require('node-fetch');
const app = express();
const PORT = process.env.PORT || 3001;
require('dotenv').config();

app.use(express.json());

// /api/places?zip=90401&keyword=urgent
app.get('/api/places', async (req, res) => {
  try {
    const { zip, keyword } = req.query;
    // Use Google Places Text Search or Nearby Search. Example using Text Search:
    const q = encodeURIComponent((keyword ? keyword + ' ' : '') + 'medical Santa Monica ' + (zip || ''));
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${q}&key=${process.env.GOOGLE_API_KEY}`;
    const r = await fetch(url);
    const data = await r.json();
    // map to provider shape
    const providers = (data.results || []).slice(0,10).map(p => ({
      id: p.place_id,
      name: p.name,
      address: p.formatted_address || p.vicinity,
      lat: p.geometry.location.lat,
      lng: p.geometry.location.lng,
      phone: p.formatted_phone_number || '',
      acceptedInsurances: [] // optionally enrich via another dataset
    }));
    res.json({ providers });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'places_failed' });
  }
});

// /api/triage (POST) - example using Infermedica / other triage API
app.post('/api/triage', async (req, res) => {
  try {
    const body = req.body; // { selectedRegion, symptoms, severity, duration, age, sex }
    // Example: simple mapping, but you should call a real triage API here
    // If you have Infermedica credentials, make requests to their endpoints.

    // Mocked behavior server-side for demo parity with client fallback
    const redFlagRegex = /(chest pain|shortness of breath|loss of consciousness|severe abdominal pain)/i;
    if ((body.symptoms || []).some(s => redFlagRegex.test(s))) {
      return res.json({ level: 'emergency', rationale: 'Server detected red-flag' });
    }
    if (body.severity === 'severe') return res.json({ level: 'emergency', rationale: 'Severe reported' });
    if (body.severity === 'moderate' && body.duration === 'hours') return res.json({ level: 'urgent', rationale: 'Moderate & recent' });
    return res.json({ level: 'primary', rationale: 'Default to primary care' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ level: 'primary', rationale: 'server_error' });
  }
});

app.listen(PORT, () => console.log('Server listening on', PORT));
`}</pre>

        <div className="mt-2 text-xs text-gray-500">If you want, I can: 1) generate a ready-to-run GitHub repo containing both the React app and the Express server scaffold, or 2) integrate appointment-booking links for local providers next. Which would you like?</div>
      </div>
    </div>
  );
}
