<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-vue-next';
import router from '@/router/index';
import AlertConfirm from '@/components/AlertConfirm.vue';
import {ref} from 'vue'
import { obrasSocialesApi } from '@/api/libs/obrasSociales';
import { toast } from '@/components/ui/toast'
import AlertError from '@/components/AlertError.vue';

const props = defineProps<{
    obraSocial: {
        id: number;
        nombre:string;
    };
}>();
const showAlertDelete = ref<boolean>(false);
const showErrorDelete = ref<boolean>(false);
const errorMessage =ref<string>('');


const handleDeleteObraSocial= async()=>{
    try {
        await obrasSocialesApi.remove(props.obraSocial.id)
        showAlertDelete.value=false;
        toast({
            title: 'Obra Social eliminada con éxito.',
        })  
        setTimeout(() => {
            router.go(0);
        }, 1000);   
        
    } catch (err: any) {
        errorMessage.value=err.message as string
        showErrorDelete.value = true;
    };
}
</script>

<template>
    <DropdownMenu>
        <DropdownMenuTrigger as-child>
            <Button variant="ghost" class="w-8 h-8 p-0">
                <span class="sr-only">Opciones</span>
                <MoreHorizontal class="w-4 h-4" />
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
            <DropdownMenuItem @click="() => {router.replace(`/obras-sociales/edit/${obraSocial.id}`)}">Editar</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem @click="showAlertDelete=true" >Eliminar</DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>

    <AlertConfirm 
        v-model="showAlertDelete"
        title="Eliminar Obra Social"
        :message="`Estás seguro de elimar la obra social ${obraSocial.nombre} ?`"
        primary-btn="Eliminar"
        :primary-action="()=>handleDeleteObraSocial()"
        secondary-btn="Cancelar"
        :secondary-action="()=>{showAlertDelete=false}"
    />

    <AlertError 
        v-model="showErrorDelete"
        title="Error"
        :message="errorMessage"
        button="Aceptar"
        :action="()=>{showErrorDelete=false}"
    />
</template>


        