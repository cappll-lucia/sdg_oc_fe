<script setup lang="ts">
import type { Marca } from '@/api/entities/marca';
import { marcasApi } from '@/api/libs/marcas';
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
import { columns } from '@/components/tables/marcas/columns';
import DataTable from '@/components/tables/marcas/data-table.vue';
import AlertError from '@/components/AlertError.vue';
import { useLoaderStore } from '@/stores/LoaderStore';

const loader = useLoaderStore();

const showError = ref<boolean>(false);
const errorMessage =ref<string>('');

const data = ref<Marca[]>([]);

const loadData = async()=>{
    try{
        loader.show();
        data.value = await marcasApi.getAll();
        loader.hide();
    }catch(err: any){
        errorMessage.value=err.message as string
        showError.value = true;
        loader.hide();
    }
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
                    <BreadcrumbLink href="/parametros">
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
    <AlertError v-model="showError" title="Error" :message="errorMessage" button="Aceptar"
            :action="()=>{showError=false}" />
</template>