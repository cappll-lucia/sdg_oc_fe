<script setup lang="ts">
import type { RecetaContacto } from '@/api/entities';
import { ref } from 'vue';


const props = defineProps<{
    recetas: RecetaContacto[];
}>();
const selectedRec = ref(props.recetas[0]);






</script>


<template>
    <div class="panel w-100 flex flew-row h-[100%]">
        {{ JSON.stringify(selectedRec) }}
    </div>
</template>