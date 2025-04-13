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
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {Textarea} from '@/components/ui/textarea';
import { Label } from '@/components/ui/label'
import { toast } from '@/components/ui/toast'
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input'
import { SlashIcon } from '@radix-icons/vue';
import { toTypedSchema } from '@vee-validate/zod'
import { createAudiometriaValidator } from '@/api/entities/audiometrias';
import { audiometriasApi } from '@/api/libs/audiometrias';
import { useForm } from 'vee-validate';
import AlertError from '@/components/AlertError.vue';
import router from '@/router/index';
import {onMounted, ref } from 'vue'
import { Cliente } from '@/api/entities/clientes';
import { clientesApi } from '@/api/libs/clientes';
import SelectClienteDialog from '@/components/SelectClienteDialog.vue';

const showSuccess = ref<boolean>(false);
const showError = ref<boolean>(false);
const errorMessage =ref<string>('');
const errorPDF =ref<string>('');
const loading = ref<boolean>(false);
const submitted = ref<boolean>(false);
const searchClienteOpen = ref<boolean>(false);
const selectedCliente = ref<Cliente | null>(null);
const foundClientes = ref<Cliente[]>([]);
const audiometriaFile = ref<any>(null);
const audiometriaURL = ref(); //TODO REMOVE

const fechaInforme = ref({
  day: '',
  month: '',
  year: ''
})


const formSchema = toTypedSchema(createAudiometriaValidator)
const {handleSubmit, setFieldValue} = useForm({
    validationSchema: formSchema
})

onMounted(async()=>{
    // TODO pagination
    const res= await clientesApi.getAll({});
    foundClientes.value = res.items
})

const onSubmit = handleSubmit(async (values) => {
    loading.value=true;
    errorPDF.value = '';
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
    try {
        await audiometriasApi.create(values, audiometriaFile.value )
        loading.value=false;
        showSuccess.value = true;
        router.push('/audiometrias')
        toast({
            title: 'Audiometría registrada con éxito',
        })
    } catch (err: any) {
        errorMessage.value=err.message as string
        showError.value = true;
        loading.value=false;
    };
})

const validateAndSubmit = async () => {
    submitted.value = true;
    await onSubmit();
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
    setFieldValue("cliente.id", selectedCliente.value.id);
    searchClienteOpen.value=false;
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
                    <BreadcrumbLink href="/audiometrias">
                        Audiometrias
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                    <SlashIcon />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                    <BreadcrumbPage>Crear</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
        <div class="pt-2 mb-4 " >
            <form @submit.prevent="validateAndSubmit" class="forms-wide h-[45rem] flex flex-col justify-start items-start  px-[5rem]">
                 <div class="w-full ">
                    <h3 class="page-subtitle text-center" >Registrar Nueva Audiometría</h3>
                    <Separator class="my-6 w-full" />
                </div>
                <div class="flex flex-row w-[100%] h-[40rem] justify-between items-start">
                
                 <div class="flex flex-col w-[45%] h-full ">
                    <FormField v-slot="{ errorMessage }" name="cliente.id">
                        <FormItem class="h-[5rem] mt-6 w-full">
                            <div class="flex items-center w-full  bg-emerald-300 justify-start">
                                <FormLabel class="form-label w-[7rem]  pr-4 text-right">Cliente</FormLabel>
                                <div class="flex flex-row w-[90%] justify-start items-center">
                                    <FormControl>
                                        <Input type="text" 
                                            class="w-[80%] h-10"
                                            readonly
                                            :value="selectedCliente ? `${selectedCliente.apellido}, ${selectedCliente.nombre}` : 'Buscar'"
                                            @click="searchClienteOpen = true"
                                        />
                                    </FormControl>
                                    <SelectClienteDialog
                                        v-model="searchClienteOpen"
                                        title="Nueva Audiometría: Seleccionar Cliente"
                                        @select-cliente="handleSelectCliente"
                                    />
                                </div>
                            </div>
                            <FormMessage class="ml-[9rem]" v-if="submitted && errorMessage">{{ errorMessage }}</FormMessage>
                        </FormItem>
                    </FormField>


                    <FormField v-slot="{ handleChange, errorMessage }" name="fechaInforme">
                        <FormItem class="h-[5rem] mt-2">
                            <div class="flex flex-row justify-between items-center">
                            <FormLabel class="w-[7rem] text-right pr-4">Fecha de Informe</FormLabel>
                            <FormControl>
                                <div class="flex gap-2 w-[80%] ">
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
                                <Label class="w-[7rem] text-right mr-2 ">PDF</Label>
                                    <Input type="file" class="w-[27rem]" accept=".pdf" @change="handleFileUpload" />

                            </div>
                            <span class=" text-sm text-destructive ml-[9rem]" v-if="submitted && errorPDF">{{ errorPDF }}</span>
                    </div>

                    <FormField v-slot="{ componentField, errorMessage }" name="observaciones">
                    <FormItem class="h-[12rem] mt-2 w-full">
                        <div class="flex items-start justify-between">
                            <FormLabel class="w-[7rem] text-right mr-2 ">Observaciones</FormLabel>
                            <FormControl>
                                <Textarea
                                    class="resize-none w-[27rem] h-[12rem]"
                                    v-bind="componentField"
                                />
                            </FormControl>
                        </div>
                        <FormMessage class="form-message" v-if="submitted && errorMessage">{{ errorMessage }}</FormMessage>
                    </FormItem>
                    </FormField>
                </div>
                 <div class="flex flex-col w-[50%] mr-7 h-full">
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
                    <Button type="submit" class="w-[15%]">{{ loading ? 'Cargando...' : 'Guardar' }}</Button>
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
