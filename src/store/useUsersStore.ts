/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "@/common/api/axiosInstance";
import { endpoints } from "@/common/api/endpoints";
import type { IUserRequest } from "@/common/schemas/manageUserSchema";
import type { IUserResponse } from "@/models/user";
import { toast } from "sonner";
import { create } from "zustand";

type TUserStore = {
  users: IUserResponse[];
  loading: boolean;
  error: string | null;
  createUser: (user: IUserRequest) => Promise<boolean>;
  fetchUserById: (userId: number) => Promise<IUserResponse>;
  fetchUsers: () => Promise<void>;
  updateUser: (userId: number, updatedData: IUserRequest) => Promise<boolean>;
  deleteUser: (userId: number) => Promise<boolean>;
};

export const useUsersStore = create<TUserStore>()((set) => ({
  users: [],
  loading: false,
  error: null,
  createUser: async (user) => {
    try {
      set({ loading: true, error: null });
      const response = await api.post(endpoints.users.create, user);
      if (response.status === 201) {
        await useUsersStore.getState().fetchUsers();
        toast.success("İstifadəçi uğurla yaradıldı!");
        return true;
      } else {
        toast.error("İstifadəçi yaradılmadı: " + response.statusText);
        return false;
      }
    } catch (error: any) {
      console.error("Error creating user:", error);
      toast.error("İstifadəçi yaradılmadı: " + error.message);
      return false;
    } finally {
      set({ loading: false });
    }
  },
  fetchUsers: async () => {
    try {
      set({ loading: true, error: null });
      const response = await api.get(endpoints.users.getAll);
      set({ users: response.data });
    } catch (error: any) {
      console.error("Error fetching users:", error);
      toast.error("İstifadəçi siyahısı alınmadı: " + error.message);
    } finally {
      set({ loading: false });
    }
  },
  fetchUserById: async (userId: number) => {
    try {
      set({ loading: true, error: null });
      const response = await api.get(endpoints.users.getById(userId));
      return response.data;
    } catch (error: any) {
      console.error("Error fetching hotel by ID:", error);
      toast.error("İstifadəçi məlumatları alınmadı: " + error.message);
      return null;
    } finally {
      set({ loading: false });
    }
  },
  updateUser: async (userId, updatedData) => {
    try {
      set({ loading: true, error: null });
      const response = await api.put(
        endpoints.users.update(userId),
        updatedData
      );
      if (response.status === 200) {
        await useUsersStore.getState().fetchUsers();
        toast.success("İstifadəçi məlumatları uğurla yeniləndi!");
        return true;
      } else {
        toast.error(
          "İstifadəçi məlumatları yenilənmədi: " + response.statusText
        );
        return false;
      }
    } catch (error: any) {
      console.error("Error updating user:", error);
      toast.error("İstifadəçi məlumatları yenilənmədi: " + error.message);
      return false;
    } finally {
      set({ loading: false });
    }
  },
  deleteUser: async (userId) => {
    try {
      set({ loading: true, error: null });
      const response = await api.delete(endpoints.users.delete(userId));
      if (response.status === 200) {
        await useUsersStore.getState().fetchUsers();
        toast.success("İstifadəçi uğurla silindi!");
        return true;
      } else {
        toast.error("İstifadəçi silinmədi: " + response.statusText);
        return false;
      }
    } catch (error: any) {
      console.error("Error deleting user:", error);
      toast.error("İstifadəçi silinmədi: " + error.message);
      return false;
    } finally {
      set({ loading: false });
    }
  },
}));
