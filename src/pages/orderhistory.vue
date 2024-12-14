<template>
    <v-container>
        <v-data-table
            v-if="orders"
            :headers="headers"
            :items="orders"
        >
        <!-- Custom v-data-table rows for onclick event (show details) -->
        <template v-slot:body="{ items }">
            <tr
                v-for="order in items"
                :key="order.order_id"
                @click="showOrderDetails(order)"
            >
                <td>{{ order.order_id }}</td>
                <td>{{ order.total_cost }}</td>
                <td>{{ order.order_date }}</td>
            </tr>
        </template>
            <template v-slot:top>
                <v-toolbar flat>
                    <v-toolbar-title class="text-center">User Order History</v-toolbar-title>
                </v-toolbar>
            </template>
             <!-- Scoped slot to format "Total Cost" column -->
            <template v-slot:cell.total_cost="orders">
                <div class="d-flex justify-center">${{ orders.item.total_cost }}</div>
            </template>
        </v-data-table>
    </v-container>
</template>

<script>
    import axios from 'axios';
    import { useAuthStore } from '@/stores/auth'

    const authStore = useAuthStore();

    export default {
        data: () => ({
            orders: [],
            headers: [
                { title: 'Order ID', key: 'order_id' },
                { title: 'Total Cost', key: 'total_cost' },
                { title: 'Time', key: 'order_date' }
            ],
        }),
        methods:{
            async showOrderDetails(order){
                
                try {
                const response = await axios.get('http://localhost:3001/getOrderItems', {
                    params: {
                        order_id: order.order_id
                    }
                }); 
                this.orders = response.data.orders
            } catch (error) {
                console.error('There was an error getting user order items!', error);
            }
            }
        },
        async created() {
            try {
                const response = await axios.get('http://localhost:3001/getUserOrders', {
                    params: {
                        user_id: authStore.getUser.user_id
                    }
                }); 
                this.orders = response.data.orders
            } catch (error) {
                console.error('There was an error getting user orders!', error);
            }
        },
    }
</script>