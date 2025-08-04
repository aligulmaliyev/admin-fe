import type { Statuses } from "@/constants/statuses";

export interface IUserResponse {
  id: number;
  username: string;
  name: string;
  email: string;
  accountStatus: keyof typeof Statuses;
  hotelId: number;
  hotelName: string;
  createdAt: string;
}