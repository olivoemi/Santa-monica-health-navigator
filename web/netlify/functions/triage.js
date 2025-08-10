exports.handler = async (event) => {
  try {
    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, body: 'Method Not Allowed' };
    }
    const body = JSON.parse(event.body || '{}');
    const redFlagRegex = /(chest pain|shortness of breath|loss of consciousness|severe abdominal pain)/i;
    if ((body.symptoms || []).some(s => redFlagRegex.test(s))) {
      return { statusCode: 200, body: JSON.stringify({ level: 'emergency', rationale: 'Server detected red-flag' }) };
    }
    if (body.severity === 'severe') {
      return { statusCode: 200, body: JSON.stringify({ level: 'emergency', rationale: 'Severe reported' }) };
    }
    if (body.severity === 'moderate' && body.duration === 'hours') {
      return { statusCode: 200, body: JSON.stringify({ level: 'urgent', rationale: 'Moderate & recent' }) };
    }
    return { statusCode: 200, body: JSON.stringify({ level: 'primary', rationale: 'Default to primary care' }) };
  } catch (err) {
    console.error('triage_failed', err);
    return { statusCode: 500, body: JSON.stringify({ level: 'primary', rationale: 'server_error' }) };
  }
};