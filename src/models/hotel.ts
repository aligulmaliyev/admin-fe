export interface IHotelResponse {
  id: number;
  name: string;
  legalName: string;
  country: string;
  city: string;
  address: string;
  phone: string;
  email: string;
  status: string;
  createdAt: string;
  isOrderable: boolean;
}

export interface IHotelRequest {
  id?:number;
  name: string;
  legalName: string;
  country: string;
  city: string;
  address: string;
  phone: string;
  email: string;
  isOrderable?: boolean;
}
