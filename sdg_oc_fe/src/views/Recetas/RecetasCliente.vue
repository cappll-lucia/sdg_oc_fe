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
import { computed, onMounted, ref} from 'vue';
import ListadoRecetasRecetados from '@/components/ListadoRecetasRecetados.vue'
import ListadoRecetasContacto from '@/components/ListadoRecetasContacto.vue';
import { Cliente } from '@/api/entities/clientes';
import { RecetasAereos } from '@/api/entities/recetasAereos';
import { useRoute } from 'vue-router';
import { clientesApi } from '@/api/libs/clientes';
import { HistoriaClinica } from '@/api/entities/historiaClinica';
import { RecetaContacto } from '@/api/entities/recetasContacto';

const route = useRoute()
const currentCliente = ref<Cliente>();
const recetasClienteAereos = ref<RecetasAereos[]>();
const recetasClienteContacto = ref<RecetaContacto[]>();
const historiaClinicaCliente = ref<HistoriaClinica>()
onMounted(async()=>{

    currentCliente.value = await clientesApi.getOne(Number(route.params.idCliente))
    if(currentCliente){

        const res = await clientesApi.getRecetasByCliente(currentCliente.value.id);
        recetasClienteAereos.value = res.recetasLentesAereos;
        recetasClienteContacto.value = res.recetasLentesContacto;
        historiaClinicaCliente.value = res.historiaClinicaContacto;
    }
})

const nombreCliente = computed(()=> currentCliente.value?.apellido +", "+currentCliente.value?.nombre)

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
                    <ListadoRecetasRecetados v-if="recetasClienteAereos && recetasClienteAereos.length>0 " :recetas="recetasClienteAereos" :nombreCliente="nombreCliente" />
                    <h2 v-else>El cliente no tiene recetas registradas para anteojos recetados </h2>
                </TabsContent>
                <TabsContent class="bg-secondary h-[75rem] px-2 py-6 rounded" value="contacto">
                    <ListadoRecetasContacto v-if="recetasClienteContacto && recetasClienteContacto.length > 0" :nombreCliente="nombreCliente" :recetas="recetasClienteContacto" :historiaClinica="historiaClinicaCliente" />
                    <h2 v-else>El cliente no tiene recetas registradas para lentes de contato </h2>
                </TabsContent>
            </Tabs>
        </div>
    </div>



</template>