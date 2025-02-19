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
import { editObraSocialValidator, ObraSocial } from '@/api/entities/obraSocial';
import { useForm } from 'vee-validate';
import AlertError from '@/components/AlertError.vue';
import router from '@/router/index';
import { obrasSocialesApi } from '@/api/libs/obrasSociales';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const currentObraSocial = ref<ObraSocial>();

const showError = ref<boolean>(false);
const errorMessage =ref<string>('');
const loading = ref<boolean>(false);


const formSchema = toTypedSchema(editObraSocialValidator)
const {handleSubmit, setValues} = useForm({
    validationSchema: formSchema,
    initialValues: {nombre: ''}
})

onMounted(async ()=>{
    currentObraSocial.value = await obrasSocialesApi.getOne(Number(route.params.id));
    if (currentObraSocial.value) {
        setValues({ nombre: currentObraSocial.value.nombre });
    }
})

const onSubmit = handleSubmit(async (values) => {
    loading.value=true;
    try {
        if(currentObraSocial.value){
            await obrasSocialesApi.edit(currentObraSocial.value.id, values)
            loading.value=false;
            router.replace('/obras-sociales')
            toast({
                title: 'Obra Social actualizada con éxito',
            })
        }
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
                    <BreadcrumbLink href="/obras-sociales">
                        Obras Sociales
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
        <h1 class="page-title ">Obras Sociales</h1>
        <div class="pt-2" >
            <form @submit="onSubmit" class="forms">
                <h3 class="page-subtitle" >Editar Marca</h3>
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
                    <Button variant="outline" class="w-[25%] mr-5" :onclick="()=> {router.replace('/obras-sociales')}"  >Cancelar</Button>
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