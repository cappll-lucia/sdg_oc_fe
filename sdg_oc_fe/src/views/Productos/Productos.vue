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
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-vue-next';

const productos = ref<Producto[]>([]);
const marcas = ref<Marca[]>([]);
const proveedores = ref<Proveedor[]>([]);
const selectedMarcaId = ref<string>('');
const selectedProveedorId =  ref<string>('');
const selectedCategoria =  ref<string>('');
const txtSearch = ref<string>('');
const currentLimit = ref<string>('10');
const currentOffset = ref<number>(0);

const loadData = async()=>{
    await handleFilterProducts()
    marcas.value = await marcasApi.getAll();
    proveedores.value =await proveedoresApi.getAll();
}

onMounted(async () => {
    await loadData()
});


const handleFilterProducts = async () => {
    productos.value = await productosApi.getAll({
        proveedorId: selectedProveedorId.value,
        marcaId: selectedMarcaId.value,
        categoria: selectedCategoria.value,
        filtro: txtSearch.value,
        offset: currentOffset.value,
        limit: currentLimit.value
    });
};

const handlePageChange = async(offset: number) => {
    if(currentOffset.value==0 && offset<0) return
    currentOffset.value = currentOffset.value + offset
    await handleFilterProducts()
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
        <h1 class="page-title ">Productos</h1>
        <div class="pt-2">
            <div class="flex flex-row justify-between items-center py-4">
                <div class="search flex w-[65rem]  flex-row justify-start gap-x-4">
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
                                >{{ marca.nombre }}</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <Select v-model="selectedCategoria" @update:model-value="handleFilterProducts" >
                        <SelectTrigger class="w-[200px] capitalize">
                            <SelectValue placeholder="Filtrar por Categoría" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem 
                                    class="capitalize"
                                    v-for="categoria in Object.entries(CategoriaEnum)" 
                                    :value="categoria[0]"
                                >{{ categoria[1].toLowerCase() }}</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>    
                <Button class="text-xs">Registrar Nuevo Producto</Button>
            </div>
            <DataTable :columns="columns" :data="productos"  />
        </div>

        <div class="mt-4 flex w-full justify-center">
            <div class="flex items-center gap-1 text-gray-500 ">
                <Button variant="outline" :disbled="currentOffset==0" class="w-8 h-8" @click="handlePageChange(-1)" > <ChevronLeft /> </Button> 
                <Select v-model="currentLimit" @update:model-value="handleFilterProducts" >
                    <SelectTrigger class="w-[80px] h-8">
                    <SelectValue placeholder="Select a fruit" />
                    </SelectTrigger>
                    <SelectContent>
                    <SelectGroup>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="20">20</SelectItem>
                        <SelectItem value="30">30</SelectItem>
                        <SelectItem value="40">40</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                    </SelectGroup>
                    </SelectContent>
                </Select>
                <Button variant="outline"  class="w-8 h-8"  @click="handlePageChange(1)" > <ChevronRight /> </Button>
            </div>
        </div>

    </div>
</template>