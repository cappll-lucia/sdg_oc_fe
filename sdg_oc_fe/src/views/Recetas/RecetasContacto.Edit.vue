<script setup lang="ts">
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { AsteriskIcon, PlusIcon} from 'lucide-vue-next';
import { Separator } from '@/components/ui/separator';
import { computed, onMounted, ref } from 'vue';
import Label from '@/components/ui/label/Label.vue';
import { RecetaContacto, recetaContactoCustomValidator } from '@/api/entities/recetasContacto';
import { useRoute } from 'vue-router';
import { recetasApi } from '@/api/libs/recetas';
import Input from '@/components/ui/input/Input.vue';
import TooltipProvider from '@/components/ui/tooltip/TooltipProvider.vue';
import Tooltip from '@/components/ui/tooltip/Tooltip.vue';
import TooltipTrigger from '@/components/ui/tooltip/TooltipTrigger.vue';
import TooltipContent from '@/components/ui/tooltip/TooltipContent.vue';
import Select from '@/components/ui/select/Select.vue';
import SelectTrigger from '@/components/ui/select/SelectTrigger.vue';
import SelectValue from '@/components/ui/select/SelectValue.vue';
import SelectContent from '@/components/ui/select/SelectContent.vue';
import SelectGroup from '@/components/ui/select/SelectGroup.vue';
import SelectItem from '@/components/ui/select/SelectItem.vue';
import Accordion from '@/components/ui/accordion/Accordion.vue';
import AccordionItem from '@/components/ui/accordion/AccordionItem.vue';
import AccordionTrigger from '@/components/ui/accordion/AccordionTrigger.vue';
import AccordionContent from '@/components/ui/accordion/AccordionContent.vue';
import Checkbox from '@/components/ui/checkbox/Checkbox.vue';
import Button from '@/components/ui/button/Button.vue';
import { previousRoute, router } from '@/router';
import AlertError from '@/components/AlertError.vue';
import { PruebaLentesContacto, pruebaLentesContactoCustomValidator } from '@/api/entities/pruebasLentesContacto';
import { toast } from '@/components/ui/toast';
import Textarea from '@/components/ui/textarea/Textarea.vue';
import { Cross2Icon, ValueNoneIcon, SlashIcon } from '@radix-icons/vue';
import { useLoaderStore } from '@/stores/LoaderStore';

const route = useRoute();
const loader = useLoaderStore();


const fechaReceta = ref({
    day:'',
    month:'',
    year:'',
})

const showError = ref<boolean>(false);
const errorMessage =ref<string>('');

const currentReceta = ref<RecetaContacto>();
const currentPruebas = ref<{
    od_diametro: number | undefined,
    od_eje: number | undefined,
    od_cilindrico: number | undefined,
    od_esferico: number | undefined,
    od_cb: number | undefined,
    od_marca: string,
    oi_diametro: number | undefined,
    oi_eje: number | undefined,
    oi_cilindrico: number | undefined,
    oi_esferico: number | undefined,
    oi_cb: number | undefined,
    oi_marca: string,
    confort: boolean,
    movilidad: boolean,
    centraje: boolean,
    hiperemia: boolean,
    agudeza_visual: boolean,
    oi_edema: boolean,
    od_edema: boolean,
    observaciones: string,
}[]>([])
const isValidReceta = ref<{
    oftalmologo: boolean,
    quet_m1_od: boolean,
    quet_m2_od: boolean,
    quet_m1_oi: boolean,
    quet_m2_oi: boolean,
    estesiometria: boolean,
    od_cb: boolean,
    od_esferico: boolean,
    od_cilindrico: boolean,
    od_eje: boolean,
    od_diametro: boolean,
    od_marca: boolean,
    oi_cb: boolean,
    oi_esferico: boolean,
    oi_cilindrico: boolean,
    oi_eje: boolean,
    oi_diametro: boolean,
    oi_marca: boolean,
    fecha: boolean,
    cliente: boolean
}>({
    oftalmologo: true,
    quet_m1_od: true,
    quet_m2_od: true,
    quet_m1_oi: true,
    quet_m2_oi: true,
    estesiometria: true,
    od_cb: true,
    od_esferico: true,
    od_cilindrico: true,
    od_eje: true,
    od_diametro: true,
    od_marca: true,
    oi_cb: true,
    oi_esferico: true,
    oi_cilindrico: true,
    oi_eje: true,
    oi_diametro: true,
    oi_marca: true,
    fecha: true,
    cliente: true
})
const isValidPrueba = ref<{
    od_cb: boolean,
    od_esferico: boolean,
    od_cilindrico: boolean,
    od_eje: boolean,
    od_diametro: boolean,
    oi_cb: boolean,
    oi_esferico: boolean,
    oi_cilindrico: boolean,
    oi_eje: boolean,
    oi_diametro: boolean,
}[]>([])

onMounted(async()=>{
    try{
        loader.show();
        currentReceta.value = await recetasApi.getOneContacto(Number(route.params.id))
        currentPruebas.value = currentReceta.value.pruebasLentesContacto.map((p: PruebaLentesContacto  )=>{
            const { numeroPrueba: numero, ...prueba } = p;
            return prueba
        });
        isValidPrueba.value.push({
            od_cb: true,
            od_esferico: true,
            od_cilindrico: true,
            od_eje: true,
            od_diametro: true,
            oi_cb: true,
            oi_esferico: true,
            oi_cilindrico: true,
            oi_eje: true,
            oi_diametro: true,
        })
        fechaReceta.value.day = currentReceta.value.fecha.getDate().toString()
        fechaReceta.value.month = (currentReceta.value.fecha.getMonth()+1).toString()
        fechaReceta.value.year = currentReceta.value.fecha.getFullYear().toString()
        loader.hide();
    }catch(err: any){
        errorMessage.value=err.message as string
        showError.value = true;
        loader.hide();
    }
})

const addPrueba = ()=>{
    currentPruebas.value.push({
        od_diametro: undefined,
        od_eje: undefined,
        od_cilindrico: undefined,
        od_esferico: undefined,
        od_cb: undefined,
        od_marca: '',
        oi_diametro: undefined,
        oi_eje: undefined,
        oi_cilindrico: undefined,
        oi_esferico: undefined,
        oi_cb: undefined,
        oi_marca: '',
        confort: false,
        movilidad: false,
        centraje: false,
        hiperemia: false,
        agudeza_visual: false,
        oi_edema: false,
        od_edema: false,
        observaciones: ''
    })
    isValidPrueba.value.push({
        od_cb: true,
        od_esferico: true,
        od_cilindrico: true,
        od_eje: true,
        od_diametro: true,
        oi_cb: true,
        oi_esferico: true,
        oi_cilindrico: true,
        oi_eje: true,
        oi_diametro: true,
    })
}

const validateAndSubmit = async()=>{
    if(currentReceta.value){   
        loader.show();
        const resultReceta = recetaContactoCustomValidator(currentReceta.value, fechaReceta.value)
        isValidReceta.value = resultReceta.isValid;
        const resultPruebas = pruebaLentesContactoCustomValidator(currentPruebas.value)
        isValidPrueba.value = resultPruebas.isValid;
        if(resultPruebas.success && resultReceta.success){
            await onSubmit();
        }
        loader.hide();
    }
}


const onSubmit = async()=>{
    try{
        if(currentReceta.value){
            const recetaObj = {...currentReceta.value, pruebasLentesContacto: currentPruebas.value}
            recetaObj.fecha = new Date(parseInt(fechaReceta.value.year), parseInt(fechaReceta.value.month)-1, parseInt(fechaReceta.value.day))
            await recetasApi.editRecetaContacto(recetaObj)
            loader.hide();
            toast({
                title: 'Receta editada con éxito',
            })
            router.push(`/recetas/${currentReceta.value.cliente.id}?tab=contacto&recetaId=${currentReceta.value.id}`)
        }
    } catch (err: any) {
        errorMessage.value=err.message as string
        showError.value = true;
        loader.hide();
    };
}

const nombreCliente = computed(()=> currentReceta.value?.cliente.apellido +", "+currentReceta.value?.cliente.nombre);

const redirectCancel = ()=>{
  if (previousRoute ) {
    router.push(previousRoute);
  } else {
    if(currentReceta.value?.cliente){
        router.push(`/clientes/dashboard/${currentReceta.value?.cliente.id}`); 
    }
  }
}


</script>


<template>
    <div class="page" v-if="currentReceta">
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
                    <BreadcrumbLink :href="`/clientes/dashboard/${currentReceta?.cliente.id}`">
                        {{nombreCliente}}
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                    <SlashIcon />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                    <BreadcrumbLink :href="`/recetas/${currentReceta?.cliente.id}`">
                        Recetas
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                    <SlashIcon />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                    <BreadcrumbPage>Editar Receta</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
        <div class="pt-2 mb-4 " >
            <form @submit.prevent="validateAndSubmit" class=" forms-wide flex flex-col justify-start items-start px-[5rem] min-h-[45rem] ">
                <div class="w-full ">
                    <h3 class="page-subtitle text-center">Editar Receta - Lentes de contacto</h3>
                    <Separator class="my-10 w-full" />
                </div>
                <div class="flex flex-col w-full justify-between items-start">
                    <div class="flex flex-col w-full">
                        <div class="flex flex-row w-full justify-center  gap-x-20">
                             <div class="h-[3rem] form-item-wide justify-start items-start w-[25%] border px-4 rounded-lg">
                                <Label class=" text-sm text-left font-bold w-[5rem] ">Cliente</Label>
                                <Label class=" w-[15rem] text-sm text-left">{{currentReceta.cliente.apellido}}, {{currentReceta.cliente.nombre}}</Label>
                            </div>

                             <div class="h-[3rem] w-[23rem] flex flex-col justify-center items-end ">
                                <div class="flex items-center justify-start w-full">
                                    <Label class="w-[8rem]">Fecha Receta</Label>
                                    <div class="flex gap-2 w-[60%]">
                                        <Input type="text" v-model="fechaReceta.day" placeholder="DD" class="w-16 text-center" maxlength="2" />
                                        <Input type="text" v-model="fechaReceta.month" placeholder="MM" class="w-16 text-center" maxlength="2" />
                                        <Input type="text" v-model="fechaReceta.year" placeholder="AAAA" class="w-20 text-center" maxlength="4" />
                                    </div>
                                    <TooltipProvider  v-if="!isValidReceta.fecha" >
                                        <Tooltip>
                                        <TooltipTrigger class="bg-transparent text-xs text-destructive ml-4 "> <AsteriskIcon :size="14" /> </TooltipTrigger>
                                        <TooltipContent class="text-destructive border-destructive font-thin text-xs">
                                            <p>Ingresar una fecha válida</p>
                                        </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                            </div>
                        </div>
                        <Separator class="my-10 w-full" />
                        <div class="flex flex-row w-full justify-center ">
                            <div class="flex flex-row items-center justify-center detalle detalle-cerca">
                                <h1 class="text-xl font-extrabold w-16 mr-20 ">Lentes Definitivas</h1>
                                <div class="flex flex-row justify-center w-[85%] items-center">
                                    <div class="flex flex-col">
                                        <div class="flex h-10 items-center justify-items-start">
                                            <p class="font-bold w-24 text-lg">O.D.</p>

                                            <p class="font-bold w-12 text-right pr-4">C.B.: </p>
                                            <Input type="decimal" v-model="currentReceta.od_cb" :class="{'w-20' : !isValidReceta.od_cb, 'w-20 mr-4': isValidReceta.od_cb}"  />
                                            <TooltipProvider  v-if="!isValidReceta.od_cb" >
                                                <Tooltip>
                                                <TooltipTrigger class="bg-transparent text-xs text-destructive ml-1"> <AsteriskIcon :size="12" /> </TooltipTrigger>
                                                <TooltipContent class="text-destructive border-destructive font-thin text-xs">
                                                    <p>Rango permitido: 0 a 20</p>
                                                </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>

                                            <Separator orientation="vertical" class="mx-4" />
                                            
                                            <p class="font-bold w-12 text-right pr-4">Esf.: </p>
                                            <Input type="decimal" v-model="currentReceta.od_esferico" :class="{'w-20' : !isValidReceta.od_esferico, 'w-20 mr-4': isValidReceta.od_esferico}"  />
                                            <TooltipProvider  v-if="!isValidReceta.od_esferico" >
                                                <Tooltip>
                                                <TooltipTrigger class="bg-transparent text-xs text-destructive ml-1"> <AsteriskIcon :size="12" /> </TooltipTrigger>
                                                <TooltipContent class="text-destructive border-destructive font-thin text-xs">
                                                    <p>Rango permitido: -35 a 35</p>
                                                </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>

                                            <Separator orientation="vertical" class="mx-4" />

                                            <p class="font-bold w-12 text-right pr-4">Cil.: </p>
                                            <Input type="decimal" v-model="currentReceta.od_cilindrico" :class="{'w-20' : !isValidReceta.od_cilindrico, 'w-20 mr-4': isValidReceta.od_cilindrico}"  />
                                            <TooltipProvider  v-if="!isValidReceta.od_cilindrico" >
                                                <Tooltip>
                                                <TooltipTrigger class="bg-transparent text-xs text-destructive ml-1"> <AsteriskIcon :size="12" /> </TooltipTrigger>
                                                <TooltipContent class="text-destructive border-destructive font-thin text-xs">
                                                    <p>Rango permitido: -10 a 10</p>
                                                </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>

                                            <Separator orientation="vertical" class="mx-4" />

                                            <p class="font-bold w-12 text-right pr-4">Eje: </p>
                                            <Input type="decimal" v-model="currentReceta.od_eje" :class="{'w-20' : !isValidReceta.od_eje, 'w-20 mr-4': isValidReceta.od_eje}"  />
                                            <TooltipProvider  v-if="!isValidReceta.od_eje" >
                                                <Tooltip>
                                                <TooltipTrigger class="bg-transparent text-xs text-destructive ml-1"> <AsteriskIcon :size="12" /> </TooltipTrigger>
                                                <TooltipContent class="text-destructive border-destructive font-thin text-xs">
                                                    <p>Rango permitido: 0 a 180</p>
                                                </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>

                                            <Separator orientation="vertical" class="mx-4" />

                                             <p class="font-bold w-12 text-right flex justify-start items-center"><ValueNoneIcon class="h-4 w-4" /> <span class="pl-2">:</span> </p>
                                            <Input type="decimal" v-model="currentReceta.od_diametro" :class="{'w-20' : !isValidReceta.od_diametro, 'w-20 mr-4': isValidReceta.od_diametro}"  />
                                            <TooltipProvider  v-if="!isValidReceta.od_diametro" >
                                                <Tooltip>
                                                <TooltipTrigger class="bg-transparent text-xs text-destructive ml-1"> <AsteriskIcon :size="12" /> </TooltipTrigger>
                                                <TooltipContent class="text-destructive border-destructive font-thin text-xs">
                                                    <p>Rango permitido: 0 a 30</p>
                                                </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>



                                        </div>
                                        <Separator class="my-6" />
                                        <div class="flex  h-10 items-center justify-items-start">
                                            <p class="font-bold w-24 text-lg">O.I.</p>

                                            <p class="font-bold w-12 text-right pr-4">C.B.: </p>
                                            <Input type="decimal" v-model="currentReceta.oi_cb" :class="{'w-20' : !isValidReceta.oi_cb, 'w-20 mr-4': isValidReceta.oi_cb}"  />
                                            <TooltipProvider  v-if="!isValidReceta.oi_cb" >
                                                <Tooltip>
                                                <TooltipTrigger class="bg-transparent text-xs text-destructive ml-1"> <AsteriskIcon :size="12" /> </TooltipTrigger>
                                                <TooltipContent class="text-destructive border-destructive font-thin text-xs">
                                                    <p>Rango permitido: 0 a 20</p>
                                                </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>

                                            <Separator orientation="vertical" class="mx-4" />
                                            
                                            <p class="font-bold w-12 text-right pr-4">Esf.: </p>
                                            <Input type="decimal" v-model="currentReceta.oi_esferico" :class="{'w-20' : !isValidReceta.oi_esferico, 'w-20 mr-4': isValidReceta.oi_esferico}"  />
                                            <TooltipProvider  v-if="!isValidReceta.oi_esferico" >
                                                <Tooltip>
                                                <TooltipTrigger class="bg-transparent text-xs text-destructive ml-1"> <AsteriskIcon :size="12" /> </TooltipTrigger>
                                                <TooltipContent class="text-destructive border-destructive font-thin text-xs">
                                                    <p>Rango permitido: -35 a 35</p>
                                                </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>

                                            <Separator orientation="vertical" class="mx-4" />

                                            <p class="font-bold w-12 text-right pr-4">Cil.: </p>
                                            <Input type="decimal" v-model="currentReceta.oi_cilindrico" :class="{'w-20' : !isValidReceta.oi_cilindrico, 'w-20 mr-4': isValidReceta.oi_cilindrico}"  />
                                            <TooltipProvider  v-if="!isValidReceta.oi_cilindrico" >
                                                <Tooltip>
                                                <TooltipTrigger class="bg-transparent text-xs text-destructive ml-1"> <AsteriskIcon :size="12" /> </TooltipTrigger>
                                                <TooltipContent class="text-destructive border-destructive font-thin text-xs">
                                                    <p>Rango permitido: -10 a 10</p>
                                                </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>

                                            <Separator orientation="vertical" class="mx-4" />

                                            <p class="font-bold w-12 text-right pr-4">Eje: </p>
                                            <Input type="decimal" v-model="currentReceta.oi_eje" :class="{'w-20' : !isValidReceta.oi_eje, 'w-20 mr-4': isValidReceta.oi_eje}"  />
                                            <TooltipProvider  v-if="!isValidReceta.oi_eje" >
                                                <Tooltip>
                                                <TooltipTrigger class="bg-transparent text-xs text-destructive ml-1"> <AsteriskIcon :size="12" /> </TooltipTrigger>
                                                <TooltipContent class="text-destructive border-destructive font-thin text-xs">
                                                    <p>Rango permitido: 0 a 180</p>
                                                </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>

                                            <Separator orientation="vertical" class="mx-4" />

                                             <p class="font-bold w-12 text-right flex justify-start items-center"><ValueNoneIcon class="h-4 w-4" /> <span class="pl-2">:</span> </p>
                                            <Input type="decimal" v-model="currentReceta.oi_diametro" :class="{'w-20' : !isValidReceta.oi_diametro, 'w-20 mr-4': isValidReceta.oi_diametro}"  />
                                            <TooltipProvider  v-if="!isValidReceta.oi_diametro" >
                                                <Tooltip>
                                                <TooltipTrigger class="bg-transparent text-xs text-destructive ml-1"> <AsteriskIcon :size="12" /> </TooltipTrigger>
                                                <TooltipContent class="text-destructive border-destructive font-thin text-xs">
                                                    <p>Rango permitido: 0 a 30</p>
                                                </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Separator class="my-10 w-full" />
                <div class="flex flex-row w-full justify-start min-h-[40rem]  " >
                    <div class="flex flex-col w-[16rem] justify-start items-start">
                        <div class="flex flex-col justify-start items-start h-[18rem]">
                            <span class="form-label font-bold text-xl w-full mb-4">Queterometría</span>                                
                            <div class="flex flex-col justify-start w-100">
                                <div class="flex flex-col justify-start w-100">
                                    <div class="flex h-10 items-center justify-start">
                                        <p class=" w-12 font-semibold text-left text-sm">O.D. </p>
                                        <Input type="decimal" v-model="currentReceta.quet_m1_od" :class="{'ml-2 w-14' : !isValidReceta.quet_m1_od, 'ml-2 w-14 mr-4': isValidReceta.quet_m1_od}"  />
                                        <TooltipProvider  v-if="!isValidReceta.quet_m1_od" >
                                            <Tooltip>
                                            <TooltipTrigger class="bg-transparent text-xs text-destructive ml-2"> <AsteriskIcon :size="9" /> </TooltipTrigger>
                                            <TooltipContent class="text-destructive border-destructive font-thin text-xs">
                                                <p>Rango permitido: 0 a 90</p>
                                            </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>

                                        <Separator orientation="vertical" class="mx-4" />
                                        
                                        <Input type="decimal" v-model="currentReceta.quet_m2_od" :class="{'ml-2 w-14' : !isValidReceta.quet_m2_od, 'ml-2 w-14 mr-4': isValidReceta.quet_m2_od}"  />
                                        <TooltipProvider  v-if="!isValidReceta.quet_m2_od" >
                                            <Tooltip>
                                            <TooltipTrigger class="bg-transparent text-xs text-destructive ml-2"> <AsteriskIcon :size="9" /> </TooltipTrigger>
                                            <TooltipContent class="text-destructive border-destructive font-thin text-xs">
                                                <p>Rango permitido: 0 a 90</p>
                                            </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                    
                                    <Separator  class="my-4" />
                                    

                                    <div class=" flex h-10 items-center justify-start">
                                        <p class=" w-12 font-semibold text-left text-sm">O.I. </p>
                                        <Input type="decimal" v-model="currentReceta.quet_m1_oi" :class="{'ml-2 w-14' : !isValidReceta.quet_m1_oi, 'ml-2 w-14 mr-4': isValidReceta.quet_m1_oi}"  />
                                        <TooltipProvider  v-if="!isValidReceta.quet_m1_oi" >
                                            <Tooltip>
                                            <TooltipTrigger class="bg-transparent text-xs text-destructive ml-2"> <AsteriskIcon :size="9" /> </TooltipTrigger>
                                            <TooltipContent class="text-destructive border-destructive font-thin text-xs">
                                                <p>Rango permitido: 0 a 90</p>
                                            </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>

                                        <Separator orientation="vertical" class="mx-4" />
                                        
                                        <Input type="decimal" v-model="currentReceta.quet_m2_oi" :class="{'ml-2 w-14' : !isValidReceta.quet_m2_oi, ' ml-2 w-14 mr-4': isValidReceta.quet_m2_oi}"  />
                                        <TooltipProvider  v-if="!isValidReceta.quet_m2_oi" >
                                            <Tooltip>
                                            <TooltipTrigger class="bg-transparent text-xs text-destructive ml-2"> <AsteriskIcon :size="9" /> </TooltipTrigger>
                                            <TooltipContent class="text-destructive border-destructive font-thin text-xs">
                                                <p>Rango permitido: 0 a 90</p>
                                            </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                </div>


                                <div class="flex flex-col items-start mt-6 justify-items-start">
                                    <p class=" w-20 mb-1 font-semibold text-left text-sm">Notas </p>
                                    <Textarea type="decimal" v-model="currentReceta.observaciones_queterometria" class="resize-none" />
                                </div>
                            </div>
                        </div>
                        <Separator class="my-8 w-full" />
                        <div class="flex flex-col  justify-start items-start h-[22rem]">
                            <span class="form-label font-bold text-xl w-full mb-4">Evaluación General</span>                                
                            <div class="flex flex-col flex-wrap gap-x-4 gap-y-4 justify-start w-full">
                                <div class="items-center flex gap-x-2 min-h-[1.5rem]">
                                    <Checkbox v-model:checked="currentReceta.tonicidad"  />
                                    <label for="tonicidad"
                                        class="text-sm font-light leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Tonicidad
                                    </label>
                                </div>
                                <div class="items-center  flex gap-x-2 min-h-[1.5rem]">
                                    <Checkbox v-model:checked="currentReceta.maquillaje"  />
                                    <label for="maquillaje"
                                        class="text-sm font-light leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Maquillaje
                                    </label>
                                </div>
                                <div class="items-center w-[12rem] flex gap-x-2 min-h-[1.5rem]">
                                    <Checkbox v-model:checked="currentReceta.hendidura_palpebral"  />
                                    <label for="hendidura_palpebral"
                                        class="text-sm font-light leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Hendidura Palpebral
                                    </label>
                                </div>
                                <div class="items-center flex gap-x-2 min-h-[1.5rem]">
                                    <Checkbox v-model:checked="currentReceta.altura_palpebral"  />
                                    <label for="altura_palpebral"
                                        class="text-sm font-light leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Altura Palpebral
                                    </label>
                                </div>
                                <div class="items-center flex gap-x-2 min-h-[1.5rem]">
                                    <Checkbox v-model:checked="currentReceta.buen_parpadeo_amplitud"  />
                                    <label for="buen_parpadeo_amplitud"
                                        class="text-sm font-light leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Parpadeo: Buena amplitud
                                    </label>
                                </div>
                                <div class="items-center flex gap-x-2 min-h-[1.5rem]">
                                    <Checkbox v-model:checked="currentReceta.buen_parpadeo_ritmo"  />
                                    <label for="buen_parpadeo_ritmo"
                                        class="text-sm font-light leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Parpadeo: Buen ritmo
                                    </label>
                                </div>
                            </div>
                            <div class="flex flex-row mt-4 justify-start items-center w-100">
                                    <Label
                                        class="text-sm mr-4 font-light leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Esterometría:
                                    </Label>
                                        <Select v-model="currentReceta.estesiometria" @update:model-value="(value) => currentReceta && (currentReceta.estesiometria = value)"  >
                                            <SelectTrigger>
                                                <SelectValue class="w-[7rem] text-xs " placeholder="Seleccionar"  />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectItem class="text-xs" value="Hiperestésico">Hiperestésico</SelectItem>
                                                    <SelectItem class="text-xs" value="Normoestésico">Normoestésico</SelectItem>
                                                    <SelectItem class="text-xs" value="Hipoestésico">Hipoestésico</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                        <TooltipProvider  v-if="!isValidReceta.estesiometria" >
                                            <Tooltip>
                                            <TooltipTrigger class="bg-transparent text-xs text-destructive ml-4"> <AsteriskIcon :size="14" /> </TooltipTrigger>
                                            <TooltipContent class="text-destructive border-destructive font-thin text-xs">
                                                <p>Seleccionar estesiometría</p>
                                            </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                            </div>
                        </div>
                    </div>
                    <Separator orientation="vertical" class="mx-10 h-[43rem]" />
                    <div class="flex flex-col w-[70%] h-full   justify-between items-start">
                        <div class="flex flex-col w-[100%] justify-between items-start h-[18rem]">
                            <div class="flex flex-row justify-between w-full   h-[9rem] ">
                                <div class="flex flex-col w-90 ">
                                    <span class="form-label font-bold text-xl w-full mb-4">Marcas</span>                                
                                    <div class="flex flex-row justify-between items-center w-[100%]">
                                        <div class="flex mr-10 h-10 items-center justify-start">
                                            <p class=" w-10 font-semibold text-left text-lg">O.D. </p>                                        
                                            <Input type="decimal" v-model="currentReceta.od_marca" :class="{'ml-1 w-40' : !isValidReceta.od_marca, 'ml-1 w-40 mr-4': isValidReceta.od_marca}"  />
                                            <TooltipProvider  v-if="!isValidReceta.od_marca" >
                                                <Tooltip>
                                                <TooltipTrigger class="bg-transparent text-xs text-destructive ml-1"> <AsteriskIcon :size="12" /> </TooltipTrigger>
                                                <TooltipContent class="text-destructive border-destructive font-thin text-xs">
                                                    <p>Ingresar marca</p>
                                                </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </div>
                                        <div class="flex w-50 h-10 items-center justify-start">
                                            <p class=" w-10 font-semibold text-left text-lg">O.I. </p>                                        
                                            <Input type="decimal" v-model="currentReceta.oi_marca" :class="{'ml-1 w-40' : !isValidReceta.oi_marca, 'ml-1 w-40 mr-4': isValidReceta.oi_marca}"  />
                                            <TooltipProvider  v-if="!isValidReceta.oi_marca" >
                                                <Tooltip>
                                                <TooltipTrigger class="bg-transparent text-xs text-destructive ml-1"> <AsteriskIcon :size="12" /> </TooltipTrigger>
                                                <TooltipContent class="text-destructive border-destructive font-thin text-xs">
                                                    <p>Ingresar marca</p>
                                                </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </div>
                                    </div>
                                </div>
                                <div class="flex flex-col w-60">
                                    <span class="form-label font-bold text-xl w-full mb-4">Oftalmólogo</span> 
                                    <div class="flex flex-row">
                                        <Input v-model="currentReceta.oftalmologo"  />
                                        <TooltipProvider  v-if="!isValidReceta.oftalmologo" >
                                            <Tooltip>
                                                <TooltipTrigger class="bg-transparent text-xs text-destructive ml-1"> <AsteriskIcon :size="12" /> </TooltipTrigger>
                                                <TooltipContent class="text-destructive border-destructive font-thin text-xs">
                                                    <p>Ingresar oftalmólogo</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                        
                                </div>
                            </div>
                            <div class="flex flex-col w-full mt-[2rem] justify-start items-start h-[15rem]">
                                <span class="form-label font-bold text-xl w-full mb-4">Observaciones Receta</span> 
                                <Textarea type="decimal" v-model="currentReceta.observaciones" class="resize-none w-full h-full" />
                            </div>
                            
                        </div>
                        <Separator class="my-8 w-full" />
                        <div class="flex flex-col w-[100%] justify-between items-start min-h-[18rem]">
                            <div class="flex flex-col justify-start w-full  min-h-[16rem] ">
                                <span class="form-label font-bold text-xl w-full">Pruebas</span>
                                <div v-for="prueba, index in currentPruebas" class="flex w-full flex-row justify-between items-start">
                                <Accordion type="single" collapsible class="w-[45rem]">
                                <AccordionItem :value="`item-${index+1}`">
                                <AccordionTrigger>Prueba {{ index+1 }}</AccordionTrigger>
                                    <AccordionContent class="ml-4 pl-4 border-l-[#E5E5E5]  border-l-[0px] mb-8 min-h-[16rem]">
                                    <div class="flex flex-row min-h-10 justify-start items-center">
                                        <p class="font-bold w-14 text-sm">O.D.</p>

                                            <p class="text-sm w-12 text-right pr-4">C.B.: </p>
                                            <Input type="decimal" v-model="prueba.od_cb" :class="{'w-14 text-xs h-8' : !isValidPrueba[index]?.od_cb, 'w-14 text-xs h-8 mr-4': isValidPrueba[index]?.od_cb}"  />
                                            <TooltipProvider  v-if="!isValidPrueba[index]?.od_cb" >
                                                <Tooltip>
                                                <TooltipTrigger class="bg-transparent text-xs text-destructive ml-1"> <AsteriskIcon :size="12" /> </TooltipTrigger>
                                                <TooltipContent class="text-destructive border-destructive font-thin text-xs">
                                                    <p>Rango permitido: 0 a 20</p>
                                                </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>

                                            <Separator orientation="vertical" class="mx-2" />
                                            
                                            <p class="text-sm w-12 text-right pr-4">Esf.: </p>
                                            <Input type="decimal" v-model="prueba.od_esferico" :class="{'w-14 text-xs h-8' : !isValidPrueba[index]?.od_esferico, 'w-14 text-xs h-8 mr-4': isValidPrueba[index]?.od_esferico}"  />
                                            <TooltipProvider  v-if="!isValidPrueba[index]?.od_esferico" >
                                                <Tooltip>
                                                <TooltipTrigger class="bg-transparent text-xs text-destructive ml-1"> <AsteriskIcon :size="12" /> </TooltipTrigger>
                                                <TooltipContent class="text-destructive border-destructive font-thin text-xs">
                                                    <p>Rango permitido: -35 a 35</p>
                                                </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>

                                            <Separator orientation="vertical" class="mx-2" />

                                            <p class="text-sm w-12 text-right pr-4">Cil.: </p>
                                            <Input type="decimal" v-model="prueba.od_cilindrico" :class="{'w-14 text-xs h-8' : !isValidPrueba[index]?.od_cilindrico, 'w-14 text-xs h-8 mr-4': isValidPrueba[index]?.od_cilindrico}"  />
                                            <TooltipProvider  v-if="!isValidPrueba[index]?.od_cilindrico" >
                                                <Tooltip>
                                                <TooltipTrigger class="bg-transparent text-xs text-destructive ml-1"> <AsteriskIcon :size="12" /> </TooltipTrigger>
                                                <TooltipContent class="text-destructive border-destructive font-thin text-xs">
                                                    <p>Rango permitido: -10 a 10</p>
                                                </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>

                                            <Separator orientation="vertical" class="mx-2" />

                                            <p class="text-sm w-12 text-right pr-4">Eje: </p>
                                            <Input type="decimal" v-model="prueba.od_eje" :class="{'w-14 text-xs h-8' : !isValidPrueba[index]?.od_eje, 'w-14 text-xs h-8 mr-4': isValidPrueba[index]?.od_eje}"  />
                                            <TooltipProvider  v-if="!isValidPrueba[index]?.od_eje" >
                                                <Tooltip>
                                                <TooltipTrigger class="bg-transparent text-xs text-destructive ml-1"> <AsteriskIcon :size="12" /> </TooltipTrigger>
                                                <TooltipContent class="text-destructive border-destructive font-thin text-xs">
                                                    <p>Rango permitido: 0 a 180</p>
                                                </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>

                                            <Separator orientation="vertical" class="mx-2" />

                                             <p class="text-sm w-12 text-right flex justify-start items-center"><ValueNoneIcon class="h-4 w-4" /> <span class="pl-2">:</span> </p>
                                            <Input type="decimal" v-model="prueba.od_diametro" :class="{'w-14 text-xs h-8' : !isValidPrueba[index]?.od_diametro, 'w-14 text-xs h-8 mr-4': isValidPrueba[index]?.od_diametro}"  />
                                            <TooltipProvider  v-if="!isValidPrueba[index]?.od_diametro" >
                                                <Tooltip>
                                                <TooltipTrigger class="bg-transparent text-xs text-destructive ml-1"> <AsteriskIcon :size="12" /> </TooltipTrigger>
                                                <TooltipContent class="text-destructive border-destructive font-thin text-xs">
                                                    <p>Rango permitido: 0 a 30</p>
                                                </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                            
                                    </div>
                                    <div class="flex mt-2 flex-row min-h-10 justify-start items-center">
                                        <p class="font-bold w-14 text-sm">O.I.</p>

                                            <p class="text-sm w-12 text-right pr-4">C.B.: </p>
                                            <Input type="decimal" v-model="prueba.oi_cb" :class="{'w-14 text-xs h-8' : !isValidPrueba[index]?.oi_cb, 'w-14 text-xs h-8 mr-4': isValidPrueba[index]?.oi_cb}"  />
                                            <TooltipProvider  v-if="!isValidPrueba[index]?.oi_cb" >
                                                <Tooltip>
                                                <TooltipTrigger class="bg-transparent text-xs text-destructive ml-1"> <AsteriskIcon :size="12" /> </TooltipTrigger>
                                                <TooltipContent class="text-destructive border-destructive font-thin text-xs">
                                                    <p>Rango permitido: 0 a 20</p>
                                                </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>

                                            <Separator orientation="vertical" class="mx-2" />
                                            
                                            <p class="text-sm w-12 text-right pr-4">Esf.: </p>
                                            <Input type="decimal" v-model="prueba.oi_esferico" :class="{'w-14 text-xs h-8' : !isValidPrueba[index]?.oi_esferico, 'w-14 text-xs h-8 mr-4': isValidPrueba[index]?.oi_esferico}"  />
                                            <TooltipProvider  v-if="!isValidPrueba[index]?.oi_esferico" >
                                                <Tooltip>
                                                <TooltipTrigger class="bg-transparent text-xs text-destructive ml-1"> <AsteriskIcon :size="12" /> </TooltipTrigger>
                                                <TooltipContent class="text-destructive border-destructive font-thin text-xs">
                                                    <p>Rango permitido: -35 a 35</p>
                                                </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>

                                            <Separator orientation="vertical" class="mx-2" />

                                            <p class="text-sm w-12 text-right pr-4">Cil.: </p>
                                            <Input type="decimal" v-model="prueba.oi_cilindrico" :class="{'w-14 text-xs h-8' : !isValidPrueba[index]?.oi_cilindrico, 'w-14 text-xs h-8 mr-4': isValidPrueba[index]?.oi_cilindrico}"  />
                                            <TooltipProvider  v-if="!isValidPrueba[index]?.oi_cilindrico" >
                                                <Tooltip>
                                                <TooltipTrigger class="bg-transparent text-xs text-destructive ml-1"> <AsteriskIcon :size="12" /> </TooltipTrigger>
                                                <TooltipContent class="text-destructive border-destructive font-thin text-xs">
                                                    <p>Rango permitido: -10 a 10</p>
                                                </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>

                                            <Separator orientation="vertical" class="mx-2" />

                                            <p class="text-sm w-12 text-right pr-4">Eje: </p>
                                            <Input type="decimal" v-model="prueba.oi_eje" :class="{'w-14 text-xs h-8' : !isValidPrueba[index]?.oi_eje, 'w-14 text-xs h-8 mr-4': isValidPrueba[index]?.oi_eje}"  />
                                            <TooltipProvider  v-if="!isValidPrueba[index]?.oi_eje" >
                                                <Tooltip>
                                                <TooltipTrigger class="bg-transparent text-xs text-destructive ml-1"> <AsteriskIcon :size="12" /> </TooltipTrigger>
                                                <TooltipContent class="text-destructive border-destructive font-thin text-xs">
                                                    <p>Rango permitido: 0 a 180</p>
                                                </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>

                                            <Separator orientation="vertical" class="mx-2" />

                                             <p class="text-sm w-12 text-right flex justify-start items-center"><ValueNoneIcon class="h-4 w-4" /> <span class="pl-2">:</span> </p>
                                            <Input type="decimal" v-model="prueba.oi_diametro" :class="{'w-14 text-xs h-8' : !isValidPrueba[index]?.oi_diametro, 'w-14 text-xs h-8 mr-4': isValidPrueba[index]?.oi_diametro}"  />
                                            <TooltipProvider  v-if="!isValidPrueba[index]?.oi_diametro" >
                                                <Tooltip>
                                                <TooltipTrigger class="bg-transparent text-xs text-destructive ml-1"> <AsteriskIcon :size="12" /> </TooltipTrigger>
                                                <TooltipContent class="text-destructive border-destructive font-thin text-xs">
                                                    <p>Rango permitido: 0 a 30</p>
                                                </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>

                                    </div>
                                    <div class="flex flex-col mt-8">
                                    <div class="flex flex-row flex-wrap gap-y-4 mb-8">
                                        <div class="items-center w-[12rem] flex gap-x-2 min-h-[1.5rem]">
                                            <Checkbox v-model:checked="prueba.confort"  />
                                            <label for="confort"
                                                class="text-sm font-light leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                            Confort
                                            </label>
                                        </div>
                                        <div class="items-center w-[12rem]  flex gap-x-2 min-h-[1.5rem]">
                                            <Checkbox v-model:checked="prueba.movilidad"  />
                                            <label for="movilidad"
                                                class="text-sm font-light leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                            Movilidad
                                            </label>
                                        </div>
                                        <div class="items-center w-[12rem] flex gap-x-2 min-h-[1.5rem]">
                                            <Checkbox v-model:checked="prueba.centraje"  />
                                            <label for="centraje"
                                                class="text-sm font-light leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                            Centraje
                                            </label>
                                        </div>
                                        <div class="items-center w-[12rem] flex gap-x-2 min-h-[1.5rem]">
                                            <Checkbox v-model:checked="prueba.hiperemia"  />
                                            <label for="hiperemia"
                                                class="text-sm font-light leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                            Hiperemia
                                            </label>
                                        </div>
                                        <div class="items-center w-[12rem] flex gap-x-2 min-h-[1.5rem]">
                                            <Checkbox v-model:checked="prueba.agudeza_visual"  />
                                            <label for="agudeza_visual"
                                                class="text-sm font-light leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                            Agudeza visual
                                            </label>
                                        </div>
                                        <div class="items-center w-[12rem] flex gap-x-2 min-h-[1.5rem]">
                                            <Checkbox v-model:checked="prueba.od_edema"  />
                                            <label for="od_edema"
                                                class="text-sm font-light leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                            OD Edema 
                                            </label>
                                        </div>
                                        <div class="items-center w-[12rem] flex gap-x-2 min-h-[1.5rem]">
                                            <Checkbox v-model:checked="prueba.oi_edema"  />
                                            <label for="oi_edema"
                                                class="text-sm font-light leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                            OI Edema 
                                            </label>
                                        </div>
                                        </div>

                                        <div class="flex flex-row ">
                                            <p class="text-sm w-24 text-right flex justify-start items-center">Marcas:</p>
                                            <div class="items-center w-[12rem] flex gap-x-2 min-h-[1.5rem] mr-8">
                                                <p class="text-sm text-right flex justify-start items-center">OD:</p>
                                                <Input type="decimal" v-model="prueba.od_marca" class="w-32 text-xs h-8 mr-4"  />
                                            </div>
                                            <div class="items-center w-[12rem] flex gap-x-2 min-h-[1.5rem]">
                                                <p class="text-sm text-right flex justify-start items-center">OI:</p>
                                                <Input type="decimal" v-model="prueba.oi_marca" class="w-32 text-xs h-8 mr-4"  />
                                            </div>
                                        </div>
                                    </div>
                                    </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                                <Button variant="ghost" type="button" size="icon" class="ml-2 mt-2 text-red-400 "  @click="currentPruebas.splice(index, 1)"><Cross2Icon /></Button>
                            </div>
                                <Button variant="outline" type="button" size="sm" class="mt-6 w-32 py-2 font-italic bg-secondary text-gray-600 border-b-2"  @click="addPrueba()"> <PlusIcon /> Nueva Prueba</Button>
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
    <div v-else class="page">
        <div class="pt-2 mb-4 " >
            <div  class="forms-wide flex flex-col justify-between items-start px-[5rem] ">
                <div class="w-full ">
                    <h3 class="page-subtitle text-center">Receta con id {{ route.params.id }} no encontrada</h3>
                </div>
            </div>
        </div>
    </div>
</template>