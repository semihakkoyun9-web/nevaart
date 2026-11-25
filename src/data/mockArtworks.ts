import { Artwork, ArtworkCategory, CuratorReview } from '../types';

export const initialCategories: ArtworkCategory[] = [
  {
    id: 'digital',
    nameTr: 'Dijital & Generatif Sanatlar',
    nameEn: 'Digital & Generative Arts',
    descriptionTr: 'Yapay zeka veri pigmentleri, parametrik heykeller ve mimari projeksiyon mapping eserleri.',
    descriptionEn: 'AI data pigments, parametric volumetric sculptures, and architectural projection architectures.',
    count: 3
  },
  {
    id: 'street',
    nameTr: 'Sokak & Belgesel Fotoğrafçılığı',
    nameEn: 'Street & Documentary Photography',
    descriptionTr: '35mm Leica chiaroscuro, insan hikayeleri, kentsel yalnızlık ve gümüş jelatin baskılar.',
    descriptionEn: '35mm Leica chiaroscuro, human condition, urban stillness, and silver gelatin darkroom craft.',
    count: 3
  },
  {
    id: 'illustration',
    nameTr: 'Klasik & Çağdaş İllüstrasyon',
    nameEn: 'Fine Art & Woodblock Illustration',
    descriptionTr: 'Ukiyo-e, Shin-hanga, mineral lapis lazuli pigmentleri ve el yapımı washi kağıdı sanatı.',
    descriptionEn: 'Ukiyo-e, Shin-hanga, mineral lapis lazuli, and handmade mulberry washi mastercraft.',
    count: 4
  },
  {
    id: 'architecture',
    nameTr: 'Parametrik & Brütalist Mimari',
    nameEn: 'Parametric & Brutalist Architecture',
    descriptionTr: 'Akışkan uzamsal monolitler, brütalist beton strüktürler ve ışık yarıkları.',
    descriptionEn: 'Fluid spatial monoliths, board-formed concrete masses, and celestial daylight apertures.',
    count: 3
  },
  {
    id: 'concept',
    nameTr: 'Konsept Tasarım & Spekülatif Sanat',
    nameEn: 'Concept Design & Speculative Art',
    descriptionTr: 'Geleceğin endüstriyel dünyaları, distopik İskandinav manzaraları ve analog mekanikler.',
    descriptionEn: 'Industrial speculative futures, Scandinavian dystopian horizons, and analog retro-futurism.',
    count: 3
  }
];

export const initialArtworks: Artwork[] = [
  {
    id: 1,
    slug: 'refik-anadol-nature-dreams',
    accessionNumber: 'ACC.2026.0101',
    title: 'Machine Hallucinations: Nature Dreams',
    artist: 'Refik Anadol',
    artistBioTr: '1985, İstanbul doğumlu, Los Angeles merkezli medya sanatçısı ve yönetmen. Makine zekasının kolektif hafıza üzerindeki estetik izlerini devasa mimari enstalasyonlara dönüştürmektedir.',
    artistBioEn: 'Born in Istanbul, 1985. Los Angeles-based media artist pioneering AI machine intelligence aesthetics and architectural data sculptures.',
    category: 'digital',
    year: 2021,
    mediumTr: 'Yapay Zeka Generatif Pigment Algoritması, 16K LED Duvar Projeksiyonu & Özel Akışkan Simülasyonu',
    mediumEn: 'AI Latent Space Fluid Transport, 16K Micro-LED Architectural Enclosure',
    dimensions: '1000 × 1000 cm Mekansal Enstalasyon (Arşiv Baskısı: 120 × 120 cm)',
    resolution: '16K Ultra-Res Generative Matrix (7680 × 7680 px)',
    storyTr: 'Eser, dünya genelindeki milli parklar ve ormanlardan toplanan 300 milyondan fazla doğa fotoğrafının derin öğrenme (GAN) modelleri tarafından rüyaya dönüştürülmesidir. Pikseller, katı ve sıvı fazlar arasında dalgalanan akışkan bir doğa hafızasını heykelleştirir.',
    storyEn: 'A machine hallucination trained on 300+ million photographic captures of national parks, synthesizing latent memory into dynamic pigment waves that suspend between liquid and solid states.',
    technicalDetailsTr: 'Custom StyleGAN2 ve t-SNE algoritmaları; CUDA destekli GPU kümelerinde 420 saatlik eğitim; Navier-Stokes akışkanlar dinamiği simülasyonu.',
    technicalDetailsEn: 'Custom StyleGAN2 latent walk coupled with Navier-Stokes incompressible fluid solver running on high-density GPU clusters.',
    imageUrl: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1400&q=85',
    colorPalette: [
      { hex: '#78338C', percentage: 32, name: 'Yapay Zeka Menekşe Pigmenti', rgb: [120, 51, 140] },
      { hex: '#2B4C8C', percentage: 26, name: 'Latent Uzay Kobaltı', rgb: [43, 76, 140] },
      { hex: '#E88C48', percentage: 20, name: 'Sıcak Kinetik Kehribar', rgb: [232, 140, 72] },
      { hex: '#E8EFF8', percentage: 14, name: 'Lüminesans Işık Çekirdeği', rgb: [232, 239, 248] },
      { hex: '#121824', percentage: 8, name: 'Derin Veri Tabanı', rgb: [18, 24, 36] }
    ],
    harmonyMoodTr: 'Mor ve kobalt mavisi geçişleriyle fütüristik, organik ve rüya gibi bir spektrum.',
    harmonyMoodEn: 'Futuristic organic equilibrium bridging deep cobalt vectors with bioluminescent amber.',
    views: 4890,
    likes: 1240,
    isCuratorPick: true,
    exhibitionLocation: {
      city: 'Berlin',
      venue: 'König Galerie · St. Agnes Nave',
      lat: 52.4984,
      lng: 13.4072
    },
    tags: ['refik anadol', 'makine zekası', 'generatif sanat', 'veri heykeli', 'moma'],
    printOptions: [
      { size: '60 × 60 cm', paperType: 'Hahnemühle Photo Rag 308 gsm', priceTl: 8500, priceEur: 230, editionTotal: 50, editionRemaining: 8 },
      { size: '100 × 100 cm Master Edition', paperType: 'Canson Infinity Arches 310 gsm', priceTl: 16500, priceEur: 450, editionTotal: 25, editionRemaining: 3 }
    ],
    audioGuide: {
      duration: '04:15',
      narrator: 'Prof. Dr. Halil Erdem (Baş Küratör)',
      summary: 'Refik Anadol\'un doğanın piksellere bölünmüş hatıralarını nasıl bir mimari dalgaya dönüştürdüğünün analizi.'
    }
  },
  {
    id: 2,
    slug: 'arda-guler-galata-koprusu',
    accessionNumber: 'ACC.2026.0102',
    title: 'Galata Köprüsü ve Haliç\'te Sabah Sisi',
    artist: 'Arda Güler',
    artistBioTr: 'İstanbul merkezli çağdaş belgesel ve sokak fotoğrafçısı. Tarihi Galata Köprüsü, Haliç balıkçıları ve kentsel insan hikayelerini doğal ışık ve zengin tonlamalarla belgelemektedir.',
    artistBioEn: 'Contemporary Istanbul-based street and documentary photographer capturing human stories, fishermen, and atmospheric light across the historic Galata Bridge and Golden Horn.',
    category: 'street',
    year: 1956,
    mediumTr: '35mm Leica M3, Kodak Tri-X 400 Negatif Film, Karanlık Oda Gümüş Jelatin Baskı',
    mediumEn: '35mm Kodak Tri-X 400 Negative, Darkroom Baryta Silver Gelatin Archival Print',
    dimensions: '50 × 70 cm (Master Karanlık Oda Baskısı)',
    resolution: 'Optik Gümüş Halojenür Gren Standardı',
    storyTr: 'Tarihi Galata Köprüsü üzerinde sabahın ilk ışıklarıyla olta atan balıkçılar, köprünün ikonik korkulukları ve Haliç üzerinde yükselen sabah pusu. Eser, şehrin yaşayan hafızasını, köprü üzerindeki gündelik insan emeğini ve İstanbul\'un zamansız kıyı ritmini yansıtır.',
    storyEn: 'Morning vapor enveloping fishermen along the railings of the historic Galata Bridge, reflecting the timeless human condition and coastal rhythm of the Golden Horn.',
    technicalDetailsTr: 'Leica M3 gövde, 50mm f/1.4 Summilux lens. Galata Köprüsü korkulukları boyunca doğal sabah ters ışığında çekilmiş, gümüş gren dokusu korunmuştur.',
    technicalDetailsEn: 'Leica M3 with Summilux 50mm f/1.4 at f/5.6 along the Galata Bridge railings, capturing atmospheric mid-tone acutance.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Fishermen_on_Galata_Bridge.JPG/1280px-Fishermen_on_Galata_Bridge.JPG',
    colorPalette: [
      { hex: '#2C3A44', percentage: 35, name: 'Haliç Suyu & Çivit Mavisi', rgb: [44, 58, 68] },
      { hex: '#63707A', percentage: 25, name: 'Galata Köprüsü Korkuluk Grisi', rgb: [99, 112, 122] },
      { hex: '#B8C2CC', percentage: 20, name: 'Sabah Pusu ve Gökyüzü Açıklığı', rgb: [184, 194, 204] },
      { hex: '#181E24', percentage: 12, name: 'Balıkçı Silüetleri ve Derin Gölgeler', rgb: [24, 30, 36] },
      { hex: '#8C6C4A', percentage: 8, name: 'Sıcak Ahşap ve Balıkçı Gereçleri', rgb: [140, 108, 74] }
    ],
    harmonyMoodTr: 'Galata Köprüsü\'nün puslu Haliç mavisi ile sabah ışığının dingin ve şiirsel dengesi.',
    harmonyMoodEn: 'Pure atmospheric balance between the misty Golden Horn waters and early morning fishermen silhouettes.',
    views: 6240,
    likes: 1890,
    isCuratorPick: true,
    exhibitionLocation: {
      city: 'İstanbul',
      venue: 'Galata Fotoğraf Galerisi · Salt Galata',
      lat: 41.0242,
      lng: 28.9742
    },
    tags: ['arda güler', 'galata köprüsü', 'istanbul', 'balıkçılar', 'haliç', 'sokak'],
    printOptions: [
      { size: '40 × 50 cm', paperType: 'Ilford Galerie Prestige Baryta 310 gsm', priceTl: 6200, priceEur: 170, editionTotal: 100, editionRemaining: 14 },
      { size: '60 × 80 cm Sergi Baskısı', paperType: 'Hahnemühle FineArt Baryta', priceTl: 11800, priceEur: 320, editionTotal: 30, editionRemaining: 4 }
    ],
    audioGuide: {
      duration: '03:40',
      narrator: 'Arda Güler Arşivi Küratöryel Ses Kaydı',
      summary: 'Galata Köprüsü üzerindeki sabah pusunun ve balıkçıların fotoğraflanış hikayesi.'
    }
  },
  {
    id: 3,
    slug: 'katsushika-hokusai-buyuk-dalga',
    accessionNumber: 'ACC.2026.0103',
    title: 'Kanagawa-oki Nami Ura (Büyük Dalga)',
    artist: 'Katsushika Hokusai',
    artistBioTr: '1760 - 1849, Edo (Tokyo). Japon Ukiyo-e akımının evrensel dehası. Batı sanatında Monet, Degas ve Van Gogh üzerinde köklü Japonizm etkisini başlatan "Fuji Dağı\'nın 36 Manzarası" serisinin başyapıtıdır.',
    artistBioEn: '1760 - 1849, Edo. The legendary Japanese master of Ukiyo-e woodblock printing whose kinetic compositions ignited the Western Japonisme movement.',
    category: 'illustration',
    year: 1831,
    mediumTr: 'Çok Renkli Ahşap Blok Baskı (Nishiki-e), Doğal Prusya Mavisi & El Yapımı Washi Dut Kağıdı',
    mediumEn: 'Polychrome Woodblock Print (Nishiki-e), Imported Prussian Blue on Kozo Washi Paper',
    dimensions: '25.7 × 37.8 cm (Orijinal Öban Formatı)',
    resolution: 'Tarihi Ahşap Oymacılığı ve Doğal Pigment Matrisi',
    storyTr: 'Fırtınalı Kanagawa açıklarında dev pençeli bir dalganın ortasında kaderlerine kürek çeken balıkçı tekneleri ve uzakta dingin bir şekilde yükselen karlı Fuji Dağı. Eser, insanın tabiatın kudreti karşısındaki kırılganlığını ve ebedi estetik dengesini anlatır.',
    storyEn: 'Towering foam crests claw toward three cargo barges battling open sea, while sacred Mount Fuji remains serene and diminutive in the distant horizon.',
    technicalDetailsTr: 'Berlin mavisi (Prusya mavisi / bero-ai) ilk kez bu seride sentetik ithal pigment olarak kullanılmış, gradyanlı bokashi tekniğiyle deniz köpüğü katmanları basılmıştır.',
    technicalDetailsEn: 'Historic introduction of Prussian blue pigment to Japan; bokashi color gradation applied across cherry wood blocks.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Great_Wave_off_Kanagawa2.jpg/1280px-Great_Wave_off_Kanagawa2.jpg',
    colorPalette: [
      { hex: '#163863', percentage: 38, name: 'Hakiki Prusya Mavisi', rgb: [22, 56, 99] },
      { hex: '#6897BB', percentage: 24, name: 'Açık Kobalt Dalga Köpüğü', rgb: [104, 151, 187] },
      { hex: '#E6DCBE', percentage: 20, name: 'Antika Dut Washi Kağıdı', rgb: [230, 220, 190] },
      { hex: '#FFFFFF', percentage: 12, name: 'Fuji Dağı Kar Zirvesi', rgb: [255, 255, 255] },
      { hex: '#8A583A', percentage: 6, name: 'Ahşap Balıkçı Teknesi Tonu', rgb: [138, 88, 58] }
    ],
    harmonyMoodTr: 'Derin çivit mavisi ile sıcak washi kağıdı arasındaki ebedi komplementer denge.',
    harmonyMoodEn: 'Historic contrast between dense Prussian indigo waves and unbleached washi fiber cream.',
    views: 7890,
    likes: 2450,
    isCuratorPick: true,
    exhibitionLocation: {
      city: 'Tokyo',
      venue: 'Tokyo Ulusal Müzesi · Ukiyo-e Pavyonu',
      lat: 35.7188,
      lng: 139.7765
    },
    tags: ['hokusai', 'büyük dalga', 'ukiyo-e', 'japonya', 'prusya mavisi', 'fuji'],
    printOptions: [
      { size: 'Öban (26 × 38 cm Orijinal Boyut)', paperType: 'Japon El Yapımı Kozo Washi 180 gsm', priceTl: 4800, priceEur: 130, editionTotal: 150, editionRemaining: 22 },
      { size: '50 × 70 cm Müze Arşiv Formatı', paperType: 'Hahnemühle German Etching 310 gsm', priceTl: 8900, priceEur: 240, editionTotal: 50, editionRemaining: 7 }
    ],
    audioGuide: {
      duration: '05:10',
      narrator: 'Dr. Kenjiro Sato (Edo Sanatları Küratörü)',
      summary: 'Prusya mavisinin 1830’larda Japonya\'ya gelişi ve Hokusai\'nin fraktal dalga dinamikleri.'
    }
  },
  {
    id: 4,
    slug: 'zaha-hadid-heydar-aliyev',
    accessionNumber: 'ACC.2026.0104',
    title: 'Heydar Aliyev Center: Akışkan Uzamsal Monolit',
    artist: 'Zaha Hadid Architects',
    artistBioTr: '1950 - 2016, Bağdat doğumlu Britanyalı mimar. Pritzker Mimarlık Ödülü\'nü kazanan ilk kadın mimar. Keskin köşeleri yıkan dekonstrüktivist ve parametrik akışkan formların öncüsü.',
    artistBioEn: '1950 - 2016. Groundbreaking Pritzker laureate architect whose parametric curved envelopes dissolved Euclidean box geometry into dynamic topography.',
    category: 'architecture',
    year: 2012,
    mediumTr: 'Parametrik Cam Elyaf Takviyeli Beton (GFRC) & Özel Mekansal Çelik Çerçeve Strüktür',
    mediumEn: 'Glass Fiber Reinforced Concrete Panels (GFRC), Curvilinear Space Frame',
    dimensions: '57,519 m² Toplam Alan (Zemin ile Bütünleşen Akışkan Kabuk)',
    resolution: 'Bespoke Parametric Rhinoceros & CATIA Geometrisi',
    storyTr: 'Bakü\'nün katı Sovyet blok mimarisine bir tepki olarak tasarlanan yapı, zeminden doğup gökyüzüne kıvrılan tek parça beyaz bir dalgayı andırır. Kolonsuz devasa iç mekanlar, ışığı yüzeyler üzerinde kesintisiz bir ipek gibi kaydırır.',
    storyEn: 'A continuous fluid skin rising seamlessly from the plaza into soaring folds, defying monolithic Soviet rigidities with feminine, continuous architectural calligraphy.',
    technicalDetailsTr: 'CATIA ve Maya yazılımlarıyla modellenmiş 12.028 adet tekil GFRC panel; derz çizgileri akışkan vektörleri vurgulayacak şekilde hesaplanmıştır.',
    technicalDetailsEn: '12,028 bespoke geometrically double-curved GFRC panels choreographed to reinforce structural vectors.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a0/Heydar_Aliyev_Center_1.3.jpg',
    colorPalette: [
      { hex: '#F4F2EE', percentage: 44, name: 'Saf Alabaster Panel Beyazı', rgb: [244, 242, 238] },
      { hex: '#6C98B2', percentage: 24, name: 'Bakü Gök Mavisi', rgb: [108, 152, 178] },
      { hex: '#D6D0C5', percentage: 16, name: 'Kavisli Gölge Kireçtaşı', rgb: [214, 208, 197] },
      { hex: '#2A3540', percentage: 10, name: 'Giriş Portal Gölgeleri', rgb: [42, 53, 64] },
      { hex: '#8C867D', percentage: 6, name: 'Açık Agrega Grisi', rgb: [140, 134, 125] }
    ],
    harmonyMoodTr: 'Monolitik parlak alabaster beyazı ile yumuşak ışık kırılmalarının dingin harmonisi.',
    harmonyMoodEn: 'Sculptural purity defined by subtle gradients of daylight washing over continuous white curves.',
    views: 5410,
    likes: 1670,
    isCuratorPick: true,
    exhibitionLocation: {
      city: 'Bakü',
      venue: 'Heydar Aliyev Center · Mimarlık Pavyonu',
      lat: 40.3953,
      lng: 49.8678
    },
    tags: ['zaha hadid', 'parametrik mimarlık', 'heydar aliyev', 'bakü', 'gfrc', 'beyaz monolit'],
    printOptions: [
      { size: '60 × 90 cm Mimari Özel Baskı', paperType: 'Hahnemühle Photo Rag Ultra Smooth 305 gsm', priceTl: 7400, priceEur: 200, editionTotal: 40, editionRemaining: 9 },
      { size: '100 × 150 cm Monolit Edisyon', paperType: 'Canson Infinity Baryta Prestige', priceTl: 14900, priceEur: 410, editionTotal: 15, editionRemaining: 2 }
    ],
    audioGuide: {
      duration: '04:50',
      narrator: 'Mimar Selin Göktaş (Çağdaş Mimarlık Eleştirmeni)',
      summary: 'Zaha Hadid\'in keskin köşeleri ve yerçekimi algısını büken parametrik tasarım devrimi.'
    }
  },
  {
    id: 5,
    slug: 'fan-ho-approaching-shadow',
    accessionNumber: 'ACC.2026.0105',
    title: 'Approaching Shadow (Hong Kong)',
    artist: 'Fan Ho',
    artistBioTr: '1931 - 2016, Şanghay doğumlu, Hong Kong\'da yaşayan efsanevi fotoğrafçı ve yönetmen. 280\'den fazla uluslararası ödülle "Hong Kong\'un Cartier-Bresson\'u" olarak tanınır.',
    artistBioEn: '1931 - 2016. Celebrated Hong Kong street photographer and filmmaker famed for poetic geometric shadows and dramatic daylight beams.',
    category: 'street',
    year: 1954,
    mediumTr: 'Rolleiflex 3.5F Çift Lensli Refleks (TLR), 6×6 Orta Format Negatif, Gümüş Baskı',
    mediumEn: 'Rolleiflex 3.5F TLR, 6×6 Medium Format Negative, Fine Art Gelatin Silver',
    dimensions: '60 × 60 cm (Kare Format Karanlık Oda Baskısı)',
    resolution: 'Kare 6×6 Orta Format Detay Derinliği',
    storyTr: 'Eski Hong Kong sokağında devasa üçgen bir gölgenin bir duvarı ikiye böldüğü anda, gölgenin ucuna doğru yaklaşan melankolik genç bir kadının silüeti. Fan Ho, zamanın kaçınılmaz akışını ve insanın kaderini bu geometrik gölgeyle sembolize etmiştir.',
    storyEn: 'A lone woman framed against a sun-drenched wall bifurcated by a razor-sharp diagonal shadow, capturing existential solitude in colonial Hong Kong.',
    technicalDetailsTr: 'Rolleiflex 75mm Zeiss Planar lens f/8. Duvara düşen diyagonal gölge çizgisi negatif üzerinde karanlık oda maskelemesi ile dramatikleştirilmiştir.',
    technicalDetailsEn: 'Rolleiflex TLR medium format camera with Zeiss Planar 75mm. Master darkroom dodging and burning.',
    imageUrl: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=1400&q=85',
    colorPalette: [
      { hex: '#0A0A0A', percentage: 45, name: 'Diyagonal Keskin Gölge', rgb: [10, 10, 10] },
      { hex: '#2A2928', percentage: 22, name: 'Sıvalı Duvar Gölgeleri', rgb: [42, 41, 40] },
      { hex: '#65625E', percentage: 15, name: 'Ara Ton Kömür Greni', rgb: [101, 98, 94] },
      { hex: '#B8B3AB', percentage: 12, name: 'Öğle Güneşi Işık Huzmesi', rgb: [184, 179, 171] },
      { hex: '#F7F5F0', percentage: 6, name: 'Parlama Yapan Beyaz Duvar', rgb: [247, 245, 240] }
    ],
    harmonyMoodTr: 'Katı geometrik hatlar, keskin diyagonaller ve saf siyah-beyaz gerilimi.',
    harmonyMoodEn: 'Intense geometric chiaroscuro dominated by pure planar shadow intersection.',
    views: 5120,
    likes: 1530,
    isCuratorPick: false,
    exhibitionLocation: {
      city: 'Hong Kong',
      venue: 'M+ Museum · Visual Culture Galleries',
      lat: 22.3013,
      lng: 114.1604
    },
    tags: ['fan ho', 'hong kong', 'rolleiflex', 'diyagonal gölge', 'geometrik', 'monokrom'],
    printOptions: [
      { size: '50 × 50 cm Kare Edisyon', paperType: 'Ilford Multigrade FB Classic 310 gsm', priceTl: 6900, priceEur: 185, editionTotal: 60, editionRemaining: 11 },
      { size: '80 × 80 cm Koleksiyoner Baskısı', paperType: 'Hahnemühle FineArt Baryta', priceTl: 13500, priceEur: 370, editionTotal: 20, editionRemaining: 2 }
    ],
    audioGuide: {
      duration: '03:15',
      narrator: 'Leung Wing-Chung (Hong Kong Fotoğraf Enstitüsü)',
      summary: 'Fan Ho\'nun sokağı bir tiyatro sahnesi gibi ışık ve gölgelerle kurgulama tekniği.'
    }
  },
  {
    id: 6,
    slug: 'simon-stalenhag-monolith-loop',
    accessionNumber: 'ACC.2026.0106',
    title: 'The Monolith on the Ridge: Tales from the Loop',
    artist: 'Simon Stålenhag',
    artistBioTr: '1984, Stockholm doğumlu İsveçli sanatçı ve yazar. 1980\'lerin ve 90\'ların sakin İskandinav kırsal manzaralarını devasa terk edilmiş füzyon makineleri ve gizemli parçacık hızlandırıcılarıyla birleştiren çığır açıcı retro-fütürizm ustası.',
    artistBioEn: 'Born in Stockholm, 1984. Acclaimed digital painter weaving Scandinavian rural melancholia with retro-futuristic particle accelerator monoliths.',
    category: 'concept',
    year: 2017,
    mediumTr: 'Dijital Tuval, Wacom Cintiq Katmanlı Boyama, Özel Pigment Giclée',
    mediumEn: 'Digital Canvas, Wacom Cintiq Impasto Simulation, 12-Color Archival Pigment Giclée',
    dimensions: '90 × 140 cm (1:1.55 Sinematik En-Boy Oranı)',
    resolution: '8K Ultra-Detaylı Boyama Matrisi',
    storyTr: 'Karlı bir İsveç çam ormanının ardında yükselen paslı ve devasa bir parçacık monolit kulesi. Ön planda 1984 model kırmızı bir Volvo ve soğuk rüzgara karşı yürüyen bir çocuk. Eser, çocukluğun nostaljik yalnızlığı ile açıklanamaz teknolojinin yarattığı tekinsiz huzuru buluşturur.',
    storyEn: 'A colossal rusting cooling tower looms over snow-covered Swedish pine ridges while an unassuming red Volvo navigates damp gravel, capturing atmospheric mystery.',
    technicalDetailsTr: 'Photoshop üzerinde geleneksel guaj ve yağlı boya fırça fiziğini taklit eden özel fırça darbeleri; İskandinav bulutlu gökyüzü ışığı referans alınmıştır.',
    technicalDetailsEn: 'Custom impasto brushes recreating wet-in-wet Scandinavian plein-air atmosphere in Adobe Photoshop.',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1400&q=85',
    colorPalette: [
      { hex: '#2C3E42', percentage: 36, name: 'Soğuk İskandinav Çam Yeşili', rgb: [44, 62, 66] },
      { hex: '#B86B42', percentage: 26, name: 'Paslı Endüstriyel Oksit Turuncusu', rgb: [184, 107, 66] },
      { hex: '#D8D4CA', percentage: 18, name: 'Kurşuni Bulutlu Gökyüzü', rgb: [216, 212, 202] },
      { hex: '#6B7B85', percentage: 12, name: 'Kuzey Ufuk Grisi', rgb: [107, 123, 133] },
      { hex: '#1A2224', percentage: 8, name: 'Islak Çakıl ve Toprak', rgb: [26, 34, 36] }
    ],
    harmonyMoodTr: 'Kasvetli kuzey soğuk mavisi ile paslanmış turuncu makinelerin çarpıcı kontrastı.',
    harmonyMoodEn: 'Melancholic Nordic slate cyan accented by warm oxidized industrial cadmium rust.',
    views: 4720,
    likes: 1390,
    isCuratorPick: false,
    exhibitionLocation: {
      city: 'Stockholm',
      venue: 'Moderna Museet · Spekülatif Sanat Galerisi',
      lat: 59.3260,
      lng: 18.0847
    },
    tags: ['simon stålenhag', 'retro fütürizm', 'isveç', 'tales from the loop', 'konsept sanat'],
    printOptions: [
      { size: '50 × 80 cm Sinematik Boyut', paperType: 'Canson Infinity Rag Photographique 310 gsm', priceTl: 5800, priceEur: 155, editionTotal: 80, editionRemaining: 15 },
      { size: '80 × 130 cm Büyük Tuval Edisyonu', paperType: 'Hahnemühle Museum Etching', priceTl: 12200, priceEur: 330, editionTotal: 30, editionRemaining: 5 }
    ],
    audioGuide: {
      duration: '03:55',
      narrator: 'Erik Lindqvist (Kuzey Sanatları Enstitüsü)',
      summary: 'Stålenhag\'ın çocukluk hatıralarını bilim kurgu estetiyle nasıl harmanladığının incelemesi.'
    }
  },
  {
    id: 7,
    slug: 'hasui-kawase-zojoji-kar',
    accessionNumber: 'ACC.2026.0107',
    title: 'Zōjō-ji Tapınağında Kar (Tokyo)',
    artist: 'Hasui Kawase',
    artistBioTr: '1883 - 1957, Tokyo. 20. yüzyıl başında Ukiyo-e geleneğini Batı realizmi ve derin atmosfer ışığıyla canlandıran Shin-hanga (Yeni Baskı) akımının en büyük temsilcisi.',
    artistBioEn: '1883 - 1957, Tokyo. Supreme master of the 20th-century Shin-hanga movement celebrated for his evocative landscapes in snow, rain, and moonlight.',
    category: 'illustration',
    year: 1929,
    mediumTr: 'Geleneksel El Oyması Kiraz Ağacı Ahşap Blok Baskı, Doğal Kırmızı Vermilion Pigmenti',
    mediumEn: 'Hand-carved Cherry Woodblock Impression, Vermilion Mineral Wash on Washi',
    dimensions: '39 × 26.5 cm',
    resolution: 'Shin-hanga Lirik Ahşap Katmanları',
    storyTr: 'Tokyo\'daki kadim Zōjō-ji Tapınağı\'nın alev kırmızısı kapısına lapa lapa yağan kar altında yaklaşan tek bir şemsiyeli figür. Kar tanelerinin saf beyazı ile tapınağın kırmızı ahşap dokusu arasındaki şiirsel zıtlık, geçicilik ve kalıcılık felsefesini somutlaştırır.',
    storyEn: 'A lone traveler with an umbrella trudges through drifting snowfall toward the crimson Sanmon Gate of Zōjō-ji Temple, freezing a quiet moment of Buddhist serenity.',
    technicalDetailsTr: 'Baskıda kar taneleri ahşabın oyulmamış yükseltileriyle (gofun kabartma) ve tapınağın kırmızı sütunları 6 farklı baskı katmanıyla uygulanmıştır.',
    technicalDetailsEn: 'Six passes of natural mineral cinnabar vermilion; negative space carving producing the illusion of heavy snow.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/8d/Kawase_Z%C3%B4j%C3%B4ji.jpg',
    colorPalette: [
      { hex: '#B82E2E', percentage: 36, name: 'Tapınak Vernik Kırmızısı (Vermilion)', rgb: [184, 46, 46] },
      { hex: '#FAFBFD', percentage: 26, name: 'Lapa Lapa Yağan Saf Kar', rgb: [250, 251, 253] },
      { hex: '#2C4258', percentage: 18, name: 'Kış Akşamı Gece Mavisi', rgb: [44, 66, 88] },
      { hex: '#364335', percentage: 12, name: 'Karlar Altında Çam Yeşili', rgb: [54, 67, 53] },
      { hex: '#745745', percentage: 8, name: 'Ahşap Tapınak Sütunları & Şemsiye', rgb: [116, 87, 69] }
    ],
    harmonyMoodTr: 'Tapınak kırmızısı ile bembeyaz kar örtüsünün mistik, lirik ve dinlendirici zıtlığı.',
    harmonyMoodEn: 'Lyrical Japanese contrast between lacquer vermilion architecture and pristine falling snow.',
    views: 3890,
    likes: 1180,
    isCuratorPick: false,
    exhibitionLocation: {
      city: 'Kyoto',
      venue: 'Kyoto Ulusal Modern Sanat Müzesi (MOMAK)',
      lat: 35.0135,
      lng: 135.7828
    },
    tags: ['hasui kawase', 'shin hanga', 'kar', 'japonya', 'zojoji', 'kırmızı tapınak'],
    printOptions: [
      { size: '39 × 27 cm Orijinal Boyut', paperType: 'Echizen El Yapımı Washi 220 gsm', priceTl: 4600, priceEur: 125, editionTotal: 100, editionRemaining: 18 },
      { size: '50 × 70 cm Çerçeveli Müze Formatı', paperType: 'Hahnemühle Torchon', priceTl: 8200, priceEur: 220, editionTotal: 40, editionRemaining: 6 }
    ],
    audioGuide: {
      duration: '04:00',
      narrator: 'Yukihiro Tanaka (Shin-hanga Arşiv Enstitüsü)',
      summary: 'Hasui Kawase\'nin kar tanelerini ahşap blokta oyma ustalığı ve Japon kış hüznü.'
    }
  },
  {
    id: 8,
    slug: 'tadao-ando-church-of-the-light',
    accessionNumber: 'ACC.2026.0108',
    title: 'Church of the Light: Haç Biçimli Işık Yarığı',
    artist: 'Tadao Ando',
    artistBioTr: '1941, Osaka doğumlu Japon mimar. 1995 Pritzker Mimarlık Ödülü sahibi. Ham brütalist beton, su ve doğal ışığı hiçbir süsleme olmadan kutsal bir dinginliğe dönüştüren çağımızın en büyük mimarlarından biri.',
    artistBioEn: 'Born in Osaka, 1941. Legendary Pritzker laureate renowned for raw board-formed concrete and sculptural manipulation of natural light into sacred spatial serenity.',
    category: 'architecture',
    year: 1989,
    mediumTr: 'Yerinde Dökülmüş Pürüzsüz Brütalist Beton & Haç Biçimli Işık Yarığı Açıklığı',
    mediumEn: 'Cast-in-Place Smooth Architectural Concrete, Cruciform Wall Penetration Aperture',
    dimensions: '113 m² Tapınak Alanı (6 × 6 × 18 m Beton Prizma)',
    resolution: 'Japon Zen Minimalizmi & Brütalist Geometri',
    storyTr: 'Osaka\'daki yapı, tüm yapay süslemelerden arındırılmış yalın bir beton kutudur. Sunak duvarındaki haç biçimli yarık, sabah güneşinin tapınak zeminine düşmesiyle ışığı fiziksel bir heykel gibi maddeleştirir. Boşluk (Mu) kavramının mimarlık tarihindeki en güçlü tezahürüdür.',
    storyEn: 'A minimalist concrete prism devoid of ornament, where a cruciform void cut into the altar wall admits morning sunlight as a physical, radiant spiritual presence.',
    technicalDetailsTr: 'Kalıp izleri ve koni delikleri (tie-rod holes) kusursuz bir ritimle hesaplanmış, beton yüzey mermer pürüzsüzlüğünde parlatılmıştır.',
    technicalDetailsEn: 'Unadorned board-formed concrete polished to satin tactile smoothness, calculated around strict 6-meter modules.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/4b/Ibaraki_Kasugaoka_Church_light_cross.jpg',
    colorPalette: [
      { hex: '#7A7874', percentage: 44, name: 'Pürüzsüz Japon Beton Grisi', rgb: [122, 120, 116] },
      { hex: '#FAF8F5', percentage: 24, name: 'Güneş Işığından Kutsal Haç', rgb: [250, 248, 245] },
      { hex: '#383634', percentage: 16, name: 'Karanlık Köşe Boşlukları', rgb: [56, 54, 52] },
      { hex: '#A4A19B', percentage: 10, name: 'Işık Yansıyan Açık Beton', rgb: [164, 161, 155] },
      { hex: '#1C1B1A', percentage: 6, name: 'Koyu Ahşap Zemin Döşemesi', rgb: [28, 27, 26] }
    ],
    harmonyMoodTr: 'Ham brütalist beton griliği ile tavan yarığından süzülen saf güneş ışığı huzuru.',
    harmonyMoodEn: 'Ascetic harmony balancing raw industrial concrete neutral planes with pure celestial daylight.',
    views: 4320,
    likes: 1410,
    isCuratorPick: true,
    exhibitionLocation: {
      city: 'Osaka',
      venue: 'Ibaraki Kasugaoka Kilisesi & Mimarlık Müzesi',
      lat: 34.8188,
      lng: 135.5392
    },
    tags: ['tadao ando', 'ışık kilisesi', 'brütalizm', 'osaka', 'beton', 'zen', 'ışık yarığı'],
    printOptions: [
      { size: '60 × 90 cm Mimari Monograf Baskı', paperType: 'Hahnemühle Bamboo 290 gsm (Doğal Lif)', priceTl: 7100, priceEur: 190, editionTotal: 50, editionRemaining: 12 },
      { size: '90 × 135 cm Büyük Sergi Edisyonu', paperType: 'Canson Infinity Platine Fibre Rag', priceTl: 13900, priceEur: 380, editionTotal: 20, editionRemaining: 3 }
    ],
    audioGuide: {
      duration: '04:20',
      narrator: 'Prof. Kenzo Murata (Osaka Üniversitesi Mimarlık Tarihi)',
      summary: 'Tadao Ando\'nun betonu ve ışığı bir ibadet ve meditasyon aracına dönüştürme felsefesi.'
    }
  },
  {
    id: 9,
    slug: 'vincent-van-gogh-badem-cicekleri',
    accessionNumber: 'ACC.2026.0109',
    title: 'Çiçek Açan Badem Ağacı (Almond Blossom)',
    artist: 'Vincent van Gogh',
    artistBioTr: '1853 - 1890, Zundert. Post-empresyonizmin ve modern sanatın kurucu dehası. Yoğun fırça vuruşları, saf renk kullanımı ve Japon ahşap baskılarından aldığı ilhamla Batı resim sanatına çağ atlatmıştır.',
    artistBioEn: '1853 - 1890. Visionary Dutch post-impressionist master whose expressive brushwork and bold color revolutionized Western modern art.',
    category: 'illustration',
    year: 1890,
    mediumTr: 'Tuval Üzerine Yağlı Boya, Doğal Turkuaz ve Kemik Beyazı Pigmentleri',
    mediumEn: 'Oil on Canvas, Cerulean Turquoise and Zinc White Glazes',
    dimensions: '73.5 × 92 cm (Orijinal Başyapıt Ebatı)',
    resolution: 'Post-Empresyonist Dokulu Impasto Yüzey Standardı',
    storyTr: 'Van Gogh\'un yeğeni Vincent Willem\'in doğumunu kutlamak üzere Saint-Rémy\'de yaptığı bu başyapıt, masmavi bir gökyüzüne karşı baharın uyanışını simgeleyen beyaz badem çiçeklerini betimler. Sanatçının Japon Ukiyo-e kompozisyonlarından esinlendiği en huzurlu ve lirik eseridir.',
    storyEn: 'Painted in Saint-Rémy to celebrate the birth of his nephew, blossoming almond branches against a cerulean turquoise sky symbolize rebirth, hope, and Japanese-inspired lyricism.',
    technicalDetailsTr: 'Canlı firuze mavisi zemin üzerine kalın impasto yağlı boya tabakası ile badem dallarının heykelsi konturları çekilmiştir.',
    technicalDetailsEn: 'Thick impasto technique contrasting vivid cerulean washes with deliberate dark contouring inspired by Hiroshige.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Vincent_van_Gogh_-_Almond_blossom_-_Google_Art_Project.jpg/1280px-Vincent_van_Gogh_-_Almond_blossom_-_Google_Art_Project.jpg',
    colorPalette: [
      { hex: '#4B9DA8', percentage: 42, name: 'Firuze Turkuaz Gökyüzü', rgb: [75, 157, 168] },
      { hex: '#F2EDE4', percentage: 28, name: 'Badem Çiçeği Yaprak Beyazı', rgb: [242, 237, 228] },
      { hex: '#2A4E58', percentage: 14, name: 'Derin Deniz Mavisi Gölgeler', rgb: [42, 78, 88] },
      { hex: '#876948', percentage: 10, name: 'Bahar Ağacı Ahşap Dalı', rgb: [135, 105, 72] },
      { hex: '#D2AF6C', percentage: 6, name: 'Çiçek Çanağı Oksit Sarısı', rgb: [210, 175, 108] }
    ],
    harmonyMoodTr: 'Işıltılı firuze mavisi zemin ile saf badem çiçeği beyazının bahar tazeliği ve lirik dinginliği.',
    harmonyMoodEn: 'Luminous cerulean turquoise counterbalanced by delicate blossoming white petals.',
    views: 8940,
    likes: 3120,
    isCuratorPick: true,
    exhibitionLocation: {
      city: 'Amsterdam',
      venue: 'Van Gogh Müzesi · Ana Koleksiyon Salonu',
      lat: 52.3584,
      lng: 4.8811
    },
    tags: ['van gogh', 'badem çiçekleri', 'post-empresyonizm', 'amsterdam', 'bahar', 'yağlı boya'],
    printOptions: [
      { size: '50 × 65 cm Müze Özel Baskı', paperType: 'Canson Infinity Arches Aquarelle 310 gsm', priceTl: 5900, priceEur: 160, editionTotal: 120, editionRemaining: 21 },
      { size: '75 × 95 cm Orijinal Boyut Sergi Edisyonu', paperType: 'Hahnemühle German Etching', priceTl: 11500, priceEur: 310, editionTotal: 35, editionRemaining: 4 }
    ],
    audioGuide: {
      duration: '04:45',
      narrator: 'Emilie Gordenker (Van Gogh Müzesi Direktörü)',
      summary: 'Van Gogh\'un yeğenine adadığı badem çiçeklerinin renk felsefesi ve Japon esintileri.'
    }
  },
  {
    id: 10,
    slug: 'sougwen-chung-drawing-operations',
    accessionNumber: 'ACC.2026.0110',
    title: 'Drawing Operations: Generatif Robotik Akış',
    artist: 'Sougwen Chung',
    artistBioTr: 'Kanadalı-Çinli çağdaş sanatçı ve araştırmacı. Eski MIT Media Lab araştırmacısı. İnsan el hareketlerini yapay zeka ve çok kollu fırça robotlarıyla senkronize ederek ortak yaratım (co-creation) manifestosunu savunur.',
    artistBioEn: 'Former MIT Media Lab fellow pioneering human-machine collaboration by synchronizing biological brush gestures with autonomous robotic arms.',
    category: 'digital',
    year: 2020,
    mediumTr: 'Biyometrik Veri Sinyalleri, Robotik Fırça Kinetiği, Çin Mürekkebi & Akrilik',
    mediumEn: 'Biometric Sensor Data, Robotic Arm Kinetic Tracing, Japanese Sumi Ink on Paper',
    dimensions: '180 × 240 cm Mekansal Tuval',
    resolution: 'Kinetik Sensör ve Nöral Vektör Akış Haritası',
    storyTr: 'Sanatçının kalp atışları ve nöronal sinyalleriyle yönlenen fırça darbelerine, yapay zeka tabanlı robotik kolların anlık estetik yanıtlar vermesiyle oluşan devasa bir soyutlama. Makine ile biyolojik bedenin estetik diyaloğudur.',
    storyEn: 'A fluid dialogue between organic human gesture and artificial neural networks, where robotic brushes mimic and diverge from physical brushstrokes in real-time.',
    technicalDetailsTr: 'EEG nöro-başlık sinyalleri ve optik hareket yakalama kameraları; Python ve TouchDesigner üzerinde geliştirilen özel veri köprüsü.',
    technicalDetailsEn: 'Real-time gesture analysis using optical motion capture coupled with custom generative recurrent neural models.',
    imageUrl: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1400&q=85',
    colorPalette: [
      { hex: '#161924', percentage: 46, name: 'Derin Kinetik Mürekkep Siyahı', rgb: [22, 25, 36] },
      { hex: '#4863A0', percentage: 24, name: 'Elektro-Nöral Mavi Akış', rgb: [72, 99, 160] },
      { hex: '#8FAADC', percentage: 14, name: 'Hassas Sensör Grisi', rgb: [143, 170, 220] },
      { hex: '#EAEFF8', percentage: 10, name: 'Mekansal Tuval Açıklığı', rgb: [234, 239, 248] },
      { hex: '#C2847A', percentage: 6, name: 'Biyolojik Nabız Sıcaklığı', rgb: [194, 132, 122] }
    ],
    harmonyMoodTr: 'Geleneksel Sumi mürekkep derinliği ile fütüristik elektro-nöral mavinin dinamik akışı.',
    harmonyMoodEn: 'High-contrast technological resonance marrying traditional ink density with luminous neural cyan.',
    views: 4120,
    likes: 1290,
    isCuratorPick: false,
    exhibitionLocation: {
      city: 'Londra',
      venue: 'Victoria and Albert Museum (V&A) · Dijital Gelecekler Galerisi',
      lat: 51.4966,
      lng: -0.1722
    },
    tags: ['sougwen chung', 'robotik sanat', 'yapay zeka', 'generatif', 'mürekkep'],
    printOptions: [
      { size: '60 × 80 cm Kinetik Sergi Edisyonu', paperType: 'Hahnemühle Museum Etching 350 gsm', priceTl: 6800, priceEur: 180, editionTotal: 50, editionRemaining: 9 },
      { size: '90 × 120 cm Master Baskı', paperType: 'Canson Infinity Rag Photographique', priceTl: 12900, priceEur: 350, editionTotal: 20, editionRemaining: 2 }
    ],
    audioGuide: {
      duration: '03:50',
      narrator: 'Curator Karen O\'Neill (V&A Çağdaş Sanatlar)',
      summary: 'Yapay zeka robotik kollarının insan ressamla tuval üzerindeki estetik düellosu.'
    }
  },
  {
    id: 11,
    slug: 'vera-molnar-144-carres-traites',
    accessionNumber: 'ACC.2026.0111',
    title: '144 Carrés Traités: Algoritmik Bozulma',
    artist: 'Vera Molnár',
    artistBioTr: '1924 - 2023, Budapeşte / Paris. Bilgisayar destekli sanatın ve generatif algoritmaların dünyadaki ilk kadın öncüsü. "Makine Hayal Gücü" kavramını ilk kez 1968 yılında Fortran koduyla tuvale aktarmıştır.',
    artistBioEn: '1924 - 2023. Visionary French-Hungarian pioneer of computer art who began writing generative algorithms in Fortran as early as 1968.',
    category: 'digital',
    year: 1974,
    mediumTr: 'Algoritmik Plotter Çizimi, Özel Akrilik Pigment & Arşiv Bristol Kartonu',
    mediumEn: 'Computer Algorithmic Plotter Output, Archival Drawing Ink on Bristol Paper',
    dimensions: '80 × 80 cm Kare Format',
    resolution: 'Vektörel Algoritmik Koordinat Matrisi',
    storyTr: '144 adet mükemmel geometrik karenin, her adımda rastlantısal bir matematiksel sapma (1% disorder) ile bozulmasını inceler. Molnár\'a göre sanat, katı geometrik nizam ile insan hatasının getirdiği kontrol edilemez duygunun kesişimindedir.',
    storyEn: 'A generative matrix of 144 squares subject to controlled random perturbations, pioneering the dialogue between computational rigor and human imperfection.',
    technicalDetailsTr: 'Benson plotter cihazı, Fortran tabanlı "Molnart" programlama kütüphanesi; rastlantısal sayı üreteci (pseudo-random walk).',
    technicalDetailsEn: 'Early computer plotter output driven by custom Fortran procedural routines introducing micro-disorder into Euclidean planes.',
    imageUrl: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1400&q=85',
    colorPalette: [
      { hex: '#2B3E75', percentage: 38, name: 'Kobalt Algoritma Mavisi', rgb: [43, 62, 117] },
      { hex: '#D64560', percentage: 26, name: 'Kromatik Magenta Vektörü', rgb: [214, 69, 96] },
      { hex: '#E5A93C', percentage: 18, name: 'Sıcak Spektrum Sarısı', rgb: [229, 169, 60] },
      { hex: '#F5F3EC', percentage: 12, name: 'Arşiv Bristol Kağıt Kemik Tonu', rgb: [245, 243, 236] },
      { hex: '#1C2230', percentage: 6, name: 'Negatif Koordinat Boşluğu', rgb: [28, 34, 48] }
    ],
    harmonyMoodTr: 'Rasyonel matematiksel ızgara ile canlı renk gradyanlarının enerjik generatif kontrastı.',
    harmonyMoodEn: 'Dynamic generative tension uniting structural computer grids with chromatic vibrancy.',
    views: 3980,
    likes: 1210,
    isCuratorPick: false,
    exhibitionLocation: {
      city: 'Paris',
      venue: 'Centre Pompidou · Dijital Sanatlar Arşivi',
      lat: 48.8606,
      lng: 2.3522
    },
    tags: ['vera molnar', 'generatif sanat', 'algoritma', 'plotter', 'pompidou', 'kod'],
    printOptions: [
      { size: '50 × 50 cm Kare Edisyon', paperType: 'Hahnemühle Photo Rag Bright White 310 gsm', priceTl: 5600, priceEur: 150, editionTotal: 75, editionRemaining: 14 },
      { size: '80 × 80 cm Sergi Koleksiyonu', paperType: 'Canson Infinity Velin Museum', priceTl: 11200, priceEur: 300, editionTotal: 25, editionRemaining: 3 }
    ],
    audioGuide: {
      duration: '03:45',
      narrator: 'Dr. Vincent Broqua (Sorbonne Sanat Teorisi)',
      summary: 'Vera Molnár’ın bilgisayarı bir resim fırçası gibi kullanarak başlattığı generatif sanat devrimi.'
    }
  },
  {
    id: 12,
    slug: 'daido-moriyama-shinjuku-rain',
    accessionNumber: 'ACC.2026.0112',
    title: 'Shinjuku Gece Yağmuru ve Neon Yansımaları',
    artist: 'Daidō Moriyama',
    artistBioTr: '1938, Osaka doğumlu Japon sokak fotoğrafçılığının kült ismi. "Are, Bure, Boke" (Grenli, Bulanık, Odaksız) manifestosuyla geleneksel fotoğraf estetiğini yıkarak Tokyo sokaklarının vahşi enerjisini belgelemiştir.',
    artistBioEn: 'Born in Osaka, 1938. Giant of postwar Japanese street photography famous for raw, grainy, high-contrast snapshots capturing Tokyo’s urban pulse.',
    category: 'street',
    year: 1971,
    mediumTr: 'Kompakt 35mm Ricoh GR21, Yüksek Kontrastlı Tri-X Film & Islak Zemin Yansımaları',
    mediumEn: '35mm High-Contrast Grainy Film, Street Chiaroscuro Silver Gelatin',
    dimensions: '50 × 75 cm Sinematik Karanlık Oda Baskısı',
    resolution: 'Karakteristik Analog Gren & Sokak Acutance',
    storyTr: 'Gece yağmuruyla ıslanan Shinjuku sokaklarında neon tabelaların asfalt üzerinde açtığı ışıltılı yarıklar ve şemsiyeler altında hızla yürüyen Tokyo insanları. Moriyama, kentsel yalnızlığı ve kentin ham nabzını vizörsüz anlık çekimlerle ebedileştirir.',
    storyEn: 'Rain-slicked asphalt reflecting Tokyo neon signs amidst the rush of nocturnal commuters, epitomizing Moriyama’s visceral capture of raw urban alienation.',
    technicalDetailsTr: 'Geliştiricide yüksek sıcaklıkta aşırı banyo edilmiş Tri-X 400 film; derin gölgelerde maksimum siyah yoğunluğu (D-Max).',
    technicalDetailsEn: 'Pushed Kodak Tri-X negative processed in warm developer for intense acutance and deep ink-black shadows.',
    imageUrl: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1400&q=85',
    colorPalette: [
      { hex: '#11141A', percentage: 40, name: 'Tokyo Islak Asfalt Siyahı', rgb: [17, 20, 26] },
      { hex: '#4872A3', percentage: 25, name: 'Yağmur Mavisi & Kurşuni Gökyüzü', rgb: [72, 114, 163] },
      { hex: '#B83256', percentage: 18, name: 'Neon Tabela Kırmızısı', rgb: [184, 50, 86] },
      { hex: '#E2984A', percentage: 12, name: 'Fener Amber Parlaması', rgb: [226, 152, 74] },
      { hex: '#D8DEE8', percentage: 5, name: 'Su Birikintisi Flaş Yansıması', rgb: [216, 222, 232] }
    ],
    harmonyMoodTr: 'Islak zemin siyahı üzerinde patlayan neon kırmızısı ve sokak lambası ışıklarının sinematik noir dengesi.',
    harmonyMoodEn: 'Nocturnal cinematic noir charged with vivid neon red bursts against saturated wet basalt.',
    views: 4670,
    likes: 1480,
    isCuratorPick: true,
    exhibitionLocation: {
      city: 'Tokyo',
      venue: 'Tokyo Metropolitan Fotoğraf Müzesi (TOP Museum)',
      lat: 35.6418,
      lng: 139.7135
    },
    tags: ['daido moriyama', 'shinjuku', 'tokyo', 'sokak fotoğrafı', 'neon', 'yağmur'],
    printOptions: [
      { size: '40 × 60 cm Baryta Baskı', paperType: 'Ilford Galerie Prestige Warmtone 310 gsm', priceTl: 6400, priceEur: 175, editionTotal: 80, editionRemaining: 16 },
      { size: '60 × 90 cm Büyük Karanlık Oda Edisyonu', paperType: 'Hahnemühle FineArt Baryta', priceTl: 12500, priceEur: 340, editionTotal: 25, editionRemaining: 4 }
    ],
    audioGuide: {
      duration: '04:05',
      narrator: 'Tetsuya Oshima (TOP Museum Kıdemli Fotoğraf Küratörü)',
      summary: 'Daidō Moriyama’nın Shinjuku gecelerindeki avcı bakışı ve Japon sokak fotoğrafının kökleri.'
    }
  },
  {
    id: 13,
    slug: 'gustav-klimt-altin-donem-deseni',
    accessionNumber: 'ACC.2026.0113',
    title: 'Altın Dönem & Viyana Secession Deseni',
    artist: 'Gustav Klimt',
    artistBioTr: '1862 - 1918, Viyana. Art Nouveau ve Viyana Secession hareketinin kurucusu. Eserlerinde altın varak, Bizans mozaikleri ve erotik zarafeti birleştiren Avusturya modernizminin başyapıt ustası.',
    artistBioEn: '1862 - 1918. Founder of the Vienna Secession celebrated for his Gold Phase combining gilded leaf, Byzantine mosaic ornamentation, and symbolist lyricism.',
    category: 'illustration',
    year: 1907,
    mediumTr: 'Tuval Üzerine Yağlı Boya, 24 Ayar Altın Varak ve Platin Mozaik İşlemesi',
    mediumEn: 'Oil and Gold Leaf, Platinum Leaf and Silver Flakes on Linen Canvas',
    dimensions: '180 × 180 cm Kare Anıtsal Tuval',
    resolution: 'Secessionist Altın İşçiliği ve Mineral Pigment',
    storyTr: 'Viyana modernizminin zirvesini simgeleyen bu kompozisyon; altın varakların güneş ışığı gibi parladığı dekoratif geometrik motiflerle sarılmış figürleri betimler. Aşkın, ebedi bağlılığın ve Doğu-Batı sanat sentezinin en göz kamaştırıcı abidesidir.',
    storyEn: 'A monumental canvas drenched in glittering gold leaf and micro-geometric ornamentation, uniting symbolist devotion with Byzantine decorative splendor.',
    technicalDetailsTr: 'Geleneksel gesso zemin üzerine deniz kabuğu ezmesi, doğal lapis tozu ve preslenmiş 24 ayar altın yapraklar mühürlenmiştir.',
    technicalDetailsEn: 'Gold leaf and bronze pigment burnished over traditional gesso primer, intertwined with delicate oil glazing.',
    imageUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1400&q=85',
    colorPalette: [
      { hex: '#D2A138', percentage: 42, name: '24 Ayar Viyana Altın Varak', rgb: [210, 161, 56] },
      { hex: '#7A3228', percentage: 22, name: 'Bizans Kırmızı Oksit & Kestane', rgb: [122, 50, 40] },
      { hex: '#1C2C3D', percentage: 16, name: 'Derin Lapis Mozaik Mavisi', rgb: [28, 44, 61] },
      { hex: '#EBE4D2', percentage: 12, name: 'İnci ve Alabaster Ten Tonu', rgb: [235, 228, 210] },
      { hex: '#485838', percentage: 8, name: 'Secession Çayır Yeşili', rgb: [72, 88, 56] }
    ],
    harmonyMoodTr: 'Göz kamaştırıcı sıcak altın varak ile antik Venedik kırmızısı ve lapis mavisinin asil ihtişamı.',
    harmonyMoodEn: 'Regal equilibrium radiating from burnished gold leaf, accented by Venetian red and deep lapis lazuli.',
    views: 9420,
    likes: 3560,
    isCuratorPick: true,
    exhibitionLocation: {
      city: 'Viyana',
      venue: 'Österreichische Galerie Belvedere · Mermer Salon',
      lat: 48.1915,
      lng: 16.3808
    },
    tags: ['gustav klimt', 'viyana secession', 'altın dönem', 'belvedere', 'avusturya', 'art nouveau'],
    printOptions: [
      { size: '60 × 60 cm Müze Özel Varak Baskı', paperType: 'Hahnemühle William Turner 310 gsm', priceTl: 7900, priceEur: 215, editionTotal: 100, editionRemaining: 18 },
      { size: '100 × 100 cm Orijinal Boyut Koleksiyoner', paperType: 'Canson Infinity Arches BFK Rives', priceTl: 15400, priceEur: 420, editionTotal: 30, editionRemaining: 5 }
    ],
    audioGuide: {
      duration: '05:25',
      narrator: 'Dr. Markus Fellinger (Belvedere Sarayı Baş Küratörü)',
      summary: 'Klimt’in Ravenna mozaiklerinden ilham alarak altını bir duygu diline dönüştürme süreci.'
    }
  },
  {
    id: 14,
    slug: 'le-corbusier-ronchamp-chapel',
    accessionNumber: 'ACC.2026.0114',
    title: 'Ronchamp Şapeli: Brütalist Işık Kaviteleri',
    artist: 'Le Corbusier',
    artistBioTr: '1887 - 1965, İsviçre / Fransa. Modern mimarlığın kurucusu. Brütalizmin, "Béton Brut" (ham beton) felsefesinin ve mekan-insan oranını düzenleyen Modulor sisteminin yaratıcısıdır.',
    artistBioEn: '1887 - 1965. Father of modern architecture whose mastery of raw concrete (béton brut) and sacred daylight culminated in the sculptural triumph of Ronchamp.',
    category: 'architecture',
    year: 1955,
    mediumTr: 'Yerinde Dökülmüş Pürüzlü Ham Beton (Béton Brut), Renkli Cam Işık Açıklıkları & Taş Kireç Harcı',
    mediumEn: 'Rough-Cast Monolithic Béton Brut, Tapered Deep Wall Daylight Cavities',
    dimensions: '350 m² Heykelsi Tapınak Alanı (Yengeç Kabuğu Kavisli Beton Çatı)',
    resolution: 'Modulor Oranlama & Heykelsi Brütalizm',
    storyTr: 'Vosges dağlarının tepesinde yükselen yapı, dik açılı kutu mimarisine meydan okuyan devasa kavisli bir mantarı andırır. Güney duvarındaki konik ve derin yarıklar, güneş ışığını içeriye renkli kutsal ışık huzmeleri olarak düşürür.',
    storyEn: 'A sculptural sanctuary where curving concrete walls pierced with irregular, funnel-shaped apertures transform exterior sunbeams into mystical sacred illumination.',
    technicalDetailsTr: 'İkinci Dünya Savaşı yıkıntılarından toplanan taşlarla doldurulmuş kalın beton duvarlar; çatıyı duvardan birkaç santimetre ayıran ince ışık yarığı.',
    technicalDetailsEn: 'Thick mass walls tapering upward, supporting an upturned sail-like concrete roof suspended with a slit of celestial light.',
    imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1400&q=85',
    colorPalette: [
      { hex: '#848078', percentage: 42, name: 'Béton Brut Ham Beton Grisi', rgb: [132, 128, 120] },
      { hex: '#E8E4D8', percentage: 24, name: 'Kireç Badanalı Duvar Beyazı', rgb: [232, 228, 216] },
      { hex: '#D89842', percentage: 16, name: 'Renkli Camdan Süzülen Amber Işığı', rgb: [216, 152, 66] },
      { hex: '#2A2928', percentage: 12, name: 'Gölge Çatlakları ve Kaviteler', rgb: [42, 41, 40] },
      { hex: '#4A6278', percentage: 6, name: 'Vosges Dağ Ufku Mavisi', rgb: [74, 98, 120] }
    ],
    harmonyMoodTr: 'Ağır gri beton kütle ile derin duvar oyuklarından süzülen sıcak kutsal ışığın meditatif dengesi.',
    harmonyMoodEn: 'Poetic tactile dialogue between cold textured brutalist concrete and warm amber daylight slits.',
    views: 4890,
    likes: 1620,
    isCuratorPick: false,
    exhibitionLocation: {
      city: 'Ronchamp',
      venue: 'Chapelle Notre-Dame du Haut · Mimari Koruma Arşivi',
      lat: 47.7044,
      lng: 6.6206
    },
    tags: ['le corbusier', 'ronchamp', 'brütalizm', 'beton', 'ışık kaviteleri', 'mimarlık'],
    printOptions: [
      { size: '60 × 90 cm Mimari Özel Seri', paperType: 'Hahnemühle Photo Rag Ultra Smooth 305 gsm', priceTl: 7200, priceEur: 195, editionTotal: 50, editionRemaining: 11 },
      { size: '100 × 150 cm Monolit Edisyon', paperType: 'Canson Infinity Baryta', priceTl: 14500, priceEur: 390, editionTotal: 15, editionRemaining: 2 }
    ],
    audioGuide: {
      duration: '04:30',
      narrator: 'Jean-Louis Cohen (Fransız Mimarlık Tarihçisi)',
      summary: 'Le Corbusier’nin ışığı fiziksel bir yapı malzemesi olarak nasıl kullandığının analizi.'
    }
  },
  {
    id: 15,
    slug: 'syd-mead-neo-tokyo-2049',
    accessionNumber: 'ACC.2026.0115',
    title: 'Neo-Tokyo 2049: Spekülatif Megakent ve Spinner',
    artist: 'Syd Mead',
    artistBioTr: '1933 - 2019, Minnesota. "Görsel Fütürizmin Babası" olarak anılan efsanevi endüstriyel tasarımcı. Blade Runner, Tron ve Aliens filmlerinin ikonik atmosferini ve geleceğin uçan araçlarını (Spinner) tasarlamıştır.',
    artistBioEn: '1933 - 2019. The legendary "Visual Futurist" behind Blade Runner, Tron, and Aliens who set the gold standard for cinematic speculative concept design.',
    category: 'concept',
    year: 1982,
    mediumTr: 'Guaj ve Marker Boya, Katmanlı İllüstrasyon Kartonu & Sinematik Neo-Noir Aydınlatma',
    mediumEn: 'Gouache and Marker on Bainbridge Board, Retro-Futuristic Neo-Noir Illumination',
    dimensions: '60 × 100 cm (16:9 Geniş Açı Konsept Formatı)',
    resolution: 'Analog Guaj Ustalığı ve Endüstriyel Çizgi Hassasiyeti',
    storyTr: 'Sürekli asit yağmuru yağan distopik bir 21. yüzyıl megakentinde, devasa gökdelenlerin kanyonları arasında süzülen bir polis hava aracı (Spinner). Mead, mimarinin ve mekaniğin aerodinamik geleceğini analog guaj boyanın sıcaklığıyla resmetmiştir.',
    storyEn: 'A cinematic vision of high-altitude law enforcement craft navigating the wet canyon walls of a monolithic future megacity bathed in neon-diffused smog.',
    technicalDetailsTr: 'Bainbridge 80 illüstrasyon kartonu üzerinde Winsor & Newton guaj; ışık kırılmaları için şeffaf hava fırçası (airbrush) katmanları.',
    technicalDetailsEn: 'Winsor & Newton designer gouache and dry markers over graphite underdrawing, accented with precision airbrush glazes.',
    imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1400&q=85',
    colorPalette: [
      { hex: '#0E1724', percentage: 38, name: 'Siberpunk Gece Gökyüzü & Sis', rgb: [14, 23, 36] },
      { hex: '#225577', percentage: 26, name: 'Endüstriyel Çelik & Monolit Mavisi', rgb: [34, 85, 119] },
      { hex: '#D87A38', percentage: 18, name: 'Spinner Motor Alevi Amberi', rgb: [216, 122, 56] },
      { hex: '#7E4275', percentage: 12, name: 'Neon Reklam Moru Yansıması', rgb: [126, 66, 117] },
      { hex: '#D5DFEA', percentage: 6, name: 'Projektör Işık Huzmesi', rgb: [213, 223, 234] }
    ],
    harmonyMoodTr: 'Kasvetli distopik mavi-gri kanyonların ortasında parıldayan sıcak kinetik amber motor ateşi.',
    harmonyMoodEn: 'Electric atmospheric tension balancing cold dystopian shadow canyons with glowing aerodynamic amber.',
    views: 5820,
    likes: 1940,
    isCuratorPick: true,
    exhibitionLocation: {
      city: 'Los Angeles',
      venue: 'Petersen Automotive Museum · Fütürizm Galerisi',
      lat: 34.0624,
      lng: -118.3614
    },
    tags: ['syd mead', 'konsept tasarım', 'blade runner', 'fütürizm', 'spekülatif', 'spinner'],
    printOptions: [
      { size: '50 × 90 cm Geniş Format', paperType: 'Canson Infinity Rag Photographique 310 gsm', priceTl: 6500, priceEur: 175, editionTotal: 70, editionRemaining: 13 },
      { size: '80 × 140 cm Koleksiyon Sinematik Boyut', paperType: 'Hahnemühle German Etching', priceTl: 13200, priceEur: 360, editionTotal: 25, editionRemaining: 3 }
    ],
    audioGuide: {
      duration: '04:10',
      narrator: 'Leslie Syd Mead (Syd Mead Tasarım Arşivi Direktörü)',
      summary: 'Syd Mead’in Blade Runner dünyasını bir geleceğin gerçeği gibi inşa ediş felsefesi.'
    }
  },
  {
    id: 16,
    slug: 'moebius-arzach-spekulatif-col',
    accessionNumber: 'ACC.2026.0116',
    title: 'Arzach: Spekülatif Çöl ve Pterodaktil Uçuşu',
    artist: 'Moebius (Jean Giraud)',
    artistBioTr: '1938 - 2012, Paris. Bilimkurgu ve spekülatif çizgi romanın dünyadaki en büyük ilham kaynağı. Hayao Miyazaki, Ridley Scott ve George Lucas gibi dev yönetmenlerin görsel evrenini şekillendirmiştir.',
    artistBioEn: '1938 - 2012. Legendary French master whose surrealist, wordless sci-fi landscapes fundamentally shaped the visual vocabulary of modern science fiction.',
    category: 'concept',
    year: 1976,
    mediumTr: 'Çini Mürekkebi Taraması, Sulu Boya Yıkaması & Asitsiz Arşiv İllüstrasyon Kağıdı',
    mediumEn: 'Rotring Rapidograph Ink Hatching, Subtle Watercolor Glazes on Paper',
    dimensions: '50 × 70 cm Orijinal Levha Boyutu',
    resolution: 'Usta Çini Taraması ve Lirik Mekan Genişliği',
    storyTr: 'Sonsuz kızıl kayalıkların ve devasa fosilleşmiş kemiklerin uzandığı sessiz bir spekülatif gezegen çölünde, mekanik-biyolojik bir pterodaktil sırtında sessizce süzülen Arzach. Tek bir kelime olmadan mekanın sonsuzluğunu ve zamanın unutulmuşluğunu anlatır.',
    storyEn: 'A solitary silent figure soaring atop a prehistoric pterodactyl across a mineral desert of petrified bones, creating an unforgettable metaphysical sci-fi atmosphere.',
    technicalDetailsTr: 'Rotring 0.1mm çini kalemiyle mikroskobik gölge taramaları; kuru fırça sulu boya ile çöl rüzgarı gradyanları.',
    technicalDetailsEn: 'Virtuosic stippling and micro-hatching using technical pens, underlaid by dry-brush ochre and twilight lavender watercolor washes.',
    imageUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1400&q=85',
    colorPalette: [
      { hex: '#A85438', percentage: 38, name: 'Marsiyan Çöl Toprak Oksiti', rgb: [168, 84, 56] },
      { hex: '#4A3B68', percentage: 26, name: 'Alacakaranlık Spekülatif Moru', rgb: [74, 59, 104] },
      { hex: '#D89F5A', percentage: 18, name: 'Kızıl Kum Fosil Sarısı', rgb: [216, 159, 90] },
      { hex: '#1C1524', percentage: 12, name: 'Çini Mürekkebi Çizgi Tonu', rgb: [28, 21, 36] },
      { hex: '#EDE4D8', percentage: 6, name: 'Kuru Kemik Beyazı', rgb: [237, 228, 216] }
    ],
    harmonyMoodTr: 'Sıcak kızıl mineral çöl tonları ile lirik alacakaranlık morunun zamansız ve rüya gibi füzyonu.',
    harmonyMoodEn: 'Dreamlike surrealist harmony between warm terracotta canyon ochres and twilight violet skies.',
    views: 6140,
    likes: 2180,
    isCuratorPick: true,
    exhibitionLocation: {
      city: 'Paris',
      venue: 'Fondation Cartier pour l’art contemporain',
      lat: 48.8378,
      lng: 2.3317
    },
    tags: ['moebius', 'jean giraud', 'arzach', 'spekülatif', 'bilimkurgu', 'konsept'],
    printOptions: [
      { size: '50 × 70 cm Orijinal Boyut', paperType: 'Echizen El Yapımı Washi 220 gsm', priceTl: 6200, priceEur: 165, editionTotal: 80, editionRemaining: 15 },
      { size: '70 × 100 cm Sergi Koleksiyonu', paperType: 'Hahnemühle Torchon 285 gsm', priceTl: 11900, priceEur: 320, editionTotal: 30, editionRemaining: 4 }
    ],
    audioGuide: {
      duration: '04:15',
      narrator: 'Philippe Druillet (Métal Hurlant Eş-Kurucusu)',
      summary: 'Moebius’un Arzach ile çizgi roman sanatını nasıl modern bir tablo sanatına yükselttiği.'
    }
  }
];

export const initialReviews: CuratorReview[] = [
  {
    id: 1,
    artworkId: 1,
    userName: 'Prof. Dr. Halil Erdem',
    userRole: 'curator',
    rating: 5,
    comment: 'Refik Anadol\'un doğa verilerini bir heykel gibi akışkanlaştırması, dijital çağda sanatın materyal sınırlarını kökten yeniden tanımlıyor. Renk spektrumundaki mor ve kobalt harmonisi büyüleyici.',
    date: '2026-03-01'
  },
  {
    id: 2,
    artworkId: 2,
    userName: 'Zeynep Aksoy',
    userRole: 'member',
    rating: 5,
    comment: 'Arda Güler\'in Galata Köprüsü karesi, fotoğraf tarihinin insan ve mekan ilişkisini en saf haliyle yakalayan başyapıtlarından biridir. Haliç pusu ve balıkçıların sabah ritmindeki ton zenginliği usta bir gözü yansıtıyor.',
    date: '2026-02-28'
  },
  {
    id: 3,
    artworkId: 3,
    userName: 'Arda Yılmaz',
    userRole: 'curator',
    rating: 5,
    comment: 'Hokusai\'nin Büyük Dalga\'sındaki Prusya mavisi tonları ile el yapımı Kozo kağıdının dokusu arasındaki etkileşim, Batı ressamlarını neden büyülediğini bugün bile apaçık kanıtlıyor.',
    date: '2026-03-04'
  }
];
