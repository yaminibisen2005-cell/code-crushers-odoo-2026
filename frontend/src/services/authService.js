import api from "./api";
import { normalizeRole } from "../config/roles";

export const authService = {
  login: async (email, password) => {
    try {
      const response = await api.post("/api/auth/login", {
        email,
        password,
      });

      const data = response.data;
      const normalizedRole = normalizeRole(data.role);

      const user = {
        name: data.name,
        email: data.email,
        role: normalizedRole,
      };

      localStorage.setItem("transitops_token", data.token);
      localStorage.setItem("transitops_user", JSON.stringify(user));
      localStorage.setItem("transitops_role", normalizedRole);

      return {
        token: data.token,
        user,
      };
    } catch (error) {
      throw new Error(error.response?.data?.message || "Invalid credentials");
    }
  },

  getCurrentUser: () => {
    const user = localStorage.getItem("transitops_user");

    return user ? JSON.parse(user) : null;
  },

  logout: () => {
    localStorage.removeItem("transitops_user");
    localStorage.removeItem("transitops_token");
    localStorage.removeItem("transitops_role");
  },
};
