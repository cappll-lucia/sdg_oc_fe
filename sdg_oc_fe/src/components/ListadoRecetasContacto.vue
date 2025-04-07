<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { ChevronRightIcon, DownloadIcon, ArchiveIcon, PlusIcon, ValueNoneIcon, Pencil1Icon  } from '@radix-icons/vue'
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
import { formatDate, generateRecetasContactoPDF } from '@/lib/utils.recetas';
import Input from './ui/input/Input.vue';
import { RecetaContacto } from '@/api/entities/recetasContacto';
import { HistoriaClinica } from '@/api/entities/historiaClinica';
import router from '@/router';

const props = defineProps<{
    historiaClinica: HistoriaClinica | undefined,
    recetas: RecetaContacto[],
    nombreCliente: string,
    idCliente: number
}>();

const currentRec = ref<RecetaContacto|undefined>();
const selectedHistoriaClinica = ref(false);
const selectedToPrint = ref<RecetaContacto[]>([])

onMounted(()=>{
    currentRec.value=props.recetas[0]
})

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
                <Button variant="outline" @click="router.push(`/recetas/contacto/new?cliente=${props.idCliente}`)" class="bg-transparent hover:bg-[#d7e5ec]">
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
                                    {{ formatDate(receta.fecha.toString()) }}
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
            <Separator class="my-6 w-[95%]" />
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
                        <p class="font-bold ">{{ formatDate(receta.fecha.toString())}}</p>
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
                <div class="flex flex-row justify-between items-center ">
                    <div class="flex flex-row ">
                        <span class="text-lg font-bold w-[10rem]">Fecha Receta: </span>
                        <span>{{ formatDate(currentRec.fecha.toString()) }}</span>
                    </div>
                        <div class="flex flex-col ">
                        <Button variant="outline" size="default" class="bg-transparent hover:bg-[#d7e5ec]"
                            @click="() => { router.push(`/recetas/contacto/edit/${currentRec?.id}`)}">
                            Editar
                            <Pencil1Icon class="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>
            <Separator class="my-6" />
                <div class="flex flex-row justify-start items-center" v-if="currentRec" > 
                    <h1 class="mr-[4rem] text-2xl font-extrabold w-[11rem] ">Lentes Definitivas</h1>
                    <div class="flex flex-col ">
                        <div class="flex  h-10 items-center">
                            <p class="font-bold w-20 text-lg">O.D.</p>

                            <p class="font-bold w-12 text-right pr-4">C.B.: </p>
                            <p class="w-14">{{ currentRec.od_cb.toFixed(2) }}</p>
                            <Separator orientation="vertical" class="mx-4" />

                            <p class="font-bold w-12 text-right pr-4">Esf.: </p>
                            <p class="w-14">{{ currentRec.od_esferico.toFixed(2) }}</p>
                            <Separator orientation="vertical" class="mx-4" />

                            <p class="font-bold w-12 text-right pr-4">Cil.:</p>
                            <p class="w-14">{{ currentRec.od_cilindrico.toFixed(2) }}</p>
                            <Separator orientation="vertical" class="mx-4 " />

                            <p class="font-bold w-12 text-right pr-4">Eje:</p>
                            <p class="w-14">{{ currentRec.od_eje.toFixed(2) }}</p>
                            <Separator orientation="vertical" class="mx-4 " />

                            <p class="font-bold w-16 text-right flex justify-start items-center">
                                <ValueNoneIcon class="h-4 w-4" /> <span class="pl-2">:</span>
                            </p>
                            <p class="w-14">{{ currentRec.od_diametro.toFixed(2) }}</p> 

                        </div>

                        <Separator class="my-4" />

                        <div class="flex  h-10 items-center">
                            <p class="font-bold w-20 text-lg">O.D.</p>

                            <p class="font-bold w-12 text-right pr-4">C.B.: </p>
                            <p class="w-14">{{ currentRec.oi_cb.toFixed(2) }}</p>
                            <Separator orientation="vertical" class="mx-4" />

                            <p class="font-bold w-12 text-right pr-4">Esf.: </p>
                            <p class="w-14">{{ currentRec.oi_esferico.toFixed(2) }}</p>
                            <Separator orientation="vertical" class="mx-4" />

                            <p class="font-bold w-12 text-right pr-4">Cil.:</p>
                            <p class="w-14">{{ currentRec.oi_cilindrico.toFixed(2) }}</p>
                            <Separator orientation="vertical" class="mx-4 " />

                            <p class="font-bold w-12 text-right pr-4">Eje:</p>
                            <p class="w-14">{{ currentRec.oi_eje.toFixed(2) }}</p>
                            <Separator orientation="vertical" class="mx-4 " />

                            <p class="font-bold w-16 text-right flex justify-start items-center">
                                <ValueNoneIcon class="h-4 w-4" /> <span class="pl-2">:</span>
                            </p>
                            <p class="w-14">{{ currentRec.oi_diametro.toFixed(2) }}</p>

                        </div>
                    </div>
                </div>
                <Separator class="my-6" />
                <div class="datos flex flex-row " v-if="currentRec">
                    <div class="flex flex-col w-[20rem]">
                        <span class="text-lg font-bold mr-8 ">Marcas </span>
                        <div class="flex flex-row">
                            <span class="text w-16 font-bold mr-2">O.D.: </span>
                            <span class="mr-6">{{ currentRec.od_marca}}</span>
                        </div>
                        <div class="flex flex-row">
                            <span class="text w-16 font-bold mr-2 ">O.I. : </span>
                            <span>{{ currentRec.oi_marca }}</span>
                        </div>
                    </div>
                    <div class="flex flex-col items-start ">
                        <span class="text-lg font-bold ">Observaciones: </span>
                        <span>{{ currentRec.observaciones ?? '--' }}</span>
                    </div>
                </div>
    
            <Separator class="my-8" />  

            <div class="flex flex-row items-start" v-if="currentRec" >
                <div class="flex flex-col justify-start items-start w-[20rem] ">
                    <h1 class="mr-[1rem] mt-2 text-xl font-extrabold  ">Queterometría </h1>
                    <div class="flexm mt-6 flex-col items-start" v-if="currentRec.quet_m1_oi ">
                        <div class="flex  h-10 items-center">
                            <p class="font-bold w-20 text-lg">O.D.</p>
                            <p class="w-14">{{ currentRec.quet_m1_od.toFixed(2) || '-' }}</p>
                            <Separator orientation="vertical" class="mx-4" />
                            <p class="w-14">{{ currentRec.quet_m2_od.toFixed(2) }}</p>
                        </div>
                        <Separator class="my-4" />
                        <div class="flex  h-10 items-center">
                            <p class="font-bold w-20 text-lg">O.I.</p>
                            <p class="w-14">{{ currentRec.quet_m1_oi.toFixed(2) }}</p>
                            <Separator orientation="vertical" class="mx-4" />
                            <p class="w-14">{{ currentRec.quet_m2_oi.toFixed(2) }}</p>
                        </div>
                        <div class="flex flex-col flex-wrap items-start mt-6">
                            <span class="text font-bold">Notas: </span>
                            <span class="w-[14rem] text-wrap  min-h-[3rem]">{{ currentRec.observaciones_queterometria ?? '--' }}</span>
                        </div>
                    </div>
                    <div class="flex flex-col items-start" v-else>
                        <p class="font-light mt-4 w-[10rem] text-sm">No hay registros de Queterometría para esta receta</p>
                    </div>
                </div>                
                
                <div class="flex flex-col justify-start items-start w-[35rem]  ">
                    <h1 class="mt-2 text-xl font-extrabold w-[full]  text-right">Evaluación General </h1>
                    <div class="flex flex-row flex-wrap gap-y-4 mt-6" >
                        <div class="items-center w-[15rem] flex gap-x-2 min-h-[1.5rem]">
                            <Checkbox v-model:checked="currentRec.maquillaje" class="pointer-events-none" />
                            <label for="terms1"
                                class="text-sm font-light leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Maquillaje
                            </label>
                        </div>
                        <div class="items-center w-[15rem] flex gap-x-2 min-h-[1.5rem]">
                            <Checkbox v-model:checked="currentRec.tonicidad" class="pointer-events-none" />
                            <label for="terms1"
                                class="text-sm font-light leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                               Tonicidad
                            </label>
                        </div>
                        <div class="items-center w-[15rem] flex gap-x-2 min-h-[1.5rem]">
                            <Checkbox v-model:checked="currentRec.hendidura_palpebral" class="pointer-events-none" />
                            <label for="terms1"
                                class="text-sm font-light leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                               Hendidura Palpebral
                            </label>
                        </div>
                        <div class="items-center w-[15rem] flex gap-x-2 min-h-[1.5rem]">
                            <Checkbox v-model:checked="currentRec.altura_palpebral" class="pointer-events-none" />
                            <label for="terms1"
                                class="text-sm font-light leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                               Altura Palpebral
                            </label>
                        </div>
                        
                        <div class="items-center w-[15rem] flex gap-x-2 min-h-[1.5rem]">
                            <Checkbox v-model:checked="currentRec.buen_parpadeo_amplitud" class="pointer-events-none" />
                            <label for="terms1"
                                class="text-sm font-light leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                               Parpadeo: Buena Amplitud
                            </label>
                        </div>
                        <div class="items-center w-[15rem] flex gap-x-2 min-h-[1.5rem]">
                            <Checkbox v-model:checked="currentRec.buen_parpadeo_ritmo" class="pointer-events-none" />
                            <label for="terms1"
                                class="text-sm font-light leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Parpadeo: Buen Ritmo
                            </label>
                        </div>
                        <div class="items-center w-[15rem] flex gap-x-2 min-h-[1.5rem]">
                            <label
                                class="text-sm font-bold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                               Estesiometria: 
                            </label>
                            <Input type="text"  class="text-black bg-transparent pointer-events-none cursor-not-allowed w-100 text-xs  h-8" :model-value="currentRec.estesiometria" />
                        </div>
                    </div>
                </div>
            </div>

            <Separator class="my-8" />  


            <div class="flex flex-row justify-start items-start" v-if="currentRec" > 
                <h1 class="mr-[3rem] mt-2 text-xl font-extrabold ">Pruebas </h1>
                <div class="flex flex-col items-start" v-if="currentRec?.pruebasLentesContacto?.length">
                    <Accordion type="single" collapsible class="w-[45rem]" v-for="prueba in currentRec.pruebasLentesContacto">
                        <AccordionItem value="item-1">
                        <AccordionTrigger>Prueba {{ prueba.numeroPrueba }}</AccordionTrigger>
                        <AccordionContent>
                            <div class="flex  h-10 items-center">
                            <p class="font-bold w-20 text-lg">O.D.</p>

                            <p class="font-bold w-12 text-right pr-4">C.B.: </p>
                            <p class="w-10">{{ prueba.od_cb.toFixed(2) }}</p>
                            <Separator orientation="vertical" class="mx-4" />

                            <p class="font-bold w-12 text-right pr-4">Esf.: </p>
                            <p class="w-10">{{ prueba.od_esferico.toFixed(2) }}</p>
                            <Separator orientation="vertical" class="mx-4" />

                            <p class="font-bold w-12 text-right pr-4">Cil.:</p>
                            <p class="w-10">{{ prueba.od_cilindrico.toFixed(2) }}</p>
                            <Separator orientation="vertical" class="mx-4 " />

                            <p class="font-bold w-12 text-right pr-4">Eje:</p>
                            <p class="w-10">{{ prueba.od_eje.toFixed(2) }}</p>
                            <Separator orientation="vertical" class="mx-4 " />

                            <p class="font-bold w-16 text-right flex justify-start items-center">
                                <ValueNoneIcon class="h-4 w-4" /> <span class="pl-2">:</span>
                            </p>
                            <p class="w-10">{{ prueba.od_cilindrico.toFixed(2) }}</p>

                        </div>

                        <Separator class="my-4" />
                           <div class="flex  h-10 items-center">
                            <p class="font-bold w-20 text-lg">O.I.</p>

                            <p class="font-bold w-12 text-right pr-4">C.B.: </p>
                            <p class="w-10">{{ prueba.oi_cb.toFixed(2) }}</p>
                            <Separator orientation="vertical" class="mx-4" />

                            <p class="font-bold w-12 text-right pr-4">Esf.: </p>
                            <p class="w-10">{{ prueba.oi_esferico.toFixed(2) }}</p>
                            <Separator orientation="vertical" class="mx-4" />

                            <p class="font-bold w-12 text-right pr-4">Cil.:</p>
                            <p class="w-10">{{ prueba.oi_cilindrico.toFixed(2) }}</p>
                            <Separator orientation="vertical" class="mx-4 " />

                            <p class="font-bold w-12 text-right pr-4">Eje:</p>
                            <p class="w-10">{{ prueba.oi_eje.toFixed(2) }}</p>
                            <Separator orientation="vertical" class="mx-4 " />

                            <p class="font-bold w-16 text-right flex justify-start items-center">
                                <ValueNoneIcon class="h-4 w-4" /> <span class="pl-2">:</span>
                            </p>
                            <p class="w-10">{{ prueba.oi_cilindrico.toFixed(2) }}</p>
                        </div>
                        <div class="mt-6">
                            <div class="flex flex-row flex-wrap gap-y-4 mb-8">
                                <div class="items-center w-[12rem] flex gap-x-2 min-h-[1.5rem]">
                                    <Checkbox class="pointer-events-none" v-model:checked="prueba.confort"  />
                                    <label for="confort"
                                        class="text-sm font-light leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Confort
                                    </label>
                                </div>
                                <div class="items-center w-[12rem]  flex gap-x-2 min-h-[1.5rem]">
                                    <Checkbox class="pointer-events-none" v-model:checked="prueba.movilidad"  />
                                    <label for="movilidad"
                                        class="text-sm font-light leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Movilidad
                                    </label>
                                </div>
                                <div class="items-center w-[12rem] flex gap-x-2 min-h-[1.5rem]">
                                    <Checkbox class="pointer-events-none" v-model:checked="prueba.centraje"  />
                                    <label for="centraje"
                                        class="text-sm font-light leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Centraje
                                    </label>
                                </div>
                                <div class="items-center w-[12rem] flex gap-x-2 min-h-[1.5rem]">
                                    <Checkbox class="pointer-events-none" v-model:checked="prueba.hiperemia"  />
                                    <label for="hiperemia"
                                        class="text-sm font-light leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Hiperemia
                                    </label>
                                </div>
                                <div class="items-center w-[12rem] flex gap-x-2 min-h-[1.5rem]">
                                    <Checkbox class="pointer-events-none" v-model:checked="prueba.agudeza_visual"  />
                                    <label for="agudeza_visual"
                                        class="text-sm font-light leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Agudeza visual
                                    </label>
                                </div>
                                <div class="items-center w-[12rem] flex gap-x-2 min-h-[1.5rem]">
                                    <Checkbox class="pointer-events-none" v-model:checked="prueba.od_edema"  />
                                    <label for="od_edema"
                                        class="text-sm font-light leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    OD Edema 
                                    </label>
                                </div>
                                <div class="items-center w-[12rem] flex gap-x-2 min-h-[1.5rem]">
                                    <Checkbox class="pointer-events-none" v-model:checked="prueba.oi_edema"  />
                                    <label for="oi_edema"
                                        class="text-sm font-light leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    OI Edema 
                                    </label>
                                </div>
                            </div>

                            <div class="flex flex-row ">
                                    <p class="text-sm w-24 text-right flex justify-start items-center">Marcas:</p>
                                    <div class="items-center w-[12rem] flex gap-x-2 min-h-[1.5rem] mr-8">
                                        <p class="text-sm text-right flex justify-start items-center font-bold ">OD:</p>
                                        <p type="decimal" class="w-32 ml-2" >{{ prueba.od_marca }}</p>
                                    </div>
                                    <div class="items-center w-[12rem] flex gap-x-2 min-h-[1.5rem]">
                                        <p class="text-sm text-right flex justify-start items-center font-bold ">OI:</p>
                                        <p type="decimal" class="w-32 ml-2" >{{ prueba.oi_marca }}</p>
                                    </div>
                            </div>
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