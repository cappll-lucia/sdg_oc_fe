<script setup lang="ts">
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { SlashIcon, PlusIcon, Cross2Icon } from '@radix-icons/vue';
import { computed, onMounted, ref } from 'vue';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { Venta, createVentaValidator } from '@/api/entities/venta';
import { LineaVenta } from '@/api/entities/LineaVenta';
import SelectClienteDialog from '@/components/SelectClienteDialog.vue';
import SelectProductoDialog from '@/components/SelectProductoDialog.vue';
import Separator from '@/components/ui/separator/Separator.vue';
import { toTypedSchema } from '@vee-validate/zod';
import { Producto } from '@/api/entities/producto';
import { toast } from '@/components/ui/toast'
import Label from '@/components/ui/label/Label.vue';


const selectedCliente = ref<Cliente>();
const searchClienteOpen =ref<boolean>(false);
const searchProductoOpen =ref<boolean>(false);
const submitted = ref<boolean>(false);
const lineasDeVenta = ref<{producto: {id:number|undefined, descripcion: string}, cantidad: number, precioIndividual: number|undefined}[] >([]);


const agregarLineaVenta = () => {
    lineasDeVenta.value.push({
        producto: {id: undefined, descripcion:''},
        cantidad: 1,
        precioIndividual: undefined
    });
};

const eliminarLineaVenta = (index: number) => {
    lineasDeVenta.value.splice(index, 1);
};


// const formSchema = toTypedSchema(createVentaValidator);
// const {handleSubmit, setFieldValue} = useForm({
//     validationSchema: formSchema
// })

onMounted(async () => {
    agregarLineaVenta();
});


const handleSelectCliente = (cliente:Cliente)=>{
    selectedCliente.value=cliente;
   // setFieldValue("cliente.id", selectedCliente.value.id);
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
        if (!isLastLineaEmpty) agregarLineaVenta()
        lineasDeVenta.value[lineasDeVenta.value.length-1]={
           producto: { id: _producto.id, descripcion: _producto.descripcion},
           cantidad:1,
           precioIndividual: _producto.precio
       }
       agregarLineaVenta();
    }
    searchProductoOpen.value =false;
}


const isLastLineaEmpty = computed(()=>{
    const lastItem = lineasDeVenta.value[lineasDeVenta.value.length - 1];
    return lastItem 
        ? lastItem.producto.id === undefined &&
          lastItem.producto.descripcion === '' &&
          lastItem.cantidad === 1 &&
          lastItem.precioIndividual === undefined
        : false;
})

const totalVenta = computed(()=>{
    return lineasDeVenta.value.reduce((total, linea) => {
        return total + (linea.precioIndividual ? linea.precioIndividual * linea.cantidad : 0);
    }, 0);
})

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
                    <BreadcrumbPage>Productos</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
        <h1 class="page-title">Nueva Venta</h1>
        <div class="pt-2">
            <div class="flex flex-row justify-between items-center py-4 ">
                <div class="rounded-[0.5rem] w-full h-auto flex flex-col justify-start items-start">
                    <div class="flex flex-col sm:flex-row sm:justify-between w-full items-center">
                        <FormField v-slot="{ errorMessage }" name="cliente.id">
                            <FormItem class="h-[3rem] w-full sm:w-auto flex items-center justify-start">
                                <FormLabel class="form-label w-[5rem] h-[1.2rem] text-lg">Cliente</FormLabel>
                                <div class="flex flex-row justify-end items-center w-full">
                                    <FormControl>
                                        <Input type="text" 
                                            class="w-full sm:w-[24rem] h-10"
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
                                <FormMessage class="ml-[3rem]" v-if="submitted && errorMessage">{{ errorMessage }}</FormMessage>
                            </FormItem>
                        </FormField>
                        <div class="date w-auto sm:w-[10rem] text-center">
                            <Label>Fecha: {{ new Date().toLocaleDateString('es-ES') }}</Label>
                        </div>
                    </div>

                    <Separator class="my-6" />

                    <div class="flex flex-col w-full justify-start items-start">
                        <h3 class="page-subtitle">Detalle</h3>

                        <div class="linea-venta-header bg-secondary mt-4 rounded-lg">
                            <span>ID</span>
                            <span class="text-left ml-6">DESCRIPCIÓN</span>
                            <span>IMPORTE UNITARIO</span>
                            <span>CANTIDAD</span>
                            <span>IMPORTE TOTAL</span>
                            <span></span>
                        </div>

                        <div v-for="(linea, index) in lineasDeVenta" :key="index" class="linea-venta-item">
                            <Input
                                @click="searchProductoOpen = true" 
                                v-model="linea.producto.id" 
                                readonly class="rounded-lg cursor-default focus:outline-none focus:border-none text-center id-input" 
                                type="text" 
                            />
                            <Input
                                @click="searchProductoOpen = true" 
                                v-model="linea.producto.descripcion" 
                                readonly class="rounded-lg cursor-default focus:outline-none focus:border-none text-left descripcion-input" 
                                type="text"
                            />
                            <Input
                                :value="linea.precioIndividual?.toFixed(2)" 
                                readonly class="rounded-lg cursor-default  focus:outline-none focus:border-none  text-center" 
                            />
                            <Input
                                v-model="linea.cantidad"
                                class="rounded-lg text-center focus:outline-none focus:border-none " 
                                type="number"  min="1" 
                            />
                            <Input
                                readonly class="rounded-lg cursor-default  focus:outline-none focus:border-none text-center" 
                                :value="linea.precioIndividual ? (linea.precioIndividual * linea.cantidad).toFixed(2) : ''"  
                            />
                            
                            <Button size="icon" variant="ghost" @click="eliminarLineaVenta(index)"> <Cross2Icon /> </Button>
                            
                            <SelectProductoDialog 
                                v-model="searchProductoOpen"
                                title="Seleccionar Producto"
                                @select-producto="hanldeSelectProducto"
                            />
                        </div>

                        <Button variant="outline" class="mt-4" :disabled="isLastLineaEmpty"  @click="agregarLineaVenta">Agregar <PlusIcon /></Button>
                        
                        <div class="w-full flex justify-end mt-4">
                            <Label class="page-subtitle w-[10rem]">Importe Final: </Label>
                            <Label class="page-subtitle w-[20rem]">$ {{ totalVenta.toFixed(2) }}</Label>
                        </div>

                    </div>

                    <Separator class="my-10" />
                    <div class="flex flex-col w-full justify-start items-start">
                        <h3 class="page-subtitle">Medios de Pago</h3>

                    </div>

                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>

.page div div{
    max-width: 80rem;
}

.linea-venta-header {
    display: grid;
    grid-template-columns: 0.5fr 3fr 1fr 0.4fr 1fr 1fr;
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
    grid-template-columns: 0.5fr 3fr 1fr 0.5fr 1fr 1fr;
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

