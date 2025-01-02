<template>
    <div>
        <h2 class="text-center">The payment was successful! Rerouting you to home...</h2>
    </div>
</template>

<script>

export default {
    data: () => ({

    }),
    async created() {
        setTimeout(() => {
            this.$router.push('/');
        }, 4000); // Add a delay to re route to the home page after 4s
    },
    methods: {
    }
}
</script>
