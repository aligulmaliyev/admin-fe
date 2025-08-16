import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { navigation } from "@/constants/navigation";
import { useAuth } from "@/contexts/auth-context";
import { Hotel, LogOut } from "lucide-react";
import { Link, useLocation } from "react-router";

type SidebarProps = {
  mobile?: boolean;
  setSidebarOpen: (open: boolean) => void;
};

export const Sidebar = ({ mobile = false, setSidebarOpen }: SidebarProps) => {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();

  return (
    <div className={`flex flex-col h-full ${mobile ? "p-4" : "p-6"}`}>
      <div className="flex items-center gap-2 mb-8">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Hotel className="h-6 w-6 text-blue-600" />
        </div>
        <span className="text-xl font-bold">Otel Admin</span>
      </div>

      <nav className="flex-1 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              onClick={() => mobile && setSidebarOpen(false)}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="border-t pt-4">
        <div className="flex items-center gap-3 px-3 py-2">
          <Avatar className="h-8 w-8">
            {/* <AvatarImage src="/placeholder.svg?height=32&width=32" /> */}
            <AvatarFallback>AD</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.name}
            </p>
            <p className="text-xs text-gray-500 truncate">{user?.username}</p>
          </div>
        </div>
        <Button
          onClick={logout}
          variant="ghost"
          className="w-full justify-start gap-3 px-3 py-2 text-gray-600 hover:bg-gray-100"
        >
          <LogOut className="h-4 w-4" />
          Çıxış
        </Button>
      </div>
    </div>
  );
};
