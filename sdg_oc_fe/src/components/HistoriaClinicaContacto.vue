<script setup lang="ts">
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Pencil1Icon } from '@radix-icons/vue';

import { Checkbox } from '@/components/ui/checkbox';
import { HistoriaClinica } from '@/api/entities/historiaClinica';


const props = defineProps<{
    historiaClinica: HistoriaClinica | undefined
}>();
// TODO inicializar en primera receta

</script>


<template>
    <div class="datos flex flex-col" v-if="!props.historiaClinica">
        <span class="text-lg font-bold">Historia clinica no registrada para el cliente </span>
    </div>
    <div class="datos flex flex-col" v-if="props.historiaClinica">
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
                        <Checkbox class="pointer-events-none" v-model:checked="props.historiaClinica.patologicas" />
                        <label for="terms1"
                            class="text-sm font-light leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Patológicos
                        </label>
                    </div>
                    <div class="items-center flex gap-x-2">
                        <Checkbox v-model:checked="props.historiaClinica.traumaticas" class="pointer-events-none" />
                        <label for="terms1"
                            class="text-sm font-light leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Traumáticos
                        </label>
                    </div>
                </div>
                <div class="flex flex-col justify-start align-top gap-3 w-[12rem]">
                    <div class="items-center flex gap-x-2">
                        <Checkbox v-model:checked="props.historiaClinica.sensLuzNatural" class="pointer-events-none" />
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
                        <Checkbox v-model:checked="props.historiaClinica.sensPolvo" class="pointer-events-none" />
                        <label for="terms1"
                            class="text-sm font-light leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Sensibilidad Polvo
                        </label>
                    </div>
                    <div class="items-center flex gap-x-2">
                        <Checkbox v-model:checked="props.historiaClinica.sensFrio" class="pointer-events-none" />
                        <label for="terms1"
                            class="text-sm font-light leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Sensibilidad Frio
                        </label>
                    </div>
                </div>
                <div class="flex flex-col justify-start align-top gap-3 w-[12rem]">
                    <div class="items-center flex gap-x-2">
                        <Checkbox v-model:checked="props.historiaClinica.sensHumo" class="pointer-events-none" />
                        <label for="terms1"
                            class="text-sm font-light leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Sensibilidad Humo
                        </label>
                    </div>
                </div>
            </div>
            <span class="text-sm font-bold mt-6">Observaciones: </span>
            <span class="text-sm font-light ">{{ props.historiaClinica.observacionesSens || ' - ' }} </span>
        </div>

        <Separator class="my-6" />

        <div class="flex flex-col justify-between">
            <span class="text-ls font-bold">Antecedentes Generales </span>
            <div class="flex flex-row mt-3 justify-between ">
                <div class="flex flex-col justify-start align-top gap-3 w-[12rem]">
                    <div class="items-center flex gap-x-2">
                        <Checkbox class="pointer-events-none"
                            v-model:checked="props.historiaClinica.transtornosNeurologicos" />
                        <label for="terms1"
                            class="text-sm font-light leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Trastornos Neurológicos
                        </label>
                    </div>
                    <div class="items-center flex gap-x-2">
                        <Checkbox class="pointer-events-none" v-model:checked="props.historiaClinica.regimenEventual" />
                        <label for="terms1"
                            class="text-sm font-light leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Régimen Eventual
                        </label>
                    </div>
                    <div class="items-center flex gap-x-2">
                        <Checkbox class="pointer-events-none"
                            v-model:checked="props.historiaClinica.glandulasEndocinas" />
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
                        <Checkbox v-model:checked="props.historiaClinica.embarazo" class="pointer-events-none" />
                        <label for="terms1"
                            class="text-sm font-light leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Embarazo
                        </label>
                    </div>
                    <div class="items-center flex gap-x-2">
                        <Checkbox v-model:checked="props.historiaClinica.estomatologia" class="pointer-events-none" />
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
                        <Checkbox v-model:checked="props.historiaClinica.digestivo" class="pointer-events-none" />
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
                        <Checkbox v-model:checked="props.historiaClinica.alergiaCutanea" class="pointer-events-none" />
                        <label for="terms1"
                            class="text-sm font-light leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Alergia Cutanea
                        </label>
                    </div>
                    <div class="items-center flex gap-x-2">
                        <Checkbox v-model:checked="props.historiaClinica.alergiaOtras" class="pointer-events-none" />
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
                        <Checkbox class="pointer-events-none" v-model:checked="props.historiaClinica.antibioticos" />
                        <label for="terms1"
                            class="text-sm font-light leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Antibioticos
                        </label>
                    </div>
                    <div class="items-center flex gap-x-2">
                        <Checkbox v-model:checked="props.historiaClinica.antiestaminicos" class="pointer-events-none" />
                        <label for="terms1"
                            class="text-sm font-light leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Antiestamínicos
                        </label>
                    </div>
                    <div class="items-center flex gap-x-2">
                        <Checkbox v-model:checked="props.historiaClinica.pildoraContraceptiva"
                            class="pointer-events-none" />
                        <label for="terms1"
                            class="text-sm font-light leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Píladora Contraceptiva
                        </label>
                    </div>
                </div>
                <div class="flex flex-col justify-start align-top gap-3 w-[12rem]">
                    <div class="items-center flex gap-x-2">
                        <Checkbox v-model:checked="props.historiaClinica.anorexigenos" class="pointer-events-none" />
                        <label for="terms1"
                            class="text-sm font-light leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Anorexígenos
                        </label>
                    </div>
                    <div class="items-center flex gap-x-2">
                        <Checkbox v-model:checked="props.historiaClinica.neurolepticos" class="pointer-events-none" />
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
                        <Checkbox v-model:checked="props.historiaClinica.tranquilizantes" class="pointer-events-none" />
                        <label for="terms1"
                            class="text-sm font-light leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Tranquilizantes
                        </label>
                    </div>
                    <div class="items-center flex gap-x-2">
                        <Checkbox v-model:checked="props.historiaClinica.dirueticos" class="pointer-events-none" />
                        <label for="terms1"
                            class="text-sm font-light leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Diureticos
                        </label>
                    </div>
                </div>
                <div class="flex flex-col justify-start align-top gap-3 w-[12rem]">
                    <div class="items-center flex gap-x-2">
                        <Checkbox v-model:checked="props.historiaClinica.corticoides" class="pointer-events-none" />
                        <label for="terms1"
                            class="text-sm font-light leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Corticoides
                        </label>
                    </div>
                    <div class="items-center flex gap-x-2">
                        <Checkbox v-model:checked="props.historiaClinica.parasimpaticoliticos"
                            class="pointer-events-none" />
                        <label for="terms1"
                            class="text-sm font-light leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Porosimpaticoliticos
                        </label>
                    </div>
                </div>
            </div>
            <span class="text-sm font-bold mt-6">Observaciones: </span>
            <span class="text-sm font-light ">{{ props.historiaClinica.observacionesTratamiento || ' - ' }} </span>
        </div>

    </div>
</template>