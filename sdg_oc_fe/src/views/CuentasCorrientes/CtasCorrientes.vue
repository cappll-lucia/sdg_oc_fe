<script lang="ts" setup>
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
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
import { ChevronLeft, ChevronRight, SlashIcon } from 'lucide-vue-next';
import { onMounted, ref } from 'vue';
import { cuentaCorrienteApi } from '@/api/libs/cuentaCorriente';
import { CuentaCorriente } from '@/api/entities/cuentaCorriente';
import { ReloadIcon } from '@radix-icons/vue';
import DataTable from '@/components/tables/cuentasCorrientes/data-table.vue';
import { columns } from '@/components/tables/cuentasCorrientes/columns';
const currentLimit = ref<string>('10');
const currentOffset = ref<number>(0);
const nextPage=ref<number | null>();
const previousPage=ref<number | null>(null);
const txtSearch = ref<string>('');
const selectedEstado = ref<string>('');

const cuentasCorrientes = ref<CuentaCorriente[]>([])

const handleFilterCtasCorrientes = async()=>{
    const res = await cuentaCorrienteApi.getAll({
        filtro: txtSearch.value,
        estado: selectedEstado.value,
        offset: currentOffset.value,
        limit: currentLimit.value
    })
    console.log(res)
    cuentasCorrientes.value = res.items.filter(c=>c.cliente.id!=0);
    nextPage.value = res.nextPage;
    previousPage.value =res.previousPage;
};

const handlePageChange = async(offset: number) => {
    if(currentOffset.value==0 && offset<0) return
    currentOffset.value = currentOffset.value + offset
    await handleFilterCtasCorrientes()
};

onMounted(async()=>{
    await handleFilterCtasCorrientes();
})

const clearFilters = async()=>{
    txtSearch.value=''
    selectedEstado.value=''
    currentOffset.value=0;
    currentLimit.value='10';
    await handleFilterCtasCorrientes()
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
                    <BreadcrumbPage>Cuentas Corrientes</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
        <h1 class="page-title ">Cuentas Corrientes</h1>
        <div class="pt-2">
            <div class="flex flex-row justify-between items-center py-4">
                <div class="search flex w-[65rem]  flex-row justify-start gap-x-6">
                    <Input class="max-w-sm " placeholder="Buscar cliente por nombre, apellido o documento  "
                        v-model="txtSearch" @keyup.enter="handleFilterCtasCorrientes"
                    />
                    <Select v-model="selectedEstado" @update:model-value="handleFilterCtasCorrientes" >
                        <SelectTrigger class="w-[200px]">
                            <SelectValue placeholder="Filtrar por Estado" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="1">Con Deuda</SelectItem>
                                <SelectItem value="0">Con Saldo a Favor</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                        <Button variant="ghost" @click="clearFilters" class="text-gray-500 text-xs font-light hover:bg-transparent hover:cursor-pointer hover:underline " > <ReloadIcon /> </Button>
                </div>
            </div>
            <DataTable :columns="columns" :data="cuentasCorrientes" />

        </div>
        <div class="mt-4 flex w-full justify-center">
            <div class="flex items-center gap-1 text-gray-500 ">
                <Button variant="outline" :class="{'w-8 h-8': previousPage, 'w-8 h-8 pointer-events-none opacity-50': !previousPage}" @click="handlePageChange(-1)" > <ChevronLeft/> </Button>
                <Select v-model="currentLimit" @update:model-value="handleFilterCtasCorrientes" >
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
                <Button variant="outline" :class="{'w-8 h-8': nextPage, 'w-8 h-8 pointer-events-none opacity-50': !nextPage}" @click="handlePageChange(1)" > <ChevronRight /> </Button>
            </div>
        </div>
    </div>
</template>