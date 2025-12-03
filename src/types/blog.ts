export interface Blog {
  _id: string;
  title: string;
  content: string;
  category: {
    _id: string;
    name: string;
  };
  coverImage: string;
  images: string[];
  tags: string[] | string;
  readTime: string;
  status: "draft" | "published" | "pending";
  order?: number; // manual ordering field for drag-and-drop
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface BlogStats {
  total: number;
  published: number;
  pending: number;
  draft: number;
}
