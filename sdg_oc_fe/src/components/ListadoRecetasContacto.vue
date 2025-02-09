<script setup lang="ts">
import { ref } from 'vue';
import type {Cliente, RecetaContacto, HistoriaClinicaContacto } from '@/api/entities';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { ChevronRightIcon, DownloadIcon, ArchiveIcon, Pencil1Icon  } from '@radix-icons/vue'
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


const props = defineProps<{
    historiaClinica: HistoriaClinicaContacto,
    recetas: RecetaContacto[],
    nombreCliente: string
}>();
// TODO inicializar en primera receta
const currentRec = ref('historia_clinica');
const selectedToPrint = ref<RecetaRecetados[]>([])

const handleCheckboxChange = (receta: RecetaRecetados) => {
    const index = selectedToPrint.value.findIndex((selected) => selected.id === receta.id);
    index !== -1
        ? selectedToPrint.value.splice(index, 1)
        : selectedToPrint.value.push(receta);
};




</script>


<template>
    <div class="panel w-100 flex flew-row h-[100%]">
        <div class="panel-index w-[23%]  p-2 pt-0 h-[100%]">
            <div class="flex justify-end mr-2">
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
                    :class="{ 'bg-[#d7e5ec]': currentRec === 'historia_clinica' }">
                    <p class="font-light text-sm ml-1">
                        <ArchiveIcon class="w-4 h-4" />
                    </p>
                    <div class="flex-col  w-[50%]">
                        <p class="font-bold ">Historia Clínica</p>
                    </div>
                    <Button variant="outline" size="icon" class="bg-transparent hover:bg-[#d7e5ec]"
                        @click="() => { currentRec = 'historia_clinica'; console.log(currentRec) }">
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
                        @click="() => { currentRec = receta; console.log(currentRec); }">
                        <ChevronRightIcon class="w-4 h-4" />
                    </Button>
                </div>
                <Separator class="my-2" />
            </div>
        </div>
        <Separator orientation="vertical" />

        <div v-if="currentRec==='historia_clinica'" class="view w-[75%] h-[100%] px-8">
            <div class="datos flex flex-col">
                <div class="flex flex-row justify-between items-center">
                    <div class="flex flex-col ">
                        <span class="text-lg font-bold">Historia Clínica Lentes de Contacto </span>
                    </div>
                    <div class="flex flex-col ">
                        <Button variant="outline" size="default" class="bg-transparent hover:bg-[#d7e5ec]"
                            @click="() => { console.log('editar historia clinica'); }">
                            Editar
                            <Pencil1Icon class="w-4 h-4" />
                        </Button>
                    </div>
                </div>
                <Separator class="my-6" />

                <div class="flex flex-col justify-between">
                    <span class="text-ls font-bold">Antecedentes Oculares </span>
                    <div class="flex flex-row mt-3 justify-between ">
                        <div class="flex flex-col justify-start align-top gap-3 w-[12rem]">
                            <div class="items-center flex gap-x-2">
                                <Checkbox class="pointer-events-none"
                                    v-model:checked="props.historiaClinica.patologicos" />
                                <label for="terms1"
                                    class="text-sm font-light leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Patológicos
                                </label>
                            </div>
                            <div class="items-center flex gap-x-2">
                                <Checkbox v-model:checked="props.historiaClinica.traumaticos"
                                    class="pointer-events-none" />
                                <label for="terms1"
                                    class="text-sm font-light leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Traumáticos
                                </label>
                            </div>
                        </div>
                        <div class="flex flex-col justify-start align-top gap-3 w-[12rem]">
                            <div class="items-center flex gap-x-2">
                                <Checkbox v-model:checked="props.historiaClinica.sensLuzNatural"
                                    class="pointer-events-none" />
                                <label for="terms1"
                                    class="text-sm font-light leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Sensibilidad Luz Natural
                                </label>
                            </div>
                            <div class="items-center flex gap-x-2">
                                <Checkbox v-model:checked="props.historiaClinica.sensLuzArtificial"
                                    class="pointer-events-none" />
                                <label for="terms1"
                                    class="text-sm font-light leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Sensibilidad Luz Artificial
                                </label>
                            </div>
                        </div>
                        <div class="flex flex-col justify-start align-top gap-3 w-[12rem]">
                            <div class="items-center flex gap-x-2">
                                <Checkbox v-model:checked="props.historiaClinica.sensPolvo"
                                    class="pointer-events-none" />
                                <label for="terms1"
                                    class="text-sm font-light leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Sensibilidad Polvo
                                </label>
                            </div>
                            <div class="items-center flex gap-x-2">
                                <Checkbox v-model:checked="props.historiaClinica.sensFrio"
                                    class="pointer-events-none" />
                                <label for="terms1"
                                    class="text-sm font-light leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Sensibilidad Frio
                                </label>
                            </div>
                        </div>
                        <div class="flex flex-col justify-start align-top gap-3 w-[12rem]">
                            <div class="items-center flex gap-x-2">
                                <Checkbox v-model:checked="props.historiaClinica.sensHumo"
                                    class="pointer-events-none" />
                                <label for="terms1"
                                    class="text-sm font-light leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Sensibilidad Humo
                                </label>
                            </div>
                        </div>
                    </div>
                    <span class="text-sm font-bold mt-6">Observaciones: </span>
                    <span class="text-sm font-light ">{{ props.historiaClinica.observacionesSens || ' - '}} </span>
                </div>

                <Separator class="my-6" />

                <div class="flex flex-col justify-between">
                    <span class="text-ls font-bold">Antecedentes Generales </span>
                    <div class="flex flex-row mt-3 justify-between ">
                        <div class="flex flex-col justify-start align-top gap-3 w-[12rem]">
                            <div class="items-center flex gap-x-2">
                                <Checkbox class="pointer-events-none"
                                    v-model:checked="props.historiaClinica.trastornosNeurologicos" />
                                <label for="terms1"
                                    class="text-sm font-light leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Trastornos Neurológicos
                                </label>
                            </div>
                            <div class="items-center flex gap-x-2">
                                <Checkbox class="pointer-events-none"
                                    v-model:checked="props.historiaClinica.regimenEventual" />
                                <label for="terms1"
                                    class="text-sm font-light leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Régimen Eventual
                                </label>
                            </div>
                            <div class="items-center flex gap-x-2">
                                <Checkbox class="pointer-events-none"
                                    v-model:checked="props.historiaClinica.glandulasEndocrinas" />
                                <label for="terms1"
                                    class="text-sm font-light leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Glandulas Endócrinas
                                </label>
                            </div>
                            <div class="items-center flex gap-x-2">
                                <Checkbox class="pointer-events-none"
                                    v-model:checked="props.historiaClinica.sistemaCardiovascular" />
                                <label for="terms1"
                                    class="text-sm font-light leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Sistema Cardiovascular
                                </label>
                            </div>

                        </div>
                        <div class="flex flex-col justify-start align-top gap-3 w-[12rem] ">
                            <div class="items-center flex gap-x-2">
                                <Checkbox v-model:checked="props.historiaClinica.embarazo"
                                    class="pointer-events-none" />
                                <label for="terms1"
                                    class="text-sm font-light leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Embarazo
                                </label>
                            </div>
                            <div class="items-center flex gap-x-2">
                                <Checkbox v-model:checked="props.historiaClinica.estomatologia"
                                    class="pointer-events-none" />
                                <label for="terms1"
                                    class="text-sm font-light leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Estomatologia
                                </label>
                            </div>
                            <div class="items-center flex gap-x-2">
                                <Checkbox v-model:checked="props.historiaClinica.caries" class="pointer-events-none" />
                                <label for="terms1"
                                    class="text-sm font-light leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Caries
                                </label>
                            </div>
                            <div class="items-center flex gap-x-2">
                                <Checkbox v-model:checked="props.historiaClinica.digestivos"
                                    class="pointer-events-none" />
                                <label for="terms1"
                                    class="text-sm font-light leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Digestivos
                                </label>
                            </div>
                        </div>
                        <div class="flex flex-col justify-start align-top gap-3 w-[12rem]">
                            <div class="items-center flex gap-x-2">
                                <Checkbox v-model:checked="props.historiaClinica.alergiaDigestiva"
                                    class="pointer-events-none" />
                                <label for="terms1"
                                    class="text-sm font-light leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Alergia Digestiva
                                </label>
                            </div>
                            <div class="items-center flex gap-x-2">
                                <Checkbox v-model:checked="props.historiaClinica.alergiaRespiratoria"
                                    class="pointer-events-none" />
                                <label for="terms1"
                                    class="text-sm font-light leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Alergia Respiratoria
                                </label>
                            </div>
                            <div class="items-center flex gap-x-2">
                                <Checkbox v-model:checked="props.historiaClinica.alergiaCutanea"
                                    class="pointer-events-none" />
                                <label for="terms1"
                                    class="text-sm font-light leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Alergia Cutanea
                                </label>
                            </div>
                            <div class="items-center flex gap-x-2">
                                <Checkbox v-model:checked="props.historiaClinica.alergiaOtras"
                                    class="pointer-events-none" />
                                <label for="terms1"
                                    class="text-sm font-light leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Otras Alergias
                                </label>
                            </div>

                        </div>
                        <div class="flex flex-col justify-start align-top gap-3 w-[12rem]">
                            <div class="items-center flex gap-x-2">
                                <Checkbox v-model:checked="props.historiaClinica.rinitisPrimaveral"
                                    class="pointer-events-none" />
                                <label for="terms1"
                                    class="text-sm font-light leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Rinitis Primaveral
                                </label>
                            </div>
                            <div class="items-center flex gap-x-2">
                                <Checkbox v-model:checked="props.historiaClinica.sinusitisCronica"
                                    class="pointer-events-none" />
                                <label for="terms1"
                                    class="text-sm font-light leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Sinusitis Cronica
                                </label>
                            </div>
                        </div>
                    </div>
                    <span class="text-sm font-bold mt-6">Observaciones: </span>
                    <span class="text-sm font-light">{{ props.historiaClinica.observacionesAntecedentes || ' - ' }}
                    </span>
                </div>

                <Separator class="my-6" />

                <div class="flex flex-col justify-between">
                    <span class="text-ls font-bold">Tratamientos Recientes o En Curso </span>
                    <div class="flex flex-row mt-3 justify-between ">
                        <div class="flex flex-col justify-start align-top gap-3 w-[12rem]">
                            <div class="items-center flex gap-x-2">
                                <Checkbox class="pointer-events-none"
                                    v-model:checked="props.historiaClinica.antibioticos" />
                                <label for="terms1"
                                    class="text-sm font-light leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Antibioticos
                                </label>
                            </div>
                            <div class="items-center flex gap-x-2">
                                <Checkbox v-model:checked="props.historiaClinica.antiestaminicos"
                                    class="pointer-events-none" />
                                <label for="terms1"
                                    class="text-sm font-light leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Antiestamínicos
                                </label>
                            </div>
                            <div class="items-center flex gap-x-2">
                                <Checkbox v-model:checked="props.historiaClinica.piladoraContraceptiva"
                                    class="pointer-events-none" />
                                <label for="terms1"
                                    class="text-sm font-light leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Píladora Contraceptiva
                                </label>
                            </div>
                        </div>
                        <div class="flex flex-col justify-start align-top gap-3 w-[12rem]">
                            <div class="items-center flex gap-x-2">
                                <Checkbox v-model:checked="props.historiaClinica.anorexigenos"
                                    class="pointer-events-none" />
                                <label for="terms1"
                                    class="text-sm font-light leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Anorexígenos
                                </label>
                            </div>
                            <div class="items-center flex gap-x-2">
                                <Checkbox v-model:checked="props.historiaClinica.neurolepticos"
                                    class="pointer-events-none" />
                                <label for="terms1"
                                    class="text-sm font-light leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Neurolépticos
                                </label>
                            </div>
                            <div class="items-center flex gap-x-2">
                                <Checkbox v-model:checked="props.historiaClinica.tratamientoDigestivo"
                                    class="pointer-events-none" />
                                <label for="terms1"
                                    class="text-sm font-light leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Tratamiento Digestivo
                                </label>
                            </div>
                        </div>
                        <div class="flex flex-col justify-start align-top gap-3 w-[12rem]">
                            <div class="items-center flex gap-x-2">
                                <Checkbox v-model:checked="props.historiaClinica.tranquilizantes"
                                    class="pointer-events-none" />
                                <label for="terms1"
                                    class="text-sm font-light leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Tranquilizantes
                                </label>
                            </div>
                            <div class="items-center flex gap-x-2">
                                <Checkbox v-model:checked="props.historiaClinica.diureticos"
                                    class="pointer-events-none" />
                                <label for="terms1"
                                    class="text-sm font-light leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Diureticos
                                </label>
                            </div>
                        </div>
                        <div class="flex flex-col justify-start align-top gap-3 w-[12rem]">
                            <div class="items-center flex gap-x-2">
                                <Checkbox v-model:checked="props.historiaClinica.corticoides"
                                    class="pointer-events-none" />
                                <label for="terms1"
                                    class="text-sm font-light leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Corticoides
                                </label>
                            </div>
                            <div class="items-center flex gap-x-2">
                                <Checkbox v-model:checked="props.historiaClinica.porosimpaticoliticos"
                                    class="pointer-events-none" />
                                <label for="terms1"
                                    class="text-sm font-light leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Porosimpaticoliticos
                                </label>
                            </div>
                        </div>
                    </div>
                    <span class="text-sm font-bold mt-6">Observaciones: </span>
                    <span class="text-sm font-light ">{{ props.historiaClinica.observacionesTratamientos || ' - ' }} </span>
                </div>

            </div>

        </div>


        <div v-else class="view w-[75%] h-[100%] px-8">
            <div class="datos flex flex-col" v-if="currentRec">
                <div class="flex flex-row justify-between">
                    <div class="flex flex-col ">
                        <span class="text-lg font-bold">Tipo Receta: </span>
                        <span>{{ currentRec.tipo }}</span>
                    </div>
                    <div class="flex flex-col ">
                        <span class="text-lg font-bold w-[10rem]">Fecha Receta: </span>
                        <span>{{ currentRec.fecha.toISOString().split("T")[0] }}</span>
                    </div>
                </div>
            </div>
            <Separator class="my-6" />

            <div v-if="currentRec?.tipo == 'Anteojo Lejos'">
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