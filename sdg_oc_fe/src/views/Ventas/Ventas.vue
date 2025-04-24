<script setup lang="ts">
import { Venta } from "@/api/entities/venta";
import { comprobantesApi } from "@/api/libs/comprobantes";
import { ventasApi } from "@/api/libs/ventas";
import AlertAcept from "@/components/AlertAcept.vue";
import AlertError from "@/components/AlertError.vue";
import { columns } from "@/components/tables/ventas/columns";
import DataTable from "@/components/tables/ventas/data-table.vue";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RangeCalendar } from "@/components/ui/range-calendar";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { useLoaderStore } from "@/stores/LoaderStore";
import {
  CalendarDate,
  DateFormatter,
  getLocalTimeZone,
} from "@internationalized/date";
import { ReloadIcon, SlashIcon } from "@radix-icons/vue";
import { AlertCircle, CalendarIcon, ChevronLeft, ChevronRight } from "lucide-vue-next";
import type { DateRange } from "reka-ui";
import { onMounted, ref } from "vue";

const loader = useLoaderStore();

const selectedTipoFactura = ref<string>("");
const txtSearch = ref<string>("");
const currentLimit = ref<string>("10");
const currentOffset = ref<number>(0);

const qtyPendientes = ref<number>(0);

const showError = ref<boolean>(false);
const errorMessage = ref<string>("");
const messagePendientes = ref<string>("");
const showPendientesAlert = ref<boolean>(false);
const showPendientesError = ref<boolean>(false);

const dateRange = ref<DateRange>({
  start: undefined,
  end: undefined,
});

const nextPage = ref<number | null>(null);
const previousPage = ref<number | null>(null);

const ventas = ref<Venta[]>([]);

const handleFilterVentas = async () => {
  loader.show();
  await handleSearchVentas();
  loader.hide()
};

const handleSearchVentas = async()=>{
  try {
    const resp = await ventasApi.getAll({
      nombreCliente: txtSearch.value,
      fechaDesde: dateRange.value.start
        ? formatDateValue(dateRange.value.start as CalendarDate | undefined)
        : "",
      fechaHasta: dateRange.value.end
        ? formatDateValue(dateRange.value.end as CalendarDate | undefined)
        : "",
      tipoComprobante: selectedTipoFactura.value,
      offset: currentOffset.value,
      limit: currentLimit.value,
    });
    ventas.value = resp.items;
    nextPage.value = resp.nextPage;
    previousPage.value = resp.previousPage;
  } catch (err: any) {
    errorMessage.value = err.message as string;
    showError.value = true;
  }finally{
    loader.hide();
  }
}

const formatDateValue = (dateValue: CalendarDate | undefined): string => {
  if (!dateValue) return "";
  const year = dateValue.year;
  const month = String(dateValue.month).padStart(2, "0");
  const day = String(dateValue.day).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const clearFilters = async () => {
  (txtSearch.value = ""), (dateRange.value.start = undefined);
  dateRange.value.end = undefined;
  (selectedTipoFactura.value = ""),
    (currentOffset.value = 0),
    (currentLimit.value = "10");
  await handleFilterVentas();
};

onMounted(async () => {
  const pendientes = await ventasApi.getAll({tipoComprobante: "pendiente"});
  qtyPendientes.value = pendientes.items.length;
  await handleFilterVentas();
});

const handlePageChange = async (targetOffset: number | null) => {
  if (targetOffset == null) return;
  currentOffset.value = targetOffset;
  await handleFilterVentas();
};

const handleLimitChange = async (newLimit: string) => {
  currentLimit.value = newLimit;
  currentOffset.value = 0;
  await handleFilterVentas();
};

const df = new DateFormatter("es-AR", {
  dateStyle: "medium",
});

const handleDateRangeChange = async (newRange: DateRange) => {
  if (newRange.start && newRange.end) {
    dateRange.value.start = newRange.start;
    dateRange.value.end = newRange.end;
  }
  await handleFilterVentas();
};

const handleFacturarPendientes = async () => {
  try {
    loader.show();
      const res = await comprobantesApi.facturarPendientes();
      messagePendientes.value = res.resultados.fallidas.length ? `La facturación falló para algunas ventas.` : res.message
      if(res.resultados.fallidas.length){
        showPendientesError.value=true;
      }else{
        showPendientesAlert.value=true;
      }
      const ventasRes = await ventasApi.getAll({});
      ventas.value = ventasRes.items;
  } catch (err: any) {
    errorMessage.value = err.message as string;
    showError.value = true;
  }finally{
    loader.hide();
  }
};
</script>

<template>
  <div class="page">
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/"> Inicio </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <SlashIcon />
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbPage>Ventas</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
    <h1 class="page-title">Ventas</h1>
    <div class="pt-2">
      <div class="flex flex-row justify-between items-center py-4">
        <div
          class="search flex w-[65rem] flex-row justify-start items-center gap-x-4"
        >
          <Input
            class="max-w-sm"
            placeholder="Buscar cliente"
            v-model="txtSearch"
            @input="(e: any) => e.target.value.length >= 0 && handleSearchVentas()"
          />
          <Select
            v-model="selectedTipoFactura"
            @update:model-value="handleFilterVentas"
          >
            <SelectTrigger class="w-[200px]">
              <SelectValue placeholder="Filtrar por tipo factura" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="1">Factura A</SelectItem>
                <SelectItem value="6">Factura B</SelectItem>
                <SelectItem value="pendiente"
                  >Pendientes de facturar</SelectItem
                >
              </SelectGroup>
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger as-child>
              <Button
                variant="outline"
                :class="{
                  'w-[280px] justify-start text-left font-normal': true,
                  'text-muted-foreground': !dateRange?.start,
                }"
              >
                <CalendarIcon class="mr-2 h-4 w-4" />
                <template v-if="dateRange?.start">
                  {{ df.format(dateRange.start.toDate(getLocalTimeZone())) }}
                  <template v-if="dateRange?.end">
                    - {{ df.format(dateRange.end.toDate(getLocalTimeZone())) }}
                  </template>
                </template>
                <template v-else> Filtrar por fecha </template>
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
          <Button
            variant="ghost"
            @click="clearFilters"
            class="text-gray-500 text-xs font-light hover:bg-transparent hover:cursor-pointer hover:underline"
          >
            <ReloadIcon />
          </Button>
        </div>
        <Button @click="handleFacturarPendientes" variant="outline" v-if="qtyPendientes" class="text-xs">
          Emitir facturas pendientes</Button
        >
      </div>
      <DataTable :columns="columns" :data="ventas" />
    </div>
    <div class="mt-4 flex w-full justify-center">
      <div class="flex items-center gap-1 text-gray-500">
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
    <AlertError
      v-model="showError"
      title="Error"
      :message="errorMessage"
      button="Aceptar"
      :action="
        () => {
          showError = false;
        }
      "
    />

    <AlertAcept
      v-model="showPendientesAlert"
      title="Facturar ventas pendientes"
      :message="messagePendientes"
      primary-btn="Aceptar"
      :primary-action="() => (showPendientesAlert = false)"
    />

    <AlertDialog :open="showPendientesError">
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle class="text-center w-full">Facturar ventas pendiente</AlertDialogTitle>
        <AlertDialogDescription class="text-center w-full text-md text-destructive flex flex-row justify-center items-center">
            <AlertCircle class="w-4 h-4 mr-2" />
          <p>
            {{ messagePendientes }}
          </p>
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter class=" mt-4 flex sm:justify-center  lg:justify-center  md:justify-center  xs:justify-center  xl:justify-center 2xl:justify-center w-full" >
        <AlertDialogAction class="w-[45%]" @click="showPendientesError=false">
          Aceptar
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
  </div>
</template>
