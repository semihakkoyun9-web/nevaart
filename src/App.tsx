import React, { useState } from 'react';
import { initialArtworks, initialCategories, initialReviews } from './data/mockArtworks';
import { Artwork, CuratorReview, User } from './types';
import { Header } from './components/Header';
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

export default function App() {
  const [currentLang, setCurrentLang] = useState<'tr' | 'en'>('tr');
  const [artworks, setArtworks] = useState<Artwork[]>(initialArtworks);
  const [categories] = useState(initialCategories);
  const [reviews, setReviews] = useState<CuratorReview[]>(initialReviews);

  const [currentUser, setCurrentUser] = useState<User>({
    id: 1,
    name: 'Prof. Dr. Halil Erdem',
    email: 'halil@nevaart.org',
    role: 'curator',
    bio: 'Baş Küratör & Sanat Tarihçisi, Viyana ve İstanbul Güzel Sanatlar Danışmanı.',
    joinedDate: '2024-01-10'
  });

  // Modal Dialog States
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Beğenilen Eserler Durumu (Kırmızı Kalp & Beğeni Sayfası)
  const [likedIds, setLikedIds] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('nevaart_liked_ids');
      return saved ? JSON.parse(saved) : [1, 3];
    } catch {
      return [1, 3];
    }
  });
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleToggleLang = () => {
    setCurrentLang((prev) => (prev === 'tr' ? 'en' : 'tr'));
  };

  const handleLikeArtwork = (id: number) => {
    setLikedIds((prev) => {
      const isAlreadyLiked = prev.includes(id);
      const updated = isAlreadyLiked ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem('nevaart_liked_ids', JSON.stringify(updated));
      } catch { }

      setArtworks((artworksPrev) =>
        artworksPrev.map((art) => {
          if (art.id === id) {
            return {
              ...art,
              likes: isAlreadyLiked ? Math.max(0, art.likes - 1) : art.likes + 1,
            };
          }
          return art;
        })
      );

      showToast(
        isAlreadyLiked
          ? (currentLang === 'tr' ? 'Eser beğenilerden çıkarıldı.' : 'Removed from favorites.')
          : (currentLang === 'tr' ? '❤️ Eser beğenildi ve favorilere eklendi!' : '❤️ Added to favorites!')
      );

      return updated;
    });
  };

  const handleArtworkUploaded = (newArtwork: Artwork) => {
    setArtworks((prev) => [newArtwork, ...prev]);
    setSelectedArtwork(newArtwork);
    showToast(
      currentLang === 'tr'
        ? `"${newArtwork.title}" başarıyla arşive kaydedildi!`
        : `"${newArtwork.title}" successfully archived!`
    );
  };

  const handleAddReview = (newRev: Omit<CuratorReview, 'id' | 'date'>) => {
    const fullReview: CuratorReview = {
      ...newRev,
      id: Date.now(),
      date: new Date().toISOString().split('T')[0]
    };
    setReviews((prev) => [fullReview, ...prev]);
    showToast(currentLang === 'tr' ? 'Küratör değerlendirmeniz kaydedildi.' : 'Your curator review was published.');
  };

  const scrollToKatalog = () => {
    const el = document.getElementById('katalog');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA] text-[#111111] selection:bg-black selection:text-white">

      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-black text-white px-4 py-2.5 rounded-full text-xs font-medium shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-300 border border-stone-800">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span>{notification}</span>
        </div>
      )}

      {/* Floating Pill Top Bar Navigation (matching target mockup) */}
      <Header
        currentLang={currentLang}
        onToggleLang={handleToggleLang}
        currentUser={currentUser}
        onOpenUpload={() => setIsUploadOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenMap={() => setIsMapOpen(true)}
        onOpenAnalytics={() => {
          const el = document.getElementById('analitik');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
        onSearchClick={scrollToKatalog}
        favoritesCount={likedIds.length}
        onOpenFavorites={() => {
          setShowFavoritesOnly(true);
          scrollToKatalog();
        }}
      />

      {/* Main Content Area structured exactly like "A JOURNEY THROUGH ARTS" site */}
      <main className="flex-1">
        {/* 1. Hero: "SANATLA BİR YOLCULUK / A JOURNEY THROUGH ARTS" + 3D Panoramik Sergi Duvarı */}
        <PanoramicGalleryShowcase
          artworks={artworks}
          currentLang={currentLang}
          onSelectArtwork={(art) => setSelectedArtwork(art)}
        />

        {/* 2. Dark Signature Section: "ARTWORKS THAT SPEAK A MILLION WORDS" */}
        <CuratedDarkSection
          artworks={artworks}
          currentLang={currentLang}
          onSelectArtwork={(art) => setSelectedArtwork(art)}
          onBrowseAll={scrollToKatalog}
        />

        {/* 3. Two Feature Banners ("Kendi Eserini Paylaş" & "Başyapıtların Hikayesi") + 4 Gallery Badges */}
        <FeatureBannersSection
          artworks={artworks}
          currentLang={currentLang}
          onSelectArtwork={(art) => setSelectedArtwork(art)}
          onOpenUpload={() => setIsUploadOpen(true)}
          onBrowseCategory={() => scrollToKatalog()}
        />

        {/* 4. "DRAMATIC ARTIST - MODERN GALLERY" Catalog Grid with Filter Pills */}
        <ArtworkGrid
          artworks={artworks}
          categories={categories}
          currentLang={currentLang}
          onSelectArtwork={(art) => setSelectedArtwork(art)}
          onLikeArtwork={handleLikeArtwork}
          likedIds={likedIds}
          showOnlyFavorites={showFavoritesOnly}
          onResetFavoriteFilter={() => setShowFavoritesOnly(false)}
        />

        {/* 5. Testimonials: "WHAT ARTISTS & CURATORS ARE SAYING" */}
        <TestimonialsSection currentLang={currentLang} />

        {/* 6. Academic Curation Analytics Section */}
        <AnalyticsSection
          artworks={artworks}
          categories={categories}
          currentLang={currentLang}
        />
      </main>

      {/* 7. Dark Sleek Footer */}
      <Footer
        currentLang={currentLang}
        onOpenAnalytics={() => {
          const el = document.getElementById('analitik');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenMap={() => setIsMapOpen(true)}
        onOpenUpload={() => setIsUploadOpen(true)}
      />

      {/* Artwork Deep Dive Detail Modal */}
      {selectedArtwork && (
        <ArtworkDetailModal
          artwork={selectedArtwork}
          allArtworks={artworks}
          reviews={reviews}
          currentUser={currentUser}
          currentLang={currentLang}
          onClose={() => setSelectedArtwork(null)}
          onSelectArtwork={(art) => setSelectedArtwork(art)}
          onAddReview={handleAddReview}
        />
      )}

      {/* Upload Artwork with Canvas PHP GD simulation */}
      {isUploadOpen && (
        <UploadModal
          categories={categories}
          currentUser={currentUser}
          currentLang={currentLang}
          onClose={() => setIsUploadOpen(false)}
          onArtworkUploaded={handleArtworkUploaded}
        />
      )}

      {/* Exhibition & Google Maps Modal */}
      {isMapOpen && (
        <ExhibitionMapModal
          currentLang={currentLang}
          onClose={() => setIsMapOpen(false)}
        />
      )}

      {/* User Auth & RBAC Role Switcher */}
      {isAuthOpen && (
        <AuthModal
          currentUser={currentUser}
          currentLang={currentLang}
          onClose={() => setIsAuthOpen(false)}
          onUpdateUser={(updated) => {
            setCurrentUser(updated);
            showToast(currentLang === 'tr' ? `Rol "${updated.role}" olarak güncellendi.` : `Role updated to "${updated.role}".`);
          }}
        />
      )}

    </div>
  );
}
