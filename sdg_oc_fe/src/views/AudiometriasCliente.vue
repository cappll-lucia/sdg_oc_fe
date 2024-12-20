<script lang="ts" setup>
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { SlashIcon } from '@radix-icons/vue';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { ChevronRightIcon } from '@radix-icons/vue';
import { onMounted, ref } from 'vue';
import { Audiometria, ClienteConAudiometria } from '@/api/entities';
import { clientesConAudiometria } from '@/api/data/clientesConAudiometria';
import { useRoute } from 'vue-router';

const route = useRoute();
const cliente = ref<undefined | ClienteConAudiometria>(undefined);
const selectedAudiom = ref<undefined | Audiometria>();


onMounted(() => {
    cliente.value = clientesConAudiometria.find((cliente) => cliente.id == Number(route.params.idCliente));
    selectedAudiom.value = cliente.value?.audiometrias[0];
})




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
                    <BreadcrumbLink href="/recetas">
                        Recetas
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                    <SlashIcon />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                    <BreadcrumbPage>Audiometrías</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
        <h1 class="page-title ">Informes de Audiometría: {{cliente?.apellido}}, {{ cliente?.nombre }}</h1>
        <div class="pt-2">
            <div class="panel w-[100%] flex flew-row h-[100%] rounded bg-secondary p-4"
                v-if="cliente && cliente.audiometrias && cliente.audiometrias.length > 0">
                <div class="panel-index w-[23%] h-[100%] p-4">
                    <div v-for="audiom in cliente?.audiometrias || []" :key="audiom.id" class="mr-4">
                        <div class="panel-inde-item px-2 py-6 h-16 flex flex-row justify-between items-center rounded-sm"
                            :class="{ 'bg-[#d7e5ec]': selectedAudiom === audiom }">
                            <p class="font-light text-sm ">{{ audiom.id }}</p>
                            <div class="flex-col  w-[50%]">
                                <p class="font-bold ">{{ audiom.fechaInforme.toISOString().split("T")[0] }}</p>
                                <p class="font-light  ">Audiometría</p>
                            </div>
                            <Button variant="outline" size="icon" class="bg-transparent hover:bg-[#d7e5ec]"
                                @click="() => { selectedAudiom = audiom; console.log(selectedAudiom); }">
                                <ChevronRightIcon class="w-4 h-4" />
                            </Button>
                        </div>
                        <Separator class="my-2" />
                    </div>
                </div>
                <Separator orientation="vertical" />
                <div class="view w-[75%] h-[100%] p-4">
                    <div class="w-full h-screen flex flex-col items-start justify-start">
                        <div class="datos flex flex-col" v-if="selectedAudiom">
                            <div class="flex flex-row justify-between">
                                <div class="flex flex-col ">
                                    <span class="text-lg font-bold w-[14rem]">Fecha Informe: </span>
                                    <span>{{ selectedAudiom.fechaInforme.toISOString().split("T")[0] }}</span>
                                </div>
                                <div class="flex flex-col ">
                                    <span class="text-lg font-bold">Observaciones: </span>
                                    <span>{{ selectedAudiom.observaciones ?? '---'}}</span>
                                </div>
                            </div>
                        </div>
                        <Separator class="my-8" />

                        <div class="w-[100%] h-[calc(100%-5rem)] flex justify-center items-center">
                            <div v-if="selectedAudiom" class="w-[95%] h-[100%] border rounded-lg overflow-hidden">
                                <iframe :src="selectedAudiom.pdfUrl" class="w-full h-full border-none" frameborder="0"
                                    allowfullscreen></iframe>
                            </div>
                            <p v-else class="text-gray-500">No hay PDF Registrado.</p>
                        </div>
                    </div>
                </div>

            </div>

            <div v-else>
                <h1>No hay audiometrias registradas</h1>
            </div>
        </div>
    </div>
</template>


<style scoped>
/* Add some basic styles for better aesthetics */
iframe {
    background-color: #fff;
}
</style>
