import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { AlertCircle } from "lucide-react"

interface DeleteConfirmationDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onConfirm: () => void
    title?: string
    description?: string
}

export function DeleteConfirmation({
    open,
    onOpenChange,
    onConfirm,
    title = "Silmək istədiyinizə əminsiniz?",
    description = "Bu əməliyyat geri qaytarıla bilməz.",
}: DeleteConfirmationDialogProps) {
    const handleConfirm = () => {
        onConfirm()
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <AlertCircle className="text-red-500" />
                        {title}
                    </DialogTitle>
                    <DialogDescription className="text-left">
                        {description}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-2">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Xeyr
                    </Button>
                    <Button variant="destructive" onClick={handleConfirm}>
                        Bəli, Sil
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
