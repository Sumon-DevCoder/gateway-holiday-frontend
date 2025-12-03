import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

/**
 * User type for client-side state
 * NOTE: NEVER add password or other sensitive fields here
 * The backend should exclude sensitive data from API responses
 */
export type TUser = {
  _id?: string;
  name: string | null;
  email: string;
  phone: string | null;
  profileImg: string | null;
  status: "active" | "block" | "deactive";
  role: "admin" | "user" | "super_admin";
  createdAt?: Date;
  updatedAt?: Date;
};

export type TProduct = {
  _id: string;
  title: string;
  description: string;
  photos: { thumbnail: string; cover: string };
  category: string;
  quantity: number;
  price: number;
  stock: number;
  discount: number;
  isDeleted: boolean;
  ratings: number[];
  createdAt: Date;
  updatedAt: Date;
};

export type TQueryParam = {
  name: string;
  value: boolean | React.Key;
};
export type TError = {
  data: {
    message: string;
    stack: string;
    success: boolean;
  };
  status: number;
};

export type TMeta = {
  limit: number;
  page: number;
  total: number;
  totalPage: number;
};

export type TResponse<T> = {
  data?: T;
  error?: TError;
  meta?: TMeta;
  success: boolean;
  message: string;
};
