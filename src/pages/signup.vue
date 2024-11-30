<template>
    <v-card
        class="mx-auto pa-5 mt-5 w-50"
        elevation="5"
        rounded="lg">
        <v-container  class="d-flex justify-center">
        <v-form @submit.prevent="signUpSubmit" v-model="valid" class="w-75">
            <h2 class="text-center text-decoration-underline">Signup</h2>
                <v-row>
                    <v-col cols="12" md="8">
                    <v-text-field
                        v-model="username"
                        :rules="usernameRules"
                        label="Username"
                        placeholder="Enter username"
                        required
                    ></v-text-field>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12" md="12">
                    <v-text-field
                        v-model="email"
                        :rules="emailRules"
                        label="E-mail"
                        placeholder="Email address"
                        @blur="checkEmailAvailability"
                        required
                    ></v-text-field>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12" md="8">
                    <v-text-field
                        v-model="phone"
                        :rules="phoneRules"
                        label="Phone"
                        placeholder="Phone number"
                        required
                    ></v-text-field>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12" md="12">
                    <v-text-field
                        v-model="pwd"
                        :counter="20"
                        :rules="passRules"
                        label="Password"
                        required
                    ></v-text-field>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12" md="12">
                    <v-text-field
                        v-model="confirm_pwd"
                        :counter="20"
                        label="Confirm Password"
                        required
                    ></v-text-field>
                    </v-col>
                </v-row>
                <v-row>
                    <v-alert
                        class="ma-3"
                        v-model="success"
                        close-label="Close Alert"
                        title="Success"
                        type="success"
                        closable
                        >
                        Successfully created user account.
                    </v-alert>
                    <v-alert
                        class="ma-3"
                        v-model="error"
                        close-label="Close Alert"
                        title="Error"
                        type="error"
                        closable
                        >
                        Issue with creating account.
                    </v-alert>
                </v-row>
                <v-row>
                    <v-btn 
                        class="mb-8"
                        size="large"
                        type="submit"
                        variant="tonal" block>
                        Sign-up
                    </v-btn>
                </v-row>
                <v-row>
                    <p class="w-100 text-center">
                        Already have an account?
                        <br />
                        <router-link 
                            to="/login"
                            class="text-decoration-none text-secondary" 
                            >Log-in.</router-link>
                    </p>
                    <v-alert v-if="emailTaken" type="error">This email is already in use</v-alert>
                </v-row>
        </v-form>
    </v-container>
</v-card>
</template>

<script>
import axios from 'axios';

export default {
    data: () => ({
        emailTaken: false,
        activeEmails: [],
        valid: false,
        success: false,
        error: false,
        username: '',
        usernameRules: [
        value => {
            if (value) return true    

            return 'Username is required.'
        }
        ],
        email: '',
        emailRules: [
            value => {
                if (value) return true
                return 'E-mail is required.'
            },
            value => {
                if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return true
                return 'E-mail must be valid.'
            }
        ],
        phone: '',
        phoneRules: [
            value => {
            if (value) return true
            return 'Phone is required.'
            },
            value => {
                const phoneRegex = /^\+?[1-9]\d{1,14}$/; // Basic E.164 format (international standard)
                if (phoneRegex.test(value)) return true
                return 'Phone number must be valid.'
            }
        ],
        pwd: '',
        passRules: [
            value => {
                if (value) return true

                return 'Password is required.'
            },
            value => {
                if (value?.length >= 10) return true

                return 'Password must be more than 10 characters.'
            }
        ],
        confirm_pwd: '',
        confirmRules: [
            value => {
                if (value) return true
                return 'Password confirm is required.'
            },
            value => {
                if (value?.length >= 10) return true
                return 'Password must be more than 10 characters.'
            },
            value => {
                if (value == this.pwd) return true
                return 'Password must match.'
            }
        ],
    }),
    methods: {
        async checkEmailAvailability() {
            if (!this.email || !/.+@.+\..+/.test(this.email)) {
                return; // Skip validation if the email is empty or invalid
            }

            try {
                const response = await axios.post('http://localhost:3001/checkEmail', { email: this.email });
                this.emailTaken = response.data.exists;
            } catch (error) {
                console.error('Error checking email availability:', error);
            }
        },
        async signUpSubmit() {
            try {
                const response = await axios.post('http://localhost:3001/signup',
                {
                    username: this.username,    
                    email: this.email,
                    phone: this.phone,
                    pwd: this.pwd,
                    emails: this.activeEmails
                });
                
                if (response.statusText = "OK"){
                    this.success = true;
                    this.$router.push('/login');
                } else {
                    this.error = true;
                }
                
            } catch (error) {
                this.valid = false;
                console.error('There was an error!', error); // Handle error here
            }
        },
    },
}
</script>