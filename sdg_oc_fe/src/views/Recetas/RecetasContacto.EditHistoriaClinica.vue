<script setup lang="ts">
import { Cliente } from '@/api/entities/clientes';
import { HistoriaClinica } from '@/api/entities/historiaClinica';
import { clientesApi } from '@/api/libs/clientes';
import { recetasApi } from '@/api/libs/recetas';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import Button from '@/components/ui/button/Button.vue';
import Checkbox from '@/components/ui/checkbox/Checkbox.vue';
import Label from '@/components/ui/label/Label.vue';
import Separator from '@/components/ui/separator/Separator.vue';
import Textarea from '@/components/ui/textarea/Textarea.vue';
import { toast } from '@/components/ui/toast';
import { router } from '@/router';
import { useLoaderStore } from '@/stores/LoaderStore';
import { SlashIcon } from '@radix-icons/vue';
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const loader = useLoaderStore();

const selectedCliente = ref<Cliente| null>(null);

const currentHistoriaClinica = ref<HistoriaClinica>();

const showError = ref<boolean>(false);
const errorMessage =ref<string>('');




onMounted(async()=>{
    try{
        loader.show();
        const query = route.query
        if(query.cliente){
            const foundCliente = await clientesApi.getOne(Number(query.cliente))
            if(foundCliente){
                selectedCliente.value=foundCliente
            }
        }
        currentHistoriaClinica.value = await recetasApi.getHistoriaClinica(Number(route.params.id))
        console.log(currentHistoriaClinica.value)
        loader.hide();
    }catch(err: any){
        errorMessage.value=err.message as string
        showError.value = true;
        loader.hide();
    }
})

const nombreCliente = computed(()=> selectedCliente.value?.apellido +", "+selectedCliente.value?.nombre)

const onSubmit = async()=>{
    try{
        if(!currentHistoriaClinica.value ) return;
        if(!selectedCliente.value ) return;
        loader.show();
        await recetasApi.editHistoriaClinica(currentHistoriaClinica.value)
        loader.hide();
        router.push(`/recetas/${selectedCliente.value.id}?tab=contacto&recetaId=hc`)
        toast({
            title: 'Historia actualizada con éxito',
        })
    }catch(err: any){
        errorMessage.value=err.message as string
        showError.value = true;
        loader.hide();
    }
}


</script>


<template>
    <div class="page">
            <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink href="/">
                        Inicio
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                    <SlashIcon />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                    <BreadcrumbLink href="/clientes">
                        Clientes
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                    <SlashIcon />
                </BreadcrumbSeparator>
                <BreadcrumbItem v-if="selectedCliente" >
                    <BreadcrumbLink :href="`/clientes/dashboard/${selectedCliente?.id}`">
                        {{nombreCliente}}
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator  v-if="selectedCliente">
                    <SlashIcon />
                </BreadcrumbSeparator>
                <BreadcrumbItem v-if="selectedCliente">
                    <BreadcrumbLink :href="`/recetas/${selectedCliente?.id}`">
                        Recetas
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator v-if="selectedCliente">
                    <SlashIcon />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                    <BreadcrumbPage>Historia Clínica Lentes de Contacto</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
        <div class="pt-2 mb-4 flex justify-center " v-if="currentHistoriaClinica" >
            <form @submit.prevent="onSubmit" class=" rounded-lg bg-secondary w-[65rem] flex flex-col justify-start items-center px-[5rem] py-[2rem] min-h-[60rem] ">
                <div class="w-full flex flex-col justify-center">
                    <h3 class="page-subtitle text-center">Editar historia clínica - Lentes de contacto</h3>
                    <Label v-if="selectedCliente" class="text-center mt-4 text-lg">Cliente:  <span>{{ nombreCliente }}</span></Label>
                    <Separator v-if="selectedCliente"  class="my-10 w-full" />
                </div>
                <div class="flex w-full flex-col justify-between">
                <span class="text-ls font-bold">Antecedentes Oculares </span>
                <div class="flex w-full flex-row mt-3 justify-between ">
                    <div class="flex flex-col justify-start align-top gap-3 w-[12rem]">
                        <div class="items-center flex gap-x-2">
                            <Checkbox  v-model:checked="currentHistoriaClinica.patologicas" />
                            <Label for="terms1"
                                class="text-sm font-light leading-none ">
                                Patológicos
                            </Label>
                        </div>
                        <div class="items-center flex gap-x-2">
                            <Checkbox v-model:checked="currentHistoriaClinica.traumaticas"  />
                            <Label for="terms1"
                                class="text-sm font-light leading-none ">
                                Traumáticos
                            </Label>
                        </div>
                    </div>
                    <div class="flex flex-col justify-start align-top gap-3 w-[12rem]">
                        <div class="items-center flex gap-x-2">
                            <Checkbox v-model:checked="currentHistoriaClinica.sensLuzNatural"  />
                            <Label for="terms1"
                                class="text-sm font-light leading-none ">
                                Sensibilidad Luz Natural
                            </Label>
                        </div>
                        <div class="items-center flex gap-x-2">
                            <Checkbox v-model:checked="currentHistoriaClinica.sensLuzArtificial"
                                />
                            <Label for="terms1"
                                class="text-sm font-light leading-none ">
                                Sensibilidad Luz Artificial
                            </Label>
                        </div>
                    </div>
                    <div class="flex flex-col justify-start align-top gap-3 w-[12rem]">
                        <div class="items-center flex gap-x-2">
                            <Checkbox v-model:checked="currentHistoriaClinica.sensPolvo"  />
                            <Label for="terms1"
                                class="text-sm font-light leading-none ">
                                Sensibilidad Polvo
                            </Label>
                        </div>
                        <div class="items-center flex gap-x-2">
                            <Checkbox v-model:checked="currentHistoriaClinica.sensFrio"  />
                            <Label for="terms1"
                                class="text-sm font-light leading-none ">
                                Sensibilidad Frio
                            </Label>
                        </div>
                    </div>
                    <div class="flex flex-col justify-start align-top gap-3 w-[12rem]">
                        <div class="items-center flex gap-x-2">
                            <Checkbox v-model:checked="currentHistoriaClinica.sensHumo"  />
                            <Label for="terms1"
                                class="text-sm font-light leading-none ">
                                Sensibilidad Humo
                            </Label>
                        </div>
                    </div>
                </div>
                <span class="text-sm font-bold mt-6">Observaciones: </span>
                <Textarea
                    v-model="currentHistoriaClinica.observacionesSens"
                    class="resize-none h-[3rem]" 
                />
            </div>

        <Separator class="my-6" />

        <div class="flex w-full flex-col justify-between">
            <span class="text-ls font-bold">Antecedentes Generales </span>
            <div class="flex w-full flex-row mt-3 justify-between ">
                <div class="flex flex-col justify-start align-top gap-3 w-[12rem]">
                    <div class="items-center flex gap-x-2">
                        <Checkbox 
                            v-model:checked="currentHistoriaClinica.transtornosNeurologicos" />
                        <Label for="terms1"
                            class="text-sm font-light leading-none ">
                            Trastornos Neurológicos
                        </Label>
                    </div>
                    <div class="items-center flex gap-x-2">
                        <Checkbox  v-model:checked="currentHistoriaClinica.regimenEventual" />
                        <Label for="terms1"
                            class="text-sm font-light leading-none ">
                            Régimen Eventual
                        </Label>
                    </div>
                    <div class="items-center flex gap-x-2">
                        <Checkbox 
                            v-model:checked="currentHistoriaClinica.glandulasEndocinas" />
                        <Label for="terms1"
                            class="text-sm font-light leading-none ">
                            Glandulas Endócrinas
                        </Label>
                    </div>
                    <div class="items-center flex gap-x-2">
                        <Checkbox 
                            v-model:checked="currentHistoriaClinica.sistemaCardiovascular" />
                        <Label for="terms1"
                            class="text-sm font-light leading-none ">
                            Sistema Cardiovascular
                        </Label>
                    </div>

                </div>
                <div class="flex flex-col justify-start align-top gap-3 w-[12rem] ">
                    <div class="items-center flex gap-x-2">
                        <Checkbox v-model:checked="currentHistoriaClinica.embarazo"  />
                        <Label for="terms1"
                            class="text-sm font-light leading-none ">
                            Embarazo
                        </Label>
                    </div>
                    <div class="items-center flex gap-x-2">
                        <Checkbox v-model:checked="currentHistoriaClinica.estomatologia"  />
                        <Label for="terms1"
                            class="text-sm font-light leading-none ">
                            Estomatologia
                        </Label>
                    </div>
                    <div class="items-center flex gap-x-2">
                        <Checkbox v-model:checked="currentHistoriaClinica.caries"  />
                        <Label for="terms1"
                            class="text-sm font-light leading-none ">
                            Caries
                        </Label>
                    </div>
                    <div class="items-center flex gap-x-2">
                        <Checkbox v-model:checked="currentHistoriaClinica.digestivo"  />
                        <Label for="terms1"
                            class="text-sm font-light leading-none ">
                            Digestivos
                        </Label>
                    </div>
                </div>
                <div class="flex flex-col justify-start align-top gap-3 w-[12rem]">
                    <div class="items-center flex gap-x-2">
                        <Checkbox v-model:checked="currentHistoriaClinica.alergiaDigestiva"
                             />
                        <Label for="terms1"
                            class="text-sm font-light leading-none ">
                            Alergia Digestiva
                        </Label>
                    </div>
                    <div class="items-center flex gap-x-2">
                        <Checkbox v-model:checked="currentHistoriaClinica.alergiaRespiratoria"
                             />
                        <Label for="terms1"
                            class="text-sm font-light leading-none ">
                            Alergia Respiratoria
                        </Label>
                    </div>
                    <div class="items-center flex gap-x-2">
                        <Checkbox v-model:checked="currentHistoriaClinica.alergiaCutanea"  />
                        <Label for="terms1"
                            class="text-sm font-light leading-none ">
                            Alergia Cutanea
                        </Label>
                    </div>
                    <div class="items-center flex gap-x-2">
                        <Checkbox v-model:checked="currentHistoriaClinica.alergiaOtras"  />
                        <Label for="terms1"
                            class="text-sm font-light leading-none ">
                            Otras Alergias
                        </Label>
                    </div>

                </div>
                <div class="flex flex-col justify-start align-top gap-3 w-[12rem]">
                    <div class="items-center flex gap-x-2">
                        <Checkbox v-model:checked="currentHistoriaClinica.rinitisPrimaveral"
                             />
                        <Label for="terms1"
                            class="text-sm font-light leading-none ">
                            Rinitis Primaveral
                        </Label>
                    </div>
                    <div class="items-center flex gap-x-2">
                        <Checkbox v-model:checked="currentHistoriaClinica.sinusitisCronica"
                             />
                        <Label for="terms1"
                            class="text-sm font-light leading-none ">
                            Sinusitis Cronica
                        </Label>
                    </div>
                </div>
            </div>
            <span class="text-sm font-bold mt-6">Observaciones: </span>
            <Textarea
                v-model="currentHistoriaClinica.observacionesAntecedentes"
                class="resize-none h-[3rem]" 
            />
        </div>

        <Separator class="my-6" />

        <div class="flex w-full flex-col justify-between">
            <span class="text-ls font-bold">Tratamientos Recientes o En Curso </span>
            <div class="flex w-full  flex-row mt-3 justify-between ">
                <div class="flex flex-col justify-start align-top gap-3 w-[12rem]">
                    <div class="items-center flex gap-x-2">
                        <Checkbox  v-model:checked="currentHistoriaClinica.antibioticos" />
                        <Label for="terms1"
                            class="text-sm font-light leading-none ">
                            Antibioticos
                        </Label>
                    </div>
                    <div class="items-center flex gap-x-2">
                        <Checkbox v-model:checked="currentHistoriaClinica.antiestaminicos"  />
                        <Label for="terms1"
                            class="text-sm font-light leading-none ">
                            Antiestamínicos
                        </Label>
                    </div>
                    <div class="items-center flex gap-x-2">
                        <Checkbox v-model:checked="currentHistoriaClinica.pildoraContraceptiva"
                             />
                        <Label for="terms1"
                            class="text-sm font-light leading-none ">
                            Píladora Contraceptiva
                        </Label>
                    </div>
                </div>
                <div class="flex flex-col justify-start align-top gap-3 w-[12rem]">
                    <div class="items-center flex gap-x-2">
                        <Checkbox v-model:checked="currentHistoriaClinica.anorexigenos"  />
                        <Label for="terms1"
                            class="text-sm font-light leading-none ">
                            Anorexígenos
                        </Label>
                    </div>
                    <div class="items-center flex gap-x-2">
                        <Checkbox v-model:checked="currentHistoriaClinica.neurolepticos"  />
                        <Label for="terms1"
                            class="text-sm font-light leading-none ">
                            Neurolépticos
                        </Label>
                    </div>
                    <div class="items-center flex gap-x-2">
                        <Checkbox v-model:checked="currentHistoriaClinica.tratamientoDigestivo"
                             />
                        <Label for="terms1"
                            class="text-sm font-light leading-none ">
                            Tratamiento Digestivo
                        </Label>
                    </div>
                </div>
                <div class="flex flex-col justify-start align-top gap-3 w-[12rem]">
                    <div class="items-center flex gap-x-2">
                        <Checkbox v-model:checked="currentHistoriaClinica.tranquilizantes"  />
                        <Label for="terms1"
                            class="text-sm font-light leading-none ">
                            Tranquilizantes
                        </Label>
                    </div>
                    <div class="items-center flex gap-x-2">
                        <Checkbox v-model:checked="currentHistoriaClinica.dirueticos"  />
                        <Label for="terms1"
                            class="text-sm font-light leading-none ">
                            Diureticos
                        </Label>
                    </div>
                </div>
                <div class="flex flex-col justify-start align-top gap-3 w-[12rem]">
                    <div class="items-center flex gap-x-2">
                        <Checkbox v-model:checked="currentHistoriaClinica.corticoides"  />
                        <Label for="terms1"
                            class="text-sm font-light leading-none ">
                            Corticoides
                        </Label>
                    </div>
                    <div class="items-center flex gap-x-2">
                        <Checkbox v-model:checked="currentHistoriaClinica.parasimpaticoliticos"
                             />
                        <Label for="terms1"
                            class="text-sm font-light leading-none ">
                            Porosimpaticoliticos
                        </Label>
                    </div>
                </div>
            </div>
        </div>
            <div class="form-footer w-full flex flex-row justify-end mt-8 mb-6">
                <Button type="button" variant="outline" class="w-[15%] mr-5" @click="router.push(`/recetas/${selectedCliente?.id}?tab=contacto&recetaId=hc`)">Cancelar</Button>
                <Button type="submit" class="w-[15%]">Guardar</Button>
            </div>
            </form>
        </div>
        <div class="pt-2 mb-4 " v-else >
            <div  class="flex flex-col justify-between items-start px-[5rem] ">
                <div class="w-full ">
                    <h3 class="page-subtitle text-center">Historia clínica con id={{ route.params.id }} no encontrado</h3>
                </div>
            </div>
        </div>

    </div>
</template>