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
import type {Cliente} from '@/api/entities'
import { onMounted, ref } from 'vue';
import {columns} from '@/components/tables/clientes/columns'
import {ClientesExample} from '@/api/data/clientes.ts'
import DataTable from '@/components/tables/clientes/data-table.vue';

const data = ref<Cliente[]>([]);

async function getData() : Promise<Cliente[]> {
    return ClientesExample as Cliente[]
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
                    <BreadcrumbPage>Clientes</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
        <h1 class="page-title">Clientes</h1>
        <div class="pt-2 flex flex-row justify-between">
            
        </div>
        <div class="pt-2">
            <DataTable :columns="columns" :data="data" />
        </div>



    </div>
</template>