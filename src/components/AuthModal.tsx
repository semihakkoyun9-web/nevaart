import React, { useState } from 'react';
import { User } from '../types';
import { X, UserCheck, LogOut, ShieldCheck, AlertCircle, Check, Eye, EyeOff, RotateCcw, ArrowLeft } from 'lucide-react';

interface AuthModalProps {
  currentUser: User | null;
  isFounderAccount: boolean;
  currentLang: 'tr' | 'en';
  onClose: () => void;
  onLogin: (email: string, password: string) => { ok: boolean; message: string };
  onRegister: (name: string, email: string, password: string) => { ok: boolean; message: string };
  onGoogleLogin: (name: string, email: string) => { ok: boolean; message: string };
  onLogout: () => void;
  onRestoreCuratorRole?: () => void;
  onOpenAdminPanel?: () => void;
}

const GoogleIcon = () => (
  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M23.745 12.27c0-.79-.07-1.54-.19-2.27h-11.3v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"/>
    <path fill="#34A853" d="M12.255 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96h-3.98v3.09C3.515 21.3 7.565 24 12.255 24z"/>
    <path fill="#FBBC05" d="M5.525 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62h-3.98a11.86 11.86 0 000 10.76l3.98-3.09z"/>
    <path fill="#EA4335" d="M12.255 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C18.205 1.19 15.495 0 12.255 0c-4.69 0-8.74 2.7-10.71 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"/>
  </svg>
);

export const AuthModal: React.FC<AuthModalProps> = ({
  currentUser,
  isFounderAccount,
  currentLang,
  onClose,
  onLogin,
  onRegister,
  onGoogleLogin,
  onLogout,
  onRestoreCuratorRole,
  onOpenAdminPanel,
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [googleStep, setGoogleStep] = useState<boolean>(false);
  const [googleEmail, setGoogleEmail] = useState('');
  const [googleName, setGoogleName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const res = onLogin(email.trim(), password);
    if (!res.ok) {
      setErrorMsg(res.message);
      return;
    }
    setSuccessMsg(res.message);
    setTimeout(() => onClose(), 700);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (registerPassword.length < 6) {
      setErrorMsg(currentLang === 'tr' ? 'Şifreniz en az 6 karakter olmalıdır.' : 'Password must be at least 6 characters.');
      return;
    }
    const res = onRegister(registerName.trim(), registerEmail.trim(), registerPassword);
    if (!res.ok) {
      setErrorMsg(res.message);
      return;
    }
    setSuccessMsg(res.message);
    setTimeout(() => onClose(), 800);
  };

  const handleGoogleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const cleanEmail = googleEmail.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setErrorMsg('Lütfen geçerli bir Google e-posta adresi girin.');
      return;
    }
    const derivedName = googleName.trim() || cleanEmail.split('@')[0].replace(/[._0-9]+/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
    const res = onGoogleLogin(derivedName, cleanEmail);
    if (res.ok) {
      setSuccessMsg(res.message);
      setTimeout(() => onClose(), 700);
    }
  };

  // Logged-in Profile View
  if (currentUser) {
    const roleLabel =
      currentUser.role === 'curator'
        ? (currentLang === 'tr' ? 'Baş Küratör' : 'Chief Curator')
        : currentUser.role === 'member'
        ? (currentLang === 'tr' ? 'Kayıtlı Sanatçı' : 'Registered Artist')
        : (currentLang === 'tr' ? 'Ziyaretçi' : 'Visitor');

    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="relative bg-white border border-stone-200 w-full max-w-md rounded-xl overflow-hidden shadow-2xl">
          <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-amber-800" />
              <h2 className="font-serif text-lg font-semibold text-stone-900">
                {currentLang === 'tr' ? 'Hesap Bilgileri' : 'Account'}
              </h2>
            </div>
            <button onClick={onClose} className="p-1.5 text-stone-400 hover:text-black rounded-md cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-4">
            <div className="bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="font-serif text-lg font-bold text-stone-900">{currentUser.name}</span>
                <span
                  className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold uppercase ${
                    currentUser.role === 'curator'
                      ? 'bg-[#111113] text-amber-300'
                      : currentUser.role === 'member'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-stone-200 text-stone-700'
                  }`}
                >
                  {roleLabel}
                </span>
              </div>
              <p className="text-xs font-mono text-stone-500">{currentUser.email}</p>
            </div>

            {/* Founder Curator Instant Role Restore Button (if currently previewing another role) */}
            {isFounderAccount && currentUser.role !== 'curator' && onRestoreCuratorRole && (
              <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl space-y-2.5">
                <p className="text-xs text-amber-950 leading-relaxed">
                  Kurucu küratör hesabınızla şu an <strong>{roleLabel}</strong> rolünü test ediyorsunuz. İstediğiniz zaman Baş Küratör yetkinizi geri alabilirsiniz.
                </p>
                <button
                  onClick={() => {
                    onRestoreCuratorRole();
                    onClose();
                  }}
                  className="w-full py-2.5 px-4 bg-[#111113] hover:bg-stone-800 text-amber-300 text-xs font-semibold rounded-md flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Baş Küratör Yetkisine Geri Dön</span>
                </button>
              </div>
            )}

            {currentUser.role === 'curator' && onOpenAdminPanel && (
              <button
                onClick={() => {
                  onClose();
                  onOpenAdminPanel();
                }}
                className="w-full py-2.5 px-4 bg-[#111113] hover:bg-stone-800 text-white text-xs font-semibold rounded-md flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <ShieldCheck className="w-4 h-4 text-amber-300" />
                <span>Küratör Onay &amp; Rol Paneli</span>
              </button>
            )}

            <button
              onClick={() => {
                onLogout();
                onClose();
              }}
              className="w-full py-2.5 px-4 bg-white hover:bg-red-50 text-red-700 border border-stone-200 hover:border-red-200 text-xs font-semibold rounded-md flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>{currentLang === 'tr' ? 'Çıkış Yap' : 'Sign Out'}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white border border-stone-200 w-full max-w-md rounded-xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-stone-100 flex items-start justify-between">
          <div>
            <span className="font-serif text-2xl font-semibold tracking-[0.06em] text-[#111113] uppercase">
              NevaArt
            </span>
            <p className="text-xs text-stone-500 mt-1">
              {googleStep
                ? (currentLang === 'tr' ? 'Google hesabınızla güvenli oturum açın' : 'Sign in with your Google account')
                : activeTab === 'login'
                ? (currentLang === 'tr' ? 'Dijital müze hesabınıza giriş yapın' : 'Sign in to your museum account')
                : (currentLang === 'tr' ? 'Ücretsiz müze üyeliği oluşturun' : 'Create your museum account')}
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 text-stone-400 hover:text-black rounded-md cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {errorMsg && (
            <div className="mb-4 p-3 bg-red-50 text-red-800 border border-red-200 rounded-lg text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs flex items-center gap-2">
              <Check className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {googleStep ? (
            <form onSubmit={handleGoogleSubmit} className="space-y-4">
              <button
                type="button"
                onClick={() => { setGoogleStep(false); setErrorMsg(null); }}
                className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-black cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Geri dön</span>
              </button>

              <div className="flex items-center gap-2.5 p-3 bg-stone-50 border border-stone-200 rounded-lg">
                <GoogleIcon />
                <div className="text-xs">
                  <div className="font-semibold text-stone-900">Google Hesabı ile Giriş</div>
                  <div className="text-[11px] text-stone-500">Gmail adresinizle tek adımda devam edin</div>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-700 mb-1.5">
                  Google E-Posta Adresi
                </label>
                <input
                  type="email"
                  required
                  autoFocus
                  value={googleEmail}
                  onChange={(e) => setGoogleEmail(e.target.value)}
                  placeholder="adiniz@gmail.com"
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-stone-300 rounded-lg outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-700 mb-1.5">
                  Ad Soyad (İsteğe bağlı)
                </label>
                <input
                  type="text"
                  value={googleName}
                  onChange={(e) => setGoogleName(e.target.value)}
                  placeholder="Görünecek adınız"
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-stone-300 rounded-lg outline-none focus:border-black"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#111113] hover:bg-stone-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <GoogleIcon />
                <span>Google ile Devam Et</span>
              </button>
            </form>
          ) : (
            <>
              {/* Google Sign-In Button */}
              <button
                type="button"
                onClick={() => { setGoogleStep(true); setErrorMsg(null); }}
                className="w-full py-2.5 px-4 bg-white hover:bg-stone-50 border border-stone-300 hover:border-stone-400 text-stone-800 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-2.5 shadow-2xs"
              >
                <GoogleIcon />
                <span>{currentLang === 'tr' ? 'Google ile Devam Et' : 'Continue with Google'}</span>
              </button>

              {/* Divider */}
              <div className="relative my-5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-stone-200" />
                </div>
                <div className="relative flex justify-center text-[11px]">
                  <span className="px-3 bg-white text-stone-400 font-mono uppercase">
                    {currentLang === 'tr' ? 'veya e-posta ile' : 'or with email'}
                  </span>
                </div>
              </div>

              {activeTab === 'login' ? (
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-1.5">
                      E-Posta Adresi
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="eposta@adresiniz.com"
                      className="w-full px-3.5 py-2.5 text-xs bg-white border border-stone-300 rounded-lg outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-1.5">
                      Şifre
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Şifrenizi girin"
                        className="w-full pl-3.5 pr-10 py-2.5 text-xs bg-white border border-stone-300 rounded-lg outline-none focus:border-black"
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
                      <span>Beni hatırla</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-[#111113] hover:bg-stone-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                  >
                    {currentLang === 'tr' ? 'Giriş Yap' : 'Sign In'}
                  </button>

                  <p className="text-center text-xs text-stone-500 pt-2">
                    Hesabınız yok mu?{' '}
                    <button
                      type="button"
                      onClick={() => { setActiveTab('register'); setErrorMsg(null); }}
                      className="text-black font-semibold hover:underline cursor-pointer"
                    >
                      Kayıt Olun
                    </button>
                  </p>
                </form>
              ) : (
                <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-1.5">
                      Ad Soyad
                    </label>
                    <input
                      type="text"
                      required
                      value={registerName}
                      onChange={(e) => setRegisterName(e.target.value)}
                      placeholder="Adınız Soyadınız"
                      className="w-full px-3.5 py-2.5 text-xs bg-white border border-stone-300 rounded-lg outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-1.5">
                      E-Posta Adresi
                    </label>
                    <input
                      type="email"
                      required
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      placeholder="eposta@adresiniz.com"
                      className="w-full px-3.5 py-2.5 text-xs bg-white border border-stone-300 rounded-lg outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-1.5">
                      Şifre (En az 6 karakter)
                    </label>
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      placeholder="Güçlü bir şifre oluşturun"
                      className="w-full px-3.5 py-2.5 text-xs bg-white border border-stone-300 rounded-lg outline-none focus:border-black"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-[#111113] hover:bg-stone-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                  >
                    {currentLang === 'tr' ? 'Hesap Oluştur' : 'Create Account'}
                  </button>

                  <p className="text-center text-xs text-stone-500 pt-2">
                    Zaten hesabınız var mı?{' '}
                    <button
                      type="button"
                      onClick={() => { setActiveTab('login'); setErrorMsg(null); }}
                      className="text-black font-semibold hover:underline cursor-pointer"
                    >
                      Giriş Yapın
                    </button>
                  </p>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
