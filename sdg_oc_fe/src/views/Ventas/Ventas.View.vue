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

import Label from '@/components/ui/label/Label.vue';
import { TipoMedioDePagoEnum, RedDePago } from '@/api/entities/mediosDePago';
import { Venta } from '@/api/entities/venta';
import { ventasApi } from '@/api/libs/ventas';
import { useRoute } from 'vue-router';
import { condicionIvaDisplay } from '@/lib/utils';

const route = useRoute()
const currentVenta = ref<Venta>()

onMounted(async () => {
    const id = route.params.id?.toString();
    if(id){
        currentVenta.value = await ventasApi.getOne(id);
        currentVenta.value.fecha = new Date(currentVenta.value.fecha)
    }
    console.log(currentVenta.value)
});

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
                    <BreadcrumbPage>Nueva Venta</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
        <h1 class="page-title">Venta</h1>
            <div v-if="currentVenta" class=" w-full pt-6 rounded-lg h-[40rem] flex flex-row justify-between items-start ">
                <div class="rounded-lg h-full w-[55rem] flex flex-col justify-start items-start">
                    <div class="w-full flex flex-row items-center justify-start ">
                        <div class="w-[26rem] flex flex-col items-center justify-start">
                                <div class="flex  flex-row justify-start items-center w-full">
                                    <Label class="form-label w-[11rem] text-md font-bold ">Cliente: </Label>
                                    <Label class="form-label w-[15rem] text-md">{{ currentVenta?.cliente.apellido }}, {{ currentVenta?.cliente.nombre }}</Label>
                                </div>
                                <div class="flex  flex-row justify-start items-center w-full">
                                    <Label class="form-label w-[11rem] text-md font-bold">Condicion Fiscal: </Label>
                                    <!-- //TODO update por categFiscal de la venta -->
                                    <Label class="form-label w-[15rem] text-md">{{ condicionIvaDisplay(currentVenta.cliente.categoriaFiscal) }}</Label>
                                </div>
                                <div class="flex  flex-row justify-start items-center w-full">
                                    <Label class="form-label w-[11rem] text-md font-bold">Fecha: </Label>
                                    <Label class="form-label w-[15rem] text-md">{{ currentVenta?.fecha.toLocaleDateString('es-ES') }}</Label>
                                </div>
                        </div>
                        <div class=" flex flex-col items-center justify-end">
                            <div class="flex flex-col w-[6rem] h-[5rem] border justify-center items-center rounded-lg">
                                <span class="text-[1rem]">Factura</span>
                                <span class="text-[2rem] leading-[2rem] ">A</span>
                            </div>
                        </div>
                    </div>
                    <div class="flex flex-col w-full justify-start items-start mt-10">
                        <h3 class="page-subtitle">Detalle</h3>

                        <div class="linea-venta-header bg-secondary mt-4 rounded-t-lg">
                            <span>ID</span>
                            <span class="text-left">DESCRIPCIÓN</span>
                            <span>IMPORTE UNITARIO</span>
                            <span>CANTIDAD</span>
                            <span>IMPORTE TOTAL</span>
                            <span></span>
                        </div>

                        <div v-for="(linea, index) in currentVenta?.lineasDeVenta" :key="index" class="linea-venta-item border-x border-b">
                            <span class="text-center id-input">{{ linea.producto.id }}</span>
                            <span class="text-left descripcion-input">{{ linea.producto.descripcion }}</span>
                            <span class="text-center">$ {{ linea.precioIndividual.toFixed(2) }}</span>
                            <span class="text-center">{{ linea.cantidad }}</span>
                            <span class="text-center">$ {{ (linea.cantidad*linea.precioIndividual).toFixed(2) }}</span>
                        </div>

                

                        
                        <div class="w-full min-h-[9rem] flex flex-row justify-between items-start mt-10">
                            <div class="w-[30rem] rounded-lg border p-4  flex flex-col justify-start  items-start">

                                <div class="rounded-lg w-[28rem] min-h-[4rem]">
                                    <h3 class="text-md font-bold ">Obras Sociales</h3>
                                    <span v-if="currentVenta.ventaObraSocial.length==0" class="text-sm">No aplica</span>
                                    <div v-else v-for="vos in currentVenta.ventaObraSocial" class="w-full flex flex-row justify-start my-2 items-center ">
                                            <span class="text-sm w-[12rem]">{{ vos.obraSocial.nombre }}</span>
                                            <span class="text-sm w-[7rem]">$ {{ vos.importe.toFixed(2) }}</span>
                                            <span class="text-sm">{{ condicionIvaDisplay(vos.condicionIva) }}</span>
                                    </div>
                                </div>
                                <div class="rounded-lg w-full min-h-[3rem] ">
                                    <h3 class="text-md font-bold ">Descuento</h3>
                                    <span v-if="!currentVenta.descuentoPorcentaje" class="text-sm">No aplica</span>
                                    <span v-else class="text-sm w-[12rem]">Dto Aplicado: {{ currentVenta.descuentoPorcentaje }} %</span>
                                </div>

                            </div>
                            <div v-if="currentVenta" class="w-[19rem] h-[9rem] rounded-lg bg-secondary px-4 flex flex-col items-center justify-center">
                                <div v-if="currentVenta.ventaObraSocial.length>0 || currentVenta.descuentoPorcentaje" class=" flex  justify-center">
                                    <Label class=" w-[9rem] text-right mr-4">Importe Total: </Label>
                                    <Label class=" w-[7rem]">$ {{ totalVentaBruto?.toFixed(2) }}</Label>
                                </div>
                                <div v-if="currentVenta.ventaObraSocial.length > 0" class=" flex  justify-center items-center mt-4">
                                    <Label class=" w-[9rem] text-right mr-4">Obras Sociales: </Label>
                                    <Label class=" w-[7rem]  ">- $ {{ montoObrasSociales?.toFixed(2) }}</Label>
                                </div>
                                <div v-if="currentVenta.descuentoPorcentaje" class=" flex  justify-center items-center mt-4">
                                    <Label class=" w-[9rem] text-right mr-4">Descuento: </Label>
                                    <Label class=" w-[7rem] ">- $ {{ montoDto.toFixed(2) }}</Label>
                                </div>
                                <div class=" flex  justify-center mt-4">
                                    <Label class="page-subtitle w-[9rem] text-right mr-4">Importe Final: </Label>
                                    <Label class="page-subtitle  w-[7rem] ">$ {{ caluclateImportePago.toFixed(2) }}</Label>
                                </div>
                            </div>
                        </div> 
                    </div>   
                        <div class="mt-6 w-full">
                            <div class="w-full flex flex-row justify-start  items-start py-2 bg-secondary font-bold rounded-t-lg p-[0.75rem] px-[2rem]">
                                <span class="text-[0.8rem] w-[15rem]">MEDIO DE PAGO</span>
                                <span class="text-[0.8rem] w-[10rem]">IMPORTE</span>
                                <span class="text-[0.8rem] w-[10rem] ">RED DE PAGO</span>
                                <span class="text-[0.8rem] w-[10rem] ">ENTIDAD BANCARIA</span>
                            </div>
                            <div  v-for="medio in currentVenta.mediosDePago" class="w-full flex flex-row justify-start items-center px-[2rem] py-[0.5rem] border-x border-b ">
                                <span class="text-[0.8rem] w-[15rem]">{{ TipoMedioDePagoEnum[medio.tipoMedioDePago as keyof typeof TipoMedioDePagoEnum]}}</span>
                                <span class="text-[0.8rem] w-[10rem]">$ {{ medio.importe.toFixed(2) }}</span>
                                <span class="text-[0.8rem] w-[10rem] ">{{ RedDePago[medio.redDePago as keyof typeof RedDePago] }}</span>
                                <span class="text-[0.8rem] w-[10rem]">{{ medio.entidadBancaria }}</span>
                            </div>
                        </div>
                    <div class="w-full mt-8 ">
                        <h3 class="text-md font-bold">Observaciones</h3>
                        <span class="text-sm">{{ currentVenta?.observaciones ?? "---" }}</span>
                    </div>
                </div>
                <div class=" w-[21rem] rounded-lg border h-full flex flex-col justify-start p-4 items-start">
                        <h3 class="text-md mb-4 font-bold">Comprobantes</h3>
                    <p> ACA TIENE QUE IR LA LISTA DE TODOS LOS COMPROBANTES ASOCIADOS A LA VENTA</p>
                </div>
        </div>
    </div>
</template>

<style scoped>

.page div div{
    max-width: 80rem;
}

.linea-venta-header {
    display: grid;
    grid-template-columns: 0.5fr 2.5fr 1fr 1fr 1fr;
    font-weight: bold;
    text-align: center;
    padding: 0.75rem;
    width: 100%;
    font-size: 0.8rem; 
}


.linea-venta-item {
    display: grid;
    grid-template-columns: 0.5fr 2.5fr 1fr 1fr 1fr;
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

