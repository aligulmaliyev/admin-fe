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
import {
  Building2,
  Search,
  Plus,
} from "lucide-react";
import ManageHotelModal from "./ManageHotelModal";
import { useHotelsStore } from "@/store/useHotelsStore";
import { HotelTable } from "@/pages/hotels/HotelTable";

export default function Hotels() {
  const { hotels, fetchHotels } = useHotelsStore();
  const [isAddNewHotel, setAddNewHotel] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");


  const filteredHotels = hotels?.filter(
    (hotel) =>
      hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hotel.city.toLowerCase().includes(searchTerm.toLowerCase())
  );
  useEffect(() => {
    fetchHotels();
  }, []);

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Otellər</h1>
            <p className="text-gray-600 mt-2">
              Sistemdəki bütün otelləri idarə edin
            </p>
          </div>
          <Button
            className="gap-2"
            onClick={() => setAddNewHotel(() => !isAddNewHotel)}
          >
            <Plus className="h-4 w-4" />
            Yeni Otel
          </Button>
          {isAddNewHotel && (
            <ManageHotelModal
              isManageDialogOpen={isAddNewHotel}
              setIsManageDialogOpen={setAddNewHotel}
              mode={'create'}
            />
          )}
        </div>

        {/* Search */}
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Otel adı və ya şəhər üzrə axtarın..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Hotels Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Otellər Siyahısı
            </CardTitle>
            <CardDescription>
              Ümumi {filteredHotels?.length} otel tapıldı
            </CardDescription>
          </CardHeader>
          <CardContent>
            <HotelTable hotels={filteredHotels} />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
