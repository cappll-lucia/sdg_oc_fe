<script lang="ts" setup>
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import  CreateClienteForm  from '@/components/CreateCliente.Form.vue'
import { SlashIcon } from '@radix-icons/vue';
import router from '@/router';
import { toast } from '@/components/ui/toast';
import { Cliente } from '@/api/entities/clientes';

const handleCreateCliente = async(newCliente: Cliente)=>{
    router.push(`/clientes/dashboard/${newCliente.id}`)
    toast({
        title: 'Cliente registrado con éxito',
    })
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
                    <BreadcrumbPage>Crear</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
        <div class="pt-2 mb-4 " >
            <CreateClienteForm 
                @handle-create-cliente="handleCreateCliente"
            />
        </div>

    
    </div>
</template>


<style>
#add-os{
    color: gray;
}
</style>