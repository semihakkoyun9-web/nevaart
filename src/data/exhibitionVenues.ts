export interface ExhibitionVenue {
  id: string;
  name: string;
  city: string;
  country: string;
  region: 'turkey' | 'europe' | 'america';
  exhibitionTitle: string;
  exhibitionTitleEn: string;
  dates: string;
  datesEn: string;
  lat: number;
  lng: number;
  address: string;
  curatorNotes: string;
  curatorNotesEn: string;
  website: string;
  featuredCount?: number;
}

export const EXHIBITION_VENUES: ExhibitionVenue[] = [
  {
    id: 'met-ny',
    name: 'The Metropolitan Museum of Art (The Met)',
    city: 'New York',
    country: 'ABD',
    region: 'america',
    exhibitionTitle: 'Open Access CC0 Başyapıtlar Koleksiyonu',
    exhibitionTitleEn: 'Open Access CC0 Masterpieces Collection',
    dates: 'Kalıcı Açık Erişim Koleksiyonu (CC0)',
    datesEn: 'Permanent Open Access Collection (CC0)',
    lat: 40.7794,
    lng: -73.9632,
    address: '1000 Fifth Avenue, New York, NY 10028, USA',
    curatorNotes:
      'NevaArt dijital müzesindeki 16 The Met başyapıtının resmi ev sahibi. Avrupa resim sanatı, Japon ukiyo-e baskıları ve Amerikan tabloları kalıcı galerilerde sergilenmektedir.',
    curatorNotesEn:
      'Official home of 16 Open Access masterpieces in the NevaArt archive, spanning European paintings, Japanese ukiyo-e prints, and American art.',
    website: 'https://www.metmuseum.org',
    featuredCount: 16,
  },
  {
    id: 'cma-ohio',
    name: 'The Cleveland Museum of Art',
    city: 'Cleveland',
    country: 'ABD',
    region: 'america',
    exhibitionTitle: 'Avrupa ve Dünya Resim Sanatı Açık Arşivi',
    exhibitionTitleEn: 'European & World Painting Open Archive',
    dates: 'Kalıcı Açık Erişim Koleksiyonu (CC0)',
    datesEn: 'Permanent Open Access Collection (CC0)',
    lat: 41.509,
    lng: -81.6117,
    address: '11150 East Blvd, Cleveland, OH 44106, USA',
    curatorNotes:
      'NevaArt kataloğundaki 184 yüksek çözünürlüklü CC0 başyapıtın kaynağı. Rönesans, Barok, Empresyonizm ve 20. yüzyıl resim galerileriyle öne çıkmaktadır.',
    curatorNotesEn:
      'Source of 184 high-resolution CC0 masterpieces in the NevaArt catalog, celebrated for Renaissance, Baroque, Impressionist, and 20th-century painting galleries.',
    website: 'https://www.clevelandart.org',
    featuredCount: 184,
  },
  {
    id: 'louvre-paris',
    name: 'Musée du Louvre',
    city: 'Paris',
    country: 'Fransa',
    region: 'europe',
    exhibitionTitle: 'Rönesans, Klasik Heykel ve Büyük Avrupa Resimleri',
    exhibitionTitleEn: 'Renaissance, Classical Sculpture & European Masterpieces',
    dates: 'Kalıcı Koleksiyon · Denon & Richelieu Kanatları',
    datesEn: 'Permanent Collection · Denon & Richelieu Wings',
    lat: 48.8606,
    lng: 2.3376,
    address: 'Rue de Rivoli, 75001 Paris, France',
    curatorNotes:
      'Leonardo da Vinci, Delacroix, Vermeer ve David gibi ustaların eserlerine ev sahipliği yapan dünyanın en kapsamlı tarihî sanat müzesi.',
    curatorNotesEn:
      'One of the world’s most comprehensive historic art museums, housing iconic works by Leonardo da Vinci, Delacroix, Vermeer, and Jacques-Louis David.',
    website: 'https://www.louvre.fr',
  },
  {
    id: 'orsay-paris',
    name: 'Musée d’Orsay',
    city: 'Paris',
    country: 'Fransa',
    region: 'europe',
    exhibitionTitle: 'Empresyonizm ve Post-Empresyonizm Galerisi (1848–1914)',
    exhibitionTitleEn: 'Impressionism & Post-Impressionism Gallery (1848–1914)',
    dates: 'Kalıcı Koleksiyon · Beaux-Arts Gar Binası',
    datesEn: 'Permanent Collection · Beaux-Arts Railway Station',
    lat: 48.86,
    lng: 2.3266,
    address: 'Esplanade Valéry Giscard d’Estaing, 75007 Paris, France',
    curatorNotes:
      'Claude Monet, Vincent van Gogh, Édouard Manet, Edgar Degas, Pierre-Auguste Renoir ve Paul Cézanne başyapıtlarının en zengin koleksiyonu.',
    curatorNotesEn:
      'Houses the largest collection of Impressionist and Post-Impressionist masterpieces by Monet, Van Gogh, Manet, Degas, Renoir, and Cézanne.',
    website: 'https://www.musee-orsay.fr',
  },
  {
    id: 'rijksmuseum-ams',
    name: 'Rijksmuseum',
    city: 'Amsterdam',
    country: 'Hollanda',
    region: 'europe',
    exhibitionTitle: 'Hollanda Altın Çağı: Rembrandt ve Vermeer Salonu',
    exhibitionTitleEn: 'Dutch Golden Age: Gallery of Honour',
    dates: 'Kalıcı Koleksiyon · Onur Galerisi',
    datesEn: 'Permanent Collection · Gallery of Honour',
    lat: 52.36,
    lng: 4.8852,
    address: 'Museumstraat 1, 1071 XX Amsterdam, Netherlands',
    curatorNotes:
      'Rembrandt van Rijn’in Gece Devriyesi ve Johannes Vermeer’in Sütçü Kız başyapıtlarıyla 17. yüzyıl Hollanda ışık ve gölge ustalığını sergiler.',
    curatorNotesEn:
      'Showcases 17th-century Dutch mastery of light and shadow, anchored by Rembrandt’s Night Watch and Vermeer’s The Milkmaid.',
    website: 'https://www.rijksmuseum.nl',
  },
  {
    id: 'vangogh-ams',
    name: 'Van Gogh Museum',
    city: 'Amsterdam',
    country: 'Hollanda',
    region: 'europe',
    exhibitionTitle: 'Vincent van Gogh Tuval ve Mektup Arşivi',
    exhibitionTitleEn: 'Vincent van Gogh Paintings & Letters Archive',
    dates: 'Kalıcı Koleksiyon · Museumplein',
    datesEn: 'Permanent Collection · Museumplein',
    lat: 52.3584,
    lng: 4.8811,
    address: 'Museumplein 6, 1071 DJ Amsterdam, Netherlands',
    curatorNotes:
      '200’den fazla yağlı boya tablo, 500’ü aşkın çizim ve sanatçının kardeşi Theo’ya yazdığı yüzlerce mektupla kronolojik bir retrospektif sunar.',
    curatorNotesEn:
      'Presents a chronological retrospective with over 200 paintings, 500 drawings, and hundreds of letters written by Vincent van Gogh to his brother Theo.',
    website: 'https://www.vangoghmuseum.nl',
  },
  {
    id: 'uffizi-florence',
    name: 'Gallerie degli Uffizi',
    city: 'Floransa',
    country: 'İtalya',
    region: 'europe',
    exhibitionTitle: 'İtalyan Rönesansı ve Erken Modern Avrupa',
    exhibitionTitleEn: 'Italian Renaissance & Early Modern Europe',
    dates: 'Kalıcı Koleksiyon · Medici Saray Galerileri',
    datesEn: 'Permanent Collection · Historic Medici Galleries',
    lat: 43.7678,
    lng: 11.2553,
    address: 'Piazzale degli Uffizi 6, 50122 Firenze FI, Italy',
    curatorNotes:
      'Sandro Botticelli, Leonardo da Vinci, Michelangelo, Raffaello ve Caravaggio’nun Rönesans perspektifini şekillendiren eserlerini barındırır.',
    curatorNotesEn:
      'Preserves seminal Renaissance works by Botticelli, Leonardo da Vinci, Michelangelo, Raphael, and Caravaggio in Florence.',
    website: 'https://www.uffizi.it',
  },
  {
    id: 'prado-madrid',
    name: 'Museo Nacional del Prado',
    city: 'Madrid',
    country: 'İspanya',
    region: 'europe',
    exhibitionTitle: 'Velázquez, Goya ve Avrupa Kraliyet Koleksiyonları',
    exhibitionTitleEn: 'Velázquez, Goya & European Royal Collections',
    dates: 'Kalıcı Koleksiyon · Villanueva Binası',
    datesEn: 'Permanent Collection · Villanueva Building',
    lat: 40.4138,
    lng: -3.6921,
    address: 'Calle de Ruiz de Alarcón 23, 28014 Madrid, Spain',
    curatorNotes:
      'Diego Velázquez, Francisco Goya, El Greco, Hieronymus Bosch ve Titian’ın 12. yüzyıldan 20. yüzyıl başlarına uzanan seçkin başyapıtları.',
    curatorNotesEn:
      'Renowned for unparalleled holdings of Velázquez, Francisco Goya, El Greco, Hieronymus Bosch, and Titian spanning the 12th to early 20th centuries.',
    website: 'https://www.museodelprado.es',
  },
  {
    id: 'natgallery-london',
    name: 'The National Gallery',
    city: 'Londra',
    country: 'Birleşik Krallık',
    region: 'europe',
    exhibitionTitle: '13. Yüzyıldan 20. Yüzyıla Batı Avrupa Resim Tarihi',
    exhibitionTitleEn: 'Western European Painting from the 13th to 20th Century',
    dates: 'Kalıcı Koleksiyon · Trafalgar Square',
    datesEn: 'Permanent Collection · Trafalgar Square',
    lat: 51.5089,
    lng: -0.1283,
    address: 'Trafalgar Square, London WC2N 5DN, United Kingdom',
    curatorNotes:
      'J.M.W. Turner, Jan van Eyck, Georges Seurat, Vincent van Gogh ve Claude Monet’nin halka açık 2.300’den fazla başyapıtına ev sahipliği yapar.',
    curatorNotesEn:
      'Home to over 2,300 publicly accessible paintings including masterworks by Turner, Jan van Eyck, Seurat, Van Gogh, and Monet.',
    website: 'https://www.nationalgallery.org.uk',
  },
  {
    id: 'artic-chicago',
    name: 'The Art Institute of Chicago',
    city: 'Chicago',
    country: 'ABD',
    region: 'america',
    exhibitionTitle: 'Empresyonizm, Amerikan Modernizmi ve Açık Erişim Arşivi',
    exhibitionTitleEn: 'Impressionism, American Modernism & Open Access Archive',
    dates: 'Kalıcı Koleksiyon · Michigan Avenue',
    datesEn: 'Permanent Collection · Michigan Avenue',
    lat: 41.8796,
    lng: -87.6237,
    address: '111 South Michigan Avenue, Chicago, IL 60603, USA',
    curatorNotes:
      'Edward Hopper’ın Gece Kuşları, Georges Seurat’nın Grande Jatte Adası’nda Bir Pazar Öğleden Sonrası ve Grant Wood başyapıtlarıyla tanınır.',
    curatorNotesEn:
      'Celebrated for Edward Hopper’s Nighthawks, Georges Seurat’s A Sunday on La Grande Jatte, and an expansive Impressionist and Modernist archive.',
    website: 'https://www.artic.edu',
  },
  {
    id: 'ist-modern',
    name: 'İstanbul Modern Sanat Müzesi',
    city: 'İstanbul',
    country: 'Türkiye',
    region: 'turkey',
    exhibitionTitle: 'Türkiye Modern ve Çağdaş Sanat Kalıcı Koleksiyonu',
    exhibitionTitleEn: 'Modern & Contemporary Art of Turkey Permanent Collection',
    dates: 'Kalıcı Koleksiyon & Fotoğraf Galerisi',
    datesEn: 'Permanent Collection & Photography Gallery',
    lat: 41.0256,
    lng: 28.9839,
    address: 'Kılıçali Paşa Mah. Tophane İskele Cad. No:1/1, Beyoğlu, İstanbul',
    curatorNotes:
      'Renzo Piano tasarımı Boğaz kıyısındaki binasında 1945’ten günümüze Türkiye’nin modern ve çağdaş sanat tarihini, fotoğraf ve yeni medya arşivini sergiler.',
    curatorNotesEn:
      'Located along the Bosphorus in a Renzo Piano-designed museum, presenting Turkey’s modern and contemporary art, photography, and media archives from 1945 to today.',
    website: 'https://www.istanbulmodern.org',
  },
  {
    id: 'pera-istanbul',
    name: 'Pera Müzesi',
    city: 'İstanbul',
    country: 'Türkiye',
    region: 'turkey',
    exhibitionTitle: 'Kesişen Dünyalar: Oryantalist Resim Koleksiyonu',
    exhibitionTitleEn: 'Intersecting Worlds: Orientalist Painting Collection',
    dates: 'Kalıcı Koleksiyon · Suna ve İnan Kıraç Vakfı',
    datesEn: 'Permanent Collection · Suna and İnan Kıraç Foundation',
    lat: 41.0319,
    lng: 28.9752,
    address: 'Meşrutiyet Caddesi No:65, Tepebaşı, Beyoğlu, İstanbul',
    curatorNotes:
      'Osman Hamdi Bey’in ikonik Kaplumbağa Terbiyecisi başyapıtı başta olmak üzere 17.–19. yüzyıl Oryantalist resim, Kütahya çini ve Anadolu ağırlık koleksiyonlarına ev sahipliği yapar.',
    curatorNotesEn:
      'Home to Osman Hamdi Bey’s iconic The Tortoise Trainer alongside 17th–19th century Orientalist paintings, Kütahya tiles, and Anatolian weights and measures.',
    website: 'https://www.peramuzesi.org.tr',
  },
];
