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
import {columns} from '@/components/tables/clientes/columns'
import DataTable from '@/components/tables/clientes/data-table.vue';
import { clientesApi } from '@/api/libs/clientes';
import { Cliente } from '@/api/entities/clientes';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Localidad } from '@/api/entities/localidad';
import { localidadesApi } from '@/api/libs/localidades';
import { ChevronLeft, ChevronRight } from 'lucide-vue-next';



const clientes = ref<Cliente[]>([]);
const localidades = ref<Localidad[]>([]);
const selectedLocalidadId = ref<string>('');
const selectedSexo = ref<string>('');
const txtSearch = ref<string>('');
const currentLimit = ref<string>('10');
const currentOffset = ref<number>(0);

const loadData = async()=>{
    await handleFilterClientes()
    console.log(clientes.value)
    localidades.value = await localidadesApi.getAll();
}

onMounted(async () => {
    await loadData()
});

const handleFilterClientes = async()=>{
    clientes.value = await clientesApi.getAll({
        filtro: txtSearch.value,
        sexo: selectedSexo.value,
        localidadId: selectedLocalidadId.value,
        offset: currentOffset.value,
        limit: currentLimit.value
    })
};

const handlePageChange = async(offset: number) => {
    if(currentOffset.value==0 && offset<0) return
    currentOffset.value = currentOffset.value + offset
    await handleFilterClientes()
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
                    <BreadcrumbPage>Clientes</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
        <h1 class="page-title ">Clientes</h1>
        <div class="pt-2">
                <div class="flex flex-row justify-between items-center py-4">
                    <div class="search flex w-[65rem]  flex-row justify-start gap-x-6">
                        <Input class="max-w-sm " placeholder="Buscar cliente por nombre, apellido o documento  "
                            v-model="txtSearch" @keyup.enter="handleFilterClientes"
                        />
                        <Select v-model="selectedLocalidadId" @update:model-value="handleFilterClientes" >
                            <SelectTrigger class="w-[200px]">
                                <SelectValue placeholder="Filtrar por localidad" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem 
                                    v-for="localidad in localidades" 
                                    :value="localidad.id.toString()"
                                    >{{ localidad.localidad }}, {{ localidad.provincia.provincia }}</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <Select v-model="selectedSexo" @update:model-value="handleFilterClientes" >
                            <SelectTrigger class="w-[200px]">
                                <SelectValue placeholder="Filtrar por sexo" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="Femenino">Femenino</SelectItem>
                                    <SelectItem value="Masculino">Masculino</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>  
                <Button class="text-xs"><a href="/clientes/create">Registrar Nuevo Cliente</a></Button>
            </div>
            <DataTable :columns="columns" :data="clientes" />
        </div>
        <div class="mt-4 flex w-full justify-center">
            <div class="flex items-center gap-1 text-gray-500 ">
                <Button variant="outline" :disbled="currentOffset==0" class="w-8 h-8" @click="handlePageChange(-1)" > <ChevronLeft/> </Button>
                <Select v-model="currentLimit" @update:model-value="handleFilterClientes" >
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