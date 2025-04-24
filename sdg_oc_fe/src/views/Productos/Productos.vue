<script setup lang="ts">
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ReloadIcon, SlashIcon } from '@radix-icons/vue';
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
import { router } from '@/router';
import { useUserStore } from '@/stores/UsersStore';
import { JwtUser } from '@/api/entities/jwtUser';
import { useLoaderStore } from '@/stores/LoaderStore';
import AlertError from '@/components/AlertError.vue';

const userStore = useUserStore();
const loader = useLoaderStore();


const userData = ref<JwtUser | null>();
const productos = ref<Producto[]>([]);
const marcas = ref<Marca[]>([]);
const proveedores = ref<Proveedor[]>([]);
const selectedMarcaId = ref<string>('');
const selectedProveedorId =  ref<string>('');
const selectedCategoria =  ref<string>('');
const txtSearch = ref<string>('');
const currentLimit = ref<string>('10');
const currentOffset = ref<number>(0);

const nextPage=ref<number | null>(null);
const previousPage=ref<number | null>(null);

const showError = ref<boolean>(false);
const errorMessage =ref<string>('');

const loadData = async()=>{
    try{
        await handleFilterProducts()
        marcas.value = await marcasApi.getAll();
        proveedores.value =await proveedoresApi.getAll();
     }catch(err: any){
        errorMessage.value=err.message as string
        showError.value = true;
        loader.hide();
    }
}

onMounted(async () => {
    loader.show();
    userData.value = userStore?.getMe
    await loadData()
    loader.hide();
});


const handleSearchProducts = async () => {
    try{
        const resp = await productosApi.getAll({
            proveedorId: selectedProveedorId.value,
            marcaId: selectedMarcaId.value,
            categoria: selectedCategoria.value,
            filtro: txtSearch.value,
            offset: currentOffset.value,
            limit: currentLimit.value
        });
        productos.value = resp.items;
        nextPage.value = resp.nextPage;
        previousPage.value =resp.previousPage;
    }catch(err: any){
        errorMessage.value=err.message as string
        showError.value = true;
    }finally{
        loader.hide();
    }
};

const handleFilterProducts = async()=>{
    loader.show();
    await handleSearchProducts();
    loader.hide();
}

const handlePageChange = async(targetOffset: number | null) => {
    if (targetOffset == null) return;
    currentOffset.value = targetOffset;
    await handleFilterProducts();
};

const handleLimitChange = async (newLimit: string) => {
    currentLimit.value = newLimit;
    currentOffset.value = 0;
    await handleFilterProducts();
};


const clearFilters = async()=>{
    selectedProveedorId.value =''
    selectedMarcaId.value =''
    selectedCategoria.value =''
    txtSearch.value =''
    currentOffset.value = 0
    currentLimit.value='10'
    await handleFilterProducts()
}
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
        <div class="flex flex-row w-full justify-between">
            <h1 class="page-title ">Productos</h1>
            <div>
                
                <DropdownMenu>
                    <DropdownMenuTrigger><Button class="w-[14rem]" >Registrar nuevos productos</Button></DropdownMenuTrigger>
                    <DropdownMenuContent class="w-[14rem]" >
                        <DropdownMenuLabel class="cursor-pointer" @click="router.push('/productos/create/lote')"  >Registrar lote de productos</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel class="cursor-pointer" @click="router.push('/productos/create/single')" >Registrar producto único</DropdownMenuLabel>
                    </DropdownMenuContent>
                </DropdownMenu>
                <Button class="ml-4 w-[14rem]" v-if="userData?.role=='admin'" @click="router.push('/productos/update-price/lote')" >Actualizar Precios</Button>
                <!-- <DropdownMenu>
                    <DropdownMenuTrigger><Button class="ml-4 w-[14rem]" v-if="userData?.role=='admin'" >Actualizar Precios</Button></DropdownMenuTrigger>
                    <DropdownMenuContent class="ml-4 w-[14rem]" >
                        <DropdownMenuLabel class="cursor-pointer" @click="router.push('/productos/update-price/lote')"  >Actualizar precio de lote de productos</DropdownMenuLabel>
                    </DropdownMenuContent>
                </DropdownMenu> -->
            </div>
        </div>
        <div class="pt-2">
            <div class="flex flex-row justify-between items-center py-4">
                <div class="search flex w-[65rem]  flex-row justify-start gap-x-4">
                    <Input class="max-w-sm " placeholder="Buscar Producto" v-model="txtSearch"
                        @keyup.enter="handleFilterProducts"
                        @input="(e: any) => e.target.value.length >= 0 && handleSearchProducts()"
                         />
                    <Select v-model="selectedProveedorId" @update:model-value="handleFilterProducts">
                        <SelectTrigger class="w-[200px]">
                            <SelectValue placeholder="Filtrar por Proveedor" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem v-for="proveedor in proveedores" :value="proveedor.id.toString()">{{
                                    proveedor.razonSocial }}</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <Select v-model="selectedMarcaId" @update:model-value="handleFilterProducts">
                        <SelectTrigger class="w-[200px]">
                            <SelectValue placeholder="Filtrar por Marca" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem v-for="marca in marcas" :value="marca.id.toString()">{{ marca.nombre }}
                                </SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <Select v-model="selectedCategoria" @update:model-value="handleFilterProducts">
                        <SelectTrigger class="w-[200px] capitalize">
                            <SelectValue placeholder="Filtrar por Categoría" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem class="capitalize" v-for="categoria in Object.entries(CategoriaEnum)"
                                    :value="categoria[0]">{{ categoria[1].toLowerCase() }}</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <Button variant="ghost" @click="clearFilters" class="text-gray-500 mt-1 text-xs font-light hover:bg-transparent hover:cursor-pointer hover:underline"> <ReloadIcon /> </Button>

            </div>
            <DataTable :columns="columns" :data="productos" />
        </div>

        <div class="mt-4 flex w-full justify-center">
            <div class="flex items-center gap-1 text-gray-500 ">
                <Button variant="outline"  class="h-8" :disabled="previousPage === null" @click="handlePageChange(previousPage)" >
                    <ChevronLeft />
                </Button>
                <Select v-model="currentLimit" @update:model-value="handleLimitChange">
                    <SelectTrigger class="w-[80px] h-8">
                        <SelectValue />
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
                <Button variant="outline" class="h-8" :disabled="nextPage === null" @click="handlePageChange(nextPage)" >
                    <ChevronRight />
                </Button>
            </div>
        </div>
        <AlertError v-model="showError" title="Error" :message="errorMessage" button="Aceptar"
            :action="()=>{showError=false}" />
    </div>
</template>