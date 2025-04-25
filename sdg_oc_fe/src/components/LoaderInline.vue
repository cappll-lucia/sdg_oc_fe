
<script setup lang="ts">

</script>



<template>
  <div class="flex flex-col items-center justify-center bg-white  ">
    <div class="dots-loader flex items-center justify-center">
       <div class="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-gray-500"></div>
    </div>
  </div>
</template>


<style scoped>
.dots-loader {
  display: flex;
  gap: 8px;
  height: 1rem;
}

.dots-loader span {
  width: 6px;
  height: 6px;
  background-color: #000;
  border-radius: 50%;
  animation: bounce 1.3s infinite ease-in-out;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
    /* width: 10px; */
    /* height: 10px; */
  }
} 
</style>
