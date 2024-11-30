// stores/cart.js
import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
    state: () => ({
        cart: []
    }), 
    getters: {
        getCart: (state) => state.cart,
    },
    actions: { 
        addCartItem(cartItem) {
            // Find an existing item in the cart with the same menu_item_id
            const existingItem = this.cart.find(item => item.menu_item_id === cartItem.menu_item_id);

            if (existingItem) {
                // If the item exists, increment its quantity
                existingItem.quantity += 1;
            } else {
                // If the item doesn't exist, add it to the cart with quantity 1
                const newItem = {
                    menu_item_id: cartItem.menu_item_id,
                    name: cartItem.name,
                    price: cartItem.price,
                    quantity: 1
                };
                this.cart.push(newItem);
            }
        },
        removeCartItem(cartItem) {
            // Find the index of the item in the cart
            const index = this.cart.findIndex(item => item.menu_item_id === cartItem.menu_item_id);
        
            if (index !== -1) {
                const existingItem = this.cart[index];
                
                if (existingItem.quantity > 1) {
                    // If the quantity is greater than 1, decrement it
                    existingItem.quantity -= 1;
                } else {
                    // If the quantity is 1, remove the item from the cart
                    this.cart.splice(index, 1);
                }
            }          
        },
    },
})
