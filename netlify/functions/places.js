const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== 'GET') {
      return { statusCode: 405, body: 'Method Not Allowed' };
    }
    const params = new URLSearchParams(event.queryStringParameters || {});
    const zip = params.get('zip') || '';
    const keyword = params.get('keyword') || '';

    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      return { statusCode: 200, body: JSON.stringify({ providers: [] }) };
    }

    const q = encodeURIComponent(`${keyword ? keyword + ' ' : ''}medical Santa Monica ${zip}`.trim());
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

    return { statusCode: 200, body: JSON.stringify({ providers }) };
  } catch (err) {
    console.error('places_failed', err);
    return { statusCode: 500, body: JSON.stringify({ error: 'places_failed' }) };
  }
};