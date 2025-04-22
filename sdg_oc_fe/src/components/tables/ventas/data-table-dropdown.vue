<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-vue-next';
import { router } from '@/router/index';
import { CondicionIva, Venta } from '@/api/entities/venta';
import { useLoaderStore } from '@/stores/LoaderStore';
import { TipoComprobante } from '@/api/entities/comprobante';
import { comprobantesApi } from '@/api/libs/comprobantes';
import { toast } from '@/components/ui/toast';
import { ErrorMessage } from 'vee-validate';
import { ref } from 'vue';
import AlertError from '@/components/AlertError.vue';

const loader = useLoaderStore();

const props = defineProps<{
    venta: Venta
}>()


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
            loader.hide();
            toast({
                title: 'Factura emitida',
            })
        }
    }catch (err: any) {
        ErrorMessage.value = 'Ocurrió un error al emitir la factura'
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