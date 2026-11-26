/**
 * NEVAART — İstemci Tarafı Güvenli Kimlik Doğrulama Yardımcıları
 * SHA-256 tuzlu parola özeti (Web Crypto API), parola gücü analizi,
 * kaba kuvvet (brute-force) hız sınırlaması ve süreli oturum doğrulaması.
 */

const SALT_PREFIX = 'NevaArt::2026::MuseumAuth::v3::';
const SESSION_KEY = 'nevaart_secure_session_v3';
const RATE_LIMIT_KEY = 'nevaart_login_attempts_v3';
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 30_000; // 30 saniye kilitleme

/**
 * Web Crypto API ile SHA-256 + sabit uygulama tuzu + e-posta tuzu üretir.
 * Tarayıcıda crypto.subtle desteklenmiyorsa deterministik fallback özet üretir.
 */
export async function hashPassword(email: string, password: string): Promise<string> {
  const normalized = `${SALT_PREFIX}${email.trim().toLowerCase()}::${password}`;
  if (typeof window !== 'undefined' && window.crypto?.subtle) {
    const data = new TextEncoder().encode(normalized);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return 'sha256$' + hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }
  // Güvenli ortam dışı fallback
  let h = 2166136261;
  for (let i = 0; i < normalized.length; i++) {
    h ^= normalized.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return 'fnv$' + (h >>> 0).toString(16).padStart(8, '0');
}

export interface PasswordStrength {
  score: 0 | 1 | 2 | 3 | 4;
  labelTr: string;
  labelEn: string;
  isValid: boolean;
  requirements: {
    length: boolean;
    upper: boolean;
    lower: boolean;
    number: boolean;
  };
}

export function evaluatePasswordStrength(password: string): PasswordStrength {
  const requirements = {
    length: password.length >= 8,
    upper: /[A-ZÇĞİÖŞÜ]/.test(password),
    lower: /[a-zçğıöşü]/.test(password),
    number: /\d/.test(password),
  };

  const passed = Object.values(requirements).filter(Boolean).length;
  const hasSymbol = /[^A-Za-z0-9ÇĞİÖŞÜçğıöşü]/.test(password);
  const rawScore = Math.min(4, passed + (passed === 4 && hasSymbol ? 0 : 0)) as 0 | 1 | 2 | 3 | 4;

  const labels: Record<number, { tr: string; en: string }> = {
    0: { tr: 'Çok Zayıf', en: 'Very Weak' },
    1: { tr: 'Zayıf', en: 'Weak' },
    2: { tr: 'Orta', en: 'Fair' },
    3: { tr: 'İyi', en: 'Good' },
    4: { tr: 'Güçlü', en: 'Strong' },
  };

  return {
    score: rawScore,
    labelTr: labels[rawScore].tr,
    labelEn: labels[rawScore].en,
    isValid: requirements.length && requirements.upper && requirements.lower && requirements.number,
    requirements,
  };
}

// --- Brute-Force Koruması ---
interface RateLimitState {
  attempts: number;
  lockedUntil: number;
}

export function getLoginLockoutRemainingSeconds(): number {
  try {
    const raw = localStorage.getItem(RATE_LIMIT_KEY);
    if (!raw) return 0;
    const state: RateLimitState = JSON.parse(raw);
    const diff = state.lockedUntil - Date.now();
    if (diff > 0) return Math.ceil(diff / 1000);
    if (state.lockedUntil > 0) {
      localStorage.removeItem(RATE_LIMIT_KEY);
    }
  } catch {}
  return 0;
}

export function recordFailedLoginAttempt(): { lockedSeconds: number; remainingTries: number } {
  let state: RateLimitState = { attempts: 0, lockedUntil: 0 };
  try {
    const raw = localStorage.getItem(RATE_LIMIT_KEY);
    if (raw) state = JSON.parse(raw);
  } catch {}

  state.attempts += 1;
  if (state.attempts >= MAX_ATTEMPTS) {
    state.lockedUntil = Date.now() + LOCKOUT_MS;
    try {
      localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(state));
    } catch {}
    return { lockedSeconds: Math.ceil(LOCKOUT_MS / 1000), remainingTries: 0 };
  }

  try {
    localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(state));
  } catch {}
  return { lockedSeconds: 0, remainingTries: MAX_ATTEMPTS - state.attempts };
}

export function clearFailedLoginAttempts(): void {
  try {
    localStorage.removeItem(RATE_LIMIT_KEY);
  } catch {}
}

// --- Süreli Oturum Token Yönetimi ---
interface SecureSession {
  email: string;
  issuedAt: number;
  expiresAt: number;
  provider: 'password' | 'google_oauth';
}

export function saveSecureSession(
  email: string,
  rememberMe: boolean,
  provider: 'password' | 'google_oauth' = 'password'
): void {
  const ttlMs = rememberMe ? 7 * 24 * 60 * 60 * 1000 : 4 * 60 * 60 * 1000;
  const session: SecureSession = {
    email: email.trim().toLowerCase(),
    issuedAt: Date.now(),
    expiresAt: Date.now() + ttlMs,
    provider,
  };
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch {}
}

export function readValidSecureSession(): SecureSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed: SecureSession = JSON.parse(raw);
    if (!parsed?.email || typeof parsed.expiresAt !== 'number') return null;
    if (Date.now() > parsed.expiresAt) {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function clearSecureSession(): void {
  try {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem('nevaart_session_email');
  } catch {}
}

// --- Gerçek Google Identity Services (OAuth 2.0) Yardımcıları ---
export function getGoogleClientId(): string {
  const envId = (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID;
  return typeof envId === 'string' ? envId.trim() : '';
}

export function decodeGoogleJwtPayload(credential: string): {
  email: string;
  name: string;
  picture?: string;
  email_verified?: boolean;
} | null {
  try {
    const parts = credential.split('.');
    if (parts.length !== 3) return null;
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const data = JSON.parse(jsonPayload);
    if (!data?.email || !data?.email_verified) return null;
    return {
      email: String(data.email).toLowerCase(),
      name: String(data.name || data.email.split('@')[0]),
      picture: data.picture ? String(data.picture) : undefined,
      email_verified: Boolean(data.email_verified),
    };
  } catch {
    return null;
  }
}
