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
import DataTable from '@/components/tables/audiometrias/data-table.vue';
import {columns} from '@/components/tables/audiometrias/columns'
import { onMounted, ref } from 'vue';
import { audiometriasApi } from '@/api/libs/audiometrias';
import { ClienteAudiometriasFecha } from '@/api/entities/audiometrias';

 const data = ref<ClienteAudiometriasFecha[]>([]);




onMounted(async () => {
    data.value = await audiometriasApi.getAllGroupByCliente()
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
                    <BreadcrumbPage>Audiometrías</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
        <h1 class="page-title ">Informes de Audiometría</h1>
        <div class="pt-2">
            <DataTable :columns="columns" :data="data"/>
        </div>
    </div>
</template>


