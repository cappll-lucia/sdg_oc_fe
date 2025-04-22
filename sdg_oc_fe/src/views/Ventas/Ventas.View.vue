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
import { computed, onMounted, ref } from 'vue';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Label from '@/components/ui/label/Label.vue';
import { TipoMedioDePagoEnum, RedDePago } from '@/api/entities/mediosDePago';
import { CondicionIva, Venta } from '@/api/entities/venta';
import { ventasApi } from '@/api/libs/ventas';
import { useRoute } from 'vue-router';
import { condicionIvaDisplay, tipoComprobanteDisplay } from '@/lib/utils';
import { Comprobante, TipoComprobante } from '@/api/entities/comprobante';
import { clientesApi } from '@/api/libs/clientes';
import { formatDate } from '@/lib/utils.recetas';
import Button from '@/components/ui/button/Button.vue';
import { InspectIcon, MailIcon, PrinterIcon } from 'lucide-vue-next';
import { router } from '@/router';
import { comprobantesApi } from '@/api/libs/comprobantes';
import { toast } from '@/components/ui/toast';
import AlertError from '@/components/AlertError.vue';
import { useLoaderStore } from '@/stores/LoaderStore';
import LoaderInline from '@/components/LoaderInline.vue';

const route = useRoute();
const loader = useLoaderStore();
const loadingForm=ref<boolean>(false);

const currentVenta = ref<Venta>();
const comprobantesVenta = ref<Comprobante[]>([]);

const showError = ref<boolean>(false);
const errorMessage =ref<string>('');

onMounted(async () => {
    const id = route.params.id?.toString();
    if(id){
        loader.show()
        await loadData(id)
        loader.hide();
    }
});

const loadData = async(id: string)=>{
    try{
        const res = await ventasApi.getOne(id);
        currentVenta.value = res.venta;
        comprobantesVenta.value = [...res.comprobantesRelacionados];
        if(res.venta.factura){
            comprobantesVenta.value.push(res.venta.factura)
        }
        currentVenta.value.fecha = new Date(currentVenta.value.fecha);
        currentVenta.value.cliente = await clientesApi.getOne(currentVenta.value.cliente.id);
    }catch (err: any) {
        errorMessage.value = err.message as string;
        showError.value = true;
        loader.hide();
    }
}

const totalVentaBruto = computed(()=>{
    if(currentVenta.value){
        return currentVenta.value.lineasDeVenta.reduce((total, linea) => {
            return total + (linea.precioIndividual ? linea.precioIndividual * linea.cantidad : 0);
        }, 0);
    }else return 0
})

const montoObrasSociales = computed(()=>{
    if(currentVenta.value){
        return currentVenta.value.ventaObraSocial.reduce((total, os)=>{
            return total + os.importe
        }, 0)
    }else return 0
})

const totalVentaFinal = computed(()=>{
    return totalVentaBruto.value - montoObrasSociales.value
})

const montoDto = computed(()=>{
    if(currentVenta.value){
        return totalVentaFinal.value * currentVenta.value?.descuentoPorcentaje / 100
    }else return 0
})


const caluclateImportePago = computed(()=>{
    return totalVentaFinal.value - montoDto.value
});



const printComprobante = async(id: string, tipoComprobante: number, fecha:Date, duplicado: number)=>{
    try {
        loadingForm.value=true;
        const resp = await comprobantesApi.print(id, duplicado);
        const bufferData = resp.data;
        const uint8Array = new Uint8Array(bufferData);
        const pdfBlob = new Blob([uint8Array], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(pdfBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${currentVenta.value?.cliente.apellido}_${tipoComprobanteDisplay(tipoComprobante)?.nombre}_${fecha.toString().split('T')[0]}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        toast({
            title: 'Comprobante impreso con éxito'
        })
        loadingForm.value=false;
    } catch (error) {
        loadingForm.value=false;
        errorMessage.value = 'Error al descargar el PDF';
        showError.value = true;
    }
}

const emailComprobante = async(_id: string)=>{
    try {
        loadingForm.value=true;
        await comprobantesApi.email(_id);
        loadingForm.value=false;
        toast({
            title: 'Comprobante enviado por email'
        })
    } catch (error) {
        errorMessage.value = 'Error al enviar el comprobante';
        showError.value = true;
        loadingForm.value=false;
    }
}

const emitirFactura = async()=>{
    try{
        loader.show();
        if(currentVenta.value){
            const newFactura ={
                importeTotal: currentVenta.value?.importe,
                tipoComprobante: tipoFactura(Number(currentVenta.value?.cliente.categoriaFiscal)),
                motivo: currentVenta.value?.observaciones,
                condicionIvaCliente: Number(currentVenta.value?.cliente.categoriaFiscal),
                transaccionRelacionadaId: {id: currentVenta.value.id}
            }
            const factura = await comprobantesApi.create(newFactura);
            currentVenta.value.factura=factura;
            if(currentVenta.value.factura){
                comprobantesVenta.value.push(factura);
            }
            loader.hide();
            toast({
                title: 'Factura emitida',
            })
        }
    }catch (err: any) {
        errorMessage.value = err.message as string;
        showError.value = true;
        loader.hide();
    }
}

const tipoFactura = ((condicionIva: CondicionIva)=>{
    if(condicionIva==CondicionIva.MONOTRIBUTISTA || condicionIva == CondicionIva.RESPONSABLE_INSCRIPTO){
        return TipoComprobante.FACTURA_A
    }else{
        return TipoComprobante.FACTURA_B
    }
})


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
                    <BreadcrumbPage>Detalles Venta</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
        <h1 class="page-title">Venta</h1>
        <div v-if="currentVenta" class=" w-full pt-6 rounded-lg flex flex-col justify-between items-start ">
            <div class="rounded-lg h-full w-full flex flex-col justify-start items-start">
                <div class="w-full flex flex-row items-center justify-start ">
                    <div class="w-[26rem] flex flex-col items-center justify-start">
                        <div class="flex  flex-row justify-start items-center w-full">
                            <Label class="form-label w-[11rem] text-md font-bold ">Cliente: </Label>
                            <Label class="form-label w-[15rem] text-md">{{ currentVenta?.cliente.apellido }}, {{
                                currentVenta?.cliente.nombre }}</Label>
                        </div>
                        <div class="flex  flex-row justify-start items-center w-full">
                            <Label class="form-label w-[11rem] text-md font-bold">Condición Fiscal: </Label>
                            <!-- //TODO update por categFiscal de la venta -->
                            <Label class="form-label w-[15rem] text-md">{{
                                condicionIvaDisplay(currentVenta.cliente.categoriaFiscal) }}</Label>
                        </div>
                        <div class="flex  flex-row justify-start items-center w-full">
                            <Label class="form-label w-[11rem] text-md font-bold">Fecha: </Label>
                            <Label class="form-label w-[15rem] text-md">{{
                                currentVenta?.fecha.toLocaleDateString('es-ES') }}</Label>
                        </div>
                    </div>
                    <div class=" flex flex-col items-center justify-end">
                        <div v-if="currentVenta.factura" class="flex flex-col w-[6rem] h-[5rem] border justify-center items-center rounded-lg">
                            <span class="text-[1rem]">{{ tipoComprobanteDisplay(currentVenta.factura.tipoComprobante)?.nombre }}</span>
                            <span class="text-[2rem] leading-[2rem] ">{{ tipoComprobanteDisplay(currentVenta.factura.tipoComprobante)?.letra }}</span>
                        </div>
                        <div v-else class="flex flex-col w-[6rem] h-[5rem] border justify-center items-center rounded-lg">
                            <span class="text-[0.9rem] text-center">Factura no emitida</span>
                        </div>
                    </div>
                </div>
                <div class="flex flex-col w-full justify-start items-start mt-10">
                    <h3 class="page-subtitle">Detalle</h3>

                    <div class="linea-venta-header bg-secondary mt-4 rounded-t-lg">
                        <span>CÓDIGO</span>
                        <span class="text-left">DESCRIPCIÓN</span>
                        <span>IMPORTE UNITARIO</span>
                        <span>CANTIDAD</span>
                        <span>IMPORTE TOTAL</span>
                        <span></span>
                    </div>

                    <div v-for="(linea, index) in currentVenta?.lineasDeVenta" :key="index"
                        class="linea-venta-item border-x border-b">
                        <span class="text-center id-input">{{ linea.producto.codProv }}</span>
                        <span class="text-left descripcion-input">{{ linea.producto.descripcion }}</span>
                        <span class="text-center">$ {{ linea.precioIndividual.toFixed(2) }}</span>
                        <span class="text-center">{{ linea.cantidad }}</span>
                        <span class="text-center">$ {{ (linea.cantidad*linea.precioIndividual).toFixed(2) }}</span>
                    </div>




                    <div class="w-full min-h-[9rem] flex flex-row justify-between items-start mt-10">
                        <div class="w-[68%] rounded-lg border p-4  flex flex-col justify-start  items-start">
                            <div class="rounded-lg w-[30rem] min-h-[4rem]">
                                <h3 class="text-md font-bold ">Obras Sociales</h3>
                                <span v-if="currentVenta.ventaObraSocial.length==0" class="text-sm">No aplica</span>
                                <div v-else v-for="vos in currentVenta.ventaObraSocial"
                                    class="w-full flex flex-row justify-start my-2 items-center ">
                                    <span class="text-sm w-[12rem]">{{ vos.obraSocial.nombre }}</span>
                                    <span class="text-sm w-[7rem]">$ {{ vos.importe.toFixed(2) }}</span>
                                    <span class="text-sm">{{ condicionIvaDisplay(vos.condicionIva) }}</span>
                                </div>
                            </div>
                            <div class="rounded-lg w-full min-h-[3rem] ">
                                <h3 class="text-md font-bold ">Descuento</h3>
                                <span v-if="!currentVenta.descuentoPorcentaje" class="text-sm">No aplica</span>
                                <span v-else class="text-sm w-[12rem]">Dto Aplicado: {{ currentVenta.descuentoPorcentaje
                                    }} %</span>
                            </div>

                        </div>
                        <div v-if="currentVenta"
                            class="w-[30%] h-[9rem] rounded-lg bg-secondary px-4 flex flex-col items-center justify-center">
                            <div v-if="currentVenta.ventaObraSocial.length>0 || currentVenta.descuentoPorcentaje"
                                class=" flex  justify-center my-2">
                                <Label class=" w-[9rem] text-right mr-4">Importe Total: </Label>
                                <Label class=" w-[10rem]">$ {{ totalVentaBruto?.toFixed(2) }}</Label>
                            </div>
                            <div v-if="currentVenta.ventaObraSocial.length > 0"
                                class=" flex  justify-center items-center my-2">
                                <Label class=" w-[9rem] text-right mr-4">Obras Sociales: </Label>
                                <Label class=" w-[10rem]  ">- $ {{ montoObrasSociales?.toFixed(2) }}</Label>
                            </div>
                            <div v-if="currentVenta.descuentoPorcentaje"
                                class=" flex  justify-center items-center my-2">
                                <Label class=" w-[9rem] text-right mr-4">Descuento: </Label>
                                <Label class=" w-[10rem] ">- $ {{ montoDto.toFixed(2) }}</Label>
                            </div>
                            <div class=" flex justify-center my-2">
                                <Label class="page-subtitle w-[9rem] text-right mr-4">Importe Final: </Label>
                                <Label class="page-subtitle  w-[10rem] ">$ {{ caluclateImportePago.toFixed(2) }}</Label>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="mt-6 w-full">
                    <div
                        class="w-full flex flex-row justify-start  items-start py-2 bg-secondary font-bold rounded-t-lg p-[0.75rem] px-[2rem]">
                        <span class="text-[0.8rem] w-[15rem]">MEDIO DE PAGO</span>
                        <span class="text-[0.8rem] w-[10rem]">IMPORTE</span>
                        <span class="text-[0.8rem] w-[10rem] ">RED DE PAGO</span>
                        <span class="text-[0.8rem] w-[10rem] ">ENTIDAD BANCARIA</span>
                    </div>
                    <div v-for="medio in currentVenta.mediosDePago"
                        class="w-full flex flex-row justify-start items-center px-[2rem] py-[0.5rem] border-x border-b ">
                        <span class="text-[0.8rem] w-[15rem]">{{ TipoMedioDePagoEnum[medio.tipoMedioDePago as keyof
                            typeof TipoMedioDePagoEnum]}}</span>
                        <span class="text-[0.8rem] w-[10rem]">$ {{ medio.importe.toFixed(2) }}</span>
                        <span class="text-[0.8rem] w-[10rem] ">{{ RedDePago[medio.redDePago as keyof typeof RedDePago]
                            }}</span>
                        <span class="text-[0.8rem] w-[10rem]">{{ medio.entidadBancaria }}</span>
                    </div>
                </div>
                <div class="w-full mt-8 ">
                    <h3 class="text-md font-bold">Observaciones</h3>
                    <span class="text-sm">{{ currentVenta?.observaciones?.trim().length>0  ? currentVenta.observaciones : "Sin observaciones" }}</span>
                </div>
            </div>
            <div class=" w-full min-h-[10rem] flex flex-col justify-start my-12 items-start">
                <div class="flex flex-row w-full mb-4 justify-between ">

                    <h3 class="page-subtitle">Comprobantes</h3>
                    <DropdownMenu v-if="currentVenta.factura">
                        <DropdownMenuTrigger><Button variant="outline" class="w-[14rem]">Emitir nuevo
                                comprobante</Button></DropdownMenuTrigger>
                        <DropdownMenuContent class="w-[14rem]">
                            <DropdownMenuLabel class="cursor-pointer"
                                @click="router.push(`/nota-credito/new?venta=${currentVenta.id}`)">Nueva nota
                                de crédito</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuLabel class="cursor-pointer"
                                @click="router.push(`/nota-debito/new?venta=${currentVenta.id}`)">Nueva nota
                                de débito</DropdownMenuLabel>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <div class="flex flex-col justify-start w-full ">
                    <div
                        class="w-full flex flex-row justify-start  items-start py-2 bg-secondary font-bold rounded-t-lg p-[0.75rem] px-8">
                        <span class="text-xs w-[9rem]">FECHA</span>
                        <span class="text-xs w-[12rem]">TIPO COMPROBANTE</span>
                        <span class="text-xs w-[15rem] ">NÚMERO COMPROBANTE</span>
                        <!-- <span class="text-xs w-[6rem] ">ENTIDAD BANCARIA</span> -->
                    </div>
                    <div class="border-x">
                    <div v-if="!currentVenta.factura"
                        class="h-[4rem] flex justify-start items-center py-2 px-8 border-b">
                        <span class=" text-sm w-[9rem]">Factura no emitida</span>
                        <Button variant="outline" @click="emitirFactura()" class="ml-7">
                           Emitir
                        </Button>
                    </div>
                    <div v-if="comprobantesVenta.length">
                        <div v-for="comprobante in comprobantesVenta"
                        class="h-[4rem] flex justify-start items-center py-2 px-8 border-b">
                        <span class=" text-md w-[8rem] ">{{ formatDate(comprobante.fechaEmision) }}</span>
                        <span class=" text-md mx-4 w-[11rem]">{{
                            tipoComprobanteDisplay(comprobante.tipoComprobante)?.nombre }} {{
                                tipoComprobanteDisplay(comprobante.tipoComprobante)?.letra }}</span>
                        <span class=" text-md font-thin w-[15rem]">{{ comprobante.numeroComprobante }}</span>
                        <div v-if="!loadingForm" class="actions">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger> <Button variant="ghost"> <PrinterIcon /></Button>  </DropdownMenuTrigger>
                                        <DropdownMenuContent class="w-[10rem] font-normal" >
                                            <DropdownMenuLabel class="cursor-pointer font-normal" @click="printComprobante(comprobante.id, comprobante.tipoComprobante, comprobante.fechaEmision, 0)"  >Imprimir original</DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuLabel class="cursor-pointer font-normal" @click="printComprobante(comprobante.id, comprobante.tipoComprobante, comprobante.fechaEmision, 1)" >Imprimir duplicado</DropdownMenuLabel>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                            <Button variant="ghost" @click="emailComprobante(comprobante.id)">
                                <MailIcon />
                            </Button>
                            <Button variant="ghost" v-if="![1, 6].includes(comprobante.tipoComprobante)" @click="router.push(`/nota-credito-debito/view/${comprobante.id}`)">
                                <InspectIcon />
                            </Button>
                        </div>
                        <div v-else>
                            <LoaderInline />
                        </div>
                    </div>
                </div>
                </div>
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
</template>

<style scoped>

.page div div{
    max-width: 80rem;
}

.linea-venta-header {
    display: grid;
    grid-template-columns: 0.6fr 2.5fr 1fr 1fr 1fr;
    font-weight: bold;
    text-align: center;
    padding: 0.75rem;
    width: 100%;
    font-size: 0.8rem;
}


.linea-venta-item {
    display: grid;
    grid-template-columns: 0.6fr 2.5fr 1fr 1fr 1fr;
    gap: 0.5rem;
    align-items: center;
    text-align: center;
    padding: 0.5rem 0.75rem;
    width: 100%;
    font-size: 0.8rem;
}

.linea-venta-item:last-child{
    border-radius: 0.5rem;
    background-color: aqua;
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

mr-4