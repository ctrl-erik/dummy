<template>
    <v-container fluid fill-height>
    <v-row justify="center" class="text-center">
    <v-col cols="12" md="8">
    <div class="bg-white centered-div border">
    <v-container fluid class="rounded-xl">
        <v-toolbar flat>
            <v-toolbar-title  class="text-center">Favourites</v-toolbar-title>
        </v-toolbar>
        <v-row>
            <v-col
                v-for="(item, index) in favourites"
                :key="index"
                cols="12"
                sm="4"
                md="4"
                >
                <v-card
                    class="text-center"
                    elevation="5"
                    rounded="md">
                    <v-img :src="item.display_img" height="100px"></v-img>

                    <v-card-title>{{ item.name }}</v-card-title>
                    <v-card-subtitle class="color-secondary">{{ item.price }}</v-card-subtitle>

                    <v-card-text>
                        {{ item.desc }}
                    </v-card-text>

                    <v-card-actions>
                        <v-btn @click="removeFav(item.menu_item_id)" color="primary">Remove</v-btn>
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

const authStore = useAuthStore();


export default {
    
    data: () => ({
        headers: [
        { text: 'Item/Combo', value: 'name' },
        { text: 'Price', value: 'price' },
        { text: 'Description', value: 'desc' }
      ],
      favourites: []
    }),
    methods:{
        async removeFav(item_id){
            
        }
    },
    async created() {
        try {
            const response = await axios.get('http://localhost:3001/getFav', {
                params: {
                    user_id: authStore.getUser.user_id
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
}
</script>