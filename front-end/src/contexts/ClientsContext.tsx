import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import {
  fetchClients,
  createClient,
  updateClient,
  deleteClient,
  type Client,
  type ClientsResponse,
  type CreateClientPayload,
  type UpdateClientPayload,
} from "@/services/api";

const SELECTED_CLIENTS_KEY = 'teddy_selected_clients';

function loadSelectedClients(): Client[] {
  try {
    const raw = localStorage.getItem(SELECTED_CLIENTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

interface ClientsContextType {
  clients: Client[];
  selectedClients: Client[];
  total: number;
  page: number;
  totalPages: number;
  perPage: number;
  loading: boolean;
  setPage: (page: number) => void;
  setPerPage: (perPage: number) => void;
  refreshClients: () => Promise<void>;
  addClient: (data: CreateClientPayload) => Promise<void>;
  editClient: (id: string, data: UpdateClientPayload) => Promise<void>;
  removeClient: (id: string) => Promise<void>;
  selectClient: (id: string) => void;
  removeSelectedClient: (id: string) => void;
  clearSelectedClients: () => void;
}

const ClientsContext = createContext<ClientsContextType | undefined>(undefined);

export function ClientsProvider({ children }: { children: ReactNode }) {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClients, setSelectedClients] = useState<Client[]>(loadSelectedClients);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage, setPerPageState] = useState(16);
  const [loading, setLoading] = useState(false);

  const loadClients = useCallback(async () => {
    setLoading(true);
    try {
      const data: ClientsResponse = await fetchClients(page, perPage);
      setClients(data.clients);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error("Erro ao carregar clientes:", err);
    } finally {
      setLoading(false);
    }
  }, [page, perPage]);

  useEffect(() => {
    loadClients();
  }, [loadClients]);

  // Persist selected clients to localStorage
  useEffect(() => {
    localStorage.setItem(SELECTED_CLIENTS_KEY, JSON.stringify(selectedClients));
  }, [selectedClients]);

  const setPerPage = useCallback((value: number) => {
    setPerPageState(value);
    setPage(1);
  }, []);

  const refreshClients = useCallback(async () => {
    await loadClients();
  }, [loadClients]);

  const addClient = useCallback(async (data: CreateClientPayload) => {
    await createClient(data);
    await loadClients();
  }, [loadClients]);

  const editClient = useCallback(async (id: string, data: UpdateClientPayload) => {
    const updated = await updateClient(id, data);
    // Also update in selected clients if present
    setSelectedClients((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updated } : c))
    );
    await loadClients();
  }, [loadClients]);

  const removeClient = useCallback(async (id: string) => {
    await deleteClient(id);
    // Também remove dos selecionados se estiver lá
    setSelectedClients((prev) => prev.filter((c) => c.id !== id));
    await loadClients();
  }, [loadClients]);

  const selectClient = useCallback((id: string) => {
    if (selectedClients.some((c) => c.id === id)) return;
    const client = clients.find((c) => c.id === id);
    if (client) {
      setSelectedClients((prev) => [...prev, client]);
    }
  }, [clients, selectedClients]);

  const removeSelectedClient = useCallback((id: string) => {
    setSelectedClients((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const clearSelectedClients = useCallback(() => {
    setSelectedClients([]);
  }, []);

  return (
    <ClientsContext.Provider
      value={{
        clients,
        selectedClients,
        total,
        page,
        totalPages,
        perPage,
        loading,
        setPage,
        setPerPage,
        refreshClients,
        addClient,
        editClient,
        removeClient,
        selectClient,
        removeSelectedClient,
        clearSelectedClients,
      }}
    >
      {children}
    </ClientsContext.Provider>
  );
}

export function useClients() {
  const context = useContext(ClientsContext);
  if (!context) {
    throw new Error("useClients deve ser usado dentro de um ClientsProvider");
  }
  return context;
}

export type { Client } from "@/services/api";
