<template>
    <v-container>
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
        <template #no-data>
            <div class="text-center">
            <!-- <v-icon color="red">mdi-alert-circle</v-icon> -->
            <p>No items found in cart.</p>
            </div>
        </template>
        </v-data-table>
        <v-btn class="bg-white mx-10 px-10">Checkout</v-btn>
  </v-container>
</template>

<script>
    import axios from 'axios';
    import { useAuthStore } from '@/stores/auth'
    import { useCartStore } from '@/stores/cart'
    const authStore = useAuthStore();

    export default {
        data: () => ({
            cart_items: [],
            headers: [
                { text: 'Item Name', value: 'name' },
                { text: 'Item Desc', value: 'desc' },
                { text: 'Quantity', value: 'quantity' },
                { text: 'Price', value: 'price' },
                { text: "Action", value: "action", sortable: false }, // Add this
            ],
        }),
        async created() {
            const cartUser = authStore.getUser;
            try {
                if (authStore.isLoggedIn){
                    const response = await axios.post('http://localhost:3001/getCart', {
                        user_id: cartUser.user_id
                    });
                    // this.items = response.data;
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
            async removeCartItem(cartItem){
                if(authStore.isLoggedIn){ // logged in cart item add (db)
                    try {
                        const response = await axios.post('http://localhost:3001/removeCartItem', {
                            menu_item: cartItem.menu_item_id,
                            cart_id: authStore.getUser.cart_id
                        });

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
            }
        }
    }
</script>