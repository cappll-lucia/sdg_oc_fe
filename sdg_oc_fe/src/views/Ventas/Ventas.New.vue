<script setup lang="ts">
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { SlashIcon, PlusIcon, Cross2Icon, ArrowRightIcon, MagicWandIcon } from '@radix-icons/vue';
import { computed, onMounted, ref } from 'vue';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Cliente } from '@/api/entities/clientes';
import { createVentaValidator } from '@/api/entities/venta';
import SelectClienteDialog from '@/components/SelectClienteDialog.vue';
import SelectProductoDialog from '@/components/SelectProductoDialog.vue';
import { toTypedSchema } from '@vee-validate/zod';
import { Producto } from '@/api/entities/producto';
import { toast } from '@/components/ui/toast'
import Label from '@/components/ui/label/Label.vue';
import { TipoMedioDePagoEnum, RedDePago } from '@/api/entities/mediosDePago';
import { useForm } from 'vee-validate';
import { ventasApi } from '@/api/libs/ventas';
import router from '@/router';

const showError = ref<boolean>(false);
const errorMessage =ref<string>('');
const selectedCliente = ref<Cliente>();
const searchClienteOpen =ref<boolean>(false);
const searchProductoOpen =ref<boolean>(false);
const showMedioPago = ref<boolean>(false);
const submitted = ref<boolean>(false);
const lineasDeVenta = ref<{producto: {id:number, descripcion: string}, cantidad: number, precioIndividual: number}[] >([]);
const mediosDePago = ref<{importe: number, tipoMedioPago: TipoMedioDePagoEnum|string, redDePago:RedDePago|undefined, entidadBancaria:string|undefined}[]>([]);
const porcDto = ref<number>(0);
const dto=ref<boolean>(false)

const agregarLineaVenta = () => {
    lineasDeVenta.value.push({
        producto: {id: 0, descripcion:''},
        cantidad: 1,
        precioIndividual: 0
    });
};

const agregarMedioPago=()=>{
    mediosDePago.value.push({
        importe: 0,
        tipoMedioPago: '',
        redDePago: undefined,
        entidadBancaria: undefined
    })
}

const eliminarLineaVenta = (index: number) => {
    lineasDeVenta.value.splice(index, 1);
};

const eliminarMedioPago = (index: number) => {
    mediosDePago.value.splice(index, 1);
};

const agregarPagoDefault = ()=>{
    mediosDePago.value.push({
        importe: totalVentaNeto.value,
        tipoMedioPago: TipoMedioDePagoEnum.EFECTIVO,
        redDePago: undefined,
        entidadBancaria: undefined
    })
}




const formSchema = toTypedSchema(createVentaValidator);
const {handleSubmit, setFieldValue, errors} = useForm({
    validationSchema: formSchema,
        initialValues: {
        fecha: new Date().toISOString(),
        descuentoPorcentaje: 0,
        cliente: { id: undefined },
        lineasDeVenta: [],
        mediosDePago: []
    }
})

const onSubmit = handleSubmit(async(values)=>{
    try{
        await ventasApi.create(values)
        router.replace('/ventas');
        toast({ title: 'Venta registrada' });
    }catch (err: any) {
        errorMessage.value = err.message as string;
        showError.value = true;
  }
})

const validateAndSubmit = async()=>{
    submitted.value=true
    setFieldValue("descuentoPorcentaje", porcDto.value);
    if(isLastLineaEmpty.value){
        lineasDeVenta.value.pop();
    }    
    setFieldValue("lineasDeVenta", lineasDeVenta.value.map(linea => ({
        producto: { id: linea.producto.id ?? 0 },
        cantidad: linea.cantidad,
        precioIndividual: linea.precioIndividual ?? 0
    })));
    setFieldValue("mediosDePago", mediosDePago.value.map(medio => ({
        importe: medio.importe ?? 0,  
        tipoMedioDePago: medio.tipoMedioPago,
        redDePago: medio.redDePago ?? undefined,
        entidadBancaria: medio.entidadBancaria ?? undefined
    })));
    submitted.value = true;
    await onSubmit();
}


onMounted(async () => {
    agregarLineaVenta();
});


const handleSelectCliente = (cliente:Cliente)=>{
    selectedCliente.value=cliente;
    setFieldValue("cliente.id", selectedCliente.value.id);
    searchClienteOpen.value=false;
}

const hanldeSelectProducto = (_producto: Producto)=>{
    const existingLinea = lineasDeVenta.value.find(linea => linea.producto.id === _producto.id);
    if(existingLinea){
        existingLinea.cantidad+=1;
        toast({
            title: 'Producto ya seleccionado',
            description: 'Se agregó una unidad.',

        })
    }else{
        lineasDeVenta.value[lineasDeVenta.value.length-1]={
           producto: { id: _producto.id, descripcion: _producto.descripcion},
           cantidad:1,
           precioIndividual: _producto.precio
       }
    }
    searchProductoOpen.value =false;
}


const isLastLineaEmpty = computed(()=>{
    const lastItem = lineasDeVenta.value[lineasDeVenta.value.length - 1];
    return lastItem 
        ? !lastItem.producto.id &&
          lastItem.producto.descripcion === '' &&
          !lastItem.precioIndividual
        : false;
})

const totalVentaBruto = computed(()=>{
    return lineasDeVenta.value.reduce((total, linea) => {
        return total + (linea.precioIndividual ? linea.precioIndividual * linea.cantidad : 0);
    }, 0);
})

const montoDto = computed(()=>{
    return totalVentaBruto.value * porcDto.value / 100
})

const totalVentaNeto = computed(()=>{
    return totalVentaBruto.value - montoDto.value
})

const importeIngresado = computed<number>(() => {
    return mediosDePago.value.reduce((total, medioPago) => {
        return total + (medioPago.importe || 0);
    }, 0);
});

const getProductoIdDisplay = (id: number) => {
    return id === 0 ? '' : id;
};


const autocompleteMedioPagoImporte=(index: number)=>{
    if(mediosDePago.value[index]){    
        mediosDePago.value[index].importe = totalVentaNeto.value - importeIngresado.value
    }else{
        console.log('as')
    }
    
}



</script>


<template>
    <div class="page">
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink href="/">Inicio</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                    <SlashIcon />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                    <BreadcrumbLink href="/ventas">Ventas</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                    <SlashIcon />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                    <BreadcrumbPage>Nueva Venta</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
        <h1 class="page-title">Nueva Venta</h1>
        <div class="pt-2">
            <div class="flex flex-row justify-between items-center py-4 ">
                <div class="rounded-[0.5rem] w-full h-auto flex flex-col justify-start items-start">
                    <div class="flex flex-col sm:flex-row sm:justify-between w-full items-center border rounded-lg p-8">
                        <FormField v-slot="{ errorMessage }" name="cliente.id">
                            <FormItem class="h-[3rem] w-[60%] flex items-center justify-start">
                                <FormLabel class="form-label w-[8rem]  h-[1.2rem] text-lg">Cliente</FormLabel>
                                <div class="flex flex-row justify-start items-center w-full">
                                    <FormControl>
                                        <Input type="text" 
                                            class="w-full sm:w-[20rem] h-10"
                                            readonly
                                            :value="selectedCliente ? `${selectedCliente.apellido}, ${selectedCliente.nombre}` : 'Buscar'"
                                            @click="searchClienteOpen = true"
                                        />
                                    </FormControl>
                                    <SelectClienteDialog
                                        v-model="searchClienteOpen"
                                        title="Nueva Venta: Seleccionar Cliente"
                                        @select-cliente="handleSelectCliente"
                                    />
                                </div>
                                <FormMessage class="ml-[1rem] w-[20rem] " v-if="submitted && errorMessage">{{ errorMessage }}</FormMessage>
                            </FormItem>
                        </FormField>
                        <div class="date w-auto sm:w-[10rem] text-center">
                            <Label>Fecha: {{ new Date().toLocaleDateString('es-ES') }}</Label>
                        </div>
                    </div>

                    <div class="flex flex-col w-full justify-start items-start border rounded-lg p-8 mt-10">
                        <h3 class="page-subtitle">Detalle</h3>

                        <div class="linea-venta-header bg-secondary mt-4 rounded-lg">
                            <span>ID</span>
                            <span class="text-left">DESCRIPCIÓN</span>
                            <span>IMPORTE UNITARIO</span>
                            <span>CANTIDAD</span>
                            <span>IMPORTE TOTAL</span>
                            <span></span>
                        </div>

                        <div v-for="(linea, index) in lineasDeVenta" :key="index" class="linea-venta-item">
                            <Input
                                @click="searchProductoOpen = true" 
                                :model-value="getProductoIdDisplay(linea.producto.id)" 
                                readonly class="rounded-lg cursor-default focus:outline-none focus:border-none text-center id-input" 
                                type="text" 
                            />
                            <Input
                                @click="searchProductoOpen = true" 
                                :model-value="linea.producto.descripcion" 
                                readonly class="rounded-lg cursor-default focus:outline-none focus:border-none text-left descripcion-input" 
                                type="text"
                            />
                            <Input
                                :value="linea.precioIndividual?.toFixed(2)" 
                                readonly class="rounded-lg cursor-default border-none focus:outline-none  focus:border-none  text-center" 
                            />
                            <Input
                                :model-value="linea.cantidad" 
                                @update:model-value="(value)=>{
                                    if(lineasDeVenta[index]){
                                        lineasDeVenta[index].cantidad=Number(value)
                                    }
                                }"
                                class="rounded-lg text-center focus:outline-none focus:border-none " 
                                type="number"  min="1" 
                            />
                            <Input
                                readonly class="rounded-lg cursor-default border-none focus:outline-none focus:border-none text-center" 
                                :value="linea.precioIndividual ? (linea.precioIndividual * linea.cantidad).toFixed(2) : ''"  
                            />
                            
                            <Button size="icon" variant="ghost" @click="eliminarLineaVenta(index)"> <Cross2Icon /> </Button>
                            
                            <SelectProductoDialog 
                                v-model="searchProductoOpen"
                                title="Seleccionar Producto"
                                @select-producto="hanldeSelectProducto"
                            />
                        </div>

                         <div v-if="submitted && Object.keys(errors).length && errors.lineasDeVenta" class="text-destructive">
                            <p>
                                {{ errors.lineasDeVenta }}
                            </p>
                        </div>

                        <Button variant="outline" class="mt-4" :disabled="isLastLineaEmpty"  @click="agregarLineaVenta">Agregar <PlusIcon /></Button>

                        
                        <div class="w-full flex flex-row justify-start mt-10">
                            <div class="w-[25%] flex flex-col justify-start  items-start">
                            <div class="w-full flex flex-row justify-between  items-center">
                                <h3 class="page-subtitle">Aplicar Descuento</h3>
                                <Switch :model-value="dto" @update:model-value="dto=!dto"></Switch>
                            </div>
                            <div v-if="dto" class="flex flex-row items-center">
                                    <Label class="w-[5.5rem]">Porcentaje: </Label>
                                    <Input 
                                    class="w-14 mr-2 text-center" 
                                        :model-value="porcDto" 
                                        @update:model-value="(value) => {
                                            porcDto = Number(value) || 0;
                                        }"
                                    />
                                    <Label>%</Label>
                                </div>
                            </div>
                            <div v-if="!porcDto" class="w-full flex justify-end mt-4">
                                <Label class="page-subtitle w-[10rem]">Importe Final: </Label>
                                <Label class="page-subtitle w-[11rem]">$ {{ totalVentaBruto.toFixed(2) }}</Label>
                            </div>
                            <div v-if="porcDto" class="w-full flex flex-col">
                                <div class=" flex  justify-end mt-4">
                                    <Label class=" w-[10rem]">Importe Total: </Label>
                                    <Label class=" w-[11rem]">$ {{ totalVentaBruto.toFixed(2) }}</Label>
                                </div>
                                <div class=" flex  justify-end items-center mt-4">
                                    <Label class=" w-[10rem]">Descuento: </Label>
                                    <Label class=" w-[11rem]">- $ {{ montoDto.toFixed(2) }}</Label>
                                </div>
                                <div class=" flex  justify-end mt-4">
                                    <Label class="page-subtitle w-[10rem]">Importe Final: </Label>
                                    <Label class="page-subtitle w-[11rem]">$ {{ totalVentaNeto.toFixed(2) }}</Label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div  v-if="!showMedioPago" class="w-full flex justify-end mt-4">
                        <Button @click="()=>{showMedioPago=true; agregarPagoDefault()}">Continuar <ArrowRightIcon /></Button>
                    </div>


                    <div v-if="showMedioPago" class="flex flex-col w-full justify-start items-start border rounded-lg p-8 mt-10">
                        <h3 class="page-subtitle mb-4">Medios de Pago</h3>
                        <div v-for="(medio, index) in mediosDePago" class="medio-pago-item items-center flex flex-row w-full justify-start gap-5 mb-4">
                            <Select 
                                :modelValue="medio.tipoMedioPago" 
                                @update:modelValue="(value) => {
                                    if (mediosDePago[index]) {
                                        mediosDePago[index].tipoMedioPago = value as TipoMedioDePagoEnum;
                                    }
                                }"
                            >

                                <SelectTrigger  class="w-[15rem]">
                                <SelectValue placeholder="Medio De Pago" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem 
                                            v-for="tipo in TipoMedioDePagoEnum" 
                                            :key="tipo" 
                                            :value="tipo"
                                        >
                                            {{ tipo }}
                                        </SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <div class=" w-[13rem] flex flex-row justify-start items-center">

                                <Label class=" ml-6 mr-2">$</Label>
                                <Input
                                :model-value="medio.importe" 
                                @update:model-value="(value)=>{
                                    if(mediosDePago[index]){
                                        mediosDePago[index].importe=Number(value)
                                    }
                                }"
                                 class=" w-[8rem] cursor-default  focus:outline-none focus:border-none " 
                                 placeholder="Importe"
                                 /> 
                                 <Button size="sm" variant="ghost"  v-if=" index && mediosDePago.length>1" @click="autocompleteMedioPagoImporte(index)"  > <MagicWandIcon/> </Button>
                                </div>
                            <Select 
                                v-if="medio.tipoMedioPago && medio.tipoMedioPago!=TipoMedioDePagoEnum.EFECTIVO"
                                :modelValue="medio.redDePago" 
                                @update:modelValue="(value) => {
                                    if (mediosDePago[index]) {
                                        mediosDePago[index].redDePago = value as RedDePago;
                                    }
                                }"
                            >

                                <SelectTrigger  class="w-[15rem]">
                                <SelectValue placeholder="Red De Pago" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem 
                                            v-for="red in RedDePago" 
                                            :key="red" 
                                            :value="red"
                                        >
                                            {{ red }}
                                        </SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <Input
                                v-if="medio.tipoMedioPago && medio.tipoMedioPago!=TipoMedioDePagoEnum.EFECTIVO"
                                :model-value="medio.entidadBancaria" 
                                 @update:modelValue="(value) => {
                                    if (mediosDePago[index]) {
                                        mediosDePago[index].entidadBancaria = value as RedDePago;
                                    }
                                }"
                                 class=" w-[15rem] cursor-default  focus:outline-none focus:border-none " 
                                placeholder="Entidad Bancaria"
                            /> 
                            <Button size="icon" variant="ghost" @click="eliminarMedioPago(index)"> <Cross2Icon /> </Button>

                        </div>
                        <div v-if="submitted && Object.keys(errors).length && errors.mediosDePago" class="text-destructive">
                            <p>
                                {{ errors.mediosDePago }}
                            </p>
                        </div>
                        <Button variant="outline" class="mt-4"  @click="agregarMedioPago">Agregar Medio de Pago <PlusIcon /></Button>

                    </div>

                    <div  v-if="showMedioPago" class="w-full flex justify-end mt-4">
                        <Button @click="()=>validateAndSubmit()">Confirmar Venta <ArrowRightIcon /></Button>
                    </div>
                </div>
            </div>
        </div>
        <AlertError 
            v-model="showError"
            title="Error"
            :message="errorMessage"
            button="Aceptar"
            :action="()=>{showError=false}"
        />
    </div>
</template>

<style scoped>

.page div div{
    max-width: 80rem;
}

.linea-venta-header {
    display: grid;
    grid-template-columns: 0.5fr 3fr 1fr 0.5fr 1fr 0.2fr;
    gap: 0.5rem;
    font-weight: bold;
    text-align: center;
    padding: 0.75rem;
    width: 100%;
}

.linea-venta-header:first-child{
    border-radius: 1rem 0 5rem 0 1rem;
}

.linea-venta-item {
    display: grid;
    grid-template-columns: 0.5fr 3fr 1fr 0.5fr 1fr 0.1fr;
    gap: 0.5rem;
    align-items: center;
    padding: 0.5rem 0;
    width: 100%;
}


.id-input {
    width: 100%;
    min-width: 4rem;
    text-align: center;
}


.descripcion-input {
    width: 100%;
    min-width: 12rem;
    max-width: 100%;
    text-align: start;
}

@media (max-width: 768px) {
    .linea-venta-header {
        grid-template-columns: 1fr 2fr;
    }

    .linea-venta-item {
        grid-template-columns: 1fr 2fr;
    }

    .id-input {
        min-width: 3rem;
        max-width: 4rem;
    }

    .descripcion-input {
        min-width: 10rem;
    }
}

</style>

