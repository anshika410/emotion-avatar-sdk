export interface Course {
  id: string;
  name: string;
  description: string;
  coverImage: string;
  skillLevel: string;
  duration: string;
  ageGroup: string;
  benefits: string[];
  weeklySchedule: ScheduleItem[];
  gallery: string[];
  video: string;
  order: number;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ScheduleItem {
  day: string;
  time: string;
  session: string;
}

export interface Facility {
  id: string;
  name: string;
  description: string;
  image: string;
  gallery: string[];
  video: string;
  order: number;
  published: boolean;
}

export interface Trainer {
  id: string;
  name: string;
  designation: string;
  photo: string;
  qualification: string;
  expertise: string[];
  certifications: string[];
  experience: string;
  achievements: string[];
  biography: string;
  socialLinks: SocialLinks;
  published: boolean;
}

export interface SocialLinks {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  youtube?: string;
}

export interface Student {
  id: string;
  name: string;
  photo: string;
  beltRank: string;
  martialArt: string;
  joiningDate: string;
  coach: string;
  biography: string;
  beltProgression: BeltProgress[];
  tournaments: TournamentRecord[];
  gallery: string[];
  videos: string[];
  achievements: string[];
  published: boolean;
}

export interface BeltProgress {
  belt: string;
  date: string;
  certifiedBy: string;
}

export interface TournamentRecord {
  id: string;
  tournamentName: string;
  tournamentType: string;
  martialArt: string;
  category: string;
  medal: 'Gold' | 'Silver' | 'Bronze';
  date: string;
  location: string;
  certificateImage: string;
  medalImage?: string;
}

export interface Blog {
  id: string;
  title: string;
  coverImage: string;
  gallery: string[];
  videos: string[];
  date: string;
  description: string;
  content: string;
  tags: string[];
  author: string;
  published: boolean;
  isEvent: boolean;
  createdAt: string;
}

export interface HomeContent {
  heroSlogan: string;
  heroBackgroundImage: string;
  heroVideo: string;
  sensei: PersonProfile;
  guru: PersonProfile;
  highlights: HighlightStat[];
}

export interface PersonProfile {
  name: string;
  title: string;
  photo: string;
  biography: string;
  philosophy?: string;
  journey?: string;
  achievements: string[];
  yearsOfExperience?: number;
  contribution?: string;
  vision?: string;
  inspirationalMessage?: string;
}

export interface HighlightStat {
  label: string;
  value: number;
  icon: string;
}

export interface ContactInfo {
  phone: string;
  whatsapp: string;
  email: string;
  openingHours: string;
  address: string;
  mapEmbedUrl: string;
}

export interface AdmissionRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  age: string;
  course: string;
  message: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface GalleryItem {
  id: string;
  url: string;
  type: 'image' | 'video' | 'youtube';
  caption: string;
  category: string;
  order: number;
  published: boolean;
  createdAt: string;
}

export interface SiteSettings {
  academyName: string;
  logo: string;
  tagline: string;
  contactInfo: ContactInfo;
  socialLinks: SocialLinks;
}
