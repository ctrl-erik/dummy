<template>
    <v-container>
    <v-data-table 
        v-if="users" 
        :headers="headers" 
        :items="users">
        <template v-slot:top>
            <v-toolbar flat>
                <v-toolbar-title class="text-center">Manage Users</v-toolbar-title>
            </v-toolbar>
        </template> 
        <template #item.action="{ item }">
            <v-btn
                color="primary"
                icon
                @click="showUserEdit(item)"
                >
                <v-icon>mdi-pencil</v-icon>
            </v-btn>
            &nbsp;
            <v-btn
                color="error"
                icon
                @click="showDeleteConfirm(item)"
                >
                <v-icon>mdi-delete</v-icon>
            </v-btn>
        </template>
    </v-data-table>
  </v-container>
  <Modal
    v-model="displayEditModal"
    title="Edit User"
    :message="modalMessage"
    :messageStatus="modalMessageStatus"
    >
    <div class="d-flex justify-center align-center">
        <v-form @submit.prevent="updateUser" class="w-75">
            <v-row>
                <v-col cols="12" md="12">
                <v-text-field
                    v-model="user_id"
                    label="User ID"
                    placeholder="User ID"
                    disabled
                ></v-text-field>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" md="12">
                <v-text-field
                    v-model="username"
                    label="Username"
                    placeholder="Username"
                ></v-text-field>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" md="12">
                <v-text-field
                    v-model="email"
                    label="E-mail"
                    placeholder="Email address"
                ></v-text-field>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" md="12">
                <v-text-field
                    v-model="phone"
                    label="Phone"
                    placeholder="Phone number"
                ></v-text-field>
                </v-col>
            </v-row> 
            <v-row>
                <v-btn 
                    class="mb-8"
                    size="large"
                    type="submit"
                    variant="tonal" block>
                    Update
                </v-btn>
            </v-row>
        </v-form>
    </div>
  </Modal>
    <Modal
        v-model="displayDeleteModal"
        title="Delete User"
        :message="modalMessage"
        :messageStatus="modalMessageStatus"
        @open=""
        @close="this.confirmDeleteItem = null"
        >
        <p class="text-center">Are you sure you want to delete user {{ confirmDeleteItem?.username }} with ID of {{ confirmDeleteItem?.user_id }}?</p>
        <template #actions>
            <v-btn class="" color="primary" @click="deleteUser(confirmDeleteItem?.user_id)">Confirm</v-btn>
        </template>
    </Modal>
</template>

<script>
    import axios from 'axios';

    export default {
        data: () => ({
            users: [],
            headers: [
                { title: 'User ID', key: 'user_id' },
                { title: 'Username', key: 'username' },
                { title: 'Email', key: 'email' },
                { title: 'Phone', key: 'phone' },
                { title: "", key: "action", sortable: false }
            ],
            displayEditModal: false,
            displayDeleteModal: false,
            confirmDeleteItem: null,
            // form bindings
            user_id: '',
            username: '',
            email: '',
            phone: '',

            // modal msg data props
            modalMessage: "",
            modalMessageStatus: "", // "success" or "error"
        }),
        async created() {
            try {
                const response = await axios.get('http://localhost:3001/users');

                this.users = response.data.rows
            } catch (error) {
                console.error('There was an error getting user data!', error);
            }
        },
        methods: {
            async showDeleteConfirm(user){
                this.displayDeleteModal = true; // Open the modal
                this.confirmDeleteItem = user;
                //Show delete confirmation and preview the information
                
                this.modalMessage = "";
                this.modalMessageStatus = "";
            },
            async deleteUser(user_id) {
                try {
                    const response = await axios.post('http://localhost:3001/deleteUser', {
                        user_id: user_id
                    });
                    this.users = response.data.users
                    this.modalMessage = "User successfully deleted.";
                    this.modalMessageStatus = "success";
                    setTimeout(() => {
                        this.displayDeleteModal = false;
                    }, 1000); // Optionally add a delay
                } catch (error) {
                    console.error('Error with deletin user', error); // Handle error here
                    this.modalMessage = "Failed delete user.";
                    this.modalMessageStatus = "error";
                }
            },
            async updateUser() {
                try {
                    const response = await axios.post('http://localhost:3001/updateUser', {
                        user_id: this.user_id,
                        username: this.username,
                        email: this.email,
                        phone: this.phone
                    });
                    if (response.data.success == true){
                        this.users = response.data.updated_users
                        this.modalMessage = "User successfully updated.";
                        this.modalMessageStatus = "success";
                        setTimeout(() => {
                            this.displayEditModal = false;
                        }, 1000); // add delay to display msg before closing modal
                    }
                    
                } catch (error) {
                    console.error('Error with updating user info!', error);
                    this.modalMessage = "Failed to update user.";
                    this.modalMessageStatus = "error";
                }            
            },
            async showUserEdit(user){
                this.displayEditModal = true; // Open the modal
                // fill bindings with data
                this.user_id = user.user_id,
                this.username = user.username,
                this.email = user.email,
                this.phone = user.phone

                this.modalMessage = "";
                this.modalMessageStatus = "";
            },
        }
    }
</script>