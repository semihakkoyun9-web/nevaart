import React, { useState, useEffect } from 'react';
import { initialArtworks, initialCategories, initialReviews } from './data/mockArtworks';
import { Artwork, CuratorReview, User, UserRole } from './types';
import {
  hashPassword,
  evaluatePasswordStrength,
  getLoginLockoutRemainingSeconds,
  recordFailedLoginAttempt,
  clearFailedLoginAttempts,
  saveSecureSession,
  readValidSecureSession,
  clearSecureSession,
} from './utils/authSecurity';
import { Header, ActivePage } from './components/Header';
import { PanoramicGalleryShowcase } from './components/PanoramicGalleryShowcase';
import { CuratedDarkSection } from './components/CuratedDarkSection';
import { FeatureBannersSection } from './components/FeatureBannersSection';
import { ArtworkGrid } from './components/ArtworkGrid';
import { TestimonialsSection } from './components/TestimonialsSection';
import { AnalyticsSection } from './components/AnalyticsSection';
import { ArtworkDetailModal } from './components/ArtworkDetailModal';
import { UploadModal } from './components/UploadModal';
import { ExhibitionMapModal } from './components/ExhibitionMapModal';
import { AuthModal } from './components/AuthModal';
import { Footer } from './components/Footer';
import { ArtQuotesPage } from './components/ArtQuotesPage';
import { CategoriesPage } from './components/CategoriesPage';
import { FavoritesPage } from './components/FavoritesPage';
import { CuratorAdminPage, RegisteredAccount, PendingSubmission } from './components/CuratorAdminPage';

const DEFAULT_CURATOR_ACCOUNT: RegisteredAccount = {
  id: 1,
  name: 'Semih Akkoyun',
  email: 'semihakkoyun9@gmail.com',
  password: 'Semih2026!',
  role: 'curator',
  bio: 'NevaArt Kurucu Baş Küratörü.',
  joinedDate: '2026-01-01',
};

const GUEST_USER: User = {
  id: 0,
  name: 'Misafir Ziyaretçi',
  email: 'misafir@nevaart.org',
  role: 'visitor',
  joinedDate: '2026-01-01',
};

export default function App() {
  const [currentLang, setCurrentLang] = useState<'tr' | 'en'>('tr');
  const [activePage, setActivePage] = useState<ActivePage>('home');
  const [artworks, setArtworks] = useState<Artwork[]>(initialArtworks);
  const [categories] = useState(initialCategories);
  const [reviews, setReviews] = useState<CuratorReview[]>(initialReviews);

  // Gerçek Kayıtlı Hesaplar (Parolalar SHA-256 + tuz ile saklanır; yalnızca semihakkoyun9@gmail.com Baş Küratördür)
  const [accounts, setAccounts] = useState<RegisteredAccount[]>(() => {
    try {
      const saved = localStorage.getItem('nevaart_accounts_v3');
      if (saved) {
        const parsed: RegisteredAccount[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.some((a) => a.email.toLowerCase() === 'semihakkoyun9@gmail.com')) {
          return parsed;
        }
      }
    } catch {}
    return [DEFAULT_CURATOR_ACCOUNT];
  });

  // Başlangıçta kurucu hesabın parolasını SHA-256 özetine yükselt (düz metin saklama yok)
  useEffect(() => {
    const migratePlainPasswords = async () => {
      let changed = false;
      const upgraded = await Promise.all(
        accounts.map(async (acc) => {
          if (!acc.password.startsWith('sha256$') && !acc.password.startsWith('fnv$') && !acc.password.startsWith('google_oauth_verified_')) {
            changed = true;
            const hashed = await hashPassword(acc.email, acc.password);
            return { ...acc, password: hashed };
          }
          return acc;
        })
      );
      if (changed) {
        setAccounts(upgraded);
        try {
          localStorage.setItem('nevaart_accounts_v3', JSON.stringify(upgraded));
        } catch {}
      }
    };
    migratePlainPasswords();
  }, []);

  // Süreli ve Doğrulanmış Aktif Oturum (Varsayılan olarak giriş yapılmamış: null)
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const session = readValidSecureSession();
      if (session?.email) {
        const savedAccs = localStorage.getItem('nevaart_accounts_v3');
        const list: RegisteredAccount[] = savedAccs ? JSON.parse(savedAccs) : [DEFAULT_CURATOR_ACCOUNT];
        const found = list.find((a) => a.email.toLowerCase() === session.email.toLowerCase());
        if (found) {
          const { password: _, ...safeUser } = found;
          return safeUser;
        }
      }
    } catch {}
    return null;
  });

  // Onay Bekleyen Eserler Kuyruğu (Sadece yetkili küratör onaylarsa yayınlanır!)
  const [pendingSubmissions, setPendingSubmissions] = useState<PendingSubmission[]>(() => {
    try {
      const saved = localStorage.getItem('nevaart_pending_artworks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const [likedIds, setLikedIds] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('nevaart_liked_ids');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [likedQuoteIds, setLikedQuoteIds] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('nevaart_liked_quote_ids');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [museumApiSkip, setMuseumApiSkip] = useState(55);
  const [isLoadingMoreMuseum, setIsLoadingMoreMuseum] = useState(false);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const navigateTo = (page: ActivePage) => {
    if (page === 'admin' && currentUser?.role !== 'curator') {
      showToast('Küratör paneline yalnızca yetkili Küratör hesapları erişebilir.');
      return;
    }
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- GÜVENLİ GİRİŞ, KAYIT, ÇIKIŞ, ŞİFRE DEĞİŞTİRME VE RBAC ROL ATAMA ---
  const saveAccounts = (next: RegisteredAccount[]) => {
    setAccounts(next);
    try {
      localStorage.setItem('nevaart_accounts_v3', JSON.stringify(next));
    } catch {}
  };

  const handleLogin = async (
    email: string,
    password: string,
    rememberMe = true
  ): Promise<{ ok: boolean; message: string }> => {
    const lockedSec = getLoginLockoutRemainingSeconds();
    if (lockedSec > 0) {
      return {
        ok: false,
        message: `Çok fazla hatalı deneme yapıldı. Güvenlik nedeniyle lütfen ${lockedSec} saniye bekleyin.`,
      };
    }

    const cleanEmail = email.trim().toLowerCase();
    const found = accounts.find((a) => a.email.toLowerCase() === cleanEmail);
    const hashedInput = await hashPassword(cleanEmail, password);
    const isPasswordValid = found
      ? found.password === hashedInput || found.password === password
      : false;

    if (!found || !isPasswordValid) {
      const { lockedSeconds, remainingTries } = recordFailedLoginAttempt();
      if (lockedSeconds > 0) {
        return {
          ok: false,
          message: `5 hatalı deneme sınırı aşıldı. Hesap güvenliği için ${lockedSeconds} saniye kilitlendi.`,
        };
      }
      return {
        ok: false,
        message: `E-posta veya şifre hatalı. (Kalan deneme hakkı: ${remainingTries})`,
      };
    }

    clearFailedLoginAttempts();
    const { password: _, ...safeUser } = found;
    setCurrentUser(safeUser);
    saveSecureSession(found.email, rememberMe, 'password');
    showToast(
      `Hoş geldiniz, ${found.name}! (${
        found.role === 'curator'
          ? 'Baş Küratör'
          : found.role === 'member'
          ? 'Kayıtlı Sanatçı'
          : 'Ziyaretçi'
      })`
    );
    return { ok: true, message: `Hoş geldiniz, ${found.name}!` };
  };

  const handleRegister = async (
    name: string,
    email: string,
    password: string
  ): Promise<{ ok: boolean; message: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return { ok: false, message: 'Lütfen geçerli bir e-posta adresi girin.' };
    }
    const strength = evaluatePasswordStrength(password);
    if (!strength.isValid) {
      return {
        ok: false,
        message: 'Şifreniz en az 8 karakter olmalı; büyük harf, küçük harf ve rakam içermelidir.',
      };
    }
    if (accounts.some((a) => a.email.toLowerCase() === cleanEmail)) {
      return { ok: false, message: 'Bu e-posta adresi zaten kayıtlı. Lütfen giriş yapın.' };
    }

    const hashedPassword = await hashPassword(cleanEmail, password);
    const newAccount: RegisteredAccount = {
      id: Date.now(),
      name: name.trim(),
      email: cleanEmail,
      password: hashedPassword,
      role: 'visitor', // Yeni hesaplar daima Ziyaretçi olarak başlar; yetkiyi yalnızca Küratör atar!
      joinedDate: new Date().toISOString().split('T')[0],
    };
    const next = [...accounts, newAccount];
    saveAccounts(next);
    const { password: _, ...safeUser } = newAccount;
    setCurrentUser(safeUser);
    saveSecureSession(newAccount.email, true, 'password');
    showToast(`Hesabınız güvenle oluşturuldu, ${newAccount.name}! (Rol: Ziyaretçi)`);
    return { ok: true, message: `Kaydınız tamamlandı, ${newAccount.name}!` };
  };

  const isFounderAccount = currentUser?.email.toLowerCase() === 'semihakkoyun9@gmail.com';

  // Yalnızca doğrulanmış Google OAuth 2.0 JWT belirteci ile çağrılır (sahte giriş yok)
  const handleVerifiedGoogleOAuth = (
    name: string,
    email: string
  ): { ok: boolean; message: string } => {
    const cleanEmail = email.trim().toLowerCase();
    const existing = accounts.find((a) => a.email.toLowerCase() === cleanEmail);
    if (existing) {
      const { password: _, ...safeUser } = existing;
      setCurrentUser(safeUser);
      saveSecureSession(existing.email, true, 'google_oauth');
      showToast(`Google OAuth ile giriş yapıldı: ${existing.name}`);
      return { ok: true, message: `Google ile giriş yapıldı: ${existing.name}` };
    }

    const role: UserRole = cleanEmail === 'semihakkoyun9@gmail.com' ? 'curator' : 'visitor';
    const newAccount: RegisteredAccount = {
      id: Date.now(),
      name,
      email: cleanEmail,
      password: 'google_oauth_verified_' + Date.now(),
      role,
      joinedDate: new Date().toISOString().split('T')[0],
    };
    saveAccounts([...accounts, newAccount]);
    const { password: _, ...safeUser } = newAccount;
    setCurrentUser(safeUser);
    saveSecureSession(newAccount.email, true, 'google_oauth');
    showToast(`Google hesabınız doğrulandı, hoş geldiniz ${name}!`);
    return { ok: true, message: `Hoş geldiniz, ${name}!` };
  };

  const handleChangePassword = async (
    currentPassword: string,
    newPassword: string
  ): Promise<{ ok: boolean; message: string }> => {
    if (!currentUser) return { ok: false, message: 'Aktif oturum bulunamadı.' };
    const cleanEmail = currentUser.email.toLowerCase();
    const existing = accounts.find((a) => a.email.toLowerCase() === cleanEmail);
    if (!existing) return { ok: false, message: 'Hesap kaydı bulunamadı.' };

    const currentHash = await hashPassword(cleanEmail, currentPassword);
    if (existing.password !== currentHash && existing.password !== currentPassword) {
      return { ok: false, message: 'Mevcut şifreniz doğrulanamadı.' };
    }
    const strength = evaluatePasswordStrength(newPassword);
    if (!strength.isValid) {
      return {
        ok: false,
        message: 'Yeni şifreniz en az 8 karakter, büyük/küçük harf ve rakam içermelidir.',
      };
    }

    const nextHash = await hashPassword(cleanEmail, newPassword);
    const next = accounts.map((acc) =>
      acc.email.toLowerCase() === cleanEmail ? { ...acc, password: nextHash } : acc
    );
    saveAccounts(next);
    showToast('✓ Şifreniz SHA-256 ile güncellendi.');
    return { ok: true, message: 'Şifreniz başarıyla güncellendi.' };
  };

  // Kurucu Baş Küratör kendi rolünü test için değiştirdiyse tek tıkla geri alabilir
  const handleRestoreCuratorRole = () => {
    if (!currentUser || !isFounderAccount) return;
    const next = accounts.map((acc) =>
      acc.email.toLowerCase() === 'semihakkoyun9@gmail.com' ? { ...acc, role: 'curator' as UserRole } : acc
    );
    saveAccounts(next);
    setCurrentUser({ ...currentUser, role: 'curator' });
    showToast('✓ Baş Küratör yetkiniz geri yüklendi!');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    clearSecureSession();
    if (activePage === 'admin') setActivePage('home');
    showToast('Oturumunuz güvenli şekilde kapatıldı.');
  };

  // Yalnızca Baş Küratör başkalarına veya kendisine rol atayabilir!
  const handleChangeUserRole = (targetEmail: string, newRole: UserRole) => {
    if (!currentUser || currentUser.role !== 'curator') {
      showToast('Rol değiştirme yetkiniz bulunmuyor.');
      return;
    }
    const next = accounts.map((acc) =>
      acc.email.toLowerCase() === targetEmail.toLowerCase() ? { ...acc, role: newRole } : acc
    );
    saveAccounts(next);

    if (currentUser.email.toLowerCase() === targetEmail.toLowerCase()) {
      setCurrentUser({ ...currentUser, role: newRole });
      if (newRole !== 'curator') {
        setActivePage('home');
      }
    }
    showToast(`${targetEmail} hesabının rolü "${newRole}" olarak güncellendi.`);
  };

  // --- ESER GÖNDERME & KÜRATÖR ONAY KUYRUĞU ---
  const handleRequestUpload = () => {
    if (!currentUser) {
      showToast('Eser göndermek için lütfen önce giriş yapın veya kayıt olun.');
      setIsAuthOpen(true);
      return;
    }
    setIsUploadOpen(true);
  };

  const savePending = (next: PendingSubmission[]) => {
    setPendingSubmissions(next);
    try {
      localStorage.setItem('nevaart_pending_artworks', JSON.stringify(next));
    } catch {}
  };

  const handleArtworkUploaded = (newArtwork: Artwork) => {
    if (currentUser?.role === 'curator') {
      // Baş Küratör doğrudan yayınlayabilir
      setArtworks((prev) => [{ ...newArtwork, views: 0, likes: 0, isCuratorPick: true }, ...prev]);
      setSelectedArtwork(newArtwork);
      showToast(`"${newArtwork.title}" Küratör yetkisiyle doğrudan müzede yayınlandı!`);
      return;
    }

    // Ziyaretçi ve Sanatçı gönderimleri KÜRATÖR ONAY KUYRUĞUNA düşer!
    const submission: PendingSubmission = {
      id: Date.now(),
      artwork: { ...newArtwork, views: 0, likes: 0, isCuratorPick: false },
      submittedByEmail: currentUser?.email || 'bilinmiyor',
      submittedByName: currentUser?.name || 'Üye',
      submittedAt: new Date().toLocaleDateString('tr-TR'),
    };
    savePending([submission, ...pendingSubmissions]);
    showToast(`"${newArtwork.title}" küratör onayına gönderildi! Yetkili onayladıktan sonra müzede yayınlanacaktır.`);
  };

  const handleApproveSubmission = (submissionId: number) => {
    if (currentUser?.role !== 'curator') return;
    const target = pendingSubmissions.find((s) => s.id === submissionId);
    if (!target) return;
    setArtworks((prev) => [target.artwork, ...prev]);
    savePending(pendingSubmissions.filter((s) => s.id !== submissionId));
    showToast(`✓ "${target.artwork.title}" onaylandı ve müzede yayınlandı!`);
  };

  const handleRejectSubmission = (submissionId: number) => {
    if (currentUser?.role !== 'curator') return;
    const target = pendingSubmissions.find((s) => s.id === submissionId);
    savePending(pendingSubmissions.filter((s) => s.id !== submissionId));
    showToast(`✕ "${target?.artwork.title || 'Eser'}" onay kuyruğundan reddedildi.`);
  };

  const handleToggleCuratorPick = (artworkId: number) => {
    if (currentUser?.role !== 'curator') return;
    setArtworks((prev) =>
      prev.map((a) => (a.id === artworkId ? { ...a, isCuratorPick: !a.isCuratorPick } : a))
    );
  };

  const handleDeleteArtwork = (artworkId: number) => {
    if (currentUser?.role !== 'curator') return;
    setArtworks((prev) => prev.filter((a) => a.id !== artworkId));
    showToast('Eser arşivden kaldırıldı.');
  };

  // --- ETKİLEŞİM (GERÇEK GÖRÜNTÜLENME & BEĞENİLER) ---
  const handleToggleLang = () => setCurrentLang((prev) => (prev === 'tr' ? 'en' : 'tr'));

  const handleSelectArtwork = (art: Artwork) => {
    setArtworks((prev) =>
      prev.map((item) => (item.id === art.id ? { ...item, views: item.views + 1 } : item))
    );
    setSelectedArtwork({ ...art, views: art.views + 1 });
  };

  const handleLikeArtwork = (id: number) => {
    setLikedIds((prev) => {
      const isAlreadyLiked = prev.includes(id);
      const updated = isAlreadyLiked ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem('nevaart_liked_ids', JSON.stringify(updated));
      } catch {}
      setArtworks((artworksPrev) =>
        artworksPrev.map((art) =>
          art.id === id ? { ...art, likes: isAlreadyLiked ? Math.max(0, art.likes - 1) : art.likes + 1 } : art
        )
      );
      showToast(isAlreadyLiked ? 'Eser beğenilerden çıkarıldı.' : '❤️ Eser favorilerinize eklendi!');
      return updated;
    });
  };

  const handleToggleLikeQuote = (id: number) => {
    setLikedQuoteIds((prev) => {
      const exists = prev.includes(id);
      const next = exists ? prev.filter((x) => x !== id) : [...prev, id];
      try {
        localStorage.setItem('nevaart_liked_quote_ids', JSON.stringify(next));
      } catch {}
      showToast(exists ? 'Söz favorilerden çıkarıldı.' : '❤️ Söz favorilerinize kaydedildi!');
      return next;
    });
  };

  const handleAddReview = (newRev: Omit<CuratorReview, 'id' | 'date'>) => {
    const fullReview: CuratorReview = {
      ...newRev,
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
    };
    setReviews((prev) => [fullReview, ...prev]);
    showToast('Değerlendirmeniz kaydedildi.');
  };

  const handleLoadMoreFromMuseum = async (searchTerm?: string) => {
    if (isLoadingMoreMuseum) return;
    setIsLoadingMoreMuseum(true);
    try {
      const qParam = searchTerm && searchTerm.trim() ? `&q=${encodeURIComponent(searchTerm.trim())}` : '';
      const skipParam = searchTerm && searchTerm.trim() ? 0 : museumApiSkip;
      const url = `https://openaccess-api.clevelandart.org/api/artworks/?has_image=1&cc0=1&type=Painting&limit=20&skip=${skipParam}${qParam}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('API erişim hatası');
      const data = await res.json();
      const items = (data.data || []).filter((x: any) => x.images?.web?.url && x.title);

      const existingAcc = new Set(artworks.map((a) => a.accessionNumber));
      const cats: Artwork['category'][] = ['illustration', 'street', 'digital', 'architecture', 'concept'];
      let nextId = artworks.reduce((m, a) => Math.max(m, a.id), 0) + 1;

      const newWorks: Artwork[] = [];
      for (const item of items) {
        const acc = item.accession_number || `CMA.${item.id}`;
        if (existingAcc.has(acc)) continue;
        existingAcc.add(acc);
        const artist = item.creators?.[0]?.description?.replace(/\s*\(.*?\)\s*/g, '').trim() || 'Müze Ustası';
        const year = parseInt(item.creation_date_latest || item.creation_date_earliest || '1850', 10) || 1850;
        newWorks.push({
          id: nextId++,
          slug: `cma-${item.id}`,
          accessionNumber: acc,
          title: item.title,
          artist,
          artistBioTr: item.creators?.[0]?.description || `${artist}, Cleveland Museum of Art Koleksiyonu`,
          artistBioEn: item.creators?.[0]?.description || artist,
          category: cats[nextId % cats.length],
          year,
          mediumTr: `${item.technique || 'Tuval üzerine yağlı boya'} (Cleveland Museum of Art)`,
          mediumEn: item.technique || 'Oil on canvas',
          dimensions: item.measurements || 'Müze Arşiv Ebatı',
          resolution: 'Cleveland Museum of Art Open Access CC0',
          storyTr: (item.wall_description || item.description || `${artist} tarafından ${item.creation_date || year} döneminde üretilen orijinal müze eseri.`).replace(/<[^>]+>/g, ''),
          storyEn: (item.wall_description || item.description || `Original CC0 artwork by ${artist}.`).replace(/<[^>]+>/g, ''),
          technicalDetailsTr: `${item.technique || 'Yağlı boya'} · Envanter: ${acc} (CC0).`,
          technicalDetailsEn: `${item.technique || 'Oil on canvas'} · Accession: ${acc}.`,
          imageUrl: item.images.web.url,
          colorPalette: [
            { hex: '#2C3A44', percentage: 35, name: 'Müze Derin Tonu', rgb: [44, 58, 68] },
            { hex: '#8C7A6B', percentage: 35, name: 'Klasik Toprak', rgb: [140, 122, 107] },
            { hex: '#E8E2D9', percentage: 30, name: 'Tuval Alabaster', rgb: [232, 226, 217] }
          ],
          harmonyMoodTr: 'Canlı müze API piksel analizine hazır klasik tonal denge.',
          harmonyMoodEn: 'Authentic tonal balance ready for live pixel extraction.',
          views: 0,
          likes: 0,
          isCuratorPick: false,
          exhibitionLocation: {
            city: 'Cleveland',
            venue: `The Cleveland Museum of Art · ${item.department || 'Paintings'}`,
            lat: 41.509,
            lng: -81.6117
          },
          tags: [artist.toLowerCase(), 'cleveland museum', 'open access cc0', String(year)]
        });
      }

      if (newWorks.length > 0) {
        setArtworks((prev) => [...prev, ...newWorks]);
        if (!searchTerm) setMuseumApiSkip((s) => s + 20);
        showToast(`🏛️ Müze API'sinden ${newWorks.length} gerçek eser daha eklendi! (Toplam: ${artworks.length + newWorks.length})`);
      } else {
        showToast('Bu aramada yeni eser bulunamadı.');
      }
    } catch {
      showToast('Müze API bağlantısı geçici olarak yanıt vermedi.');
    } finally {
      setIsLoadingMoreMuseum(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA] text-[#111111] selection:bg-black selection:text-white">
      {notification && (
        <div className="fixed bottom-20 lg:bottom-6 right-3 left-3 sm:left-auto sm:right-6 z-50 bg-black text-white px-4 py-2.5 rounded-2xl sm:rounded-full text-xs font-medium shadow-2xl flex items-center gap-2 border border-stone-800 max-w-md sm:w-auto">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shrink-0" />
          <span className="leading-snug">{notification}</span>
        </div>
      )}

      {/* Kurucu Küratör başka bir rolü test ederken tek tıkla geri alma çubuğu */}
      {isFounderAccount && currentUser && currentUser.role !== 'curator' && (
        <div className="fixed bottom-20 lg:bottom-6 left-3 right-3 sm:right-auto sm:left-6 z-50 bg-[#111113] text-white px-4 py-2.5 rounded-lg text-xs shadow-2xl border border-amber-500/40 flex flex-wrap items-center justify-between gap-2 sm:gap-3">
          <span className="text-stone-300">
            Şu an <strong className="text-white">{currentUser.role === 'member' ? 'Kayıtlı Sanatçı' : 'Ziyaretçi'}</strong> rolünü test ediyorsunuz
          </span>
          <button
            onClick={handleRestoreCuratorRole}
            className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded text-[11px] cursor-pointer transition-colors shrink-0"
          >
            ↩ Küratör Rolüne Dön
          </button>
        </div>
      )}

      <Header
        activePage={activePage}
        currentLang={currentLang}
        onToggleLang={handleToggleLang}
        currentUser={currentUser}
        onNavigate={navigateTo}
        onOpenUpload={handleRequestUpload}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenMap={() => setIsMapOpen(true)}
        favoritesCount={likedIds.length + likedQuoteIds.length}
        pendingCount={pendingSubmissions.length}
      />

      <main className={`flex-1 ${activePage === 'home' ? '' : 'pt-20 sm:pt-24'}`}>
        {activePage === 'quotes' ? (
          <ArtQuotesPage
            currentLang={currentLang}
            likedQuoteIds={likedQuoteIds}
            onToggleLikeQuote={handleToggleLikeQuote}
            onBack={() => navigateTo('home')}
          />
        ) : activePage === 'collection' ? (
          <CategoriesPage
            artworks={artworks}
            categories={categories}
            currentLang={currentLang}
            likedIds={likedIds}
            onSelectArtwork={handleSelectArtwork}
            onLikeArtwork={handleLikeArtwork}
            onBack={() => navigateTo('home')}
            onLoadMoreFromMuseum={handleLoadMoreFromMuseum}
            isLoadingMoreMuseum={isLoadingMoreMuseum}
          />
        ) : activePage === 'favorites' ? (
          <FavoritesPage
            artworks={artworks}
            likedArtworkIds={likedIds}
            likedQuoteIds={likedQuoteIds}
            currentLang={currentLang}
            onSelectArtwork={handleSelectArtwork}
            onToggleLikeArtwork={handleLikeArtwork}
            onToggleLikeQuote={handleToggleLikeQuote}
            onGoToCollection={() => navigateTo('collection')}
            onGoToQuotes={() => navigateTo('quotes')}
          />
        ) : activePage === 'admin' ? (
          <CuratorAdminPage
            currentUser={currentUser || GUEST_USER}
            accounts={accounts}
            pendingSubmissions={pendingSubmissions}
            artworks={artworks}
            currentLang={currentLang}
            onApproveSubmission={handleApproveSubmission}
            onRejectSubmission={handleRejectSubmission}
            onChangeUserRole={handleChangeUserRole}
            onToggleCuratorPick={handleToggleCuratorPick}
            onDeleteArtwork={handleDeleteArtwork}
            onBack={() => navigateTo('home')}
          />
        ) : (
          <>
            <PanoramicGalleryShowcase
              artworks={artworks}
              currentLang={currentLang}
              onSelectArtwork={handleSelectArtwork}
            />

            <CuratedDarkSection
              artworks={artworks}
              currentLang={currentLang}
              onSelectArtwork={handleSelectArtwork}
              onBrowseAll={() => navigateTo('collection')}
            />

            {/* Clean Museum Highlights Showcase (No duplicate heading, clean category pills!) */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-stone-200">
                <div>
                  <div className="inline-flex items-center gap-2 mb-2">
                    <span className="w-5 h-px bg-amber-700" />
                    <span className="text-[11px] uppercase tracking-[0.25em] text-amber-800 font-mono font-semibold">
                      {currentLang === 'tr' ? 'ÖNE ÇIKAN SEÇKİ' : 'CURATED HIGHLIGHTS'}
                    </span>
                  </div>
                  <h2 className="text-3xl sm:text-5xl font-display font-extrabold uppercase text-black tracking-tight leading-tight">
                    {currentLang === 'tr' ? (
                      <>MÜZE VİTRİNİ <span className="font-light text-stone-600">BAŞYAPITLAR</span></>
                    ) : (
                      <>MUSEUM <span className="font-light text-stone-600">HIGHLIGHTS</span></>
                    )}
                  </h2>
                </div>

                <button
                  onClick={() => navigateTo('collection')}
                  className="px-6 py-3 bg-black hover:bg-stone-800 text-white text-xs font-semibold uppercase tracking-wider rounded-full transition-all cursor-pointer shadow-sm whitespace-nowrap self-start md:self-auto"
                >
                  {currentLang === 'tr'
                    ? `Tüm ${artworks.length} Eseri & Renk Filtresini Aç →`
                    : `Explore All ${artworks.length} Works & Colors →`}
                </button>
              </div>

              <ArtworkGrid
                artworks={artworks.slice(0, 6)}
                categories={categories}
                currentLang={currentLang}
                onSelectArtwork={handleSelectArtwork}
                onLikeArtwork={handleLikeArtwork}
                likedIds={likedIds}
                hideHeader={true}
              />
            </section>

            <FeatureBannersSection
              artworks={artworks}
              currentLang={currentLang}
              onSelectArtwork={handleSelectArtwork}
              onOpenUpload={handleRequestUpload}
              onBrowseCategory={() => navigateTo('collection')}
            />

            <TestimonialsSection
              currentLang={currentLang}
              onOpenAllQuotes={() => navigateTo('quotes')}
            />

            <AnalyticsSection
              artworks={artworks}
              categories={categories}
              currentLang={currentLang}
            />
          </>
        )}
      </main>

      <Footer
        currentLang={currentLang}
        onOpenAnalytics={() => {
          navigateTo('home');
          setTimeout(() => document.getElementById('analitik')?.scrollIntoView({ behavior: 'smooth' }), 60);
        }}
        onOpenMap={() => setIsMapOpen(true)}
        onOpenUpload={handleRequestUpload}
      />

      {selectedArtwork && (
        <ArtworkDetailModal
          artwork={selectedArtwork}
          allArtworks={artworks}
          reviews={reviews}
          currentUser={currentUser || GUEST_USER}
          currentLang={currentLang}
          onClose={() => setSelectedArtwork(null)}
          onSelectArtwork={handleSelectArtwork}
          onAddReview={handleAddReview}
        />
      )}

      {isUploadOpen && currentUser && (
        <UploadModal
          categories={categories}
          currentUser={currentUser}
          currentLang={currentLang}
          onClose={() => setIsUploadOpen(false)}
          onArtworkUploaded={handleArtworkUploaded}
        />
      )}

      {isAuthOpen && (
        <AuthModal
          currentUser={currentUser}
          isFounderAccount={isFounderAccount}
          currentLang={currentLang}
          pendingCount={pendingSubmissions.length}
          favoritesCount={likedIds.length + likedQuoteIds.length}
          onClose={() => setIsAuthOpen(false)}
          onLogin={handleLogin}
          onRegister={handleRegister}
          onGoogleLogin={handleVerifiedGoogleOAuth}
          onChangePassword={handleChangePassword}
          onLogout={handleLogout}
          onRestoreCuratorRole={handleRestoreCuratorRole}
          onOpenAdminPanel={() => navigateTo('admin')}
          onOpenFavorites={() => navigateTo('favorites')}
        />
      )}

      {isMapOpen && (
        <ExhibitionMapModal
          currentLang={currentLang}
          onClose={() => setIsMapOpen(false)}
        />
      )}
    </div>
  );
}
