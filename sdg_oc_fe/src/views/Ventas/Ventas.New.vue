<script setup lang="ts">
import { Cliente } from "@/api/entities/clientes";
import { createLineaVentaCustomValidator } from "@/api/entities/lineaVenta";
import {
  RedDePago,
  TipoMedioDePagoEnum,
  createMedioPagoCustomValidator,
} from "@/api/entities/mediosDePago";
import { Producto } from "@/api/entities/producto";
import {
  CondicionIva,
  createVentaCustomValidator,
  ventaObrasSocialesCustomValidator,
} from "@/api/entities/venta";
import { cajaApi } from "@/api/libs/caja";
import { clientesApi } from "@/api/libs/clientes";
import { ventasApi } from "@/api/libs/ventas";
import AddObraSocialClienteForm from "@/components/AddObraSocialCliente.Form.vue";
import AlertError from "@/components/AlertError.vue";
import LoaderForm from "@/components/LoaderForm.vue";
import SelectClienteDialog from "@/components/SelectClienteDialog.vue";
import SelectProductoDialog from "@/components/SelectProductoDialog.vue";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import Label from "@/components/ui/label/Label.vue";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { condicionIvaDisplay, isValidNumber } from "@/lib/utils";
import { router } from "@/router";
import { useCajaStore } from "@/stores/CajaStore";
import { useLoaderStore } from "@/stores/LoaderStore";
import {
  ArrowRightIcon,
  Cross2Icon,
  MagicWandIcon,
  PlusIcon,
  SlashIcon,
} from "@radix-icons/vue";
import { AlertCircleIcon, AsteriskIcon, PlusCircleIcon } from "lucide-vue-next";
import { computed, nextTick, onMounted, ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const cajaStore = useCajaStore();
const loader = useLoaderStore();
const loadingForm = ref<boolean>(false);

const showError = ref<boolean>(false);
const errorMessage = ref<string>("");
const selectedCliente = ref<Cliente>();
const searchClienteOpen = ref<boolean>(false);
const searchProductoOpen = ref<boolean>(false);
const showMedioPago = ref<boolean>(false);
const openSelectOS = ref<boolean>(false);
const openSelectOSIndex = ref<number>(0);
const openNewClienteOS = ref<boolean>(false);
const newOsIndex = ref<number>();

const importeOpenCaja = ref<number>(0);
const isValidImporteOpenCaja = ref<boolean>(true);
const openDialogOpenCaja = ref<boolean>(false);
const openDialogClosedCaja = ref<boolean>(false);
const showErrorNotCaja = ref<boolean>(false);

const lineasDeVenta = ref<
  {
    producto: { id: number | undefined; descripcion: string; codProv: string };
    cantidad: number;
    precioIndividual: number;
  }[]
>([]);
const mediosDePago = ref<
  {
    importe: number;
    tipoMedioDePago: TipoMedioDePagoEnum | undefined;
    redDePago: RedDePago | undefined;
    entidadBancaria: string | undefined;
  }[]
>([]);
const ventaObrasSociales = ref<
  {
    obraSocial: { id: number | undefined };
    importe: number;
    condicionIva: CondicionIva | undefined;
  }[]
>([]);
const porcDto = ref<number>(0);
const dto = ref<boolean>(false);
const obrasSociales = ref<boolean>(false);
const observaciones = ref<string>("");

const fechaVenta = ref<Date>(new Date());

const condicionIvaVenta = ref<CondicionIva | undefined>();
const availableCondicionIva = ref<CondicionIva[]>([
  CondicionIva.CONSUMIDOR_FINAL,
]);

const isValidVenta = ref<{
  cliente: boolean;
  descuentoPorcentaje: boolean;
  condicionIvaVenta: boolean;
}>({
  cliente: true,
  descuentoPorcentaje: true,
  condicionIvaVenta: true,
});

const isvalidLineasVenta = ref<
  {
    producto: boolean;
    cantidad: boolean;
    precioIndividual: boolean;
  }[]
>([]);

const isvalidVentaObraSocial = ref<
  {
    obraSocial: boolean;
    importe: boolean;
    condicionIva: boolean;
  }[]
>([]);

const isValidMediosPago = ref<
  {
    tipoMedioDePago: boolean;
    entidadBancaria: boolean;
    redDePago: boolean;
    importe: boolean;
  }[]
>([]);
const isValidImporteMedios = ref<boolean>(true);
const isValidImporteObrasSociales = ref<boolean>(true);

const addLineaVenta = async () => {
  lineasDeVenta.value.push({
    producto: { id: undefined, descripcion: "", codProv: "" },
    cantidad: 1,
    precioIndividual: 0,
  });
  isvalidLineasVenta.value.push({
    producto: true,
    cantidad: true,
    precioIndividual: true,
  });
  await nextTick();
};

const addMedioPago = async () => {
  isValidMediosPago.value.push({
    tipoMedioDePago: true,
    entidadBancaria: true,
    redDePago: true,
    importe: true,
  });
  mediosDePago.value.push({
    importe: 0,
    tipoMedioDePago: undefined,
    redDePago: undefined,
    entidadBancaria: undefined,
  });
  await nextTick();
};

const removeLineaVenta = (index: number) => {
  lineasDeVenta.value.splice(index, 1);
};

const removeMedioPago = (index: number) => {
  mediosDePago.value.splice(index, 1);
};

const removeVentaObraSocial = (index: number) => {
  ventaObrasSociales.value.splice(index, 1);
};

const addPagoDefault = async () => {
  mediosDePago.value.push({
    importe: caluclateImportePago.value,
    tipoMedioDePago: TipoMedioDePagoEnum.EFECTIVO,
    redDePago: undefined,
    entidadBancaria: undefined,
  });
  isValidMediosPago.value.push({
    tipoMedioDePago: true,
    entidadBancaria: true,
    redDePago: true,
    importe: true,
  });
};

const addVentaObraSocial = () => {
  isvalidVentaObraSocial.value.push({
    obraSocial: true,
    importe: true,
    condicionIva: true,
  });
  ventaObrasSociales.value.push({
    obraSocial: { id: undefined },
    importe: 0,
    condicionIva: undefined,
  });
};

const onSubmit = async () => {
  try {
    loader.show();
    const newVenta = {
      cliente: { id: selectedCliente.value?.id },
      condicionIva: condicionIvaVenta.value,
      descuentoPorcentaje: porcDto.value && dto.value ? porcDto.value : 0,
      mediosDePago: mediosDePago.value,
      lineasDeVenta: lineasDeVenta.value,
      ventaObraSocial:
        ventaObrasSociales.value && obrasSociales.value
          ? ventaObrasSociales.value
          : [],
      observaciones: observaciones.value,
    };
    console.log(newVenta);
    const createdVenta = await ventasApi.create(newVenta);
    loader.hide();
    router.push(`/ventas/view/${createdVenta.venta.id}`);
    toast({
      title: "Venta registrada con éxito",
    });
  } catch (err: any) {
    const message = err.message as string;
    if (
      message ==
      "No se puede crear una venta ya que no se hizo la apertura del día"
    ) {
      showErrorNotCaja.value = true;
    } else {
      errorMessage.value = err.message as string;
      showError.value = true;
    }
    loader.hide();
  }
};

const validateAndSubmit = async () => {
  const resultVenta = createVentaCustomValidator({
    cliente: { id: selectedCliente.value?.id },
    descuentoPorcentaje: porcDto.value,
    condicionIvaVenta: condicionIvaVenta.value,
  });
  isValidVenta.value = resultVenta.isValid;

  const resultLineasVenta = createLineaVentaCustomValidator(
    lineasDeVenta.value
  );
  isvalidLineasVenta.value = resultLineasVenta.isValid;

  const resultMedios = createMedioPagoCustomValidator(mediosDePago.value);
  isValidMediosPago.value = resultMedios.isValid;

  let resultVentasOS;
  if (ventaObrasSociales.value.length) {
    resultVentasOS = ventaObrasSocialesCustomValidator(
      ventaObrasSociales.value
    );
    isvalidVentaObraSocial.value = resultVentasOS.isValid;
    if (
      !resultVentasOS.success &&
      ventaObrasSociales.value.length == 1 &&
      !ventaObrasSociales.value[1]?.obraSocial
    ) {
      ventaObrasSociales.value = [];
      resultVentasOS.success = true;
      obrasSociales.value = false;
    }
  } else {
    obrasSociales.value = false;
  }

  if (
    resultLineasVenta?.success &&
    resultMedios?.success &&
    (!ventaObrasSociales.value.length || resultVentasOS?.success) &&
    resultVenta.success
  ) {
    isValidImporteMedios.value =
      caluclateImportePago.value == importeIngresado.value;
    isValidImporteObrasSociales.value = !(
      totalVentaBruto.value < montoObrasSociales.value
    );
    if (isValidImporteMedios.value && isValidImporteObrasSociales.value) {
      await onSubmit();
    }
  }
};

const middleValidate = async () => {
  const resultVenta = createVentaCustomValidator({
    cliente: { id: selectedCliente.value?.id },
    descuentoPorcentaje: porcDto.value,
    condicionIvaVenta: condicionIvaVenta.value,
  });
  isValidVenta.value = resultVenta.isValid;

  const resultLineasVenta = createLineaVentaCustomValidator(
    lineasDeVenta.value
  );
  isvalidLineasVenta.value = resultLineasVenta.isValid;

  let resultVentasOS;
  if (ventaObrasSociales.value.length) {
    resultVentasOS = ventaObrasSocialesCustomValidator(
      ventaObrasSociales.value
    );
    isvalidVentaObraSocial.value = resultVentasOS.isValid;
    if (
      !resultVentasOS.success &&
      ventaObrasSociales.value.length == 1 &&
      !ventaObrasSociales.value[0]?.obraSocial.id
    ) {
      ventaObrasSociales.value = [];
      resultVentasOS.success = true;
      obrasSociales.value = false;
    }
  } else {
    obrasSociales.value = false;
  }

  if (
    resultLineasVenta?.success &&
    resultVenta.success &&
    (!ventaObrasSociales.value.length || resultVentasOS?.success)
  ) {
    isValidImporteObrasSociales.value = !(
      totalVentaBruto.value < montoObrasSociales.value
    );
    if (isValidImporteObrasSociales.value) {
      moveToMediosPago();
    }
  }
};

onMounted(async () => {
  loader.show();
  addLineaVenta();
  const cierre = await cajaStore.isCajaClosedToday();
  console.log(cierre, "c");
  openDialogClosedCaja.value = cierre;
  if (cierre) {
    openDialogClosedCaja.value = true;
    loader.hide();
    return;
  }
  const cajaOpened = await cajaStore.isCajaOpenedToday();
  openDialogOpenCaja.value = !cajaOpened;
  const query = route.query;
  if (query.cliente) {
    const foundCliente = await clientesApi.getOne(Number(query.cliente));
    if (foundCliente) handleSelectCliente(foundCliente);
  }
  loader.hide();
});

const handleSelectCliente = async (cliente: Cliente) => {
  obrasSociales.value = false;
  ventaObrasSociales.value = [];
  availableCondicionIva.value = [CondicionIva.CONSUMIDOR_FINAL];
  if (cliente.categoriaFiscal != CondicionIva.CONSUMIDOR_FINAL) {
    availableCondicionIva.value.push(cliente.categoriaFiscal as CondicionIva);
  }
  selectedCliente.value = cliente;
  searchClienteOpen.value = false;
  condicionIvaVenta.value = CondicionIva.CONSUMIDOR_FINAL;
  if (cliente.id == 0) {
    mediosDePago.value.forEach((mp) => {
      if (
        TipoMedioDePagoEnum[
          mp.tipoMedioDePago as keyof typeof TipoMedioDePagoEnum
        ] === TipoMedioDePagoEnum.CUENTA_CORRIENTE
      ) {
        mp.tipoMedioDePago = undefined;
      }
    });
  }
};

const handleSelectProducto = (_producto: Producto) => {
  const existingLinea = lineasDeVenta.value.find(
    (linea) => linea.producto.id === _producto.id
  );
  if (existingLinea) {
    existingLinea.cantidad += 1;
    if (lineasDeVenta.value.length > 1)
      removeLineaVenta(lineasDeVenta.value.length--);
    toast({
      title: "Producto ya seleccionado",
      description: "Se agregó una unidad.",
    });
  } else {
    lineasDeVenta.value[lineasDeVenta.value.length - 1] = {
      producto: {
        id: _producto.id,
        descripcion: _producto.descripcion,
        codProv: _producto.codProv,
      },
      cantidad: 1,
      precioIndividual: _producto.precio,
    };
    if (!isvalidLineasVenta.value[lineasDeVenta.value.length - 1]?.producto) {
      isvalidLineasVenta.value[lineasDeVenta.value.length - 1] = {
        producto: true,
        cantidad: true,
        precioIndividual: true,
      };
    }
  }
  searchProductoOpen.value = false;
};

const isLastLineaEmpty = computed(() => {
  const lastItem = lineasDeVenta.value[lineasDeVenta.value.length - 1];
  return lastItem
    ? !lastItem.producto.id &&
        lastItem.producto.descripcion === "" &&
        !lastItem.precioIndividual
    : false;
});

const totalVentaBruto = computed(() => {
  return lineasDeVenta.value.reduce((total, linea) => {
    return (
      total +
      (linea.precioIndividual ? linea.precioIndividual * linea.cantidad : 0)
    );
  }, 0);
});

const montoDto = computed(() => {
  return (totalVentaFinal.value * porcDto.value) / 100;
});

const totalVentaFinal = computed(() => {
  if (obrasSociales.value) {
    return totalVentaBruto.value - montoObrasSociales.value;
  } else {
    return totalVentaBruto.value;
  }
});

const caluclateImportePago = computed(() => {
  if (dto.value && montoDto.value) {
    return totalVentaFinal.value - montoDto.value;
  }
  return totalVentaFinal.value;
});

const montoObrasSociales = computed(() => {
  return ventaObrasSociales.value.reduce((total, os) => {
    return total + os.importe;
  }, 0);
});

const importeIngresado = computed<number>(() => {
  return mediosDePago.value.reduce((total, medioPago) => {
    return total + (medioPago.importe || 0);
  }, 0);
});

const moveToMediosPago = () => {
  isValidImporteObrasSociales.value = !(
    totalVentaBruto.value < montoObrasSociales.value
  );
  if (isValidImporteObrasSociales.value) {
    addPagoDefault();
    showMedioPago.value = true;
  }
};

const autocompleteMedioPagoImporte = (index: number) => {
  if (mediosDePago.value[index]) {
    mediosDePago.value[index].importe =
      caluclateImportePago.value - importeIngresado.value;
  }
};

const tipoFactura = computed(() => {
  if (
    condicionIvaVenta.value == CondicionIva.MONOTRIBUTISTA ||
    condicionIvaVenta.value == CondicionIva.RESPONSABLE_INSCRIPTO
  ) {
    return "A";
  } else {
    return "B";
  }
});

const handleShowNewObraSocialCliente = async (index: number) => {
  if (openSelectOS.value) openSelectOS.value = false;
  openSelectOSIndex.value = index;
  newOsIndex.value = index;
  openNewClienteOS.value = true;
  if (!ventaObrasSociales.value.length) {
    addVentaObraSocial();
  }
};

const handleAddObraSocialCliente = async (obraSocialId: number) => {
  if (selectedCliente.value?.id) {
    selectedCliente.value = await clientesApi.getOne(selectedCliente.value?.id);
    if (!isValidNumber(newOsIndex.value)) return;
    setObraSocialIdAtIndex(newOsIndex.value, obraSocialId);
    openNewClienteOS.value = false;
    openSelectOS.value = false;
  }
};

function setObraSocialIdAtIndex(index: number, id: number) {
  if (ventaObrasSociales.value[index] && isvalidVentaObraSocial.value[index]) {
    ventaObrasSociales.value[index].obraSocial.id = id;
    isvalidVentaObraSocial.value[index].importe = true;
    isvalidVentaObraSocial.value[index].obraSocial = true;
    isvalidVentaObraSocial.value[index].condicionIva = true;
  }
}

const availableMedioDePago = computed(() => {
  const entries = Object.entries(TipoMedioDePagoEnum);
  if (!selectedCliente.value) return;
  if (selectedCliente.value.id === 0) {
    return entries.filter(([key]) => key !== "CUENTA_CORRIENTE");
  }
  return entries;
});

const abrirCajaDiaria = async () => {
  try {
    if (importeOpenCaja.value >= 0) {
      loadingForm.value = true;
      await cajaApi.apertura(importeOpenCaja.value);
      openDialogOpenCaja.value = false;
      loadingForm.value = false;
    }
  } catch (e: any) {
    errorMessage.value = e.message as string;
    loadingForm.value = false;
    showError.value = true;
  }
};
</script>

<template>
  <div class="page">
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Inicio</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <SlashIcon />
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbLink href="/ventas">Ventas</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <SlashIcon />
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbPage>Nueva Venta</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
    <h1 class="page-title text-center">Nueva Venta</h1>
    <div class="pt-2">
      <form
        @submit.prevent="validateAndSubmit"
        class="flex flex-row justify-center items-center py-4"
      >
        <div
          class="rounded-[0.5rem] w-full h-auto flex flex-col justify-start items-center"
        >
          <div
            class="flex flex-col sm:flex-row sm:justify-between w-full items-center border rounded-lg p-8"
          >
            <div
              class="h-[8rem] w-[60%] flex flex-row items-between justify-start"
            >
              <div class="w-full flex flex-col items-start justify-evenly">
                <div class="flex flex-row justify-start items-center w-full">
                  <Label class="form-label w-[12rem] text-lg">Cliente</Label>
                  <Input
                    type="text"
                    class="w-full sm:w-[20rem] h-10"
                    readonly
                    :value="
                      selectedCliente
                        ? selectedCliente.id === 0
                          ? 'CONSUMIDOR FINAL'
                          : `${selectedCliente.apellido}, ${selectedCliente.nombre}`
                        : 'Buscar'
                    "
                    @click="searchClienteOpen = true"
                  />
                  <SelectClienteDialog
                    v-model="searchClienteOpen"
                    title="Nueva Venta: Seleccionar Cliente"
                    @select-cliente="handleSelectCliente"
                  />
                  <TooltipProvider v-if="!isValidVenta.cliente">
                    <Tooltip>
                      <TooltipTrigger
                        class="bg-transparent text-xs text-destructive ml-4"
                      >
                        <AsteriskIcon :size="14" />
                      </TooltipTrigger>
                      <TooltipContent
                        class="text-destructive border-destructive font-thin text-xs"
                      >
                        <p>Seleccionar cliente</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div class="flex flex-row justify-start items-center w-full">
                  <Label class="form-label w-[12rem] text-lg"
                    >Condición Fiscal</Label
                  >
                  <Select
                    :model-value="condicionIvaVenta?.toString()"
                    @update:model-value="(value) => {
                      if(value) {
                        condicionIvaVenta = value as unknown as CondicionIva
                      }
                    }"
                  >
                    <SelectTrigger class="text-black w-[20rem]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem
                          v-for="condicion in availableCondicionIva"
                          :key="condicion"
                          :value="condicion.toString()"
                        >
                          {{ condicionIvaDisplay(condicion) }}
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <TooltipProvider v-if="!isValidVenta.condicionIvaVenta">
                    <Tooltip>
                      <TooltipTrigger
                        class="bg-transparent text-xs text-destructive ml-4"
                      >
                        <AsteriskIcon :size="14" />
                      </TooltipTrigger>
                      <TooltipContent
                        class="text-destructive border-destructive font-thin text-xs"
                      >
                        <p>Seleccionar condición fiscal</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </div>
            <div
              class="date w-auto sm:w-[10rem] h-[8rem] text-center flex flex-col justify-between items-center"
            >
              <div
                class="flex flex-col w-[8rem] h-[6rem] border justify-center items-center rounded-lg"
              >
                <span>Factura</span>
                <span class="text-[3rem] leading-[3rem]">{{
                  tipoFactura
                }}</span>
              </div>
              <Label class="text-[1rem]"
                >Fecha: {{ fechaVenta.toLocaleDateString("es-ES") }}</Label
              >
            </div>
          </div>

          <div
            class="flex flex-col w-full justify-start items-start border rounded-lg p-8 mt-10"
          >
            <h3 class="page-subtitle">Detalle</h3>

            <div class="linea-venta-header bg-secondary mt-4 rounded-lg">
              <span>CÓDIGO</span>
              <span class="text-left">DESCRIPCIÓN</span>
              <span>IMPORTE UNITARIO</span>
              <span>CANTIDAD</span>
              <span>IMPORTE TOTAL</span>
              <span></span>
            </div>

            <div
              v-for="(linea, index) in lineasDeVenta"
              :key="index"
              class="linea-venta-item"
            >
              <Input
                @click="searchProductoOpen = true"
                :model-value="linea.producto.codProv"
                readonly
                :class="{
                  'rounded-lg cursor-default focus:outline-none focus:border-none text-center id-input':
                    isvalidLineasVenta[index]?.cantidad &&
                    isvalidLineasVenta[index]?.precioIndividual &&
                    isvalidLineasVenta[index]?.producto,
                  'rounded-lg cursor-default focus:outline-none focus:border-none text-center id-input border-destructive':
                    !(
                      isvalidLineasVenta[index]?.cantidad &&
                      isvalidLineasVenta[index]?.precioIndividual &&
                      isvalidLineasVenta[index]?.producto
                    ),
                }"
                type="text"
              />
              <Input
                @click="searchProductoOpen = true"
                :model-value="linea.producto.descripcion"
                readonly
                :class="{
                  'rounded-lg cursor-default focus:outline-none focus:border-none text-left descripcion-input':
                    isvalidLineasVenta[index]?.cantidad &&
                    isvalidLineasVenta[index]?.precioIndividual &&
                    isvalidLineasVenta[index]?.producto,
                  'rounded-lg cursor-default focus:outline-none focus:border-none text-left descripcion-input border-destructive':
                    !(
                      isvalidLineasVenta[index]?.cantidad &&
                      isvalidLineasVenta[index]?.precioIndividual &&
                      isvalidLineasVenta[index]?.producto
                    ),
                }"
                type="text"
              />
              <Input
                :model-value="linea.precioIndividual"
                @update:model-value="
                  (value) => {
                    if (lineasDeVenta[index]) {
                      lineasDeVenta[index].precioIndividual = Number(value);
                    }
                  }
                "
                v-decimal
                :class="{
                  'rounded-lg cursor-default focus:outline-none  focus:border-none  text-center':
                    isvalidLineasVenta[index]?.cantidad &&
                    isvalidLineasVenta[index]?.precioIndividual &&
                    isvalidLineasVenta[index]?.producto,
                  'rounded-lg cursor-default focus:outline-none  focus:border-none  text-center border-destructive':
                    !(
                      isvalidLineasVenta[index]?.cantidad &&
                      isvalidLineasVenta[index]?.precioIndividual &&
                      isvalidLineasVenta[index]?.producto
                    ),
                }"
              />
              <!-- // TODO disable edition -->
              <Input
                :model-value="linea.cantidad"
                @update:model-value="
                  (value) => {
                    if (lineasDeVenta[index]) {
                      lineasDeVenta[index].cantidad = Number(value);
                    }
                  }
                "
                :class="{
                  'rounded-lg text-center focus:outline-none focus:border-none ':
                    isvalidLineasVenta[index]?.cantidad &&
                    isvalidLineasVenta[index]?.precioIndividual &&
                    isvalidLineasVenta[index]?.producto,
                  'rounded-lg text-center focus:outline-none focus:border-none border-destructive':
                    !(
                      isvalidLineasVenta[index]?.cantidad &&
                      isvalidLineasVenta[index]?.precioIndividual &&
                      isvalidLineasVenta[index]?.producto
                    ),
                }"
                type="number"
                min="1"
              />
              <Label
                class="rounded-lg cursor-default border-none focus:outline-none focus:border-none text-center"
                >{{
                  (linea.cantidad * linea.precioIndividual).toFixed(2)
                }}</Label
              >

              <Button
                size="icon"
                variant="ghost"
                type="button"
                @click="removeLineaVenta(index)"
              >
                <Cross2Icon />
              </Button>

              <TooltipProvider
                v-if="
                  !(
                    isvalidLineasVenta[index]?.cantidad &&
                    isvalidLineasVenta[index]?.precioIndividual &&
                    isvalidLineasVenta[index]?.producto
                  )
                "
              >
                <Tooltip>
                  <TooltipTrigger
                    class="bg-transparent text-xs text-destructive"
                  >
                    <AlertCircleIcon :size="18" />
                  </TooltipTrigger>
                  <TooltipContent
                    class="text-destructive border-destructive font-thin text-xs"
                  >
                    <p v-if="!isvalidLineasVenta[index]?.producto">
                      - Seleccionar Producto
                    </p>
                    <p v-if="!isvalidLineasVenta[index]?.cantidad">
                      - Ingresar cantidad mayor que 0 (cero)
                    </p>
                    <p v-if="!isvalidLineasVenta[index]?.precioIndividual">
                      - Indicar precio Individual
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <SelectProductoDialog
                v-model="searchProductoOpen"
                title="Seleccionar Producto"
                @select-producto="handleSelectProducto"
              />
            </div>

            <Button
              variant="outline"
              type="button"
              class="mt-4"
              :disabled="isLastLineaEmpty"
              @click="
                async () => {
                  await addLineaVenta();
                  searchProductoOpen = true;
                }
              "
              >Agregar <PlusIcon
            /></Button>

            <div
              class="w-full min-h-[9rem] flex flex-row justify-between items-start mt-10"
            >
              <div class="w-[70%] flex flex-col justify-start items-start">
                <div class="border rounded-lg w-full min-h-[3rem] p-4">
                  <div
                    class="w-full flex flex-row justify-between items-center"
                  >
                    <h3 class="page-subtitle">Obras Sociales</h3>
                    <div v-if="!selectedCliente">
                      <p class="text-xs">
                        Para agregar una obra social, seleccione un cliente
                      </p>
                    </div>
                    <div v-else-if="selectedCliente?.id == 0">
                      <p class="text-xs">
                        No es posible asociar obras sociales al cliente
                        Consumidor Final
                      </p>
                    </div>
                    <Switch
                      v-else
                      :model-value="obrasSociales"
                      @update:model-value="
                        () => {
                          obrasSociales = !obrasSociales;
                          if (
                            obrasSociales &&
                            selectedCliente?.clienteObrasSociales.length &&
                            !ventaObrasSociales.length
                          ) {
                            addVentaObraSocial();
                          }
                        }
                      "
                    ></Switch>
                  </div>
                  <div v-if="obrasSociales" class="flex flex-row items-center">
                    <div v-if="selectedCliente">
                      <div
                        v-if="
                          selectedCliente?.clienteObrasSociales.length > 0 ||
                          ventaObrasSociales.length
                        "
                      >
                        <div
                          v-for="(os, index) in ventaObrasSociales"
                          class="w-full flex flex-row justify-between mt-4 items-center"
                        >
                          <div class="flex flex-row w-[15rem]">
                            <Select
                              :model-value="os.obraSocial.id?.toString()"
                              :open="
                                openSelectOS && openSelectOSIndex === index
                              "
                              @update:open="
                                (isOpen) => {
                                  openSelectOS = isOpen;
                                  openSelectOSIndex = index;
                                }
                              "
                              @update:modelValue="(value:string) => {
                                                                    if (ventaObrasSociales[index]) {
                                                                        ventaObrasSociales[index].obraSocial.id = Number(value);
                                                                    }}"
                            >
                              <SelectTrigger
                                class="text-black w-[12rem] text-xs"
                              >
                                <SelectValue placeholder="Obra Social" />
                              </SelectTrigger>
                              <SelectContent
                                class="max-h-[20rem] w-[15rem] pr-1"
                              >
                                <SelectGroup
                                  class="max-h-[20rem] w-[16rem] m-0 p-0 overflow-scroll"
                                >
                                  <SelectItem
                                    class="w-[14rem] text-sm"
                                    v-for="os in selectedCliente?.clienteObrasSociales"
                                    :key="os.obraSocial.id"
                                    :value="os.obraSocial.id.toString()"
                                  >
                                    {{ os.obraSocial.nombre }}
                                  </SelectItem>
                                  <Button
                                    @click="
                                      () => {
                                        handleShowNewObraSocialCliente(index);
                                      }
                                    "
                                    variant="ghost"
                                    class="w-full h-max p-2 bg-secondary rounded-none flex-row items-center justify-start text-sm"
                                    ><PlusCircleIcon />
                                    <span class="w-[9rem] text-wrap text-left">
                                      Asociar nueva obra social al cliente</span
                                    ></Button
                                  >
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                            <TooltipProvider
                              v-if="!isvalidVentaObraSocial[index]?.obraSocial"
                            >
                              <Tooltip>
                                <TooltipTrigger
                                  class="bg-transparent text-xs text-destructive ml-2"
                                >
                                  <AsteriskIcon :size="14" />
                                </TooltipTrigger>
                                <TooltipContent
                                  class="text-destructive border-destructive font-thin text-xs"
                                >
                                  <p>Seleccionar obra social</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                          <div class="flex flex-row w-[11rem] items-center">
                            <Label>$</Label>
                            <Input
                              :model-value="os.importe"
                              @update:model-value="
                                (value) => {
                                  if (ventaObrasSociales[index]) {
                                    ventaObrasSociales[index].importe =
                                      Number(value);
                                  }
                                }
                              "
                              v-decimal
                              class="w-[7rem] ml-2 text-xs"
                              placeholder="Importe"
                              type="decimal"
                            />
                            <TooltipProvider
                              v-if="!isvalidVentaObraSocial[index]?.importe"
                            >
                              <Tooltip>
                                <TooltipTrigger
                                  class="bg-transparent text-xs text-destructive ml-2"
                                >
                                  <AsteriskIcon :size="14" />
                                </TooltipTrigger>
                                <TooltipContent
                                  class="text-destructive border-destructive font-thin text-xs"
                                >
                                  <p>Ingresar Importe</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                          <div class="flex flex-row w-[15rem]">
                            <Select
                              :modelValue="
                                os.condicionIva?.toString() ?? undefined
                              "
                              @update:model-value="
                                (value) => (os.condicionIva = Number(value))
                              "
                            >
                              <SelectTrigger
                                class="text-black w-[13rem] text-xs"
                              >
                                <SelectValue placeholder="Condicion IVA" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  <SelectItem
                                    class="text-xs"
                                    v-for="condicion in Object.values(CondicionIva).filter(val => typeof val === 'number') as CondicionIva[]"
                                    :key="condicion"
                                    :value="condicion.toString()"
                                  >
                                    {{ condicionIvaDisplay(condicion) }}
                                  </SelectItem>
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                            <TooltipProvider
                              v-if="
                                !isvalidVentaObraSocial[index]?.condicionIva
                              "
                            >
                              <Tooltip>
                                <TooltipTrigger
                                  class="bg-transparent text-xs text-destructive ml-2"
                                >
                                  <AsteriskIcon :size="14" />
                                </TooltipTrigger>
                                <TooltipContent
                                  class="text-destructive border-destructive font-thin text-xs"
                                >
                                  <p>Seleccionar condición IVA</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                          <Button
                            variant="ghost"
                            type="button"
                            @click="removeVentaObraSocial(index)"
                            ><Cross2Icon
                          /></Button>
                        </div>
                        <p
                          v-if="!isValidImporteObrasSociales"
                          class="text-destructive text-md py-6 flex flex-row"
                        >
                          <AlertCircleIcon class="mr-2" /> El importe por obras
                          sociales no puede ser superior al importe total
                        </p>
                        <Button
                          :disabled="
                            !ventaObrasSociales[ventaObrasSociales.length - 1]
                              ?.obraSocial.id
                          "
                          variant="outline"
                          type="button"
                          class="mt-8"
                          @click="addVentaObraSocial()"
                          >Agregar Obra Social <PlusIcon
                        /></Button>
                      </div>
                      <div v-else>
                        <p class="py-4">
                          No hay obras sociales registradas para el cliente
                        </p>
                        <Button
                          @click="
                            () => {
                              handleShowNewObraSocialCliente(0);
                            }
                          "
                          >Registrar Obra Social</Button
                        >
                      </div>
                      <Dialog v-model:open="openNewClienteOS">
                        <DialogContent class="max-w-[33rem]">
                          <AddObraSocialClienteForm
                            :cliente="selectedCliente"
                            @handle-add-obra-social-cliente="
                              handleAddObraSocialCliente
                            "
                          />
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </div>
                <div class="border min-h-[3rem] p-4 w-full rounded-lg mt-4">
                  <div
                    class="w-full flex flex-row justify-between items-center"
                  >
                    <h3 class="page-subtitle">Descuento</h3>
                    <Switch
                      :model-value="dto"
                      @update:model-value="
                        () => {
                          dto = !dto;
                        }
                      "
                    ></Switch>
                  </div>
                  <div v-if="dto" class="flex flex-row items-center mt-2">
                    <Label class="w-[5.5rem]">Porcentaje: </Label>
                    <Input
                      class="w-14 mr-2 h-6 text-center"
                      :model-value="porcDto"
                      @update:model-value="
                        (value) => {
                          porcDto = Number(value) || 0;
                        }
                      "
                    />
                    <Label>%</Label>

                    <TooltipProvider v-if="!isValidVenta.descuentoPorcentaje">
                      <Tooltip>
                        <TooltipTrigger
                          class="bg-transparent text-xs text-destructive ml-4"
                        >
                          <AsteriskIcon :size="14" />
                        </TooltipTrigger>
                        <TooltipContent
                          class="text-destructive border-destructive font-thin text-xs"
                        >
                          <p>Porcentaje Inválido</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
                <div class="border min-h-[3rem] p-4 w-full rounded-lg mt-4">
                  <div
                    class="w-full flex flex-row justify-between items-center"
                  >
                    <h3 class="page-subtitle">Observaciones</h3>
                  </div>
                  <Textarea v-model="observaciones" class="resize-none" />
                </div>
              </div>
              <div
                class="w-[27%] h-[9rem] rounded-lg bg-secondary px-4 flex flex-col items-center justify-center"
              >
                <div
                  v-if="
                    (obrasSociales && montoObrasSociales > 0) ||
                    (porcDto && dto)
                  "
                  class="flex justify-center my-2"
                >
                  <Label class="w-[9rem] text-right mr-4"
                    >Importe Total:
                  </Label>
                  <Label class="w-[9rem]"
                    >$ {{ totalVentaBruto.toFixed(2) }}</Label
                  >
                </div>
                <div
                  v-if="obrasSociales && montoObrasSociales > 0"
                  class="flex justify-center items-center my-2"
                >
                  <Label class="w-[9rem] text-right mr-4"
                    >Obras Sociales:
                  </Label>
                  <Label class="w-[9rem]"
                    >- $ {{ montoObrasSociales.toFixed(2) }}</Label
                  >
                </div>
                <div
                  v-if="porcDto && dto"
                  class="flex justify-center items-center my-2"
                >
                  <Label class="w-[9rem] text-right mr-4">Descuento: </Label>
                  <Label class="w-[9rem]">- $ {{ montoDto.toFixed(2) }}</Label>
                </div>
                <div class="flex justify-center my-2">
                  <Label class="page-subtitle w-[9rem] text-right mr-4"
                    >Importe Final:
                  </Label>
                  <Label class="page-subtitle w-[9rem]"
                    >$ {{ caluclateImportePago.toFixed(2) }}</Label
                  >
                </div>
              </div>
            </div>
          </div>
          <div v-if="!showMedioPago" class="w-full flex justify-end mt-4">
            <Button
              type="button"
              v-if="
                lineasDeVenta.length && lineasDeVenta[0]?.producto.descripcion
              "
              @click="
                () => {
                  middleValidate();
                }
              "
              >Continuar <ArrowRightIcon
            /></Button>
          </div>

          <div
            v-if="showMedioPago && selectedCliente"
            class="flex flex-col w-full justify-start items-start border rounded-lg p-8 mt-10"
          >
            <h3 class="page-subtitle mb-4">Medios de Pago</h3>
            <div
              v-for="(medio, index) in mediosDePago"
              class="medio-pago-item items-center flex flex-row w-full justify-start mb-4"
            >
              <Select
                :modelValue="medio.tipoMedioDePago"
                @update:modelValue="(value) => {
                                    if (mediosDePago[index]) {
                                        mediosDePago[index].tipoMedioDePago = value as TipoMedioDePagoEnum;
                                        mediosDePago[index].entidadBancaria=undefined;
                                        mediosDePago[index].redDePago=undefined;
                                    }
                                }"
              >
                <SelectTrigger
                  :class="{
                    'w-[15rem]': !isValidMediosPago[index]?.tipoMedioDePago,
                    'w-[15rem] mr-[2rem]':
                      isValidMediosPago[index]?.tipoMedioDePago,
                  }"
                >
                  <SelectValue placeholder="Medio De Pago" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem
                      v-for="tipo in availableMedioDePago"
                      :key="tipo[0]"
                      :value="tipo[0]"
                    >
                      {{ tipo[1] }}
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>

              <TooltipProvider
                v-if="!isValidMediosPago[index]?.tipoMedioDePago"
              >
                <Tooltip>
                  <TooltipTrigger
                    class="bg-transparent text-xs text-destructive ml-4"
                  >
                    <AsteriskIcon :size="14" />
                  </TooltipTrigger>
                  <TooltipContent
                    class="text-destructive border-destructive font-thin text-xs"
                  >
                    <p>Seleccionar Tipo Medio Pago</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <div class="w-[16rem] flex flex-row justify-start items-center">
                <Label class="ml-6 mr-2">$</Label>
                <Input
                  type="decimal"
                  :model-value="medio.importe"
                  @update:model-value="
                    (value) => {
                      if (mediosDePago[index]) {
                        mediosDePago[index].importe = Number(value);
                      }
                    }
                  "
                  v-decimal
                  :class="{
                    'w-[8rem] cursor-default  focus:outline-none focus:border-none ':
                      !isValidMediosPago[index]?.importe,
                    'w-[8rem] cursor-default  focus:outline-none focus:border-none  mr-7':
                      isValidMediosPago[index]?.importe,
                  }"
                  placeholder="Importe"
                />
                <TooltipProvider v-if="!isValidMediosPago[index]?.importe">
                  <Tooltip>
                    <TooltipTrigger
                      class="bg-transparent text-xs text-destructive ml-4"
                    >
                      <AsteriskIcon :size="14" />
                    </TooltipTrigger>
                    <TooltipContent
                      class="text-destructive border-destructive font-thin text-xs"
                    >
                      <p>Ingresar Importe</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <Button
                  size="sm"
                  variant="ghost"
                  type="button"
                  v-if="index && mediosDePago.length > 1"
                  @click="autocompleteMedioPagoImporte(index)"
                >
                  <MagicWandIcon />
                </Button>
              </div>

              <div
                class="flex flex-row w-[16rem]"
                v-if="
                  medio.tipoMedioDePago &&
                  !['EFECTIVO', 'CUENTA_CORRIENTE'].includes(
                    medio.tipoMedioDePago
                  )
                "
              >
                <Select
                  :modelValue="medio.redDePago"
                  @update:modelValue="(value) => {
                                    if (mediosDePago[index]) {
                                        mediosDePago[index].redDePago = value as RedDePago;
                                    }
                                }"
                >
                  <SelectTrigger
                    :class="{
                      'w-[12rem]': !isValidMediosPago[index]?.redDePago,
                      'w-[12rem] mr-[2rem]':
                        isValidMediosPago[index]?.redDePago,
                    }"
                  >
                    <SelectValue placeholder="Red De Pago" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem
                        v-for="red in Object.entries(RedDePago)"
                        :key="red[0]"
                        :value="red[0]"
                      >
                        {{ red[1] }}
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <TooltipProvider v-if="!isValidMediosPago[index]?.redDePago">
                  <Tooltip>
                    <TooltipTrigger
                      class="bg-transparent text-xs text-destructive ml-4"
                    >
                      <AsteriskIcon :size="14" />
                    </TooltipTrigger>
                    <TooltipContent
                      class="text-destructive border-destructive font-thin text-xs"
                    >
                      <p>Seleccionar Red de Pago</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div
                class="flex flex-row w-[16rem]"
                v-if="
                  medio.tipoMedioDePago &&
                  !['EFECTIVO', 'CUENTA_CORRIENTE'].includes(
                    medio.tipoMedioDePago
                  )
                "
              >
                <Input
                  :model-value="medio.entidadBancaria"
                  @update:modelValue="(value) => {
                                    if (mediosDePago[index]) {
                                        mediosDePago[index].entidadBancaria = value as RedDePago;
                                    }
                                }"
                  class="w-[12rem] cursor-default focus:outline-none focus:border-none"
                  placeholder="Entidad Bancaria"
                />
                <TooltipProvider
                  v-if="!isValidMediosPago[index]?.entidadBancaria"
                >
                  <Tooltip>
                    <TooltipTrigger
                      class="bg-transparent text-xs text-destructive ml-4"
                    >
                      <AsteriskIcon :size="14" />
                    </TooltipTrigger>
                    <TooltipContent
                      class="text-destructive border-destructive font-thin text-xs"
                    >
                      <p>Indicar entidad bancaria</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Button
                size="icon"
                type="button"
                variant="ghost"
                @click="removeMedioPago(index)"
              >
                <Cross2Icon />
              </Button>
            </div>
            <Button
              variant="outline"
              type="button"
              class="mt-4"
              @click="addMedioPago()"
              >Agregar Medio de Pago <PlusIcon
            /></Button>
            <p
              v-if="
                !isValidImporteMedios &&
                caluclateImportePago > importeIngresado &&
                !mediosDePago.length
              "
              class="text-destructive py-6 flex flex-row"
            >
              <AlertCircleIcon class="mr-2" /> Seleccionar al menos un medio de
              pago
            </p>
            <p
              v-if="
                !isValidImporteMedios &&
                caluclateImportePago > importeIngresado &&
                mediosDePago.length
              "
              class="text-destructive py-6 flex flex-row"
            >
              <AlertCircleIcon class="mr-2" /> Los medios de pago no cubren el
              importe final
            </p>
            <p
              v-if="
                !isValidImporteMedios && caluclateImportePago < importeIngresado
              "
              class="text-destructive py-6 flex flex-row"
            >
              <AlertCircleIcon class="mr-2" /> Los medios de pago ingresados
              superan el importe final
            </p>
          </div>

          <div v-if="showMedioPago" class="w-full flex justify-end mt-4">
            <Button type="submit">Confirmar Venta <ArrowRightIcon /></Button>
          </div>
        </div>
      </form>
    </div>
    <Dialog v-model:open="openDialogOpenCaja">
      <DialogContent class="max-w-[530px] min-h-[15rem] pl-[50px] py-[50px]">
        <DialogHeader>
          <DialogTitle>Abrir Caja del Día</DialogTitle>
          <DialogDescription>
            Ingrese el importe en EFECTIVO con el que abre la caja de hoy
          </DialogDescription>
        </DialogHeader>
        <form @submit.prevent="abrirCajaDiaria()" v-if="!loadingForm">
          <div class="flex flex-row">
            <div class="flex flex-row items-center justify-start mb-4">
              <Label class="text-left w-[150px]">Importe Efectivo</Label>
              <div class="w-[270px] flex flex-row items-center justify-start">
                <Label class="w-[30px] text-center">$</Label>
                <Input v-decimal type="number" v-model="importeOpenCaja" />
              </div>
              <div class="w-[20px]">
                <TooltipProvider v-if="!isValidImporteOpenCaja">
                  <Tooltip>
                    <TooltipTrigger
                      class="bg-transparent text-xs text-destructive ml-4"
                    >
                      <AsteriskIcon :size="14" />
                    </TooltipTrigger>
                    <TooltipContent
                      class="text-destructive border-destructive font-thin text-xs"
                    >
                      <p>Ingresar Importe</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" class="mr-[30px]"> Abrir Caja </Button>
          </DialogFooter>
        </form>
        <div v-else>
          <LoaderForm />
        </div>
      </DialogContent>
    </Dialog>
    <Dialog v-model:open="openDialogClosedCaja" @update:open="router.push('/')">
      <DialogContent
        class="max-w-[530px] min-h-[15rem] flex justify-center items-center flex-col text-center"
      >
        <DialogHeader>
          <DialogTitle class="text-destructive">Caja cerrada</DialogTitle>
        </DialogHeader>
        <DialogDescription class="text-destructive mb-4">
          No se puede registrar una nueva venta porque la caja del día ya fue
          cerrada.
        </DialogDescription>
        <Button
          @click="
            router.push('/');
            openDialogClosedCaja = false;
          "
          type="button"
          >Volver al inicio</Button
        >
      </DialogContent>
    </Dialog>
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
    <AlertError
      v-model="showErrorNotCaja"
      title="Error"
      message="No se puede crear una venta ya que no se hizo la apertura del día"
      button="Abrir caja"
      :action="
        () => {
          showErrorNotCaja = false;
          openDialogOpenCaja = true;
        }
      "
    />
  </div>
</template>

<style scoped>
.page div div {
  max-width: 80rem;
}

.linea-venta-header {
  display: grid;
  grid-template-columns: 0.6fr 2.8fr 1fr 0.5fr 1fr 0.1fr 0.1fr;
  gap: 0.5rem;
  font-weight: bold;
  text-align: center;
  padding: 0.75rem;
  width: 100%;
}

.linea-venta-header:first-child {
  border-radius: 1rem 0 5rem 0 1rem;
}

.linea-venta-item {
  display: grid;
  grid-template-columns: 0.7fr 3fr 1fr 0.5fr 1fr 0.1fr 0.1fr;
  gap: 0.5rem;
  align-items: center;
  padding: 0.5rem 0;
  width: 100%;
}

.id-input {
  width: 100%;
  min-width: 4rem;
  text-align: center;
}

.descripcion-input {
  width: 100%;
  min-width: 12rem;
  max-width: 100%;
  text-align: start;
}

@media (max-width: 768px) {
  .linea-venta-header {
    grid-template-columns: 1fr 2fr;
  }

  .linea-venta-item {
    grid-template-columns: 1fr 2fr;
  }

  .id-input {
    min-width: 3rem;
    max-width: 4rem;
  }

  .descripcion-input {
    min-width: 10rem;
  }
}
</style>
