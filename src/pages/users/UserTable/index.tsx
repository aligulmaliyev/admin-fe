import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Building2, Edit } from "lucide-react";
import { useState } from "react";
import type { IUserResponse } from "@/models/user";
import { useUsersStore } from "@/store/useUsersStore";
import { ManageUserModal } from "../ManageUserModal";
import { Statuses } from "@/constants/statuses";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { DeleteButton } from "@/components/shared/DeleteButton";

export const UserTable = ({ users }: { users: IUserResponse[] }) => {
    const { deleteUser } = useUsersStore();
    const [id, setId] = useState<number | null>(null);
    const [isEditModal, setIsEditModal] = useState<boolean>(false);

    const handleDeleteUser = async (id: number) => {
        await deleteUser(id);
    };

    const handleEditUser = (id: number) => {
        setIsEditModal(true);
        setId(id);
    };

    const getInitials = (name?: string) => {
        if (!name) return "A";
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase();
    };
    return (
        <>
            {isEditModal && (
                <ManageUserModal
                    isManageUserOpen={isEditModal}
                    setManageUserOpen={setIsEditModal}
                    id={id}
                    mode="edit"
                />
            )}
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Ad</TableHead>
                        <TableHead>İstifadəçi adı</TableHead>
                        <TableHead>Otel</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Əməliyyatlar</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.map((user: IUserResponse) => (
                        <TableRow key={user.id}>
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={`/placeholder.svg?height=32&width=32`} />
                                        <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <div className="font-medium">
                                            {user.name || "Ad təyin edilməyib"}
                                        </div>
                                        {user.email && (
                                            <div className="text-sm text-gray-500">{user.email}</div>
                                        )}
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell className="font-mono text-sm">
                                {user.username}
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <Building2 className="h-4 w-4 text-gray-400" />
                                    {user.hotelName}
                                </div>
                            </TableCell>
                            <TableCell>
                                <Badge
                                    variant={
                                        user.accountStatus === Statuses.ACTIVE
                                            ? "default"
                                            : "secondary"
                                    }
                                >
                                    {user.accountStatus === Statuses.ACTIVE
                                        ? "Aktiv"
                                        : "Qeyri-aktiv"}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleEditUser(user.id)}
                                    >
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <DeleteButton
                                        onDelete={() => handleDeleteUser(user.id)}
                                        modalTitle="İstifadəçini silmək istəyirsiniz?"
                                        modalDescription="Bu əməliyyatı təsdiqlədikdə seçilmiş istifadəçi və onun bütün məlumatları sistemdən silinəcək. Bu proses geri qaytarıla bilməz."
                                    />
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </>
    );
};
