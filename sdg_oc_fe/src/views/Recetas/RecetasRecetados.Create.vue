<script setup lang="ts">
import { Cliente } from '@/api/entities/clientes';
import { createDetalleAereosCustomValidator } from '@/api/entities/detalleRecetaAereos';
import { ColorCristal, TipoCristal, TipoReceta, TratamientoCristal, createRecetaAereosCustomValidator } from '@/api/entities/recetasAereos';
import { clientesApi } from '@/api/libs/clientes';
import { recetasApi } from '@/api/libs/recetas';
import SelectClienteDialog from '@/components/SelectClienteDialog.vue';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button'
import Input from '@/components/ui/input/Input.vue';
import Label from '@/components/ui/label/Label.vue';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import Textarea from '@/components/ui/textarea/Textarea.vue';
import { toast } from '@/components/ui/toast';
import { previousRoute, router } from '@/router';
import { SlashIcon, AsteriskIcon} from 'lucide-vue-next';
import { computed, onMounted, ref} from 'vue';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'
import AlertError from '@/components/AlertError.vue';
import { useRoute } from 'vue-router';
import { useLoaderStore } from '@/stores/LoaderStore';

const route = useRoute();
const loader = useLoaderStore();


const selectedCliente = ref<Cliente | null>(null);
const searchClienteOpen = ref<boolean>(false);

const showError = ref<boolean>(false);
const errorMessage =ref<string>('');


const newReceta = ref<{
    tipoReceta: TipoReceta,
    oftalmologo:undefined | string,
    cristal:undefined | TipoCristal,
    color:undefined | ColorCristal,
    tratamiento:undefined | TratamientoCristal,
    armazon:undefined | string,
    observaciones:undefined | string,
    fecha: Date | undefined,
    cliente: {
        id: undefined | number
    },
}>({
    tipoReceta: TipoReceta.Lejos,
    oftalmologo:undefined,
    cristal:undefined,
    color:undefined,
    armazon:undefined,
    tratamiento:undefined,
    observaciones: undefined,
    fecha: undefined,
    cliente: {
        id: undefined
    },
})
const currentDetalleCerca = ref<{
    tipo_detalle: TipoReceta,
    od_esferico: number | undefined ,
    od_cilindrico: number | undefined ,
    od_grados: number | undefined ,
    oi_esferico: number | undefined ,
    oi_cilindrico: number | undefined ,
    oi_grados: number | undefined ,
    dnp: number | undefined ,
}>({
    tipo_detalle: TipoReceta.Cerca,
    od_esferico:undefined ,
    od_cilindrico:undefined ,
    od_grados:undefined ,
    oi_esferico:undefined ,
    oi_cilindrico:undefined ,
    oi_grados:undefined ,
    dnp:undefined ,
})
const currentDetalleLejos = ref<{
    tipo_detalle: TipoReceta,
    od_esferico: number | undefined ,
    od_cilindrico: number | undefined ,
    od_grados: number | undefined ,
    oi_esferico: number | undefined ,
    oi_cilindrico: number | undefined ,
    oi_grados: number | undefined ,
    dnp: number | undefined ,
}>({
    tipo_detalle: TipoReceta.Lejos,
    od_esferico:undefined ,
    od_cilindrico:undefined ,
    od_grados:undefined ,
    oi_esferico:undefined ,
    oi_cilindrico:undefined ,
    oi_grados:undefined ,
    dnp:undefined ,
})


const isValidReceta = ref<{
    tipoReceta: boolean,
    oftalmologo: boolean,
    cristal: boolean,
    color: boolean,
    tratamiento: boolean,
    fecha: boolean,
    cliente: boolean,
}>({
    tipoReceta: true,
    oftalmologo: true,
    cristal: true,
    color: true,
    tratamiento: true,
    fecha: true,
    cliente: true,
})


const isValidDetalleCerca = ref<{
    tipo_detalle: boolean,
    od_esferico: boolean,
    od_cilindrico: boolean,
    od_grados: boolean,
    oi_esferico: boolean,
    oi_cilindrico: boolean,
    oi_grados: boolean,
    dnp: boolean,
}>({
    tipo_detalle: true,
    od_esferico: true,
    od_cilindrico: true,
    od_grados: true,
    oi_esferico: true,
    oi_cilindrico: true,
    oi_grados: true,
    dnp: true,
})

const isValidDetalleLejos = ref<{
    tipo_detalle: boolean,
    od_esferico: boolean,
    od_cilindrico: boolean,
    od_grados: boolean,
    oi_esferico: boolean,
    oi_cilindrico: boolean,
    oi_grados: boolean,
    dnp: boolean,
}>({
    tipo_detalle: true,
    od_esferico: true,
    od_cilindrico: true,
    od_grados: true,
    oi_esferico: true,
    oi_cilindrico: true,
    oi_grados: true,
    dnp: true,
})

const fechaReceta = ref({
    day:'',
    month:'',
    year:'',
})


onMounted(async()=>{
    try{
        loader.show();
        const query = route.query
        if(query.cliente){
            const foundCliente = await clientesApi.getOne(Number(query.cliente))
            if(foundCliente) handleSelectCliente(foundCliente)
        }
        loader.hide();
    }catch(err: any){
        errorMessage.value=err.message as string
        showError.value = true;
        loader.hide();
    }
})

const onSubmit = async()=>{
    try {
        loader.show();
        let newRecetaObj 
        switch(newReceta.value.tipoReceta){
            case TipoReceta.Lejos:
                newRecetaObj={...newReceta.value, detallesRecetaLentesAereos: [currentDetalleLejos.value] }
                break;
            case TipoReceta.Cerca:
                newRecetaObj={...newReceta.value, detallesRecetaLentesAereos: [currentDetalleCerca.value] }
                break;
            case TipoReceta.Multifocal:
                newRecetaObj={...newReceta.value, detallesRecetaLentesAereos: [currentDetalleCerca.value, currentDetalleLejos.value] }
                break;
        }
        newRecetaObj.fecha = new Date(parseInt(fechaReceta.value.year), parseInt(fechaReceta.value.month)-1, parseInt(fechaReceta.value.day))
        const createdReceta = await recetasApi.createRecetaAereos(newRecetaObj);
        loader.hide();
        toast({
            title: 'Receta registrada con éxito',
        })
        router.push(`/recetas/${newReceta.value.cliente.id}?tab=recetados&recetaId=${createdReceta.id}`)
    } catch (err: any) {
        errorMessage.value=err.message as string
        showError.value = true;
        loader.hide();
    };
}


const handleSelectCliente = (cliente:Cliente)=>{
    selectedCliente.value=cliente;
    newReceta.value.cliente.id=cliente.id;
    searchClienteOpen.value=false;
}

const validateAndSubmit = async()=>{
    loader.show();
    const validDetalle = validateDetalles()
    const resultReceta = createRecetaAereosCustomValidator(newReceta.value, fechaReceta.value);
    isValidReceta.value = resultReceta.isValid
    if(validDetalle && resultReceta.success){
        await onSubmit();
    }
    loader.hide();
}

const validateDetalles = ()=>{
    let resultCerca, resultLejos
    switch(newReceta.value.tipoReceta){
        case TipoReceta.Cerca:
            resultCerca = createDetalleAereosCustomValidator(currentDetalleCerca.value)
            isValidDetalleCerca.value = resultCerca.isValid
            return resultCerca.isValid
        case TipoReceta.Lejos:
            resultLejos = createDetalleAereosCustomValidator(currentDetalleLejos.value)
            isValidDetalleLejos.value = resultLejos.isValid
            return resultLejos.isValid
        case TipoReceta.Multifocal:
            resultLejos = createDetalleAereosCustomValidator(currentDetalleLejos.value)
            resultCerca = createDetalleAereosCustomValidator(currentDetalleCerca.value)
            isValidDetalleLejos.value = resultLejos.isValid
            isValidDetalleCerca.value = resultCerca.isValid
            return resultCerca.success && resultLejos.success
    }
}

const nombreCliente = computed(()=> selectedCliente.value?.apellido +", "+selectedCliente.value?.nombre)

const redirectCancel = ()=>{
  if (previousRoute) {
    router.push(previousRoute);
  } else {
    if(selectedCliente.value){
        router.push(`/clientes/dashboard/${selectedCliente.value.id}`); 
    }
  }
}

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
                    <BreadcrumbLink href="/clientes">
                        Clientes
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                    <SlashIcon />
                </BreadcrumbSeparator>
                <BreadcrumbItem v-if="selectedCliente">
                    <BreadcrumbLink :href="`/clientes/dashboard/${selectedCliente?.id}`">
                        {{nombreCliente}}
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator  v-if="selectedCliente">
                    <SlashIcon />
                </BreadcrumbSeparator>
                <BreadcrumbItem v-if="selectedCliente">
                    <BreadcrumbLink :href="`/recetas/${selectedCliente?.id}`">
                        Recetas
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator v-if="selectedCliente">
                    <SlashIcon />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                    <BreadcrumbPage>Nueva receta anteojos recetados</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
        <div class="pt-2 mb-4 " >
            <form @submit.prevent="validateAndSubmit" class="forms-wide flex flex-col justify-between items-start px-[5rem] ">
                <div class="w-full ">
                    <h3 class="page-subtitle text-center">Nueva Receta - Anteojos Recetados</h3>
                    <Separator class="my-6 w-full" />
                </div>
                <div class="flex flex-col w-full  justify-between items-start">
                     <div class="flex flex-col w-full  justify-between items-start">
                         <div class="flex flex-col w-full">
                         <div class="flex flex-row w-full justify-between">
                            <!-- Cliente -->
                            <div class="h-[5rem] mt-8  w-[35%]">
                                    <div class="form-item-wide justify-start">
                                        <Label class="form-label w-[3rem] text-left">Cliente</Label>
                                        <div class="flex flex-row justify-start items-center">
                                            <Input type="text" 
                                                class="w-[15rem] h-10"
                                                readonly
                                                :value="selectedCliente ? `${selectedCliente.apellido}, ${selectedCliente.nombre}` : 'Buscar'"
                                                @click="searchClienteOpen = true"
                                            />
                                            <SelectClienteDialog
                                                v-model="searchClienteOpen"
                                                title="Nueva Audiometría: Seleccionar Cliente"
                                                @select-cliente="handleSelectCliente"
                                            />
                                             <TooltipProvider  v-if="!isValidReceta.cliente" >
                                                <Tooltip>
                                                <TooltipTrigger class="bg-transparent text-xs text-destructive ml-4"> <AsteriskIcon :size="14" /> </TooltipTrigger>
                                                <TooltipContent class="text-destructive border-destructive font-thin text-xs">
                                                    <p>Seleccionar cliente</p>
                                                </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </div>
                                    </div>
                                </div>

                                <!-- Fecha -->
                                 <div class="h-[5rem] w-[30%] flex flex-col justify-start items-end mt-8">
                                    <div class="flex items-center justify-center w-full">
                                        <Label class="w-[3rem] text-wrap text-right mr-3 leading-5">Fecha Receta</Label>
                                        <div class="flex gap-2  mr-3">
                                            <Input type="text" v-model="fechaReceta.day" placeholder="DD" class="w-16 text-center" maxlength="2" />
                                            <Input type="text" v-model="fechaReceta.month" placeholder="MM" class="w-16 text-center" maxlength="2" />
                                            <Input type="text" v-model="fechaReceta.year" placeholder="AAAA" class="w-20 text-center" maxlength="4" />
                                        </div>
                                        <TooltipProvider  v-if="!isValidReceta.fecha" >
                                            <Tooltip>
                                            <TooltipTrigger class="bg-transparent text-xs text-destructive "> <AsteriskIcon :size="14" /> </TooltipTrigger>
                                            <TooltipContent class="text-destructive border-destructive font-thin text-xs">
                                                <p>Ingresar una fecha válida</p>
                                            </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                </div>

                                <!-- TipoReceta -->
                                <div class="h-[5rem] w-[30%] mt-8">
                                    <div class="form-item-wide mb-2">
                                        <Label class="w-[3rem] text-wrap text-right mr-3 leading-5">Tipo Receta</Label>
                                        <Select v-model="newReceta.tipoReceta" @update:model-value="(value) => newReceta.tipoReceta=value as TipoReceta"  >
                                            <SelectTrigger>
                                                <SelectValue class="text-black w-[15rem] "  />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectItem 
                                                        v-for="tipo in Object.entries(TipoReceta)" 
                                                        :key="tipo[0]" 
                                                        :value="tipo[0]"
                                                    >
                                                        {{ tipo[1] }}
                                                    </SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                        <TooltipProvider  v-if="!isValidReceta.tipoReceta" >
                                            <Tooltip>
                                            <TooltipTrigger class="bg-transparent text-xs text-destructive ml-4"> <AsteriskIcon :size="14" /> </TooltipTrigger>
                                            <TooltipContent class="text-destructive border-destructive font-thin text-xs">
                                                <p>Seleccionar tipo receta</p>
                                            </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                </div>
                            
                        </div>
                         <Separator class="my-10 w-full" />
                    </div>
                          <div class="flex flex-col w-full ">
                            <div  v-if="newReceta.tipoReceta==TipoReceta.Cerca || newReceta.tipoReceta==TipoReceta.Multifocal" class="flex flex-row items-center justify-center detalle detalle-cerca">
                                <h1 class="text-xl mb-6 font-extrabold w-20 mr-12 ">Cerca</h1>
                                <div class="flex flex-row justify-start items-center">
                                    <div class="flex flex-col ">
                                        <div class="flex  h-10 items-center justify-items-start">
                                            <p class="font-bold w-20 text-lg">O.D.</p>

                                            <p class="font-bold w-12 text-right pr-4">Esf.: </p>
                                            <Input type="decimal" v-model="currentDetalleCerca.od_esferico" :class="{'w-20' : !isValidDetalleCerca.od_esferico, 'w-20 mr-4': isValidDetalleCerca.od_esferico}"  />
                                            <TooltipProvider  v-if="!isValidDetalleCerca.od_esferico" >
                                                <Tooltip>
                                                <TooltipTrigger class="bg-transparent text-xs text-destructive ml-1"> <AsteriskIcon :size="12" /> </TooltipTrigger>
                                                <TooltipContent class="text-destructive border-destructive font-thin text-xs">
                                                    <p>Rango permitido: -35 a 35</p>
                                                </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                            
                                            <Separator orientation="vertical" class="mx-4" />

                                            <p class="font-bold w-12 text-right pr-4">Cil.:</p>
                                            <Input type="decimal"  v-model="currentDetalleCerca.od_cilindrico" :class="{'w-20' : !isValidDetalleCerca.od_cilindrico, 'w-20 mr-4': isValidDetalleCerca.od_cilindrico}" />
                                            <TooltipProvider  v-if="!isValidDetalleCerca.od_cilindrico" >
                                                <Tooltip>
                                                <TooltipTrigger class="bg-transparent text-xs text-destructive ml-1"> <AsteriskIcon :size="12" /> </TooltipTrigger>
                                                <TooltipContent class="text-destructive border-destructive font-thin text-xs">
                                                    <p>Rango permitido: -10 a 10</p>
                                                </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>

                                            <Separator orientation="vertical" class="mx-4 " />

                                            <p class="font-bold w-12 text-right pr-4">A:</p>
                                            <Input type="decimal" v-model="currentDetalleCerca.od_grados" class="w-20" />
                                            <p class="ml-2 mr-4">°</p>
                                            <TooltipProvider  v-if="!isValidDetalleCerca.od_grados" >
                                                <Tooltip>
                                                <TooltipTrigger class="bg-transparent text-xs text-destructive ml-1"> <AsteriskIcon :size="14" /> </TooltipTrigger>
                                                <TooltipContent class="text-destructive border-destructive font-thin text-xs">
                                                    <p>Rango permitido: 0° a 180 °</p>
                                                </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </div>

                                        <Separator class="my-4" />

                                        <div class="flex  h-10 items-center">
                                            <p class="font-bold w-20 text-lg">O.I.</p>

                                            <p class="font-bold w-12 text-right pr-4">Esf.: </p>
                                            <Input type="decimal" v-model="currentDetalleCerca.oi_esferico" :class="{'w-20' : !isValidDetalleCerca.oi_esferico, 'w-20 mr-4': isValidDetalleCerca.oi_esferico}"  />
                                            <TooltipProvider  v-if="!isValidDetalleCerca.oi_esferico" >
                                                <Tooltip>
                                                <TooltipTrigger class="bg-transparent text-xs text-destructive ml-1"> <AsteriskIcon :size="12" /> </TooltipTrigger>
                                                <TooltipContent class="text-destructive border-destructive font-thin text-xs">
                                                    <p>Rango permitido: -35 a 35</p>
                                                </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                            
                                            <Separator orientation="vertical" class="mx-4" />

                                            <p class="font-bold w-12 text-right pr-4">Cil.:</p>
                                            <Input type="decimal" v-model="currentDetalleCerca.oi_cilindrico" :class="{'w-20' : !isValidDetalleCerca.oi_cilindrico, 'w-20 mr-4': isValidDetalleCerca.oi_cilindrico}"  />
                                            <TooltipProvider  v-if="!isValidDetalleCerca.oi_cilindrico" >
                                                <Tooltip>
                                                <TooltipTrigger class="bg-transparent text-xs text-destructive ml-1"> <AsteriskIcon :size="12" /> </TooltipTrigger>
                                                <TooltipContent class="text-destructive border-destructive font-thin text-xs">
                                                    <p>Rango permitido: -10 a 10</p>
                                                </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>

                                            <Separator orientation="vertical" class="mx-4 " />

                                            <p class="font-bold w-12 text-right pr-4">A:</p>
                                            <Input type="decimal" class="w-20" v-model="currentDetalleCerca.oi_grados" />
                                            <p class="ml-4 mr-4">°</p>
                                            <TooltipProvider  v-if="!isValidDetalleCerca.oi_grados" >
                                                <Tooltip>
                                                <TooltipTrigger class="bg-transparent text-xs text-destructive ml-1"> <AsteriskIcon :size="14" /> </TooltipTrigger>
                                                <TooltipContent class="text-destructive border-destructive font-thin text-xs">
                                                    <p>Rango permitido: 0° a 180 °</p>
                                                </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        

                                        </div>
                                    </div>
                                    <Separator orientation="vertical" class="w-20" />
                                    <div class="w-[10rem] flex flex-row justify-start items-center">
                                        <p class=" font-bold w-14 text-start">DNP</p>
                                        <Input type="decimal" class="w-20" v-model="currentDetalleCerca.dnp" />
                                        <TooltipProvider  v-if="!isValidDetalleCerca.dnp" >
                                            <Tooltip>
                                            <TooltipTrigger class="bg-transparent text-xs text-destructive ml-2"> <AsteriskIcon :size="14" /> </TooltipTrigger>
                                            <TooltipContent class="text-destructive border-destructive font-thin text-xs">
                                                <p>Campo requerido</p>
                                            </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                </div>
                            </div>

                            <Separator v-if="newReceta.tipoReceta==TipoReceta.Multifocal" class="my-10 w-[80%] ml-[10%]" />


                            <div v-if="newReceta.tipoReceta==TipoReceta.Lejos || newReceta.tipoReceta==TipoReceta.Multifocal" class="flex flex-row items-center justify-center detalle detalle-lejos">
                                <h1 class="text-xl mb-6 font-extrabold w-20 mr-12 ">Lejos</h1>
                                <div class="flex flex-row justify-start items-center">
                                    <div class="flex flex-col ">
                                        <div class="flex  h-10 items-center">
                                            <p class="font-bold w-20 text-lg">O.D.</p>

                                            <p class="font-bold w-12 text-right pr-4">Esf.: </p>
                                            <Input type="decimal" v-model="currentDetalleLejos.od_esferico" :class="{'w-20' : !isValidDetalleLejos.od_esferico, 'w-20 mr-4': isValidDetalleLejos.od_esferico}"  />
                                            <TooltipProvider  v-if="!isValidDetalleLejos.od_esferico" >
                                                <Tooltip>
                                                <TooltipTrigger class="bg-transparent text-xs text-destructive ml-1"> <AsteriskIcon :size="12" /> </TooltipTrigger>
                                                <TooltipContent class="text-destructive border-destructive font-thin text-xs">
                                                    <p>Rango permitido: -35 a 35</p>
                                                </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                            
                                            <Separator orientation="vertical" class="mx-4" />

                                            <p class="font-bold w-12 text-right pr-4">Cil.:</p>
                                            <Input type="decimal"  v-model="currentDetalleLejos.od_cilindrico" :class="{'w-20' : !isValidDetalleLejos.od_cilindrico, 'w-20 mr-4': isValidDetalleLejos.od_cilindrico}" />
                                            <TooltipProvider  v-if="!isValidDetalleLejos.od_cilindrico" >
                                                <Tooltip>
                                                <TooltipTrigger class="bg-transparent text-xs text-destructive ml-1"> <AsteriskIcon :size="12" /> </TooltipTrigger>
                                                <TooltipContent class="text-destructive border-destructive font-thin text-xs">
                                                    <p>Rango permitido: -10 a 10</p>
                                                </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>

                                            <Separator orientation="vertical" class="mx-4 " />

                                            <p class="font-bold w-12 text-right pr-4">A:</p>
                                            <Input type="decimal" v-model="currentDetalleLejos.od_grados" class="w-20" />
                                            <p class="ml-2 mr-4">°</p>
                                            <TooltipProvider  v-if="!isValidDetalleLejos.od_grados" >
                                                <Tooltip>
                                                <TooltipTrigger class="bg-transparent text-xs text-destructive ml-1"> <AsteriskIcon :size="14" /> </TooltipTrigger>
                                                <TooltipContent class="text-destructive border-destructive font-thin text-xs">
                                                    <p>Rango permitido: 0° a 180 °</p>
                                                </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>

                                        </div>

                                        <Separator class="my-4" />

                                        <div class="flex  h-10 items-center">
                                            <p class="font-bold w-20 text-lg">O.I.</p>

                                            <p class="font-bold w-12 text-right pr-4">Esf.: </p>
                                            <Input type="decimal" v-model="currentDetalleLejos.oi_esferico" :class="{'w-20' : !isValidDetalleLejos.oi_esferico, 'w-20 mr-4': isValidDetalleLejos.oi_esferico}"  />
                                            <TooltipProvider  v-if="!isValidDetalleLejos.oi_esferico" >
                                                <Tooltip>
                                                <TooltipTrigger class="bg-transparent text-xs text-destructive ml-1"> <AsteriskIcon :size="12" /> </TooltipTrigger>
                                                <TooltipContent class="text-destructive border-destructive font-thin text-xs">
                                                    <p>Rango permitido: -35 a 35</p>
                                                </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                            
                                            <Separator orientation="vertical" class="mx-4" />

                                            <p class="font-bold w-12 text-right pr-4">Cil.:</p>
                                            <Input type="decimal" v-model="currentDetalleLejos.oi_cilindrico" :class="{'w-20' : !isValidDetalleLejos.oi_cilindrico, 'w-20 mr-4': isValidDetalleLejos.oi_cilindrico}"  />
                                            <TooltipProvider  v-if="!isValidDetalleLejos.oi_cilindrico" >
                                                <Tooltip>
                                                <TooltipTrigger class="bg-transparent text-xs text-destructive ml-1"> <AsteriskIcon :size="12" /> </TooltipTrigger>
                                                <TooltipContent class="text-destructive border-destructive font-thin text-xs">
                                                    <p>Rango permitido: -10 a 10</p>
                                                </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>

                                            <Separator orientation="vertical" class="mx-4 " />

                                            <p class="font-bold w-12 text-right pr-4">A:</p>
                                            <Input type="decimal" class="w-20" v-model="currentDetalleLejos.oi_grados" />
                                            <p class="ml-2 mr-4">°</p>
                                            <TooltipProvider  v-if="!isValidDetalleLejos.oi_grados" >
                                                <Tooltip>
                                                <TooltipTrigger class="bg-transparent text-xs text-destructive ml-1"> <AsteriskIcon :size="14" /> </TooltipTrigger>
                                                <TooltipContent class="text-destructive border-destructive font-thin text-xs">
                                                    <p>Rango permitido: 0° a 180 °</p>
                                                </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        

                                        </div>
                                    </div>
                                    <Separator orientation="vertical" class="w-20" />

                                    <div class=" w-[10rem]  flex flex-row justify-start items-center">
                                        <p class="font-bold w-14 text-start">DNP</p>
                                        <Input type="decimal" class="w-20" v-model="currentDetalleLejos.dnp" />
                                        <TooltipProvider  v-if="!isValidDetalleLejos.dnp" >
                                            <Tooltip>
                                            <TooltipTrigger class="bg-transparent text-xs text-destructive ml-2"> <AsteriskIcon :size="14" /> </TooltipTrigger>
                                            <TooltipContent class="text-destructive border-destructive font-thin text-xs ">
                                                <p>Campo requerido</p>
                                            </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                </div>
                            </div>
                        </div> 
                    </div>

                    <Separator class="my-10 w-full" />
                
                        <div class="flex flew-row mt-6   w-full justify-between items-start">

                        <div class="flex flex-row mt-6 w-[40%] justify-start items-start">
                                <span class="form-label font-bold text-xl w-[8rem]">Cristales</span>                                
                                <div class="flex flex-col justify-start w-[85%] ">
                                    
                                    <!-- TipoCristal -->
                                    <div class="h-[5rem] w-[20rem] mr-16">
                                        <div class="form-item-wide">
                                            <Label class="w-[8rem] mr-4 text-right">Tipo</Label>
                                            <Select v-model="newReceta.cristal" @update:model-value="(value) => newReceta.cristal=value as TipoCristal"  >
                                                <SelectTrigger>
                                                    <SelectValue class="text-black"  />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectItem 
                                                            v-for="tipo in Object.entries(TipoCristal)" 
                                                            :key="tipo[0]" 
                                                            :value="tipo[0]"
                                                        >
                                                            {{ tipo[1] }}
                                                        </SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                            <TooltipProvider  v-if="!isValidReceta.cristal" >
                                                <Tooltip>
                                                <TooltipTrigger class="bg-transparent text-xs text-destructive ml-4"> <AsteriskIcon :size="14" /> </TooltipTrigger>
                                                <TooltipContent class="text-destructive border-destructive font-thin text-xs">
                                                    <p>Seleccionar tipo de cristal</p>
                                                </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </div>
                                    </div>

                                    <!-- ColorCristal -->
                                    <div class="h-[5rem] w-[20rem] mr-16">
                                        <div class="form-item-wide">
                                            <Label class="w-[8rem] mr-4 text-right">Color</Label>
                                            <Select v-model="newReceta.color" @update:model-value="(value) => newReceta.color=value as ColorCristal"  >
                                                <SelectTrigger>
                                                    <SelectValue class="text-black"  />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectItem 
                                                            v-for="color in Object.entries(ColorCristal)" 
                                                            :key="color[0]" 
                                                            :value="color[0]"
                                                        >
                                                            {{ color[1] }}
                                                        </SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                            <TooltipProvider  v-if="!isValidReceta.color" >
                                                <Tooltip>
                                                <TooltipTrigger class="bg-transparent text-xs text-destructive ml-4"> <AsteriskIcon :size="14" /> </TooltipTrigger>
                                                <TooltipContent class="text-destructive border-destructive font-thin text-xs">
                                                    <p>Seleccionar color de cristal</p>
                                                </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </div>
                                    </div>


                                    <!-- Tratamiento -->
                                    <div class="h-[5rem] w-[20rem] mr-16">
                                        <div class="form-item-wide">
                                            <Label class="w-[8rem] mr-4 text-right">Tratamiento</Label>
                                            <Select v-model="newReceta.tratamiento" @update:model-value="(value) => newReceta.tratamiento=value as TratamientoCristal"  >
                                                <SelectTrigger>
                                                    <SelectValue class="text-black"  />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectItem 
                                                            v-for="trat in Object.entries(TratamientoCristal)" 
                                                            :key="trat[0]" 
                                                            :value="trat[0]"
                                                        >
                                                            {{ trat[1] }}
                                                        </SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                            <TooltipProvider  v-if="!isValidReceta.tratamiento" >
                                                <Tooltip>
                                                <TooltipTrigger class="bg-transparent text-xs text-destructive ml-4"> <AsteriskIcon :size="14" /> </TooltipTrigger>
                                                <TooltipContent class="text-destructive border-destructive font-thin text-xs">
                                                    <p>Seleccionar tratamiento de cristal</p>
                                                </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </div>
                                    </div>

                                </div>
                        </div>
                        <div class="flex flex-col mt-6  w-[60%] justify-start items-start ">
                                <div class="flex flex-row justify-between items-start w-full  h-[5rem]">
                                    <div class="flex flex-row justify-between  items-center w-full ">
                                        <Label class="form-label text-right mr-4 w-[8rem]">Armazón</Label>    
                                        <Input
                                            class="resize-none w-[60%]"
                                            v-model="newReceta.armazon"
                                        />                            
                                    </div>
                                    <div class="flex flex-row justify-between items-center w-full ">
                                        <Label class="form-label text-right mr-4 w-[8rem]">Oftalmólogo</Label>    
                                        <Input
                                            class="resize-none w-[60%] "
                                            v-model="newReceta.oftalmologo"
                                        />  
                                        <TooltipProvider  v-if="!isValidReceta.oftalmologo" >
                                            <Tooltip>
                                            <TooltipTrigger class="bg-transparent text-xs text-destructive ml-4"> <AsteriskIcon :size="14" /> </TooltipTrigger>
                                            <TooltipContent class="text-destructive border-destructive font-thin text-xs">
                                                <p>Indique oftalmólogo</p>
                                            </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>                          
                                    </div>
                                </div>
                                <div class="flex flex-row justify-between w-full">
                                    <Label class="form-label text-right mr-4 w-[8rem] mt-3">Observaciones</Label>    
                                    <Textarea
                                        class="resize-none w-[80%] h-[7.5rem]"
                                        v-model="newReceta.observaciones"
                                    />                            
                                </div>
                        </div>
                        </div>
                </div>
                <div class="form-footer w-full flex flex-row justify-end mt-8 mb-6">
                    <Button type="button" variant="outline" class="w-[15%] mr-5" @click="redirectCancel"  >Cancelar</Button>
                    <Button type="submit" class="w-[15%]">Guardar</Button>
                </div>
            </form>
        </div>

        <AlertError v-model="showError" title="Error" :message="errorMessage" button="Aceptar"
            :action="()=>{showError=false}" />

</div>
</template>


<style>
</style>