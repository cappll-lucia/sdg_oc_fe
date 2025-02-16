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
import { createMarcaValidator } from '@/api/entities/marca';
import { useForm } from 'vee-validate';
import {ref} from 'vue';
import AlertError from '@/components/AlertError.vue';
import { router } from '@/router';

const showSuccess = ref<boolean>(false);
const showError = ref<boolean>(false);
const loading = ref<boolean>(false);


const formSchema = toTypedSchema(createMarcaValidator)
const {handleSubmit} = useForm({
    validationSchema: formSchema
})



const onSubmit = handleSubmit((values) => {
    loading.value=true;
    try {
        throw new Error('nnn')
        showSuccess.value = true;
        console.log(values)
        router.replace('/marcas')
        toast({
            title: 'Marca creada con éxito',
        })
    } catch (error) {
        console.error(error);
        showError.value = true;
    };
})

const closeErrorDialog = () => {
  console.log('Error dialog closed');
  showError.value = false;
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
                    <BreadcrumbLink href="/">
                        Parámetros
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                    <SlashIcon />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                    <BreadcrumbPage>Marcas</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
        <h1 class="page-title ">Marcas</h1>
        <div class="pt-2">
            <form @submit="onSubmit" class="forms">
                <h3 class="page-subtitle" >Registrar Nueva Marca</h3>
                <Separator class="my-6" />
                
                <FormField v-slot="{ componentField }" name="nombre">
                <FormItem class="h-[5rem]">
                    <div class="form-item">
                        <FormLabel class="form-label">Nombre</FormLabel>
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
        message="Hubo un problema al registrar la marca."
        button="Aceptar"
        :action="closeErrorDialog"
        />
    
    </div>
</template>