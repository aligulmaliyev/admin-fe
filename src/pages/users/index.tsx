/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Users as UsersIcon,
  Search,
  Edit,
  Trash2,
  Building2,
  Plus,
} from "lucide-react";
import { useUsersStore } from "@/store/useUsersStore";
import { ManageUserModal } from "./ManageUserModal";
import { Statuses } from "@/constants/statuses";

export default function Users() {
  const [isManageUserOpen, setManageUserOpen] = useState(false);
  const [mode, setMode] = useState<"edit" | "create">("create");
  const [id, setId] = useState<number | null>(null);
  const { users, fetchUsers, deleteUser } = useUsersStore();

  const [searchTerm, setSearchTerm] = useState("");

  const filteredAdmins = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.hotelName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getInitials = (name?: string) => {
    if (!name) return "A";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const handleDeleteUser = async (userId: number) => {
    await deleteUser(userId);
  };

    const handleEditUser = (userId: number) => {
    setManageUserOpen(true);
    setMode("edit");
    setId(userId);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Hotel Adminləri</h1>
          <p className="text-gray-600 mt-2">
            Otel istifadəçilərini idarə edin və yenilərini yaradın
          </p>
        </div>

        <Button
          className="gap-2"
          onClick={() => {
            setManageUserOpen(() => !isManageUserOpen);
            setId(null);
            setMode("create");
          }}
        >
          <Plus className="h-4 w-4" />
          Yeni istifadəçi
        </Button>
        {isManageUserOpen && (
          <ManageUserModal
            setManageUserOpen={setManageUserOpen}
            mode={mode}
            id={id}
            isManageUserOpen={isManageUserOpen}
          />
        )}
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Admin adı, istifadəçi adı və ya otel adı üzrə axtarın..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Admins Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UsersIcon className="h-5 w-5" />
            Otel istifadəçilərinin siyahısı
          </CardTitle>
          <CardDescription>
            Ümumi {filteredAdmins.length} istifadəçi tapıldı
          </CardDescription>
        </CardHeader>
        <CardContent>
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
              {filteredAdmins.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={`/placeholder.svg?height=32&width=32`}
                        />
                        <AvatarFallback>
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">
                          {user.name || "Ad təyin edilməyib"}
                        </div>
                        {user.email && (
                          <div className="text-sm text-gray-500">
                            {user.email}
                          </div>
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
                      <Button
                        onClick={() => handleDeleteUser(user.id)}
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
