<script setup lang="ts">
import type { Proveedor } from '@/api/entities/proveedor';
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
import { columns } from '@/components/tables/proveedores/columns';
import DataTable from '@/components/tables/proveedores/data-table.vue';
import { proveedoresApi } from '@/api/libs/proveedores';


const data = ref<Proveedor[]>([]);

const loadData = async()=>{
    data.value = await proveedoresApi.getAll();
}

onMounted(async () => {
    await loadData()
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