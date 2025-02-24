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
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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
import { computed, onMounted, ref } from 'vue'
import { Cliente } from '@/api/entities/clientes';
import { clientesApi } from '@/api/libs/clientes';

const showSuccess = ref<boolean>(false);
const showError = ref<boolean>(false);
const errorMessage =ref<string>('');
const loading = ref<boolean>(false);
const submitted = ref<boolean>(false);
const searchClienteOpen = ref<boolean>(false);
const searchClientesTxt = ref<string>('');
const selectedCliente = ref<Cliente>();
const foundClientes = ref<Cliente[]>([])

const formSchema = toTypedSchema(createAudiometriaValidator)
const {handleSubmit} = useForm({
    validationSchema: formSchema
})

onMounted(async()=>{
    // TODO pagination
    foundClientes.value = await clientesApi.getAll();
})

const onSubmit = handleSubmit(async (values) => {
    loading.value=true;
    try {
        const fromData = new FormData()
        await audiometriasApi.create(values, fromData )
        loading.value=false;
        showSuccess.value = true;
        router.replace('/audiometrias')
        toast({
            title: 'Proveedor registrado con éxito',
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
}

const searchClientes = async()=>{
    // TODO pagination and search
    console.log(searchClientesTxt.value)
    foundClientes.value = await clientesApi.getPaginated(searchClientesTxt.value)
}

const selectedClienteName = computed(()=>selectedCliente.value  ? `${selectedCliente.value.apellido}, ${selectedCliente.value.nombre}` : 'Buscar')

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
                <FormItem class="h-[5rem] mt-6">
                    <div class="form-item">
                        <FormLabel class="form-label">Cliente</FormLabel>
                        <FormControl>
                            <Input type="text" class="w-[32rem]" v-model="selectedClienteName" disabled @click="searchClienteOpen=true" />
                        </FormControl>
                        <Dialog  v-model:open="searchClienteOpen">
                            <DialogTrigger as-child>
                            <Button variant="default" size="icon" class="w-12 h-9 ml-4" >
                                <MagnifyingGlassIcon />
                            </Button>
                            </DialogTrigger>
                            <DialogContent class="w-[40rem] max-w-[40rem] px-8">
                            <DialogHeader>
                                <DialogTitle class="text-center">Audiometría: Seleccionar Cliente</DialogTitle>
                            </DialogHeader>
                            <Separator class="my-2" />
                            <div class="flex flex-row justify-between px-4">
                                <Input type="text"  v-model="searchClientesTxt" class="mr-4" />
                                <Button variant="default" size="icon" class="w-12 h-9" @click="searchClientes()" >
                                    <MagnifyingGlassIcon />
                                </Button>
                            </div>
                               <ScrollArea class="h-[15rem] w-[35rem] pl-4  ">
                                    <div 
                                        v-for="cliente in foundClientes" 
                                        :key="cliente.id" 
                                        @click="()=>{selectedCliente=cliente; searchClienteOpen=false}"
                                        class="cursor-pointer search-area-item hover:bg-secondary  px-4 py-4  w-[32rem]"
                                    >
                                        {{ cliente.apellido }} , {{ cliente.nombre }}
                                    </div>
                                </ScrollArea>
                            </DialogContent>
                        </Dialog>

                    </div>
                     <FormMessage class="form-message" v-if="submitted && errorMessage">{{ errorMessage }}</FormMessage>
                </FormItem>
                </FormField>
                
                <FormField v-slot="{ componentField, errorMessage }" name="observaciones">
                <FormItem class="h-[5rem] mt-6">
                    <div class="form-item">
                        <FormLabel class="form-label">Observaciones</FormLabel>
                        <FormControl>
                            <Input type="text" v-bind="componentField" />
                        </FormControl>
                    </div>
                     <FormMessage class="form-message" v-if="submitted && errorMessage">{{ errorMessage }}</FormMessage>
                </FormItem>
                </FormField>


                <div class="form-footer w-full flex flex-row justify-end mt-8 mb-6">
                    <Button variant="outline" class="w-[25%] mr-5" @click="router.replace('/proveedores')"  >Cancelar</Button>

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
