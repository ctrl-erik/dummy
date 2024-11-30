<template>
    <v-container fluid fill-height>
    <v-row justify="center" class="text-center">
      <v-col cols="12" md="8">
        <div class="bg-white centered-div border">
            <v-container fluid class="rounded-xl">
                <v-toolbar flat>
                    <v-toolbar-title  class="text-center">Menu</v-toolbar-title>
                </v-toolbar>
                <v-toolbar class="d-flex bg-primary">
                    <v-btn class="bg-white mx-5 px-5" @click="getsetMenuItems(0)">All Items</v-btn>
                    <v-btn class="bg-white mx-5 px-5" @click="getsetMenuItems(1)">Classics</v-btn>
                    <v-btn class="bg-white mx-5 px-5" @click="getsetMenuItems(2)">Combos</v-btn>
                    <v-btn class="bg-white mx-5 px-5" @click="getsetMenuItems(3)">Drinks/Sides</v-btn>
                    <v-btn v-if="isAuth" class="bg-white mx-5 px-5" @click="">Customize</v-btn>
                </v-toolbar>
                <v-row>
                    <v-col
                        v-for="(item, index) in menu_items"
                        :key="index"
                        cols="12"
                        sm="4"
                        md="4"
                        >
                        <v-card
                            class=""
                            elevation="5"
                            rounded="md"
                            @click="showMenuDetails(item)">
                            <v-img :src="item.display_img" height="100px"></v-img>

                            <v-card-title>{{ item.name }}</v-card-title>
                            <v-card-subtitle class="color-secondary">$ {{ item.price }}</v-card-subtitle>

                            <v-card-text>
                                {{ item.desc }}
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>
                <!-- Modal -->
                <v-dialog v-model="display_modal" max-width="500">
                    <v-card class="d-flex justify-center align-center">
                        <v-card-title>{{ selectedMenuItem?.name }}</v-card-title>
                        <v-card-subtitle class="color-secondary">$ {{ selectedMenuItem?.price }}</v-card-subtitle>
                        <v-card-text>
                        <v-img :src="selectedMenuItem?.display_img" height="150px"></v-img>
                        <p>{{ selectedMenuItem?.desc }}</p>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn class="position-absolute top-0 right-0" color="primary" @click="closeModal">X</v-btn>
                            <v-btn class="" color="primary" @click="addItemToCart(selectedMenuItem)">Add to Cart</v-btn>
                                <div v-if="isAuth">
                                <v-btn class="" color="primary" @click="addFav(selectedMenuItem)">Favorite</v-btn>
                            </div>
                        </v-card-actions>
                    </v-card>
                </v-dialog>

            </v-container>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios';
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'

const authStore = useAuthStore();

export default {
    data: () => ({
        menu_items: [],
        display_modal: false,
        isAuth: authStore.isAuthenticated,
        selectedMenuItem: null,
        cat_id: 0
    }),
    async created(){
        this.getsetMenuItems(0);
    },
    methods: {
        async getsetMenuItems(cat_id){
            try {
                const response = await axios.get('http://localhost:3001/getMenu', {
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
        showMenuDetails(item) {
            this.selectedMenuItem = item; // Set the clicked item as the selected item
            this.display_modal = true; // Open the modal
        },
        async addItemToCart(menuItem) {
            if(authStore.isLoggedIn){ // logged in cart item add (db)
                try {
                    const response = await axios.post('http://localhost:3001/addCart', {
                        menu_item: menuItem.menu_item_id,
                        cart_id: authStore.getUser.cart_id
                    });
                } catch (error) {
                    console.error('There was an error with adding DB cart item!', error);
                };
            } else { // logged out cart item add (session store)
                try {
                    const cartStore = useCartStore();
                    cartStore.addCartItem(menuItem);
                } catch (error) {
                    console.error('There was an error with adding session store cart item!', error);
                };
            }
           
            // this.display_modal = false; // Close the modal
            // this.selectedMenuItem = null; // Clear the selected item
        },
        async addFav(menuItem) {
           
        },
        closeModal() {
            this.display_modal = false; // Close the modal
            this.selectedMenuItem = null; // Clear the selected item
        },
    },
}


</script>