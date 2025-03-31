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
import { Venta } from '@/api/entities/venta';
import { ventasApi } from '@/api/libs/ventas';
import {columns} from '@/components/tables/ventas/columns'
import DataTable from '@/components/tables/ventas/data-table.vue';
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
import router from '@/router';
import { RangeCalendar } from '@/components/ui/range-calendar'
import {
  CalendarDate,
  DateFormatter,
  getLocalTimeZone,
  parseDate,
  type DateValue
} from '@internationalized/date'
import { CalendarIcon } from 'lucide-vue-next'
import type { DateRange } from 'reka-ui'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { date } from 'zod';


const selectedTipoFactura = ref<string>('');
const txtSearch = ref<string>('');
const currentLimit = ref<string>('10');
const currentOffset = ref<number>(0);

const dateRange = ref<DateRange>({
  start: undefined,
  end: undefined,
})


const nextPage=ref<number | null>();
const previousPage=ref<number | null>(null);

const ventas = ref<Venta[]>([]);


const handleFilterVentas = async()=>{
    const resp = await ventasApi.getAll({
        nombreCliente: txtSearch.value,
        fechaDesde: dateRange.value.start ? formatDateValue(dateRange.value.start as CalendarDate | undefined) : '',
        fechaHasta: dateRange.value.end ? formatDateValue(dateRange.value.end as CalendarDate | undefined) : '',
        tipoComprobante:selectedTipoFactura.value,
        offset: currentOffset.value,
        limit: currentLimit.value,
    });
    console.log(resp)
    ventas.value = resp.items;
    nextPage.value = resp.nextPage;
    previousPage.value =resp.previousPage;
}

    const formatDateValue = (dateValue: CalendarDate | undefined): string => {
        if (!dateValue) return '';
        // Usamos los métodos correctos de DateValue
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
    await handleFilterVentas()
}

onMounted(async () => {
    await handleFilterVentas();
});

const handlePageChange = async(offset: number) => {
    if(currentOffset.value==0 && offset<0) return
    currentOffset.value = currentOffset.value + offset
    await handleFilterVentas()
};

const df = new DateFormatter('en-US', {
  dateStyle: 'medium',
})

const handleDateRangeChange = async(newRange: DateRange) => {
  if (newRange.start && newRange.end) {
    dateRange.value.start = newRange.start
    dateRange.value.end = newRange.end
  }
  console.log(dateRange.value.start)
  await handleFilterVentas()
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
                    <BreadcrumbPage>Ventas</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
        <h1 class="page-title ">Ventas</h1>
        <div class="pt-2">
            <div class="flex flex-row justify-between items-center py-4">
                <div class="search flex w-[65rem]  flex-row justify-start gap-x-4">
                    <Input class="max-w-sm " placeholder="Buscar cliente" v-model="txtSearch"
                        @keyup.enter="handleFilterVentas" />
                    <Select v-model="selectedTipoFactura" @update:model-value="handleFilterVentas">
                        <SelectTrigger class="w-[200px]">
                            <SelectValue placeholder="Filtrar por Tipo Factura" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="1">Factura A</SelectItem>
                                <SelectItem value="6">Factura B</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <div class="flex flex-row justify-between px-6 h-6 mb-4">
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
                                v-model="dateRange"
                                initial-focus
                                :number-of-months="2"
                                @update:model-value="handleDateRangeChange"
                            />
                            </PopoverContent>
                        </Popover>
                </div>
                <Button variant="ghost" @click="clearFilters" class="text-gray-500 mt-1 text-xs font-light hover:bg-transparent hover:cursor-pointer hover:underline"> <ReloadIcon /> </Button>

            </div>
            <DataTable :columns="columns" :data="ventas" />
        </div>
        <div class="mt-4 flex w-full justify-center">
            <div class="flex items-center gap-1 text-gray-500 ">
                <Button variant="outline" :class="{'w-8 h-8': previousPage, 'w-8 h-8 pointer-events-none opacity-50': !previousPage}" @click="handlePageChange(-1)">
                    <ChevronLeft />
                </Button>
                <Select v-model="currentLimit" @update:model-value="handleFilterVentas">
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
                <Button variant="outline" :class="{'w-8 h-8': nextPage, 'w-8 h-8 pointer-events-none opacity-50': !nextPage}" @click="handlePageChange(1)">
                    <ChevronRight />
                </Button>
            </div>
        </div>
    </div>
</template>