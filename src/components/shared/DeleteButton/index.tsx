import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import { DeleteConfirmation } from '../DeleteConfirmation';
import { useState } from 'react';

interface TDeleteButtonProps {
    modalTitle: string;
    modalDescription: string;
    onDelete: () => void
}
export const DeleteButton = ({ modalTitle, modalDescription, onDelete }: TDeleteButtonProps) => {
    const [isDeleteModal, setIsDeleteModal] = useState<boolean>(false);
    return (
        <>
            <Button
                onClick={() => setIsDeleteModal(true)}
                variant="ghost"
                size="sm"
                className="text-red-600 hover:text-red-700"
            >
                <Trash2 className="h-4 w-4" />
            </Button>

            {isDeleteModal && <DeleteConfirmation
                open={isDeleteModal}
                onOpenChange={setIsDeleteModal}
                onConfirm={onDelete}
                title={modalTitle}
                description={modalDescription}
            />}
        </>
    )
}

