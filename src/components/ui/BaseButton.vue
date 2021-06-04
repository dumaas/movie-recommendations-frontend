<template>
  <button v-if="!link" type="button" class="btn btn-primary">
    <slot></slot>
  </button>
  <router-link v-else :to="to" class="btn btn-primary" role="button">
    <slot></slot>
  </router-link>
</template>

<script>
  export default {
    props: {
      link: {
        type: Boolean,
        required: false,
        default: false,
      },
      to: null
    }
  }
</script>
