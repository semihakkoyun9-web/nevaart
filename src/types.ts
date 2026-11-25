export type UserRole = 'visitor' | 'member' | 'curator';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  bio?: string;
  joinedDate: string;
}

export interface ArtworkCategory {
  id: string;
  nameTr: string;
  nameEn: string;
  descriptionTr: string;
  descriptionEn: string;
  count: number;
}

export interface ColorSwatch {
  hex: string;
  percentage: number;
  name: string;
  rgb?: [number, number, number];
  isDominant?: boolean;
}

export interface ColorAnalysisResult {
  palette: ColorSwatch[];
  harmonyType: string;
  moodDescription: string;
  warmthIndex: 'Warm' | 'Cool' | 'Neutral' | 'High-Contrast';
  averageLuminance: number;
  extractedFromPixels: boolean;
}

export interface PrintOption {
  size: string;
  paperType: string;
  priceTl: number;
  priceEur: number;
  editionTotal: number;
  editionRemaining: number;
}

export interface Artwork {
  id: number;
  slug: string;
  accessionNumber: string;
  title: string;
  artist: string;
  artistBioTr: string;
  artistBioEn: string;
  category: 'digital' | 'street' | 'illustration' | 'concept' | 'architecture';
  year: number;
  mediumTr: string;
  mediumEn: string;
  dimensions: string;
  resolution: string;
  storyTr: string;
  storyEn: string;
  technicalDetailsTr: string;
  technicalDetailsEn: string;
  imageUrl: string;
  svgFallback?: string;
  colorPalette: ColorSwatch[];
  harmonyMoodTr: string;
  harmonyMoodEn: string;
  views: number;
  likes: number;
  isCuratorPick: boolean;
  exhibitionLocation: {
    city: string;
    venue: string;
    lat: number;
    lng: number;
  };
  tags: string[];
  printOptions?: PrintOption[];
  audioGuide?: {
    duration: string;
    narrator: string;
    summary: string;
  };
}

export interface CuratorReview {
  id: number;
  artworkId: number;
  userName: string;
  userRole: UserRole;
  rating: number;
  comment: string;
  date: string;
}

