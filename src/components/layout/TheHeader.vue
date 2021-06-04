<template>
  <header>
    <nav class="navbar navbar-dark navbar-expand-md bg-dark">
      <div class="container-fluid">
        <h1 class="navbar-brand" style="letter-spacing: 3px">
          <router-link class="nav-link fs-2 fw-bolder" to="/">Movie Helper</router-link>
        </h1>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNavbar">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse text-right" id="mainNavbar">
          <ul class="navbar-nav ms-auto flex-nowrap">
            <li class="nav-item">
              <router-link class="nav-link m-2 menu-item" to="/movies">Movies</router-link>
            </li>
            <li v-if="isLoggedIn" class="nav-item">
              <router-link class="nav-link m-2 menu-item" to="/ratings">Ratings</router-link>
            </li>
            <li v-if="!isLoggedIn" class="nav-item">
              <router-link class="nav-link m-2 menu-item" to="/login">Login</router-link>
            </li>
            <li v-else class="nav-item">
              <base-button class="nav-link m-2 menu-item" @click="logout">Logout</base-button>
            </li>
          </ul>
        </div>
    </div>
    </nav>
  </header>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    computed: {
      ...mapGetters({
        isLoggedIn: 'isAuthenticated',
      }),
    },
    methods: {
      logout() {
        this.$store.dispatch('logout')
        this.$router.replace('movies')
      },
    }
  }
</script>
