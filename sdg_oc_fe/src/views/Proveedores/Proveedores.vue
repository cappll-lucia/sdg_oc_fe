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
import AlertError from '@/components/AlertError.vue';
import { useLoaderStore } from '@/stores/LoaderStore';

const loader = useLoaderStore();

const showError = ref<boolean>(false);
const errorMessage =ref<string>('');


const data = ref<Proveedor[]>([]);

const loadData = async()=>{
    try{
        loader.show();
        data.value = await proveedoresApi.getAll();
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
                    <BreadcrumbPage>Proveedores</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
        <h1 class="page-title ">Proveedores</h1>
        <div class="pt-2">
            <DataTable :columns="columns" :data="data" />
        </div>
    </div>
    <AlertError v-model="showError" title="Error" :message="errorMessage" button="Aceptar"
            :action="()=>{showError=false}" />
</template> 