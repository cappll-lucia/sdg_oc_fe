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
} from '@internationalized/date'
import { AsteriskIcon, CalendarIcon } from 'lucide-vue-next'
import { cn } from '@/lib/utils';
import Input from '@/components/ui/input/Input.vue';
import { Caja, SaldoCaja } from '@/api/entities/caja';
import { cajaApi } from '@/api/libs/caja';
import { formatDate } from '@/lib/utils.recetas';
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const df = new DateFormatter('es-AR', {
  dateStyle: 'long',
})

const saldoActual = ref<number>();
const aperturaToday = ref<Caja>();
const cierreToday = ref<Caja>();
const selectedDate = ref<DateValue>();
const todayDate = ref<DateValue>();
const openDialog = ref<boolean>(false);
const openDialogOpenCaja = ref<boolean>(false);
const openDialogCloseCaja = ref<boolean>(false);

const dateMovements = ref<Caja[]>([]);
const todayMovements = ref<Caja[]>([]);

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
    saldoActual.value = saldoCaja.cajaEfectivo;
    dateMovements.value = saldoCaja.cajaFinal;
}

onMounted(async () => {
    const today = new Date();
    todayDate.value=new CalendarDate(today.getFullYear(), today.getMonth()+1, today.getDate());
    selectedDate.value = todayDate.value;
    await loadData();
    cierreToday.value = dateMovements.value.find(m=>m.detalle=="CIERRE");
    aperturaToday.value = dateMovements.value.find(m=>m.detalle=="APERTURA");
    todayMovements.value = dateMovements.value;
});

const validateAndSubmit = async()=>{
    console.log('fghjk')
    isValidNewMovimeintoCaja.value.tipo = ["INGRESO", "EGRESO"].includes(newMovimeintoCaja.value.tipo)
    isValidNewMovimeintoCaja.value.importe = newMovimeintoCaja.value.importe > 0;
    isValidNewMovimeintoCaja.value.detalle = Boolean(newMovimeintoCaja.value.detalle)
    if(Object.values(isValidNewMovimeintoCaja.value).every(Boolean)){
        await onSubmit()
    }
}


const onSubmit = async()=>{
    try{
       await cajaApi.afectar({
            detalle: newMovimeintoCaja.value.detalle,
            importe: newMovimeintoCaja.value.tipo=="INGRESO" ? newMovimeintoCaja.value.importe : -newMovimeintoCaja.value.importe
        })
        await loadData();
        openDialog.value=false;
    }catch(e){
        console.log(e)
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
        if(importeOpenCaja.value > 0){
            await cajaApi.apertura(importeOpenCaja.value)
            await loadData();
            openDialogOpenCaja.value=false;
        }
    }catch(e){
        console.log(e)
    }
}

const cerrarCajaDiaria = async()=>{
    try{
        if(todayDate.value){
            await cajaApi.cierre()
            await informeCierre(todayDate.value);
        }
        openDialogCloseCaja.value=false;
    }catch(e){
        console.log(e)
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
    const cierreMov = cierreCaja.cajaFinal.find(m=>m.detalle=="CIERRE")
    const aperturaMov = cierreCaja.cajaFinal.find(m=>m.detalle=="APERTURA")

    const doc = new jsPDF();
    const filePath = `cierre_caja_${fecha}.pdf`;

    doc.setFontSize(16);
    doc.text("CIERRE DE CAJA", 105, 20, { align: "center" });

    doc.setFontSize(12);
    doc.text(`Fecha de Cierre: ${ cierreMov ? new Date(cierreMov.fechaMovimiento).toLocaleString() : fecha}`, 105, 30, {align: "center"});
    if(aperturaMov){
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
    selectedDate.value = newDate;
    const saldoCaja = await cajaApi.getMovimientos(formatDateValue.value);
    dateMovements.value = saldoCaja.cajaFinal;
}

const totalIngresosToday = computed(() => {
    return todayMovements.value.reduce((total, mov) => {
        if (mov.importe < 0) return total;
        return total + mov.importe;
    }, 0);
});
const totalEgresosToday = computed(() => {
    return todayMovements.value.reduce((total, mov) => {
        if (mov.importe > 0) return total;
        return total + mov.importe;
    }, 0);
});


const resetNewMovimiento = ()=>{
    newMovimeintoCaja.value.detalle= '',
    newMovimeintoCaja.value.importe= 0,
    newMovimeintoCaja.value.tipo= "INGRESO"
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
                    <BreadcrumbPage>Caja</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
        <div class="pt-2">
            <div class="flex flex-row justify-between items-center">
                <h1 class="page-title ">Movimientos de Caja </h1>
                <Dialog v-model:open="openDialog" @update:open="resetNewMovimiento()" >
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
                            <form @submit.prevent="validateAndSubmit" >
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
                                        <Input decimal type="number" class="w-[93%]" v-model="newMovimeintoCaja.importe"   />
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
                            </DialogContent>
                </Dialog>
            </div>
            <div class="w-full mt-10 flex flex-row justify-between h-[20rem]">
                <div class="w-[40%] bg-secondary rounded-lg p-4 flex border flex-col justify-center items-center">
                    <div class="flex flex-row w-[90%] justify-between">
                        <h2 class="page-subtitle">Caja Diaria</h2>
                        <div class="flex flex-row  justify-end">
                            <Dialog v-if="!aperturaToday" v-model:open="openDialogOpenCaja" >
                                <DialogTrigger as-child>
                                <Button class="mr-4">
                                Abrir Caja
                                </Button>
                                </DialogTrigger>
                                <DialogContent class="max-w-[35rem] min-h-[15rem] ">
                                    <DialogHeader>
                                        <DialogTitle>Abrir Caja del Día</DialogTitle>
                                        <DialogDescription>
                                            Ingrese el importe en EFECTIVO con el que abre la caja de hoy
                                        </DialogDescription>
                                    </DialogHeader>
                                    <form @submit.prevent="abrirCajaDiaria()" >
                                    <div class="grid gap-4 py-4">
                                        <div class="grid grid-cols-3 items-center mb-4 gap-4">
                                            <Label class="text-right col-span-1">Importe Efectivo</Label>
                                            <div class=" ml-4 mr-12  col-span-2 flex flex-row items-center justify-between">
                                                <Label class="w-[7%] text-left">$</Label>
                                                <Input decimal type="number" class="w-[93%]" v-model="importeOpenCaja"   />
                                                <TooltipProvider  v-if="!isValidImporteOpenCaja" >
                                                    <Tooltip>
                                                        <TooltipTrigger class="bg-transparent text-xs text-destructive ml-4"> <AsteriskIcon :size="14" /> </TooltipTrigger>
                                                        <TooltipContent class="text-destructive border-destructive font-thin text-xs">
                                                            <p>Ingresar Importe</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            </div>
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button type="submit">
                                        Abrir Caja
                                        </Button>
                                    </DialogFooter>
                                    </form>
                                </DialogContent>
                            </Dialog>
                            <Dialog v-if="!cierreToday" v-model:open="openDialogCloseCaja" >
                                    <DialogTrigger as-child>
                                    <Button>
                                    Cerrar Caja
                                    </Button>
                                    </DialogTrigger>
                                    <DialogContent class="max-w-[30rem] min-h-[10rem] flex flex-col justify-center text-center ">
                                    <DialogHeader>
                                        <DialogTitle class="text-center">Cerrar caja del Día</DialogTitle>
                                    </DialogHeader>
                                    <form @submit.prevent="cerrarCajaDiaria()" >
                                        <Label class="text-right "> Con esta acción registrará el cierre de caja de Hoy</Label>
                                        <DialogFooter class="flex w-full mt-6 flex-row justify-center sm:justify-center xs:justify-center items-center">
                                            <Button type="submit">
                                            Confirmar
                                            </Button>
                                        </DialogFooter>
                                    </form>
                                    </DialogContent>
                            </Dialog>
                            <div v-else>
                                <span class=" font-bold mr-4 text-red-800">Caja del día cerrada</span>
                                <Button @click="informeCierre(todayDate)" > Imprimir Cierre</Button>
                            </div>
                        </div>
                    </div>
                    
                    <div  class=" mt-4 w-[90%] rounded-lg p-4 items-center flex flex-col border bg-white">
                        <div class="flex flex-row mb-4 justify-between w-full">
                            <Label class="text-md w-[13rem] ">Saldo Actual Efectivo: </Label>
                            <Label class="text-md ">$ {{ saldoActual }} </Label>
                        </div>
                        <div class="flex flex-row mb-4 justify-between w-full">
                            <Label class="text-md w-[10rem] ">Saldo Inicial del Día: </Label>
                            <Label class="text-md ">$ {{aperturaToday?.importe}} </Label>
                        </div>
                        <div class="flex flex-row mb-4 justify-between w-full">
                            <Label class="text-md w-[10rem] ">Total Ingresos: </Label>
                            <Label class="text-md ">$ {{totalIngresosToday}}</Label>
                        </div>
                        <div class="flex flex-row mb-4 justify-between w-full">
                            <Label class="text-md w-[10rem] ">Total Egresos: </Label>
                            <Label class="text-md ">$ {{ Math.abs(totalEgresosToday) }} </Label>
                        </div>
                    </div>
                </div>
                <div class="w-[57%] h-[40rem] border rounded-lg p-4 flex flex-col justify-start items-end">
                    <div class="flex flex-row justify-center items-center h-10">
                        <Button variant="outline" v-if="selectedDate!=todayDate" @click="informeCierre(selectedDate)" > Imprimir Cierre</Button>
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
                                <Calendar v-model="selectedDate" initial-focus  @update:model-value="handleDateRangeChange" />
                            </PopoverContent>
                        </Popover>
                    </div>
                    <ScrollArea class=" mt-2 p-4 w-full h-full rounded-lg bg-white">
                        <div v-for="mov in dateMovements" class="flex flex-row justify-between w-ful h-[4rem]  mb-2 border-b items-center px-4 ">
                            <Label class="w-[8rem] text-sm ">{{ formatDate(mov.fechaMovimiento) }}</Label>
                            <Label class="w-[13rem] text-sm flex justify-start "> <Label class="bg-secondary px-4 py-2 rounded-lg">{{ mov.importe >=0 ? "INGRESO" : "EGRESO" }}</Label></Label>
                            <Label class="w-[13rem] text-sm flex justify-start ">{{mov.detalle}}</Label>
                            <Label class="w-[18rem] text-xs flex justify-start "></Label>
                            <Label class="w-[8rem] text-sm"> $ {{ mov.importe.toFixed(2)}}</Label>
                        </div>
                        <div v-if="!dateMovements.length" class="flex justify-center mt-10">
                            <Lebel>No se encontraron movimientos de caja registrados para el día seleccionado</Lebel>
                        </div>
                    </ScrollArea>
                </div>
            </div>
        </div>
    </div>
</template>