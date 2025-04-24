<script setup lang="ts">
import Navbar from '@/components/Navbar.vue';
import {Toaster} from '@/components/ui/toast';
import Loader from './components/Loader.vue';

</script>

<template>
  <main class="w-full px-4">
    <Navbar />
    <Toaster />
    <RouterView />
    <Loader />
  </main>
</template>

<style scoped>
/* #app {
  width: 100vw;
}
main {
  width: 100%;
} */

</style>
