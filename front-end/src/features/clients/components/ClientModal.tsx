import { type ReactNode, useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ClientForm, type ClientFormData } from "./ClientForm";
import { useClients } from "@/features/clients/contexts/ClientsContext";
import type { Client } from "@/services/api";

interface ClientModalProps {
  trigger: ReactNode;
  title?: string;
  initialData?: Client;
}

export function ClientModal({ trigger, title = "Criar cliente:", initialData }: ClientModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const { addClient, editClient } = useClients();

  const formDataRef = useRef<ClientFormData>({ name: "", salary: 0, companyValue: 0 });
  const submitRef = useRef<(() => Promise<boolean>) | null>(null);

  const handleSave = async () => {
    // Trigger react-hook-form validation via the ref
    const isValid = await submitRef.current?.();
    if (!isValid) return;

    const { name, salary, companyValue } = formDataRef.current;

    setSaving(true);
    setError("");
    try {
      if (initialData) {
        await editClient(initialData.id, { name, salary, companyValue });
      } else {
        await addClient({ name, salary, companyValue });
      }
      setIsOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); setError(""); }}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[420px] p-6 rounded-lg gap-2">
        <DialogHeader>
          <DialogTitle className="text-base font-bold text-gray-900">
            {title}
          </DialogTitle>
        </DialogHeader>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm">
            {error}
          </div>
        )}

        <ClientForm
          initialData={initialData}
          onFormDataChange={(data) => { formDataRef.current = data; }}
          submitRef={submitRef}
        />

        <Button
          className="w-full bg-orange-500 hover:bg-orange-600 text-white py-6 rounded-sm text-base font-medium mt-2 disabled:opacity-60"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? "Salvando..." : initialData ? "Salvar alterações" : "Criar cliente"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}