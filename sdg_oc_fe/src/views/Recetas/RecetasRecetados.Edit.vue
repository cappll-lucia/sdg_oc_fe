<script setup lang="ts">
import { DetalleRecetaAereos, editDetalleAereosCustomValidator } from '@/api/entities/detalleRecetaAereos';
import { ColorCristal, RecetasAereos, TipoCristal, TipoReceta, TratamientoCristal, editRecetaAereosCustomValidator } from '@/api/entities/recetasAereos';
import { recetasApi } from '@/api/libs/recetas';
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
import router from '@/router';
import { SlashIcon, AsteriskIcon} from 'lucide-vue-next';
import { onMounted, ref} from 'vue';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'
import AlertError from '@/components/AlertError.vue';
import { useRoute } from 'vue-router';
import { toast } from '@/components/ui/toast';

const route = useRoute()

const loading = ref<boolean>(false);

const showError = ref<boolean>(false);
const errorMessage =ref<string>('');


const currentReceta = ref<RecetasAereos>()
const currentDetalleCerca = ref<DetalleRecetaAereos>()
const currentDetalleLejos = ref<DetalleRecetaAereos>()


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
    currentReceta.value = await recetasApi.getOneRecetados(Number(route.params.id));
    switch(currentReceta.value.tipoReceta){
        case TipoReceta.Cerca:
            currentDetalleCerca.value = currentReceta.value.detallesRecetaLentesAereos.find(d=> d.tipo_detalle==TipoReceta.Cerca)
            break;
        case TipoReceta.Lejos:
            currentDetalleLejos.value = currentReceta.value.detallesRecetaLentesAereos.find(d=> d.tipo_detalle==TipoReceta.Lejos)
            break;
        case TipoReceta.Multifocal:
            currentDetalleCerca.value = currentReceta.value.detallesRecetaLentesAereos.find(d=> d.tipo_detalle==TipoReceta.Cerca)
            currentDetalleLejos.value = currentReceta.value.detallesRecetaLentesAereos.find(d=> d.tipo_detalle==TipoReceta.Lejos)
        break;
    }
    fechaReceta.value.day = currentReceta.value.fecha.getDate().toString()
    fechaReceta.value.month = (currentReceta.value.fecha.getMonth()+1).toString()
    fechaReceta.value.year = currentReceta.value.fecha.getFullYear().toString()
})

const onSubmit = async()=>{
    if(!currentReceta.value) return
    try {
        switch(currentReceta.value.tipoReceta){
            case TipoReceta.Lejos:
                if(!currentDetalleLejos.value) return
                currentReceta.value.detallesRecetaLentesAereos = [currentDetalleLejos.value]
                break;
            case TipoReceta.Cerca:
                if(!currentDetalleCerca.value) return
                currentReceta.value.detallesRecetaLentesAereos = [currentDetalleCerca.value]
                break;
            case TipoReceta.Multifocal:
                if(!currentDetalleLejos.value || !currentDetalleCerca.value) return
                currentReceta.value.detallesRecetaLentesAereos = [currentDetalleCerca.value, currentDetalleLejos.value]
                break;
        }
        currentReceta.value.fecha = new Date(parseInt(fechaReceta.value.year), parseInt(fechaReceta.value.month)-1, parseInt(fechaReceta.value.day))
        await recetasApi.editRecetaAereosRecetaAereos(currentReceta.value)
        loading.value=false;
        toast({
            title: 'Receta actualizada con éxito',
        })
        router.replace('/recetas')
    } catch (err: any) {
        errorMessage.value=err.message as string
        showError.value = true;
        loading.value=false;
    };
}


const validateAndEdit = async()=>{
    loading.value = true;
    const validDetalle = validateDetalles();
    const resultReceta = editRecetaAereosCustomValidator(currentReceta.value, fechaReceta.value);
    console.log(resultReceta)
    console.log(validDetalle)
    isValidReceta.value = resultReceta.isValid
    if(validDetalle && resultReceta.success){
        await onSubmit();
        console.log('ok')
    }
    loading.value = false;
}

const validateDetalles = ()=>{
    let resultCerca, resultLejos
    if(!currentReceta.value) return
    switch(currentReceta.value.tipoReceta){
        case TipoReceta.Cerca:
            resultCerca = editDetalleAereosCustomValidator(currentDetalleCerca.value)
            isValidDetalleCerca.value = resultCerca.isValid
            return resultCerca.isValid
            break;
        case TipoReceta.Lejos:
            resultLejos = editDetalleAereosCustomValidator(currentDetalleLejos.value)
            isValidDetalleLejos.value = resultLejos.isValid
            return resultLejos.isValid
            break;
        case TipoReceta.Multifocal:
            console.log('dl--> ', currentDetalleLejos.value)
            resultLejos = editDetalleAereosCustomValidator(currentDetalleLejos.value)
            console.log(resultLejos)
            isValidDetalleLejos.value = resultLejos.isValid
            console.log('dc--> ', currentDetalleCerca.value)
            resultCerca = editDetalleAereosCustomValidator(currentDetalleCerca.value)
            console.log(resultCerca)
            isValidDetalleCerca.value = resultCerca.isValid
            return resultCerca?.isValid && resultLejos?.isValid
            break;
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
                    <BreadcrumbLink href="/recetas">
                        Recetas
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                    <SlashIcon />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                    <BreadcrumbPage>Editar</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
        <div class="pt-2 mb-4" >
            <div v-if="!currentReceta" class="forms-wide flex flex-col justify-between items-start px-[5rem] ">
                    <div class="w-full ">
                    <h3 class="page-subtitle text-center">Receta con id {{ route.params.id }} no encontrada</h3>
                </div>
            </div>
            <form v-else @submit.prevent="validateAndEdit" class="forms-wide flex flex-col justify-between items-start px-[5rem] ">
                <div class="w-full ">
                    <h3 class="page-subtitle text-center">Editar Recta - Anteojos Recetados</h3>
                    <Separator class="my-6 w-full" />
                </div>
                    <div class="flex flex-col w-full  justify-between items-start">
                     <div class="flex flex-col w-full  justify-between items-start">
                         <div class="flex flex-col w-full">
                         <div class="flex flex-row w-full justify-between px-4">
                            <!-- Cliente -->
                                <div class="h-[3rem] mt-7 form-item-wide justify-start items-start w-[25%] border px-4 rounded-lg">
                                    <Label class=" text-sm text-left font-bold w-[5rem] ">Cliente</Label>
                                    <Label class=" w-[15rem] text-sm text-left">{{currentReceta.cliente.apellido}}, {{currentReceta.cliente.nombre}}</Label>
                                </div>

                                <!-- Fecha -->
                                 <div class="h-[5rem] w-[30%] flex flex-col justify-start items-end mt-8">
                                    <div class="flex items-center justify-end w-full">
                                        <Label class="w-[25%]">Fecha Receta</Label>
                                        <div class="flex gap-2 w-[60%]">
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
                                        <Label class="w-[8rem]">Tipo Receta</Label>
                                        <Select v-if="currentReceta" v-model="currentReceta.tipoReceta" @update:model-value="(value) => currentReceta && (currentReceta.tipoReceta = value as TipoReceta)"  >
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
                            <div  v-if="currentReceta && currentDetalleCerca && (currentReceta.tipoReceta==TipoReceta.Cerca || currentReceta.tipoReceta==TipoReceta.Multifocal)" class="flex flex-row items-center justify-center detalle detalle-cerca">
                                <h1 class="text-xl mb-6 font-extrabold w-20 mr-12 ">Cerca</h1>
                                <div class="flex flex-row justify-start items-center">
                                    <div class="flex flex-col ">
                                        <div  class="flex  h-10 items-center justify-items-start">
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
                                            <Input type="decimal" v-model="currentDetalleCerca.od_grados"  class="w-20" />
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

                            <Separator v-if="currentReceta?.tipoReceta==TipoReceta.Multifocal" class="my-10 w-[80%] ml-[10%]" />


                            <div v-if="currentReceta && currentDetalleLejos && (currentReceta.tipoReceta==TipoReceta.Lejos || currentReceta.tipoReceta==TipoReceta.Multifocal)" class="flex flex-row items-center justify-center detalle detalle-lejos">
                                <h1 class="text-xl mb-6 font-extrabold w-20 mr-12 ">Lejos</h1>
                                <div class="flex flex-row justify-start items-center">
                                    <div class="flex flex-col ">
                                        <div v-if="currentDetalleLejos" class="flex  h-10 items-center">
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

                        <div class="flex flex-row mt-6 w-[40%]  justify-start items-start">
                                <span class="form-label font-bold text-xl w-[8rem]">Cristales</span>                                
                                <div class="flex flex-col justify-start w-[85%]">
                                    
                                    <!-- TipoCristal -->
                                     <div class="h-[5rem] w-[20rem] mr-16">
                                        <div class="form-item-wide">
                                            <Label class="w-[8rem] mr-4 text-right">Tipo</Label>
                                            <Select v-if="currentReceta" v-model="currentReceta.cristal" @update:model-value="(value) => currentReceta && (currentReceta.cristal=value as TipoCristal)"  >
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
                                            <Select v-if="currentReceta" v-model="currentReceta.color" @update:model-value="(value) => currentReceta && (currentReceta.color=value as ColorCristal)"  >
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
                                            <Select v-if="currentReceta" v-model="currentReceta.tratamiento" @update:model-value="(value) => currentReceta && (currentReceta.tratamiento=value as TratamientoCristal)"  >
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
                        <div  class="flex flex-col mt-6  w-[60%] justify-start items-start">
                                <div class="flex flex-row justify-between items-center w-full">
                                    <div class="flex flex-row justify-between items-center w-full mt-5">
                                        <Label class="form-label text-right mr-4 w-[8rem]">Armazón</Label>    
                                        <Input
                                            class="resize-none w-[60%]"
                                            v-if="currentReceta"
                                            v-model="currentReceta.armazon"
                                        />                            
                                    </div>
                                    <div class="flex flex-row justify-between items-center w-full mt-5">
                                        <Label class="form-label text-right mr-4 w-[8rem]">Oftalmólogo</Label>    
                                        <Input
                                            class="resize-none w-[60%] "
                                            v-if="currentReceta"
                                            v-model="currentReceta.oftalmologo"
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
                                <div class="flex flex-row justify-between w-full mt-5">
                                    <Label class="form-label text-right mr-4 w-[8rem]">Observaciones</Label>    
                                    <Textarea
                                        class="resize-none w-[80%] h-[7.5rem]"
                                        v-if="currentReceta"
                                        v-model="currentReceta.observaciones"
                                    />                            
                                </div>
                        </div>
                        </div>
                </div>
                <div class="form-footer w-full flex flex-row justify-end mt-8 mb-6">
                    <Button variant="outline" class="w-[15%] mr-5" @click="router.replace('/audiometrias')"  >Cancelar</Button>
                    <Button type="submit" class="w-[15%]">{{ loading ? 'Cargando...' : 'Guardar' }}</Button>
                </div>
            </form>
        </div>

        <AlertError v-model="showError" title="Error" :message="errorMessage" button="Aceptar"
            :action="()=>{showError=false}" />

    </div>
</template>


<style>
</style>