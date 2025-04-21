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
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import AlertError from '@/components/AlertError.vue';
import { router } from '@/router/index';
import { obrasSocialesApi } from '@/api/libs/obrasSociales';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useLoaderStore } from '@/stores/LoaderStore';
import Label from '@/components/ui/label/Label.vue';
import { ObraSocial } from '@/api/entities/obraSocial';
import { AsteriskIcon } from 'lucide-vue-next';

const route = useRoute();
const loader = useLoaderStore();

const currentObraSocial = ref<ObraSocial>();
const isValidObraSocial = ref<boolean>(true);

const showError = ref<boolean>(false);
const errorMessage =ref<string>('');


onMounted(async ()=>{
    currentObraSocial.value = await obrasSocialesApi.getOne(Number(route.params.id));
})

const onSubmit = async () => {
    loader.show();
    try {
        if(!currentObraSocial.value){
            isValidObraSocial.value=false;
            return;
        } 
        await obrasSocialesApi.edit(currentObraSocial.value.id, currentObraSocial.value)
        router.push('/obras-sociales')
        toast({
            title: 'Obra Social registrada con éxito',
        });
        loader.hide();
    } catch (err: any) {
        errorMessage.value=err.message as string
        showError.value = true;
        loader.hide();
    };
}

const validateAndSubmit = async () => {
    if(currentObraSocial.value && currentObraSocial.value.nombre.length>2){
        await onSubmit();
    }else{
        isValidObraSocial.value = false;
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
        <div class="pt-2 flex w-full justify-center items-center">
            <form v-if="currentObraSocial" :key="currentObraSocial.id" @submit.prevent="validateAndSubmit" class="forms" >
                <h3 class="page-subtitle text-center">Editar Obra Social</h3>
                <Separator class="my-6" />

                <div class="h-[5rem] w-full flex justify-center">
                        <div class="flex w-[33rem] flex-row items-center justify-start ">
                            <Label class="w-[6rem]">Nombre</Label>
                            <Input class="w-[25rem]" type="text" v-model="currentObraSocial.nombre"  />
                            <TooltipProvider  v-if="!isValidObraSocial" >
                                <Tooltip>
                                    <TooltipTrigger class="bg-transparent text-xs text-destructive ml-4"> <AsteriskIcon :size="14" /> </TooltipTrigger>
                                    <TooltipContent class="text-destructive border-destructive font-thin text-xs">
                                        <p>Ingresar nombre de la Obra Social</p>
                                        <p>Al menos dos caracteres</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    </div>

                <div class="w-full flex flex-row justify-end mt-8 mb-6 pr-14 ">
                    <Button variant="outline" type="button" class="w-[25%] mr-5"
                        @click="() => { router.push('/obras-sociales'); }">Cancelar</Button>
                    <Button type="submit" class="w-[25%]">Guardar</Button>
                </div>
            </form>
        </div>

        <AlertError v-model="showError" title="Error" :message="errorMessage" button="Aceptar"
            :action="()=>{showError=false}" />


    </div>
</template>