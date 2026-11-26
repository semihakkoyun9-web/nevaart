import React, { useState, useEffect, useRef } from 'react';
import { User } from '../types';
import {
  evaluatePasswordStrength,
  getLoginLockoutRemainingSeconds,
  getGoogleClientId,
  decodeGoogleJwtPayload,
} from '../utils/authSecurity';
import {
  X,
  User as UserIcon,
  LogOut,
  ShieldCheck,
  AlertCircle,
  Check,
  Eye,
  EyeOff,
  RotateCcw,
  ArrowRight,
  Heart,
  Lock,
  KeyRound,
  Calendar,
  Info,
} from 'lucide-react';

interface AuthModalProps {
  currentUser: User | null;
  isFounderAccount: boolean;
  currentLang: 'tr' | 'en';
  pendingCount?: number;
  favoritesCount?: number;
  onClose: () => void;
  onLogin: (
    email: string,
    password: string,
    rememberMe?: boolean
  ) => Promise<{ ok: boolean; message: string }>;
  onRegister: (
    name: string,
    email: string,
    password: string
  ) => Promise<{ ok: boolean; message: string }>;
  onGoogleLogin: (name: string, email: string) => { ok: boolean; message: string };
  onChangePassword?: (
    currentPassword: string,
    newPassword: string
  ) => Promise<{ ok: boolean; message: string }>;
  onLogout: () => void;
  onRestoreCuratorRole?: () => void;
  onOpenAdminPanel?: () => void;
  onOpenFavorites?: () => void;
}

const GoogleIcon = () => (
  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M23.745 12.27c0-.79-.07-1.54-.19-2.27h-11.3v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z" />
    <path fill="#34A853" d="M12.255 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96h-3.98v3.09C3.515 21.3 7.565 24 12.255 24z" />
    <path fill="#FBBC05" d="M5.525 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62h-3.98a11.86 11.86 0 000 10.76l3.98-3.09z" />
    <path fill="#EA4335" d="M12.255 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C18.205 1.19 15.495 0 12.255 0c-4.69 0-8.74 2.7-10.71 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z" />
  </svg>
);

export const AuthModal: React.FC<AuthModalProps> = ({
  currentUser,
  isFounderAccount,
  currentLang,
  pendingCount = 0,
  favoritesCount = 0,
  onClose,
  onLogin,
  onRegister,
  onGoogleLogin,
  onChangePassword,
  onLogout,
  onRestoreCuratorRole,
  onOpenAdminPanel,
  onOpenFavorites,
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirm, setRegisterConfirm] = useState('');

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [curPass, setCurPass] = useState('');
  const [newPass, setNewPass] = useState('');

  const [googleNotice, setGoogleNotice] = useState(false);
  const [lockoutSec, setLockoutSec] = useState<number>(getLoginLockoutRemainingSeconds());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const googleBtnRef = useRef<HTMLDivElement>(null);
  const googleClientId = getGoogleClientId();

  // Canlı brute-force kilitleme geri sayımı
  useEffect(() => {
    if (lockoutSec <= 0) return;
    const t = window.setInterval(() => {
      const rem = getLoginLockoutRemainingSeconds();
      setLockoutSec(rem);
    }, 1000);
    return () => window.clearInterval(t);
  }, [lockoutSec]);

  // Gerçek Google Identity Services (OAuth 2.0) — yalnızca VITE_GOOGLE_CLIENT_ID tanımlıysa yüklenir
  useEffect(() => {
    if (currentUser || !googleClientId || !googleBtnRef.current) return;

    const initGis = () => {
      const g = (window as any).google?.accounts?.id;
      if (!g || !googleBtnRef.current) return;
      g.initialize({
        client_id: googleClientId,
        callback: (response: { credential?: string }) => {
          if (!response?.credential) {
            setErrorMsg('Google kimlik doğrulama belirteci alınamadı.');
            return;
          }
          const payload = decodeGoogleJwtPayload(response.credential);
          if (!payload) {
            setErrorMsg('Google hesabı doğrulanamadı.');
            return;
          }
          const res = onGoogleLogin(payload.name, payload.email);
          if (res.ok) {
            setSuccessMsg(res.message);
            setTimeout(() => onClose(), 600);
          }
        },
      });
      g.renderButton(googleBtnRef.current, {
        theme: 'outline',
        size: 'large',
        width: 340,
        shape: 'pill',
        text: 'signin_with',
        locale: currentLang,
      });
    };

    if ((window as any).google?.accounts?.id) {
      initGis();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = initGis;
    document.head.appendChild(script);
  }, [currentUser, googleClientId, currentLang, onGoogleLogin, onClose]);

  const strength = evaluatePasswordStrength(registerPassword);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsSubmitting(true);
    const res = await onLogin(email.trim(), password, rememberMe);
    setIsSubmitting(false);
    if (!res.ok) {
      setErrorMsg(res.message);
      setLockoutSec(getLoginLockoutRemainingSeconds());
      return;
    }
    setSuccessMsg(res.message);
    setTimeout(() => onClose(), 600);
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (registerPassword !== registerConfirm) {
      setErrorMsg(
        currentLang === 'tr'
          ? 'Girilen şifreler birbiriyle eşleşmiyor.'
          : 'Passwords do not match.'
      );
      return;
    }

    setIsSubmitting(true);
    const res = await onRegister(registerName.trim(), registerEmail.trim(), registerPassword);
    setIsSubmitting(false);
    if (!res.ok) {
      setErrorMsg(res.message);
      return;
    }
    setSuccessMsg(res.message);
    setTimeout(() => onClose(), 650);
  };

  const handlePasswordChangeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onChangePassword) return;
    setErrorMsg(null);
    setSuccessMsg(null);
    const res = await onChangePassword(curPass, newPass);
    if (!res.ok) {
      setErrorMsg(res.message);
      return;
    }
    setSuccessMsg(res.message);
    setCurPass('');
    setNewPass('');
    setShowPasswordForm(false);
  };

  // =========================================================================
  // LOGGED-IN LUXURY MUSEUM PROFILE CARD
  // =========================================================================
  if (currentUser) {
    const isCurator = currentUser.role === 'curator';
    const isMember = currentUser.role === 'member';

    const roleLabel = isCurator
      ? currentLang === 'tr'
        ? 'Baş Küratör'
        : 'Chief Curator'
      : isMember
      ? currentLang === 'tr'
        ? 'Kayıtlı Sanatçı'
        : 'Registered Artist'
      : currentLang === 'tr'
      ? 'Ziyaretçi'
      : 'Visitor';

    const initials = currentUser.name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((s) => s[0]?.toUpperCase())
      .join('');

    // Mücevher çerçeveli rol halkası (üst barla birebir uyumlu)
    const outerBezelClass = isCurator
      ? 'bg-gradient-to-tr from-red-700 via-rose-500 to-amber-400 shadow-[0_0_24px_rgba(220,38,38,0.45)]'
      : isMember
      ? 'bg-gradient-to-tr from-amber-600 via-[#C59B5F] to-yellow-300 shadow-[0_0_20px_rgba(197,155,95,0.4)]'
      : 'bg-gradient-to-tr from-emerald-600 via-emerald-400 to-teal-300 shadow-[0_0_20px_rgba(16,185,129,0.4)]';

    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
        <div className="relative bg-[#FAF8F5] border border-[#E8E2D9] w-full max-w-md rounded-3xl overflow-hidden shadow-2xl">
          {/* Luxury Obsidian Profile Banner */}
          <div className="relative bg-gradient-to-br from-[#141416] via-[#1C1B1E] to-[#111113] px-6 pt-5 pb-12 text-white">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-[0.22em] text-[#E3C289]">
                <Lock className="w-3 h-3" />
                {currentLang === 'tr' ? 'Doğrulanmış Müze Profili' : 'Verified Museum Profile'}
              </span>
              <button
                onClick={onClose}
                aria-label={currentLang === 'tr' ? 'Kapat' : 'Close'}
                className="p-1.5 text-stone-400 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Overlapping Jewel-Bezel Avatar + Identity */}
          <div className="px-6 pb-6 -mt-10 relative z-10 space-y-4">
            <div className="flex items-end justify-between gap-3">
              <div className={`p-[3px] rounded-full ${outerBezelClass}`}>
                <div className="w-18 h-18 rounded-full bg-[#141416] border-2 border-[#FAF8F5] text-white flex items-center justify-center font-serif text-2xl font-semibold tracking-wider">
                  {initials || <UserIcon className="w-7 h-7" />}
                </div>
              </div>

              <span
                className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider shadow-xs ${
                  isCurator
                    ? 'bg-red-600 text-white'
                    : isMember
                    ? 'bg-amber-500 text-black'
                    : 'bg-emerald-600 text-white'
                }`}
              >
                {roleLabel}
              </span>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-semibold text-stone-900 leading-tight">
                {currentUser.name}
              </h2>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-mono text-stone-500 mt-1">
                <span>{currentUser.email}</span>
                <span className="inline-flex items-center gap-1 text-[10px] text-stone-400">
                  <Calendar className="w-3 h-3" />
                  {currentUser.joinedDate}
                </span>
              </div>
            </div>

            {/* Compact Stats Strip */}
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => {
                  if (onOpenFavorites) {
                    onClose();
                    onOpenFavorites();
                  }
                }}
                className="bg-white border border-[#E8E2D9] hover:border-stone-400 rounded-2xl p-3 text-left transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between text-stone-400 mb-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider">
                    {currentLang === 'tr' ? 'Favoriler' : 'Favorites'}
                  </span>
                  <Heart className="w-3.5 h-3.5 text-red-500 group-hover:scale-110 transition-transform" />
                </div>
                <div className="font-serif text-2xl font-semibold text-stone-900">
                  {favoritesCount}
                </div>
              </button>

              <div className="bg-white border border-[#E8E2D9] rounded-2xl p-3">
                <div className="flex items-center justify-between text-stone-400 mb-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider">
                    {currentLang === 'tr' ? 'Güvenlik' : 'Security'}
                  </span>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <div className="text-xs font-semibold text-stone-900 mt-1.5">
                  SHA-256 {currentLang === 'tr' ? 'Aktif' : 'Active'}
                </div>
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-50 text-red-800 border border-red-200 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
            {successMsg && (
              <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs flex items-center gap-2">
                <Check className="w-4 h-4 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Küratör Paneli Card (Profil içinde) */}
            {isCurator && onOpenAdminPanel && (
              <div className="bg-[#111113] text-white rounded-2xl p-4 border border-stone-800 space-y-3 shadow-lg">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#C59B5F]" />
                    <span className="text-xs font-semibold uppercase tracking-[0.14em]">
                      {currentLang === 'tr' ? 'Küratör Paneli' : 'Curator Panel'}
                    </span>
                  </div>
                  {pendingCount > 0 ? (
                    <span className="bg-red-600 text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded-full">
                      {pendingCount} {currentLang === 'tr' ? 'Onay Bekliyor' : 'Pending'}
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono text-stone-400">
                      {currentLang === 'tr' ? 'Tüm onaylar güncel' : 'Up to date'}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-stone-400 leading-relaxed">
                  {currentLang === 'tr'
                    ? 'Onay bekleyen eserleri inceleyin, kullanıcı rollerini yönetin ve müze vitrinini düzenleyin.'
                    : 'Review pending artworks, manage user roles, and curate highlights.'}
                </p>
                <button
                  onClick={() => {
                    onClose();
                    onOpenAdminPanel();
                  }}
                  className="w-full py-2.5 px-4 bg-white hover:bg-stone-100 text-[#111113] text-xs font-semibold rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <span>{currentLang === 'tr' ? 'Küratör Panelini Aç' : 'Open Curator Panel'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Founder Curator Instant Role Restore */}
            {isFounderAccount && !isCurator && onRestoreCuratorRole && (
              <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl space-y-2.5">
                <p className="text-xs text-amber-950 leading-relaxed">
                  Şu an <strong>{roleLabel}</strong> rolünü test ediyorsunuz.
                </p>
                <button
                  onClick={() => {
                    onRestoreCuratorRole();
                    onClose();
                  }}
                  className="w-full py-2 px-4 bg-[#111113] hover:bg-stone-800 text-amber-300 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Baş Küratör Yetkisine Geri Dön</span>
                </button>
              </div>
            )}

            {/* Şifre Güncelleme Bölümü */}
            {onChangePassword && (
              <div className="bg-white border border-[#E8E2D9] rounded-2xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordForm((v) => !v);
                    setErrorMsg(null);
                    setSuccessMsg(null);
                  }}
                  className="w-full px-4 py-3 text-xs font-semibold text-stone-800 hover:bg-stone-50 flex items-center justify-between cursor-pointer transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <KeyRound className="w-3.5 h-3.5 text-[#9A7137]" />
                    <span>{currentLang === 'tr' ? 'Şifremi Güncelle' : 'Change Password'}</span>
                  </span>
                  <span className="text-[10px] font-mono text-stone-400">
                    {showPasswordForm ? '−' : '+'}
                  </span>
                </button>
                {showPasswordForm && (
                  <form
                    onSubmit={handlePasswordChangeSubmit}
                    className="px-4 pb-4 pt-1 space-y-2.5 border-t border-stone-100"
                  >
                    <input
                      type="password"
                      required
                      value={curPass}
                      onChange={(e) => setCurPass(e.target.value)}
                      placeholder={currentLang === 'tr' ? 'Mevcut şifreniz' : 'Current password'}
                      className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-stone-200 rounded-lg outline-none focus:border-black"
                    />
                    <input
                      type="password"
                      required
                      value={newPass}
                      onChange={(e) => setNewPass(e.target.value)}
                      placeholder={
                        currentLang === 'tr'
                          ? 'Yeni şifre (en az 8 karakter, B/k harf + rakam)'
                          : 'New password (8+ chars, upper/lower/num)'
                      }
                      className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-stone-200 rounded-lg outline-none focus:border-black"
                    />
                    <button
                      type="submit"
                      className="w-full py-2 bg-[#111113] hover:bg-stone-800 text-white text-xs font-semibold rounded-lg cursor-pointer transition-colors"
                    >
                      {currentLang === 'tr' ? 'Şifreyi Kaydet' : 'Update Password'}
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* Role Ring Legend */}
            <div className="flex items-center justify-between px-3 py-2 bg-white border border-[#E8E2D9] rounded-xl text-[10px] font-mono text-stone-600">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-gradient-to-tr from-red-700 via-rose-500 to-amber-400 p-[2px]">
                  <span className="block w-full h-full rounded-full bg-white" />
                </span>
                {currentLang === 'tr' ? 'Baş Küratör' : 'Curator'}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-gradient-to-tr from-amber-600 via-[#C59B5F] to-yellow-300 p-[2px]">
                  <span className="block w-full h-full rounded-full bg-white" />
                </span>
                {currentLang === 'tr' ? 'Sanatçı' : 'Artist'}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-gradient-to-tr from-emerald-600 via-emerald-400 to-teal-300 p-[2px]">
                  <span className="block w-full h-full rounded-full bg-white" />
                </span>
                {currentLang === 'tr' ? 'Ziyaretçi' : 'Visitor'}
              </span>
            </div>

            <button
              onClick={() => {
                onLogout();
                onClose();
              }}
              className="w-full py-2.5 px-4 bg-white hover:bg-red-50 text-red-700 border border-stone-200 hover:border-red-200 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>{currentLang === 'tr' ? 'Güvenli Çıkış Yap' : 'Sign Out Securely'}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // SECURE LOGIN / REGISTER MODAL (NO FAKE SOCIAL AUTO-LOGIN)
  // =========================================================================
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="relative bg-white border border-stone-200 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="px-6 pt-5 pb-4 bg-[#FAF8F5] border-b border-[#E8E2D9] flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-2xl font-semibold tracking-[0.08em] text-[#111113] uppercase">
                NevaArt
              </span>
              <span className="inline-flex items-center gap-1 text-[9px] font-mono uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
                <Lock className="w-2.5 h-2.5" />
                SHA-256
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              {activeTab === 'login'
                ? currentLang === 'tr'
                  ? 'Doğrulanmış müze hesabınızla güvenle oturum açın'
                  : 'Sign in securely with your verified museum account'
                : currentLang === 'tr'
                ? 'Güçlü parolayla yeni müze üyeliği oluşturun'
                : 'Create a secure museum membership'}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label={currentLang === 'tr' ? 'Kapat' : 'Close'}
            className="p-1.5 text-stone-400 hover:text-black hover:bg-stone-200/60 rounded-full cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 sm:p-6">
          {errorMsg && (
            <div className="mb-4 p-3 bg-red-50 text-red-800 border border-red-200 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {lockoutSec > 0 && (
            <div className="mb-4 p-3 bg-amber-50 text-amber-950 border border-amber-200 rounded-xl text-xs flex items-center gap-2 font-mono">
              <Lock className="w-4 h-4 shrink-0 text-amber-700" />
              <span>
                {currentLang === 'tr'
                  ? `Güvenlik kilidi aktif: ${lockoutSec} sn`
                  : `Security lockout active: ${lockoutSec}s`}
              </span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs flex items-center gap-2">
              <Check className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Segmented Login / Register Tabs */}
          <div className="grid grid-cols-2 p-1 bg-stone-100 rounded-xl mb-4 text-xs">
            <button
              type="button"
              onClick={() => {
                setActiveTab('login');
                setErrorMsg(null);
              }}
              className={`py-2 rounded-lg font-semibold transition-all cursor-pointer ${
                activeTab === 'login'
                  ? 'bg-white text-[#111113] shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              {currentLang === 'tr' ? 'Giriş Yap' : 'Sign In'}
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('register');
                setErrorMsg(null);
              }}
              className={`py-2 rounded-lg font-semibold transition-all cursor-pointer ${
                activeTab === 'register'
                  ? 'bg-white text-[#111113] shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              {currentLang === 'tr' ? 'Kayıt Ol' : 'Register'}
            </button>
          </div>

          {activeTab === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                  {currentLang === 'tr' ? 'E-Posta Adresi' : 'Email Address'}
                </label>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="eposta@adresiniz.com"
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-stone-300 rounded-xl outline-none focus:border-black transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                  {currentLang === 'tr' ? 'Şifre' : 'Password'}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={currentLang === 'tr' ? 'Şifrenizi girin' : 'Enter your password'}
                    className="w-full pl-3.5 pr-10 py-2.5 text-xs bg-white border border-stone-300 rounded-xl outline-none focus:border-black transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 text-stone-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-stone-300 accent-black"
                  />
                  <span>{currentLang === 'tr' ? '7 gün oturumu açık tut' : 'Keep me signed in (7d)'}</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || lockoutSec > 0}
                className="w-full py-2.5 bg-[#111113] hover:bg-stone-800 disabled:opacity-50 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer shadow-sm"
              >
                {lockoutSec > 0
                  ? `${lockoutSec} sn bekleyin...`
                  : currentLang === 'tr'
                  ? 'Güvenli Giriş Yap'
                  : 'Sign In Securely'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                  {currentLang === 'tr' ? 'Ad Soyad' : 'Full Name'}
                </label>
                <input
                  type="text"
                  required
                  value={registerName}
                  onChange={(e) => setRegisterName(e.target.value)}
                  placeholder={currentLang === 'tr' ? 'Adınız Soyadınız' : 'Your full name'}
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-stone-300 rounded-xl outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                  {currentLang === 'tr' ? 'E-Posta Adresi' : 'Email Address'}
                </label>
                <input
                  type="email"
                  required
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  placeholder="eposta@adresiniz.com"
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-stone-300 rounded-xl outline-none focus:border-black"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-semibold text-stone-700">
                    {currentLang === 'tr' ? 'Şifre' : 'Password'}
                  </label>
                  {registerPassword && (
                    <span
                      className={`text-[10px] font-mono font-bold ${
                        strength.score >= 4
                          ? 'text-emerald-700'
                          : strength.score >= 2
                          ? 'text-amber-700'
                          : 'text-red-600'
                      }`}
                    >
                      {currentLang === 'tr' ? strength.labelTr : strength.labelEn}
                    </span>
                  )}
                </div>
                <input
                  type="password"
                  required
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  placeholder={currentLang === 'tr' ? 'En az 8 karakter, B/k harf ve rakam' : '8+ chars, upper, lower, number'}
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-stone-300 rounded-xl outline-none focus:border-black"
                />
                {/* Live Strength Bar */}
                {registerPassword && (
                  <div className="mt-2 space-y-1.5">
                    <div className="grid grid-cols-4 gap-1">
                      {[1, 2, 3, 4].map((step) => (
                        <div
                          key={step}
                          className={`h-1 rounded-full transition-colors ${
                            strength.score >= step
                              ? strength.score >= 4
                                ? 'bg-emerald-500'
                                : strength.score >= 2
                                ? 'bg-amber-500'
                                : 'bg-red-500'
                              : 'bg-stone-200'
                          }`}
                        />
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[10px] font-mono text-stone-500">
                      <span className={strength.requirements.length ? 'text-emerald-700' : ''}>
                        {strength.requirements.length ? '✓' : '·'} 8+ karakter
                      </span>
                      <span className={strength.requirements.upper ? 'text-emerald-700' : ''}>
                        {strength.requirements.upper ? '✓' : '·'} Büyük harf
                      </span>
                      <span className={strength.requirements.lower ? 'text-emerald-700' : ''}>
                        {strength.requirements.lower ? '✓' : '·'} Küçük harf
                      </span>
                      <span className={strength.requirements.number ? 'text-emerald-700' : ''}>
                        {strength.requirements.number ? '✓' : '·'} Rakam
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                  {currentLang === 'tr' ? 'Şifre Tekrar' : 'Confirm Password'}
                </label>
                <input
                  type="password"
                  required
                  value={registerConfirm}
                  onChange={(e) => setRegisterConfirm(e.target.value)}
                  placeholder={currentLang === 'tr' ? 'Şifrenizi tekrar girin' : 'Re-enter your password'}
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-stone-300 rounded-xl outline-none focus:border-black"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !strength.isValid}
                className="w-full py-2.5 bg-[#111113] hover:bg-stone-800 disabled:opacity-50 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                {currentLang === 'tr' ? 'Güvenli Hesap Oluştur' : 'Create Secure Account'}
              </button>
            </form>
          )}

          {/* Divider */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-stone-200" />
            </div>
            <div className="relative flex justify-center text-[10px]">
              <span className="px-3 bg-white text-stone-400 font-mono uppercase tracking-wider">
                {currentLang === 'tr' ? 'veya doğrulanmış oauth' : 'or verified oauth'}
              </span>
            </div>
          </div>

          {/* Genuine Google OAuth 2.0 Section (NO Fake Login!) */}
          {googleClientId ? (
            <div className="flex justify-center" ref={googleBtnRef} />
          ) : (
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => setGoogleNotice((v) => !v)}
                className="w-full py-2.5 px-4 bg-[#FAF8F5] hover:bg-stone-100 border border-stone-300 text-stone-800 text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2.5"
              >
                <GoogleIcon />
                <span>
                  {currentLang === 'tr' ? 'Google OAuth 2.0 ile Giriş' : 'Sign in with Google OAuth 2.0'}
                </span>
              </button>

              {googleNotice && (
                <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl text-[11px] text-stone-600 leading-relaxed flex items-start gap-2">
                  <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-stone-900 block mb-0.5">
                      {currentLang === 'tr'
                        ? 'Gerçek Google OAuth 2.0 Doğrulaması Gereklidir'
                        : 'Real Google OAuth 2.0 Client ID Required'}
                    </strong>
                    {currentLang === 'tr'
                      ? 'Sahte giriş güvenlik nedeniyle kapatılmıştır. Gerçek Google oturumu açmak için proje kökündeki .env dosyasına VITE_GOOGLE_CLIENT_ID değerinizi eklemeniz yeterlidir; eklediğinizde gerçek Google OAuth penceresi otomatik açılır.'
                      : 'Simulated login is disabled for security. Add VITE_GOOGLE_CLIENT_ID to your .env file to enable live Google OAuth 2.0.'}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
