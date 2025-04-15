<script lang="ts" setup>
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { toast } from '@/components/ui/toast'
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input'
import { SlashIcon, AsteriskIcon} from 'lucide-vue-next';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { Audiometria, editAudiometriaCustomValidator } from '@/api/entities/audiometrias';
import { audiometriasApi } from '@/api/libs/audiometrias';
import AlertError from '@/components/AlertError.vue';
import router from '@/router/index';
import {onMounted, ref } from 'vue'
import { useRoute } from 'vue-router';
import AlertConfirm from '@/components/AlertConfirm.vue';
import { uploadsApi } from '@/api/libs/uploads';
import { useLoaderStore } from '@/stores/LoaderStore';
import Textarea from '@/components/ui/textarea/Textarea.vue';


const currentAudiometria = ref<Audiometria>();
const route = useRoute();
const loader = useLoaderStore();

const showError = ref<boolean>(false);
const errorMessage =ref<string>('');
const editedAudiometriaFile = ref<boolean>(false);
const audiometriaURL = ref();
const audiometriaFile = ref();
const errorPDF =ref<string>('');
const targetUpdate = ref();
const showNewPDFAlert = ref(false); 

const fechaInforme = ref({
  day: '',
  month: '',
  year: ''
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
    currentAudiometria.value = await audiometriasApi.getOne(Number(route.params.id));
    if(currentAudiometria.value){
        currentAudiometria.value.fechaInforme = new Date(currentAudiometria.value.fechaInforme)
        fechaInforme.value.day = currentAudiometria.value.fechaInforme.getDate().toString()
        fechaInforme.value.month = (currentAudiometria.value.fechaInforme.getMonth()+1).toString()
        fechaInforme.value.year = currentAudiometria.value.fechaInforme.getFullYear().toString()
        fechaInforme.value.day= fechaInforme.value.day;
        fechaInforme.value.month= fechaInforme.value.month;
        fechaInforme.value.year= fechaInforme.value.year; 
        currentAudiometria.value.fechaInforme = new Date(currentAudiometria.value.fechaInforme);
        audiometriaFile.value = await uploadsApi.getFile(`audiometrias/${currentAudiometria.value?.linkPDF}`)
    }
})

const onSubmit = async () => {
    try {
        if(currentAudiometria.value){
            currentAudiometria.value.fechaInforme = new Date(parseInt(fechaInforme.value.year), parseInt(fechaInforme.value.month)-1, parseInt(fechaInforme.value.day))
            if(editedAudiometriaFile.value){
                await audiometriasApi.edit( currentAudiometria.value?.id ,currentAudiometria.value, audiometriaFile.value )
            }else{
                await audiometriasApi.edit( currentAudiometria.value?.id ,currentAudiometria.value )
            }
            router.push(`/audiometrias/${currentAudiometria.value.cliente.id}`)
            loader.hide();
            toast({
                title: 'Audiometría registrada con éxito',
            })
        }
    } catch (err: any) {
        errorMessage.value=err.message as string
        showError.value = true;
        loader.hide();
    };
}



const validateAndSubmit = async()=>{
    if(currentAudiometria.value){
        loader.show();
        errorPDF.value = '';
        let resultAudiometria
        if(!editedAudiometriaFile.value){
            resultAudiometria = editAudiometriaCustomValidator({cliente: currentAudiometria?.value.cliente, observaciones: currentAudiometria.value?.observaciones }, fechaInforme.value, undefined);
        }else{
            resultAudiometria = editAudiometriaCustomValidator({cliente: currentAudiometria?.value.cliente, observaciones: currentAudiometria.value?.observaciones }, fechaInforme.value, audiometriaFile.value);
        }
        isValidAudiometria.value = resultAudiometria.isValid;
        if(resultAudiometria.success){
            await onSubmit();
        }else {
            if(!isValidAudiometria.value.file){
                if (audiometriaFile.value && audiometriaFile.value?.type !== 'application/pdf') {
                    errorPDF.value = 'Archivo inválido, debe ser un PDF';
                    audiometriaFile.value = null;
                    isValidAudiometria.value.file=false;

                }
            }
        }
        loader.hide();
    }
}

const confirmFileUpload = (event: Event) => {
    targetUpdate.value = event.target as HTMLInputElement;
    showNewPDFAlert.value=true;
};

const handleFileUpload = () => {
    showNewPDFAlert.value=false;
    if (targetUpdate.value.files && targetUpdate.value.files.length > 0) {
        const file = targetUpdate.value.files[0];
        if (file?.type !== 'application/pdf') {
            isValidAudiometria.value.file=false;
            errorPDF.value = 'Archivo inválido, debe ser un PDF';
            audiometriaFile.value = null;
        } else {
            errorPDF.value = '';
            audiometriaFile.value = file;
            audiometriaURL.value = URL.createObjectURL(file);
            editedAudiometriaFile.value = true;
        }
    }
};


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
                    <BreadcrumbLink href="/audiometrias">
                        Audiometrias
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                    <SlashIcon />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                    <BreadcrumbPage>Editar</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
        <div class="pt-2 mb-4 " >
            <form @submit.prevent="validateAndSubmit" class="forms-wide h-[45rem] flex flex-col justify-start items-start bg-red-500 px-[5rem]">
                 <div class="w-full ">
                    <h3 class="page-subtitle text-center" >Actualizar Audiometría</h3>
                    <Separator class="my-6 w-full" />
                </div>
                <div class="flex flex-row w-[100%] h-[40rem] justify-center items-start">
                
                 <div v-if="currentAudiometria" class="flex flex-col w-[55%] h-full justify-center items-center ">
                     <div class="h-[5rem] w-[43rem] flex flex-row items-center justify-start  ">
                        <Label class="form-label w-[7rem] mr-[2rem] text-right">Cliente</Label>
                        <Label class="w-[20rem] border p-4 rounded-lg ">{{currentAudiometria.cliente.apellido}}, {{ currentAudiometria.cliente.nombre }}</Label>
                    </div>


                    
                        <div class="flex flex-row items-center justify-start h-[5rem] w-[43rem] ">
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
                    
                    
                        <div class="flex flex-row items-center justify-start h-[5rem] w-[43rem] ">
                            <Label class="w-[7rem] mr-[2rem] text-right ">PDF</Label>
                                <Input type="file" class="w-[25rem]" accept=".pdf" @change="confirmFileUpload" />
                            <TooltipProvider v-if="!isValidAudiometria.file" >
                                <Tooltip>
                                <TooltipTrigger class="bg-transparent text-xs text-destructive ml-4 "> <AsteriskIcon :size="14" /> </TooltipTrigger>
                                <TooltipContent class="text-destructive border-destructive font-thin text-xs">
                                    <p>{{errorPDF}}</p>
                                </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                         </div>

                        <div class="h-[12rem] w-[43rem] ">
                            <div class="flex flex-row items-start justify-start">
                                <Label class="w-[7rem] mr-[2rem] text-right ">Observaciones</Label>
                                    <Textarea
                                        class="resize-none w-[25rem] h-[12rem]"
                                        v-model="currentAudiometria.observaciones"
                                    />
                            </div>
                        </div>

                </div>
                 <div class="flex flex-col w-[50%] h-full" v-if="!editedAudiometriaFile">
                        <div v-if="audiometriaFile" class="w-[95%] h-[100%] border rounded-lg overflow-hidden">
                            <iframe :src="audiometriaFile" class="w-full h-full border-none" frameborder="0"
                            allowfullscreen></iframe>
                        </div>
                        <div v-else class="flex justify-center items-center w-full h-full border rounded-md">
                            <span class="font-light color-secondary">Ningún PDF Seleccionado</span>
                        </div>
                </div>
                 <div class="flex flex-col w-[50%] h-full" v-if="editedAudiometriaFile">
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
                    <Button variant="outline" class="w-[15%] mr-5" @click="router.push('/audiometrias')"  >Cancelar</Button>
                    <Button type="submit" class="w-[15%]">Guardar</Button>
                </div>
                
            </form>


        </div>>

        <AlertError 
            v-model="showError"
            title="Error"
            :message="errorMessage"
            button="Aceptar"
            :action="()=>{showError=false}"
        />

        <AlertConfirm
            v-model="showNewPDFAlert"
            title="¿Está seguo de actualizar el PDF?"
            message="Al almacenar el nuevo PDF, se eliminará el anterior"
            primary-btn="Aceptar"
            :primary-action="handleFileUpload"
            secondary-btn="Cancelar"
            :secondary-action="()=>showNewPDFAlert=false"
        />
    
    
    </div>
</template>
