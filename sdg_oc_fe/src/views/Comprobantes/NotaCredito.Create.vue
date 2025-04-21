<script setup lang="ts">
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { SlashIcon} from '@radix-icons/vue';
import { onMounted, ref } from 'vue';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Cliente } from '@/api/entities/clientes';
import SelectClienteDialog from '@/components/SelectClienteDialog.vue';
import { Comprobante } from '@/api/entities/comprobante';
import Label from '@/components/ui/label/Label.vue';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { condicionIvaDisplay, tipoComprobanteDisplay } from '@/lib/utils';
import SelectFacturaDialog from '@/components/SelectFacturaDialog.vue';
import { AlertCircleIcon, AsteriskIcon } from 'lucide-vue-next';
import router from '@/router';
import { comprobantesApi } from '@/api/libs/comprobantes';
import { toast } from '@/components/ui/toast';
import { Venta } from '@/api/entities/venta';
import { useRoute } from 'vue-router';
import { ventasApi } from '@/api/libs/ventas';
import { useLoaderStore } from '@/stores/LoaderStore';
import AlertError from '@/components/AlertError.vue';

const route = useRoute();
const loader = useLoaderStore()

const showError = ref<boolean>(false);
const errorMessage =ref<string>('');
const selectedCliente = ref<Cliente>();
const selectedFactura = ref<Comprobante>();
const searchClienteOpen =ref<boolean>(false);
const searchFacturaOpen =ref<boolean>(false);

const fechaComprobante = ref<Date>(new Date());
const motivoComprobante = ref<string>();
const importeComprobante = ref<number>(0);
const tipoComprobante = ref<number>();
const prevVenta= ref<Venta>();


onMounted(async()=>{
    loader.show();
    const query = route.query;
    if(query.venta){
        const res = await ventasApi.getOne(query.venta.toString());
        prevVenta.value = res.venta;
        handleSelectCliente(prevVenta.value.cliente)
        handleSelectFactura(prevVenta.value.factura)
    }
    loader.hide();
})


const handleSelectCliente = async(cliente:Cliente)=>{
    selectedCliente.value=cliente;
    selectedFactura.value=undefined; 
    searchClienteOpen.value=false;
}

const handleSelectFactura = async(factura:Comprobante)=>{
    selectedFactura.value=factura; 
    tipoComprobante.value = getTipoNotaCredito(factura.tipoComprobante);
    searchFacturaOpen.value=false;
}

const isValidComprobante = ref<{
    cliente: boolean,
    importeTotal: boolean,
    facturaRelacionada: boolean,
    motivo: boolean,
    tipoComprobante: boolean
}>({
    cliente: true,
    importeTotal: true,
    facturaRelacionada: true,
    motivo:true,
    tipoComprobante: true
});

const validateAndSubmit = async ()=>{
    isValidComprobante.value.cliente= Boolean(selectedCliente.value?.id);
    isValidComprobante.value.importeTotal=  selectedFactura.value ? (importeComprobante.value <= selectedFactura.value.importeTotal && importeComprobante.value>0) : false;
    isValidComprobante.value.motivo= Boolean(motivoComprobante.value);
    isValidComprobante.value.facturaRelacionada=Boolean(selectedFactura.value?.numeroComprobante);
    isValidComprobante.value.tipoComprobante = tipoComprobante.value ? [3, 8, 13, 53].includes(tipoComprobante.value) : false;
    if(isValidComprobante.value.cliente && isValidComprobante.value.facturaRelacionada && isValidComprobante.value.importeTotal && isValidComprobante.value.motivo && isValidComprobante.value.tipoComprobante){
        await onSubmit()
    }
}

const onSubmit = async()=>{
    try{
        loader.show()
        const newComprobante ={
            importeTotal: importeComprobante.value,
            transaccionRelacionadaId: {
                id: selectedFactura.value?.id
            },
            tipoComprobante: tipoComprobante.value,
            motivo: motivoComprobante.value,
            condicionIvaCliente: prevVenta.value?.condicionIva
        }
        const createdNC = await comprobantesApi.create(newComprobante)
        loader.hide();
        router.push(`/nota-credito-debito/view/${createdNC.id}`)
        toast({
            title: 'Nota de crédito emitida con éxito',
        })
    }catch (err: any) {
        errorMessage.value = err.message as string;
        showError.value = true;
        loader.hide();
  }
}

const getTipoNotaCredito = (tipoFactura: number)=>{
    return (
        {
            1: 3,   // facturaA : ncA
            6: 8,   // facturaB : ncB
            11: 13, // facturaC : ncC
            51: 53, // facturaM : ncm

        }[tipoFactura]
    )
}

const redirectCancel = ()=>{
    prevVenta.value 
    ? router.push(`/ventas/view/${prevVenta.value.id}`) 
    : router.push(`/ventas/view`)
}




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
                    <BreadcrumbLink href="/ventas">Comprobantes</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                    <SlashIcon />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                    <BreadcrumbPage>Nota de Crédito</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
        <h1 class="page-title">Nueva Nota de Crédito</h1>
        <div class="pt-2">
            <form @submit.prevent="validateAndSubmit" class="flex flex-row justify-between items-center py-4" >
                <div class="rounded-[0.5rem] w-[58rem] h-auto flex flex-col justify-start items-start">
                    <div class="flex flex-col sm:flex-row sm:justify-between w-full items-center border rounded-lg p-8">
                        <div class="h-[10rem] w-full flex flex-row items-center justify-start ">
                            <div class=" w-[45rem]  flex flex-col items-center justify-start">
                                <div class="flex h-14  flex-row justify-start items-center w-full">
                                    <Label class="form-label w-[14rem]  text-md">Cliente</Label>
                                    <Input type="text" 
                                        class="w-full sm:w-[17rem] h-10"
                                        readonly
                                        :value="selectedCliente ? `${selectedCliente.apellido}, ${selectedCliente.nombre}` : 'Buscar'"
                                        @click="searchClienteOpen = true"
                                    />
                                    <SelectClienteDialog
                                        v-model="searchClienteOpen"
                                        title="Nueva Nota de Crédito: Seleccionar Cliente"
                                        @select-cliente="handleSelectCliente"
                                    />
                                    <TooltipProvider  v-if="!isValidComprobante.cliente" >
                                        <Tooltip>
                                        <TooltipTrigger class="bg-transparent text-xs text-destructive ml-4"> <AsteriskIcon :size="20" /> </TooltipTrigger>
                                        <TooltipContent class="text-destructive border-destructive font-thin text-xs">
                                            <p>Seleccionar cliente</p>
                                        </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                                <div class="flex h-14  flex-row justify-start items-center w-full">
                                    <Label class="form-label w-[14rem] text-md">Factura relacionada</Label>
                                    <Input type="text" 
                                        class="w-full sm:w-[17rem] h-10"
                                        readonly
                                        :value="selectedFactura ? `${selectedFactura.numeroComprobante}` : 'Buscar'"
                                        @click="()=>selectedCliente ? searchFacturaOpen = true : isValidComprobante.cliente=false"
                                    />
                                     <div v-if="selectedCliente">
                                         <SelectFacturaDialog
                                         v-model="searchFacturaOpen"
                                         :nro-documento="selectedCliente?.nroDocumento"
                                         title="Nueva Nota de Crédito: Seleccionar factura relacionada"
                                         @select-factura="handleSelectFactura"
                                         />
                                         <TooltipProvider  v-if="!isValidComprobante.facturaRelacionada" >
                                             <Tooltip>
                                                 <TooltipTrigger class="bg-transparent text-xs text-destructive ml-4"> <AsteriskIcon :size="14" /> </TooltipTrigger>
                                                 <TooltipContent class="text-destructive border-destructive font-thin text-xs">
                                                     <p>Seleccionar Factua</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </div>
                                </div>
                                <div class="flex h-14 flex-row justify-start items-center w-full">
                                    <Label class="form-label w-[14rem] text-md">Condición fiscal</Label>
                                    <Label class="form-label w-[15rem] text-sm pt-1 ">{{ prevVenta ? condicionIvaDisplay(prevVenta?.condicionIva) : '--' }}</Label>
                                </div>
                            </div>
                            <div class="date w-auto sm:w-[10rem] h-[8rem] text-center flex flex-col justify-between items-center">
                                <div class="flex flex-col w-[8rem] h-[6rem] border justify-center items-center rounded-lg">
                                    <span>Nota Crédito</span>
                                    <span v-if="tipoComprobante" class="text-[3rem] leading-[3rem]">{{ tipoComprobanteDisplay(tipoComprobante)?.letra}}</span>
                                </div>
                                <Label class="text-[1rem]">Fecha: {{ fechaComprobante.toLocaleDateString('es-ES') }}</Label>
                            </div>
                        </div> 
                    </div>
                    <div class="flex flex-col justify-start items-start w-full mt-8 border rounded-lg p-8">
                        <div class=" flex flex-row w-[40rem] justify-start items-center my-4">
                            <Label class="w-[14rem] text-md">Importe factura original</Label>
                            <Label class="text-md w-[1rem] mr-[1rem]">$</Label>
                            <Label class="text-md w-[6rem]">{{selectedFactura?.importeTotal}}</Label>
                        </div>
                        <div class=" flex flex-row w-[40rem] justify-start items-center my-4">
                            <Label class="w-[14rem] text-md">Concepto emisión</Label>
                            <Select v-model="motivoComprobante" >
                                <SelectTrigger class="w-[17rem]">
                                    <SelectValue placeholder="Seleccionar" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="Anulación" >Anulación</SelectItem>
                                        <SelectItem value="Descuento" >Descuento</SelectItem>
                                        <SelectItem value="Devolución" >Devolución</SelectItem>
                                        <SelectItem value="Diferencia de Precio">Diferencia de precio</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <TooltipProvider  v-if="!isValidComprobante.motivo" >
                             <Tooltip>
                                 <TooltipTrigger class="bg-transparent text-xs text-destructive ml-4"> <AsteriskIcon :size="14" /> </TooltipTrigger>
                                 <TooltipContent class="text-destructive border-destructive font-thin text-xs">
                                     <p>Seleccionar concepto</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                        <div class=" flex flex-row justify-start items-center my-4">
                            <Label class="w-[14rem] text-md">Importe</Label>
                            <div class="w-[17rem]">
                                <div class=" relative w-full max-w-sm items-center">
                                    <Input 
                                    class="pl-10" v-decimal 
                                    :model-value="importeComprobante"
                                    @update:model-value="(value)=> importeComprobante=Number(value)"         />
                                    <span class="text-[#737373] absolute start-0 inset-y-0 flex items-center justify-center px-2">$</span>
                                </div>
                            </div>
                            <TooltipProvider  v-if="!isValidComprobante.importeTotal" >
                             <Tooltip>
                                 <TooltipTrigger class="bg-transparent text-xs text-destructive ml-4"> <AsteriskIcon :size="14" /> </TooltipTrigger>
                                 <TooltipContent class="text-destructive border-destructive font-thin text-xs">
                                     <p v-if="!importeComprobante">Ingresar Importe</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                        <p v-if="selectedFactura && importeComprobante > selectedFactura?.importeTotal" class="text-destructive text-sm py-2 flex flex-row"><AlertCircleIcon class="mr-2"/> El importe de la Nota de Crédito no puede superar el importe de la factura original</p>               
                    </div>
                    <div class="w-full flex justify-end mt-4">
                        <Button variant="outline" class="w-[12rem] mr-5" @click="redirectCancel">Cancelar</Button>
                        <Button type="submit" class="w-[12rem]">Emitir Nota de Crédito</Button>
                    </div>
                </div>
            </form>
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
