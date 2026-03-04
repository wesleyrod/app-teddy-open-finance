import { useState } from "react";
import { Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ClientCard } from "@/components/shared/ClientCard";
import { PageHeader } from "@/components/shared/PageHeader";
import { Pagination } from "@/components/shared/Pagination";
import { useClients } from "@/contexts/ClientsContext";

export default function SelectedClientsPage() {
  const { selectedClients, removeSelectedClient, clearSelectedClients } = useClients();
  const [perPage, setPerPage] = useState(16);
  const [currentPage, setCurrentPage] = useState(1);

  const totalClients = selectedClients.length;
  const totalPages = Math.ceil(totalClients / perPage);
  const startIndex = (currentPage - 1) * perPage;
  const visibleClients = selectedClients.slice(startIndex, startIndex + perPage);

  const handlePerPageChange = (value: number) => {
    setPerPage(value);
    setCurrentPage(1);
  };

  return (
    <div className="flex flex-col min-h-full">
      <PageHeader
        title={<><span className="font-bold">{totalClients}</span> clientes selecionados:</>}
        perPage={perPage}
        onPerPageChange={handlePerPageChange}
      />

      {/* Mensagem quando não há clientes selecionados */}
      {totalClients === 0 && (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-400 text-lg">Nenhum cliente selecionado ainda.</p>
        </div>
      )}

      {/* Grid de Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
        {visibleClients.map((client) => (
          <ClientCard
            key={client.id}
            name={client.name}
            salary={Number(client.salary)}
            companyValue={Number(client.companyValue)}
            actions={
              <button
                onClick={() => removeSelectedClient(client.id)}
                className="text-red-500 hover:text-red-700 transition-colors ml-auto"
              >
                <Minus className="h-5 w-5" />
              </button>
            }
          />
        ))}
      </div>

      {/* Limpar seleção */}
      {totalClients > 0 && (
        <div className="mb-12">
          <Button
            variant="outline"
            className="w-full border-orange-500 text-orange-500 hover:bg-orange-50 rounded-md py-6 text-base font-medium transition-all"
            onClick={clearSelectedClients}
          >
            Limpar clientes selecionados
          </Button>
        </div>
      )}

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
    </div>
  );
}
