<script setup lang="ts"> 

import type { DetalleRecetaAereos } from '@/api/entities/entities';
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
                <p class="w-10">{{detalleReceta.odEsferico.toFixed(2)}}</p>
                <Separator orientation="vertical" class="mx-4" />

                <p class="font-bold w-12 text-right pr-4">Cil.:</p>
                <p class="w-10">{{detalleReceta.odCilindrico.toFixed(2)}}</p>
                <Separator orientation="vertical" class="mx-4 " />

                <p class="font-bold w-12 text-right pr-4">A:</p>
                <p class="w-10">{{ detalleReceta.odGrados }} °</p>
            </div>

            <Separator class="my-4" />

            <div class="flex  h-10 items-center">
                <p class="font-bold w-20 text-lg">O.I.</p>

                <p class="font-bold w-12 text-right pr-4">Esf.:</p>
                <p class="w-10">{{detalleReceta.oiEsferico.toFixed(2)}}</p>
                <Separator orientation="vertical" class="mx-4 " />


                <p class="font-bold w-12 text-right pr-4">Cil.:</p>
                <p class="w-10">{{detalleReceta.oiCilindrico.toFixed(2)}}</p>
                <Separator orientation="vertical" class="mx-4 " />

                <p class="font-bold w-12 text-right pr-4">A:</p>
                <p class="w-10">{{detalleReceta.oiGrados}} °</p>
                <Separator orientation="vertical" class="mx-4 " />

                <p class=" font-bold w-12 text-center">DNP</p>
                <p class="w-12 text-center">{{detalleReceta.odDnp}}</p>

            </div>
        </div>
        <Separator orientation="vertical" class="w-20" />
        <div class="pr-4">
            <p class=" font-bold w-12 text-center">DNP</p>
            <p class="w-12 text-center">{{detalleReceta.odDnp}}</p>
        </div>

        <Separator orientation="vertical" class="w-14" />
        <div class="pr-4">
            <p class="font-bold w-12 text-center">Φ </p>
            <p class="w-12 text-center">{{detalleReceta.oiDnp}}</p>
        </div>
    </div>

</template>