<template>
    <v-container class="w-50">
        <v-data-table 
            v-if="cart_items"
            :hide-default-footer="true" 
            :headers="headers" 
            :items="cart_items">

            <template v-slot:top>
                <v-toolbar flat>
                    <v-toolbar-title  class="text-center">Shopping Cart</v-toolbar-title>
                </v-toolbar>
            </template>
            <template #item.action="{ item }">
                <v-btn
                color="error"
                icon
                @click="removeCartItem(item)"
                >
                <v-icon>mdi-delete</v-icon>
                </v-btn>
            </template>
            <template v-slot:body.append>
                <tr class="text-left text-subtitle-1">
                    <td colspan="2" class="font-weight-bold">Total: &nbsp;&nbsp;&nbsp;${{ this.total }}</td>
                    <td></td>
                </tr>
            </template>
            <template #no-data>
                <div class="text-center">
                <!-- <v-icon color="red">mdi-alert-circle</v-icon> -->
                <p>No items found in cart.</p>
                </div>
            </template>

        </v-data-table>
        <v-btn @click="showPaymentPage" class="bg-secondary mx-10 px-10">
            Checkout
        </v-btn>
        <div id="payment-element" class="mt-5"></div>
        <v-btn v-if="showPayBtn" @click="submitPayment" class="mt-4 bg-primary">Pay</v-btn>
        
        <div v-if="error">
            <p>{{ errormessage }}</p>
        </div>
  </v-container>
</template>

<script>
    import axios from 'axios';
    import { useAuthStore } from '@/stores/auth'
    import { useCartStore } from '@/stores/cart'
    import {loadStripe} from '@stripe/stripe-js';

    const authStore = useAuthStore();

    export default {
        watch: {
            cart_items: {
                handler: 'calculateTotal',
                deep: true, // To watch for changes inside the array
            },
        },
        data: () => ({
            cart_items: [],
            total: 0,
            headers: [
                { title: 'Menu Item', key: 'name' },
                { title: 'Quantity', key: 'quantity' },
                { title: 'Price', key: 'price' },
                { title: "", key: "action", sortable: false }
            ],
            showPayBtn: false,
            stripe: null,
            elements: null,
            // clientSecret: '',

            error: false,
            errormessage: ""
        }),
        async created() {

            const cartUser = authStore.getUser;
            try {
                if (authStore.isLoggedIn){
                    const response = await axios.post('http://localhost:3001/getCart', {
                        user_id: cartUser.user_id
                    });
                    this.cart_items = response.data.cart_items;
                } else {
                    const cartStore = useCartStore();
                    this.cart_items = cartStore.getCart
                }
               
            } catch (error) {
                console.error('There was an error getting cart data!', error);
            }
        },
        methods: {
            calculateTotal() {
                if (this.cart_items && this.cart_items.length > 0) {
                    this.total = this.cart_items.reduce((total, item) => {
                        return total + item.price * item.quantity;
                    }, 0).toFixed(2);
                } else {
                    this.total = (0).toFixed(2);
                }
            },
            async removeCartItem(cartItem){
                if(authStore.isLoggedIn){ // logged in cart item add (db)
                    try {
                        const response = await axios.post('http://localhost:3001/removeCartItem', {
                            user_id: authStore.getUser.user_id,
                            menu_item_id: cartItem.item_id,
                            cart_id: authStore.getUser.cart_id
                        });
                        this.cart_items = response.data.rows
                    } catch (error) {
                        console.error('There was an error with removing DB cart item!', error);
                    };
                } else { // logged out cart item add (session store)
                    try {
                        const cartStore = useCartStore();
                        cartStore.removeCartItem(cartItem);
                    } catch (error) {
                        console.error('There was an error with removing session store cart item!', error);
                    };
                }
            },

            // Used ChatGPT here to save me a couple trips to the StripeJS documentation
            async showPaymentPage() {
                
                try {
                    // get payment intent client secret from your backend
                    const response = await axios.post('http://localhost:3001/create-payment-intent', {
                        amount: this.total * 100 , // Convert total to cents
                        currency: 'cad' 
                    });
                    this.clientSecret = response.data.clientSecret;

                    // Initialize Stripe.js
                    this.stripe = await loadStripe('pk_test_51QRpGNKrOstSqbtPMdvgyqMNuYAUEjyQhvVbc1EBdpM0bG6xJl5pt187oh0cPTLwVVZeCsVeGbvTLGZg17WuMY7r00pBWbevJk');

                    // Set up Stripe Elements
                    this.elements = this.stripe.elements({ clientSecret: this.clientSecret });
                    const paymentElement = this.elements.create('payment');
                    this.showPayBtn = true;
                    paymentElement.mount('#payment-element');
                } catch (error) {
                    console.error('Error initializing payment:', error);
                }
            },

            // Used ChatGPT here to save me a couple trips to the StripeJS documentation
            async submitPayment() {
                if (!this.stripe || !this.elements) {
                    console.error('Stripe.js has not been loaded properly.');
                    return;
                }

                try {
                    const { error } = await this.stripe.confirmPayment({
                        elements: this.elements,
                        confirmParams: {
                            return_url: 'http://localhost:3000/payment-success'
                        },
                    });

                    if (error) {
                        // Display error to your customer
                        this.errormessage = "Payment failed, check your credentials and try again."
                        this.error = true
                        console.error('Payment failed:', error.message);
                    } else {
                        if (authStore.isLoggedIn){

                            // Create the order in the database
                            await axios.post('http://localhost:3001/createUserOrder', {
                                user_id: authStore.getUser.user_id, // Ensure user_id is defined and valid
                                amount: this.total,
                            });
                            // this.$router.push('/payment-success');
                        }
                    }
                } catch (err) {
                    console.error('Error processing payment:', err);
                }
            }
        }
    }
</script>