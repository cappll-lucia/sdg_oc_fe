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
import { editMarcaValidator, Marca } from '@/api/entities/marca';
import { useForm } from 'vee-validate';
import AlertError from '@/components/AlertError.vue';
import router from '@/router/index';
import { marcasApi } from '@/api/libs/marcas';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const currentMarca = ref<Marca>();

const showError = ref<boolean>(false);
const errorMessage =ref<string>('');
const loading = ref<boolean>(false);


const formSchema = toTypedSchema(editMarcaValidator)
const {handleSubmit, setValues} = useForm({
    validationSchema: formSchema,
    initialValues: {nombre: ''}
})

onMounted(async ()=>{
    currentMarca.value = await marcasApi.getOne(Number(route.params.id));
    if (currentMarca.value) {
        setValues({ nombre: currentMarca.value.nombre });
    }
})

const onSubmit = handleSubmit(async (values) => {
    loading.value=true;
    try {
        if(currentMarca.value){
            await marcasApi.edit(currentMarca.value.id, values)
            loading.value=false;
            router.replace('/marcas')
            toast({
                title: 'Marca actualizada con éxito',
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
                    <BreadcrumbLink href="/marcas">
                        Marcas
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
        <h1 class="page-title ">Marcas</h1>
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
                    <Button variant="outline" class="w-[25%] mr-5" :onclick="()=> {router.replace('/marcas')}"  >Cancelar</Button>
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