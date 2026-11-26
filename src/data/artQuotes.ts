export interface ArtQuote {
  id: number;
  name: string;
  initials: string;
  era: 'historians' | 'impressionism' | 'renaissance' | 'modern';
  roleTr: string;
  roleEn: string;
  source: string;
  year: string;
  commentTr: string;
  commentEn: string;
}

export const artQuotes: ArtQuote[] = [
  {
    id: 1,
    name: 'Ernst H. Gombrich',
    initials: 'EG',
    era: 'historians',
    roleTr: 'Sanat Tarihçisi · Sanatın Öyküsü',
    roleEn: 'Art Historian · The Story of Art',
    source: 'The Story of Art, Phaidon Press',
    year: '1950',
    commentTr: 'Gerçekte sanat diye bir şey yoktur, yalnızca sanatçılar vardır. Bir başyapıtı anlamanın en iyi yolu, onun arkasındaki ışık, renk ve insan hikayesini görmektir.',
    commentEn: 'There really is no such thing as Art. There are only artists. To understand a masterpiece is to see the light, color, and human story behind it.'
  },
  {
    id: 2,
    name: 'Vincent van Gogh',
    initials: 'VG',
    era: 'impressionism',
    roleTr: 'Ressam · Post-Empresyonizm',
    roleEn: 'Painter · Post-Impressionism',
    source: 'Theo van Gogh’a Mektup · No. 783',
    year: '1889',
    commentTr: 'Serviler hâlâ aklımı kurcalıyor; onlardan ayçiçekleri gibi bir şey yapmak istiyorum. Çünkü kimsenin onları benim gördüğüm gibi çizmemiş olması beni şaşırtıyor.',
    commentEn: 'The cypresses still preoccupy me; I should like to make something of them like the canvases of the sunflowers, because it astonishes me that they have not yet been done as I see them.'
  },
  {
    id: 3,
    name: 'Paul Cézanne',
    initials: 'PC',
    era: 'impressionism',
    roleTr: 'Ressam · Modern Sanatın Öncüsü',
    roleEn: 'Painter · Pioneer of Modern Art',
    source: 'Émile Bernard’a Mektup, Aix-en-Provence',
    year: '1904',
    commentTr: 'Doğayı silindir, küre ve koni üzerinden ele alın; her şeyi doğru bir perspektife yerleştirin ki her nesnenin her yüzü merkezi bir noktaya yönelsin.',
    commentEn: 'Treat nature by means of the cylinder, the sphere, the cone, everything brought into proper perspective so that each side of an object is directed towards a central point.'
  },
  {
    id: 4,
    name: 'Leonardo da Vinci',
    initials: 'LV',
    era: 'renaissance',
    roleTr: 'Polimat & Rönesans Ustası',
    roleEn: 'Polymath & Renaissance Master',
    source: 'Trattato della Pittura (Resim Üzerine)',
    year: '1500',
    commentTr: 'Resim, hissedilen ama duyulmayan bir şiirdir; şiir ise duyulan ama görülmeyen bir resimdir.',
    commentEn: 'Painting is poetry that is seen rather than felt, and poetry is painting that is felt rather than seen.'
  },
  {
    id: 5,
    name: 'John Berger',
    initials: 'JB',
    era: 'historians',
    roleTr: 'Sanat Eleştirmeni & Yazar',
    roleEn: 'Art Critic & Author',
    source: 'Ways of Seeing (Görme Biçimleri)',
    year: '1972',
    commentTr: 'Görme konuşmadan önce gelmiştir. Çocuk konuşmaya başlamadan önce bakıp tanımayı öğrenir; bir tabloya bakışımız daima bildiklerimizden etkilenir.',
    commentEn: 'Seeing comes before words. The child looks and recognizes before it can speak; the way we see things is affected by what we know or what we believe.'
  },
  {
    id: 6,
    name: 'Katsushika Hokusai',
    initials: 'KH',
    era: 'impressionism',
    roleTr: 'Ukiyo-e Ustası · Japon Baskı Sanatı',
    roleEn: 'Ukiyo-e Master · Japanese Woodblock',
    source: 'Fuji Dağı’nın Yüz Manzarası Önsözü',
    year: '1834',
    commentTr: 'Altı yaşımdan beri nesnelerin biçimini çizmeye tutkunum. Yetmiş üç yaşında doğanın yapısını biraz olsun kavradım; yüz on yaşına geldiğimde her nokta ve çizgim canlı olacak.',
    commentEn: 'From the age of six I had a passion for copying the form of things. At seventy-three I partly understood the structure of nature; at one hundred and ten, every dot and line will be alive.'
  },
  {
    id: 7,
    name: 'Wassily Kandinsky',
    initials: 'WK',
    era: 'modern',
    roleTr: 'Soyut Sanatın Kurucusu',
    roleEn: 'Pioneer of Abstract Art',
    source: 'Concerning the Spiritual in Art',
    year: '1911',
    commentTr: 'Renk klavyedir, gözler çekiçlerdir, ruh ise birçok teli olan piyanodur. Sanatçı, ruhta titreşimler yaratmak için şu veya bu tuşa dokunan eldir.',
    commentEn: 'Color is the keyboard, the eyes are the harmonies, the soul is the piano with many strings. The artist is the hand that plays, touching one key or another to cause vibrations in the soul.'
  },
  {
    id: 8,
    name: 'Claude Monet',
    initials: 'CM',
    era: 'impressionism',
    roleTr: 'Empresyonizmin Kurucu Ustası',
    roleEn: 'Founder of French Impressionism',
    source: 'Giverny Defterleri',
    year: '1895',
    commentTr: 'Renk benim gün boyu süren tutkum, sevincim ve ıstırabımdır. Ben yalnızca nesneleri değil, nesneler ile aramdaki havanın ve ışığın rengini resmediyorum.',
    commentEn: 'Color is my day-long obsession, joy and torment. I do not paint merely objects, I paint the envelope of air and light between the object and myself.'
  },
  {
    id: 9,
    name: 'Edgar Degas',
    initials: 'ED',
    era: 'impressionism',
    roleTr: 'Ressam & Heykeltıraş',
    roleEn: 'Painter & Sculptor',
    source: 'Paul Valéry · Degas Danse Dessin',
    year: '1890',
    commentTr: 'Sanat, sizin ne gördüğünüz değildir; başkalarının ne görmesini sağladığınızdır.',
    commentEn: 'Art is not what you see, but what you make others see.'
  },
  {
    id: 10,
    name: 'Paul Klee',
    initials: 'PK',
    era: 'modern',
    roleTr: 'Bauhaus Ustası & Ressam',
    roleEn: 'Bauhaus Master & Painter',
    source: 'Creative Confession (Yaratıcı İnanç)',
    year: '1920',
    commentTr: 'Sanat görünür olanı yeniden üretmez; aksine görünmeyeni görünür kılar.',
    commentEn: 'Art does not reproduce the visible; rather, it makes visible.'
  },
  {
    id: 11,
    name: 'Pablo Picasso',
    initials: 'PP',
    era: 'modern',
    roleTr: 'Kübizm’in Kurucusu · Ressam',
    roleEn: 'Co-founder of Cubism · Painter',
    source: 'The Arts Söyleşisi, New York',
    year: '1923',
    commentTr: 'Sanat, gerçeği kavramamızı sağlayan bir yalandır. Kuralları bir profesyonel gibi öğrenin ki onları bir sanatçı gibi yıkabilesiniz.',
    commentEn: 'Art is a lie that makes us realize truth. Learn the rules like a pro, so you can break them like an artist.'
  },
  {
    id: 12,
    name: 'Henri Matisse',
    initials: 'HM',
    era: 'modern',
    roleTr: 'Fovizm’in Öncüsü · Ressam',
    roleEn: 'Leader of Fauvism · Painter',
    source: 'Notes d’un Peintre (Bir Ressamın Notları)',
    year: '1908',
    commentTr: 'Yaratıcılık cesaret ister. Hayal ettiğim şey; huzurlu, saf, rahatsız edici konulardan arınmış, zihin için rahat bir koltuk gibi dengeleyici bir sanattır.',
    commentEn: 'Creativity takes courage. What I dream of is an art of balance, of purity and serenity, devoid of troubling or depressing subject matter.'
  },
  {
    id: 13,
    name: 'Rembrandt van Rijn',
    initials: 'RR',
    era: 'renaissance',
    roleTr: 'Hollanda Altın Çağı Ustası',
    roleEn: 'Dutch Golden Age Master',
    source: 'Constantijn Huygens’e Mektup',
    year: '1639',
    commentTr: 'İki şeyi yakalamaya çalıştım: en büyük ve en doğal hareketi. Işık olmadan gölge, gölge olmadan da ruhun derinliği hissedilemez.',
    commentEn: 'I have strived to capture the greatest and most natural movement. Without shadow there is no light, and without light no depth of soul.'
  },
  {
    id: 14,
    name: 'Michelangelo Buonarroti',
    initials: 'MB',
    era: 'renaissance',
    roleTr: 'Rönesans Heykeltıraşı & Ressam',
    roleEn: 'Renaissance Sculptor & Painter',
    source: 'Floransa Notları',
    year: '1547',
    commentTr: 'Meleği mermerin içinde gördüm ve onu özgür bırakana kadar yonttum.',
    commentEn: 'I saw the angel in the marble and carved until I set him free.'
  },
  {
    id: 15,
    name: 'Georgia O’Keeffe',
    initials: 'GO',
    era: 'modern',
    roleTr: 'Amerikan Modernizmi’nin Öncüsü',
    roleEn: 'Mother of American Modernism',
    source: 'Anderson Galleries Sergi Kataloğu',
    year: '1923',
    commentTr: 'Sözcüklerle ifade edemediğim şeyleri renkler ve biçimlerle söyleyebileceğimi fark ettim; çünkü kelimelerim onları anlatmaya yetmiyordu.',
    commentEn: 'I found I could say things with color and shapes that I couldn’t say any other way—things I had no words for.'
  },
  {
    id: 16,
    name: 'Edward Hopper',
    initials: 'EH',
    era: 'modern',
    roleTr: 'Amerikan Gerçekçiliği Ustası',
    roleEn: 'Master of American Realism',
    source: 'Reality Dergisi, New York',
    year: '1953',
    commentTr: 'Sözcüklerle anlatabilseydim, resim yapmam için hiçbir neden kalmazdı. Yapmak istediğim tek şey bir evin yan duvarına vuran güneş ışığını resmetmekti.',
    commentEn: 'If you could say it in words, there would be no reason to paint. What I wanted to do was to paint sunlight on the side of a house.'
  },
  {
    id: 17,
    name: 'Auguste Rodin',
    initials: 'AR',
    era: 'historians',
    roleTr: 'Modern Heykelin Babası',
    roleEn: 'Father of Modern Sculpture',
    source: 'L’Art · Paul Gsell Söyleşileri',
    year: '1911',
    commentTr: 'Güzellik her yerdedir. Gözlerimizden eksik olan güzellik değil, onu algılayacak bakıştır.',
    commentEn: 'Beauty is everywhere. It is not she who is lacking to our eyes, but our eyes which fail to perceive her.'
  },
  {
    id: 18,
    name: 'Frida Kahlo',
    initials: 'FK',
    era: 'modern',
    roleTr: 'Ressam · Meksika Modern Sanatı',
    roleEn: 'Painter · Mexican Modern Art',
    source: 'Coyoacán Günlükleri',
    year: '1948',
    commentTr: 'Hiçbir zaman düşleri ya da kabusları resmetmedim; ben yalnızca kendi gerçekliğimi resmettim.',
    commentEn: 'I never painted dreams or nightmares. I painted my own reality.'
  },
  {
    id: 19,
    name: 'Salvador Dalí',
    initials: 'SD',
    era: 'modern',
    roleTr: 'Sürrealizm Ustası · Ressam',
    roleEn: 'Surrealist Master · Painter',
    source: 'The Conquest of the Irrational',
    year: '1935',
    commentTr: 'Mükemmellikten korkmayın; ona hiçbir zaman ulaşamayacaksınız. Ressam ilham alan değil, ilham verebilen kişidir.',
    commentEn: 'Have no fear of perfection—you will never reach it. A painter is not one who is inspired, but one who is able to inspire.'
  },
  {
    id: 20,
    name: 'Pierre-Auguste Renoir',
    initials: 'PR',
    era: 'impressionism',
    roleTr: 'Empresyonist Ressam',
    roleEn: 'Impressionist Painter',
    source: 'Ambroise Vollard · Renoir Anıları',
    year: '1883',
    commentTr: 'Acı geçer, ancak güzellik kalır. Bana göre bir tablo; hoş, neşeli ve güzel bir şey olmalıdır.',
    commentEn: 'The pain passes, but the beauty remains. For me, a picture should be a pleasant thing, joyful and pretty.'
  },
  {
    id: 21,
    name: 'Francisco Goya',
    initials: 'FG',
    era: 'renaissance',
    roleTr: 'İspanyol Romantizmi & Baskı Ustası',
    roleEn: 'Spanish Romantic Master & Printmaker',
    source: 'Los Caprichos · Levha 43',
    year: '1799',
    commentTr: 'Aklın terk ettiği hayal gücü imkânsız canavarlar doğurur; akılla birleştiğinde ise sanatların anası ve harikaların kaynağı olur.',
    commentEn: 'Fantasy abandoned by reason produces impossible monsters; united with her, she is the mother of the arts and the origin of their marvels.'
  },
  {
    id: 22,
    name: 'Gustav Klimt',
    initials: 'GK',
    era: 'modern',
    roleTr: 'Viyana Secession Kurucusu · Ressam',
    roleEn: 'Founder of Vienna Secession · Painter',
    source: 'Viyana Sergi Notları',
    year: '1903',
    commentTr: 'Benim hakkımda bir şey bilmek isteyen herkes, resimlerime dikkatle bakmalı ve kim olduğumu, ne yapmak istediğimi onların içinde aramalıdır.',
    commentEn: 'Whoever wants to know something about me ought to look carefully at my pictures and try to recognize in them what I am and what I want to do.'
  },
  {
    id: 23,
    name: 'Édouard Manet',
    initials: 'EM',
    era: 'impressionism',
    roleTr: 'Modern Resmin Öncüsü · Ressam',
    roleEn: 'Pioneer of Modern Painting',
    source: 'Paris Kişisel Sergi Önsözü',
    year: '1867',
    commentTr: 'Doğada tek başına çizgi yoktur; yalnızca birbirine karşı duran ve birbirini tanımlayan renk alanları vardır.',
    commentEn: 'There are no lines in nature, only areas of colour, one against another.'
  },
  {
    id: 24,
    name: 'Eugène Delacroix',
    initials: 'ED',
    era: 'historians',
    roleTr: 'Romantizm Ustası & Sanat Kuramcısı',
    roleEn: 'Romantic Master & Art Theorist',
    source: 'Journal d’Eugène Delacroix',
    year: '1852',
    commentTr: 'Bir tablonun en büyük erdemi, göz için bir şölen olmasıdır. Renk, yalnızca bir süs değil, duygunun en doğrudan dilidir.',
    commentEn: 'The first merit of a painting is to be a feast for the eye. Color is not mere ornament, but the most direct language of emotion.'
  },
  {
    id: 25,
    name: 'Mark Rothko',
    initials: 'MR',
    era: 'modern',
    roleTr: 'Renk Alanı Resmi Ustası',
    roleEn: 'Color Field Painting Master',
    source: 'Selden Rodman Söyleşisi, New York',
    year: '1957',
    commentTr: 'Ben renk ya da biçim ilişkileriyle ilgilenmiyorum; yalnızca trajedi, coşku ve kader gibi temel insan duygularını ifade etmekle ilgileniyorum.',
    commentEn: 'I am not interested in the relationship of color or form; I am interested only in expressing basic human emotions—tragedy, ecstasy, doom.'
  },
  {
    id: 26,
    name: 'Jackson Pollock',
    initials: 'JP',
    era: 'modern',
    roleTr: 'Soyut Dışavurumculuk Ustası',
    roleEn: 'Abstract Expressionist Master',
    source: 'William Wright Radyo Söyleşisi',
    year: '1950',
    commentTr: 'Resim, kendi başına yaşayan bir keşiftir. Her iyi sanatçı, gerçekte kim olduğunu resmeder.',
    commentEn: 'Painting is self-discovery. Every good artist paints what he is.'
  },
  {
    id: 27,
    name: 'Andy Warhol',
    initials: 'AW',
    era: 'modern',
    roleTr: 'Pop Art’ın Öncüsü · Sanatçı',
    roleEn: 'Leading Figure of Pop Art',
    source: 'The Philosophy of Andy Warhol',
    year: '1975',
    commentTr: 'Sanatçı, insanların sahip olmasına gerek olmayan ama yine de nedenini bilmeden onlara vermek istediği şeyleri üreten kişidir.',
    commentEn: 'An artist is somebody who produces things that people don’t need to have, but that he—for some reason—thinks it would be a good idea to give them.'
  },
  {
    id: 28,
    name: 'Kenneth Clark',
    initials: 'KC',
    era: 'historians',
    roleTr: 'Sanat Tarihçisi & Müze Müdürü',
    roleEn: 'Art Historian & Museum Director',
    source: 'Civilisation (Uygarlık)',
    year: '1969',
    commentTr: 'Bir uygarlığın ruhu, yalnızca yasalarında ya da zaferlerinde değil; geride bıraktığı tablolarda, heykellerde ve mimari oranlarda okunur.',
    commentEn: 'The spirit of a civilisation is read not merely in its laws or triumphs, but in the paintings, sculptures, and architectural proportions it leaves behind.'
  },
  {
    id: 29,
    name: 'Osman Hamdi Bey',
    initials: 'OH',
    era: 'impressionism',
    roleTr: 'Ressam, Arkeolog & Müze Kurucusu',
    roleEn: 'Painter, Archaeologist & Museum Founder',
    source: 'Sanayi-i Nefise Mektebi Kuruluş Notları',
    year: '1883',
    commentTr: 'Sanat ve müzecilik bir toplumun hafızasıdır; geçmişin estetik mirasını koruyup yeni kuşaklara aktarmak en yüksek kültür görevidir.',
    commentEn: 'Art and museology form the memory of a society; preserving aesthetic heritage and passing it to future generations is the highest cultural duty.'
  },
  {
    id: 30,
    name: 'Bedri Rahmi Eyüboğlu',
    initials: 'BE',
    era: 'modern',
    roleTr: 'Ressam, Şair & Akademi Hocası',
    roleEn: 'Painter, Poet & Academy Professor',
    source: 'Resme Başlarken',
    year: '1956',
    commentTr: 'Güzel olan her şeyde halkın el emeğinden, doğanın sabrından ve rengin dürüstlüğünden bir parça vardır; resim gözle değil yürekle görülür.',
    commentEn: 'In everything truly beautiful there is a trace of craft, nature’s patience, and the honesty of color; a painting is seen not only with the eye, but with the heart.'
  }
];
