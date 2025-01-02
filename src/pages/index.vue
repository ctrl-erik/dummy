<template>
    <div class="home">
        <div class="text-center">
            <br />
            <template v-if="isAdmin">
                <p>Welcome, Admin! Manage the system from this dashboard.</p>
                <p>This admin account has access to view placed orders, manage users, and full CRUD on the menu items.
                </p>

            </template>
            <template v-else-if="isAuth">
                <p>Welcome back! As a logged in user you can check out your order history, view your favourite menu
                    items, or explore the <RouterLink to="/menu">menu</RouterLink>.</p>
            </template>
            <template v-else>
                <p>We are a pizza shop located at 353 Brant Street, at the heart of downtown Burlington, Ontario.</p>
                <p>
                    <RouterLink to="/login">Login</RouterLink>, or <RouterLink to="/signup">create an account
                    </RouterLink>, to get features like favourited menu items, order history, and save user information.
                </p>
                <img src="@/assets/lugano-pizza-burlington.jpg" alt="Lugano Pizza Logo" class="mt-5" />
            </template>
        </div>
    </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore();

export default {
    data: () => ({
        isAuth: false,
        isAdmin: false,
    }),
    created() {
        this.isAuth = authStore.isLoggedIn
        this.isAdmin = authStore.isAdmin
    },
    methods: {
    }
}
</script>
