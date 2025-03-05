<script setup lang="ts">
import Navbar from '@/components/Navbar.vue';
import {Toaster} from '@/components/ui/toast';
</script>

<template>
  <main>
    <Navbar />
    <Toaster />
    <RouterView />
  </main>
</template>

<style scoped>
main{
  width: 100%;
}

</style>
