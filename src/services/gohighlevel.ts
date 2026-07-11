type CreateContactInput = {
  firstName?: string;
  lastName?: string;
  name?: string;
  email?: string;
  phone?: string;
  tags?: string[];
  customFields?: Record<string, string>;
  source?: string;
};

const GHL_API_BASE = import.meta.env.VITE_GHL_API_BASE || 'https://services.leadconnectorhq.com';
const GHL_API_VERSION = '2021-07-28';

function getRequiredEnv(name: 'VITE_GHL_API_KEY' | 'VITE_GHL_LOCATION_ID') {
  const value = import.meta.env[name];
  if (!value) {
    throw new Error(`${name} is missing. Add it to your .env file.`);
  }
  return value;
}

function splitName(name?: string) {
  const trimmed = (name || '').trim();
  if (!trimmed) return { firstName: '', lastName: '' };
  const [firstName, ...rest] = trimmed.split(/\s+/);
  return { firstName, lastName: rest.join(' ') };
}

export const ghlService = {
  initiateOAuth() {
    throw new Error('GoHighLevel OAuth is not configured for this project yet.');
  },

  async createContact(input: CreateContactInput) {
    const apiKey = getRequiredEnv('VITE_GHL_API_KEY');
    const locationId = getRequiredEnv('VITE_GHL_LOCATION_ID');

    const nameParts = splitName(input.name);
    const firstName = input.firstName || nameParts.firstName;
    const lastName = input.lastName || nameParts.lastName;

    const response = await fetch(`${GHL_API_BASE}/contacts/`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Version: GHL_API_VERSION,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        locationId,
        firstName,
        lastName,
        name: input.name || [firstName, lastName].filter(Boolean).join(' ').trim(),
        email: input.email || undefined,
        phone: input.phone || undefined,
        tags: input.tags && input.tags.length > 0 ? input.tags : undefined,
        source: input.source || undefined,
        customFields: input.customFields
          ? Object.entries(input.customFields).map(([key, value]) => ({ key, field_value: value }))
          : undefined,
      }),
    });

    if (!response.ok) {
      let detail = `${response.status} ${response.statusText}`;
      try {
        const body = await response.json();
        detail = body?.message || body?.error || detail;
      } catch {
        // keep status text fallback
      }
      throw new Error(`Failed to create GoHighLevel contact: ${detail}`);
    }

    return response.json();
  },
};

