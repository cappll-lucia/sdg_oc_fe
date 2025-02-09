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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { clientesConReceta } from '@/api/data/clientesConRecetas'
import type { ClienteConReceta } from '@/api/entities';
import { computed, onMounted, ref} from 'vue';
import { useRoute } from 'vue-router';
import ListadoRecetasRecetados from '@/components/ListadoRecetasRecetados.vue'
import ListadoRecetasContacto from '@/components/ListadoRecetasContacto.vue';

const route = useRoute()
const cliente = ref<undefined | ClienteConReceta>(undefined);

onMounted(()=>{
    cliente.value = clientesConReceta.find((cliente) => cliente.id == Number(route.params.idCliente))
})

const nombreCliente = computed(()=> cliente.value?.apellido +", "+cliente.value?.nombre)

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
                    <BreadcrumbPage>Recetas</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
        <h1 class="page-title ">Recetas: {{ nombreCliente }}</h1>
        <div class="pt-2">
            // TODO inicializar en tab recetados
            <Tabs default-value="contacto" class="w-[100%]">
                <TabsList class="w-[100%]">
                    <TabsTrigger class="w-[50%]" value="recetados">
                        Anteojos Recetados
                    </TabsTrigger>
                    <TabsTrigger class="w-[50%]" value="contacto">
                        Lentes De Contacto
                    </TabsTrigger>
                </TabsList>
                <TabsContent class="bg-secondary h-[40rem] px-2 py-6 rounded" value="recetados">
                    <ListadoRecetasRecetados v-if="cliente?.recetasRecetados" :recetas="cliente.recetasRecetados" :nombreCliente="nombreCliente" />
                    <h2 v-else>El cliente no tiene recetas registradas para anteojos recetados </h2>
                </TabsContent>
                <TabsContent class="bg-secondary h-[60rem] px-2 py-6 rounded" value="contacto">
                    <ListadoRecetasContacto v-if="cliente?.recetasContacto && cliente.recetasContacto.length > 0" :recetas="cliente.recetasContacto" :historiaClinica="cliente.historiaClinicaContacto" />
                    <h2 v-else>El cliente no tiene recetas registradas para lentes de contato </h2>
                </TabsContent>
            </Tabs>
        </div>
    </div>



</template>