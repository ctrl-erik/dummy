<template>
    <v-container fluid fill-height>
        <v-row justify="center" class="text-center">
            <v-col cols="12" md="8">
                <v-toolbar flat>
                    <v-toolbar-title class="text-center">Menu</v-toolbar-title>
                </v-toolbar>
                <v-toolbar flat class="bg-primary">
                    <div class="d-flex justify-space-evenly flex-grow-1">
                        <v-btn class="bg-white px-3" @click="getsetMenuItems(0)">All Items</v-btn>
                        <v-btn class="bg-white px-3" @click="getsetMenuItems(1)">Classics</v-btn>
                        <v-btn class="bg-white px-3" @click="getsetMenuItems(2)">Combos</v-btn>
                        <v-btn class="bg-white px-3" @click="getsetMenuItems(3)">Drinks/Sides</v-btn>
                        <v-btn v-if="isAuth" class="bg-white px-5" @click="">
                            Customize
                        </v-btn>
                    </div>
                </v-toolbar>
                <v-row>
                    <v-col v-for="(item, index) in menu_items" :key="index" cols="12" sm="4" md="4">
                        <v-card class="text-center" elevation="5" rounded="md" @click="showMenuDetails(item)">
                            <v-img :src="item.display_img" height="100px"></v-img>

                            <v-card-title>{{ item.name }}</v-card-title>
                            <v-card-subtitle class="color-secondary">$ {{ item.price }}</v-card-subtitle>

                            <v-card-text>
                                {{ item.desc }}
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>
                <Modal v-model="displayModal" :title="selectedMenuItem?.name" :message="modalMessage"
                    :messageStatus="modalMessageStatus">
                    <v-card-subtitle class="color-secondary text-center">$ {{ selectedMenuItem?.price
                        }}</v-card-subtitle>
                    <br />
                    <v-img :src="selectedMenuItem?.display_img" height="150px"></v-img>
                    <p class="text-center">{{ selectedMenuItem?.desc }}</p>
                    <template #actions>
                        <v-btn class="" color="primary" @click="addItemToCart(selectedMenuItem)">Add to Cart</v-btn>
                        <div>
                            <v-btn v-if="isAuth" color="primary" @click="addFav(selectedMenuItem)">Favourite</v-btn>
                        </div>
                    </template>
                </Modal>


            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import axios from 'axios';
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'

const baseAPIURL = 'https://eriktest-e9e4a6huaabnakdf.canadacentral-01.azurewebsites.net';

const authStore = useAuthStore();

export default {
    data: () => ({
        menu_items: [],
        isAuth: authStore.isAuthenticated,
        cat_id: 0,
        displayModal: false,
        selectedMenuItem: null,

        // modal msg data props
        modalMessage: "",
        modalMessageStatus: "", // "success" or "error"
    }),
    async created() {
        this.getsetMenuItems(0);
    },
    methods: {
        showMenuDetails(item) {
            this.selectedMenuItem = item; // Set the clicked item as the selected item
            this.displayModal = true; // Open the modal

            this.modalMessage = "";
            this.modalMessageStatus = "";
        },
        async getsetMenuItems(cat_id) {
            try {
                const response = await axios.get(baseAPIURL + '/getMenu', {
                    params: {
                        category_id: cat_id
                    }
                });
                const menuItems = response.data.items.rows

                this.menu_items = menuItems;
            } catch (error) {
                console.error('There was an error getting menu data!', error);
            };
        },
        async addItemToCart(menuItem) {
            try {
                if (this.isAuth) { // logged in cart item add (db)
                    const response = await axios.post(baseAPIURL + '/addCart', {
                        menu_item: menuItem.menu_item_id,
                        cart_id: authStore.getUser.cart_id
                    });
                } else { // logged out cart item add (session store)
                    const cartStore = useCartStore();
                    cartStore.addCartItem(menuItem);
                }
                this.modalMessage = "Item successfully added to cart.";
                this.modalMessageStatus = "success";
                setTimeout(() => {
                    this.displayModal = false;
                }, 1000); // Optionally add a delay
            } catch (error) {
                console.error('There was an error with adding DB cart item!', error);
                this.modalMessage = "Failed to add item to cart.";
                this.modalMessageStatus = "error";
            };
        },
        async addFav(menuItem) {
            try {
                const response = await axios.get(baseAPIURL + '/addFav', {
                    params: {
                        user_id: authStore.getUser.user_id,
                        menu_item: menuItem.menu_item_id
                    }
                });
                this.modalMessage = "Item added to favorites.";
                this.modalMessageStatus = "success";
                setTimeout(() => {
                    this.displayModal = false;
                }, 1000); // Optionally add a delay
            } catch (error) {
                console.error('There was an error with adding DB cart item!', error);
                this.modalMessage = "Failed to add item to favorites.";
                this.modalMessageStatus = "error";
            };
        }
    },
}
</script>