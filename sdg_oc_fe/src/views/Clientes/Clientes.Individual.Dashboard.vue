<script lang="ts" setup>
import { Cliente, TipoDocumento } from '@/api/entities/clientes';
import { TipoReceta } from '@/api/entities/recetasAereos';
import { clientesApi } from '@/api/libs/clientes';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import {
    AsteriskIcon,
    CircleDot,
    Eye,
    Fingerprint,
    IdCard,
    InspectIcon,
    Mail,
    MapPin,
    Phone,
    PlusIcon,
    PrinterIcon,
    User,
    Wallet,
} from 'lucide-vue-next'
import { SlashIcon } from '@radix-icons/vue';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { ScrollArea } from '@/components/ui/scroll-area'
import { formatDate } from '@/lib/utils.recetas';
import router from '@/router';
import { cuentaCorrienteApi } from '@/api/libs/cuentaCorriente';
import { CuentaCorriente } from '@/api/entities/cuentaCorriente';
import Button from '@/components/ui/button/Button.vue';
import { condicionIvaDisplay, tipoComprobanteDisplay } from '@/lib/utils';
import { Comprobante, TipoComprobante } from '@/api/entities/comprobante';
import { comprobantesApi } from '@/api/libs/comprobantes';
import { Audiometria } from '@/api/entities/audiometrias';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createMovimientoCtaCte, TipoMovimiento } from '@/api/entities/movimiento';
import { RedDePago, TipoMedioDePagoEnum } from '@/api/entities/mediosDePago';
import { Venta } from '@/api/entities/venta';
import { toast } from '@/components/ui/toast';
import AlertError from '@/components/AlertError.vue';

const route = useRoute();
const currentCliente = ref<Cliente>();
const ctaCorriente = ref<CuentaCorriente>();
const recetasCliente = ref<{id: number, clase:string, tipo?:TipoReceta, fecha:Date}[]>([]);
const audiometriasCliente = ref<Audiometria[]>([]);
const comprobantesCliente = ref<Comprobante[]>([]);
const movimientosAndComprobantes = ref<{id: string, fecha: Date, importe: number, motivo:string, clase: string, venta: Venta|undefined, tipoComprobante: TipoComprobante|undefined}[]>([])
const openDialog = ref<boolean>(false);

const showError = ref<boolean>(false);
const errorMessage =ref<string>('');

const newMovimiento = ref<{tipoMovimiento: TipoMovimiento| undefined, importe: number, formaPago: TipoMedioDePagoEnum| undefined, redDePago: RedDePago| undefined, entidadBancaria: string|undefined}>({
    tipoMovimiento: undefined, 
    importe: 0,
    formaPago: undefined,
    redDePago: undefined,
    entidadBancaria: undefined,
})

const isValidNewMovimiento= ref<{tipoMovimiento: boolean, redDePago: boolean, importe: boolean, formaPago: boolean, entidadBancaria: boolean}>({
    tipoMovimiento: true, 
    importe: true,
    formaPago: true,
    redDePago: true, 
    entidadBancaria: true,
})

onMounted( async()=>{
   await loadData();
})

const loadData = async()=>{
    // TODO pagination
    currentCliente.value = await clientesApi.getOne(Number(route.params.id));
    recetasCliente.value = await clientesApi.getRecetasSummaryByCliente(currentCliente.value.id);
    audiometriasCliente.value = await clientesApi.getAudiometriasByCliente(currentCliente.value.id);
    ctaCorriente.value = await cuentaCorrienteApi.getOneByCliente(currentCliente.value.id);    
    comprobantesCliente.value = await comprobantesApi.getAllByCliente(currentCliente.value.id)
    const itemsComprobantes = comprobantesCliente.value.map((c=> ({
        id: c.id,
        fecha: new Date(c.fechaEmision),
        importe: c.importeTotal,
        motivo: c.motivo ?? '',
        tipoComprobante: c.tipoComprobante,
        venta:c.venta,
        clase: 'comprobante',
    })))
    const itemsMovimientos = ctaCorriente.value.movimientos.map(mov=>({
        id: mov.id.toString(),
        fecha: new Date(mov.fechaMovimiento),
        importe: mov.importe,
        motivo: mov.tipoMovimiento.toString() ?? 'Movimiento cta cte',
        tipoComprobante: undefined,
        venta: undefined,
        clase: 'movimiento',
    }))
    movimientosAndComprobantes.value = [...itemsMovimientos, ...itemsComprobantes];
    movimientosAndComprobantes.value.sort((a, b) => b.fecha.getTime() - a.fecha.getTime());
}

const printComprobante = async(id: string, tipoComprobante: number, fecha:Date)=>{
    try {
        const resp = await comprobantesApi.print(id);
        const bufferData = resp.data;
        const uint8Array = new Uint8Array(bufferData);
        const pdfBlob = new Blob([uint8Array], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(pdfBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${currentCliente.value?.apellido}_${tipoComprobanteDisplay(tipoComprobante)?.nombre}_${fecha.toISOString().split('T')[0]}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    } catch (error) {
        console.error('Error al descargar el PDF:', error);
    }
}


const emailComprobante = async(_id: string)=>{
    try {
        const resp = await comprobantesApi.email(_id);
        toast({
            title: 'Comprobante enviado por email'
        })
    } catch (error) {
        console.error('Error al enviar el comprobante:', error);
    }
}

const validateAndSubmit = async()=>{
    const resultNewMovimiento = createMovimientoCtaCte(newMovimiento.value);
    isValidNewMovimiento.value = resultNewMovimiento.isValid;
    if(resultNewMovimiento.success){
        await onSubmit();
    }
}


const onSubmit = async()=>{
    try{
        if(currentCliente.value){
            ctaCorriente.value = await cuentaCorrienteApi.updateSaldo(currentCliente.value?.id, newMovimiento.value)
            toast({
                title: 'Saldo actualizado con éxito',
            })
            await loadData();
            openDialog.value=false;
            newMovimiento.value={
                tipoMovimiento: undefined, 
                importe: 0,
                formaPago: undefined,
                redDePago: undefined,
                entidadBancaria: undefined,
            }
        }   
    }catch (err: any) {
        errorMessage.value = err.message as string;
        showError.value = true;
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
                    <BreadcrumbPage href="/clientes" >Clientes</BreadcrumbPage>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                    <SlashIcon />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                    <BreadcrumbPage>Dashboard</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
        <div class="pt-2">
            <div v-if="currentCliente" class="w-full flex flex-row justify-between h-[15rem]">
                <div class="w-[72%] bg-secondary rounded-lg p-10 flex flex-col justify-between">
                    <div class="flex flex-row  w-full items-center justify-start ">
                        <User class="rounded-[50%] bg-white p-2 mr-4 w-16 h-16" />
                        <h1 class="page-title text-left">{{ currentCliente.apellido }}, {{ currentCliente.nombre }}</h1>
                    </div>
                    <div class="w-full flex flex-row justify-start items-start h-[5rem]">
                        <div class="text-gray-700 w-[50%] h-[5rem] flex flex-col justify-between items-start">
                            <div class="flex flex-row justify-start">
                                <IdCard class=" text-gray-900 w-5 h-5 mr-2" />
                                <span class="text-sm w-[8rem]">{{  TipoDocumento[currentCliente.tipoDocumento] }} : </span>
                                <span class="text-sm" >{{  currentCliente.nroDocumento }}</span>
                            </div>
                            <div class="flex flex-row justify-start">
                                <Wallet class=" text-gray-900 w-5 h-5 mr-2"/>
                                <span class="text-sm w-[8rem]">Categoría Fiscal : </span>
                                <span class="text-sm" >{{ condicionIvaDisplay(currentCliente.categoriaFiscal) }}</span>
                            </div>
                            <div class="flex flex-row justify-start">
                                <Fingerprint class=" text-gray-900 w-5 h-5 mr-2" />
                                <span class="text-sm w-[8rem]">Sexo : </span>
                                <span class="text-sm" >{{ currentCliente.sexo }}</span>
                            </div>
                        </div>
                        <div class="text-gray-700 w-[50%] h-[5rem] flex flex-col justify-between items-between">
                            <div class="flex flex-row justify-start items-center">
                                <MapPin class=" text-gray-900 w-5 h-5 mr-2"/>
                                <span class="text-sm w-[6rem]">Domicilio : </span>
                                <span class="text-sm" >{{ currentCliente.domicilio }}, {{ currentCliente.localidad.localidad }}</span>
                            </div>
                            <div class="flex flex-row justify-start  items-center">
                                <Phone class="text-gray-900 w-5 h-5 mr-2"/>
                                <span class="text-sm w-[6rem]">Telefono : </span>
                                <span class="text-sm" >{{ currentCliente.telefono }}</span>
                            </div>
                            <div class="flex flex-row justify-start  items-center">
                                <Mail class="text-gray-900 w-5 h-5 mr-2"/>
                                <span class="text-sm w-[6rem]">Email : </span>
                                <span class="text-sm" >{{ currentCliente.email }}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="w-[25%] bg-secondary rounded-lg p-4 flex flex-col justify-center items-center">
                        <h2 class="page-subtitle">Cuenta Corriente</h2>
                        <div v-if="ctaCorriente" class=" mt-4 w-[90%] rounded-lg p-4 items-center flex flex-col bg-white" :class="{'border  ': (ctaCorriente?.saldo ?? 0) < 0, 'border': (ctaCorriente?.saldo ?? 0) >= 0}">
                            <Label class=" font-mono">Saldo Actual: </Label>
                            <Label  :class="{' font-mono text-[2rem] text-red-700': (ctaCorriente?.saldo ?? 0) < 0, ' text-[2rem] text-green-700': (ctaCorriente?.saldo ?? 0) >= 0}">$ {{  ctaCorriente?.saldo.toFixed(2) }}</Label>
                        </div>
                        <div v-else class=" mt-4 w-[90%] rounded-lg p-4 items-center justify-center flex flex-col bg-white border h-20">
                            <Label class=" font-mono text-center">La cuenta corriente del cliente no ha sido creada </Label>
                        </div>
                </div>
            </div>
            <div class="w-full flex flex-row h-[40rem] justify-between items-start mt-8 gap-x-4">
                <div class="w-[30%] h-full bg-secondary rounded-lg p-4 flex flex-col justify-start">
                        <div class="flex flex-row justify-between">
                            <h2 class="page-subtitle">Recetas</h2>
                            <div>
                                <Button @click="router.replace(`/recetas/${currentCliente?.id}`)" variant="outline" class="p-2 bg-transparent mr-4 hover:bg-white"><Eye/> </Button>
                                <Button @click="router.replace(`/recetas/${currentCliente?.id}`)" variant="outline" class="p-2 bg-transparent hover:bg-white"><PlusIcon/> </Button>
                            </div>
                        </div>
                        <ScrollArea v-if="recetasCliente.length" class=" mt-2 w-full h-[20rem] rounded-lg  bg-white border pr-4 scroll-ml-2">
                            <div v-for="receta in recetasCliente" @click="router.replace(`/recetas/${currentCliente?.id}`)" class="cursor-pointer flex flex-row justify-center items-center h-[4rem] rounded-lg mx-2 my-4 mr-4">
                                <div class=" cursor-pointer w-[39%]  rounded-tl-lg h-full rounded-bl-lg  border-r border font-semibold text-sm bg-secondary flex  justify-end items-center">
                                    <Label class=" cursor-pointer p-4" > {{formatDate(receta.fecha.toString())}} </Label>     
                                    <span class="w-[0px] mr-1"><CircleDot class="w-2 text-gray-700" /> </span>
                                </div>   
                                <div class=" cursor-pointer w-[60%] h-full border-y border-r rounded-br-lg rounded-tr-lg pl-4  flex  justify-start items-center">
                                    <Label class=" cursor-pointer text-sm font-thin" >{{ receta.clase }} <span v-if="receta.tipo">{{ receta.tipo }}</span> </Label>                    
                                </div>               
                            </div>
                        </ScrollArea>
                        <div v-else class=" mt-2 w-full flex flex-col items-center justify-center text-center h-[20rem] border rounded-lg bg-white py-4">
                                <Label class="text-sm">El cliente no tiene recetas registradas</Label>   
                                <Button class="mt-4 text-xs w-36" variant="outline" size="sm">Nueva Receta</Button>  
                        </div>
                        <div class=" mt-8">
                        <div class="flex flex-row justify-between">
                            <h2 class="page-subtitle">Audiometrías</h2>
                            <div>
                                <Button @click="router.replace(`/audiometrias/${currentCliente?.id}`)" variant="outline" class="p-2 bg-transparent mr-4 hover:bg-white"><Eye/> </Button>
                                <Button @click="router.replace(`/audiometrias/create/${currentCliente?.id}`)" variant="outline" class="p-2 bg-transparent hover:bg-white"><PlusIcon/> </Button>
                            </div>
                        </div>
                        <ScrollArea v-if="audiometriasCliente.length" class=" mt-2 w-full h-[12rem] pr-4  rounded-lg bg-white border">
                            <div v-for="(audiom, index) in audiometriasCliente" @click="router.replace(`/audiometria/${currentCliente?.id}`)" class="cursor-pointer flex flex-row justify-start items-center h-[3rem] p-4 rounded-lg bg-secondary border mx-2 my-4 mr-4">
                                <Label class=" cursor-pointer mr-4  text-sm" > {{formatDate(audiom.fechaInforme.toString())}} </Label>     
                                <div class=" cursor-pointer flex flex-col">
                                    <Label class=" cursor-pointer text-sm font-thin" >Audiometía {{ index }}</Label>                    
                                </div>               
                            </div>
                        </ScrollArea>
                        <div v-else class=" mt-2 w-full text-center flex flex-col items-center justify-center h-[12rem] border rounded-lg bg-white py-4">
                                <Label class="text-sm">El cliente no tiene audiometrías registradas</Label>   
                                <Button class="mt-4 text-xs w-36" variant="outline" size="sm">Nueva Audiometría</Button>  
                        </div>
                    </div>
                </div>
                <div class="w-[70%] h-full bg-secondary rounded-lg p-4 flex flex-col justify-start">
                    <div class=" flex flex-row justify-between">
                        <h2 class="page-subtitle">Ventas y Movimientos de Cuenta Corriente</h2>
                        <Dialog v-model:open="openDialog" >
                            <DialogTrigger as-child>
                            <Button variant="outline">
                                Nuevo Movimiento
                            </Button>
                            </DialogTrigger>
                            <DialogContent class="max-w-[40rem] min-h-[25rem] ">
                            <DialogHeader>
                                <DialogTitle>Nuevo movimiento de cuenta corriente</DialogTitle>
                                <DialogDescription>
                                Este movimiento afectará el saldo de la cuenta corriente
                                </DialogDescription>
                            </DialogHeader>
                            <form @submit.prevent="validateAndSubmit" >
                            <div class="grid gap-4 py-4">
                                 <div class="grid grid-cols-4 items-center mb-4 gap-4">
                                    <Label class="text-right col-span-1">Tipo Movimiento</Label>
                                    <div class=" ml-4 col-span-3 flex flex-row items-center justify-between">
                                        <Select 
                                            :modelValue="newMovimiento.tipoMovimiento" 
                                            @update:modelValue="(value) => {
                                                newMovimiento.tipoMovimiento = value as TipoMovimiento;
                                            }"
                                        >
                                            <SelectTrigger >
                                            <SelectValue placeholder="Tipo Movimiento"  />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectItem 
                                                        v-for="tipo in Object.entries(TipoMovimiento).filter(m=>m[0]!='VENTA')" 
                                                        :key="tipo[0]" 
                                                        :value="tipo[0]"
                                                    >
                                                        {{ tipo[1] }}
                                                    </SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                        <TooltipProvider  v-if="!isValidNewMovimiento.tipoMovimiento" >
                                            <Tooltip>
                                                <TooltipTrigger class="bg-transparent text-xs text-destructive ml-4"> <AsteriskIcon :size="14" /> </TooltipTrigger>
                                                <TooltipContent class="text-destructive border-destructive font-thin text-xs">
                                                    <p>Seleccionar tipo movimiento</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                </div>

                                <div class="grid grid-cols-4 items-center mb-4 gap-4">
                                    <Label class="text-right col-span-1">Importe</Label>
                                    <div class=" ml-4 col-span-3 flex flex-row items-center justify-between">
                                        <Label class="w-[7%] text-left">$</Label>
                                        <Input decimal type="number" class="w-[93%]" v-model="newMovimiento.importe"   />
                                        <TooltipProvider  v-if="!isValidNewMovimiento.importe" >
                                            <Tooltip>
                                                <TooltipTrigger class="bg-transparent text-xs text-destructive ml-4"> <AsteriskIcon :size="14" /> </TooltipTrigger>
                                                <TooltipContent class="text-destructive border-destructive font-thin text-xs">
                                                    <p>Ingresar Importe</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                </div>

                                <div class="grid grid-cols-4 items-center mb-4 gap-4">
                                    <Label class="text-right col-span-1">Medio de Pago</Label>
                                    <div class=" ml-4 col-span-3 flex flex-row items-center justify-between">
                                        <Select 
                                            :modelValue="newMovimiento.formaPago" 
                                            @update:modelValue="(value) => {
                                                newMovimiento.formaPago = value as TipoMedioDePagoEnum;
                                            }"
                                        >
                                            <SelectTrigger >
                                            <SelectValue placeholder="Medio De Pago"  />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectItem 
                                                        v-for="tipo in Object.entries(TipoMedioDePagoEnum)" 
                                                        :key="tipo[0]" 
                                                        :value="tipo[0]"
                                                    >
                                                        {{ tipo[1] }}
                                                    </SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                        <TooltipProvider  v-if="!isValidNewMovimiento.formaPago" >
                                            <Tooltip>
                                                <TooltipTrigger class="bg-transparent text-xs text-destructive ml-4"> <AsteriskIcon :size="14" /> </TooltipTrigger>
                                                <TooltipContent class="text-destructive border-destructive font-thin text-xs">
                                                    <p>Seleccionar forma de pago</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                </div>

                                <div v-if="newMovimiento.formaPago && ![TipoMedioDePagoEnum.EFECTIVO, TipoMedioDePagoEnum.TRANSFERENCIA_BANCARIA].includes(newMovimiento.formaPago)" class="grid grid-cols-4 items-center mb-4 gap-4">
                                    <Label class="text-right col-span-1">Red de Pago</Label>
                                    <div class=" ml-4 col-span-3 flex flex-row items-center justify-between">
                                        <Select 
                                            :modelValue="newMovimiento.redDePago" 
                                            @update:modelValue="(value) => {
                                                newMovimiento.redDePago = value as RedDePago;
                                            }"
                                        >
                                            <SelectTrigger >
                                            <SelectValue placeholder="Medio De Pago"  />
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
                                        <TooltipProvider  v-if="!isValidNewMovimiento.redDePago" >
                                            <Tooltip>
                                                <TooltipTrigger class="bg-transparent text-xs text-destructive ml-4"> <AsteriskIcon :size="14" /> </TooltipTrigger>
                                                <TooltipContent class="text-destructive border-destructive font-thin text-xs">
                                                    <p>Seleccionar red de pago</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                </div>
                                
                                <div v-if="newMovimiento.formaPago && ![TipoMedioDePagoEnum.EFECTIVO, TipoMedioDePagoEnum.TRANSFERENCIA_BANCARIA].includes(newMovimiento.formaPago)" class="grid grid-cols-4 items-center mb-4 gap-4">
                                    <Label class="text-right col-span-1">Entidad Bancaria</Label>
                                    <div class=" ml-4 col-span-3 flex flex-row items-center justify-between">
                                        <Input type="text" class="w-[100%]" v-model="newMovimiento.entidadBancaria"   />
                                        <TooltipProvider  v-if="!isValidNewMovimiento.entidadBancaria" >
                                            <Tooltip>
                                                <TooltipTrigger class="bg-transparent text-xs text-destructive ml-4"> <AsteriskIcon :size="14" /> </TooltipTrigger>
                                                <TooltipContent class="text-destructive border-destructive font-thin text-xs">
                                                    <p>Ingresar Entidad Bancaria</p>
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
                    <ScrollArea v-if="movimientosAndComprobantes.length" class=" mt-2 p-4 w-full h-full rounded-lg bg-white border">
                        <div v-for="row in movimientosAndComprobantes" >
                            <div v-if="row.clase==='comprobante' && row.tipoComprobante" class="flex flex-row justify-between w-full  mb-2 border-b items-center px-4 h-[4rem] ">
                                <div class="flex flex-row justify-start items-center">
                                    <Label class="w-[8rem] text-sm ">{{ formatDate(row.fecha) }}</Label>
                                    <Label class="w-[13rem] text-sm flex justify-start "> <Label class="bg-secondary px-4 py-2 rounded-lg">{{ tipoComprobanteDisplay(row.tipoComprobante)?.nombre.toLocaleUpperCase() }} {{ tipoComprobanteDisplay(row.tipoComprobante)?.letra }}</Label></Label>
                                    <Label v-if="![1,6].includes(row.tipoComprobante)" class="w-[18rem] text-xs flex justify-start ">{{ row.motivo }}</Label>
                                    <Label v-else class="w-[18rem] text-xs flex justify-start ">Venta</Label>
                                    <Label class="w-[8rem] text-sm "> $ {{ row.importe.toFixed(2)}}</Label>
                                </div>
                                <div class="flex flex-row ">
                                    <Button variant="ghost" @click="printComprobante(row.id, row.tipoComprobante, row.fecha)">
                                        <PrinterIcon />
                                    </Button>
                                    <Button variant="ghost" @click="emailComprobante(row.id)">
                                        <Mail />
                                    </Button>
                                    <Button v-if="[1, 6].includes(row.tipoComprobante) && row.venta" variant="ghost" @click="router.push(`/ventas/view/${row.venta.id}`)">
                                        <InspectIcon />
                                    </Button>
                                    <Button v-if="[3,8,2,7].includes(row.tipoComprobante)" variant="ghost" @click="router.push(`/nota-credito-debito/view/${row.id}`)">
                                        <InspectIcon />
                                    </Button>
                                </div>
                            </div>
                            <div v-if="row.clase==='movimiento'" class="flex flex-row justify-between w-full  mb-2 border-b items-center px-4 h-[4rem] ">
                                <div class="flex flex-row justify-start items-center">
                                    <Label class="w-[8rem] text-sm ">{{ formatDate(row.fecha) }}</Label>
                                    <Label class="w-[13rem] text-sm flex justify-start "> <Label class="bg-secondary px-4 py-2 rounded-lg">{{row.motivo}}</Label></Label>
                                    <Label class="w-[18rem] text-xs flex justify-start ">Cuenta Corriente</Label>
                                    <Label class="w-[8rem] text-sm"><span class="font-bold" v-if="row.motivo==TipoMovimiento.VENTA">-</span> $ {{ row.importe.toFixed(2)}}</Label>
                                </div>
                                <div>
                                   ???
                                </div>
                            </div>

                        </div>

                    </ScrollArea>
                    <div v-else class=" mt-2 w-full text-center flex justify-center items-center h-full border rounded-lg bg-white py-4">
                            <Label class="text-sm h-[15rem]">No hay ventas ni movimientos de cuenta corriente registrados para el cliente </Label>   
                    </div>
                </div>
            </div>
        </div>
        <AlertError
            v-model="showError"
            title="Error"
            :message="errorMessage"
            button="Aceptar"
            :action="()=>{showError=false}"
        />
    </div>
</template>
