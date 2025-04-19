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
import { toast } from '@/components/ui/toast'
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input'
import { SlashIcon } from '@radix-icons/vue';
import { createProveedorCustomValidator } from '@/api/entities/proveedor';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { AsteriskIcon } from 'lucide-vue-next';
import AlertError from '@/components/AlertError.vue';
import router from '@/router/index';
import { proveedoresApi } from '@/api/libs/proveedores';
import { ref } from 'vue'
import { useLoaderStore } from '@/stores/LoaderStore';
import Label from '@/components/ui/label/Label.vue';

const loader = useLoaderStore();


const showError = ref<boolean>(false);
const errorMessage =ref<string>('');

const newProveedor = ref<{razonSocial: string|undefined, cuit: string|undefined, email: string|undefined, telefono:string|undefined}>({
    razonSocial:undefined,
    cuit:undefined,
    email:undefined, 
    telefono:undefined,
})
const isValidNewProveedor = ref<{razonSocial: boolean, cuit: boolean, email: boolean, telefono:boolean}>({
    razonSocial:true,
    cuit:true,
    email:true, 
    telefono:true,
})


const onSubmit = async () => {
    loader.show()
    try {
        await proveedoresApi.create(newProveedor.value)
        router.push('/proveedores')
        toast({
            title: 'Proveedor registrado con éxito',
        })
        loader.hide();
    } catch (err: any) {
        errorMessage.value=err.message as string
        showError.value = true;
        loader.hide();
    };
}

const validateAndSubmit = async () => {
    const validProveedor = createProveedorCustomValidator(newProveedor.value);
    isValidNewProveedor.value = validProveedor.isValid;
    if(validProveedor.success){
        await onSubmit();
    }
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
                    <BreadcrumbLink href="/parametros">
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
        <div class="pt-2 flex w-full justify-center items-center" >
            <form @submit.prevent="validateAndSubmit" class="forms">
                <h3 class="page-subtitle text-center" >Registrar Nuevo Proveedor</h3>
                <Separator class="my-6" />
                
                <div class="h-[5rem] w-full flex justify-center">
                    <div class="flex w-[33rem] flex-row items-center justify-start ">
                        <Label class="w-[7rem] text-right pr-4">Razón Social</Label>
                        <Input class="w-[24rem]" type="text" v-model="newProveedor.razonSocial"  />
                        <TooltipProvider  v-if="!isValidNewProveedor.razonSocial" >
                            <Tooltip>
                                <TooltipTrigger class="bg-transparent text-xs text-destructive ml-4"> <AsteriskIcon :size="14" /> </TooltipTrigger>
                                <TooltipContent class="text-destructive border-destructive font-thin text-xs">
                                    <p>Ingresar razón social del proveedore</p>
                                    <p>Al menos dos caracteres</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </div>

                <div class="h-[5rem] w-full flex justify-center">
                    <div class="flex w-[33rem] flex-row items-center justify-start ">
                        <Label class="w-[7rem] text-right pr-4">CUIT</Label>
                        <Input class="w-[24rem]" type="text" v-decimal v-model="newProveedor.cuit"  />
                        <TooltipProvider  v-if="!isValidNewProveedor.cuit" >
                            <Tooltip>
                                <TooltipTrigger class="bg-transparent text-xs text-destructive ml-4"> <AsteriskIcon :size="14" /> </TooltipTrigger>
                                <TooltipContent class="text-destructive border-destructive font-thin text-xs">
                                    <p>Ingresar CUIT proveedore</p>
                                    <p>Entre 10 y 11 caracteres</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </div>
                
                <div class="h-[5rem] w-full flex justify-center">
                    <div class="flex w-[33rem] flex-row items-center justify-start ">
                        <Label class="w-[7rem] text-right pr-4">Email</Label>
                        <Input class="w-[24rem]" type="text" v-model="newProveedor.email"  />
                        <TooltipProvider  v-if="!isValidNewProveedor.email" >
                            <Tooltip>
                                <TooltipTrigger class="bg-transparent text-xs text-destructive ml-4"> <AsteriskIcon :size="14" /> </TooltipTrigger>
                                <TooltipContent class="text-destructive border-destructive font-thin text-xs">
                                    <p>Ingresar email proveedore</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </div>

                <div class="h-[5rem] w-full flex justify-center">
                    <div class="flex w-[33rem] flex-row items-center justify-start ">
                        <Label class="w-[7rem] text-right pr-4">Teléfono</Label>
                        <Input class="w-[24rem]" type="text" v-model="newProveedor.telefono"  />
                        <TooltipProvider  v-if="!isValidNewProveedor.telefono" >
                            <Tooltip>
                                <TooltipTrigger class="bg-transparent text-xs text-destructive ml-4"> <AsteriskIcon :size="14" /> </TooltipTrigger>
                                <TooltipContent class="text-destructive border-destructive font-thin text-xs">
                                    <p>Ingresar teléfono proveedor</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </div>

                <div class="w-full flex flex-row justify-end mt-8 mb-6 pr-14 ">
                    <Button variant="outline" class="w-[25%] mr-5"
                        :onclick="() => { router.push('/proveedores'); }">Cancelar</Button>
                    <Button type="submit" class="w-[25%]">Guardar</Button>
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
