
<script setup lang="ts">
    import { useLoaderStore } from '@/stores/LoaderStore';
    import { computed } from 'vue';
    
    const loader = useLoaderStore();
    const visible = computed(() => loader.loading);
</script>



<template>
  <div v-if="visible" class="absolute w-screen  inset-0 h-screen flex flex-col items-start justify-center bg-white  ">
  <div class="absolute  inset-0 h-[40rem] flex flex-col items-center justify-center bg-white  ">
  <div class="flex items-center justify-center h-full flex-col w-full">
    <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-500"></div>
    <span class=" mt-4  text-gray-500 font-extralight fon  text-lg ">Cargando ...</span>
  </div>
  </div>
  </div>
</template>


