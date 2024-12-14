<template>
    <header class="bg-primary border-lg pa-1">
        <v-container>
            <v-row justify="center" class="text-center">
                
                
                    <span class="d-flex align-center text-white">
                        353 Brant St &nbsp;&nbsp;
                        <router-link class="text-center text-decoration-none text-secondary" to="/">
                            <img 
                            src="@/assets/luganoTitle.png" 
                            alt="Lugano Pizza Logo" 
                            class="logo-image" 
                            />
                        </router-link>
                        905-637-7474
                    </span>
                    
                
                <div class="position-absolute right-0 d-inline-flex align-center">
                    <p v-if="authStore.isLoggedIn" class="mb-0">Welcome, {{ authStore.getUser.username }}.</p>
                    <router-link v-if="authStore.isLoggedIn && !authStore.isAdmin" to="/profile" class="text-decoration-none px-3 py-2 mx-3 border-lg bg-primary">
                        Profile
                    </router-link>
                    <router-link v-if="!authStore.isAdmin" class="text-decoration-none px-3 py-2 mx-3 border-lg bg-primary" to="/cart">
                        Cart
                    </router-link>
                    <router-link v-if="!authStore.isLoggedIn" class="text-decoration-none px-3 py-2 mx-3 border-lg bg-primary" to="/login">
                        Login
                    </router-link>
                    
                    <v-btn 
                        @click="logout()"
                        v-if="authStore.isLoggedIn"
                        class="px-3 py-2 mx-3 border-lg bg-primary"
                        size="large"
                        variant="tonal"
                    >
                        Logout
                    </v-btn>
                </div>
            </v-row>
            <v-row justify="center" class="text-center">
                <nav class="text-center ma-3">
                        <router-link v-if="authStore.isAdmin" to="/admin/adminsales" class="text-decoration-none px-3 py-2 mx-3 border-lg bg-primary" >
                            Sales</router-link>
                        <router-link v-if="authStore.isAdmin" to="/admin/adminusers" class="text-decoration-none px-3 py-2 mx-3 border-lg bg-primary" >
                            Manage Users</router-link>
                        <router-link v-if="authStore.isAdmin" to="/admin/adminmenu" class="text-decoration-none px-3 py-2 mx-3 border-lg bg-primary" >
                            Admin Menu</router-link>
                        <router-link v-if="authStore.isLoggedIn && !authStore.isAdmin" to="/favourites" class="text-decoration-none px-3 py-2 mx-3 border-lg bg-primary">
                            Favourites</router-link>
                        <router-link v-if="!authStore.isAdmin" to="/menu" class="text-decoration-none px-3 py-2 mx-3 border-lg bg-primary" >
                            Menu</router-link>
                        <router-link v-if="authStore.isLoggedIn && !authStore.isAdmin" to="/orderhistory" class="text-decoration-none px-3 py-2 mx-3 border-lg bg-primary">
                            Order History</router-link>
                        <router-link v-if="!authStore.isAdmin" to="/about" class="text-decoration-none px-3 py-2 mx-3 border-lg bg-primary">
                            About</router-link>
                </nav>
            </v-row>
        </v-container>
    </header>
</template>
  
<script setup>
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const router = useRouter();
const authStore = useAuthStore();

function logout(){
    authStore.logout();
    router.push('/');
}
</script>