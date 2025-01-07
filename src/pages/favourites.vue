<template>
    <v-container fluid fill-height>
        <v-row justify="center" class="text-center">
            <v-col cols="12" md="8">
                <div class="bg-white centered-div border">
                    <v-container fluid class="rounded-xl">
                        <v-toolbar flat>
                            <v-toolbar-title class="text-center">Favourites</v-toolbar-title>
                        </v-toolbar>
                        <v-row>
                            <v-col v-for="(item, index) in favourites" :key="index" cols="12" sm="4" md="4">
                                <v-card class="text-center" elevation="5" rounded="md">
                                    <v-img :src="item.display_img" height="100px"></v-img>

                                    <v-card-title>{{ item.name }}</v-card-title>
                                    <v-card-subtitle class="color-secondary">{{ item.price }}</v-card-subtitle>

                                    <v-card-text>{{ item.desc }}</v-card-text>

                                    <v-card-actions>
                                        <v-btn @click="removeFav(item)" color="primary">Remove</v-btn>
                                        <v-btn class="absolute right-0" @click="addFavToCart(item)" color="primary">add
                                            to cart</v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-col>
                        </v-row>
                    </v-container>
                </div>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import { useAuthStore } from '@/stores/auth'
import axios from 'axios';

const baseAPIURL = 'https://eriktest-e9e4a6huaabnakdf.canadacentral-01.azurewebsites.net';

const authStore = useAuthStore();

export default {

    data: () => ({
        headers: [
            { title: 'Item/Combo', key: 'name' },
            { title: 'Price', key: 'price' },
            { title: 'Description', key: 'desc' }
        ],
        favourites: []
    }),
    methods: {
        async removeFav(menuItem) {
            try {
                const response = await axios.get(baseAPIURL + '/deleteFav', {
                    params: {
                        user_id: authStore.getUser.user_id,
                        menu_item: menuItem.menu_item_id
                    }
                });
                await this.getFavourites(authStore.getUser.user_id);
            } catch (error) {
                console.error('There was an error with adding DB cart item!', error);
            };
        },
        async getFavourites(user_id) {
            try {
                const response = await axios.get(baseAPIURL + '/getFav', {
                    params: {
                        user_id: user_id
                    }
                });

                this.favourites = response.data.rows;
                // const items_data = response.data.items;
                // this.items = response.data;
                // this.favourites = items_data
            } catch (error) {
                console.error('There was an error getting favourites data!', error);
            }
        },
        async addFavToCart(favItem) {
            try {
                const response = await axios.post(baseAPIURL + '/addCart', {
                    menu_item: favItem.menu_item_id,
                    cart_id: authStore.getUser.cart_id
                });
            } catch (error) {
                console.error('There was an error with adding Favourite to cart!', error);
            };
        },

    },
    async created() {
        try {
            this.getFavourites(authStore.getUser.user_id)
        } catch (error) {
            console.error('There was an error getting initial favourites data!', error);
        }
    },
}
</script>