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
import type { Proveedor } from '@/api/entities/entities';
import { onMounted, ref } from 'vue';
import { columns } from '@/components/tables/proveedores/columns';
import { proveedores } from '@/api/data/proveedores';
import DataTable from '@/components/tables/proveedores/data-table.vue';

const data = ref<Proveedor[]>([]);

async function getData(): Promise<Proveedor[]> {
    return proveedores as Proveedor[];
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
                    <BreadcrumbPage>Proveedores</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
        <h1 class="page-title ">Proveedores</h1>
        <div class="pt-2">
            <DataTable :columns="columns" :data="data" />
        </div>
    </div>
</template>