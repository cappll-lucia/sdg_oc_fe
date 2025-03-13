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
import router from '@/router';
import { SlashIcon } from 'lucide-vue-next';
import {computed, onMounted, ref} from 'vue';


const selectedCliente = ref<Cliente | null>(null);
const searchClienteOpen = ref<boolean>(false);
const loading = ref<boolean>(false);
const foundClientes = ref<Cliente[]>([]);



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
    observaciones: boolean,
    fecha: boolean,
    cliente: boolean,
}>({
    tipoReceta: true,
    oftalmologo: true,
    cristal: true,
    color: true,
    tratamiento: true,
    observaciones: true,
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
    // TODO pagination
    foundClientes.value = await clientesApi.getAll();
})

const onSubmit = async()=>{
    try {
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
        console.log(newRecetaObj)
        await recetasApi.createRecetaAereos(newRecetaObj)
        loading.value=false;
        toast({
            title: 'Receta registrada con éxito',
        })
        router.replace('/recetas')
    } catch (err: any) {
        // errorMessage.value=err.message as string
        // showError.value = true;
        // loading.value=false;
        console.log(err)
    };
}


const handleSelectCliente = (cliente:Cliente)=>{
    selectedCliente.value=cliente;
    newReceta.value.cliente.id=cliente.id;
    searchClienteOpen.value=false;
}

const validateAndSubmit = async()=>{
    loading.value = true;
    const validDetalle = validateDetalles()
    const resultReceta = createRecetaAereosCustomValidator(newReceta.value, fechaReceta.value)
    isValidReceta.value = resultReceta.isValid
    if(validDetalle && resultReceta.success){
        await onSubmit();
        console.log('ok')
    }
    loading.value = false;
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
                    <BreadcrumbPage>Nueva</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
        <div class="pt-2 mb-4 " >
            <form @submit.prevent="validateAndSubmit" class="forms-wide flex flex-col justify-between items-start px-[5rem] ">
                <div class="w-full ">
                    <h3 class="page-subtitle text-center">Nueva Recta - Anteojos Recetados</h3>
                    <Separator class="my-6 w-full" />
                </div>
                <div class="flex flex-col w-full  justify-between items-start">
                     <div class="flex flex-col w-full  justify-between items-start">
                         <div class="flex flex-col w-full">
                         <div class="flex flex-row w-full justify-between">
                            <!-- Cliente -->
                            <div class="h-[5rem] mt-8  w-[25%]">
                                    <div class="form-item-wide justify-start">
                                        <Label class="form-label w-[4rem]  text-left">Cliente</Label>
                                        <div class="flex flex-row justify-end items-center">
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
                                            <Label class="text-destructive w-10 text-center text-2lg error-cliente" v-if="!isValidReceta.cliente"> * </Label>
                                        </div>
                                    </div>
                                </div>

                                <!-- Fecha -->
                                 <div class="h-[5rem] w-[30%]  flex flex-col justify-start items-end mt-8">
                                    <div class="flex items-center justify-start w-full">
                                        <Label class="w-[25%]  mr-2">Fecha Receta</Label>
                                        <div class="flex gap-2 w-[60%]">
                                        <Input type="text" v-model="fechaReceta.day" placeholder="DD" class="w-16 text-center" maxlength="2" />
                                        <Input type="text" v-model="fechaReceta.month" placeholder="MM" class="w-16 text-center" maxlength="2" />
                                        <Input type="text" v-model="fechaReceta.year" placeholder="AAAA" class="w-20 text-center" maxlength="4" />
                                        </div>
                                        <Label class="text-destructive w-5 text-center  text-2lg" v-if="!isValidReceta.fecha"> * </Label>
                                    </div>
                                </div>

                                <!-- TipoReceta -->
                                <div class="h-[5rem] w-[30%] mt-8">
                                    <div class="form-item-wide mb-2">
                                        <Label class="w-[8rem]">Tipo Receta</Label>
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
                                        <Label class="text-destructive w-5 text-center ml-4 text-2lg" v-if="!isValidReceta.tipoReceta">*</Label>
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
                                        <div class="flex  h-10 items-center">
                                            <p class="font-bold w-20 text-lg">O.D.</p>

                                            <p class="font-bold w-12 text-right pr-4">Esf.: </p>
                                            <Input type="decimal" class="w-20" v-model="currentDetalleCerca.od_esferico" />
                                            
                                            <Separator orientation="vertical" class="mx-4" />

                                            <p class="font-bold w-12 text-right pr-4">Cil.:</p>
                                            <Input type="decimal" class="w-20" v-model="currentDetalleCerca.od_cilindrico" />

                                            <Separator orientation="vertical" class="mx-4 " />

                                            <p class="font-bold w-12 text-right pr-4">A:</p>
                                            <Input type="number" class="w-20" v-model="currentDetalleCerca.od_grados" />
                                            <p class="ml-4"> °</p>
                                        </div>

                                        <Separator class="my-4" />

                                        <div class="flex  h-10 items-center">
                                            <p class="font-bold w-20 text-lg">O.I.</p>

                                            <p class="font-bold w-12 text-right pr-4">Esf.: </p>
                                            <Input type="decimal" class="w-20" v-model="currentDetalleCerca.oi_esferico" />
                                            
                                            <Separator orientation="vertical" class="mx-4" />

                                            <p class="font-bold w-12 text-right pr-4">Cil.:</p>
                                            <Input type="decimal" class="w-20" v-model="currentDetalleCerca.oi_cilindrico" />

                                            <Separator orientation="vertical" class="mx-4 " />

                                            <p class="font-bold w-12 text-right pr-4">A:</p>
                                            <Input type="number" class="w-20" v-model="currentDetalleCerca.oi_grados" />
                                            <p class="ml-4"> °</p>
                                        

                                        </div>
                                    </div>
                                    <Separator orientation="vertical" class="w-20" />
                                    <div class="pr-4">
                                        <p class=" font-bold w-20 text-center mb-2">DNP</p>
                                        <Input type="number" class="w-20" v-model="currentDetalleCerca.dnp" />
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
                                            <Input type="decimal" class="w-20" v-model="currentDetalleLejos.od_esferico" />
                                            
                                            <Separator orientation="vertical" class="mx-4" />

                                            <p class="font-bold w-12 text-right pr-4">Cil.:</p>
                                            <Input type="decimal" class="w-20" v-model="currentDetalleLejos.od_cilindrico" />

                                            <Separator orientation="vertical" class="mx-4 " />

                                            <p class="font-bold w-12 text-right pr-4">A:</p>
                                            <Input type="number" class="w-20" v-model="currentDetalleLejos.od_grados" />
                                            <p class="ml-4"> °</p>
                                        </div>

                                        <Separator class="my-4" />

                                        <div class="flex  h-10 items-center">
                                            <p class="font-bold w-20 text-lg">O.I.</p>

                                            <p class="font-bold w-12 text-right pr-4">Esf.: </p>
                                            <Input type="decimal" class="w-20" v-model="currentDetalleLejos.oi_esferico" />
                                            
                                            <Separator orientation="vertical" class="mx-4" />

                                            <p class="font-bold w-12 text-right pr-4">Cil.:</p>
                                            <Input type="decimal" class="w-20" v-model="currentDetalleLejos.oi_cilindrico" />

                                            <Separator orientation="vertical" class="mx-4 " />

                                            <p class="font-bold w-12 text-right pr-4">A:</p>
                                            <Input type="number" class="w-20" v-model="currentDetalleLejos.oi_grados" />
                                            <p class="ml-4"> °</p>
                                        

                                        </div>
                                    </div>
                                    <Separator orientation="vertical" class="w-20" />
                                    <div class="pr-4">
                                        <p class=" font-bold w-20 text-center mb-2">DNP</p>
                                        <Input type="number" class="w-20" v-model="currentDetalleLejos.dnp" />
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
                                            <Label class="text-destructive w-5 text-center ml-4 text-2lg" v-if="!isValidReceta.cristal">*</Label>
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
                                            <Label class="text-destructive w-5 text-center ml-4 text-2lg" v-if="!isValidReceta.color">*</Label>
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
                                            <Label class="text-destructive w-5 text-center ml-4 text-2lg" v-if="!isValidReceta.tratamiento">*</Label>
                                        </div>
                                    </div>

                                </div>
                        </div>
                        <div class="flex flex-col mt-6  w-[60%] justify-start items-start">
                                <div class="flex flex-row justify-between w-full">
                                    <Label class="form-label text-right mr-4 w-[8rem]">Observaciones</Label>    
                                    <Textarea
                                        class="resize-none w-[80%] h-[7.5rem]"
                                        v-model="newReceta.observaciones"
                                    />                            
                                </div>
                                <div class="flex flex-row justify-between items-center w-full mt-5">
                                    <div class="flex flex-row justify-between items-center w-full mt-5">
                                        <Label class="form-label text-right mr-4 w-[8rem]">Armazón</Label>    
                                        <Input
                                            class="resize-none w-[60%]"
                                            v-model="newReceta.armazon"
                                        />                            
                                    </div>
                                    <div class="flex flex-row justify-between items-center w-full mt-5">
                                        <Label class="form-label text-right mr-4 w-[8rem]">Oftalmólogo</Label>    
                                        <Input
                                            class="resize-none w-[60%] "
                                            v-model="newReceta.oftalmologo"
                                        />                            
                                    </div>
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
    </div>
</template>


<style>
</style>