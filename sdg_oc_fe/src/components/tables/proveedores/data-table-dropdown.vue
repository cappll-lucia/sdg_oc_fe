<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-vue-next';
import router from '@/router/index';
import AlertConfirm from '@/components/AlertConfirm.vue';
import {ref} from 'vue'
import { toast } from '@/components/ui/toast'
import AlertError from '@/components/AlertError.vue';
import { proveedoresApi } from '@/api/libs/proveedores';


const props = defineProps<{
    proveedor: {
        id: number;
        razonSocial:string;
    };
}>();
const showAlertDelete = ref<boolean>(false);
const showErrorDelete = ref<boolean>(false);
const errorMessage =ref<string>('');


const handleDeleteProveedor= async()=>{
    try {
        await proveedoresApi.remove(props.proveedor.id)
        showAlertDelete.value=false;
        toast({
            title: 'Proveedor eliminado con éxito.',
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
            <DropdownMenuItem @click="() => {router.replace(`/proveedores/edit/${proveedor.id}`)}">Editar</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem @click="showAlertDelete=true" >Eliminar</DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>

    <AlertConfirm 
        v-model="showAlertDelete"
        title="Eliminar Proveedor"
        :message="`Estás seguro de elimar el proveedor ${proveedor.razonSocial} ?`"
        primary-btn="Eliminar"
        :primary-action="()=>handleDeleteProveedor()"
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

