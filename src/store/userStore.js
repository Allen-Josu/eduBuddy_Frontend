import { create } from "zustand";

export const useUserStore = create((set) => ({
    user: JSON.parse(localStorage.getItem("user")) || null,
    setUser: (user) => {
        localStorage.setItem("user", JSON.stringify(user));
        set({ user });
    },
    clearUser: () => {
        localStorage.removeItem("user");
        set({ user: null });
    },
}));


