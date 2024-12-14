import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => {
    // Load stored auth data from localStorage if available
    const storedAuth = localStorage.getItem('auth');
    return storedAuth ? JSON.parse(storedAuth) : {
      isAuthenticated: false,
      isAdmin: false,
      user: null,
    };
  },
  getters: {
    isLoggedIn: (state) => state.isAuthenticated,
    isAdminUser: (state) => state.isAdmin,
    getUser: (state) => state.user,
  },
  actions: {
    login(userData) {
      this.isAuthenticated = true; // Set the authenticated status to true
      if (userData.type_id === 0) {
        this.isAdmin = true; // Set admin status
      }
      this.user = userData; // Store user data in state

      // Persist state to localStorage
      this.persistState();
    },
    logout() {
      this.isAuthenticated = false;
      this.isAdmin = false;
      this.user = null;

      // Clear state from localStorage
      localStorage.removeItem('auth');
    },
    persistState() {
      // Save the current state to localStorage
      localStorage.setItem('auth', JSON.stringify(this.$state));
    }
  },
  persistState() {
    // Automatically persist state whenever it changes
    this.$subscribe((mutation, state) => {
      localStorage.setItem('auth', JSON.stringify(state));
    });
  },
});
