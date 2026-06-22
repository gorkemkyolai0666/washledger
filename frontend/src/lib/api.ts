const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4009/api';

interface RequestOptions {
  method?: string;
  body?: unknown;
  token?: string | null;
}

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, token } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'İstek başarısız' }));
    throw new ApiError(response.status, error.message || 'İstek başarısız');
  }

  return response.json();
}

export const api = {
  auth: {
    register: (data: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
      laundromatName: string;
      phone?: string;
      city?: string;
      state?: string;
    }) => request('/auth/register', { method: 'POST', body: data }),

    login: (data: { email: string; password: string }) =>
      request('/auth/login', { method: 'POST', body: data }),

    me: (token: string) => request('/auth/me', { token }),
  },

  dashboard: {
    stats: (token: string) => request('/dashboard/stats', { token }),
  },

  machines: {
    list: (token: string, params?: { page?: number; status?: string; zone?: string }) => {
      const query = new URLSearchParams();
      if (params?.page) query.set('page', String(params.page));
      if (params?.status) query.set('status', params.status);
      if (params?.zone) query.set('zone', params.zone);
      const qs = query.toString();
      return request(`/machines${qs ? `?${qs}` : ''}`, { token });
    },
    create: (token: string, data: Record<string, unknown>) =>
      request('/machines', { method: 'POST', body: data, token }),
    update: (token: string, id: string, data: Record<string, unknown>) =>
      request(`/machines/${id}`, { method: 'PATCH', body: data, token }),
    delete: (token: string, id: string) =>
      request(`/machines/${id}`, { method: 'DELETE', token }),
  },

  collections: {
    list: (token: string, params?: { page?: number; status?: string }) => {
      const query = new URLSearchParams();
      if (params?.page) query.set('page', String(params.page));
      if (params?.status) query.set('status', params.status);
      const qs = query.toString();
      return request(`/collections${qs ? `?${qs}` : ''}`, { token });
    },
    create: (token: string, data: Record<string, unknown>) =>
      request('/collections', { method: 'POST', body: data, token }),
    update: (token: string, id: string, data: Record<string, unknown>) =>
      request(`/collections/${id}`, { method: 'PATCH', body: data, token }),
    delete: (token: string, id: string) =>
      request(`/collections/${id}`, { method: 'DELETE', token }),
  },

  repairOrders: {
    list: (token: string, params?: { status?: string; priority?: string }) => {
      const query = new URLSearchParams();
      if (params?.status) query.set('status', params.status);
      if (params?.priority) query.set('priority', params.priority);
      const qs = query.toString();
      return request(`/repair-orders${qs ? `?${qs}` : ''}`, { token });
    },
    create: (token: string, data: Record<string, unknown>) =>
      request('/repair-orders', { method: 'POST', body: data, token }),
    update: (token: string, id: string, data: Record<string, unknown>) =>
      request(`/repair-orders/${id}`, { method: 'PATCH', body: data, token }),
    delete: (token: string, id: string) =>
      request(`/repair-orders/${id}`, { method: 'DELETE', token }),
  },

  serviceSchedules: {
    list: (token: string, params?: { page?: number; status?: string }) => {
      const query = new URLSearchParams();
      if (params?.page) query.set('page', String(params.page));
      if (params?.status) query.set('status', params.status);
      const qs = query.toString();
      return request(`/service-schedules${qs ? `?${qs}` : ''}`, { token });
    },
    create: (token: string, data: Record<string, unknown>) =>
      request('/service-schedules', { method: 'POST', body: data, token }),
    update: (token: string, id: string, data: Record<string, unknown>) =>
      request(`/service-schedules/${id}`, { method: 'PATCH', body: data, token }),
    delete: (token: string, id: string) =>
      request(`/service-schedules/${id}`, { method: 'DELETE', token }),
  },

  pricingTiers: {
    list: (token: string, params?: { page?: number; status?: string }) => {
      const query = new URLSearchParams();
      if (params?.page) query.set('page', String(params.page));
      if (params?.status) query.set('status', params.status);
      const qs = query.toString();
      return request(`/pricing-tiers${qs ? `?${qs}` : ''}`, { token });
    },
    create: (token: string, data: Record<string, unknown>) =>
      request('/pricing-tiers', { method: 'POST', body: data, token }),
    update: (token: string, id: string, data: Record<string, unknown>) =>
      request(`/pricing-tiers/${id}`, { method: 'PATCH', body: data, token }),
    delete: (token: string, id: string) =>
      request(`/pricing-tiers/${id}`, { method: 'DELETE', token }),
  },

  laundromat: {
    get: (token: string) => request('/laundromat', { token }),
    update: (token: string, data: Record<string, unknown>) =>
      request('/laundromat', { method: 'PATCH', body: data, token }),
  },
};

export { ApiError };
