export interface Review {
  _id: string;
  userName: string;
  userProfileImg?: string;
  designation: string;
  rating: number;
  comment: string;
  order?: number;
  createdAt: string;
}

export interface ReviewStats {
  totalReviews: number;
  pendingReviews: number;
  approvedReviews: number;
  averageRating: number;
}

export interface ReviewDetailModalProps {
  review: Review;
  onClose: () => void;
}

export interface ReviewsPageProps {
  initialReviews?: Review[];
  initialStats?: ReviewStats;
}

export interface ReviewTableColumn {
  header: string;
  accessorKey: string;
  cell: (review: Review) => React.ReactNode;
}
