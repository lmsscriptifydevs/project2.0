import { jwtDecode } from 'jwt-decode';

/**
 * Fetch Google user info from access_token (implicit flow).
 * Uses your Google Cloud OAuth Client ID – no Firebase Auth required.
 * @param {string} accessToken - From useGoogleLogin onSuccess (flow: 'implicit')
 * @returns {Promise<{ google_id: string, email: string, name: string, google_image: string | null }>}
 */
export async function getGoogleUserFromToken(accessToken) {
  if (!accessToken) throw new Error('No Google access token received.');
  const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) throw new Error('Failed to fetch Google profile.');
  const data = await res.json();
  return {
    google_id: data.sub,
    email: data.email || '',
    name: data.name || data.email || 'User',
    google_image: data.picture || null,
  };
}

/**
 * Decode Google id_token JWT (e.g. from One Tap or auth-code flow).
 * @param {{ credential?: string }} credentialResponse
 * @returns {{ google_id: string, email: string, name: string, google_image: string | null }}
 */
export function decodeGoogleCredential(credentialResponse) {
  const idToken = credentialResponse?.credential;
  if (!idToken) throw new Error('No Google credential received.');
  const payload = jwtDecode(idToken);
  return {
    google_id: payload.sub,
    email: payload.email || '',
    name: payload.name || payload.email || 'User',
    google_image: payload.picture || null,
  };
}
