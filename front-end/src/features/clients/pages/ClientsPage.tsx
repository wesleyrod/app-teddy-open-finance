import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ClientCard } from "@/features/clients/components/ClientCard";
import { ClientModal } from "@/features/clients/components/ClientModal";
import { DeleteConfirmModal } from "@/features/clients/components/DeleteConfirmModal";
import { PageHeader } from "@/components/layout/PageHeader";
import { Pagination } from "@/components/common/Pagination";
import { useClients } from "@/features/clients/contexts/ClientsContext";

export default function ClientsPage() {
  const {
    clients,
    total,
    page,
    totalPages,
    perPage,
    loading,
    setPage,
    setPerPage,
    selectClient,
  } = useClients();

  return (
    <div className="flex flex-col min-h-full">
      <PageHeader
        title={<><span className="font-bold">{total}</span> clientes encontrados:</>}
        perPage={perPage}
        onPerPageChange={setPerPage}
      />

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-orange-500 border-t-transparent rounded-full" />
        </div>
      )}

      {/* Grid de Cards */}
      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {clients.map((client) => (
            <ClientCard
              key={client.id}
              name={client.name}
              salary={Number(client.salary)}
              companyValue={Number(client.companyValue)}
              actions={
                <>
                  <button
                    onClick={() => selectClient(client.id)}
                    className="text-gray-900 hover:text-orange-500 transition-colors"
                  >
                    <Plus className="h-5 w-5" />
                  </button>

                  <ClientModal
                    title="Editar cliente"
                    initialData={client}
                    trigger={<Pencil className="h-5 w-5 cursor-pointer text-gray-900 hover:text-orange-500 transition-colors" />}
                  />

                  <DeleteConfirmModal
                    clientId={client.id}
                    clientName={client.name}
                    trigger={<Trash2 className="h-5 w-5 cursor-pointer text-red-500 hover:text-red-700 transition-colors" />}
                  />
                </>
              }
            />
          ))}
        </div>
      )}

      {/* Botão 'Criar cliente' */}
      <div className="mb-12">
        <ClientModal
          title="Criar cliente:"
          trigger={
            <Button
              variant="outline"
              className="w-full border-orange-500 text-orange-500 hover:bg-orange-50 rounded-md py-6 text-base font-medium transition-all"
            >
              Criar cliente
            </Button>
          }
        />
      </div>

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}