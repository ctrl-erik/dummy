// stores/auth.js
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: false,
    isAdmin: false,
    user: null, // Can store user details here if needed
  }), 
  getters: {
    isLoggedIn: (state) => state.isAuthenticated,
    getUser: (state) => state.user,
  },
    actions: {
        login(userData) {
            this.isAuthenticated = true; // Set the authenticated status to true

            if (userData.type_id == 0) {
                this.isAdmin = true; // set admin status
            }
            // Store user data in the state (e.g., user information from login)
            this.user = userData
        },
        logout() {
            // Reset authentication status
            this.isAuthenticated = false
            this.isAdmin = false
            // Clear user data
            this.user = null
        },
    },
})
