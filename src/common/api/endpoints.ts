export const endpoints = {
  hotels: {
    getAll: "/hotels",
    create: "/hotels",
    getById: (id: number) => `/hotels/${id}`,
    update: (id: number) => `/hotels/${id}`,
    delete: (id: number) => `/hotels/${id}`,
  },
  users: {
    getAll: "/users",
    create: "/users",
    getById: (id: number) => `/users/${id}`,
    update: (id: number) => `/users/${id}`,
    delete: (id: number) => `/users/${id}`,
  },
  auth: {
    login: "/admin-user",
    logout: "/logout",
  },
} as const;

export type Endpoints = typeof endpoints;