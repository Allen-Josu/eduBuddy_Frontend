import { create } from "zustand";

export const useAdminStore = create((set) => ({
  admin: JSON.parse(localStorage.getItem("admin")) || null,
  setAdmin: (admin) => {
    localStorage.setItem("admin", JSON.stringify(admin));
    set({ admin });
  },
  clearAdmin: () => {
    localStorage.removeItem("admin");
    set({ admin: null });
  },
}));
