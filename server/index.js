const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// /api/places?zip=90401&keyword=urgent
app.get('/api/places', async (req, res) => {
  try {
    const { zip, keyword } = req.query;
    const q = encodeURIComponent(`${keyword ? keyword + ' ' : ''}medical Santa Monica ${zip || ''}`.trim());
    const apiKey = process.env.GOOGLE_API_KEY;

    if (!apiKey) {
      return res.status(200).json({ providers: [] });
    }

    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${q}&key=${apiKey}`;
    const r = await fetch(url);
    const data = await r.json();

    const providers = (data.results || []).slice(0, 10).map(p => ({
      id: p.place_id,
      name: p.name,
      address: p.formatted_address || p.vicinity || '',
      lat: p.geometry?.location?.lat,
      lng: p.geometry?.location?.lng,
      phone: p.formatted_phone_number || '',
      acceptedInsurances: []
    }));

    res.json({ providers });
  } catch (err) {
    console.error('places_failed', err);
    res.status(500).json({ error: 'places_failed' });
  }
});

// /api/triage (POST)
app.post('/api/triage', async (req, res) => {
  try {
    const body = req.body || {};
    const redFlagRegex = /(chest pain|shortness of breath|loss of consciousness|severe abdominal pain)/i;
    if ((body.symptoms || []).some(s => redFlagRegex.test(s))) {
      return res.json({ level: 'emergency', rationale: 'Server detected red-flag' });
    }
    if (body.severity === 'severe') return res.json({ level: 'emergency', rationale: 'Severe reported' });
    if (body.severity === 'moderate' && body.duration === 'hours') return res.json({ level: 'urgent', rationale: 'Moderate & recent' });
    return res.json({ level: 'primary', rationale: 'Default to primary care' });
  } catch (err) {
    console.error('triage_failed', err);
    res.status(500).json({ level: 'primary', rationale: 'server_error' });
  }
});

// Optionally serve static frontend if added later
app.use(express.static(path.join(__dirname, '..', 'public')));

app.listen(PORT, () => {
  console.log('Server listening on', PORT);
});