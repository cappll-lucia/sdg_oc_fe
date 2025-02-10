<script setup lang="ts">
import type {  RecetaRecetados } from '@/api/entities';
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button';
import { ChevronRightIcon, DownloadIcon } from '@radix-icons/vue'
import {ref} from 'vue';
import ItemDetalleReceta from '@/components/ItemDetalleRecetaRecetados.vue'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { generateRecetasRecetadosPDF } from '@/lib/utils';


const props = defineProps<{
    recetas: RecetaRecetados[],
    nombreCliente: string
}>();
const currentRec = ref(props.recetas[0]);
const selectedToPrint = ref<RecetaRecetados[]>([])

const handleCheckboxChange = (receta: RecetaRecetados) => {
    const index = selectedToPrint.value.findIndex((selected) => selected.id === receta.id);
    index !== -1 
        ? selectedToPrint.value.splice(index, 1)
        : selectedToPrint.value.push(receta);
};

const printRecetas = () => {
    if (selectedToPrint.value.length === 0) {
        alert("Por favor, selecciona al menos una receta para imprimir.");
        return;
    }
    generateRecetasRecetadosPDF(selectedToPrint.value, props.nombreCliente)
};


</script>


<template>
    <div class="panel w-100 flex flew-row h-[100%]">
        <div class="panel-index w-[23%]  p-2 pt-0 h-[100%]">
            <div class="flex justify-end mr-2">
                <Dialog>
                    <DialogTrigger as-child>
                        <Button  variant="outline" class="bg-transparent hover:bg-[#d7e5ec]">
                            Imprimir
                            <DownloadIcon class="w-4 h-4" />
                        </Button>
                    </DialogTrigger>
                    <DialogContent class="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Imprimir Recetas Anteojos Recetados</DialogTitle>
                            <DialogDescription>
                                Cliente: {{ nombreCliente }}
                            </DialogDescription>
                        </DialogHeader>
                        <div class="flex flex-col items-start justify-center ">
                            <div v-for="receta in recetas" class="flex items-center space-x-2 mb-4">
                                <Checkbox :id="`${receta.id}`"                                     
                                    @update:checked="handleCheckboxChange(receta)" />
                                <label
                                :for="`${receta.id}`"
                                class="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                               {{ receta.fecha.toISOString().split("T")[0] }} 
                                </label>
                                <label
                                class="text-sm"
                                >
                               {{ receta.tipo }} 
                                </label>
                            </div>                           
                        </div>
                        <DialogFooter class="sm:justify-end">
                                <Button type="button"  @click="printRecetas()" >
                                    Imprimir Recetas
                                </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
            <Separator class="my-2 w-[95%]" />
            <div v-for="receta in recetas" class="mr-4">
                <div class="panel-inde-item px-2 py-6 h-16 flex flex-row justify-between items-center rounded-sm"
                    :class="{ 'bg-[#d7e5ec]': currentRec === receta }">
                    <p class="font-light text-sm ">{{ receta.id}}</p>
                    <div class="flex-col  w-[50%]">
                        <p class="font-bold ">{{ receta.fecha.toISOString().split("T")[0] }}</p>
                        <p class="font-light  ">{{receta.tipo}}</p>
                    </div>
                    <Button variant="outline" size="icon" class="bg-transparent hover:bg-[#d7e5ec]"
                        @click="()=>{currentRec=receta; console.log(currentRec)}">
                        <ChevronRightIcon class="w-4 h-4" />
                    </Button>
                </div>
                <Separator class="my-2" />
            </div>
        </div>
        <Separator orientation="vertical" />
        <div class="view w-[75%] h-[100%] px-8">
            <div class="datos flex flex-col" v-if="currentRec">
                <div class="flex flex-row justify-between">
                    <div class="flex flex-col ">
                        <span class="text-lg font-bold">Tipo Receta: </span>
                        <span>{{currentRec.tipo}}</span>
                    </div>
                    <div class="flex flex-col ">
                        <span class="text-lg font-bold w-[10rem]">Fecha Receta: </span>
                        <span>{{currentRec.fecha.toISOString().split("T")[0]}}</span>
                    </div>
                </div>
            </div>
            <Separator class="my-6" />

            <div v-if="currentRec?.tipo=='Anteojo Lejos' ">
                <ItemDetalleReceta :receta="currentRec" title="Lejos" />
            </div>
            <div v-else-if="currentRec?.tipo == 'Anteojo Cerca'">
                <ItemDetalleReceta :receta="currentRec" title="Cerca" />
            </div>
            <div v-else-if="currentRec?.tipo == 'Multifocal'">
                <ItemDetalleReceta :receta="currentRec" title="Cerca" />
                <Separator class="my-8" />
                <ItemDetalleReceta :receta="currentRec" title="Lejos" />
            </div>
            <div v-else-if="currentRec?.tipo == 'Bifocal'">
                <ItemDetalleReceta :receta="currentRec" title="Cerca" />
                <Separator class="my-8" />
                <ItemDetalleReceta :receta="currentRec" title="Lejos" />
            </div>

            <Separator class="my-8" />

            <div class="datos flex flex-col" v-if="currentRec">
                <div class="flex flex-row justify-between ">
                    <div class="flex flex-col w-[12rem]">
                        <span class="text font-bold ">Cristal: </span>
                        <span>{{ currentRec.cristal ?? '--' }}</span>
                    </div>
                    <div class="flex flex-col  w-[12rem]">
                        <span class="text font-bold ">Color: </span>
                        <span>{{ currentRec.color ?? '---' }}</span>
                    </div>
                    <div class="flex flex-col  w-[12rem]">
                        <span class="text font-bold">Tratamiento: </span>
                        <span>{{ currentRec.tratamiento ?? '--' }}</span>
                    </div>
                </div>
                <div class="flex flex-col items-start mt-6">
                    <span class="text font-bold">Observaciones: </span>
                    <span>{{ currentRec.observaciones ?? '--' }}</span>
                </div>
            </div>
        </div>
    </div>
</template>