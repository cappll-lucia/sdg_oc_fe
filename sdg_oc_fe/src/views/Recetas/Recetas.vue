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
import type { ClienteConReceta } from '@/api/entities/entities';
import { clientesConReceta } from '@/api/data/clientesConRecetas'
import DataTable from '@/components/tables/recetas/data-table.vue';
import { columns } from '@/components/tables/recetas/columns';

const data = ref<ClienteConReceta[]>([]);

async function getData(): Promise<ClienteConReceta[]>{
    return clientesConReceta as ClienteConReceta[]
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
                    <BreadcrumbPage>Recetas</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
        <h1 class="page-title ">Recetas por Cliente</h1>
        <div class="pt-2">
            <DataTable :columns="columns" :data="data" />
        </div>



    </div>
</template>