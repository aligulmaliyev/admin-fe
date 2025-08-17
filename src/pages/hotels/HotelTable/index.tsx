import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, Mail, MapPin, Phone } from "lucide-react"
import { useState } from "react"
import type { IHotelResponse } from "@/models/hotel"
import { useHotelsStore } from "@/store/useHotelsStore"
import ManageHotelModal from "../ManageHotelModal"
import { Statuses } from "@/constants/statuses"
import { DeleteButton } from "@/components/shared/DeleteButton"

export const HotelTable = ({ hotels }: { hotels: IHotelResponse[] }) => {
    const { deleteHotel } = useHotelsStore();
    const [id, setId] = useState<number>();
    const [isEditModal, setIsEditModal] = useState<boolean>(false);

    const handleDeleteHotel = async (id: number) => {
        await deleteHotel(id);
    };

    const handleEditHotel = (id: number) => {
        setIsEditModal(true);
        setId(id);
    };

    return (
        <>
            {isEditModal && (
                <ManageHotelModal
                    isManageDialogOpen={isEditModal}
                    setIsManageDialogOpen={setIsEditModal}
                    id={id}
                    mode='edit'
                />
            )}
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
                    {hotels?.map((hotel: IHotelResponse) => (
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
                                        onClick={() => handleEditHotel(hotel.id)}
                                    >
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <DeleteButton
                                        onDelete={() => handleDeleteHotel(hotel.id)}
                                        modalTitle="Oteli silmək istəyirsiniz?"
                                        modalDescription="Bu əməliyyatı təsdiqlədikdə seçilmiş otel və onun bütün məlumatları sistemdən silinəcək. Bu proses geri qaytarıla bilməz."
                                    />
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </>
    )
}
