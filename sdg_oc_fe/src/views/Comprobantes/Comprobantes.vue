<script setup lang="ts">
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { ReloadIcon, SlashIcon } from '@radix-icons/vue';
import { onMounted, ref } from 'vue';
import { Comprobante } from '@/api/entities/comprobante';
import { comprobantesApi } from '@/api/libs/comprobantes';
import {columns} from '@/components/tables/comprobantes/columns'
import DataTable from '@/components/tables/comprobantes/data-table.vue';
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
import { RangeCalendar } from '@/components/ui/range-calendar'
import {
  CalendarDate,
  DateFormatter,
  getLocalTimeZone,
} from '@internationalized/date'
import { CalendarIcon } from 'lucide-vue-next'
import type { DateRange } from 'reka-ui'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useLoaderStore } from '@/stores/LoaderStore';
import { ventasApi } from '@/api/libs/ventas';
import AlertError from '@/components/AlertError.vue';
import AlertAcept from '@/components/AlertAcept.vue';


const loader=useLoaderStore()
const selectedTipoFactura = ref<string>('');
const txtSearch = ref<string>('');
const currentLimit = ref<string>('10');
const currentOffset = ref<number>(0);

const showError = ref<boolean>(false);
const errorMessage =ref<string>('');
const showPendientesAlert= ref<boolean>(false);
const messagePendientes=ref<string>('');


const dateRange = ref<DateRange>({
  start: undefined,
  end: undefined,
})


const nextPage=ref<number | null>(null);
const previousPage=ref<number | null>(null);

const comprobantes = ref<Comprobante[]>([]);


const handleFilterComprobantes = async()=>{
    loader.show();
    const resp = await comprobantesApi.getAll({
        nombreCliente: txtSearch.value,
        fechaDesde: dateRange.value.start ? formatDateValue(dateRange.value.start as CalendarDate | undefined) : '',
        fechaHasta: dateRange.value.end ? formatDateValue(dateRange.value.end as CalendarDate | undefined) : '',
        tipoComprobante:selectedTipoFactura.value,
        offset: currentOffset.value,
        limit: currentLimit.value,
    });
    comprobantes.value = resp.items;
    nextPage.value = resp.nextPage;
    previousPage.value =resp.previousPage;
    loader.hide();
}

    const formatDateValue = (dateValue: CalendarDate | undefined): string => {
        if (!dateValue) return '';
        const year = dateValue.year;
        const month = String(dateValue.month).padStart(2, '0');
        const day = String(dateValue.day).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };


const clearFilters = async()=>{
        txtSearch.value = '',
        dateRange.value.start=undefined;
        dateRange.value.end=undefined;
        selectedTipoFactura.value= '',
        currentOffset.value = 0,
        currentLimit.value='10'
    await handleFilterComprobantes()
}

onMounted(async () => {
    await handleFilterComprobantes();
});


const handlePageChange = async(targetOffset: number | null) => {
    if (targetOffset == null) return;
    currentOffset.value = targetOffset;
    await handleFilterComprobantes();
};

const handleLimitChange = async (newLimit: string) => {
    currentLimit.value = newLimit;
    currentOffset.value = 0;
    await handleFilterComprobantes();
};

const df = new DateFormatter('es-AR', {
  dateStyle: 'medium',
})

const handleDateRangeChange = async(newRange: DateRange) => {
  if (newRange.start && newRange.end) {
    dateRange.value.start = newRange.start
    dateRange.value.end = newRange.end
  }
  await handleFilterComprobantes()
}

const handleFacturarPendientes = async()=>{
    try{
        loader.show();
        const pending = await ventasApi.getAll({
            tipoComprobante: "pendiente",
            limit: 10000,
        });
        if(pending.items.length){
            await comprobantesApi.facturarPendientes();
            messagePendientes.value='Las facturas pendientes se han emitido exitosamente.'
            showPendientesAlert.value=true;
            const comprobantesRes = await comprobantesApi.getAll({});
            comprobantes.value=comprobantesRes.items;
        }else{
            messagePendientes.value='No se encontraron ventas pendientes de facturar.'
            showPendientesAlert.value=true;
        }
        loader.hide();
    }catch(err: any){
        errorMessage.value=err.message as string
        showError.value = true;
        loader.hide();
    }
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
                    <BreadcrumbPage>Comprobantes</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
        <h1 class="page-title ">Comprobantes</h1>
        <div class="pt-2">
            <div class="flex flex-row justify-between items-center py-4">
                <div class="search flex w-[65rem]  flex-row justify-start items-center gap-x-4">
                    <Input class="max-w-sm " placeholder="Buscar cliente" v-model="txtSearch"
                        @keyup.enter="handleFilterComprobantes" />
                    <Select v-model="selectedTipoFactura" @update:model-value="handleFilterComprobantes">
                        <SelectTrigger class="w-[250px]">
                            <SelectValue placeholder="Filtrar por tipo comprobante" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="1">Factura A</SelectItem>
                                <SelectItem value="6">Factura B</SelectItem>
                                <SelectItem value="3">Nota de Crédito A</SelectItem>
                                <SelectItem value="8">Nota de Crédito B</SelectItem>
                                <SelectItem value="2">Nota de Débito A</SelectItem>
                                <SelectItem value="7">Nota de Débito B</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                        <Popover>
                            <PopoverTrigger as-child>
                            <Button
                                variant="outline"
                                :class="{
                                'w-[280px] justify-start text-left font-normal': true,
                                'text-muted-foreground': !dateRange?.start
                                }"
                            >
                                <CalendarIcon class="mr-2 h-4 w-4" />
                                <template v-if="dateRange?.start">
                                {{ df.format(dateRange.start.toDate(getLocalTimeZone())) }}
                                <template v-if="dateRange?.end">
                                    - {{ df.format(dateRange.end.toDate(getLocalTimeZone())) }}
                                </template>
                                </template>
                                <template v-else>
                                Filtrar por fecha
                                </template>
                            </Button>
                            </PopoverTrigger>
                            <PopoverContent class="w-auto p-0">
                            <!-- @vue-ignore -->
                            <RangeCalendar
                                :locale="'es'"
                                v-model="dateRange"
                                initial-focus
                                :number-of-months="2"
                                @update:model-value="handleDateRangeChange"
                            />
                        </PopoverContent>
                    </Popover>
                    <Button variant="ghost" @click="clearFilters" class="text-gray-500 text-xs font-light hover:bg-transparent hover:cursor-pointer hover:underline"> <ReloadIcon /> </Button>
                </div>
            <Button variant="ghost" @click="handleFacturarPendientes" class="text-gray-500 text-sm font-light hover:bg-transparent hover:cursor-pointer hover:underline"> Emitir facturas pendientes</Button>

            </div>
            <DataTable :columns="columns" :data="comprobantes" />
        </div>
        <div class="mt-4 flex w-full justify-center">
            <div class="flex items-center gap-1 text-gray-500 ">
                <Button variant="outline" class="h-8" :disabled="previousPage === null" @click="handlePageChange(previousPage)"  >
                    <ChevronLeft />
                </Button>
                <Select v-model="currentLimit" @update:model-value="handleLimitChange">
                    <SelectTrigger class="w-[80px] h-8">
                        <SelectValue  />
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

        <AlertAcept
            v-model="showPendientesAlert"
            title="Facturar ventas pendientes"
            :message="messagePendientes"
            primary-btn="Aceptar"
            :primary-action="()=>showPendientesAlert=false"
        />
    </div>
</template>