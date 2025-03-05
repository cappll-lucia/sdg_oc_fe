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
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Label } from '@/components/ui/label'
import { toast } from '@/components/ui/toast'
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input'
import { SlashIcon } from '@radix-icons/vue';
import { toTypedSchema } from '@vee-validate/zod'
import { editAudiometriaValidator, Audiometria } from '@/api/entities/audiometrias';
import { audiometriasApi } from '@/api/libs/audiometrias';
import { useForm } from 'vee-validate';
import AlertError from '@/components/AlertError.vue';
import router from '@/router/index';
import {onMounted, ref } from 'vue'
import { useRoute } from 'vue-router';
import AlertConfirm from '@/components/AlertConfirm.vue';
import { VPdfViewer } from '@vue-pdf-viewer/viewer';

const currentAudiometria = ref<Audiometria>();
const route = useRoute();


const showSuccess = ref<boolean>(false);
const showError = ref<boolean>(false);
const errorMessage =ref<string>('');
const loading = ref<boolean>(false);
const submitted = ref<boolean>(false);
const audiometriaURL = ref();
const audiometriaFile = ref();
const errorPDF =ref<string>('');
const targetUpdate = ref();
const showNewPDFAlert = ref(false); 
const newPDF = ref(false);

const fechaInforme = ref({
  day: '',
  month: '',
  year: ''
})

const formSchema = toTypedSchema(editAudiometriaValidator)
const {handleSubmit, setValues } = useForm({ 
   validationSchema: formSchema,
    initialValues: { }
})


onMounted(async()=>{
    currentAudiometria.value = await audiometriasApi.getOne(Number(route.params.id));
    if(currentAudiometria.value){
         const date = new Date(currentAudiometria.value.fechaInforme);
        fechaInforme.value.day = date.getUTCDate().toString();
        fechaInforme.value.month = (date.getUTCMonth() +1 ).toString();
        fechaInforme.value.year = date.getUTCFullYear().toString();
        setValues({
            fechaInforme:{
                day: fechaInforme.value.day,
                month: fechaInforme.value.month,
                year: fechaInforme.value.year, 
            }
        });
        currentAudiometria.value.fechaInforme = new Date(currentAudiometria.value.fechaInforme);
        audiometriaURL.value = currentAudiometria.value.linkPDF;
    }
})

const onSubmit = handleSubmit(async (values) => {
    loading.value=true;
    errorPDF.value = '';

    if (audiometriaFile.value && audiometriaFile.value?.type !== 'application/pdf') {
        errorPDF.value = 'Archivo inválido, debe ser un PDF';
        audiometriaFile.value = null;
        return;
    }
    try {
        if(currentAudiometria.value){
            if(newPDF){
                const fromData = new FormData()
                await audiometriasApi.edit( currentAudiometria.value?.id ,values, fromData )
            }else{
                await audiometriasApi.edit( currentAudiometria.value?.id ,values )
            }
            loading.value=false;
            showSuccess.value = true;
            router.replace('/audiometrias')
            toast({
                title: 'Audiometría actualizada con éxito',
            })
        }
    } catch (err: any) {
        errorMessage.value=err.message as string
        showError.value = true;
        loading.value=false;
    };
})



const validateAndSubmit = async()=>{
    submitted.value =true;
    await onSubmit();
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
            errorPDF.value = 'Archivo inválido, debe ser un PDF';
            audiometriaFile.value = null;
        } else {
            errorPDF.value = '';
            audiometriaFile.value = file;
            audiometriaURL.value = URL.createObjectURL(file);
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
                <div class="flex flex-row w-[100%] h-[40rem] justify-between items-start">
                
                 <div class="flex flex-col w-[45%] h-full">

                     <div class="flex items-center justify-between mb-4">
                                <Label class="form-label w-[7rem] text-right">Cliente</Label>
                                <Input type="text" disabled :value="`${currentAudiometria?.cliente.apellido}, ${ currentAudiometria?.cliente.nombre }`" class="w-[20rem] mr-[7rem]"/>
                            </div>


                    <FormField v-slot="{ handleChange, errorMessage }" name="fechaInforme">
                        <FormItem class="h-[5rem] mt-2">
                            <div class="flex flex-row justify-between items-center">
                            <FormLabel class="w-[7rem] text-right">Fecha de Informe</FormLabel>
                            <FormControl>
                                <div class="flex gap-2 w-[27rem] ">
                                <Input type="text" v-model="fechaInforme.day" placeholder="DD" class="w-16 text-center" maxlength="2"
                                    @input="handleChange({ ...fechaInforme, day: $event.target.value.trim() })"/>
                                <Input type="text" v-model="fechaInforme.month" placeholder="MM" class="w-16 text-center" maxlength="2"
                                    @input="handleChange({ ...fechaInforme, month: $event.target.value.trim() })"/>
                                <Input type="text" v-model="fechaInforme.year" placeholder="AAAA" class="w-20 text-center" maxlength="4"
                                    @input="handleChange({ ...fechaInforme, year: $event.target.value.trim() })"/>
                                </div>
                            </FormControl>
                        </div>
                        <FormMessage class="form-message-wide" v-if="submitted && errorMessage">{{ errorMessage }}</FormMessage>
                        </FormItem>
                    </FormField>
                    
                    <div class="h-[5rem] mt-2 w-full">
                            <div class="flex items-center justify-between">
                                <Label class="w-[7rem] text-right ">PDF</Label>
                                    <Input type="file" class="w-[27rem]" accept=".pdf" @change="confirmFileUpload" />
                            </div>
                            <span class=" text-sm text-destructive ml-[9rem]" v-if="submitted && errorPDF">{{ errorPDF }}</span>
                    </div>

                    <FormField v-slot="{ componentField, errorMessage }" name="observaciones">
                    <FormItem class="h-[15rem] mt-2 w-full">
                        <div class="flex items-start justify-between">
                            <FormLabel class="w-[7rem] text-right ">Observaciones</FormLabel>
                             <FormControl>
                                <Textarea
                                    class="resize-none w-[27rem] h-[15rem]"
                                    v-bind="componentField"
                                />
                            </FormControl>
                        </div>
                        <FormMessage class="form-message" v-if="submitted && errorMessage">{{ errorMessage }}</FormMessage>
                    </FormItem>
                    </FormField>
                </div>
                 <div class="flex flex-col w-[50%] h-full">
                    <p>{{ audiometriaURL }}</p>
                        <div v-if="audiometriaURL" class="w-[95%] h-[100%] border rounded-lg overflow-hidden">
                            <iframe :src="audiometriaURL" class="w-full h-full border-none" frameborder="0"
                            allowfullscreen></iframe>
                            

                            <!-- <VPdfViewer  src="https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf" /> -->
                        </div>
                        <div v-else class="flex justify-center items-center w-full h-full border rounded-md">
                            <span class="font-light color-secondary">Ningún PDF Seleccionado</span>
                        </div>
                </div>

                </div>
                <div class="form-footer w-full flex flex-row justify-end mt-8 mb-6 pr-8">
                    <Button variant="outline" class="w-[15%] mr-5" @click="router.replace('/audiometrias')"  >Cancelar</Button>
                    <Button type="submit" class="w-[15%]">{{ loading ? 'Cargando...' : 'Guardar' }}</Button>
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
