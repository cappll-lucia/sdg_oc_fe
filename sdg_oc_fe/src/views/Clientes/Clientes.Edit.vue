<script lang="ts" setup>
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { SlashIcon } from '@radix-icons/vue';
import router from '@/router';
import { toast } from '@/components/ui/toast';
import EditClienteForm from '@/components/EditCliente.Form.vue';

const handleEditCliente = async(id: number)=>{
    router.push(`/clientes/dashboard/${id}#dashboard`)
    toast({
        title: 'Cliente actualizado con éxito',
    })
}

const hanldeCancel = async(id: number)=>{
    router.push(`/clientes/dashboard/${id}#dashboard`)
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
                    <BreadcrumbLink href="/clientes">
                        Clientes
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
        <div class="pt-2 mb-4 " >
            <EditClienteForm
                @handle-edit-cliente="handleEditCliente"
                @hanlde-cancel="hanldeCancel"
            />
        </div>

    
    </div>
</template>


<style>
#add-os{
    color: gray;
}
</style>