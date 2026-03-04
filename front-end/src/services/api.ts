const API_BASE = '/api';

/* ==============================
   Auth Types & Functions
   ============================== */

export interface LoginResponse {
  access_token: string;
  user: {
    name: string;
    email: string;
    role: string;
  };
}

export async function loginRequest(email: string, password: string): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || 'Credenciais inválidas');
  }

  return response.json();
}

// Token helpers
const TOKEN_KEY = 'teddy_access_token';
const USER_KEY = 'teddy_user';

export function saveAuth(token: string, user: LoginResponse['user']) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser(): LoginResponse['user'] | null {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

/* ==============================
   Authenticated fetch helper
   ============================== */

function authHeaders(): Record<string, string> {
  const token = getStoredToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function authFetch(url: string, options: RequestInit = {}) {
  const response = await fetch(url, {
    ...options,
    headers: { ...authHeaders(), ...(options.headers as Record<string, string> || {}) },
  });

  if (response.status === 401) {
    clearAuth();
    window.location.hash = '#/login';
    throw new Error('Sessão expirada');
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || 'Erro na requisição');
  }

  // DELETE pode retornar 200 com body ou 204 sem body
  if (response.status === 204) return null;

  return response.json();
}

/* ==============================
   Client Types & Functions
   ============================== */

export interface Client {
  id: string;
  name: string;
  salary: number;
  companyValue: number;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ClientsResponse {
  clients: Client[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateClientPayload {
  name: string;
  salary: number;
  companyValue: number;
}

export interface UpdateClientPayload {
  name?: string;
  salary?: number;
  companyValue?: number;
}

export async function fetchClients(page = 1, limit = 16): Promise<ClientsResponse> {
  return authFetch(`${API_BASE}/clients?page=${page}&limit=${limit}`);
}

export async function fetchClient(id: string): Promise<Client> {
  return authFetch(`${API_BASE}/clients/${id}`);
}

export async function createClient(data: CreateClientPayload): Promise<Client> {
  return authFetch(`${API_BASE}/clients`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateClient(id: string, data: UpdateClientPayload): Promise<Client> {
  return authFetch(`${API_BASE}/clients/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function deleteClient(id: string): Promise<void> {
  return authFetch(`${API_BASE}/clients/${id}`, {
    method: 'DELETE',
  });
}
