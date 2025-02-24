<!-- <script lang="ts" setup>
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { SlashIcon } from '@radix-icons/vue';
import { audiometriasApi } from '@/api/libs/audiometrias';
import DataTable from '@/components/tables/audiometrias/data-table.vue';
import {columns} from '@/components/tables/audiometrias/columns'
import { onMounted, ref } from 'vue';
import type { Audiometria } from '@/api/entities/audiometrias';

const data = ref<Audiometria[]>([]);

const loadData = async () => {
    data.value = await audiometriasApi.getAll();
};

onMounted(async () => {
    await loadData();
});

</script> -->
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
import type { ClienteConAudiometria } from '@/api/entities/entities';
import { clientesConAudiometria } from '@/api/data/clientesConAudiometria';
import DataTable from '@/components/tables/audiometrias/data-table.vue';
import {columns} from '@/components/tables/audiometrias/columns'
import { onMounted, ref } from 'vue';

const data = ref<ClienteConAudiometria[]>([]);

async function getData(): Promise<ClienteConAudiometria[]>{
    return clientesConAudiometria as ClienteConAudiometria[]
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


