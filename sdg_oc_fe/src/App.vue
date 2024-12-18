<script setup lang="ts">
import {Button} from '@/components/ui/button'
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
