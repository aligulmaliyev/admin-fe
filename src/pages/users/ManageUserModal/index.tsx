/* eslint-disable react-hooks/exhaustive-deps */
import {
  manageUserSchema,
  type IUserRequest,
} from "@/common/schemas/manageUserSchema";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Statuses } from "@/constants/statuses";
import { useHotelsStore } from "@/store/useHotelsStore";
import { useUsersStore } from "@/store/useUsersStore";
import { zodResolver } from "@hookform/resolvers/zod";

import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

type TManageUserModalProps = {
  mode: "create" | "edit";
  id?: number | null;
  isManageUserOpen: boolean;
  setManageUserOpen: (isOpen: boolean) => void;
};

export const ManageUserModal = ({
  mode,
  isManageUserOpen,
  setManageUserOpen,
  id,
}: TManageUserModalProps) => {
  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
    reset,
    setValue,
  } = useForm<IUserRequest>({ resolver: zodResolver(manageUserSchema) });
  const { hotels, fetchHotels } = useHotelsStore();
  const { createUser, updateUser, fetchUserById } = useUsersStore();

  const handleManageUser = async (data: IUserRequest) => {
    if (mode === "edit" && id) {
      const success = await updateUser(id, data);
      if (success) {
        setManageUserOpen(false);
      }
      return;
    } else if (mode === "create") {
      const success = await createUser(data);
      if (success) {
        setManageUserOpen(false);
      }
    }
  };

  const fetchSingleUser = async () => {
    if (mode === "edit" && id) {
      const userData = await fetchUserById(id);
      if (userData) {
        setValue("name", userData?.name);
        setValue("username", userData?.username);
        setValue("accountStatus", userData?.accountStatus);
        setValue("hotelId", userData?.hotelId);
        setValue("password", "******");
      }
    }
  };

  useEffect(() => {
    if (isManageUserOpen) {
      if (mode === "edit" && id) {
        fetchSingleUser();
      } else if (mode === "create") {
        reset();
      }
    }
  }, [isManageUserOpen]);

  useEffect(() => {
    fetchHotels();
  }, []);

  return (
    <Dialog open={isManageUserOpen} onOpenChange={setManageUserOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Yeni otel istifadəçisi yarat</DialogTitle>
          <DialogDescription>
            Yeni otel istifadəçisi əlavə etmək üçün aşağıdakı məlumatları
            doldurun
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleManageUser)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="username">İstifadəçi adı *</Label>
              <Input
                {...register("username")}
                placeholder="İstifadəçi adını daxil edin"
              />
              {errors.username && (
                <p className="text-sm text-red-500">
                  {errors.username.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Şifrə *</Label>
              <Input
                readOnly={mode == "edit"}
                type="password"
                {...register("password")}
                placeholder="Şifrəni daxil edin"
              />
              {errors.password && (
                <p className="text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Ad Soyad</Label>
              <Input
                id="name"
                {...register("name")}
                placeholder="Ad və soyadı daxil edin"
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="hotelId">Otel *</Label>
              <Controller
                name="hotelId"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    value={field.value ? String(field.value) : ""}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Otel seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {hotels.map((hotel) => (
                        <SelectItem key={hotel.id} value={hotel.id.toString()}>
                          {hotel.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.hotelId && (
                <p className="text-sm text-red-500">{errors.hotelId.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="accountStatus">Hesab statusu</Label>
              <Controller
                name="accountStatus"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value ? String(field.value) : ""}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Status seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={Statuses.ACTIVE}>Aktiv</SelectItem>
                      <SelectItem value={Statuses.INACTIVE}>
                        Qeyri-aktiv
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.accountStatus && (
                <p className="text-sm text-red-500">
                  {errors.accountStatus.message}
                </p>
              )}
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setManageUserOpen(false)}>
              Ləğv et
            </Button>
            <Button
            // disabled={!newAdmin.username || !newAdmin.password || !newAdmin.hotelId}
            >
              {mode === "create" ? "Yarat" : "Yenilə"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
