// netlify/functions/submit-contractor-quiz.cjs
// Uses .cjs because package.json has "type": "module".
const GHL_API_BASE = 'https://services.leadconnectorhq.com';
const GHL_API_VERSION = '2021-07-28';

const CUSTOM_FIELD_MAP = [
  { quizKey: 'timeline', fieldNames: ['Timeline', 'How soon do you want more jobs?'] },
  {
    quizKey: 'monthlyRevenue',
    fieldNames: ['Current Monthly Revenue', 'Monthly Revenue', 'Current Monthly revenue'],
  },
];

const corsHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function json(statusCode, body) {
  return {
    statusCode,
    headers: corsHeaders,
    body: JSON.stringify(body),
  };
}

function sanitizeString(value, maxLen = 200) {
  if (value == null) return '';
  return String(value).trim().replace(/[\u0000-\u001F\u007F]/g, '').slice(0, maxLen);
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function normalizePhone(phone) {
  const digits = String(phone || '').replace(/\D/g, '');
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`;
  if (digits.length >= 10 && digits.length <= 15) return `+${digits}`;
  return '';
}

function isValidPhone(phone) {
  return Boolean(normalizePhone(phone));
}

function normalizeFieldName(name) {
  return String(name || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function buildQuizNote(data) {
  return [
    'Website Quiz Completed',
    '',
    `Timeline: ${data.timeline || '—'}`,
    `Current Monthly Revenue: ${data.monthlyRevenue || '—'}`,
    '',
    `UTM Source: ${data.utm_source || '—'}`,
    `UTM Medium: ${data.utm_medium || '—'}`,
    `UTM Campaign: ${data.utm_campaign || '—'}`,
    `UTM Content: ${data.utm_content || '—'}`,
    `fbclid: ${data.fbclid || '—'}`,
  ].join('\n');
}

async function ghlFetch(path, { method = 'GET', token, body } = {}) {
  const response = await fetch(`${GHL_API_BASE}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      Version: GHL_API_VERSION,
      Accept: 'application/json',
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  let responseBody = null;
  const text = await response.text();
  try {
    responseBody = text ? JSON.parse(text) : null;
  } catch {
    responseBody = { raw: text?.slice(0, 500) };
  }

  console.log('[submit-contractor-quiz] GHL response', {
    path,
    method,
    status: response.status,
    body: responseBody,
  });

  return { ok: response.ok, status: response.status, body: responseBody };
}

function validatePayload(raw) {
  const data = {
    firstName: sanitizeString(raw.firstName, 80),
    email: sanitizeString(raw.email, 120).toLowerCase(),
    phone: sanitizeString(raw.phone, 40),
    timeline: sanitizeString(raw.timeline, 80),
    monthlyRevenue: sanitizeString(raw.monthlyRevenue, 80),
    utm_source: sanitizeString(raw.utm_source, 120),
    utm_medium: sanitizeString(raw.utm_medium, 120),
    utm_campaign: sanitizeString(raw.utm_campaign, 120),
    utm_content: sanitizeString(raw.utm_content, 120),
    fbclid: sanitizeString(raw.fbclid, 200),
  };

  if (!data.firstName) {
    return { error: 'First name is required.' };
  }
  if (!isValidPhone(data.phone)) {
    return { error: 'A valid phone number is required.' };
  }
  if (!data.timeline) {
    return { error: 'Please tell us how soon you want more jobs.' };
  }
  if (data.email && !isValidEmail(data.email)) {
    return { error: 'A valid email address is required.' };
  }

  return { data };
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return json(405, { success: false, error: 'Method not allowed.' });
  }

  const token = process.env.GHL_PRIVATE_INTEGRATION_TOKEN;
  const locationId = process.env.GHL_LOCATION_ID;

  if (!token || !locationId) {
    console.error('[submit-contractor-quiz] Missing GHL_PRIVATE_INTEGRATION_TOKEN or GHL_LOCATION_ID');
    return json(500, {
      success: false,
      error: 'Server configuration error. Please try again later.',
    });
  }

  let raw;
  try {
    raw = JSON.parse(event.body || '{}');
  } catch {
    return json(400, { success: false, error: 'Invalid request body.' });
  }

  const validated = validatePayload(raw);
  if (validated.error) {
    return json(400, { success: false, error: validated.error });
  }

  const data = validated.data;
  const warnings = [];
  const phoneE164 = normalizePhone(data.phone);

  try {
    // 1) Load location custom fields and map quiz answers by field name
    const fieldsRes = await ghlFetch(`/locations/${locationId}/customFields?model=contact`, {
      method: 'GET',
      token,
    });

    const customFieldsList = Array.isArray(fieldsRes.body?.customFields)
      ? fieldsRes.body.customFields
      : Array.isArray(fieldsRes.body)
        ? fieldsRes.body
        : [];

    const byName = new Map();
    for (const field of customFieldsList) {
      const name = normalizeFieldName(field.name || field.fieldName || '');
      if (name && field.id) byName.set(name, field);
    }

    const mappedCustomFields = [];
    const missingFieldNames = [];

    for (const mapping of CUSTOM_FIELD_MAP) {
      const value = data[mapping.quizKey];
      if (!value) continue;

      let matched = null;
      for (const fieldName of mapping.fieldNames) {
        const field = byName.get(normalizeFieldName(fieldName));
        if (field?.id) {
          matched = field;
          break;
        }
      }

      if (matched?.id) {
        // GHL upsert expects id + field_value (key is optional and can break some accounts).
        mappedCustomFields.push({
          id: matched.id,
          field_value: value,
        });
      } else {
        missingFieldNames.push(mapping.fieldNames[0]);
      }
    }

    if (missingFieldNames.length > 0) {
      console.warn('[submit-contractor-quiz] Missing custom fields', { missingFieldNames });
      warnings.push(
        `Missing custom fields (saved to note instead): ${missingFieldNames.join(', ')}`,
      );
    }

    // 2) Upsert contact (do NOT send tags here — they overwrite)
    const upsertPayload = {
      locationId,
      firstName: data.firstName,
      name: data.firstName,
      phone: phoneE164,
      source: 'Website Quiz',
      ...(data.email ? { email: data.email } : {}),
      ...(mappedCustomFields.length > 0 ? { customFields: mappedCustomFields } : {}),
    };

    const upsertRes = await ghlFetch('/contacts/upsert', {
      method: 'POST',
      token,
      body: upsertPayload,
    });

    if (!upsertRes.ok) {
      console.error('[submit-contractor-quiz] Upsert failed', {
        status: upsertRes.status,
        body: upsertRes.body,
      });
      return json(502, {
        success: false,
        error: 'We couldn’t save your information. Please try again.',
      });
    }

    const contactId =
      upsertRes.body?.contact?.id ||
      upsertRes.body?.id ||
      upsertRes.body?.contactId ||
      null;

    if (!contactId) {
      console.error('[submit-contractor-quiz] Upsert succeeded but no contactId in response');
      return json(502, {
        success: false,
        error: 'We couldn’t save your information. Please try again.',
      });
    }

    // 3) Always save a quiz summary note so answers are visible even without custom fields
    const noteRes = await ghlFetch(`/contacts/${contactId}/notes`, {
      method: 'POST',
      token,
      body: { body: buildQuizNote(data) },
    });
    if (!noteRes.ok) {
      console.warn('[submit-contractor-quiz] Failed to create quiz note', {
        status: noteRes.status,
        body: noteRes.body,
      });
      warnings.push('Could not save quiz answers note on the contact.');
    }

    // 4) Add tag without overwriting existing tags
    const tagRes = await ghlFetch(`/contacts/${contactId}/tags`, {
      method: 'POST',
      token,
      body: { tags: ['Website Quiz Completed'] },
    });
    if (!tagRes.ok) {
      console.warn('[submit-contractor-quiz] Failed to add tag', { status: tagRes.status });
      warnings.push('Contact saved, but the Website Quiz Completed tag could not be applied.');
    }

    return json(200, {
      success: true,
      contactId,
      warnings,
    });
  } catch (err) {
    console.error('[submit-contractor-quiz] Unexpected error', {
      message: err?.message || String(err),
    });
    return json(500, {
      success: false,
      error: 'We couldn’t save your information. Please try again.',
    });
  }
};
