<script setup lang="ts">
import { ref } from 'vue';
import type { RecetaContacto, HistoriaClinicaContacto } from '@/api/entities';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { ChevronRightIcon, DownloadIcon, ArchiveIcon, PlusIcon, ValueNoneIcon  } from '@radix-icons/vue'
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
import DetalleHistoriaClinicaContacto from '@/components/HistoriaClinicaContacto.vue';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { generateRecetasContactoPDF } from '@/lib/utils';


const props = defineProps<{
    historiaClinica: HistoriaClinicaContacto | undefined,
    recetas: RecetaContacto[],
    nombreCliente: string
}>();
// TODO inicializar en primera receta
const currentRec = ref(props.recetas[0]);
const selectedHistoriaClinica = ref(false);
const selectedToPrint = ref<RecetaContacto[]>([])

const handleCheckboxChange = (receta: RecetaContacto) => {
    const index = selectedToPrint.value.findIndex((selected) => selected.id === receta.id);
    index !== -1
        ? selectedToPrint.value.splice(index, 1)
        : selectedToPrint.value.push(receta);
};



const printRecetas = () => {
    console.log(selectedToPrint)
    if (selectedToPrint.value.length === 0) {
        alert("Por favor, selecciona al menos una receta para imprimir.");
        return;
    }
    generateRecetasContactoPDF(selectedToPrint.value, props.nombreCliente)
};



</script>


<template>
    <div class="panel w-100 flex flew-row h-[100%]">
        <div class="panel-index w-[23%]  p-2 pt-0 h-[100%]">
            <div class="flex justify-between mr-2">
                <!-- TODO add link to create -->
                <Button variant="outline" class="bg-transparent hover:bg-[#d7e5ec]">
                        Nueva Receta
                    <PlusIcon class="w-4 h-4" />
                </Button>
                <Dialog>
                    <DialogTrigger as-child>
                        <Button variant="outline" class="bg-transparent hover:bg-[#d7e5ec]">
                            Imprimir
                            <DownloadIcon class="w-4 h-4" />
                        </Button>
                    </DialogTrigger>
                    <DialogContent class="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Imprimir Recetas Lentes de Contacto</DialogTitle>
                            <DialogDescription>
                                Cliente: {{ nombreCliente }}
                            </DialogDescription>
                        </DialogHeader>
                        <div class="flex flex-col items-start justify-center ">
                            <div v-for="receta in recetas" class="flex items-center space-x-2 mb-4">
                                <Checkbox :id="`${receta.id}`" @update:checked="handleCheckboxChange(receta)" />
                                <label :for="`${receta.id}`"
                                    class="font-light leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    {{ receta.fecha.toISOString().split("T")[0] }}
                                </label>
                                <label class="text-sm">
                                    {{ receta.marca }}
                                </label>
                            </div>
                        </div>
                        <DialogFooter class="sm:justify-end">
                            <Button type="button" @click="printRecetas()">
                                Imprimir Recetas
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
            <Separator class="my-2 w-[95%]" />
            <div class="mr-4">
                <div class="panel-inde-item px-2 py-6 h-16 flex flex-row justify-between items-center rounded-sm"
                    :class="{ 'bg-[#d7e5ec]': selectedHistoriaClinica }">
                    <p class="font-light text-sm ml-1">
                        <ArchiveIcon class="w-4 h-4" />
                    </p>
                    <div class="flex-col  w-[50%]">
                        <p class="font-bold ">Historia Clínica</p>
                    </div>
                    <Button variant="outline" size="icon" class="bg-transparent hover:bg-[#d7e5ec]"
                        @click="() => { selectedHistoriaClinica = true; currentRec=undefined; console.log(currentRec) }">
                        <ChevronRightIcon class="w-4 h-4" />
                    </Button>
                </div>
            </div>
            <Separator class="my-2 w-[95%]" />
            <div v-for="receta in recetas" class="mr-4">
                <div class="panel-inde-item px-2 py-6 h-16 flex flex-row justify-between items-center rounded-sm"
                    :class="{ 'bg-[#d7e5ec]': currentRec === receta }">
                    <p class="font-light text-sm ">{{ receta.id }}</p>
                    <div class="flex-col  w-[50%]">
                        <p class="font-bold ">{{ receta.fecha.toISOString().split("T")[0] }}</p>
                        <p class="font-light  ">{{ receta.marca }}</p>
                    </div>
                    <Button variant="outline" size="icon" class="bg-transparent hover:bg-[#d7e5ec]"
                        @click="() => { selectedHistoriaClinica=false; currentRec = receta; console.log(currentRec); }">
                        <ChevronRightIcon class="w-4 h-4" />
                    </Button>
                </div>
                <Separator class="my-2" />
            </div>
        </div>
        <Separator orientation="vertical" />

        <div v-if="selectedHistoriaClinica" class="view w-[75%] h-[100%] px-8">
            <DetalleHistoriaClinicaContacto :historiaClinica="props.historiaClinica" />
        </div>


        <div v-else class="view w-[75%] h-[100%] px-8">
            <div class="datos flex flex-col" v-if="currentRec">
                <div class="flex flex-row justify-end">
                    <!-- <div class="flex flex-col ">
                        <span class="text-lg font-bold">Tipo Receta: </span>
                        <span>{{ currentRec.tipo }}</span>
                    </div> -->
                    <div class="flex flex-col ">
                        <span class="text-lg font-bold w-[10rem]">Fecha Receta: </span>
                        <span>{{ currentRec.fecha.toISOString().split("T")[0] }}</span>
                    </div>
                </div>
            </div>
            <Separator class="my-6" />
                <div class="flex flex-row justify-start items-center" v-if="currentRec" > 
                    <h1 class="mr-20 text-2xl font-extrabold w-24 ">Lentes Definitivas</h1>
                    <div class="flex flex-col ">
                        <div class="flex  h-10 items-center">
                            <p class="font-bold w-20 text-lg">O.D.</p>

                            <p class="font-bold w-12 text-right pr-4">C.B.: </p>
                            <p class="w-14">{{ currentRec.odCb.toFixed(2) }}</p>
                            <Separator orientation="vertical" class="mx-4" />

                            <p class="font-bold w-12 text-right pr-4">Esf.: </p>
                            <p class="w-14">{{ currentRec.odEsferico.toFixed(2) }}</p>
                            <Separator orientation="vertical" class="mx-4" />

                            <p class="font-bold w-12 text-right pr-4">Cil.:</p>
                            <p class="w-14">{{ currentRec.odCilindrico.toFixed(2) }}</p>
                            <Separator orientation="vertical" class="mx-4 " />

                            <p class="font-bold w-12 text-right pr-4">Eje:</p>
                            <p class="w-14">{{ currentRec.odCilindrico.toFixed(2) }}</p>
                            <Separator orientation="vertical" class="mx-4 " />

                            <p class="font-bold w-16 text-right flex justify-start items-center">
                                <ValueNoneIcon class="h-4 w-4" /> <span class="pl-2">:</span>
                            </p>
                            <p class="w-14">{{ currentRec.odCilindrico.toFixed(2) }}</p>

                        </div>

                        <Separator class="my-4" />

                        <div class="flex  h-10 items-center">
                            <p class="font-bold w-20 text-lg">O.D.</p>

                            <p class="font-bold w-12 text-right pr-4">C.B.: </p>
                            <p class="w-14">{{ currentRec.oiCb.toFixed(2) }}</p>
                            <Separator orientation="vertical" class="mx-4" />

                            <p class="font-bold w-12 text-right pr-4">Esf.: </p>
                            <p class="w-14">{{ currentRec.oiEsferico.toFixed(2) }}</p>
                            <Separator orientation="vertical" class="mx-4" />

                            <p class="font-bold w-12 text-right pr-4">Cil.:</p>
                            <p class="w-14">{{ currentRec.oiCilindrico.toFixed(2) }}</p>
                            <Separator orientation="vertical" class="mx-4 " />

                            <p class="font-bold w-12 text-right pr-4">Eje:</p>
                            <p class="w-14">{{ currentRec.oiCilindrico.toFixed(2) }}</p>
                            <Separator orientation="vertical" class="mx-4 " />

                            <p class="font-bold w-16 text-right flex justify-start items-center">
                                <ValueNoneIcon class="h-4 w-4" /> <span class="pl-2">:</span>
                            </p>
                            <p class="w-14">{{ currentRec.oiCilindrico.toFixed(2) }}</p>

                        </div>
                    </div>
                </div>
                <Separator class="my-6" />
                <div class="datos flex flex-col" v-if="currentRec">
                    <div class="mt-6">
                        <span class="text font-bold mr-2">Marca: </span>
                        <span>{{ currentRec.marca ?? '--' }}</span>
                    </div>
                    <div class="flex flex-col items-start mt-6">
                        <span class="text font-bold">Observaciones: </span>
                        <span>{{ currentRec.observaciones ?? '--' }}</span>
                    </div>
                </div>

                <Separator class="my-8" />  

            <div class="flex flex-row justify-start items-start" v-if="currentRec" > 
                <h1 class="mr-20 mt-2 text-2xl font-extrabold w-20 ">Pruebas </h1>
                <div class="flex flex-col items-start" v-if="currentRec.pruebas.length">
                    <Accordion type="single" collapsible class="w-[50rem]" v-for="prueba in currentRec.pruebas">
                        <AccordionItem value="item-1">
                        <AccordionTrigger>Prueba {{ prueba.numeroPrueba }}</AccordionTrigger>
                        <AccordionContent>
                            <div class="flex  h-10 items-center">
                            <p class="font-bold w-20 text-lg">O.D.</p>

                            <p class="font-bold w-12 text-right pr-4">C.B.: </p>
                            <p class="w-14">{{ prueba.odCb.toFixed(2) }}</p>
                            <Separator orientation="vertical" class="mx-4" />

                            <p class="font-bold w-12 text-right pr-4">Esf.: </p>
                            <p class="w-14">{{ prueba.odEsferico.toFixed(2) }}</p>
                            <Separator orientation="vertical" class="mx-4" />

                            <p class="font-bold w-12 text-right pr-4">Cil.:</p>
                            <p class="w-14">{{ prueba.odCilindrico.toFixed(2) }}</p>
                            <Separator orientation="vertical" class="mx-4 " />

                            <p class="font-bold w-12 text-right pr-4">Eje:</p>
                            <p class="w-14">{{ prueba.odCilindrico.toFixed(2) }}</p>
                            <Separator orientation="vertical" class="mx-4 " />

                            <p class="font-bold w-16 text-right flex justify-start items-center">
                                <ValueNoneIcon class="h-4 w-4" /> <span class="pl-2">:</span>
                            </p>
                            <p class="w-14">{{ prueba.odCilindrico.toFixed(2) }}</p>

                        </div>

                        <Separator class="my-4" />
                           <div class="flex  h-10 items-center">
                            <p class="font-bold w-20 text-lg">O.D.</p>

                            <p class="font-bold w-12 text-right pr-4">C.B.: </p>
                            <p class="w-14">{{ prueba.oiCb.toFixed(2) }}</p>
                            <Separator orientation="vertical" class="mx-4" />

                            <p class="font-bold w-12 text-right pr-4">Esf.: </p>
                            <p class="w-14">{{ prueba.oiEsferico.toFixed(2) }}</p>
                            <Separator orientation="vertical" class="mx-4" />

                            <p class="font-bold w-12 text-right pr-4">Cil.:</p>
                            <p class="w-14">{{ prueba.oiCilindrico.toFixed(2) }}</p>
                            <Separator orientation="vertical" class="mx-4 " />

                            <p class="font-bold w-12 text-right pr-4">Eje:</p>
                            <p class="w-14">{{ prueba.oiCilindrico.toFixed(2) }}</p>
                            <Separator orientation="vertical" class="mx-4 " />

                            <p class="font-bold w-16 text-right flex justify-start items-center">
                                <ValueNoneIcon class="h-4 w-4" /> <span class="pl-2">:</span>
                            </p>
                            <p class="w-14">{{ prueba.oiCilindrico.toFixed(2) }}</p>
                        </div>
                        </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                    
                </div>
                <div class="flex flex-col items-start" v-else>
                    <p class="font-light mt-4 w-[50rem] text-sm">No hay pruebas registradas para la receta</p>
                </div>
            </div>

        </div>
    </div>
</template>