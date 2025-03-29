<script setup lang="ts">
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {ScrollArea} from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { onMounted, ref } from 'vue';
import { Button } from '@/components/ui/button';
import Label from './ui/label/Label.vue';
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
import { Comprobante } from '@/api/entities/comprobante';
import { comprobantesApi } from '@/api/libs/comprobantes';
import { formatDate } from '@/lib/utils.recetas';
import { tipoComprobanteDisplay } from '@/lib/utils';

const foundFacturas = ref<Comprobante[]>([]);

const props = defineProps<{
  clienteId: number;
    modelValue: boolean;
  title: string;
}>();


const dateRange = ref<DateRange>({
  start: undefined,
  end: undefined,
})


const toDateValue = (date: CalendarDate): DateValue => {
  return parseDate(`${date.year}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`)
}

const emit = defineEmits(['update:modelValue', 'selectFactura']);

const df = new DateFormatter('en-US', {
  dateStyle: 'medium',
})

onMounted(async()=>{
    foundFacturas.value = await comprobantesApi.getFacturasByCliente(props.clienteId);
    console.log(foundFacturas.value)
});

const selectFactura = (factura: Comprobante)=>{
    emit('selectFactura', factura);
}

const handleDateRangeChange = (newRange: DateRange) => {
  if (newRange.start && newRange.end) {
   // TODO hacer un get por fechas
  }
}

</script>

<template>
    <Dialog :open="modelValue"  @update:open="emit('update:modelValue', $event)" >
        <DialogContent class="w-[60rem] h-[40rem] max-w-[60rem] px-8">
            <DialogHeader>
                <DialogTitle class="text-center">{{ title }}</DialogTitle>
            </DialogHeader>
            <Separator  class="my-2" />
            <div v-if="foundFacturas.length==0" class="flex h-[30rem] pt-20 justify-center">
                <p>No se encontraron facturas emitidas para el cliente seleccionado</p>
            </div>
            <div v-else class="flex flex-col justify-start">  
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
                <ScrollArea class="h-[30rem] w-[51rem] pl-4 mt-6">
                    <div v-for="fac in foundFacturas" 
                        :key="fac.id" 
                        @click="selectFactura(fac)"
                        class="cursor-pointer search-area-item rounded-sm hover:bg-secondary px-4 py-2 w-[49rem] h-16 flex flex-row justify-between items-center"
                    >
                        <div class="w-[30rem]  flex flex-row justify-start items-center">
                            <Label class=" w-[6rem]  bg-secondary rounded-lg py-2  text-xs text-center">{{ tipoComprobanteDisplay(fac.tipoComprobante) }}</Label>
                            <Label class=" w-[10rem] text-sm text-center">{{ fac.numeroComprobante }}</Label>
                            <Label class="text-sm text-center">-</Label>
                            <Label class="ml-6 text-sm font-thin">{{ formatDate(fac.fechaEmision) }}</Label>
                        </div>
                        <Label class="w-[8rem] ml-6 text-sm "> $ {{ fac.importeTotal.toFixed(2) }}</Label>
                    </div>
                </ScrollArea>
            </div>
        </DialogContent>
    </Dialog>
</template>