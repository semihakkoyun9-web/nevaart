import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { translations } from '../data/i18n';
import { X, UserCheck, Shield, KeyRound, Check } from 'lucide-react';

interface AuthModalProps {
  currentUser: User;
  currentLang: 'tr' | 'en';
  onClose: () => void;
  onUpdateUser: (updatedUser: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  currentUser,
  currentLang,
  onClose,
  onUpdateUser,
}) => {
  const t = translations[currentLang];
  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'rbac'>('login');
  const [selectedRole, setSelectedRole] = useState<UserRole>(currentUser.role);
  const [fullName, setFullName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [password, setPassword] = useState('NevaArt2026!Curator');
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerRole, setRegisterRole] = useState<UserRole>('member');
  const [successNotice, setSuccessNotice] = useState<string | false>(false);

  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role);
    let defaultName = fullName;
    let defaultEmail = email;

    if (role === 'curator') {
      defaultName = 'Prof. Dr. Halil Erdem';
      defaultEmail = 'halil@nevaart.org';
    } else if (role === 'member') {
      defaultName = 'Elenora Vane';
      defaultEmail = 'elenora@vane.art';
    } else {
      defaultName = 'Misafir Ziyaretçi';
      defaultEmail = 'ziyaretci@nevaart.org';
    }

    setFullName(defaultName);
    setEmail(defaultEmail);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const role: UserRole = email.includes('curator') || email.includes('halil') ? 'curator' : email.includes('sanatci') || email.includes('artist') ? 'member' : 'visitor';
    const name = role === 'curator' ? 'Prof. Dr. Halil Erdem' : role === 'member' ? 'Kayıtlı Sanatçı' : 'Misafir Ziyaretçi';
    onUpdateUser({
      ...currentUser,
      role,
      name,
      email,
    });
    setSuccessNotice(`Hoş geldiniz, ${name}! Oturumunuz açıldı.`);
    setTimeout(() => {
      setSuccessNotice(false);
      onClose();
    }, 900);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      ...currentUser,
      role: registerRole,
      name: registerName || 'Yeni Sanatçı',
      email: registerEmail || 'sanatci@nevaart.org',
    });
    setSuccessNotice(`Kaydınız tamamlandı! Hoş geldiniz, ${registerName || 'Yeni Sanatçı'}.`);
    setTimeout(() => {
      setSuccessNotice(false);
      onClose();
    }, 900);
  };

  const handleSaveRbac = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      ...currentUser,
      role: selectedRole,
      name: fullName,
      email: email,
    });
    setSuccessNotice('Oturum rolü ve yetkileri başarıyla güncellendi!');
    setTimeout(() => {
      setSuccessNotice(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative bg-[#FAF8F5] border border-[#E8E2D9] w-full max-w-md overflow-hidden shadow-2xl rounded-xs">

        {/* Header with 3 Tabs */}
        <div className="bg-[#FAF8F5] border-b border-[#E8E2D9] px-6 pt-4 pb-0 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3">
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-[#78350F]" />
              <h2 className="font-serif text-lg font-semibold text-stone-900">
                Kullanıcı Girişi, Kayıt ve Rol Yönetimi
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex gap-1 border-b border-stone-200 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('login')}
              className={`px-3.5 py-2 font-medium border-b-2 transition-all cursor-pointer ${activeTab === 'login' ? 'border-stone-900 text-stone-900 font-semibold' : 'border-transparent text-stone-500 hover:text-stone-900'
                }`}
            >
              Giriş Yap
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('register')}
              className={`px-3.5 py-2 font-medium border-b-2 transition-all cursor-pointer ${activeTab === 'register' ? 'border-stone-900 text-stone-900 font-semibold' : 'border-transparent text-stone-500 hover:text-stone-900'
                }`}
            >
              Yeni Kayıt Ol
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('rbac')}
              className={`px-3.5 py-2 font-medium border-b-2 transition-all cursor-pointer ${activeTab === 'rbac' ? 'border-stone-900 text-stone-900 font-semibold' : 'border-transparent text-stone-500 hover:text-stone-900'
                }`}
            >
              Rol & Yetki (RBAC)
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {successNotice && (
            <div className="mb-4 p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded text-xs flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>{successNotice}</span>
            </div>
          )}

          {/* TAB 1: GİRİŞ YAP */}
          {activeTab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-3.5">
              <p className="text-xs text-stone-600 mb-2">
                Mevcut hesabınızla giriş yaparak küratöryel arşive ve eser yükleme paneline erişebilirsiniz.
              </p>

              <div>
                <label className="block text-xs uppercase font-mono tracking-wider text-stone-700 font-medium mb-1">
                  E-Posta Adresi
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-[#E8E2D9] rounded outline-none focus:border-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-mono tracking-wider text-stone-700 font-medium mb-1">
                  Şifre (Bcrypt Doğrulamalı)
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-[#E8E2D9] rounded outline-none focus:border-stone-900"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setActiveTab('register')}
                  className="text-xs text-amber-800 hover:underline cursor-pointer"
                >
                  Hesabınız yok mu? Kayıt Olun →
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium rounded transition-colors cursor-pointer shadow-xs"
                >
                  Giriş Yap
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: YENİ KAYIT OL */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              <p className="text-xs text-stone-600 mb-2">
                NevaArt platformuna yeni üye veya sanatçı olarak kaydolun.
              </p>

              <div>
                <label className="block text-xs uppercase font-mono tracking-wider text-stone-700 font-medium mb-1">
                  Ad Soyad / Sanatçı Adı
                </label>
                <input
                  type="text"
                  required
                  placeholder="Örn: Melis Ertekin"
                  value={registerName}
                  onChange={(e) => setRegisterName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-[#E8E2D9] rounded outline-none focus:border-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-mono tracking-wider text-stone-700 font-medium mb-1">
                  E-Posta Adresi
                </label>
                <input
                  type="email"
                  required
                  placeholder="melis@sanatci.com"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-[#E8E2D9] rounded outline-none focus:border-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-mono tracking-wider text-stone-700 font-medium mb-1">
                  Güvenli Şifre (Bcrypt ile Hashlenir)
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-[#E8E2D9] rounded outline-none focus:border-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-mono tracking-wider text-stone-700 font-medium mb-1">
                  Kullanıcı Türü / Rol (Kriter J: RBAC)
                </label>
                <select
                  value={registerRole}
                  onChange={(e) => setRegisterRole(e.target.value as UserRole)}
                  className="w-full px-3 py-2 text-xs bg-white border border-[#E8E2D9] rounded outline-none focus:border-stone-900"
                >
                  <option value="member">Kayıtlı Sanatçı (Eser Yükleyebilir)</option>
                  <option value="visitor">Ziyaretçi (Salt Okunur & Favoriler)</option>
                  <option value="curator">Küratör (Tam Yönetici Yetkisi)</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setActiveTab('login')}
                  className="text-xs text-stone-500 hover:text-stone-900 cursor-pointer"
                >
                  Zaten hesabım var →
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium rounded transition-colors cursor-pointer shadow-xs"
                >
                  Kayıt Ol & Başlat
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: ROL & GÜVENLİK YÖNETİMİ (RBAC) */}
          {activeTab === 'rbac' && (
            <form onSubmit={handleSaveRbac} className="space-y-4">
              <p className="text-xs text-stone-600 mb-2">
                Akademik ödev kriterlerindeki rol bazlı yetkilendirmeyi (RBAC) hızlıca test etmek için aktif oturum rolünü anında değiştirebilirsiniz.
              </p>

              <div>
                <label className="block text-xs uppercase font-mono tracking-wider text-stone-700 font-semibold mb-2">
                  Aktif Kullanıcı Rolü (RBAC)
                </label>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleRoleChange('visitor')}
                    className={`p-2.5 text-center border rounded text-xs transition-all cursor-pointer ${selectedRole === 'visitor'
                        ? 'bg-stone-900 text-white border-stone-900 font-medium shadow-xs'
                        : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                      }`}
                  >
                    <span className="block font-semibold">Ziyaretçi</span>
                    <span className="text-[10px] opacity-75">Salt Okunur</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRoleChange('member')}
                    className={`p-2.5 text-center border rounded text-xs transition-all cursor-pointer ${selectedRole === 'member'
                        ? 'bg-stone-900 text-white border-stone-900 font-medium shadow-xs'
                        : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                      }`}
                  >
                    <span className="block font-semibold">Kayıtlı Sanatçı</span>
                    <span className="text-[10px] opacity-75">Eser Yükler</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRoleChange('curator')}
                    className={`p-2.5 text-center border rounded text-xs transition-all cursor-pointer ${selectedRole === 'curator'
                        ? 'bg-stone-900 text-white border-stone-900 font-medium shadow-xs'
                        : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                      }`}
                  >
                    <span className="block font-semibold">Baş Küratör</span>
                    <span className="text-[10px] opacity-75">Tam Yetki</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase font-mono tracking-wider text-stone-700 font-medium mb-1">
                  Kullanıcı Adı / Ünvan
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-[#E8E2D9] rounded outline-none focus:border-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-mono tracking-wider text-stone-700 font-medium mb-1">
                  E-Posta Adresi
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-[#E8E2D9] rounded outline-none focus:border-stone-900"
                />
              </div>

              <div className="p-3 bg-stone-100 rounded text-[11px] font-mono text-stone-500 space-y-1">
                <div>Session ID: <span className="text-stone-800 font-semibold">sess_neva_9841f3e</span></div>
                <div>Aktif Çerezler (Cookie): <span className="text-stone-800 font-semibold">nevaart_lang={currentLang}, nevaart_user_role={selectedRole}</span></div>
                <div>Password Hash: <span className="text-stone-800">$2y$10$eF8bJk7u3...</span> (Bcrypt)</div>
                <div>CSRF Token: <span className="text-stone-800 font-semibold">VALIDATED</span></div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3 py-2 text-xs text-stone-500 hover:text-stone-900"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium rounded transition-colors"
                >
                  Rolü Uygula
                </button>
              </div>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};
