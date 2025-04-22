<script lang="ts" setup>
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';

import { SlashIcon, AsteriskIcon} from 'lucide-vue-next';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'
import {Textarea} from '@/components/ui/textarea';
import { Label } from '@/components/ui/label'
import { toast } from '@/components/ui/toast'
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input'
import { audiometriaCustomValidator } from '@/api/entities/audiometrias';
import { audiometriasApi } from '@/api/libs/audiometrias';
import AlertError from '@/components/AlertError.vue';
import { router } from '@/router/index';
import {computed, onMounted, ref } from 'vue'
import { Cliente } from '@/api/entities/clientes';
import { clientesApi } from '@/api/libs/clientes';
import SelectClienteDialog from '@/components/SelectClienteDialog.vue';
import { useLoaderStore } from '@/stores/LoaderStore';
import { useRoute } from 'vue-router';

const loader = useLoaderStore();
const route = useRoute()

const showError = ref<boolean>(false);
const errorMessage =ref<string>('');
const errorPDF =ref<string>('');
const searchClienteOpen = ref<boolean>(false);
const selectedCliente = ref<Cliente | null>(null);
const audiometriaFile = ref<any>(null);
const audiometriaURL = ref(); //TODO REMOVE


const fechaInforme = ref({
  day: '',
  month: '',
  year: ''
})

const newAudiometria = ref<{
    cliente: {
        id: undefined | number
    },
    observaciones: string | undefined,
    fechaInforme: Date | undefined,
}>({
    cliente: {
        id: undefined
    },
    fechaInforme: undefined,
    observaciones: undefined
})

const isValidAudiometria = ref<{
    cliente: boolean,
    fechaInforme: boolean,
    file: boolean
}>({
    cliente: true,
    fechaInforme: true,
    file: true
})


onMounted(async()=>{
    try{
        loader.show();
        const query = route.query
        if(query.cliente){
            const foundCliente = await clientesApi.getOne(Number(query.cliente))
            if(foundCliente) handleSelectCliente(foundCliente)
        }
        loader.hide();
    } catch (err: any) {
        errorMessage.value=err.message as string
        showError.value = true;
        loader.hide();
    };
})

const onSubmit = async () => {
    loader.show()
    try {
        newAudiometria.value.fechaInforme = new Date(parseInt(fechaInforme.value.year), parseInt(fechaInforme.value.month)-1, parseInt(fechaInforme.value.day))
        await audiometriasApi.create(newAudiometria.value, audiometriaFile.value )
        router.push(`/clientes/dashboard/${newAudiometria.value.cliente.id}`)
        toast({
            title: 'Audiometría registrada con éxito',
        })
        loader.hide();
    } catch (err: any) {
        errorMessage.value=err.message as string
        showError.value = true;
        loader.hide();
    };
}

const validateAndSubmit = async () => {
    errorPDF.value = '';
    const resultAudiometria = audiometriaCustomValidator(newAudiometria.value, fechaInforme.value, audiometriaFile.value);
    isValidAudiometria.value = resultAudiometria.isValid;
    if(resultAudiometria.success){
        await onSubmit();
    }else {
        if(!isValidAudiometria.value.file){
            if (!audiometriaFile.value) {
                errorPDF.value = 'Suba el archivo del informe';
                audiometriaFile.value = null; 
                return;
            }
            if (audiometriaFile.value?.type !== 'application/pdf') {
                errorPDF.value = 'Archivo inválido, debe ser un PDF';
                audiometriaFile.value = null;
                return;
            }
        }
    }
    loader.hide()
};


const handleFileUpload = (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
        const file = target.files[0];
        if (file?.type !== 'application/pdf') {
            errorPDF.value = 'Archivo inválido, debe ser un PDF';
            audiometriaFile.value = null;
        } else {
            errorPDF.value = '';
            audiometriaFile.value = file;
            audiometriaURL.value = URL.createObjectURL(file);

        }
    }
};

const handleSelectCliente = (cliente:Cliente)=>{
    selectedCliente.value=cliente;
    newAudiometria.value.cliente.id = cliente.id;
    searchClienteOpen.value=false;
}

const redirectCancel = ()=>{
    selectedCliente.value
    ? router.push(`/clientes/dashboard/${selectedCliente.value.id}`)
    : router.push(`/`)
}
const nombreCliente = computed(()=>  selectedCliente.value?.apellido +", "+ selectedCliente.value?.nombre);


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
                    <BreadcrumbLink :href="`/audiometrias/${selectedCliente?.id}`">
                        Audiometrias
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                    <SlashIcon />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                    <BreadcrumbPage>Nueva audiometría</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
        <div class="pt-2 mb-4 " >
            <form @submit.prevent="validateAndSubmit" class="forms-wide h-[45rem] flex flex-col justify-start items-start  px-[5rem]">
                 <div class="w-full ">
                    <h3 class="page-subtitle text-center" >Registrar Nueva Audiometría</h3>
                    <Separator class="my-6 w-full" />
                </div>
                <div class="flex flex-row w-[100%] h-[40rem] justify-center items-start">
                
                 <div class="flex flex-col w-[55%] h-full justify-center items-center ">
                         <div class="h-[5rem]  w-[43rem] ">
                                    <div class="flex flex-row items-center justify-start ">
                                        <Label class="form-label w-[7rem] mr-[2rem] text-right ">Cliente</Label>
                                        <div class="flex flex-row justify-start items-center">
                                            <Input type="text" 
                                                class="w-[20rem] h-10"
                                                readonly
                                                :value="selectedCliente ? `${selectedCliente.apellido}, ${selectedCliente.nombre}` : 'Buscar'"
                                                @click="searchClienteOpen = true"
                                            />
                                            <SelectClienteDialog
                                                v-model="searchClienteOpen"
                                                title="Nueva Audiometría: Seleccionar Cliente"
                                                @select-cliente="handleSelectCliente"
                                            />
                                             <TooltipProvider v-if="!isValidAudiometria.cliente" >
                                                <Tooltip>
                                                <TooltipTrigger class="bg-transparent text-xs text-destructive ml-4"> <AsteriskIcon :size="14" /> </TooltipTrigger>
                                                <TooltipContent class="text-destructive border-destructive font-thin text-xs">
                                                    <p>Seleccionar cliente</p>
                                                </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </div>
                                    </div>
                            </div>


                         <div class="h-[5rem] w-[43rem] ">
                                <div class="flex flex-row items-center justify-start w-full ">
                                    <Label class="w-[7rem] mr-[2rem] text-right">Fecha Receta</Label>
                                    <div class="flex gap-2">
                                        <Input type="text" v-model="fechaInforme.day" placeholder="DD" class="w-16 text-center" maxlength="2" />
                                        <Input type="text" v-model="fechaInforme.month" placeholder="MM" class="w-16 text-center" maxlength="2" />
                                        <Input type="text" v-model="fechaInforme.year" placeholder="AAAA" class="w-20 text-center" maxlength="4" />
                                    </div>
                                    <TooltipProvider v-if="!isValidAudiometria.fechaInforme" >
                                        <Tooltip>
                                        <TooltipTrigger class="bg-transparent text-xs text-destructive ml-4 "> <AsteriskIcon :size="14" /> </TooltipTrigger>
                                        <TooltipContent class="text-destructive border-destructive font-thin text-xs">
                                            <p>Ingresar una fecha válida</p>
                                        </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                            </div>
                    
                        <div class="h-[5rem] w-[43rem] ">
                            <div class="flex flex-row items-center justify-start w-full ">
                                <Label class="w-[7rem] mr-[2rem] text-right ">PDF</Label>
                                    <Input type="file" class="w-[25rem]" accept=".pdf" @change="handleFileUpload" />
                                <TooltipProvider v-if="!isValidAudiometria.file" >
                                    <Tooltip>
                                    <TooltipTrigger class="bg-transparent text-xs text-destructive ml-4 "> <AsteriskIcon :size="14" /> </TooltipTrigger>
                                    <TooltipContent class="text-destructive border-destructive font-thin text-xs">
                                        <p>{{errorPDF}}</p>
                                    </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                             </div>
                    </div>

                    <div class="h-[12rem] w-[43rem] ">
                        <div class="flex flex-row items-start justify-start">
                            <Label class="w-[7rem] mr-[2rem] text-right ">Observaciones</Label>
                                <Textarea
                                    class="resize-none w-[25rem] h-[12rem]"
                                    v-model="newAudiometria.observaciones"
                                />
                        </div>
                    </div>
                </div>
                 <div class="flex flex-col w-[40%] mr-7 h-full">
                        <div v-if="audiometriaURL" class="w-[95%] h-[100%] border rounded-lg overflow-hidden">
                            <iframe :src="audiometriaURL" class="w-full h-full border-none" frameborder="0"
                            allowfullscreen></iframe>
                        </div>
                        <div v-else class="flex justify-center items-center w-full h-full border rounded-md">
                            <span class="font-light color-secondary">Ningún PDF Seleccionado</span>
                        </div>
                </div>

                </div>
                <div class="form-footer w-full flex flex-row justify-end mt-8 mb-6 pr-8">
                    <Button variant="outline" class="w-[15%] mr-5" @click="redirectCancel"  >Cancelar</Button>
                    <Button type="submit" class="w-[15%]">Guardar</Button>
                </div>
                
            </form>


        </div>

        <AlertError 
        v-model="showError"
        title="Error"
        :message="errorMessage"
        button="Aceptar"
        :action="()=>{showError=false}"
        />
    
    
    </div>
</template>
