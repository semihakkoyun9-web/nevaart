import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

interface TestimonialsSectionProps {
  currentLang: 'tr' | 'en';
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ currentLang }) => {
  const testimonials = [
    {
      id: 1,
      name: 'Deniz Acar',
      role: currentLang === 'tr' ? 'Bağımsız İllüstratör & Dijital Sanatçı' : 'Independent Illustrator & Digital Artist',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      comment: currentLang === 'tr' 
        ? 'Kendi çizimlerimi ve arkasındaki eskiz hikayelerini NevaArt’ta yayınladım. İki hafta içinde bir galeri yöneticisi doğrudan benimle iletişime geçip orijinal sergileme haklarını aldı.'
        : 'I published my digital drawings and development sketches on NevaArt. Within two weeks, a contemporary gallery curator reached out directly to exhibit the series.'
    },
    {
      id: 2,
      name: 'Kaan Demir',
      role: currentLang === 'tr' ? 'Belgesel Fotoğrafçısı' : 'Documentary Photographer',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      comment: currentLang === 'tr'
        ? 'Burada sadece görsel koyup geçmiyorsunuz; her eserin hikayesini, kullanılan lensi ve anın felsefesini yazabiliyorsunuz. Sanatseverler hikayeyi okuduktan sonra eserle çok daha derin bağ kuruyor.'
        : 'You don\'t just post an image; you share the story, the lens, and the human condition behind the frame. Viewers connect far deeper after reading the provenance.'
    },
    {
      id: 3,
      name: 'Elena Rostova',
      role: currentLang === 'tr' ? 'Sanat Tarihçisi & Koleksiyoner, Berlin' : 'Art Historian & Collector, Berlin',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
      comment: currentLang === 'tr'
        ? 'Hokusai ve Arda Güler gibi efsanelerle genç yeteneklerin aynı galeride buluşması harika. Beğendiğim bir eserin çizerine tek tıkla mesaj atıp iletişime geçebilmek inanılmaz bir kolaylık.'
        : 'Having young creators exhibited alongside legends like Hokusai creates a rich tapestry. Being able to reach out directly to the artist to inquire about a piece is effortless.'
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const prev = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const next = () => {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-4 border-b border-stone-200">
        <div>
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="w-5 h-px bg-stone-400" />
            <span className="text-[11px] uppercase tracking-[0.25em] text-stone-500 font-mono font-semibold">
              {currentLang === 'tr' ? 'TOPLULUK DENEYİMLERİ' : 'COMMUNITY EXPERIENCES'}
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-display font-extrabold uppercase text-black tracking-tight leading-tight">
            {currentLang === 'tr' ? (
              <>
                SANATÇILAR VE KÜRATÖRLER <br className="hidden sm:inline" />
                <span className="font-light text-stone-700">NE DİYOR?</span>
              </>
            ) : (
              <>
                WHAT ARTISTS & CURATORS <br className="hidden sm:inline" />
                <span className="font-light text-stone-700">ARE SAYING</span>
              </>
            )}
          </h2>
        </div>

        {/* Carousel controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={prev}
            aria-label={currentLang === 'tr' ? 'Önceki görüş' : 'Previous review'}
            className="w-10 h-10 rounded-full bg-white border border-stone-200 hover:border-black flex items-center justify-center text-stone-800 transition-all cursor-pointer hover:scale-105 active:scale-95 shadow-xs"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={next}
            aria-label={currentLang === 'tr' ? 'Sonraki görüş' : 'Next review'}
            className="w-10 h-10 rounded-full bg-black hover:bg-stone-800 text-white flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95 shadow-xs"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((item, idx) => (
          <div
            key={item.id}
            className={`bg-white border rounded-2xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 ${
              idx === currentIndex
                ? 'border-black shadow-lg ring-1 ring-black/5'
                : 'border-stone-200 hover:border-stone-400 shadow-xs'
            }`}
          >
            <div>
              {/* Star Rating */}
              <div className="flex items-center gap-1 text-amber-500 mb-4">
                {[...Array(item.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-500" />
                ))}
              </div>

              {/* Review Text */}
              <p className="text-stone-700 text-sm leading-relaxed italic">
                &ldquo;{item.comment}&rdquo;
              </p>
            </div>

            {/* Author info */}
            <div className="flex items-center gap-3.5 mt-6 pt-5 border-t border-stone-100">
              <img
                src={item.avatar}
                alt={item.name}
                className="w-10 h-10 rounded-full object-cover border border-stone-200"
              />
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                  {item.name}
                </h4>
                <p className="text-[11px] text-stone-500">
                  {item.role}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
