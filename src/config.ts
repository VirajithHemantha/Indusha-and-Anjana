export const BRIDE_NAME = 'Indusha';
export const GROOM_NAME = 'Anjana';

// Google Apps Script Web App URL (see google-apps-script/SETUP.md).
export const GOOGLE_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbyn3-OUZhjBhgs1Dai7JOLWDdNm8Dwd0JXlWswYVHJpZNTjxpbYTdPp0GPmwH_zrBjlwQ/exec';

export async function submitToSheet(sheet: 'RSVP' | 'Wishes', fields: Record<string, string>) {
  if (!GOOGLE_SCRIPT_URL.startsWith('https://script.google.com/')) {
    throw new Error('Google Apps Script URL is not configured');
  }

  const payload = new FormData();
  payload.append('sheet', sheet);
  Object.entries(fields).forEach(([key, value]) => payload.append(key, value));

  await fetch(GOOGLE_SCRIPT_URL, {
    method: 'POST',
    mode: 'no-cors',
    body: payload,
  });
}

export const PREFIXES = ['Mr.', 'Mrs.', 'Miss', 'Mr. & Mrs.', 'Family', 'Dear'] as const;

// "Dear" is a message-style option: the greeting already starts with "Dear",
// so it contributes nothing to the display name.
export function formatDisplayName(prefix: string, guestName: string) {
  const name = guestName.trim();
  if (!name) return '';
  if (prefix === 'Family') return `${name} and Family`;
  if (prefix === 'Dear' || !prefix) return name;
  return `${prefix} ${name}`;
}

// Personalised links look like {baseURL}/{guestName}?p={prefix}.
// Older links using ?prefix=&name= are still understood.
export function getGuestFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const segment = window.location.pathname.replace(/^\/+|\/+$/g, '');

  let guestName = params.get('name') || '';
  if (!guestName && segment) {
    try {
      guestName = decodeURIComponent(segment);
    } catch {
      guestName = segment;
    }
  }

  const prefix = params.get('p') || params.get('prefix') || 'Dear';
  return formatDisplayName(prefix, guestName);
}

export function buildInvitationLink(baseUrl: string, prefix: string, guestName: string) {
  const link = `${baseUrl.replace(/\/+$/, '')}/${encodeURIComponent(guestName.trim())}`;
  return prefix && prefix !== 'Dear' ? `${link}?p=${encodeURIComponent(prefix)}` : link;
}

export function buildInvitationMessage(displayName: string, link: string) {
  return `Dear ${displayName} ❤️

With joyful hearts, we warmly invite you to celebrate one of the most special days of our lives as we begin our journey together.

Please view our wedding invitation and all the event details through the link below 🌐:

${link}

Your presence would truly mean the world to us, and we would be honored to celebrate this beautiful moment together.

With love,
❤️ ${GROOM_NAME} & ${BRIDE_NAME}`;
}
