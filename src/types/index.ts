export interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  clientUrl?: string;
  isVisible: boolean;
  tags: string[];
  createdAt: string;
}