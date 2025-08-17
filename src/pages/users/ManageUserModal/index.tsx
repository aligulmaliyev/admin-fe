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

import { useCallback, useEffect } from "react";
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
  const isEdit = mode === "edit";

  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<IUserRequest>({
    resolver: zodResolver(manageUserSchema), defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
      hotelId: undefined as unknown as number,
      accountStatus: Statuses.ACTIVE,
    },
  });

  const { hotels, fetchHotels } = useHotelsStore();
  const { createUser, updateUser, fetchUserById } = useUsersStore();

  const loadUser = useCallback(async () => {
    if (!isEdit || !id) return;
    try {
      const user = await fetchUserById(id);
      if (!user) return;

      reset({
        name: user.name ?? "",
        username: user.username ?? "",
        email: user.email ?? "",
        password: "********",
        hotelId: user.hotelId,
        accountStatus: user.accountStatus ?? Statuses.ACTIVE,
      });
    } catch (e) {
      console.error("Failed to load user:", e);
    }
  }, [fetchUserById, id, isEdit, reset]);

  const onSubmit = async (data: IUserRequest) => {
    try {
      if (isEdit && id) {
        const { password, ...rest } = data;
        const payload =
          password && password.trim().length > 0
            ? data
            : (rest as IUserRequest);

        const success = await updateUser(id, payload);
        if (success) setManageUserOpen(false);
        return;
      }

      const success = await createUser(data);
      if (success) setManageUserOpen(false);
    } catch (e) {
      console.error("Manage user failed:", e);
    }
  };

  useEffect(() => {
    fetchHotels();
    if (isEdit) {
      loadUser();
    } else {
      reset();
    }
  }, [isEdit]);

  const title = isEdit ? "Otel istifadəçisini yenilə" : "Yeni otel istifadəçisi yarat";
  const description = isEdit
    ? "İstifadəçi məlumatlarını yeniləmək üçün aşağıdakı sahələri düzəldin."
    : "Yeni istifadəçi əlavə etmək üçün aşağıdakı məlumatları doldurun.";

  return (
    <Dialog open={isManageUserOpen} onOpenChange={setManageUserOpen}>
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
              <Label htmlFor="name">Ad Soyad*</Label>
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
              <Label htmlFor="email">Email*</Label>
              <Input
                id="email"
                {...register("email")}
                placeholder="Email daxil edin"
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
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
              <Label htmlFor="hotelId">Otel *</Label>
              <Controller
                name="hotelId"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    value={field.value ? String(field.value) : ""}
                  >
                    <SelectTrigger className="w-full">
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
                    <SelectTrigger className="w-full">
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
            >
              {mode === "create" ? "Yarat" : "Yenilə"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
