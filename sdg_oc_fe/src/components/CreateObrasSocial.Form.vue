<script lang="ts" setup>
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input'
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { AsteriskIcon } from 'lucide-vue-next';
import AlertError from '@/components/AlertError.vue';
import router from '@/router/index';
import { obrasSocialesApi } from '@/api/libs/obrasSociales';
import { ref } from 'vue'
import { useLoaderStore } from '@/stores/LoaderStore';
import Label from '@/components/ui/label/Label.vue';

const loader = useLoaderStore();

const newObraSocial = ref<string>();
const isValidNewObraSocial = ref<boolean>(true);

const showError = ref<boolean>(false);
const errorMessage =ref<string>('');

const emit = defineEmits(['handleCreateObraSocial']);


const onSubmit = async () => {
    loader.show();
    try {
        if(!newObraSocial.value){
            isValidNewObraSocial.value=false;
            return;
        } 
        const createdObraSocial = await obrasSocialesApi.create({nombre: newObraSocial.value})
        emit('handleCreateObraSocial', createdObraSocial )
        loader.hide();
    } catch (err: any) {
        errorMessage.value=err.message as string
        showError.value = true;
        loader.hide();
    };
}

const validateAndSubmit = async () => {
    if(newObraSocial.value && newObraSocial.value.length>2){
        await onSubmit();
    }else{
        isValidNewObraSocial.value = false;
    }
}

</script>

<template>
    <div class="flex w-full justify-center items-center">
        <form @submit.prevent="validateAndSubmit" class="forms">
            <h3 class="page-subtitle text-center">Registrar Nueva Obra Social</h3>
            <Separator class="my-6" />
                <div class="h-[5rem] w-full flex justify-center">
                    <div class="flex w-[33rem] flex-row items-center justify-start ">
                        <Label class="w-[6rem]">Nombre</Label>
                        <Input class="w-[25rem]" type="text" v-model="newObraSocial"  />
                        <TooltipProvider  v-if="!isValidNewObraSocial" >
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
                <Button variant="outline" class="w-[25%] mr-5"
                    :onclick="() => { router.push('/obras-sociales'); }">Cancelar</Button>
                <Button type="submit" class="w-[25%]">Guardar</Button>
            </div>
        </form>
    </div>

    <AlertError v-model="showError" title="Error" :message="errorMessage" button="Aceptar"
            :action="()=>{showError=false}" />
</template>