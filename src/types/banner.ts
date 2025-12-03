export interface IBanner {
  _id: string;
  title: string;
  description: string;
  backgroundImage: string[]; // Array of image URLs
  isActive?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BannerCardProps {
  banner: IBanner;
}

export interface BannerSectionProps {
  initialBanners?: IBanner[];
}
