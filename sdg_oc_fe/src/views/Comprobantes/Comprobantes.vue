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


const loader=useLoaderStore()
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

const handlePageChange = async(offset: number) => {
    if(currentOffset.value==0 && offset<0) return
    currentOffset.value = currentOffset.value + offset
    await handleFilterComprobantes()
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
                        <SelectTrigger class="w-[200px]">
                            <SelectValue placeholder="Filtrar por Tipo Factura" />
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
            </div>
            <DataTable :columns="columns" :data="comprobantes" />
        </div>
        <div class="mt-4 flex w-full justify-center">
            <div class="flex items-center gap-1 text-gray-500 ">
                <Button variant="outline" :class="{'w-8 h-8': previousPage, 'w-8 h-8 pointer-events-none opacity-50': !previousPage}" @click="handlePageChange(-1)">
                    <ChevronLeft />
                </Button>
                <Select v-model="currentLimit" @update:model-value="handleFilterComprobantes">
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