export interface Project {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
  tag: { label: string; color: string };
  href: string;
  isPage: boolean;
}   