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

import {
  Users as UsersIcon,
  Search,
  Plus,
} from "lucide-react";
import { useUsersStore } from "@/store/useUsersStore";
import { ManageUserModal } from "./ManageUserModal";
import { UserTable } from "./UserTable";

export default function Users() {
  const [isManageUserOpen, setManageUserOpen] = useState(false);
  const { users, fetchUsers } = useUsersStore();

  const [searchTerm, setSearchTerm] = useState("");

  const filteredAdmins = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.hotelName.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          onClick={() => setManageUserOpen(() => !isManageUserOpen)}
        >
          <Plus className="h-4 w-4" />
          Yeni istifadəçi
        </Button>
        {isManageUserOpen && (
          <ManageUserModal
            setManageUserOpen={setManageUserOpen}
            isManageUserOpen={isManageUserOpen}
            mode='create'
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
          <UserTable users={filteredAdmins} />
        </CardContent>
      </Card>
    </div>
  );
}
