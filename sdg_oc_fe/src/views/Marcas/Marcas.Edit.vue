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
import { Marca } from '@/api/entities/marca';
import AlertError from '@/components/AlertError.vue';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { router } from '@/router/index';
import { marcasApi } from '@/api/libs/marcas';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import Label from '@/components/ui/label/Label.vue';
import { useLoaderStore } from '@/stores/LoaderStore';
import { AsteriskIcon } from 'lucide-vue-next';

const route = useRoute();
const loader = useLoaderStore();

const currentMarca = ref<Marca>();

const showError = ref<boolean>(false);
const errorMessage =ref<string>('');

const isValidMarca = ref<boolean>(true);

onMounted(async ()=>{
    currentMarca.value = await marcasApi.getOne(Number(route.params.id));
})

const onSubmit = async () => {
    loader.show();
    try {
        if(!currentMarca.value){
            isValidMarca.value=false;
            return;
        } 
        await marcasApi.edit(currentMarca.value.id, currentMarca.value)
        router.push('/marcas')
        toast({
            title: 'Marca actualzada con éxito',
        })
        loader.hide()
    } catch (err: any) {
        errorMessage.value=err.message as string
        showError.value = true;
        loader.hide();
    };
}

const validateAndSubmit = async () => {
    if(currentMarca.value && currentMarca.value.nombre.length>2){
        await onSubmit();
    }else{
        isValidMarca.value = false;
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
        <div class="pt-2 flex w-full justify-center items-center">
            <form v-if="currentMarca" @submit.prevent="validateAndSubmit" class="forms"  >
                <h3 class="page-subtitle text-center">Editar Marca</h3>
                <Separator class="my-6" />

                <div class="h-[5rem] w-full flex justify-center">
                        <div class="flex w-[33rem] flex-row items-center justify-start ">
                            <Label class="w-[6rem]">Nombre</Label>
                            <Input class="w-[25rem]" type="text" v-model="currentMarca.nombre"  />
                            <TooltipProvider  v-if="!isValidMarca" >
                                <Tooltip>
                                    <TooltipTrigger class="bg-transparent text-xs text-destructive ml-4"> <AsteriskIcon :size="14" /> </TooltipTrigger>
                                    <TooltipContent class="text-destructive border-destructive font-thin text-xs">
                                        <p>Ingresar nombre de la marca</p>
                                        <p>Al menos dos caracteres</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    </div>

                <div class="w-full flex flex-row justify-end mt-8 mb-6 pr-14 ">
                    <Button variant="outline" class="w-[25%] mr-5"
                        :onclick="() => { router.push('/marcas'); }">Cancelar</Button>
                    <Button type="submit" class="w-[25%]">Guardar</Button>
                </div>
            </form>
        </div>

        <AlertError v-model="showError" title="Error" :message="errorMessage" button="Aceptar"
            :action="()=>{showError=false}" />


    </div>
</template>