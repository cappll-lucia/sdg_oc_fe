<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-vue-next';
import { router } from '@/router/index';
import { Venta } from '@/api/entities/venta';
import { useLoaderStore } from '@/stores/LoaderStore';
import { comprobantesApi } from '@/api/libs/comprobantes';
import { toast } from '@/components/ui/toast';
import { ref } from 'vue';
import AlertError from '@/components/AlertError.vue';
import { tipoFactura } from '@/lib/utils';

const loader = useLoaderStore();

const props = defineProps<{
    venta: Venta;
    onRefetch: ()=> void;
}>();


const showError = ref<boolean>(false);
const errorMessage =ref<string>('');

const handleEmitFactura = async()=>{
    try{
        loader.show();
        if(props.venta){
            const newFactura ={
                importeTotal: props.venta?.importe,
                tipoComprobante: tipoFactura(Number(props.venta?.cliente.categoriaFiscal)),
                motivo: props.venta?.observaciones,
                condicionIvaCliente: Number(props.venta?.cliente.categoriaFiscal),
                transaccionRelacionadaId: {id: props.venta.id}
            }
            const factura = await comprobantesApi.create(newFactura);
            props.venta.factura=factura;
            await props.onRefetch?.();
            loader.hide();
            toast({
                title: 'Factura emitida',
            })
        }
    }catch (err: any) {
        errorMessage.value =err.message 
        showError.value = true;
        loader.hide();
    }
}



</script>


<template>
    <DropdownMenu>
        <DropdownMenuTrigger as-child>
            <Button variant="ghost" class="w-8 h-8 p-0">
                <span class="sr-only">Opciones</span>
                <MoreHorizontal class="w-4 h-4" />
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
            <DropdownMenuItem @click="()=>router.push(`/ventas/view/${venta.id}`)">Ver detalle</DropdownMenuItem>
            <DropdownMenuItem v-if="!venta.factura" @click="handleEmitFactura">Emitir factura</DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>

    <AlertError
        v-model="showError"
        title="Error"
        :message="errorMessage"
        button="Aceptar"
        :action="()=>{showError=false}"
        />
</template>