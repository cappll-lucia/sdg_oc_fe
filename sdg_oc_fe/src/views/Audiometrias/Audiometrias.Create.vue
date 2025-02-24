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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {Textarea} from '@/components/ui/textarea';
import {
  User,
} from 'lucide-vue-next'
import {ScrollArea} from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label'
import { toast } from '@/components/ui/toast'
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input'
import { SlashIcon, MagnifyingGlassIcon } from '@radix-icons/vue';
import { toTypedSchema } from '@vee-validate/zod'
import { createAudiometriaValidator } from '@/api/entities/audiometrias';
import { audiometriasApi } from '@/api/libs/audiometrias';
import { useForm } from 'vee-validate';
import AlertError from '@/components/AlertError.vue';
import router from '@/router/index';
import {onMounted, ref } from 'vue'
import { Cliente } from '@/api/entities/clientes';
import { clientesApi } from '@/api/libs/clientes';

const showSuccess = ref<boolean>(false);
const showError = ref<boolean>(false);
const errorMessage =ref<string>('');
const errorPDF =ref<string>('');
const loading = ref<boolean>(false);
const submitted = ref<boolean>(false);
const searchClienteOpen = ref<boolean>(false);
const searchClientesTxt = ref<string>('');
const selectedCliente = ref<Cliente | null>(null);
const foundClientes = ref<Cliente[]>([]);
const audiometriaFile = ref<any>(null);

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
    foundClientes.value = await clientesApi.getAll();
})

const selectCliente = (cliente: Cliente) => {
    selectedCliente.value = cliente
    setFieldValue("cliente.id", selectedCliente.value.id);
    searchClienteOpen.value = false;
};

const onSubmit = handleSubmit(async (values) => {
    loading.value=true;
    errorPDF.value = '';
    console.log(audiometriaFile.value)
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
        // TODO Send files
        const fromData = new FormData()
        await audiometriasApi.create(values, fromData )
        loading.value=false;
        showSuccess.value = true;
        router.replace('/audiometrias')
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

const searchClientes = async()=>{
    foundClientes.value = await clientesApi.getPaginated(searchClientesTxt.value)
}

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
                    <BreadcrumbPage>Crear</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
        <div class="pt-2 flex w-full justify-center items-center" >
            <form @submit.prevent="validateAndSubmit" class="forms">
                <h3 class="page-subtitle text-center" >Registrar Nueva Audiometria</h3>
                <Separator class="my-6" />
                


                <FormField v-slot="{ errorMessage }" name="cliente.id">
                    <FormItem class="h-[5rem] mt-6 w-full">
                        <div class="flex items-center justify-between">
                            <FormLabel class="form-label w-[7rem] text-right">Cliente</FormLabel>
                            <div class="flex flex-row justify-end items-center">
                                <FormControl>
                                    <Input type="text" 
                                        class="w-[24rem] h-10"
                                        readonly
                                        :value="selectedCliente ? `${selectedCliente.apellido}, ${selectedCliente.nombre}` : 'Buscar'"
                                        @click="searchClienteOpen = true"
                                    />
                                </FormControl>
                                
                                <Dialog v-model:open="searchClienteOpen">
                                    <DialogTrigger as-child>
                                        <Button variant="default" size="icon" class="w-9 h-9 ml-4">
                                            <MagnifyingGlassIcon />
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent class="w-[60rem] h-[40rem] max-w-[60rem] px-8">
                                        <DialogHeader>
                                            <DialogTitle class="text-center">Audiometría: Seleccionar Cliente</DialogTitle>
                                        </DialogHeader>
                                        <Separator class="my-2" />
                                        <div class="flex flex-row justify-between px-4 h-2 mb-4">
                                            <Input type="text" v-model="searchClientesTxt" class="mr-4" @keyup.enter="searchClientes()" />
                                            <Button variant="default" size="icon" class="w-12 h-9" @click="searchClientes()">
                                                <MagnifyingGlassIcon />
                                            </Button>
                                        </div>
                                        <ScrollArea class="h-[30rem] w-[51rem] pl-4 mt-4">
                                            <div v-for="cliente in foundClientes" 
                                                :key="cliente.id" 
                                                @click="selectCliente(cliente)"
                                                class="cursor-pointer search-area-item hover:bg-secondary px-4 py-2 w-[49rem] flex flex-row justify-start items-center"
                                            >
                                                <User :size="35" class="border-secondary rounded-full bg-secondary p-2" />
                                                <span class="ml-4 text-sm">
                                                    {{ cliente.apellido }}, {{ cliente.nombre }}
                                                </span>
                                            </div>
                                        </ScrollArea>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>
                        <FormMessage class="ml-[9rem]" v-if="submitted && errorMessage">{{ errorMessage }}</FormMessage>
                    </FormItem>
                </FormField>


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
                                <Input type="file" class="w-[20rem] mr-[7rem]" accept=".pdf" @change="handleFileUpload" />

                        </div>
                        <span class=" text-sm text-destructive ml-[9rem]" v-if="submitted && errorPDF">{{ errorPDF }}</span>
                    </div>

                <FormField v-slot="{ componentField, errorMessage }" name="observaciones">
                <FormItem class="h-[5rem] mt-2 w-full">
                    <div class="flex items-start justify-between">
                        <FormLabel class="w-[7rem] text-right ">Observaciones</FormLabel>
                        <FormControl>
                            <Textarea
                                class="resize-none w-[27rem]"
                                v-bind="componentField"
                            />
                        </FormControl>
                    </div>
                     <FormMessage class="form-message" v-if="submitted && errorMessage">{{ errorMessage }}</FormMessage>
                </FormItem>
                </FormField>

                

                <div class="form-footer w-full flex flex-row justify-end mt-8 mb-6">
                    <Button variant="outline" class="w-[25%] mr-5" @click="router.replace('/audiometrias')"  >Cancelar</Button>

                    <Button type="submit" class="w-[25%]">{{ loading ? 'Cargando...' : 'Guardar' }}</Button>
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
