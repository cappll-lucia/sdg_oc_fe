<script setup lang="ts">
import type { RecetaRecetados } from '@/api/entities';
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button';
import { ChevronRightIcon } from '@radix-icons/vue'
import {ref} from 'vue';
import ItemDetalleReceta from '@/components/ItemDetalleReceta.vue'


const props = defineProps<{
    recetas: RecetaRecetados[]
}>();
const selectedRec = ref(props.recetas[0]);






</script>


<template>
    <div class="panel w-100 flex flew-row h-[100%]">
        <div class="panel-index w-[23%]  p-2 h-[100%]">
            <div v-for="receta in recetas" class="mr-4">
                <div class="panel-inde-item px-2 py-6 h-16 flex flex-row justify-between items-center rounded-sm"
                    :class="{ 'bg-[#d7e5ec]': selectedRec === receta }">
                    <p class="font-light text-sm ">{{ receta.id}}</p>
                    <div class="flex-col  w-[50%]">
                        <p class="font-bold ">{{ receta.fecha.toISOString().split("T")[0] }}</p>
                        <p class="font-light  ">{{receta.tipo}}</p>
                    </div>
                    <Button variant="outline" size="icon" class="bg-transparent hover:bg-[#d7e5ec]"
                        @click="()=>{selectedRec=receta; console.log(selectedRec)}">
                        <ChevronRightIcon class="w-4 h-4" />
                    </Button>
                </div>
                <Separator class="my-2" />
            </div>
        </div>
        <Separator orientation="vertical" />
        <div class="view w-[75%] h-[100%] px-8">
            <div class="datos flex flex-col" v-if="selectedRec">
                <div class="flex flex-row justify-between">
                    <div class="flex flex-col ">
                        <span class="text-lg font-bold">Tipo Receta: </span>
                        <span>{{selectedRec.tipo}}</span>
                    </div>
                    <div class="flex flex-col ">
                        <span class="text-lg font-bold w-[10rem]">Fecha Receta: </span>
                        <span>{{selectedRec.fecha.toISOString().split("T")[0]}}</span>
                    </div>
                </div>
            </div>
            <Separator class="my-6" />

            <div v-if="selectedRec?.tipo=='Anteojo Lejos' ">
                <ItemDetalleReceta :receta="selectedRec" title="Lejos" />
            </div>
            <div v-else-if="selectedRec?.tipo == 'Anteojo Cerca'">
                <ItemDetalleReceta :receta="selectedRec" title="Cerca" />
            </div>
            <div v-else-if="selectedRec?.tipo == 'Multifocal'">
                <ItemDetalleReceta :receta="selectedRec" title="Cerca" />
                <Separator class="my-8" />
                <ItemDetalleReceta :receta="selectedRec" title="Lejos" />
            </div>
            <div v-else-if="selectedRec?.tipo == 'Bifocal'">
                <ItemDetalleReceta :receta="selectedRec" title="Cerca" />
                <Separator class="my-8" />
                <ItemDetalleReceta :receta="selectedRec" title="Lejos" />
            </div>

            <Separator class="my-8" />

            <div class="datos flex flex-col" v-if="selectedRec">
                <div class="flex flex-row justify-between ">
                    <div class="flex flex-col w-[12rem]">
                        <span class="text font-bold ">Cristal: </span>
                        <span>{{ selectedRec.cristal ?? '--' }}</span>
                    </div>
                    <div class="flex flex-col  w-[12rem]">
                        <span class="text font-bold ">Color: </span>
                        <span>{{ selectedRec.color ?? '---' }}</span>
                    </div>
                    <div class="flex flex-col  w-[12rem]">
                        <span class="text font-bold">Tratamiento: </span>
                        <span>{{ selectedRec.tratamiento ?? '--' }}</span>
                    </div>
                </div>
                <div class="flex flex-col items-start mt-6">
                    <span class="text font-bold">Observaciones: </span>
                    <span>{{ selectedRec.observaciones ?? '--' }}</span>
                </div>
            </div>
        </div>
    </div>
</template>