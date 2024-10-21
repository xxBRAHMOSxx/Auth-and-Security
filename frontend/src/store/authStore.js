import { create } from "zustand"
import axios from "axios"
import { verify } from "crypto"

const API_URL = "http://localhost:5000/api/auth"
axios.defaults.withCredentials = true

export const useAuthStore = create((set) => ({
    user: null,
    isAuthenticated: false,
    error: null,
    isLoading: true,
    isCheckingAuth: true,

    signup: async (email, password, name) => {
        set({ isLoading: true, error: null })
        try {
            const response = await axios.post(`${API_URL}/sighup`, { email, password, name })
            set({ user: response.data.user, isAuthenticated: true, isLoading: false })
        } catch (error) {
            set({ error: error.response.data.message || "Error Signing up", isLoading: false })
            throw error
        }
    },

    verifyEmail: async (code) => {
        set({ isLoading: true, error: null })
        try {
            const response = await axios.post(`${API_URL}/verifyEmail`, { code })
            set({ user: response.data.user, isAuthenticated: true, isLoading: false })
            return response.data

        } catch (error) {
            set({ error: error.response.data.message || "Error verifying email", isLoading: false })
            throw error
        }
    },

}))