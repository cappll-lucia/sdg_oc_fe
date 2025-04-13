
<script setup lang="ts">
    import { useLoaderStore } from '@/stores/LoaderStore';
    import { computed } from 'vue';
    
    const loader = useLoaderStore();
    const visible = computed(() => loader.loading);
</script>



<template>
  <div v-if="visible" class="absolute  inset-0 top-[64px] h-[150vh] flex flex-col items-start justify-center bg-white  ">
  <div class="absolute  inset-0 h-[40rem] flex flex-col items-center justify-center bg-white  ">
    <div class="dots-loader">
      <span v-for="n in 5" :key="n" :style="{ animationDelay: `${(n - 1) * 0.1}s` }" />
    </div>
    <span class=" font-bold text-lg">Cargando ...</span>
  </div>
  </div>
</template>


<style scoped>
.dots-loader {
  display: flex;
  gap: 8px;
  height: 2.5rem;
}

.dots-loader span {
  width: 10px;
  height: 10px;
  background-color: #000;
  border-radius: 50%;
  animation: bounce 1.1s infinite ease-in-out;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-30px);
    width: 15px;
    height: 15px;
  }
} 
</style>
