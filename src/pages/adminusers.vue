<template>
    <v-container>
    <v-data-table v-if="users" :headers="headers" :items="users">
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title  class="text-center">Manage Users</v-toolbar-title>
        </v-toolbar>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
    import axios from 'axios';

    export default {
        data: () => ({
            users: [],
            headers: [
                { text: 'User ID', value: 'user_id' },
                { text: 'Type ID', value: 'type_id' },
                { text: 'Email', value: 'email' },
                { text: 'Phone', value: 'phone' },
                { text: 'Password', value: 'pwd' },
                { text: 'Username', value: 'username' }
            ],
        }),
        async created() {
            try {
                const response = await axios.get('http://localhost:3001/users');

                // const items_data = response.data.items;
                // // this.items = response.data;
                // this.items = items_data
                this.users = response.data.rows
            } catch (error) {
                console.error('There was an error getting user data!', error);
            }
        },
    }
</script>