<script lang="ts" setup>
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Pencil1Icon, SlashIcon } from '@radix-icons/vue';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { ChevronRightIcon } from '@radix-icons/vue';
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { clientesApi } from '@/api/libs/clientes';
import { Audiometria } from '@/api/entities/audiometrias';
import { Cliente } from '@/api/entities/clientes';
import { formatDate } from '@/lib/utils.recetas';
import { PlusIcon } from 'lucide-vue-next';
import { uploadsApi } from '@/api/libs/uploads';
import { router } from '@/router';
import { useLoaderStore } from '@/stores/LoaderStore';
import AlertError from '@/components/AlertError.vue';

const route = useRoute();
const loader = useLoaderStore();

const selectedAudiom = ref<undefined | Audiometria>();
const currentCliente = ref<Cliente>();
const audiometriasCliente = ref<Audiometria[]>([]);
const filePDF = ref();

const showError = ref<boolean>(false);
const errorMessage =ref<string>('');


onMounted(async () => {
    await loadData();
})

const loadData = async()=> {
    try{
        loader.show();
        const id = Number(route.params.idCliente);
        if(id==0){
            loader.hide();
            return;
        }
        currentCliente.value = await clientesApi.getOne(id)
        if(!currentCliente.value){
            loader.hide();
            return;
        }
        audiometriasCliente.value = await clientesApi.getAudiometriasByCliente(Number(route.params.idCliente));
        selectedAudiom.value = audiometriasCliente.value[0];
        if(selectedAudiom.value){
            filePDF.value = await uploadsApi.getFile(`audiometrias/${selectedAudiom.value.linkPDF}`);
        }
        loader.hide();
    }catch(err: any){
        errorMessage.value=err.message as string
        showError.value = true;
        loader.hide();
    }
}

const changeSelectedAudiom = async(audiometria: Audiometria) =>{
    try{
        loader.show
        selectedAudiom.value=audiometria;
        filePDF.value = await uploadsApi.getFile(`audiometrias/${selectedAudiom.value?.linkPDF}`)
        loader.hide()
    }catch(err: any){
        errorMessage.value=err.message as string
        showError.value = true;
        loader.hide();
    }
}

const nombreCliente = computed(()=> currentCliente.value?.apellido +", "+currentCliente.value?.nombre)


</script>

<template>
    <div class="page" v-if="currentCliente">
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
                <BreadcrumbItem>
                    <BreadcrumbLink :href="`/clientes/dashboard/${currentCliente?.id}`">
                        {{nombreCliente}}
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                    <SlashIcon />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                    <BreadcrumbPage>Audiometrías</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
        <h1 class="page-title ">Informes de Audiometría: {{currentCliente?.apellido}}, {{ currentCliente?.nombre }}</h1>
        <div class="pt-2">
            <div class="panel w-[100%] flex flew-row h-[100%] rounded bg-secondary p-4"
                v-if="currentCliente && audiometriasCliente.length>0">
                <div class="panel-index w-[23%] h-[100%] p-4">
                    <div class="flex justify-between items-center mr-2 h-10">
                        <Button @click="()=>router.push(`/audiometrias/create?cliente=${currentCliente?.id}`)" variant="outline" class="bg-transparent hover:bg-[#d7e5ec] w-full mr-2">
                                Nueva Audiometria
                            <PlusIcon class="w-4 h-4" />
                        </Button>
                    </div>
                    <Separator class="my-4" />
                    <div v-for="audiom in audiometriasCliente" :key="audiom.id" class="mr-4">
                        <div class="panel-inde-item px-2 py-6 h-16 flex flex-row justify-between items-center rounded-sm"
                            :class="{ 'bg-[#d7e5ec]': selectedAudiom === audiom }">
                            <p class="font-light text-sm "></p>
                            <div class="flex-col  w-[50%]">
                                <p class="font-bold ">{{ formatDate(audiom.fechaInforme.toString()) }}</p>
                                <p class="font-light  ">Audiometría</p>
                            </div>
                            <Button variant="outline" size="icon" class="bg-transparent hover:bg-[#d7e5ec]"
                                @click="async() => { await changeSelectedAudiom(audiom) }">
                                <ChevronRightIcon class="w-4 h-4" />
                            </Button>
                        </div>
                        <Separator class="my-2" />
                    </div>
                </div>
                <Separator orientation="vertical" />
                <div class="view w-[75%] h-[100%] p-4">
                    <div class="w-full h-screen flex flex-col items-start justify-start">
                        <div class="datos flex flex-col w-full" v-if="selectedAudiom">
                            <div class="flex flex-row  items-center justify-between h-10 ">
                                <div class="flex flex-row  items-center justify-start h-10 ">
                                    <span class="text-lg font-bold w-[10rem]">Fecha Informe: </span>
                                    <span>{{ formatDate(selectedAudiom.fechaInforme.toString()) }}</span>
                                </div>
                                <Button variant="outline" size="default" class="bg-transparent hover:bg-[#d7e5ec]"
                                    @click="() => router.push(`/audiometrias/edit/${selectedAudiom?.id}`)">
                                    Editar
                                    <Pencil1Icon class="w-4 h-4" />
                                </Button>
                            </div>
                            <Separator class="my-4" />

                            <div class="flex flex-col ">
                                <span class="text-lg font-bold">Observaciones: </span>
                                <span>{{ selectedAudiom.observaciones ?? '---'}}</span>
                            </div>
                        </div>

                        <Separator class="my-4" />

                        <div class="w-[100%] h-[calc(100%-5rem)] flex justify-center items-center">
                            <div v-if="selectedAudiom?.linkPDF" class="w-[95%] h-[100%] border rounded-lg overflow-hidden">
                                <iframe :src="filePDF" class="w-full h-full border-none" frameborder="0"
                                    allowfullscreen></iframe>
                            </div>
                            <p v-else class="text-gray-500 mb-[20rem] ">No hay PDF Registrado.</p>
                        </div>
                    </div>
                </div>

            </div>

            <div v-else>
                <h1>No hay audiometrías registradas.</h1>
            </div>
        </div>
    </div>
    <div class="page" v-else>
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
                <BreadcrumbItem>
                    <BreadcrumbPage>Audiometrías</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
        <div class="pt-2 mb-4 " >
            <div  class="flex flex-col justify-between items-start px-[5rem] ">
                <div class="w-full ">
                    <h3 class="page-subtitle text-center">Cliente con id={{ route.params.idCliente }} no encontrado</h3>
                </div>
            </div>
        </div>
    </div>
    <AlertError v-model="showError" title="Error" :message="errorMessage" button="Aceptar"
            :action="()=>{showError=false}" />
</template>


<style scoped>
iframe {
    background-color: #fff;
}
</style>
