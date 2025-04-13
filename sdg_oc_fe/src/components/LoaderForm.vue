
<script setup lang="ts">

</script>



<template>
  <div class="flex flex-col items-center justify-center bg-white  ">
    <div class="dots-loader">
      <span v-for="n in 5" :key="n" :style="{ animationDelay: `${(n - 1) * 0.1}s` }" />
    </div>
    <span class=" font-bold text-sm">Cargando ...</span>
  </div>
</template>


<style scoped>
.dots-loader {
  display: flex;
  gap: 8px;
  height: 1.5rem;
}

.dots-loader span {
  width: 8px;
  height: 8px;
  background-color: #000;
  border-radius: 50%;
  animation: bounce 1.3s infinite ease-in-out;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-15px);
    /* width: 10px; */
    /* height: 10px; */
  }
} 
</style>
