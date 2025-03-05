<script setup lang="ts"> 
import { DetalleRecetaAereos } from '@/api/entities/detalleRecetaAereos';
import { Separator } from '@/components/ui/separator'


defineProps<{
    detalleReceta: DetalleRecetaAereos;
    title: string
}>();

</script>

<template>
    <div class="flex flex-row justify-start items-center">
        <h1 class="mr-12 text-2xl font-extrabold w-20 ">{{ title }}</h1>
        <div class="flex flex-col ">
            <div class="flex  h-10 items-center">
                <p class="font-bold w-20 text-lg">O.D.</p>

                <p class="font-bold w-12 text-right pr-4">Esf.: </p>
                <p class="w-10">{{Number(detalleReceta.od_esferico).toFixed(2)}}</p>
                <Separator orientation="vertical" class="mx-4" />

                <p class="font-bold w-12 text-right pr-4">Cil.:</p>
                <p class="w-10">{{Number(detalleReceta.od_cilindrico).toFixed(2)}}</p>
                <Separator orientation="vertical" class="mx-4 " />

                <p class="font-bold w-12 text-right pr-4">A:</p>
                <p class="w-10">{{ detalleReceta.od_grados }} °</p>
                <Separator orientation="vertical" class="mx-4 " />

                <p class=" font-bold w-12 text-center">DNP</p>
                <p class="w-12 text-center">{{detalleReceta.od_dnp}}</p>
            </div>

            <Separator class="my-4" />

            <div class="flex  h-10 items-center">
                <p class="font-bold w-20 text-lg">O.I.</p>

                <p class="font-bold w-12 text-right pr-4">Esf.:</p>
                <p class="w-10">{{Number(detalleReceta.oi_esferico).toFixed(2)}}</p>
                <Separator orientation="vertical" class="mx-4 " />


                <p class="font-bold w-12 text-right pr-4">Cil.:</p>
                <p class="w-10">{{Number(detalleReceta.oi_cilindrico).toFixed(2)}}</p>
                <Separator orientation="vertical" class="mx-4 " />

                <p class="font-bold w-12 text-right pr-4">A:</p>
                <p class="w-10">{{detalleReceta.oi_grados}} °</p>
                <Separator orientation="vertical" class="mx-4 " />

                <p class=" font-bold w-12 text-center">DNP</p>
                <p class="w-12 text-center">{{detalleReceta.oi_dnp}}</p>

            </div>
        </div>
        <Separator orientation="vertical" class="w-20" />
        <div class="pr-4">
            <p class=" font-bold w-12 text-center">DNP</p>
            <p class="w-12 text-center">{{detalleReceta.od_dnp}}</p>
        </div>

        <Separator orientation="vertical" class="w-14" />
        <div class="pr-4">
            <p class="font-bold w-12 text-center">Φ </p>
            <p class="w-12 text-center">{{detalleReceta.oi_dnp}}</p>
        </div>
    </div>

</template>