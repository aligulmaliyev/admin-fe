import { useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Statuses } from "@/constants/statuses";
import { useHotelsStore } from "@/store/useHotelsStore";
import { useUsersStore } from "@/store/useUsersStore";
import { Building2, Users, Hotel } from "lucide-react";

type StatItem = {
  title: string;
  value: string;
  description?: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  color: string;   
  bgColor: string; 
};

export default function Dashboard() {
  const { fetchUsers, users } = useUsersStore();
  const { fetchHotels, hotels } = useHotelsStore();

  useEffect(() => {
    fetchUsers();
    fetchHotels();
  }, [fetchUsers, fetchHotels]);

  const { total, activeCount, activePctText, hotelsLastMonth } = useMemo(() => {
    const now = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(now.getMonth() - 1);

    const totalHotels = hotels.length;
    const active = hotels.filter((h) => h.status === Statuses.ACTIVE).length;

    const pct = totalHotels === 0 ? 0 : Math.round((active / totalHotels) * 100);

    const hotelsNew = hotels.filter((h) => new Date(h?.createdAt) >= oneMonthAgo).length;

    return {
      total: totalHotels,
      activeCount: active,
      activePctText: `${pct}% aktiv`,
      hotelsLastMonth: hotelsNew.toString(),
    };
  }, [hotels, users]);


  const stats: StatItem[] = useMemo(
    () => [
      {
        title: "Ümumi Otellər",
        value: total.toString(),
        description: `Son ayda +${hotelsLastMonth}`,
        icon: Building2,
        color: "text-[#4EA36C]",
        bgColor: "bg-[#DFF5E7]",
      },
      {
        title: "Hotel Adminləri",
        value: users.length.toString(),
        description: "Sistemdəki ümumi admin sayı",
        icon: Users,
        color: "text-green-600",
        bgColor: "bg-green-100",
      },
      {
        title: "Aktiv Otellər",
        value: activeCount.toString(),
        description: activePctText,
        icon: Hotel,
        color: "text-purple-600",
        bgColor: "bg-purple-100",
      },
    ],
    [total, users.length, activeCount, activePctText]
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">İdarəetmə paneli</h1>
        <p className="text-gray-600 mt-2">Otel idarəetmə sisteminin ümumi görünüşü</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <div className={`rounded-lg p-2 ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {stat.value}
              </div>
              {stat.description && (
                <p className="mt-1 text-xs text-gray-600">{stat.description}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
