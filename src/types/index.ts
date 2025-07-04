

export type HomepageStats = {
  projectsCompleted: string;
  clientSatisfaction: string;
  yearsOfExperience: string;
};

export type Service = {
  id: string;
  slug: string;
  title: string;
  description: string; // short description for homepage card
  details: string; // long description for service page
  features: string[];
  iconName: string;
  imageUrl: string;
  imageStoragePath: string;
  order: number;
};

export type PortfolioProject = {
  id: string;
  slug: string;
  title: string;
  category: string;
  description: string; // Short description for list/card view
  tags: string[];
  imageUrl: string;
  imageStoragePath: string;
  order: number;
  
  // Case Study fields
  problemStatement: string;
  targetAudience: string;
  myRole: string;
  designThinkingProcess: string;
  projectTimeline: string;
  qualitativeResearch: string;
  quantitativeResearch: string;
  userPersona: string;
  empathyMap: string;
  taskFlow: string;
  cardSorting: string;
  informationArchitecture: string;
  highFidelityPrototypes: string;
  typographyAndColors: string;
  visualDesigns: string;
  thankYouNote: string;
};

export type Product = {
  id: string;
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  imageStoragePath: string;
  productUrl: string;
  order: number;
};

export type Course = {
  id: string;
  slug: string;
  title: string;
  description: string;
  level: string;
  duration: string;
  modules: string[];
  imageUrl: string;
  imageStoragePath: string;
  dataAiHint: string;
};

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  author: string;
  date: string;
  category: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  imageStoragePath: string;
}

export type Client = {
  id:string;
  name: string;
  logoUrl: string;
  logoStoragePath: string;
  dataAiHint: string;
};

export type Testimonial = {
    id: string;
    quote: string;
    authorName: string;
    authorTitle: string;
    avatarUrl: string;
    avatarStoragePath: string;
    rating: number;
};

export type HeroContent = {
  headline: string;
  subtext: string;
  ctaText: string;
  ctaLink: string;
};

export type CtaContent = {
  headline: string;
  subtext: string;
  ctaText: string;
  ctaLink: string;
};

export type HomepageContent = {
  hero: HeroContent;
  cta: CtaContent;
};

export type SocialLinks = {
  github: string;
  twitter: string;
  linkedin: string;
};

export type ContactInfo = {
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
};

export type SiteConfiguration = {
  socialLinks: SocialLinks;
  contactInfo: ContactInfo;
  calendlyUrl: string;
};

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  receivedAt: string; // ISO string
  isRead: boolean;
};
