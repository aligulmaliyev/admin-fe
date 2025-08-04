import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Statuses } from "@/constants/statuses";
import { useHotelsStore } from "@/store/useHotelsStore";
import { useUsersStore } from "@/store/useUsersStore";
import { Building2, Users, Hotel } from "lucide-react";
import { useEffect } from "react";

export default function Dashboard() {
  const { fetchUsers, users } = useUsersStore();
  const { fetchHotels, hotels } = useHotelsStore();
  const total = hotels.length;
  const active = hotels.filter(
    (hotel) => hotel.status === Statuses.ACTIVE
  ).length;
  const activePercentage = total === 0 ? 0 : (active / total) * 100;

  const stats = [
    {
      title: "Ümumi Otellər",
      value: total,
      description: "Son ayda +2",
      icon: Building2,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Hotel Adminləri",
      value: users.length.toString(),
      description: "Son ayda +5",
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Aktiv Otellər",
      value: hotels
        .filter((hotel) => hotel.status == Statuses.ACTIVE)
        .length.toString(),
      description: activePercentage,
      icon: Hotel,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
  ];

  useEffect(() => {
    fetchUsers();
    fetchHotels();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Otel idarəetmə sisteminin ümumi görünüşü
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {stat.value}
              </div>
              <p className="text-xs text-gray-600 mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
