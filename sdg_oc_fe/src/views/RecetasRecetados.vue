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
import { onMounted, ref } from 'vue';
import type { ClienteConRecetaRecetados } from '@/api/entities';
import { ClientesConRecetaRec } from '@/api/data/clientesConRecetados';
import DataTable from '@/components/tables/anteojosRecetados/data-table.vue';
import { columns } from '@/components/tables/anteojosRecetados/columns';

const data = ref<ClienteConRecetaRecetados[]>([]);

async function getData(): Promise<ClienteConRecetaRecetados[]>{
    return ClientesConRecetaRec as ClienteConRecetaRecetados[]
}

onMounted(async()=>{
    data.value=await getData()
})
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
                    <BreadcrumbLink href="/recetas">
                        Recetas
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                    <SlashIcon />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                    <BreadcrumbPage>Anteojos Recetados</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
        <h1 class="page-title ">Recetas Anteojos Recetados</h1>
        <div class="pt-2">
            <DataTable :columns="columns" :data="data" />
        </div>



    </div>
</template>