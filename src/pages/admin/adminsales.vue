<template>
    <v-container>
        <v-data-table v-if="sales" :headers="headers" :items="sales" class="">
            <template v-slot:top>
                <v-toolbar flat>
                    <v-toolbar-title class="text-center">Lugano Sales</v-toolbar-title>
                </v-toolbar>
            </template>
            <!-- Scoped slot to format "Total Cost" column -->
            <template v-slot:cell.total_cost="sales">
                <div class="d-flex justify-center">${{ sales.item.total_cost }}</div>
            </template>
        </v-data-table>
    </v-container>
</template>

<script>
import axios from 'axios';
const baseAPIURL = 'https://eriktest-e9e4a6huaabnakdf.canadacentral-01.azurewebsites.net';

export default {
    data: () => ({
        sales: [],
        headers: [
            { title: 'Order ID', key: 'order_id' },
            { title: 'User ID', key: 'user_id' },
            { title: 'Total Cost', key: 'total_cost' },
            { title: 'Time', key: 'order_date' }
        ],
    }),
    async created() {
        try {
            const response = await axios.get(baseAPIURL + '/getOrders');
            this.sales = response.data.rows
        } catch (error) {
            console.error('There was an error getting user orders!', error);
        }
    },
}
</script>