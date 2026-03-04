import { type ReactNode, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useClients } from "@/features/clients/contexts/ClientsContext";

interface DeleteConfirmModalProps {
  trigger: ReactNode;
  clientId: string;
  clientName: string;
}

export function DeleteConfirmModal({ trigger, clientId, clientName }: DeleteConfirmModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { removeClient } = useClients();

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await removeClient(clientId);
      setIsOpen(false);
    } catch (err) {
      console.error("Erro ao excluir:", err);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-red-600">Excluir cliente?</DialogTitle>
          <DialogDescription>
            Você tem certeza que deseja excluir o cliente <strong>{clientName}</strong>? Esta ação não pode ser desfeita.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" className="flex-1" onClick={() => setIsOpen(false)}>
            Cancelar
          </Button>
          <Button
            variant="destructive"
            className="flex-1"
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? "Excluindo..." : "Excluir"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}