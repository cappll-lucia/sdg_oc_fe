<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-vue-next';
import { router } from '@/router/index';
import AlertConfirm from '@/components/AlertConfirm.vue';
import {ref} from 'vue'
import { marcasApi } from '@/api/libs/marcas';
import { toast } from '@/components/ui/toast'
import AlertError from '@/components/AlertError.vue';

const props = defineProps<{
    marca: {
        id: number;
        nombre:string;
    };
}>();
const showAlertDelete = ref<boolean>(false);
const showErrorDelete = ref<boolean>(false);
const errorMessage =ref<string>('');


const handleDeleteMarca= async()=>{
    try {
        await marcasApi.remove(props.marca.id)
        showAlertDelete.value=false;
        toast({
            title: 'Marca eliminada con éxito.',
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
            <DropdownMenuItem @click="() => {router.push(`/marcas/edit/${marca.id}`)}">Editar</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem @click="showAlertDelete=true" >Eliminar</DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>

    <AlertConfirm 
        v-model="showAlertDelete"
        title="Eliminar Marca"
        :message="`Estás seguro de elimar la marca ${marca.nombre} ?`"
        primary-btn="Eliminar"
        :primary-action="()=>handleDeleteMarca()"
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


        