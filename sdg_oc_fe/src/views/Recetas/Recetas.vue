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
import DataTable from '@/components/tables/recetas/data-table.vue';
import { columns } from '@/components/tables/recetas/columns';
import { ClienteRecetasCount } from '@/api/entities/clientes';
import { recetasApi } from '@/api/libs/recetas';

const data = ref<ClienteRecetasCount[]>([]);


onMounted(async()=>{
    data.value=await recetasApi.getAllGroupByCliente()
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