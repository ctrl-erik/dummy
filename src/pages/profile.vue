<template>
    <v-container class="w-50">
        <v-toolbar flat>
            <v-toolbar-title class="text-center">{{ display_username }}'s User Profile</v-toolbar-title>
        </v-toolbar>
        <div class="d-flex justify-center align-center">
            <v-form @submit.prevent="updateProfile" v-model="valid" class="mt-5 w-75">
                <v-row>
                    <v-col cols="12" md="12">
                        <v-text-field v-model="type_id" label="Type" placeholder="Account Type" disabled></v-text-field>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12" md="12">
                        <v-text-field v-model="username" label="Username" placeholder="Username"></v-text-field>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12" md="12">
                        <v-text-field v-model="email" label="E-mail" placeholder="Email address"></v-text-field>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12" md="12">
                        <v-text-field v-model="phone" label="Phone" placeholder="Phone number"></v-text-field>
                    </v-col>
                </v-row>
                <v-row>
                    <v-btn class="mb-8" size="large" type="submit" variant="tonal" block>
                        Update
                    </v-btn>
                </v-row>
            </v-form>
        </div>
    </v-container>
</template>

<script>
import axios from 'axios';

import { useAuthStore } from '@/stores/auth'
const authStore = useAuthStore();
const user = authStore.getUser;
const baseAPIURL = 'https://eriktest-e9e4a6huaabnakdf.canadacentral-01.azurewebsites.net';

export default {
    data: () => ({
        valid: false,
        display_username: user.username,
        user_id: user.user_id,
        type_id: user.type_id,
        email: user.email,
        phone: user.phone,
        username: user.username
    }),
    methods: {
        async updateProfile() {
            try {
                const response = await axios.post(baseAPIURL + '/updateProfile', {
                    user_id: authStore.getUser.user_id,
                    email: this.email,
                    phone: this.phone,
                    username: this.username
                });
                const updatedUser = response.data.updated_user
                authStore.login(updatedUser); // update state after user update
            } catch (error) {
                console.error('There was an error with updating profile!', error);
            };
        }
    }
}
</script>