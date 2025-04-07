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
import { useForm } from 'vee-validate';
import AlertError from '@/components/AlertError.vue';
import router from '@/router/index';
import { proveedoresApi } from '@/api/libs/proveedores';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { editProveedorValidator, Proveedor } from '@/api/entities/proveedor';

const route = useRoute();

const currentProv = ref<Proveedor>();

const showError = ref<boolean>(false);
const errorMessage =ref<string>('');
const loading = ref<boolean>(false);
const submitted = ref<boolean>(false);


const formSchema = toTypedSchema(editProveedorValidator)
const {handleSubmit, setValues} = useForm({
    validationSchema: formSchema,
    initialValues: {razonSocial: '', cuit: '', telefono: '', email: ''}
})

onMounted(async ()=>{
    currentProv.value = await proveedoresApi.getOne(Number(route.params.id));
    if (currentProv.value) {
        setValues({ 
            razonSocial: currentProv.value.razonSocial,
            cuit: currentProv.value.cuit,
            telefono: currentProv.value.telefono,
            email: currentProv.value.email
        });
    }
})

const onSubmit = handleSubmit(async (values) => {
    loading.value=true;
    try {
        if(currentProv.value){
            await proveedoresApi.edit(currentProv.value.id, values)
            loading.value=false;
            router.push('/proveedores')
            toast({
                title: 'Proveedor actualizado con éxito',
            })
        }
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
                    <BreadcrumbPage>Editar</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
        <div class="pt-2 flex  w-full justify-center items-center">
            <form @submit.prevent="validateAndSubmit" class="forms">
                <h3 class="page-subtitle text-center">Editar Proveedor</h3>
                <Separator class="my-6" />

                <FormField v-slot="{ componentField, errorMessage }" name="razonSocial">
                    <FormItem class="h-[5rem] mt-6">
                        <div class="form-item">
                            <FormLabel class="form-label">Razon Social</FormLabel>
                            <FormControl>
                                <Input type="text" v-bind="componentField" />
                            </FormControl>
                        </div>
                        <FormMessage class="form-message" v-if="submitted && errorMessage">{{ errorMessage }}
                        </FormMessage>
                    </FormItem>
                </FormField>

                <FormField v-slot="{ componentField, errorMessage }" name="cuit">
                    <FormItem class="h-[5rem] mt-6">
                        <div class="form-item">
                            <FormLabel class="form-label">CUIT</FormLabel>
                            <FormControl>
                                <Input type="text" v-bind="componentField" />
                            </FormControl>
                        </div>
                        <FormMessage class="form-message" v-if="submitted && errorMessage">{{ errorMessage }}
                        </FormMessage>
                    </FormItem>
                </FormField>

                <FormField v-slot="{ componentField, errorMessage }" name="email">
                    <FormItem class="h-[5rem] mt-6">
                        <div class="form-item">
                            <FormLabel class="form-label">Email</FormLabel>
                            <FormControl>
                                <Input type="text" v-bind="componentField" />
                            </FormControl>
                        </div>
                        <FormMessage class="form-message" v-if="submitted && errorMessage">{{ errorMessage }}
                        </FormMessage>
                    </FormItem>
                </FormField>

                <FormField v-slot="{ componentField, errorMessage }" name="telefono">
                    <FormItem class="h-[5rem] mt-6">
                        <div class="form-item">
                            <FormLabel class="form-label">Telefono</FormLabel>
                            <FormControl>
                                <Input type="text" v-bind="componentField" />
                            </FormControl>
                        </div>
                        <FormMessage class="form-message" v-if="submitted && errorMessage">{{ errorMessage }}
                        </FormMessage>
                    </FormItem>
                </FormField>

                <div class="form-footer w-full flex flex-row justify-end mt-8 mb-6">
                    <Button variant="outline" class="w-[25%] mr-5"
                        :onclick="()=> {router.push('/proveedores')}">Cancelar</Button>
                    <Button type="submit" class="w-[25%]">{{ loading ? 'Cargando...' : 'Guardar' }}</Button>
                </div>
            </form>
        </div>

        <AlertError v-model="showError" title="Error" :message="errorMessage" button="Aceptar"
            :action="()=>{showError=false}" />


    </div>
</template>