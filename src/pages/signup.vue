<template>
    <v-card class="mx-auto pa-5 mt-5 w-50" elevation="5" rounded="lg">
        <v-container class="d-flex justify-center">
            <v-form @submit.prevent="signUpSubmit" v-model="valid" ref="form" class="w-75">
                <h2 class="text-center text-decoration-underline mb-5">Signup</h2>
                <v-row>
                    <v-col cols="12" md="12">
                        <v-text-field v-model="username" :rules="usernameRules" :counter="20" label="Username"
                            placeholder="Enter username"></v-text-field>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12" md="12">
                        <v-text-field v-model="email" :rules="reactiveEmailRules" label="E-mail" placeholder="Email address"
                            @blur="checkEmailAvailability"></v-text-field>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12" md="12">
                        <v-text-field v-model="phone" :rules="phoneRules" label="Phone" placeholder="Phone number"
                            ></v-text-field>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12" md="12">
                        <v-text-field v-model="pwd" :counter="20" :rules="passRules" label="Password"
                            ></v-text-field>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12" md="12">
                        <v-text-field v-model="confirm_pwd" :counter="20" :rules="confirmRules" label="Confirm Password"
                            ></v-text-field>
                    </v-col>
                </v-row>
                <v-row>
                    <v-alert class="ma-3" v-model="success" close-label="Close Alert" title="Success" type="success"
                        closable>
                        Successfully created user account. Redirecting...
                    </v-alert>
                    <v-alert class="ma-3" v-model="error" close-label="Close Alert" title="Error" type="error" closable>
                        Issue with creating account.
                    </v-alert>
                </v-row>
                <v-row>
                    <v-btn class="mb-8" size="large" type="submit" variant="tonal" block>
                        Sign-up
                    </v-btn>
                </v-row>
                <v-row>
                    <p class="w-100 text-center">
                        Already have an account?
                        <br />
                        <router-link to="/login" class="text-decoration-none text-secondary">Log-in.</router-link>
                    </p>
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
            value => !!value || 'Username is required.',
        ],
        email: '',
        phone: '',
        phoneRules: [
            value => !!value || 'Phone number is required.',
            value => /^\+?[1-9]\d{1,14}$/.test(value) || 'Phone number must be valid.'
        ],
        pwd: '',
        passRules: [
            value => !!value || 'Password is required.',
            value => value?.length >= 10 || 'Password must be more than 10 characters.'
        ],
        confirm_pwd: '',
        confirmRules: [
            value => !!value || 'Password confirm is required.',
            value => (value?.length >= 10) || 'Password must be more than 10 characters.',
            value => (value === this.pwd) || 'Password must match.'
        ]
    }),
    computed: {
        reactiveEmailRules(){
            return [
                value => !!value || 'E-mail is required.',
                value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || 'E-mail must be valid.',
                value => !this.emailTaken || 'This email is already in use.'
            ]
        },
    },
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
            const isValid = this.$refs.form.validate();

            if (isValid) {
                // Proceed with sign-up logic
                try {
                    const response = await axios.post('http://localhost:3001/signup',
                        {
                            username: this.username,
                            email: this.email,
                            phone: this.phone,
                            pwd: this.pwd,
                            emails: this.activeEmails
                        });
                    if (response.statusText = "OK") {
                        this.success = true;

                        setTimeout(() => {
                            this.$router.push('/login');
                        }, 2000);
                    } else {
                        this.error = true;
                    }

                } catch (error) {
                    this.valid = false;
                    console.error('There was an error!', error); // Handle error here
                }

                this.success = true;
                this.error = false;
            } else {
                this.success = false;
                this.error = true;
            }            
        },
    },
}
</script>