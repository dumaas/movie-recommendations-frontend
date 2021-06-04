<template>
  <base-dialog :show="isLoading" title="Loading cool movies..." fixed>
    <base-spinner></base-spinner>
  </base-dialog>
  <form @submit.prevent="submitSearch" class="row g-3 align-items-center">
    <div class="mb-3">
      <input
        type="text"
        class="form-control"
        id="searchText"
        v-model.trim="query"
        placeholder="Search"
        required
      >
    </div>
  </form>
</template>

<script>
  export default {
    data() {
      return {
        query: '',
        isLoading: false,
      }
    },
    methods: {
      async submitSearch() {
        this.isLoading = true

        try {
          await this.$store.dispatch('movies/submitSearch', {query: this.query})
        } catch (error) {
          this.error = error.message || 'Something went wrong!'
        }
        this.$router.push({name: 'search', params: {query: this.query}})
        this.isLoading = false
      },
    },
  }
</script>
