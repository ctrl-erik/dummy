<template>
    <v-card class="mx-auto pa-5 mt-5 w-50" elevation="5" rounded="lg">
        <v-container class="d-flex justify-center">
            <v-form ref="form" v-model="valid" @submit.prevent="loginSubmit" class="w-75">
                <h2 class="text-center text-decoration-underline mb-5">Login</h2>
                <v-row>
                    <v-col cols="12" md="12">
                        <v-text-field v-model="email" :rules="emailRules" label="E-mail" placeholder="Email address"
                            autocomplete="email">
                        </v-text-field>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12" md="12">
                        <v-text-field v-model="pwd" :rules="passRules" label="Password" type="password"
                            autocomplete="current-password">
                        </v-text-field>
                    </v-col>
                </v-row>
                <v-row>
                    <v-alert class="ma-3" v-model="message" close-label="Close Alert" :title="messageTitle" :type="messageType" closable>
                        {{ messageContent }}
                    </v-alert>
                </v-row>
                <v-row>
                    <v-btn class="mb-8" size="large" type="submit" variant="tonal" block>
                        Login
                    </v-btn>
                </v-row>
                <v-row>
                    <p class="w-100 text-center">
                        Don't have an account yet?
                        <br />
                        <router-link to="/signup" class="text-decoration-none text-secondary">Sign-up.</router-link>
                    </p>
                </v-row>
            </v-form>
        </v-container>
    </v-card>
</template>


<script>
import axios from 'axios';
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore();

export default {
    data: () => ({
        valid: false,

        message: false,
        messageContent: '',
        messageType: 'error',
        messageTitle: 'Error',

        email: '',
        emailRules: [
            value => !!value || 'Email is required.',
            value => /.+@.+\..+/.test(value) || 'E-mail must be valid.'
        ],
        pwd: '',
        passRules: [
            value => !!value || 'Password is required.'
        ]
    }),

    methods: {
        async loginSubmit() {
            const formValidation = await this.$refs.form.validate();

            if (formValidation.valid){
                try {
                    const response = await axios.post('http://localhost:3001/login', {
                        email: this.email,
                        pwd: this.pwd
                    });
                    
                    if (response.statusText = "OK") {
                        if (response.data.success){
                            this.showMsg("Login credentials valid.", "Success", 'success')

                            const user = response.data.user
                            this.$refs.form.reset()
                            authStore.login(user); // update state after login info matches

                            setTimeout(() => {
                                this.$router.push('/');
                            }, 1000);
                        } else {
                            this.showMsg("Login credentials invalid.", "Invalid", 'error')
                        }
                    } else {
                        this.showMsg("Error with login request.", "Error", 'error')
                    }
                } catch (error) {
                    this.showMsg("Error trying to login user.", "Error", 'error')
                }
            }
        },
        showMsg(content, title, type){
            this.messageContent = content
            this.messageTitle = title
            this.messageType = type
            this.message = true
        }
    }
}
</script>