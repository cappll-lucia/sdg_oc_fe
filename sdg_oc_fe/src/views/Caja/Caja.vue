<script setup lang="ts">
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import Button from '@/components/ui/button/Button.vue';
import Label from '@/components/ui/label/Label.vue';
import ScrollArea from '@/components/ui/scroll-area/ScrollArea.vue';
import { SlashIcon } from '@radix-icons/vue';
import { computed, onMounted, ref } from 'vue';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
    CalendarDate,
  DateFormatter,
  type DateValue,
  getLocalTimeZone,
} from '@internationalized/date';
import { AsteriskIcon, CalendarIcon } from 'lucide-vue-next'
import { cn } from '@/lib/utils';
import Input from '@/components/ui/input/Input.vue';
import { Caja, SaldoCaja } from '@/api/entities/caja';
import { cajaApi } from '@/api/libs/caja';
import { formatDate, formatTime } from '@/lib/utils.recetas';
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { useLoaderStore } from '@/stores/LoaderStore';
import AlertError from '@/components/AlertError.vue';
import LoaderForm from '@/components/LoaderForm.vue';
import { TipoMedioDePagoEnum } from '@/api/entities/mediosDePago';
import type { MovimientoConDetalle, MovimientoSimple } from '@/api/entities/caja';


const df = new DateFormatter('es-AR', {
  dateStyle: 'long',
})

const loader = useLoaderStore();
const loadingForm = ref<boolean>(false);
const loading= ref<boolean>(false);
const loadingMovements = ref<boolean>(false);

const saldoActual = ref<number>();
const aperturaToday = ref<Caja>();
const cierreToday = ref<Caja>();
const selectedDate = ref<DateValue>();
const todayDate = ref<DateValue>();
const openDialog = ref<boolean>(false);
const openDialogOpenCaja = ref<boolean>(false);
const openDialogCloseCaja = ref<boolean>(false);

const showError = ref<boolean>(false);
const errorMessage =ref<string>('');
const dateMovements = ref<Array<MovimientoConDetalle | MovimientoSimple>>([]);
const todayMovements = ref<Array<MovimientoConDetalle | MovimientoSimple>>([]);

const newMovimeintoCaja = ref<{detalle: string, importe: number, tipo:string}>({
    detalle: '',
    importe: 0,
    tipo: "INGRESO"
})

const isValidNewMovimeintoCaja = ref<{detalle: boolean, importe: boolean, tipo: boolean}>({
    detalle: true,
    importe: true,
    tipo: true,
})

const importeOpenCaja = ref<number>(0)
const isValidImporteOpenCaja = ref<boolean>(true)

const loadData = async()=>{
    const saldoCaja = await cajaApi.getMovimientos(formatDateValue.value)
    const today = new Date();
    saldoActual.value = saldoCaja.cajaEfectivo;
    dateMovements.value = saldoCaja.cajaDetallada;
    aperturaToday.value = await cajaApi.getApertura(today.toDateString());
    cierreToday.value = await cajaApi.getCierre(today.toDateString());
    todayMovements.value = dateMovements.value;
}

onMounted(async () => {
    loader.show(); 
    loading.value=true;
    const today = new Date();
    todayDate.value=new CalendarDate(today.getFullYear(), today.getMonth()+1, today.getDate());
    selectedDate.value = todayDate.value;
    await loadData();
    todayMovements.value = dateMovements.value;
    loading.value=false;
    loader.hide();
});

const validateAndSubmit = async()=>{
    isValidNewMovimeintoCaja.value.tipo = ["INGRESO", "EGRESO"].includes(newMovimeintoCaja.value.tipo)
    isValidNewMovimeintoCaja.value.importe = newMovimeintoCaja.value.importe > 0;
    isValidNewMovimeintoCaja.value.detalle = Boolean(newMovimeintoCaja.value.detalle)
    if(Object.values(isValidNewMovimeintoCaja.value).every(Boolean)){
        await onSubmit();
    }
}


const onSubmit = async()=>{
    try{
        loadingForm.value=true;
        await cajaApi.afectar({
            detalle: newMovimeintoCaja.value.detalle,
            importe: newMovimeintoCaja.value.tipo=="INGRESO" ? newMovimeintoCaja.value.importe : -newMovimeintoCaja.value.importe
        })
        await loadData();
        openDialog.value=false;
        loadingForm.value=true;
    }catch(e: any){
        errorMessage.value = e.message as string;
        openDialog.value=false;
        loadingForm.value=true;
        showError.value = true;
    }
}

 const formatDateValue = computed(()=> {
    if (!selectedDate.value) return '';
    const year = selectedDate.value.year;
    const month = String(selectedDate.value.month).padStart(2, '0');
    const day = String(selectedDate.value.day).padStart(2, '0');
    return `${year}-${month}-${day}`;
});


const abrirCajaDiaria = async()=>{
    try{
        if(importeOpenCaja.value >= 0){
            loadingForm.value=true;
            await cajaApi.apertura(importeOpenCaja.value)
            await loadData();
            openDialogOpenCaja.value=false;
            loadingForm.value=false;
        }
    }catch(e: any){
        errorMessage.value = e.message as string;
        openDialogOpenCaja.value=false;
        loadingForm.value=false
        showError.value = true;
    }
}

const cerrarCajaDiaria = async()=>{
    try{
        if(todayDate.value){
            loadingForm.value=true;
            cierreToday.value = await cajaApi.cierre();
            await loadData();
            await informeCierre(todayDate.value);
        }
        openDialogCloseCaja.value=false;
        loadingForm.value=false;
    }catch(e: any){
        errorMessage.value = e.message as string;
        openDialogCloseCaja.value=false;
        loadingForm.value=false;
        showError.value = true;
    }
}

const informeCierre = async(date: DateValue | undefined)=>{
    try{
        if(!date) return;
        const year = date.year;
        const month = String(date.month).padStart(2, '0');
        const day = String(date.day).padStart(2, '0');
        const informeDate =  `${year}-${month}-${day}`;
        const saldoCaja = await cajaApi.getMovimientos(informeDate)
        generateCierreCajaPDF(saldoCaja, informeDate)
        
    }catch{

    }
}

const generateCierreCajaPDF = (cierreCaja:SaldoCaja, fecha:string) => {
    const cierreMov = cierreCaja.cajaDetallada.find(m=>m.detalle=="CIERRE")
    const aperturaMov = cierreCaja.cajaDetallada.find(m=>m.detalle=="APERTURA")

    console.log(cierreCaja)
    const doc = new jsPDF();
    const filePath = `cierre_caja_${fecha}.pdf`;

    doc.setFontSize(16);
    doc.text("CIERRE DE CAJA", 105, 20, { align: "center" });

    doc.setFontSize(12);
    doc.text(`Fecha de Cierre: ${ cierreMov ? new Date(cierreMov.fechaMovimiento).toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' }) : fecha}`, 105, 30, {align: "center"});
    if(aperturaMov && typeof aperturaMov === 'object' && 'importe' in aperturaMov){
        doc.text(`Apertura de Caja: $ ${ aperturaMov.importe} (Efectivo)`, 20, 40, {align: "left"});
    }

    const pagos = [
        { label: "Efectivo", value: cierreCaja.cajaEfectivo },
        { label: "Transferencia", value: cierreCaja.cajaTransferencia },
        { label: "Cheque", value: cierreCaja.cajaCheque },
        { label: "Cuenta Corriente", value: cierreCaja.cajaCuentaCorriente },
        { label: "Otro", value: cierreCaja.cajaOtro },
        { label: "Visa", value: cierreCaja.cajaVisa },
        { label: "Mastercard", value: cierreCaja.cajaMastercard },
        { label: "American Express", value: cierreCaja.cajaAmericanExpress },
        { label: "Naranja", value: cierreCaja.cajaNaranja },
        { label: "PagoFácil", value: cierreCaja.cajaPagofacil },
    ];

    console.log(pagos)
    const rows = pagos.map(p => [p.label, `$${p.value.toFixed(2)}`]);

    autoTable(doc, {
        head: [["Medio de Pago", "Importe"]],
        body: rows,
        startY: 50,
        styles: { halign: 'left' },
        headStyles: { fillColor: [0, 0 ,0] }, 
    });

    const finalY = (doc as any).lastAutoTable.finalY || 60;
    doc.setFontSize(14);
    doc.text(`TOTAL: $${cierreCaja.total.toFixed(2)}`, 20, finalY + 10);
    doc.save(filePath);
};

const handleDateRangeChange = async(newDate: DateValue | undefined) => {
    if (!newDate) return;
    loadingMovements.value=true;
    selectedDate.value = newDate;
    const saldoCaja = await cajaApi.getMovimientos(formatDateValue.value);
    dateMovements.value = saldoCaja.cajaDetallada;
    loadingMovements.value=false;
}



const resetNewMovimiento = ()=>{
    newMovimeintoCaja.value.detalle= '',
    newMovimeintoCaja.value.importe= 0,
    newMovimeintoCaja.value.tipo= "INGRESO"
}

const isTodaySelected = computed(() => {
  return selectedDate.value &&
         todayDate.value &&
         selectedDate.value.year === todayDate.value.year &&
         selectedDate.value.month === todayDate.value.month &&
         selectedDate.value.day === todayDate.value.day;
});


const getImporteVenta = (movDetalle: { 
    importe: number;
    formaPago: string;
    redDePago: string | null;
  }[])=> {
    const total = movDetalle.reduce((total, {importe})=>(
        total + importe    
    ),0)
    return total
}

const totalIngresosToday = computed(() =>
  todayMovements.value.reduce((total, mov) => {
    if ('id' in mov) {
      return total + mov.detalle.reduce((sub, d) => sub + (d.importe > 0 ? d.importe : 0), 0);
    } else {
      return total + (mov.importe > 0 ? mov.importe : 0);
    }
  }, 0)
);
const totalEgresosToday = computed(() =>
  todayMovements.value.reduce((total, mov) => {
    if ('id' in mov) {
      return total + mov.detalle.reduce((sub, d) => sub + (d.importe < 0 ? Math.abs(d.importe) : 0), 0);
    } else {
      return total + (mov.importe < 0 ? Math.abs(mov.importe) : 0);
    }
  }, 0)
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
                    <BreadcrumbPage>Caja</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
        <div class="pt-2" v-if="!loading">
            <div class="flex flex-row justify-between items-center">
                <h1 class="page-title ">Movimientos de Caja </h1>
                <Dialog v-if="aperturaToday && !cierreToday" v-model:open="openDialog" @update:open="resetNewMovimiento()" >
                            <DialogTrigger as-child>
                            <Button>
                               Registrar Nuevo Movimiento
                            </Button>
                            </DialogTrigger>
                            <DialogContent class="max-w-[35rem] min-h-[25rem] ">
                            <DialogHeader>
                                <DialogTitle>Registrar Movimiento de Caja</DialogTitle>
                                <DialogDescription>
                                    Este movimiento corresponde a retiros o ingresos de EFECTIVO a la caja
                                </DialogDescription>
                            </DialogHeader>
                            <form @submit.prevent="validateAndSubmit" v-if="!loadingForm" >
                            <div class="grid gap-4 py-4">
                                 <div class="grid grid-cols-3 items-center mb-4 gap-4">
                                    <Label class="text-right col-span-1">Tipo Movimiento</Label>
                                    <div class=" ml-4 mr-12 col-span-2 flex flex-row items-center justify-between">
                                        <Select 
                                            :modelValue="newMovimeintoCaja.tipo" 
                                            @update:modelValue="(value:string) => {
                                                newMovimeintoCaja.tipo = value ;
                                            }"
                                        >
                                            <SelectTrigger >
                                            <SelectValue placeholder="Tipo Movimiento"  />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectItem key="INGRESO" value="INGRESO">INGRESO</SelectItem>
                                                    <SelectItem key="EGRESO" value="EGRESO">EGRESO</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                        <TooltipProvider  v-if="!isValidNewMovimeintoCaja" >
                                            <Tooltip>
                                                <TooltipTrigger class="bg-transparent text-xs text-destructive ml-4"> <AsteriskIcon :size="14" /> </TooltipTrigger>
                                                <TooltipContent class="text-destructive border-destructive font-thin text-xs">
                                                    <p>Seleccionar tipo movimiento</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                </div>

                                <div class="grid grid-cols-3 items-center mb-4 gap-4">
                                    <Label class="text-right col-span-1">Importe</Label>
                                    <div class=" ml-4 mr-12  col-span-2 flex flex-row items-center justify-between">
                                        <Label class="w-[7%] text-left">$</Label>
                                        <Input v-decimal type="number" class="w-[93%]" v-model="newMovimeintoCaja.importe"   />
                                        <TooltipProvider  v-if="!isValidNewMovimeintoCaja.importe" >
                                            <Tooltip>
                                                <TooltipTrigger class="bg-transparent text-xs text-destructive ml-4"> <AsteriskIcon :size="14" /> </TooltipTrigger>
                                                <TooltipContent class="text-destructive border-destructive font-thin text-xs">
                                                    <p>Ingresar Importe</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                </div>
                                
                                <div class="grid grid-cols-3 items-center mb-4 gap-4">
                                    <Label class="text-right col-span-1">Detalle</Label>
                                    <div class=" ml-4 mr-12  col-span-2 flex flex-row items-center justify-between">
                                        <Input type="text" class="w-[100%]" v-model="newMovimeintoCaja.detalle"   />
                                        <TooltipProvider  v-if="!isValidNewMovimeintoCaja.detalle" >
                                            <Tooltip>
                                                <TooltipTrigger class="bg-transparent text-xs text-destructive ml-4"> <AsteriskIcon :size="14" /> </TooltipTrigger>
                                                <TooltipContent class="text-destructive border-destructive font-thin text-xs">
                                                    <p>Ingresar Detalle</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit">
                                Guardar
                                </Button>
                            </DialogFooter>
                            </form>
                            <div v-else >
                                <LoaderForm />
                            </div>
                            </DialogContent>
                </Dialog>
            </div>
            <div  class="w-full mt-10 flex flex-row justify-between h-[21rem]">
                <div class="w-[38%] bg-secondary rounded-lg p-4 flex border flex-col justify-center items-center">
                    <div class="flex flex-row w-[90%] justify-between">
                        <div class="flex flex-row justify-start items-center">
                            <h2 class="page-subtitle">Caja Diaria</h2>
                                <span class="ml-4 font-normal font-xs">( {{ todayDate ? formatDate(todayDate.toDate(getLocalTimeZone())) : '' }} )</span>
                            </div>
                        <div class="flex flex-row  justify-end">
                            <Dialog v-if="!aperturaToday" v-model:open="openDialogOpenCaja" >
                                <DialogTrigger as-child>
                                <Button class="mr-4">
                                Abrir Caja
                                </Button>
                                </DialogTrigger>
                                <DialogContent class="max-w-[530px] min-h-[15rem] pl-[50px] py-[50px] ">
                                    <DialogHeader>
                                        <DialogTitle>Abrir Caja del Día</DialogTitle>
                                        <DialogDescription>
                                            Ingrese el importe en EFECTIVO con el que abre la caja de hoy
                                        </DialogDescription>
                                    </DialogHeader>
                                    <form @submit.prevent="abrirCajaDiaria()" v-if="!loadingForm" >
                                    <div class=" flex flex-row ">
                                        <div class="flex flex-row items-center justify-start mb-4 ">
                                            <Label class="text-left w-[150px] ">Importe Efectivo</Label>
                                            <div class=" w-[270px] flex flex-row items-center justify-start">
                                                <Label class="w-[30px]  text-center">$</Label>
                                                <Input v-decimal type="number" v-model="importeOpenCaja"   />
                                            </div>
                                            <div class="w-[20px]">
                                                <TooltipProvider  v-if="!isValidImporteOpenCaja" >
                                                    <Tooltip>
                                                        <TooltipTrigger class="bg-transparent text-xs text-destructive ml-4" > <AsteriskIcon :size="14" /> </TooltipTrigger>
                                                        <TooltipContent class="text-destructive border-destructive font-thin text-xs">
                                                            <p>Ingresar Importe</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            </div>
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button type="submit" class="mr-[30px]">
                                        Abrir Caja
                                        </Button>
                                    </DialogFooter>
                                    </form>
                                    <div v-else>
                                        <LoaderForm />
                                    </div>
                                </DialogContent>
                            </Dialog>
                            <Dialog v-if="!cierreToday && aperturaToday" v-model:open="openDialogCloseCaja" >
                                    <DialogTrigger as-child>
                                    <Button>
                                    Cerrar Caja
                                    </Button>
                                    </DialogTrigger>
                                    <DialogContent class="max-w-[30rem] h-[12rem] flex flex-col justify-center text-center ">
                                    <DialogHeader>
                                        <DialogTitle class="text-center">Cerrar caja del Día</DialogTitle>
                                    </DialogHeader>
                                    <form @submit.prevent="cerrarCajaDiaria()" v-if="!loadingForm" >
                                        <Label class="text-right "> Con esta acción registrará el cierre de caja de Hoy</Label>
                                        <DialogFooter class="flex w-full mt-6 flex-row justify-center sm:justify-center xs:justify-center items-center">
                                            <Button type="submit">
                                            Confirmar
                                            </Button>
                                        </DialogFooter>
                                    </form>
                                    <div v-else class="h-[6rem] flex justify-center" >
                                        <LoaderForm />
                                    </div>
                                    </DialogContent>
                            </Dialog>
                            <div v-if="cierreToday">
                                <Button @click="informeCierre(todayDate)" > Imprimir Cierre</Button>
                            </div>
                        </div>
                    </div>
                    <div  class=" mt-4 w-[90%] rounded-lg p-4 items-center flex flex-col border bg-white">
                        <div class="flex flex-row mb-4 justify-between w-full">
                            <Label class="text-md w-[13rem] ">Saldo actual efectivo: </Label>
                            <Label class="text-md ">$ {{ saldoActual }} </Label>
                        </div>
                        <div class="flex flex-row mb-4 justify-between w-full">
                            <Label class="text-md w-[10rem] ">Saldo inicial del día: </Label>
                            <Label class="text-md ">$ {{aperturaToday?.importe || aperturaToday?.importe==0 ? aperturaToday.importe : ' 0 '}} </Label>
                        </div>
                        <div class="flex flex-row mb-4 justify-between w-full">
                            <Label class="text-md w-[10rem] ">Total ingresos: </Label>
                            <Label class="text-md ">$ {{totalIngresosToday}}</Label>
                        </div>
                        <div class="flex flex-row justify-between w-full">
                            <Label class="text-md w-[10rem] ">Total egresos: </Label>
                            <Label class="text-md ">$ {{ Math.abs(totalEgresosToday) }} </Label>
                        </div>
                        <span v-if="cierreToday" class=" mt-4 font-bold  text-lg text-red-800">Caja del día cerrada</span>
                    </div>
                </div>
                <div class="w-[60%] h-[40rem] border rounded-lg p-4 flex flex-col justify-start items-end">
                    <div class="flex flex-row justify-center items-center h-10">

                        <Button variant="outline" v-if="(isTodaySelected && cierreToday) || (!isTodaySelected &&  dateMovements.length && !loadingMovements)" @click="informeCierre(selectedDate)" > Imprimir Cierre</Button>
                        <Popover>
                            <PopoverTrigger as-child>
                                <Button
                                    variant="outline"
                                    :class="cn(
                                        'w-[200px] ml-4 justify-start text-left font-normal',
                                        !selectedDate && 'text-muted-foreground',
                                    )"
                                    >
                                    <CalendarIcon class="mr-2 h-4 w-4" />
                                    {{ selectedDate ? df.format(selectedDate.toDate(getLocalTimeZone())) : "Pick a date" }}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent class="w-auto p-0">
                                <Calendar :locale="'es'" v-model="selectedDate" initial-focus  @update:model-value="handleDateRangeChange" />
                            </PopoverContent>
                        </Popover>
                    </div>
                    <ScrollArea class=" mt-2 p-4 w-full h-full rounded-lg bg-white">
                        <div v-if="loadingMovements" class="mt-[5rem]">
                            <LoaderForm />
                        </div>
                        <div v-else>
                            <div  v-if="dateMovements.length" class="flex flex-row justify-between items-center bg-secondary h-[3rem] rounded-t-lg text-xs px-4 ">
                                <Label class="w-[4rem]" >HORA</Label>
                                <Label class="w-[7rem] text-center" >TIPO MOVIMIENTO</Label>
                                <Label class="w-[7rem]" >DETALLE</Label>
                                <Label class="w-[15rem]" >MEDIO DE PAGO</Label>
                                <Label class="w-[8rem]" >IMPORTE</Label>
                            </div>
                                <div v-for="mov in dateMovements">
                                    <div v-if="typeof mov === 'object' && 'id' in mov" class="flex flex-row justify-between w-ful h-[4rem]  y-1 border-b items-center px-4">
                                        <Label class="w-[4rem] text-sm ">{{ formatTime(mov.fechaMovimiento) }} hs.</Label>
                                        <Label class="w-[7rem] text-sm flex justify-center text-center"> <Label class="bg-secondary px-4 py-2 w-[6.5rem]  rounded-lg">VENTA</Label></Label>
                                        <Label class="w-[7rem] text-sm flex justify-start "></Label>
                                        <Label class="w-[15rem] flex justify-start flex-row gap-1 flex-wrap"><span v-for="mp in mov.detalle" class="text-xs rounded-lg border p-1 h-min">{{ 
                                            TipoMedioDePagoEnum[mp.formaPago as keyof typeof TipoMedioDePagoEnum].toUpperCase() || mp.formaPago.toUpperCase()
                                            }}</span></Label>
                                        <Label class="w-[8rem] text-sm flex justify-start ">$ {{ getImporteVenta(mov.detalle) }}</Label>
                                    </div>
                                    <div v-else class="flex flex-row justify-between w-ful h-[4rem]  py-1 border-b items-center px-4">
                                        <Label class="w-[4rem] text-sm ">{{ formatTime(mov.fechaMovimiento) }} hs.</Label>
                                        <Label v-if="mov.detalle=='APERTURA'|| mov.detalle=='CIERRE'" class="w-[7rem] text-sm flex justify-center text-center"> <Label class="bg-secondary px-4 py-2 w-[6.5rem] rounded-lg">{{mov.detalle}}</Label></Label>
                                        <Label v-else class="w-[7rem] text-sm flex justify-center text-center "> <Label class="bg-secondary px-4 py-2 w-[6.5rem] rounded-lg">{{ mov.importe >=0 ? "INGRESO" : "EGRESO" }}</Label></Label>
                                        <Label v-if="!(mov.detalle=='APERTURA'|| mov.detalle=='CIERRE')" class="w-[8rem]"><p class="text-xs w-min  p-1" >{{mov.detalle.toUpperCase()}}</p></Label>
                                        <Label v-else class="w-[7rem]"></Label>
                                        <div class="w-[15rem] text-sm"> </div>
                                        <Label class="w-[8rem] text-sm"> $ {{ mov.importe.toFixed(2)}}</Label>
                                    </div>
                                </div>

                            <div v-if="!dateMovements.length && isTodaySelected" class="flex justify-center items-center flex-col mt-10">
                                <Lebel v-if="isTodaySelected">No se encontraron movimientos de caja registrados para hoy.</Lebel>
                                <Button  v-if="isTodaySelected" class="w-[10rem] mt-4" @click="openDialogOpenCaja=true"> Abrir caja</Button>
                            </div>
                            <div v-else-if="!dateMovements.length" class="flex justify-center items-center flex-col mt-10">
                                <Lebel>No se encontraron movimientos de caja registrados para el día seleccionado.</Lebel>
                            </div>
                        </div>
                    </ScrollArea>
                </div>
            </div>
            <AlertError
            v-model="showError"
            title="Error"
            :message="errorMessage || ''"
            button="Aceptar"
            :action="()=>{showError=false}"
        />
        </div>
    </div>
</template>