/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "@/common/api/axiosInstance";
import { endpoints } from "@/common/api/endpoints";
import type { IHotelRequest, IHotelResponse } from "@/models/hotel";
import { toast } from "sonner";
import { create } from "zustand";

type THotelStore = {
  hotels: IHotelResponse[];
  loading: boolean;
  error: string | null;
  createHotel: (hotel: IHotelRequest) => Promise<boolean>;
  fetchHotels: () => Promise<void>;
  fetchHotelById: (hotelId: number) => Promise<IHotelResponse | null>;
  updateHotel: (
    hotelId: number,
    updatedData: IHotelRequest
  ) => Promise<boolean>;
  deleteHotel: (hotelId: number) => Promise<boolean>;
};

export const useHotelsStore = create<THotelStore>()((set) => ({
  hotels: [],
  loading: false,
  error: null,
  createHotel: async (hotel) => {
    try {
      set({ loading: true, error: null });
      const response = await api.post(endpoints.hotels.create, hotel);
      if (response.status === 201) {
        await useHotelsStore.getState().fetchHotels();
        toast.success("Otel uğurla yaradıldı!");
        return true;
      } else {
        toast.error("Otel yaradılmadı: " + response.statusText);
        return false;
      }
    } catch (error: any) {
      console.error("Error creating hotel:", error);
      toast.error("Otel yaradılmadı: " + error.message);
      return false;
    } finally {
      set({ loading: false });
    }
  },
  fetchHotels: async () => {
    try {
      set({ loading: true, error: null });
      const response = await api.get(endpoints.hotels.getAll);
      set({ hotels: response.data });
    } catch (error: any) {
      console.error("Error fetching hotels:", error);
      toast.error("Otel siyahısı alınmadı: " + error.message);
    } finally {
      set({ loading: false });
    }
  },
  fetchHotelById: async (hotelId: number) => {
    try {
      set({ loading: true, error: null });
      const response = await api.get(endpoints.hotels.getById(hotelId));
      return response.data;
    } catch (error: any) {
      console.error("Error fetching hotel by ID:", error);
      toast.error("Otel məlumatları alınmadı: " + error.message);
      return null;
    } finally {
      set({ loading: false });
    }
  },
  updateHotel: async (hotelId: number, updatedData) => {
    try {
      set({ loading: true, error: null });
      const response = await api.put(
        endpoints.hotels.update(hotelId),
        updatedData
      );
      if (response.status === 200) {
        await useHotelsStore.getState().fetchHotels();
        toast.success("Otel məlumatları uğurla yeniləndi!");
        return true;
      } else {
        toast.error("Otel məlumatları yenilənmədi: " + response.statusText);
        return false;
      }
    } catch (error: any) {
      console.error("Error updating hotel:", error);
      toast.error("Otel məlumatları yenilənmədi: " + error.message);
      return false;
    } finally {
      set({ loading: false });
    }
  },
  deleteHotel: async (hotelId) => {
    try {
      set({ loading: true, error: null });
      const response = await api.delete(endpoints.hotels.delete(hotelId));
      if (response.status === 200) {
        await useHotelsStore.getState().fetchHotels();
        toast.success("Otel uğurla silindi!");
        return true;
      } else {
        toast.error("Otel silinmədi: " + response.statusText);
        return false;
      }
    } catch (error: any) {
      console.error("Error deleting hotel:", error);
      toast.error("Otel silinmədi: " + error.message);
      return false;
    } finally {
      set({ loading: false });
    }
  },
}));
