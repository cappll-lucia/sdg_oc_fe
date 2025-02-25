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
import { onMounted, ref } from 'vue';
import { columns } from '@/components/tables/productos/columns';
import DataTable from '@/components/tables/productos/data-table.vue';
import { CategoriaEnum, Producto } from '@/api/entities/producto';
import { productosApi } from '@/api/libs/productos';
import { Marca } from '@/api/entities/marca';
import { Proveedor } from '@/api/entities/proveedor';
import { marcasApi } from '@/api/libs/marcas';
import { proveedoresApi } from '@/api/libs/proveedores';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
    FlexRender,
    getCoreRowModel,
    useVueTable,
    getFilteredRowModel,
} from '@tanstack/vue-table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const productos = ref<Producto[]>([]);
const marcas = ref<Marca[]>([]);
const proveedores = ref<Proveedor[]>([]);
const selectedMarcaId = ref<string>('');
const selectedProveedorId =  ref<string>('');
const selectedCategoria =  ref<string>('');
const txtSearch = ref<string>('');

const loadData = async()=>{
    productos.value = await productosApi.getAll({});
    marcas.value = await marcasApi.getAll();
    proveedores.value =await proveedoresApi.getAll()
}

onMounted(async () => {
    await loadData()
});


const handleFilterProducts = async () => {
    productos.value = await productosApi.getAll({
        proveedorId: selectedProveedorId.value,
        marcaId: selectedMarcaId.value,
        categoria: selectedCategoria.value,
        descripcion: txtSearch.value
    });
};

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
                    <BreadcrumbPage>Productos</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
        <div class="pt-2">
            <div class="flex flex-row justify-between items-center py-4">
                <div class="search flex w-[65rem]  flex-row justify-between">
                    <Input class="max-w-sm " placeholder="Buscar Producto"
                        v-model="txtSearch" @keyup.enter="handleFilterProducts"
                    />
                    <Select v-model="selectedProveedorId" @update:model-value="handleFilterProducts" >
                        <SelectTrigger class="w-[200px]">
                            <SelectValue placeholder="Filtrar por Proveedor" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem 
                                v-for="proveedor in proveedores" 
                                :value="proveedor.id.toString()"
                                @update:model-value=""

                                >{{ proveedor.razonSocial }}</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <Select v-model="selectedMarcaId" @update:model-value="handleFilterProducts" >
                        <SelectTrigger class="w-[200px]">
                            <SelectValue placeholder="Filtrar por Marca" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem 
                                v-for="marca in marcas" 
                                :value="marca.id.toString()"
                                @update:model-value=""

                                >{{ marca.nombre }}</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <Select v-model="selectedCategoria" @update:model-value="handleFilterProducts" >
                        <SelectTrigger class="w-[200px]">
                            <SelectValue placeholder="Filtrar por Categoría" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem 
                                    v-for="categoria in CategoriaEnum" 
                                    :value="categoria"
                                >{{ categoria }}</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>    
                <Button class="text-xs">Registrar Nuevo Producto</Button>
            </div>
            <DataTable :columns="columns" :data="productos"  />
        </div>
    </div>
</template>