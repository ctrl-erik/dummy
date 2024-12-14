<template>
    <v-card
        class="mx-auto pa-5 mt-5 w-50"
        elevation="5"
        rounded="lg">
        <v-container  class="d-flex justify-center">
            <v-form @submit.prevent="loginSubmit" v-model="valid" class="w-75">
                <h2 class="text-center text-decoration-underline mb-5">Login</h2>
                <v-row>
                    <v-col cols="12" md="12">
                    <v-text-field
                        v-model="email"
                        :rules="emailRules"
                        label="E-mail"
                        placeholder="Email address"
                        autocomplete="email"
                        >
                        </v-text-field>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12" md="12">
                    <v-text-field
                        v-model="pwd"
                        :counter="50"
                        :rules="passRules"
                        label="Password"
                        type="password"
                        autocomplete="current-password"
                        >
                        </v-text-field>
                    </v-col>
                </v-row>
                <v-row>
                    <v-alert
                        class="ma-3"
                        v-model="error"
                        close-label="Close Alert"
                        title="Error"
                        type="error"
                        closable
                        >
                        Email or password incorrect.
                    </v-alert>
                </v-row>    
                <v-row>
                    <v-btn 
                        class="mb-8"
                        size="large"
                        type="submit"
                        variant="tonal" block>
                        Login
                    </v-btn>
                </v-row>
                <v-row>
                    <p class="w-100 text-center">
                        Don't have an account yet?
                        <br />
                        <router-link 
                            to="/signup"
                            class="text-decoration-none text-secondary"
                            >Sign-up.</router-link>
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
      error: false,
      email: '',
      emailRules: [
        value => {
          if (value) return true
          return 'E-mail is requred.'
        },
        value => {
          if (/.+@.+\..+/.test(value)) return true
          return 'E-mail must be valid.'
        },
      ],
      pwd: '',
      passRules: [
        value => {
            if (value) return true
            return 'Password is required.'
        }
        ]
    }),

    methods: {
        async loginSubmit() {
            try {
                const response = await axios.post('http://localhost:3001/login', {
                    email: this.email,
                    pwd: this.pwd
                });
 
                if (response.statusText = "OK"){
                    this.success = true;
                    const user = response.data.user;
                    authStore.login(user); // update state after login info matches
                    this.$router.push('/');
                } else {
                    this.error = true;
                }
            } catch (error) {
                this.valid = false;
                console.error('Error with login!', error); // Handle error here
            }
        },
    }
  }
</script>