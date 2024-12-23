<script setup lang="ts">
import Navbar from '@/components/Navbar.vue'
</script>

<template>
  <main>
    <Navbar />
    <RouterView />
  </main>
</template>

<style scoped>
main{
  width: 100%;
}

</style>
