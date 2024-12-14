// stores/stripe.js
import { defineStore } from 'pinia';
import { loadStripe } from '@stripe/stripe-js';

export const useStripeStore = defineStore('stripe', {
  state: () => ({
    stripe: null,
  }),
  actions: {
    async initializeStripe() {
      if (!this.stripe) {
        this.stripe = await loadStripe('pk_test_51QRpGNKrOstSqbtPMdvgyqMNuYAUEjyQhvVbc1EBdpM0bG6xJl5pt187oh0cPTLwVVZeCsVeGbvTLGZg17WuMY7r00pBWbevJk');
      }
    },
  },
});
