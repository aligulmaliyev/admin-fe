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
import {
  Building2,
  Search,
  Trash2,
  MapPin,
  Phone,
  Mail,
  Plus,
  Edit,
} from "lucide-react";
import type { IHotelResponse } from "@/models/hotel";
import ManageHotelModal from "./ManageHotelModal";
import { useHotelsStore } from "@/store/useHotelsStore";
import { Statuses } from "@/constants/statuses";

export default function Hotels() {
  const { hotels, fetchHotels, deleteHotel } = useHotelsStore();
  const [isManageDialogOpen, setIsManageDialogOpen] = useState(false);
  const [mode, setMode] = useState<"edit" | "create">("create");
  const [id, setId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");


  const filteredHotels = hotels?.filter(
    (hotel) =>
      hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hotel.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteHotel = async (hotelId: number) => {
    await deleteHotel(hotelId);
  };

  const handleEditHotel = (hotelId: number) => {
    setIsManageDialogOpen(true);
    setMode("edit");
    setId(hotelId);
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  return (
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
          onClick={() => {
            setIsManageDialogOpen(() => !isManageDialogOpen);
            setId(null);
            setMode("create");
          }}
        >
          <Plus className="h-4 w-4" />
          Yeni Otel
        </Button>
        {isManageDialogOpen && (
          <ManageHotelModal
            isManageDialogOpen={isManageDialogOpen}
            setIsManageDialogOpen={setIsManageDialogOpen}
            id={id}
            mode={mode}
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Otel Adı</TableHead>
                <TableHead>Məkan</TableHead>
                <TableHead>Əlaqə</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Yaradılma Tarixi</TableHead>
                <TableHead className="text-right">Əməliyyatlar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredHotels?.map((hotel: IHotelResponse) => (
                <TableRow key={hotel.address}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{hotel.name}</div>
                      {hotel.legalName && (
                        <div className="text-sm text-gray-500">
                          {hotel.legalName}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <MapPin className="h-3 w-3 text-gray-400" />
                      {hotel.city}, {hotel.country}
                    </div>
                    {hotel.address && (
                      <div className="text-xs text-gray-500 mt-1">
                        {hotel.address}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {hotel.phone && (
                        <div className="flex items-center gap-1 text-sm">
                          <Phone className="h-3 w-3 text-gray-400" />
                          {hotel.phone}
                        </div>
                      )}
                      {hotel.email && (
                        <div className="flex items-center gap-1 text-sm">
                          <Mail className="h-3 w-3 text-gray-400" />
                          {hotel.email}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        hotel.status === Statuses.ACTIVE
                          ? "default"
                          : "secondary"
                      }
                    >
                      {hotel.status === Statuses.ACTIVE
                        ? "Aktiv"
                        : "Qeyri-aktiv"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {new Date(hotel.createdAt).toLocaleDateString("az-AZ")}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={()=>handleEditHotel(hotel.id)}
                        asChild
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => handleDeleteHotel(hotel.id)}
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
