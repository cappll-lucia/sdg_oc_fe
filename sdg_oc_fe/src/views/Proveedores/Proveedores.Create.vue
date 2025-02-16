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
import { toast } from '@/components/ui/toast'
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input'
import { SlashIcon } from '@radix-icons/vue';
import { toTypedSchema } from '@vee-validate/zod'
import { createProveedorValidator } from '@/api/entities/proveedor';
import { useForm } from 'vee-validate';
import AlertError from '@/components/AlertError.vue';
import { router } from '@/router';
import { proveedoresApi } from '@/api/libs/proveedores';
import { ref } from 'vue'


const showSuccess = ref<boolean>(false);
const showError = ref<boolean>(false);
const errorMessage =ref<string>('');
const loading = ref<boolean>(false);


const formSchema = toTypedSchema(createProveedorValidator)
const {handleSubmit} = useForm({
    validationSchema: formSchema
})



const onSubmit = handleSubmit(async (values) => {
    loading.value=true;
    try {
        await proveedoresApi.create(values)
        loading.value=false;
        showSuccess.value = true;
        router.replace('/proveedores')
        toast({
            title: 'Proveedor registrado con éxito',
        })
    } catch (err: any) {
        errorMessage.value=err.message as string
        showError.value = true;
        loading.value=false;
    };
})

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
                    <BreadcrumbLink href="/">
                        Parámetros
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                    <SlashIcon />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                    <BreadcrumbLink href="/proveedores">
                        Proveedores
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
        <h1 class="page-title ">Proveedores</h1>
        <div class="pt-2" >
            <form @submit="onSubmit" class="forms">
                <h3 class="page-subtitle" >Registrar Nuevo Proveedor</h3>
                <Separator class="my-6" />
                
                <FormField v-slot="{ componentField }" name="razonSocial">
                <FormItem class="h-[5rem]">
                    <div class="form-item">
                        <FormLabel class="form-label">Razon Social</FormLabel>
                        <FormControl>
                            <Input type="text" v-bind="componentField" />
                        </FormControl>
                    </div>
                    <FormMessage class="form-message"/>
                </FormItem>
                </FormField>

                <FormField v-slot="{ componentField }" name="cuit">
                <FormItem class="h-[5rem]">
                    <div class="form-item">
                        <FormLabel class="form-label">CUIT</FormLabel>
                        <FormControl>
                            <Input type="text" v-bind="componentField" />
                        </FormControl>
                    </div>
                    <FormMessage class="form-message"/>
                </FormItem>
                </FormField>
                
                <FormField v-slot="{ componentField }" name="email">
                <FormItem class="h-[5rem]">
                    <div class="form-item">
                        <FormLabel class="form-label">Email</FormLabel>
                        <FormControl>
                            <Input type="text" v-bind="componentField" />
                        </FormControl>
                    </div>
                    <FormMessage class="form-message"/>
                </FormItem>
                </FormField>

                <FormField v-slot="{ componentField }" name="telefono">
                <FormItem class="h-[5rem]">
                    <div class="form-item">
                        <FormLabel class="form-label">Telefono</FormLabel>
                        <FormControl>
                            <Input type="text" v-bind="componentField" />
                        </FormControl>
                    </div>
                    <FormMessage class="form-message"/>
                </FormItem>
                </FormField>

                <div class="form-footer w-full flex flex-row justify-end mt-4">
                    <Button variant="outline" class="w-[25%] mr-5">Cancelar</Button>

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
