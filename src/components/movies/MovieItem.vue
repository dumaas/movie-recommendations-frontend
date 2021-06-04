<template>
  <li class="mb-4">
    <router-link :to="movieDetailsLink" :id="id" :title="title"><img :src="image"></router-link>
    <p class="fs-4" v-if="rating">Your Rating: {{ rating }}</p>
  </li>
</template>

<script>
  export default {
    props: ['id', 'title', 'date', 'image', 'to', 'rating'],
    computed: {
      movieDetailsLink() {
        return '/movies/' + this.id
      },
    },
  }
</script>

<style scoped>
</style>
