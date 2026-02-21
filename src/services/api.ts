// API configuration
const API_BASE_URL = import.meta.env.PROD
  ? "/api" // In production, API is on same server
  : "http://localhost:3000/api"; // In dev, API is on separate port

const fetchAPI = async (endpoint: string, options: RequestInit = {}) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    credentials: "include", // Important for session cookies
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: "Erreur réseau" }));
    throw new Error(error.error || "Erreur réseau");
  }

  return response.json();
};

export const api = {
  // Auth endpoints
  auth: {
    hasPassword: () => fetchAPI("/auth/has-password"),
    check: () => fetchAPI("/auth/check"),
    setup: (password: string) =>
      fetchAPI("/auth/setup", {
        method: "POST",
        body: JSON.stringify({ password }),
      }),
    login: (password: string) =>
      fetchAPI("/auth/login", {
        method: "POST",
        body: JSON.stringify({ password }),
      }),
    logout: () =>
      fetchAPI("/auth/logout", {
        method: "POST",
      }),
  },

  // Children endpoints
  children: {
    getAll: () => fetchAPI("/children"),
    getById: (id: string) => fetchAPI(`/children/${id}`),
    create: (child: any) =>
      fetchAPI("/children", {
        method: "POST",
        body: JSON.stringify(child),
      }),
    update: (id: string, updates: any) =>
      fetchAPI(`/children/${id}`, {
        method: "PUT",
        body: JSON.stringify(updates),
      }),
    delete: (id: string) =>
      fetchAPI(`/children/${id}`, {
        method: "DELETE",
      }),
  },

  // Entries endpoints
  entries: {
    getByDateRange: (startDate: string, endDate: string) =>
      fetchAPI(`/entries?startDate=${startDate}&endDate=${endDate}`),
    getByChildAndDate: (childId: string, date: string) =>
      fetchAPI(`/entries/${childId}/${date}`),
    save: (entry: any) =>
      fetchAPI("/entries", {
        method: "POST",
        body: JSON.stringify(entry),
      }),
    update: (childId: string, date: string, updates: any) =>
      fetchAPI(`/entries/${childId}/${date}`, {
        method: "PUT",
        body: JSON.stringify(updates),
      }),
  },
};
