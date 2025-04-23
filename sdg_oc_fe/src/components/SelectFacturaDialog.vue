<script setup lang="ts">
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {ScrollArea} from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { onMounted, ref, watch } from 'vue';
import { Button } from '@/components/ui/button';
import Label from './ui/label/Label.vue';
import { RangeCalendar } from '@/components/ui/range-calendar'
import {
  CalendarDate,
  DateFormatter,
  getLocalTimeZone,
} from '@internationalized/date';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-vue-next'
import type { DateRange } from 'reka-ui'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Comprobante } from '@/api/entities/comprobante';
import { comprobantesApi } from '@/api/libs/comprobantes';
import { formatDate } from '@/lib/utils.recetas';
import { tipoComprobanteDisplay } from '@/lib/utils';
import LoaderForm from './LoaderForm.vue';

const loading = ref<boolean>(false);

const foundFacturas = ref<Comprobante[]>([]);
const currentLimit = ref<string>("10");
const currentOffset = ref<number>(0);

const nextPage = ref<number | null>(null);
const previousPage = ref<number | null>(null);

const props = defineProps<{
  nroDocumento: number;
    modelValue: boolean;
  title: string;
}>();


const dateRange = ref<DateRange>({
  start: undefined,
  end: undefined,
})

const emit = defineEmits(['update:modelValue', 'selectFactura']);

const df = new DateFormatter('es-AR', {
  dateStyle: 'medium',
})

const loadFacturas = async () => {
  loading.value=true;
  const resp = await comprobantesApi.getFacturasByCliente({
    nroDocumento: props.nroDocumento.toString(),
    offset: currentOffset.value,
    limit: currentLimit.value,
  });
  foundFacturas.value = resp.items;
  nextPage.value = resp.nextPage;
  previousPage.value = resp.previousPage;
  loading.value=false;
};


onMounted(async()=>{
  await loadFacturas();
});


watch(
  () => props.nroDocumento,
  () => {
    if (props.modelValue) {
      loadFacturas();
    }
  }
);


watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen) { 
      loadFacturas();
    } else { 
      foundFacturas.value = [];
    }
  }
);

const selectFactura = (factura: Comprobante)=>{
    emit('selectFactura', factura);
    foundFacturas.value=[];
}

const handleDateRangeChange = async (newRange: DateRange) => {
  if (newRange.start && newRange.end) {
    loading.value=true;
  const facturas = await comprobantesApi.getFacturasByCliente({
    nroDocumento: props.nroDocumento.toString(),
    fechaDesde: dateRange.value.start ? formatDateValue(dateRange.value.start as CalendarDate | undefined) : '',
    fechaHasta: dateRange.value.end ? formatDateValue(dateRange.value.end as CalendarDate | undefined) : '',
  })
  foundFacturas.value = facturas.items;
    loading.value=false;

  }
}

const formatDateValue = (dateValue: CalendarDate | undefined): string => {
    if (!dateValue) return '';
    const year = dateValue.year;
    const month = String(dateValue.month).padStart(2, '0');
    const day = String(dateValue.day).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const handlePageChange = async (targetOffset: number | null) => {
  if (targetOffset == null) return;
  currentOffset.value = targetOffset;
  await loadFacturas();
};

const handleLimitChange = async (newLimit: string) => {
  currentLimit.value = newLimit;
  currentOffset.value = 0;
  await loadFacturas();
};

</script>

<template>
    <Dialog :open="modelValue"  @update:open="emit('update:modelValue', $event)" >
        <DialogContent class="w-[60rem] h-[53rem] max-w-[60rem] px-8 flex justify-start flex-col">
            <DialogHeader>
                <DialogTitle class="text-center">{{ title }}</DialogTitle>
            </DialogHeader>
            <Separator  class="my-2" />
            <div class="flex flex-col justify-start items-center ">  
                <div class="flex flex-row justify-between px-6 h-6 mb-10">
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
                </div>
                <div class="h-[40rem] w-[50rem] mt-6  border rounded-lg"  v-if="foundFacturas.length && !loading">
                    <ScrollArea class="h-[35rem] w-[48rem] pl-4 mt-6" >
                      <div v-for="fac in foundFacturas" 
                      :key="fac.id" 
                      @click="selectFactura(fac)"
                      class="cursor-pointer search-area-item rounded-lg hover:bg-secondary px-4 py-2 w-[49rem] h-16 flex flex-row justify-between items-center"
                      >
                      <div class="w-[30rem]  flex flex-row justify-start items-center">
                        <Label class=" w-[6rem]  bg-secondary rounded-lg py-2  text-xs text-center">{{ tipoComprobanteDisplay(fac.tipoComprobante)?.nombre }} {{ tipoComprobanteDisplay(fac.tipoComprobante)?.letra }}</Label>
                        <Label class=" w-[10rem] text-sm text-center">{{ fac.numeroComprobante }}</Label>
                        <Label class="text-sm text-center">-</Label>
                        <Label class="ml-6 text-sm font-thin">{{ formatDate(fac.fechaEmision) }}</Label>
                      </div>
                      <Label class="w-[8rem] ml-6 text-sm "> $ {{ fac.importeTotal.toFixed(2) }}</Label>
                    </div>
                  </ScrollArea>
                  <div class="flex items-center justify-center gap-1 text-gray-500">
                        <Button
                          variant="outline"
                          class="h-8"
                          :disabled="previousPage === null"
                          @click="handlePageChange(previousPage)"
                        >
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
                        <Button
                          variant="outline"
                          class="h-8"
                          :disabled="nextPage === null"
                          @click="handlePageChange(nextPage)"
                        >
                          <ChevronRight />
                        </Button>
                      </div>
              </div>
                <div v-if="!loading && !foundFacturas.length" class="flex h-[40rem] w-[50rem] border rounded-lg  pt-20 justify-center">
                    <p>No se encontraron facturas emitidas para el cliente seleccionado</p>
                </div>
                <div v-if="loading" class="flex h-[40rem] w-[50rem] border rounded-lg  pt-20 justify-center">
                    <LoaderForm />
                </div>
            </div>
        </DialogContent>
    </Dialog>
</template>