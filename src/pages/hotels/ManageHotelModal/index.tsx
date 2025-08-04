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
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { manageHotelSchema } from "@/common/schemas/manageHotelSchema";

type TManageHotelModalProps = {
  mode: "create" | "edit";
  id?: number | null;
  isManageDialogOpen: boolean;
  setIsManageDialogOpen: (isOpen: boolean) => void;
};
const ManageHotelModal = ({
  mode,
  id,
  isManageDialogOpen,
  setIsManageDialogOpen,
}: TManageHotelModalProps) => {
  const { createHotel, updateHotel, fetchHotelById } = useHotelsStore();
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<IHotelRequest>({
    resolver: zodResolver(manageHotelSchema),
  });

  const handleManageHotel = async (data: IHotelRequest) => {
    const newHotel: IHotelRequest = {
      name: data.name,
      legalName: data.legalName,
      country: data.country,
      city: data.city,
      address: data.address,
      phone: data.phone,
      email: data.email,
    };
    if (mode === "edit" && id) {
      const success = await updateHotel(id, newHotel);
      if (success) {
        setIsManageDialogOpen(false);
      }
      return;
    } else if (mode === "create") {
      const success = await createHotel(newHotel);
      if (success) {
        setIsManageDialogOpen(false);
      }
    }
  };

  const fetchSingleHotel = async () => {
    if (mode === "edit" && id) {
      const hotelData = await fetchHotelById(id);
      if (hotelData) {
        const number = hotelData.phone.replace("+994", "").trim();
        setValue("name", hotelData.name);
        setValue("legalName", hotelData.legalName);
        setValue("country", hotelData.country);
        setValue("city", hotelData.city);
        setValue("address", hotelData.address);
        setValue("phone", number);
        setValue("email", hotelData.email);
      }
    }
  };

  useEffect(() => {
    if (isManageDialogOpen) {
      if (mode === "edit" && id) {
        fetchSingleHotel();
      } else if (mode === "create") {
        reset();
      }
    }
  }, [isManageDialogOpen]);
  
  return (
    <Dialog open={isManageDialogOpen} onOpenChange={setIsManageDialogOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Yeni Otel Yarat</DialogTitle>
          <DialogDescription>
            Yeni otel əlavə etmək üçün aşağıdakı məlumatları doldurun
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleManageHotel)} className="space-y-4">
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
