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
import Button from '@/components/ui/button/Button.vue';
import { router } from '@/router';
import { useLoaderStore } from '@/stores/LoaderStore';
import AlertError from '@/components/AlertError.vue';

const route = useRoute();
const loader = useLoaderStore();

const currentCliente = ref<Cliente>();
const recetasClienteAereos = ref<RecetasAereos[]>();
const recetasClienteContacto = ref<RecetaContacto[]>();
const historiaClinicaCliente = ref<HistoriaClinica>();

const showError = ref<boolean>(false);
const errorMessage =ref<string>('');

onMounted(async()=>{
    await loadData();
})

const loadData = async ()=>{
    try{
        loader.show();
        const id = Number(route.params.idCliente);
        if(id==0){
            loader.hide();
            return;
        }
        currentCliente.value = await clientesApi.getOne(id)
        if(currentCliente){
            const res = await clientesApi.getRecetasByCliente(currentCliente.value.id);
            recetasClienteAereos.value = res.recetasLentesAereos;
            recetasClienteContacto.value = res.recetasLentesContacto;
            historiaClinicaCliente.value = res.historiaClinicaContacto;
        }
        loader.hide();
    }catch(err: any){
        errorMessage.value=err.message as string
        showError.value = true;
        loader.hide();
    }
}

const nombreCliente = computed(()=> currentCliente.value?.apellido +", "+currentCliente.value?.nombre)

</script>


<template>
    <div class="page" v-if="currentCliente">
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
                    <BreadcrumbLink href="/clientes">
                        Clientes
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                    <SlashIcon />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                    <BreadcrumbLink :href="`/clientes/dashboard/${currentCliente?.id}`">
                        {{nombreCliente}}
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
        <div class=" flex flex-row justify-between w-full mb-4">
            <h1 class="page-title ">Recetas: {{ nombreCliente }} </h1>
            <div>
                <Button class="text-xs mr-2 " @click="router.push(`/recetas/recetados/new?cliente=${currentCliente?.id}`)" >Nueva Receta Anteojos Recetados </Button>
                <Button class="text-xs" @click="router.push(`/recetas/contacto/new?cliente=${currentCliente?.id}`)" >Nueva Receta Lentes de Contacto </Button>
            </div>
        </div>
        <div class="pt-2">
            <Tabs default-value="recetados" class="w-[100%]">
                <TabsList class="w-[100%]">
                    <TabsTrigger class="w-[50%]" value="recetados">
                        Anteojos Recetados
                    </TabsTrigger>
                    <TabsTrigger class="w-[50%]" value="contacto">
                        Lentes De Contacto
                    </TabsTrigger>
                </TabsList>
                <TabsContent class="bg-secondary min-h-[40rem] px-2 py-6 rounded" value="recetados">
                    <ListadoRecetasRecetados v-if="recetasClienteAereos && recetasClienteAereos.length>0 " :recetas="recetasClienteAereos" :nombreCliente="nombreCliente" :id-cliente="Number(currentCliente?.id)" />
                    <div v-else class="flex min-h-[20rem] flex-col w-100 justify-center items-center">
                        <h2 class="text-lg mb-8">El cliente no tiene recetas registradas para <span class="font-bold">anteojos recetados </span> </h2>
                        <Button @click="router.push(`/recetas/recetados/new?cliente=${currentCliente?.id}`)"> Registrar receta </Button>
                    </div>
                </TabsContent>
                <TabsContent class="bg-secondary h-[75rem] px-2 py-6 rounded" value="contacto">
                    <ListadoRecetasContacto v-if="recetasClienteContacto && recetasClienteContacto.length > 0" :nombreCliente="nombreCliente"  :id-cliente="Number(currentCliente?.id)" :recetas="recetasClienteContacto" :historiaClinica="historiaClinicaCliente" />
                    <div v-else class="flex min-h-[20rem] flex-col w-100 justify-center items-center">
                        <h2 class="text-lg mb-8">El cliente no tiene recetas registradas para <span class="font-bold">lentes de contacto </span> </h2>
                        <Button @click="router.push(`/recetas/contacto/new?cliente=${currentCliente?.id}`)"> Registrar receta </Button>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    </div>
    <div class="page" v-else>
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
                    <BreadcrumbLink href="/clientes">
                        Clientes
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
        <div class="pt-2 mb-4 " >
            <div  class="flex flex-col justify-between items-start px-[5rem] ">
                <div class="w-full ">
                    <h3 class="page-subtitle text-center">Cliente con id={{ route.params.idCliente }} no encontrado</h3>
                </div>
            </div>
        </div>
    </div>
    <AlertError v-model="showError" title="Error" :message="errorMessage" button="Aceptar"
            :action="()=>{showError=false}" />
</template>