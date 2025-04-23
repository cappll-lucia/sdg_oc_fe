<script setup lang="ts">
import { ref } from 'vue';
import Checkbox from './ui/checkbox/Checkbox.vue';
import Label from './ui/label/Label.vue';
import Separator from './ui/separator/Separator.vue';


const newHistoriaClinica = ref<{
    patologicas: boolean;
    traumaticas: boolean;
    sensLuzNatural: boolean;
    sensLuzArtificial: boolean;
    sensHumo: boolean;
    sensFrio: boolean;
    sensPolvo: boolean;
    observacionesSens: string;
    transtornosNeurologicos: boolean;
    regimenEventual: boolean;
    glandulasEndocinas: boolean;
    sistemaCardiovascular: boolean;
    embarazo: boolean;
    estomatologia: boolean;
    caries: boolean;
    digestivo: boolean;
    alergiaDigestiva: boolean;
    alergiaRespiratoria: boolean;
    alergiaCutanea: boolean;
    alergiaOtras: boolean;
    rinitisPrimaveral: boolean;
    sinusitisCronica: boolean;
    observacionesAntecedentes: string;
    antibioticos: boolean;
    antiestaminicos: boolean;
    pildoraContraceptiva: boolean;
    anorexigenos: boolean;
    neurolepticos: boolean;
    tratamientoDigestivo: boolean;
    dirueticos: boolean;
    tranquilizantes: boolean;
    corticoides: boolean;
    parasimpaticoliticos: boolean;
    observacionesTratamiento: string;
}>({
    patologicas: false,
    traumaticas: false,
    sensLuzNatural: false,
    sensLuzArtificial: false,
    sensHumo: false,
    sensFrio: false,
    sensPolvo: false,
    observacionesSens: '',
    transtornosNeurologicos: false,
    regimenEventual: false,
    glandulasEndocinas: false,
    sistemaCardiovascular: false,
    embarazo: false,
    estomatologia: false,
    caries: false,
    digestivo: false,
    alergiaDigestiva: false,
    alergiaRespiratoria: false,
    alergiaCutanea: false,
    alergiaOtras: false,
    rinitisPrimaveral: false,
    sinusitisCronica: false,
    observacionesAntecedentes: '',
    antibioticos: false,
    antiestaminicos: false,
    pildoraContraceptiva: false,
    anorexigenos: false,
    neurolepticos: false,
    tratamientoDigestivo: false,
    dirueticos: false,
    tranquilizantes: false,
    corticoides: false,
    parasimpaticoliticos: false,
    observacionesTratamiento: '',
})

</script>


<template>
    <form action="" class="w-full">
        <div class="flex flex-col justify-between">
            <span class="text-ls font-bold">Antecedentes Oculares </span>
            <div class="flex flex-row mt-3 justify-between ">
                <div class="flex flex-col justify-start align-top gap-3 w-[12rem]">
                    <div class="items-center flex gap-x-2">
                        <Checkbox  v-model:checked="newHistoriaClinica.patologicas" />
                        <Label for="terms1"
                            class="text-sm font-light leading-none ">
                            Patológicos
                        </Label>
                    </div>
                    <div class="items-center flex gap-x-2">
                        <Checkbox v-model:checked="newHistoriaClinica.traumaticas"  />
                        <Label for="terms1"
                            class="text-sm font-light leading-none ">
                            Traumáticos
                        </Label>
                    </div>
                </div>
                <div class="flex flex-col justify-start align-top gap-3 w-[12rem]">
                    <div class="items-center flex gap-x-2">
                        <Checkbox v-model:checked="newHistoriaClinica.sensLuzNatural"  />
                        <Label for="terms1"
                            class="text-sm font-light leading-none ">
                            Sensibilidad Luz Natural
                        </Label>
                    </div>
                    <div class="items-center flex gap-x-2">
                        <Checkbox v-model:checked="newHistoriaClinica.sensLuzArtificial"
                             />
                        <Label for="terms1"
                            class="text-sm font-light leading-none ">
                            Sensibilidad Luz Artificial
                        </Label>
                    </div>
                </div>
                <div class="flex flex-col justify-start align-top gap-3 w-[12rem]">
                    <div class="items-center flex gap-x-2">
                        <Checkbox v-model:checked="newHistoriaClinica.sensPolvo"  />
                        <Label for="terms1"
                            class="text-sm font-light leading-none ">
                            Sensibilidad Polvo
                        </Label>
                    </div>
                    <div class="items-center flex gap-x-2">
                        <Checkbox v-model:checked="newHistoriaClinica.sensFrio"  />
                        <Label for="terms1"
                            class="text-sm font-light leading-none ">
                            Sensibilidad Frio
                        </Label>
                    </div>
                </div>
                <div class="flex flex-col justify-start align-top gap-3 w-[12rem]">
                    <div class="items-center flex gap-x-2">
                        <Checkbox v-model:checked="newHistoriaClinica.sensHumo"  />
                        <Label for="terms1"
                            class="text-sm font-light leading-none ">
                            Sensibilidad Humo
                        </Label>
                    </div>
                </div>
            </div>
            <span class="text-sm font-bold mt-6">Observaciones: </span>
            <span class="text-sm font-light ">{{ newHistoriaClinica.observacionesSens || ' - ' }} </span>
        </div>

        <Separator class="my-6" />

        <div class="flex flex-col justify-between">
            <span class="text-ls font-bold">Antecedentes Generales </span>
            <div class="flex flex-row mt-3 justify-between ">
                <div class="flex flex-col justify-start align-top gap-3 w-[12rem]">
                    <div class="items-center flex gap-x-2">
                        <Checkbox 
                            v-model:checked="newHistoriaClinica.transtornosNeurologicos" />
                        <Label for="terms1"
                            class="text-sm font-light leading-none ">
                            Trastornos Neurológicos
                        </Label>
                    </div>
                    <div class="items-center flex gap-x-2">
                        <Checkbox  v-model:checked="newHistoriaClinica.regimenEventual" />
                        <Label for="terms1"
                            class="text-sm font-light leading-none ">
                            Régimen Eventual
                        </Label>
                    </div>
                    <div class="items-center flex gap-x-2">
                        <Checkbox 
                            v-model:checked="newHistoriaClinica.glandulasEndocinas" />
                        <Label for="terms1"
                            class="text-sm font-light leading-none ">
                            Glandulas Endócrinas
                        </Label>
                    </div>
                    <div class="items-center flex gap-x-2">
                        <Checkbox 
                            v-model:checked="newHistoriaClinica.sistemaCardiovascular" />
                        <Label for="terms1"
                            class="text-sm font-light leading-none ">
                            Sistema Cardiovascular
                        </Label>
                    </div>

                </div>
                <div class="flex flex-col justify-start align-top gap-3 w-[12rem] ">
                    <div class="items-center flex gap-x-2">
                        <Checkbox v-model:checked="newHistoriaClinica.embarazo"  />
                        <Label for="terms1"
                            class="text-sm font-light leading-none ">
                            Embarazo
                        </Label>
                    </div>
                    <div class="items-center flex gap-x-2">
                        <Checkbox v-model:checked="newHistoriaClinica.estomatologia"  />
                        <Label for="terms1"
                            class="text-sm font-light leading-none ">
                            Estomatologia
                        </Label>
                    </div>
                    <div class="items-center flex gap-x-2">
                        <Checkbox v-model:checked="newHistoriaClinica.caries"  />
                        <Label for="terms1"
                            class="text-sm font-light leading-none ">
                            Caries
                        </Label>
                    </div>
                    <div class="items-center flex gap-x-2">
                        <Checkbox v-model:checked="newHistoriaClinica.digestivo"  />
                        <Label for="terms1"
                            class="text-sm font-light leading-none ">
                            Digestivos
                        </Label>
                    </div>
                </div>
                <div class="flex flex-col justify-start align-top gap-3 w-[12rem]">
                    <div class="items-center flex gap-x-2">
                        <Checkbox v-model:checked="newHistoriaClinica.alergiaDigestiva"
                             />
                        <Label for="terms1"
                            class="text-sm font-light leading-none ">
                            Alergia Digestiva
                        </Label>
                    </div>
                    <div class="items-center flex gap-x-2">
                        <Checkbox v-model:checked="newHistoriaClinica.alergiaRespiratoria"
                             />
                        <Label for="terms1"
                            class="text-sm font-light leading-none ">
                            Alergia Respiratoria
                        </Label>
                    </div>
                    <div class="items-center flex gap-x-2">
                        <Checkbox v-model:checked="newHistoriaClinica.alergiaCutanea"  />
                        <Label for="terms1"
                            class="text-sm font-light leading-none ">
                            Alergia Cutanea
                        </Label>
                    </div>
                    <div class="items-center flex gap-x-2">
                        <Checkbox v-model:checked="newHistoriaClinica.alergiaOtras"  />
                        <Label for="terms1"
                            class="text-sm font-light leading-none ">
                            Otras Alergias
                        </Label>
                    </div>

                </div>
                <div class="flex flex-col justify-start align-top gap-3 w-[12rem]">
                    <div class="items-center flex gap-x-2">
                        <Checkbox v-model:checked="newHistoriaClinica.rinitisPrimaveral"
                             />
                        <Label for="terms1"
                            class="text-sm font-light leading-none ">
                            Rinitis Primaveral
                        </Label>
                    </div>
                    <div class="items-center flex gap-x-2">
                        <Checkbox v-model:checked="newHistoriaClinica.sinusitisCronica"
                             />
                        <Label for="terms1"
                            class="text-sm font-light leading-none ">
                            Sinusitis Cronica
                        </Label>
                    </div>
                </div>
            </div>
            <span class="text-sm font-bold mt-6">Observaciones: </span>
            <span class="text-sm font-light">{{ newHistoriaClinica.observacionesAntecedentes || ' - ' }}
            </span>
        </div>

        <Separator class="my-6" />

        <div class="flex flex-col justify-between">
            <span class="text-ls font-bold">Tratamientos Recientes o En Curso </span>
            <div class="flex flex-row mt-3 justify-between ">
                <div class="flex flex-col justify-start align-top gap-3 w-[12rem]">
                    <div class="items-center flex gap-x-2">
                        <Checkbox  v-model:checked="newHistoriaClinica.antibioticos" />
                        <Label for="terms1"
                            class="text-sm font-light leading-none ">
                            Antibioticos
                        </Label>
                    </div>
                    <div class="items-center flex gap-x-2">
                        <Checkbox v-model:checked="newHistoriaClinica.antiestaminicos"  />
                        <Label for="terms1"
                            class="text-sm font-light leading-none ">
                            Antiestamínicos
                        </Label>
                    </div>
                    <div class="items-center flex gap-x-2">
                        <Checkbox v-model:checked="newHistoriaClinica.pildoraContraceptiva"
                             />
                        <Label for="terms1"
                            class="text-sm font-light leading-none ">
                            Píladora Contraceptiva
                        </Label>
                    </div>
                </div>
                <div class="flex flex-col justify-start align-top gap-3 w-[12rem]">
                    <div class="items-center flex gap-x-2">
                        <Checkbox v-model:checked="newHistoriaClinica.anorexigenos"  />
                        <Label for="terms1"
                            class="text-sm font-light leading-none ">
                            Anorexígenos
                        </Label>
                    </div>
                    <div class="items-center flex gap-x-2">
                        <Checkbox v-model:checked="newHistoriaClinica.neurolepticos"  />
                        <Label for="terms1"
                            class="text-sm font-light leading-none ">
                            Neurolépticos
                        </Label>
                    </div>
                    <div class="items-center flex gap-x-2">
                        <Checkbox v-model:checked="newHistoriaClinica.tratamientoDigestivo"
                             />
                        <Label for="terms1"
                            class="text-sm font-light leading-none ">
                            Tratamiento Digestivo
                        </Label>
                    </div>
                </div>
                <div class="flex flex-col justify-start align-top gap-3 w-[12rem]">
                    <div class="items-center flex gap-x-2">
                        <Checkbox v-model:checked="newHistoriaClinica.tranquilizantes"  />
                        <Label for="terms1"
                            class="text-sm font-light leading-none ">
                            Tranquilizantes
                        </Label>
                    </div>
                    <div class="items-center flex gap-x-2">
                        <Checkbox v-model:checked="newHistoriaClinica.dirueticos"  />
                        <Label for="terms1"
                            class="text-sm font-light leading-none ">
                            Diureticos
                        </Label>
                    </div>
                </div>
                <div class="flex flex-col justify-start align-top gap-3 w-[12rem]">
                    <div class="items-center flex gap-x-2">
                        <Checkbox v-model:checked="newHistoriaClinica.corticoides"  />
                        <Label for="terms1"
                            class="text-sm font-light leading-none ">
                            Corticoides
                        </Label>
                    </div>
                    <div class="items-center flex gap-x-2">
                        <Checkbox v-model:checked="newHistoriaClinica.parasimpaticoliticos"
                             />
                        <Label for="terms1"
                            class="text-sm font-light leading-none ">
                            Porosimpaticoliticos
                        </Label>
                    </div>
                </div>
            </div>
            <span class="text-sm font-bold mt-6">Observaciones: </span>
            <span class="text-sm font-light ">{{ newHistoriaClinica.observacionesTratamiento || ' - ' }} </span>
        </div>

    </form>
</template>