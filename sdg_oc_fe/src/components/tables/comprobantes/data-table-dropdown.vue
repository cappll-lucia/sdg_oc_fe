<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-vue-next';
import router from '@/router/index';
import { Comprobante } from '@/api/entities/comprobante';


defineProps<{
    comprobante: Comprobante
}>()


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
            <DropdownMenuItem v-if="[1,6].includes(comprobante.tipoComprobante)" @click="()=>router.push(`/ventas/view/${comprobante.venta.id}`)">Ver Detalle</DropdownMenuItem>
            <DropdownMenuItem v-if="[2,3,7,8].includes(comprobante.tipoComprobante)" @click="()=>router.push(`/nota-credito-debito/view/${comprobante.id}`)">Ver Detalle</DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
</template>