<script setup lang="ts">
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { SlashIcon } from '@radix-icons/vue';
import type { Marca } from '@/api/entities/marca';
import { onMounted, ref } from 'vue';
import { columns } from '@/components/tables/marcas/columns';
import { marcas } from '@/api/data/marcas';
import DataTable from '@/components/tables/marcas/data-table.vue';

const data = ref<Marca[]>([]);
async function getData(): Promise<Marca[]> {
    return marcas as Marca[];
}



onMounted(async () => {
    data.value = await getData();
});
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
                    <BreadcrumbLink href="/">
                        Parámetros
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                    <SlashIcon />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                    <BreadcrumbPage>Marcas</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
        <h1 class="page-title ">Marcas</h1>
        <div class="pt-2">
            <DataTable :columns="columns" :data="data" />
        </div>
    </div>
</template>