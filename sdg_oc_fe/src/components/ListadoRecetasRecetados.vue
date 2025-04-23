<script setup lang="ts">
import { RecetasAereos } from '@/api/entities/recetasAereos';
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button';
import { ChevronRightIcon, DownloadIcon, Pencil1Icon } from '@radix-icons/vue'
import {onMounted, ref} from 'vue';
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
import { formatDate, generateRecetasRecetadosPDF } from '@/lib/utils.recetas';
import { DetalleRecetaAereos } from '@/api/entities/detalleRecetaAereos';
import { PlusIcon } from 'lucide-vue-next';
import { router } from '@/router';


const props = defineProps<{
    recetas: RecetasAereos[],
    nombreCliente: string,
    idCliente: number,
    selectedId: number|undefined
}>();
const currentRec = ref<RecetasAereos|undefined>();
const detalleCerca = ref<DetalleRecetaAereos|undefined>();
const detalleLejos = ref<DetalleRecetaAereos|undefined>();
const selectedToPrint = ref<RecetasAereos[]>([]);
const printOpen = ref<boolean>(false);

onMounted(()=>{
    if(props.selectedId){
        currentRec.value=props.recetas.find(r=>r.id==props.selectedId)
    }else{
        currentRec.value=props.recetas[0]
    }
    detalleCerca.value = currentRec.value?.detallesRecetaLentesAereos.find(det=> det.tipo_detalle=='Cerca')
    detalleLejos.value = currentRec.value?.detallesRecetaLentesAereos.find(det=> det.tipo_detalle=='Lejos')
})

const handleCheckboxChange = (receta: RecetasAereos) => {
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
    printOpen.value=false
};

const handleChangeReceta = (receta: RecetasAereos)=>{
    currentRec.value=receta;
    detalleCerca.value = currentRec.value?.detallesRecetaLentesAereos.find(det=> det.tipo_detalle=='Cerca')
    detalleLejos.value = currentRec.value?.detallesRecetaLentesAereos.find(det=> det.tipo_detalle=='Lejos')
}


</script>


<template>
    <div class="panel w-100 flex flew-row h-[100%]">
        <div class="panel-index w-[23%]  p-2 pt-0 h-[100%]">
            <div class="flex justify-between mr-2 h-10">
                <Button @click="router.push(`/recetas/recetados/new?cliente=${props.idCliente}`)" variant="outline" class="bg-transparent hover:bg-[#d7e5ec]" >
                        Nueva Receta
                    <PlusIcon class="w-4 h-4" />
                </Button>
                <Dialog v-model:open="printOpen">
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
                               {{ formatDate(receta.fecha.toString())}} 
                                </label>
                                <label
                                class="text-sm"
                                >
                               {{ receta.tipoReceta }} 
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
            <Separator class="my-6 w-[95%]" />
            <div v-for="receta in recetas" class="mr-4">
                <div class="panel-inde-item px-2 py-6 h-16 flex flex-row justify-between items-center rounded-sm"
                    :class="{ 'bg-[#d7e5ec]': currentRec === receta }">
                    <p class="font-light text-sm ">{{ receta.id}}</p>
                    <div class="flex-col  w-[50%]">
                        <p class="font-bold ">{{ formatDate(receta.fecha.toString())}}</p>
                        <p class="font-light  ">{{receta.tipoReceta}}</p>
                    </div>
                    <Button variant="outline" size="icon" @click="handleChangeReceta(receta)" class="bg-transparent hover:bg-[#d7e5ec]">
                        <ChevronRightIcon class="w-4 h-4" />
                    </Button>
                </div>
                <Separator class="my-2" />
            </div>
        </div>
        <Separator orientation="vertical" />
        
        <div class="view w-[75%] h-[100%] px-8">
            <div class="datos flex flex-col" v-if="currentRec">
                <div class="flex flex-row justify-between items-center h-10">
                    <div class="flex flex-col">
                        <div class="flex flex-row">
                            <span class="text-lg font-bold w-[10rem]">Receta: </span>
                            <span>{{currentRec.tipoReceta}}</span>
                        </div>
                        <div class="flex flex-row ">
                            <span class="text-lg font-bold w-[10rem]">Fecha: </span>
                            <span>{{formatDate(currentRec.fecha.toString())}}</span>
                        </div>
                    </div>
                    <div class="flex flex-col ">
                        <Button variant="outline" size="default" class="bg-transparent hover:bg-[#d7e5ec]"
                            @click="() => {router.push(`/recetas/recetados/edit/${currentRec?.id}`)}">
                            Editar
                            <Pencil1Icon class="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>
            <Separator class="my-6" />

            <div v-if="currentRec?.tipoReceta=='Lejos' && detalleLejos ">
                <ItemDetalleReceta :detalleReceta="detalleLejos" title="Lejos" />
            </div>
            <div v-else-if="currentRec?.tipoReceta=='Cerca' && detalleCerca">
                <ItemDetalleReceta :detalleReceta="detalleCerca" title="Cerca" />
            </div>
            <div v-else-if="currentRec?.tipoReceta == 'Multifocal' && detalleLejos && detalleCerca">
                <ItemDetalleReceta :detalleReceta="detalleCerca" title="Cerca" />
                <Separator class="my-8" />
                <ItemDetalleReceta :detalleReceta="detalleLejos" title="Lejos" />
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
                <Separator class="my-8" />
                <div class="flex flex-row  justify-between ">
                    <div class="flex flex-col w-[12rem]">
                        <span class="text font-bold ">Oftalmólogo: </span>
                        <span>{{ currentRec.oftalmologo ?? '--' }}</span>
                    </div>
                    <div class="flex flex-col  w-[12rem]">
                        <span class="text font-bold ">Armazón: </span>
                        <span>{{ currentRec.armazon ?? '---' }}</span>
                    </div>
                    <div class="flex flex-col  w-[12rem]">
                    </div>
                </div>
                <Separator class="my-8" />
                <div class="flex flex-col items-start">
                    <span class="text font-bold">Observaciones: </span>
                    <span class="min-h-[5rem]">{{ currentRec.observaciones ?? '--' }}</span>
                </div>
            </div>
        </div>
    </div>
</template>