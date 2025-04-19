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
import { computed, onMounted, ref } from 'vue';
import { obrasSocialesApi } from '@/api/libs/obrasSociales';
import { CondicionIva } from '@/api/entities/venta';
import { condicionIvaDisplay } from '@/lib/utils';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { formatDate } from '@/lib/utils.recetas';
import Button from '@/components/ui/button/Button.vue';
import { Inspect, Settings } from 'lucide-vue-next';
import Label from '@/components/ui/label/Label.vue';
import { RangeCalendar } from '@/components/ui/range-calendar'
import {
  CalendarDate,
  DateFormatter,
  getLocalTimeZone,
} from '@internationalized/date'
import { CalendarIcon } from 'lucide-vue-next'
import type { DateRange } from 'reka-ui'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import ScrollArea from '@/components/ui/scroll-area/ScrollArea.vue';
import { UUID } from 'crypto';
import router from '@/router';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const dateRange = ref<DateRange>({
  start: undefined,
  end: undefined,
})

const reporte = ref <{obraSocial: { id: number, nombre: string, condicionesIVA: { condicionIVA: CondicionIva, suma_importe: number, movimientos: { ventaId: UUID, fecha: Date, nombreCliente: string, apellidoCliente: string, importe: number, condicionIVA: CondicionIva; }[]; }[]; }; }[]>([]);

const loadData = async()=>{
    reporte.value = await obrasSocialesApi.getReporteMontos(
        dateRange.value.start ? formatDateValue(dateRange.value.start as CalendarDate | undefined) : '',
        dateRange.value.end ? formatDateValue(dateRange.value.end as CalendarDate | undefined) : ''
    )
}

onMounted(async () => {
    const today = new Date()
    const currentMonth = today.getMonth() + 1 
    const currentYear = today.getFullYear()

    const previousMonth = currentMonth === 1 ? 12 : currentMonth - 1
    const previousYear = currentMonth === 1 ? currentYear - 1 : currentYear

    const start = new CalendarDate(previousYear, previousMonth, 1)

    const firstOfCurrentMonth = new Date(currentYear, currentMonth - 1, 1)
    const lastOfPreviousMonthDate = new Date(firstOfCurrentMonth.getTime() - 1) 
    const end = new CalendarDate(
        lastOfPreviousMonthDate.getFullYear(),
        lastOfPreviousMonthDate.getMonth() + 1,
        lastOfPreviousMonthDate.getDate()
    )

    dateRange.value.start = start
    dateRange.value.end = end

    await loadData()
});

const df = new DateFormatter('es-AR', {
  dateStyle: 'medium',
})

const formatDateValue = (dateValue: CalendarDate | undefined): string => {
    if (!dateValue) return '';
    const year = dateValue.year;
    const month = String(dateValue.month).padStart(2, '0');
    const day = String(dateValue.day).padStart(2, '0');
    return `${year}-${month}-${day}`;
};


const handleDateRangeChange = async(newRange: DateRange) => {
  if (newRange.start && newRange.end) {
    dateRange.value.start = newRange.start
    dateRange.value.end = newRange.end
  }
  await loadData()
}

const generateObrasSocialesPDF = () => {

    const fDesde = dateRange.value.start ? formatDateValue(dateRange.value.start as CalendarDate | undefined) : ''
    const fHasta =dateRange.value.end ? formatDateValue(dateRange.value.end as CalendarDate | undefined) : ''

    const today = new Date()



    const data = reporte.value;

  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Resumen Facturación Obras Sociales", 105, 20, { align: "center" });
  doc.setFontSize(14);
  doc.text(`Fecha Ventas: ${fDesde} al ${fHasta}`, 105, 30, { align: "center" });
  doc.setFontSize(10);
  doc.text(`Fecha Emisión: ${today.toISOString()}`, 200, 40, { align: "right" });

  let y = 40;

  data.forEach(({ obraSocial }) => {
    y += 10;

    doc.setFontSize(14);
    doc.text(`Obra Social: ${obraSocial.nombre}`, 20, y);
    y += 6;

    const rows = obraSocial.condicionesIVA.map((cond) => [
      `Condición IVA: ${condicionIvaDisplay(cond.condicionIVA)}`,
      `$${cond.suma_importe.toFixed(2)}`,
    ]);

    autoTable(doc, {
      startY: y,
      head: [["Condición IVA", "Importe Total"]],
      body: rows,
      margin: { left: 20, right: 20 },
      styles: { fontSize: 10 },
    });

    y = (doc as any).lastAutoTable.finalY + 10;
    if (y > 260) {
      doc.addPage();
      y = 20;
    }
  });
  doc.addPage();
  doc.setFontSize(18);
  doc.text("Detalle de Movimientos", 105, 20, { align: "center" });

  y = 30;

  data.forEach(({ obraSocial }) => {
    y += 10;

    doc.setFontSize(14);
    doc.text(`Obra Social: ${obraSocial.nombre}`, 20, y);
    y += 6;

    const movimientos = obraSocial.condicionesIVA.flatMap(
      (c) => c.movimientos
    );

    const detalleRows = movimientos.map((m) => [
      `${m.nombreCliente} ${m.apellidoCliente}`,
      new Date(m.fecha).toLocaleDateString(),
      `$${m.importe.toFixed(2)}`,
      condicionIvaDisplay(m.condicionIVA) || '',
    ]);

    autoTable(doc, {
      startY: y,
      head: [["Cliente", "Fecha", "Importe", "Cond. IVA"]],
      body: detalleRows,
      margin: { left: 20, right: 20 },
      styles: { fontSize: 10 },
    });

    y = (doc as any).lastAutoTable.finalY + 10;
    if (y > 260) {
      doc.addPage();
      y = 20;
    }
  });

  doc.save(`reporte_obras_sociales_${today.toISOString().split('T')[0]}.pdf`);
};

const movimientosQty = computed( () => 
  reporte.value.reduce((total, { obraSocial }) => 
    total + obraSocial.condicionesIVA.reduce((sum, { movimientos }) => 
      sum + movimientos.length, 0), 0)
);

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
                    <BreadcrumbPage>Reportes</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
        <h1 class="page-title ">Facturación Obras Sociales</h1>
        <div class="pt-2 flex flex-row gap-x-20 justify-start items-start mt-10">
            <div class=" flex flex-col justify-start items-end w-[35rem]">
            <div class="h-[15rem] flex flex-col justify-around  items-center w-[35rem] p-4 rounded-lg border mb-8 ">
                <div class="flex flex-row justify-evenly gap-x-3 items-center">
                    <Label>Seleccionar fecha reporte</Label>
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
                <Button v-if="movimientosQty" class="w-[20rem]" @click="generateObrasSocialesPDF" >Exportar Reporte</Button>
            </div>
            <Button variant="ghost" class="underline " @click="router.push(`/obras-sociales`)" > Obras Sociales <Settings :size="14"/> </Button>
            </div>
            <div class="flex flex-col">
            <div v-for="osReporte in reporte" class="flex flex-col">
                <div class="flex flex-col mb-12 w-[45rem]">
                    <h2 class="font-bold rounded-lg bg-secondary p-4">{{ osReporte.obraSocial.nombre }}</h2>
                        <Accordion type="single" class="w-[95%] ml-4 justify-start flex flex-col" collapsible >
                            <AccordionItem v-for="item in osReporte.obraSocial.condicionesIVA" :key="item.condicionIVA" :value="item.condicionIVA.toString()">
                                <AccordionTrigger class="flex flex-row justify-start">
                                        <span class="w-[30rem] text-left">{{ condicionIvaDisplay(item.condicionIVA) }}</span>
                                        <span class="w-[10rem]">$ {{ item.suma_importe.toFixed(2) }}</span>
                                </AccordionTrigger>
                                <AccordionContent>
                                    <ScrollArea class="h-[15rem] w-full border-x p-4">
            
                                        
                                        <div class="flex flex-row justify-start items-center border-b h-16" v-for="mov in item.movimientos">
                                            <span class="w-[8rem]">{{ formatDate(mov.fecha) }}</span>
                                            <span class="w-[15rem]">{{mov.apellidoCliente}} , {{ mov.nombreCliente }}</span>
                                            <span class="w-[10rem]">$ {{ mov.importe.toFixed(2) }}</span>
                                            <Button variant="ghost" class="underline " @click="router.push(`/ventas/view/${mov.ventaId}`)" > Ver venta <Inspect :size="14"/> </Button>
                                        </div>
                                    </ScrollArea>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>
            </div>
            <div v-if="!reporte.length" class="border rounded-lg flex justify-center items-center w-[45rem] h-[15rem] px-10 text-center" > <h1> No se encontraron montos para facturar a obras sociales en el rango de fechas seleccionado</h1></div>
            </div>
        </div>
    </div>
</template>