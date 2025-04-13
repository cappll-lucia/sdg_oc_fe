<script setup lang="ts">
import Navbar from '@/components/Navbar.vue';
import {Toaster} from '@/components/ui/toast';
import Loader from './components/Loader.vue';
</script>

<template>
  <main>
    <Navbar />
    <Toaster />
    <RouterView />
    <Loader />
  </main>
</template>

<style scoped>
main{
  width: 100%;
}

</style>
