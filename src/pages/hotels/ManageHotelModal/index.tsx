/* eslint-disable react-hooks/exhaustive-deps */
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { IHotelRequest } from "@/models/hotel";
import { useHotelsStore } from "@/store/useHotelsStore";
import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { manageHotelSchema } from "@/common/schemas/manageHotelSchema";

type TManageHotelModalProps = {
  mode: "create" | "edit";
  id?: number;
  isManageDialogOpen: boolean;
  setIsManageDialogOpen: (isOpen: boolean) => void;
};

const AZE_PREFIX = "+994";

const stripAzePrefix = (phone?: string) => {
  if (!phone) return "";
  return phone.startsWith(AZE_PREFIX)
    ? phone.slice(AZE_PREFIX.length).trim()
    : phone.trim();
};

const ensureAzePrefix = (raw?: string) => {
  const v = (raw ?? "").trim();
  if (!v) return "";
  return v.startsWith(AZE_PREFIX) ? v : `${AZE_PREFIX}${v}`;
};


const ManageHotelModal = ({
  mode,
  id,
  isManageDialogOpen,
  setIsManageDialogOpen,
}: TManageHotelModalProps) => {
  const isEdit = mode === "edit";


  const { createHotel, updateHotel, fetchHotelById } = useHotelsStore();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IHotelRequest>({
    resolver: zodResolver(manageHotelSchema),
    defaultValues: {
      name: "",
      legalName: "",
      country: "",
      city: "",
      address: "",
      phone: "",
      email: "",
    },

  });

  const loadHotel = useCallback(async () => {
    if (!isEdit || !id) return;

    try {
      const hotel = await fetchHotelById(id);
      if (!hotel) return;

      reset({
        name: hotel.name ?? "",
        legalName: hotel.legalName ?? "",
        country: hotel.country ?? "",
        city: hotel.city ?? "",
        address: hotel.address ?? "",
        phone: stripAzePrefix(hotel.phone),
        email: hotel.email ?? "",
      });
    } catch (e) {
      console.error("Failed to fetch hotel:", e);
    }
  }, [fetchHotelById, id, isEdit, reset]);

  const onSubmit = async (data: IHotelRequest) => {
    const payload: IHotelRequest = {
      ...data,
      phone: ensureAzePrefix(data.phone),
    };

    try {
      let success = false;

      if (isEdit && id) {
        success = await updateHotel(id, payload);
      } else {
        success = await createHotel(payload);
      }

      if (success) setIsManageDialogOpen(false);
    } catch (e) {
      console.error("Manage hotel failed:", e);
    }
  };

  useEffect(() => {
    if (isEdit) {
      loadHotel();
    } else {
      reset();
    }
  }, [isEdit]);

  const title = isEdit ? "Oteli Yenilə" : "Yeni Otel Yarat";
  const description = isEdit
    ? "Otel məlumatlarını yeniləmək üçün aşağıdakı sahələri düzəldin."
    : "Yeni otel əlavə etmək üçün aşağıdakı məlumatları doldurun.";

  return (
    <Dialog open={isManageDialogOpen} onOpenChange={setIsManageDialogOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
           {description}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Otel Adı *</Label>
              <Input
                {...register("name")}
                placeholder="Otel adını daxil edin"
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="legalName">Hüquqi Ad</Label>
              <Input
                {...register("legalName")}
                placeholder="Hüquqi adı daxil edin"
              />
              {errors.legalName && (
                <p className="text-sm text-red-500">
                  {errors.legalName.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Ölkə *</Label>
              <Input
                {...register("country")}
                placeholder="Ölkə adını daxil edin"
              />
              {errors.country && (
                <p className="text-sm text-red-500">{errors.country.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">Şəhər *</Label>
              <Input
                {...register("city")}
                placeholder="Şəhər adını daxil edin"
              />
              {errors.city && (
                <p className="text-sm text-red-500">{errors.city.message}</p>
              )}
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="address">Ünvan</Label>
              <Input {...register("address")} placeholder="Ünvanı daxil edin" />
              {errors.address && (
                <p className="text-sm text-red-500">{errors.address.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefon</Label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 text-sm">
                  +994
                </span>
                <Input
                  id="phone"
                  {...register("phone")}
                  placeholder="501234567"
                  className="pl-14"
                />
              </div>
              {errors.phone && (
                <p className="text-sm text-red-500">{errors.phone.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                {...register("email")}
                placeholder="Email ünvanını daxil edin"
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsManageDialogOpen(false)}
            >
              Ləğv et
            </Button>
            <Button type="submit">
              {mode == "create" ? "Otel Yarat" : "Yenilə"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ManageHotelModal;
