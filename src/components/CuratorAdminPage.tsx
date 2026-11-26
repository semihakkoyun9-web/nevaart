import React, { useState } from 'react';
import { Artwork, User, UserRole } from '../types';
import { ShieldCheck, CheckCircle2, XCircle, Users, Clock, Sparkles, Lock, Trash2 } from 'lucide-react';

export interface RegisteredAccount extends User {
  password: string;
}

export interface PendingSubmission {
  id: number;
  artwork: Artwork;
  submittedByEmail: string;
  submittedByName: string;
  submittedAt: string;
}

interface CuratorAdminPageProps {
  currentUser: User;
  accounts: RegisteredAccount[];
  pendingSubmissions: PendingSubmission[];
  artworks: Artwork[];
  currentLang: 'tr' | 'en';
  onApproveSubmission: (submissionId: number) => void;
  onRejectSubmission: (submissionId: number) => void;
  onChangeUserRole: (email: string, newRole: UserRole) => void;
  onToggleCuratorPick: (artworkId: number) => void;
  onDeleteArtwork: (artworkId: number) => void;
  onBack: () => void;
}

export const CuratorAdminPage: React.FC<CuratorAdminPageProps> = ({
  currentUser,
  accounts,
  pendingSubmissions,
  artworks,
  currentLang,
  onApproveSubmission,
  onRejectSubmission,
  onChangeUserRole,
  onToggleCuratorPick,
  onDeleteArtwork,
  onBack,
}) => {
  const [tab, setTab] = useState<'approvals' | 'users' | 'catalog'>('approvals');

  // Strict RBAC guard: only curator can view this page
  if (currentUser.role !== 'curator') {
    return (
      <div className="min-h-[70vh] bg-[#FAF8F5] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white border border-[#E8E2D9] rounded-2xl p-8 text-center shadow-sm">
          <div className="w-14 h-14 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="font-serif text-2xl font-semibold text-stone-900">
            {currentLang === 'tr' ? 'Yetkisiz Erişim' : 'Access Denied'}
          </h2>
          <p className="text-xs text-stone-500 mt-2 leading-relaxed">
            {currentLang === 'tr'
              ? 'Bu sayfa yalnızca Baş Küratör yetkisine sahip hesaplara özeldir. Lütfen yetkili hesabınızla giriş yapın.'
              : 'This page is restricted to Chief Curator accounts only.'}
          </p>
          <button
            onClick={onBack}
            className="mt-6 px-6 py-2.5 bg-black text-white text-xs font-semibold rounded-full cursor-pointer"
          >
            {currentLang === 'tr' ? 'Ana Sayfaya Dön' : 'Return Home'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      {/* Dark Luxury Header */}
      <div className="bg-[#111113] text-white border-b border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 mb-3">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span className="text-[11px] uppercase tracking-[0.26em] text-amber-400 font-mono font-semibold">
                  {currentLang === 'tr' ? 'YETKİLİ KÜRATÖR YÖNETİM PANELİ' : 'CURATORIAL APPROVAL & RBAC CONSOLE'}
                </span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-serif font-semibold tracking-tight">
                {currentLang === 'tr' ? 'Eser Onay & Rol Yönetimi' : 'Approvals & Role Management'}
              </h1>
              <p className="text-xs sm:text-sm text-stone-400 mt-2">
                {currentLang === 'tr'
                  ? `Aktif Küratör: ${currentUser.name} (${currentUser.email})`
                  : `Active Curator: ${currentUser.name} (${currentUser.email})`}
              </p>
            </div>

            {/* Panel Tabs */}
            <div className="inline-flex p-1.5 bg-stone-900 border border-stone-800 rounded-full self-start md:self-end">
              <button
                onClick={() => setTab('approvals')}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                  tab === 'approvals' ? 'bg-white text-black font-semibold' : 'text-stone-400 hover:text-white'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Onay Bekleyenler</span>
                {pendingSubmissions.length > 0 && (
                  <span className="bg-amber-500 text-black text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full">
                    {pendingSubmissions.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setTab('users')}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                  tab === 'users' ? 'bg-white text-black font-semibold' : 'text-stone-400 hover:text-white'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Kullanıcı & Roller ({accounts.length})</span>
              </button>

              <button
                onClick={() => setTab('catalog')}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                  tab === 'catalog' ? 'bg-white text-black font-semibold' : 'text-stone-400 hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Vitrin Yönetimi</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* TAB 1: PENDING ARTWORK APPROVALS */}
        {tab === 'approvals' && (
          <div>
            {pendingSubmissions.length === 0 ? (
              <div className="py-20 text-center bg-white border border-[#E8E2D9] rounded-2xl max-w-2xl mx-auto px-6">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-3" />
                <h2 className="font-serif text-2xl font-semibold text-stone-900">
                  Onay Bekleyen Eser Bulunmuyor
                </h2>
                <p className="text-xs text-stone-500 mt-2 max-w-md mx-auto">
                  Bir sanatçı veya üye "+ Eser Ekle" üzerinden yeni eser gönderdiğinde doğrudan buraya düşer ve yalnızca sizin onayınızla müzede yayınlanır.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {pendingSubmissions.map((sub) => (
                  <div
                    key={sub.id}
                    className="bg-white border border-[#E8E2D9] rounded-2xl overflow-hidden shadow-xs flex flex-col sm:flex-row"
                  >
                    <div className="sm:w-48 h-52 sm:h-auto bg-stone-100 shrink-0 relative">
                      <img
                        src={sub.artwork.imageUrl}
                        alt={sub.artwork.title}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-2 left-2 bg-amber-500 text-black text-[10px] font-mono font-bold px-2 py-0.5 rounded-full">
                        ONAY BEKLİYOR
                      </span>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="text-[10px] font-mono text-stone-400 uppercase">
                          Gönderen: {sub.submittedByName} ({sub.submittedByEmail}) · {sub.submittedAt}
                        </div>
                        <h3 className="font-serif text-xl font-bold text-stone-900 mt-1">
                          {sub.artwork.title}
                        </h3>
                        <p className="text-xs text-stone-600 font-medium">
                          {sub.artwork.artist} · {sub.artwork.year} · {sub.artwork.category}
                        </p>
                        <p className="text-xs text-stone-500 mt-2 line-clamp-3 leading-relaxed">
                          {sub.artwork.storyTr}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-stone-100 flex items-center gap-2">
                        <button
                          onClick={() => onApproveSubmission(sub.id)}
                          className="flex-1 py-2 px-4 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-full flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Onayla ve Yayınla</span>
                        </button>
                        <button
                          onClick={() => onRejectSubmission(sub.id)}
                          className="py-2 px-4 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-semibold rounded-full flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Reddet</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: RBAC USER & ROLE MANAGEMENT */}
        {tab === 'users' && (
          <div className="bg-white border border-[#E8E2D9] rounded-2xl overflow-hidden shadow-xs">
            <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
              <div>
                <h2 className="font-serif text-xl font-semibold text-stone-900">
                  Kayıtlı Kullanıcılar &amp; Yetki Atama (RBAC)
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  Yalnızca Küratör yetkisine sahip kullanıcılar diğer hesaplara rol atayabilir veya kendi rolünü değiştirebilir.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-200 text-[10px] font-mono uppercase tracking-wider text-stone-500">
                  <tr>
                    <th className="px-6 py-3.5">Kullanıcı</th>
                    <th className="px-6 py-3.5">E-Posta</th>
                    <th className="px-6 py-3.5">Kayıt Tarihi</th>
                    <th className="px-6 py-3.5">Mevcut Rol</th>
                    <th className="px-6 py-3.5 text-right">Rol Değiştir</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {accounts.map((acc) => {
                    const isMe = acc.email.toLowerCase() === currentUser.email.toLowerCase();
                    return (
                      <tr key={acc.email} className="hover:bg-stone-50/70">
                        <td className="px-6 py-4 font-semibold text-stone-900">
                          {acc.name}
                          {isMe && (
                            <span className="ml-2 text-[10px] font-mono bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full">
                              SİZ
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 font-mono text-stone-600">{acc.email}</td>
                        <td className="px-6 py-4 font-mono text-stone-400">{acc.joinedDate}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold uppercase ${
                              acc.role === 'curator'
                                ? 'bg-black text-amber-300'
                                : acc.role === 'member'
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                : 'bg-stone-100 text-stone-600'
                            }`}
                          >
                            {acc.role === 'curator'
                              ? 'Baş Küratör'
                              : acc.role === 'member'
                              ? 'Kayıtlı Sanatçı'
                              : 'Ziyaretçi'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <select
                            value={acc.role}
                            onChange={(e) => onChangeUserRole(acc.email, e.target.value as UserRole)}
                            className="px-3 py-1.5 bg-white border border-stone-300 rounded-lg text-xs font-medium text-stone-800 outline-none focus:border-black cursor-pointer"
                          >
                            <option value="visitor">Ziyaretçi (Salt Okunur)</option>
                            <option value="member">Kayıtlı Sanatçı (Onaylı Gönderim)</option>
                            <option value="curator">Baş Küratör (Tam Yetki)</option>
                          </select>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: LIVE CATALOG CURATOR CONTROLS */}
        {tab === 'catalog' && (
          <div className="bg-white border border-[#E8E2D9] rounded-2xl overflow-hidden shadow-xs">
            <div className="px-6 py-4 border-b border-stone-100">
              <h2 className="font-serif text-xl font-semibold text-stone-900">
                Yayındaki Eserler ({artworks.length})
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Eserlere "Küratör Seçkisi" rozeti atayın veya arşivi düzenleyin.
              </p>
            </div>
            <div className="divide-y divide-stone-100 max-h-[600px] overflow-y-auto">
              {artworks.slice(0, 30).map((art) => (
                <div key={art.id} className="px-6 py-3 flex items-center justify-between gap-4 hover:bg-stone-50">
                  <div className="flex items-center gap-3 min-w-0">
                    <img src={art.imageUrl} alt={art.title} className="w-12 h-10 rounded object-cover shrink-0 bg-stone-100" />
                    <div className="min-w-0">
                      <h4 className="font-serif font-semibold text-sm text-stone-900 truncate">{art.title}</h4>
                      <p className="text-[11px] text-stone-500 truncate">{art.artist} · {art.accessionNumber}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => onToggleCuratorPick(art.id)}
                      className={`px-3 py-1 rounded-full text-[11px] font-medium cursor-pointer transition-colors ${
                        art.isCuratorPick
                          ? 'bg-black text-amber-300'
                          : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                      }`}
                    >
                      {art.isCuratorPick ? '★ Küratör Seçkisi' : '☆ Seçkiye Al'}
                    </button>
                    <button
                      onClick={() => onDeleteArtwork(art.id)}
                      title="Arşivden Kaldır"
                      className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
