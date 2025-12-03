export interface ICompanyImages {
  _id: string;
  affiliation: string[];
  paymentAccept: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CompanyImagesResponse {
  success: boolean;
  message: string;
  data: ICompanyImages | ICompanyImages[];
}

export interface CreateCompanyImagesRequest extends FormData {}

export interface UpdateCompanyImagesRequest extends FormData {}

export interface CompanyImagesFormData {
  affiliation: (File | string)[];
  paymentAccept: (File | string)[];
}

export interface DeleteSpecificImageRequest {
  imageUrl: string;
}
