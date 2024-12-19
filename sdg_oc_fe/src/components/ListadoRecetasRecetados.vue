<script setup lang="ts">
import type { RecetaRecetados } from '@/api/entities';
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button';
import { ChevronRightIcon } from '@radix-icons/vue'
import {ref} from 'vue';


const props = defineProps<{
    recetas: RecetaRecetados[]
}>();
const selectedRec = ref(props.recetas[0]);






</script>


<template>
    <div class="panel w-100 flex flew-row h-[100%]">
        <div class="panel-index w-[23%]  p-2 h-[100%]">
            <div v-for="receta in recetas" class="mr-4">
                <div class="panel-inde-item p-2 h-16 flex flex-row justify-between items-center ">
                    <p class="font-light text-sm ">{{ receta.id}}</p>
                    <div class="flex-col  w-[50%]">
                        <p class="font-bold ">{{ receta.fecha.toISOString().split("T")[0] }}</p>
                        <p class="font-light  ">{{receta.tipo}}</p>
                    </div>
                    <Button variant="outline" size="icon" class="bg-transparent hover:bg-gray-200"
                        @click="()=>{selectedRec=receta; console.log(selectedRec)}">
                        <ChevronRightIcon class="w-4 h-4" />
                    </Button>
                </div>
                <Separator class="my-4" />
            </div>
        </div>
        <Separator orientation="vertical" />
        <div class="view w-[75%] h-[100%] px-8 py-4" >
            {{ selectedRec}}
        </div>
    </div>
</template>