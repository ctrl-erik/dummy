<template>
    <v-container>
        <v-toolbar flat>
            <v-toolbar-title class="text-center">Manage Menu</v-toolbar-title>
            <v-btn @click="showCreateForm()" class="px-3 py-2 mx-3 border-lg bg-primary" size="large" variant="tonal">
                Create New
            </v-btn>
        </v-toolbar>
        <v-data-table :headers="headers" :items="menu_items">
            <template v-slot:top>
                <v-toolbar flat class="bg-primary">
                    <div class="d-flex justify-space-evenly flex-grow-1">
                        <v-btn class="bg-white px-3" @click="getsetMenuItems(0)">All Items</v-btn>
                        <v-btn class="bg-white px-3" @click="getsetMenuItems(1)">Classics</v-btn>
                        <v-btn class="bg-white px-3" @click="getsetMenuItems(2)">Combos</v-btn>
                        <v-btn class="bg-white px-3" @click="getsetMenuItems(3)">Drinks/Sides</v-btn>
                    </div>
                </v-toolbar>
            </template>
            <template #item.action="{ item }">
                <v-btn color="primary" icon @click="showEditForm(item)">
                    <v-icon>mdi-pencil</v-icon>
                </v-btn>
                &nbsp;
                <v-btn color="error" icon @click="showDeleteConfirm(item)">
                    <v-icon>mdi-delete</v-icon>
                </v-btn>
            </template>
        </v-data-table>
    </v-container>
    <Modal v-model="displayEditModal" title="Edit Menu Item" :message="modalMessage"
        :messageStatus="modalMessageStatus">
        <div class="d-flex justify-center align-center">
            <v-form @submit.prevent="editMenuItem" class="w-75">
                <v-row>
                    <v-col cols="12" md="12">
                        <v-text-field v-model="menu_item_id" label="ID" placeholder="Menu Item ID"
                            disabled></v-text-field>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12" md="12">
                        <v-text-field v-model="item_name" label="Name" placeholder="Name"></v-text-field>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12" md="12">
                        <v-textarea v-model="desc" label="Description" placeholder="Description"></v-textarea>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12" md="12">
                        <v-text-field v-model="price" label="Price" placeholder="Price"></v-text-field>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12" md="12">
                        <v-text-field v-model="category" label="Category" placeholder="Category ID"></v-text-field>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12" md="12">
                        <v-text-field v-model="fav_count" label="Popularity (fav. count)"
                            placeholder="Popularity"></v-text-field>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12" md="12">
                        <v-text-field v-model="display_img" label="Image" placeholder="Image URL"></v-text-field>
                    </v-col>
                </v-row>
                <v-row>
                    <v-btn class="mb-8" size="large" type="submit" variant="tonal" block>
                        Update
                    </v-btn>
                </v-row>
            </v-form>
        </div>
    </Modal>
    <Modal v-model="displayCreateModal" title="Create Menu Item" :message="modalMessage"
        :messageStatus="modalMessageStatus">
        <div class="d-flex justify-center align-center">
            <v-form @submit.prevent="createMenuItem" class="w-75">
                <v-row>
                    <v-col cols="12" md="12">
                        <v-text-field v-model="item_name" label="Name" placeholder="Name"></v-text-field>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12" md="12">
                        <v-text-field v-model="price" label="Price" placeholder="Price"></v-text-field>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12" md="12">
                        <v-text-field v-model="desc" label="Description" placeholder="Description"></v-text-field>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12" md="12">
                        <v-select v-model="category" label="Category" :items="[1, 2, 3]">
                        </v-select>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12" md="12">
                        <v-text-field v-model="fav_count" label="Popularity (fav. count)"
                            placeholder="Popularity"></v-text-field>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12" md="12">
                        <v-text-field v-model="display_img" label="Image" placeholder="Image URL"></v-text-field>
                    </v-col>
                </v-row>
                <v-row>
                    <v-btn class="mb-8" size="large" type="submit" variant="tonal" block>
                        Create
                    </v-btn>
                </v-row>
            </v-form>
        </div>
    </Modal>
    <Modal v-model="displayDeleteModal" title="Delete Menu Item" :message="modalMessage"
        :messageStatus="modalMessageStatus" @open="" @close="this.confirmDeleteItem = null">
        <p class="text-center">Are you sure you want to delete item {{ confirmDeleteItem?.name }} with ID of {{
            confirmDeleteItem?.menu_item_id }}?</p>
        <template #actions>
            <v-btn class="" color="primary" @click="deleteMenuItem(confirmDeleteItem?.menu_item_id)">Confirm</v-btn>
        </template>
    </Modal>
</template>

<script>
import axios from 'axios';
const baseAPIURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

export default {
    data: () => ({
        menu_items: [],
        headers: [
            { title: 'Menu Item ID', key: 'menu_item_id' },
            { title: 'Name', key: 'name' },
            { title: 'Desc.', key: 'desc' },
            { title: 'Price', key: 'price' },
            { title: 'Category', key: 'category' },
            { title: 'Popularity', key: 'fav_count' },
            { title: "", key: "action", sortable: false }
        ],

        cat_id: 0,

        displayEditModal: false,
        displayDeleteModal: false,
        displayCreateModal: false,
        confirmDeleteItem: null,


        //form bindings
        menu_item_id: '',
        price: '',
        category: '',
        display_img: '',
        fav_count: '',
        item_name: '',
        desc: '',

        // modal msg data props
        modalMessage: "",
        modalMessageStatus: "", // "success" or "error"
    }),
    async created() {
        await this.getsetMenuItems(this.cat_id);
    },
    methods: {
        async showCreateForm() {
            this.resetBindings() // ensure form is empty
            this.displayCreateModal = true; // Open the modal
            // set empty msg
            this.modalMessage = "";
            this.modalMessageStatus = "";
        },
        async createMenuItem() {
            try {
                const response = await axios.post(baseAPIURL + '/createMenuItem', {
                    item_name: this.item_name,
                    price: this.price,
                    desc: this.desc,
                    category: this.category,
                    fav_count: this.fav_count,
                    display_img: this.display_img,
                });
                if (response.data.success == true) {
                    this.menu_items = response.data.updated_menu
                    this.modalMessage = "Item successfully created.";
                    this.modalMessageStatus = "success";
                    setTimeout(() => {
                        this.displayCreateModal = false;
                    }, 1000); // Optionally add a delay
                } else {
                    throw new Error("Failed to update user info, success is false.");
                }
            } catch (error) {
                this.valid = false;
                console.error('Error with updating user info!', error); // Handle error here
                this.modalMessage = "Failed to create item."; // after the create form passed validations and still fails
                this.modalMessageStatus = "error";
            }
        },
        async showEditForm(item) {
            this.displayEditModal = true; // Open the modal
            // set empty msg
            this.modalMessage = "";
            this.modalMessageStatus = "";

            // fill bindings with data
            this.menu_item_id = item.menu_item_id
            this.price = item.price
            this.category = item.category
            this.display_img = item.display_img
            this.item_name = item.name
            this.fav_count = item.fav_count
            this.desc = item.desc

        },
        async editMenuItem() {
            try {
                const response = await axios.post(baseAPIURL + '/updateMenuItem', {
                    item_id: this.menu_item_id,
                    item_name: this.item_name,
                    price: this.price,
                    desc: this.desc,
                    category: this.category,
                    fav_count: this.fav_count,
                    display_img: this.display_img,
                });
                if (response.data.success == true) {
                    this.menu_items = response.data.updated_menu
                    this.modalMessage = "Item successfully updated.";
                    this.modalMessageStatus = "success";
                    setTimeout(() => {
                        this.displayEditModal = false;
                    }, 1000); // add delay to display msg before closing modal
                }
            } catch (error) {
                console.error('Error with updating menu item info!', error);
                this.modalMessage = "Failed to update item.";
                this.modalMessageStatus = "error";
            }
        },
        async showDeleteConfirm(item) {
            this.confirmDeleteItem = item;
            this.displayDeleteModal = true; // Open the modal
        },
        async deleteMenuItem(menu_item_id) {
            try {
                const response = await axios.post(baseAPIURL + '/deleteMenuItem', {
                    menu_item_id: menu_item_id
                });
                if (response.data.success == true) {
                    this.menu_items = response.data.updated_menu
                    this.modalMessage = "Item successfully deleted.";
                    this.modalMessageStatus = "success";
                    setTimeout(() => {
                        this.displayDeleteModal = false;
                    }, 1000); // Optionally add a delay
                }
            } catch (error) {
                console.error('Error with deleting menu item', error); // Handle error here
            }
        },
        async getsetMenuItems(cat_id) {
            try {
                const response = await axios.get(baseAPIURL + '/getAdminMenu', {
                    params: {
                        category_id: cat_id
                    }
                });
                const menuItems = response.data.items.rows

                this.menu_items = menuItems;
            } catch (error) {
                console.error('There was an error getting menu data!', error);
            }
        },
        resetBindings() {
            this.menu_item_id = ''
            this.price = ''
            this.category = ''
            this.display_img = ''
            this.item_name = ''
            this.fav_count = ''
            this.desc = ''
        },
    },

}


</script>