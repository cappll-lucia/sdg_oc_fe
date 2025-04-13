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
import {  onMounted, ref } from 'vue';

import { Comprobante } from '@/api/entities/comprobante';
import Label from '@/components/ui/label/Label.vue';
import { condicionIvaDisplay, tipoComprobanteDisplay } from '@/lib/utils';
import { comprobantesApi } from '@/api/libs/comprobantes';
import { useRoute } from 'vue-router';
import { formatDate } from '@/lib/utils.recetas';
import router from '@/router';
import Button from '@/components/ui/button/Button.vue';

const route = useRoute()
const currentComprobante = ref<Comprobante>();



onMounted(async()=>{
    if (typeof route.params.id === 'string') {
        currentComprobante.value = await comprobantesApi.getOne(route.params.id);
    }
})

const printComprobante = async(_id: string)=>{
    try {
        const resp = await comprobantesApi.print(_id);
        const bufferData = resp.data;
        const uint8Array = new Uint8Array(bufferData);
        const pdfBlob = new Blob([uint8Array], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(pdfBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = currentComprobante.value 
            ? `${currentComprobante.value.facturaRelacionada.venta.cliente.apellido}_${tipoComprobanteDisplay(currentComprobante.value.tipoComprobante)?.nombre}_${currentComprobante.value.fechaEmision.toString().split('T')[0]}.pdf`
            : 'comprobante.pdf';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    } catch (error) {
        console.error('Error al descargar el PDF:', error);
    }
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
                    <BreadcrumbPage>Notas de Crédito y Débito</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
        <h1 v-if="currentComprobante" class="page-title">{{tipoComprobanteDisplay(currentComprobante?.tipoComprobante)?.nombre}}</h1>
        <h1 v-else class="page-title">Notas de Crédito y Débito</h1>
        <div class="pt-2">
            <div v-if="currentComprobante" class="flex flex-row justify-between items-center py-4 ">
                <div class="rounded-[0.5rem] w-[55rem] h-auto flex flex-col justify-start items-start">
                    <div class="flex flex-col sm:flex-row sm:justify-between w-full items-center border rounded-lg p-8">
                        <div class="h-[10rem] w-full flex flex-row items-center justify-start ">
                            <div class=" w-[40rem]  flex flex-col items-center justify-start">
                                <div class="flex h-14  flex-row justify-start items-center w-full">
                                    <Label class="form-label w-[12rem]  h-10  pt-2 text-lg">Cliente</Label>
                                    <Label class="form-label w-[12rem]  h-10  pt-2 text-lg">{{currentComprobante.facturaRelacionada.venta.cliente.apellido}}, {{ currentComprobante.facturaRelacionada.venta.cliente.nombre }}</Label>
                                </div>
                                <div class="flex h-14  flex-row justify-start items-center w-full">
                                    <Label class="form-label w-[12rem]  h-10 mt-6 text-md">Factura Relacionada</Label>
                                    <Label class="form-label w-[12rem]  h-10 mt-6 text-md">{{currentComprobante.facturaRelacionada.numeroComprobante}}</Label>
                                </div>
                                <div class="flex h-14 flex-row justify-start items-center w-full">
                                    <Label class="form-label w-[12rem]  h-10 pt-3 text-md">Condición Fiscal</Label>
                                    <Label class="form-label w-[15rem]  h-10 mt-6 text-md">{{condicionIvaDisplay(currentComprobante.condicionIvaCliente)}}</Label>
                                </div>
                            </div>
                            <div class="date w-auto sm:w-[10rem] h-[8rem] text-center flex flex-col justify-between items-center">
                                <div class="flex flex-col w-[8rem] h-[6rem] border justify-center items-center rounded-lg">
                                    <span class="text-sm">{{tipoComprobanteDisplay(currentComprobante.tipoComprobante)?.nombre}}</span>
                                    <span class="text-[3rem] leading-[3rem] ">{{ tipoComprobanteDisplay(currentComprobante.tipoComprobante)?.letra }}</span>
                                </div>
                                <Label class="text-[1rem]">Fecha: {{ formatDate(currentComprobante.fechaEmision) }}</Label>
                            </div>
                        </div> 
                    </div>
                    <div class="flex flex-col justify-start items-start w-full mt-8 border rounded-lg p-8">
                        <div class=" flex flex-row w-[30rem] p-4 bg-secondary rounded-lg justify-start items-center my-4">
                            <Label class="w-[12rem] text-sm">Importe Factura Original</Label>
                            <Label class="text-md w-[1rem] mr-[1rem]">$</Label>
                            <Label class="text-md w-[6rem]">{{currentComprobante.facturaRelacionada.importeTotal}}</Label>
                           
                        </div>
                        <div class=" flex flex-row w-[40rem] justify-start items-center my-4">
                            <Label class="w-[13rem] text-md">Concepto emisión</Label>
                            <Label class="w-[20rem] text-md">{{currentComprobante.motivo}}</Label>
                        </div>
                        <div class=" flex flex-row w-[40rem] justify-start items-center my-4">
                            <Label class="w-[13rem] text-md">Importe</Label>
                            <Label class="text-md w-[1rem] mr-[1rem]">$</Label>
                            <Label class="text-md w-[15rem] mr-[1rem]">{{currentComprobante.importeTotal}}</Label>
                        </div>
                    </div>
                    <div class="w-full flex justify-end mt-4">
                        <Button variant="outline" class="w-[10rem] mr-5" @click="router.push('/ventas')">Volver</Button>
                        <Button type="submit" class="w-[10rem]" @click="printComprobante(currentComprobante.id)" >Imprimir</Button>
                    </div>
                </div>
            </div>
            <div v-else class="flex flex-row justify-between items-center py-4 ">
                <span>Error al cargar el comprobante</span>
            </div>
        </div>
    </div>
</template>