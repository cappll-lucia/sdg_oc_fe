<script lang="ts" setup>
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Button from '@/components/ui/button/Button.vue';
import Input from '@/components/ui/input/Input.vue';
import Label from '@/components/ui/label/Label.vue';
import Separator from '@/components/ui/separator/Separator.vue';
import router from '@/router';
import { AsteriskIcon, SlashIcon } from 'lucide-vue-next';
import { onMounted, ref } from 'vue';
import { Marca } from '@/api/entities/marca';
import { Proveedor } from '@/api/entities/proveedor';
import TooltipProvider from '@/components/ui/tooltip/TooltipProvider.vue';
import Tooltip from '@/components/ui/tooltip/Tooltip.vue';
import TooltipTrigger from '@/components/ui/tooltip/TooltipTrigger.vue';
import TooltipContent from '@/components/ui/tooltip/TooltipContent.vue';
import { marcasApi } from '@/api/libs/marcas';
import { proveedoresApi } from '@/api/libs/proveedores';
import { toast } from '@/components/ui/toast';
import AlertError from '@/components/AlertError.vue';
import { productosApi } from '@/api/libs/productos';
import { isValidNumber } from '@/lib/utils';

const marcas = ref<Marca[]>([]);
const proveedores = ref<Proveedor[]>([]);


const selectedMarcaId = ref<string|undefined>();
const selectedProveedorId = ref<string|undefined>();
const porcentaje = ref<number>();

const showError = ref<boolean>(false);
const errorMessage =ref<string>('');


const isValidLote = ref<{marca: boolean, proveedor: boolean, porcentaje: boolean}>({marca:true, proveedor:true, porcentaje:true})

onMounted(async()=>{
    marcas.value = await marcasApi.getAll();
    proveedores.value = await proveedoresApi.getAll();
})

const validateAndSubmit = async () => {
    loading.value=true;
    isValidLote.value.marca = !!selectedMarcaId.value && !isNaN(Number(selectedMarcaId.value));
    isValidLote.value.proveedor = !!selectedProveedorId.value && !isNaN(Number(selectedProveedorId.value));
    isValidLote.value.porcentaje = isValidNumber(porcentaje.value) && porcentaje.value!=0 ;
    if(isValidLote.value.porcentaje && isValidLote.value.marca && isValidLote.value.proveedor){
        await onSubmit()
    }
    loading.value=false;
};

const onSubmit = async()=>{
    try{
        if(selectedMarcaId.value && selectedProveedorId.value && porcentaje.value){
            await productosApi.updateLote(selectedMarcaId.value, selectedProveedorId.value, porcentaje.value)
            router.push('/productos')
            toast({
                title: 'Precio del lote de productos actualizado con éxito',
            })
        }
    } catch (err: any) {
        errorMessage.value=err.message as string
        showError.value = true;
        loading.value=false;
    };
}



const loading = ref<boolean>(false);

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
                    <BreadcrumbLink href="/productos">
                        Productos
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                    <SlashIcon />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                    <BreadcrumbPage>Actualizar Lote</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
        <div class="pt-2 flex w-full justify-center items-center">
            <form @submit.prevent="validateAndSubmit"
                class="forms-wide h-[30rem] w-full flex flex-col justify-start items-start  px-[5rem]">
                <div class="w-full ">
                    <h3 class="page-subtitle text-center">Actualizar Precio Lote de Productos</h3>
                    <Separator class="my-6 w-full" />
                </div>
                <div class="flex flex-row w-[100%] h-[20rem] px-4 justify-between items-start">

                    <div class=" flex flex-col w-[35%] h-full justify-start items-start text-gray-800 ">
                        <h5 class="text-[1.2rem] text-center mt-8 ml-4">Completá los campos para modificar los precios de todos los productos que coincidan con la marca y el proveedor elegidos.</h5>

                    </div>
                    <div class="flex flex-col w-[50%] mr-7 h-full">
                        <div class="h-[5rem] flex flex-row justify-start mr-8 items-center ">
                            <Label class="w-[7rem] mr-4 text-right">Marca</Label>
                            <Select 
                
                                :modelValue="selectedMarcaId" 
                                @update:modelValue="(value) => selectedMarcaId = value.toString()"
                            >
                                <SelectTrigger class="w-[22rem]" >
                                <SelectValue placeholder="Marca" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem 
                                            v-for="marca in marcas" 
                                            :key="marca.id" 
                                            :value="marca.id.toString()"
                                        >
                                            {{ marca.nombre }}
                                        </SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <TooltipProvider  v-if="!isValidLote.marca" >
                                <Tooltip>
                                <TooltipTrigger class="bg-transparent text-xs text-destructive ml-4"> <AsteriskIcon :size="14" /> </TooltipTrigger>
                                <TooltipContent class="text-destructive border-destructive font-thin text-xs">
                                    <p>Seleccionar marca del lote de productos</p>
                                </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>

                        <div class="h-[5rem] flex flex-row justify-start mr-8 items-center ">
                            <Label class="w-[7rem]  mr-4 text-right">Proveedor</Label>
                            <Select 
                                :modelValue="selectedProveedorId" 
                                @update:modelValue="(value) => selectedProveedorId = value.toString()"
                            >
                                <SelectTrigger class="w-[22rem]" >
                                <SelectValue placeholder="Proveedor" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem 
                                            v-for="proveedor in proveedores" 
                                            :key="proveedor.id" 
                                            :value="proveedor.id.toString()"
                                        >
                                            {{ proveedor.razonSocial }}
                                        </SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <TooltipProvider  v-if="!isValidLote.proveedor" >
                                <Tooltip>
                                <TooltipTrigger class="bg-transparent text-xs text-destructive ml-4"> <AsteriskIcon :size="14" /> </TooltipTrigger>
                                <TooltipContent class="text-destructive border-destructive font-thin text-xs">
                                    <p>Seleccionar el proveedor del lote de productos</p>
                                </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                        
                        <div class="h-[5rem] flex flex-row justify-start mr-8 items-center ">
                            <Label class="w-[7rem] mr-4 text-right">Porcentaje</Label>
                            <Input v-model="porcentaje" v-decimal class="w-[22rem]" type="decimal" />
                            <TooltipProvider  v-if="!isValidLote.porcentaje" >
                                <Tooltip>
                                <TooltipTrigger class="bg-transparent text-xs text-destructive ml-4"> <AsteriskIcon :size="14" /> </TooltipTrigger>
                                <TooltipContent class="text-destructive border-destructive font-thin text-xs">
                                    <p>Ingrese el porcentaje a actualizar</p>
                                </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>

                    </div>

                </div>
                <div class="form-footer w-full flex flex-row justify-end mt-8 mb-6 pr-8">
                    <Button variant="outline" class="w-[15%] mr-5"
                        @click="router.push('/productos')">Cancelar</Button>
                    <Button type="submit" class="w-[15%]">{{ loading ? 'Cargando...' : 'Guardar' }}</Button>
                </div>

            </form>

        </div>
        <AlertError v-model="showError" title="Error" :message="errorMessage" button="Aceptar"
                    :action="()=>{showError=false}" />
    </div>
</template>
