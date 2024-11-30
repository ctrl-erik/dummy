<template>
    <v-container fluid class="rounded-xl">
        <v-toolbar class="d-flex bg-primary">
            <v-btn class="bg-white mx-5 px-5" @click="getsetMenuItems(0)">All Items</v-btn>
            <v-btn class="bg-white mx-5 px-5" @click="getsetMenuItems(1)">Classics</v-btn>
            <v-btn class="bg-white mx-5 px-5" @click="getsetMenuItems(2)">Combos</v-btn>
            <v-btn class="bg-white mx-5 px-5" @click="getsetMenuItems(3)">Drinks/Sides</v-btn>
        </v-toolbar>
        <v-data-table :hide-default-footer="true" :items="menu_items">
            <template v-slot:top>
                <v-toolbar flat>
                <v-toolbar-title  class="text-center">Manage Menu</v-toolbar-title>
                </v-toolbar>
            </template>
        </v-data-table>
    </v-container>
</template>

<script>                     
import axios from 'axios'; 

export default {
    data: () => ({
        menu_items: [],
        cat_id: 0
    }),
    async created() {
        await this.getsetMenuItems(this.cat_id);
    },
    methods: {
        async getsetMenuItems(cat_id) {
            try {
                const response = await axios.get('http://localhost:3001/getAdminMenu', {
                    params: {
                        category_id: cat_id
                    }
                });
                const menuItems = response.data.items.rows

                this.menu_items = menuItems;
                // const menu_data = response.data.items;
                // this.items = response.data;
                // this.menu_items = menu_data;
            } catch (error) {
                console.error('There was an error getting menu data!', error);
            }
        },
    },
    
}


</script>