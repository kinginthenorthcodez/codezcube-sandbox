export type HomepageStats = {
  projectsCompleted: string;
  clientSatisfaction: string;
  yearsOfExperience: string;
};

export type Offering = {
  id: string;
  title: string;
  description: string;
  icon: string; // lucide-react icon name
  order: number;
};
