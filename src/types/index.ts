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
