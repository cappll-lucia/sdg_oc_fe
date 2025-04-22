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
import AlertError from '@/components/AlertError.vue';
import { onMounted, ref } from 'vue'
import { router } from '@/router';
import { CategoriaEnum } from '@/api/entities/producto';
import { Marca } from '@/api/entities/marca';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { AsteriskIcon, SlashIcon } from 'lucide-vue-next';
import Separator from '@/components/ui/separator/Separator.vue';
import { useLoaderStore } from '@/stores/LoaderStore';
import { Proveedor } from '@/api/entities/proveedor';
import Label from '@/components/ui/label/Label.vue';
import Input from '@/components/ui/input/Input.vue';
import { marcasApi } from '@/api/libs/marcas';
import { proveedoresApi } from '@/api/libs/proveedores';
import { isValidNumber } from '@/lib/utils';
import { productosApi } from '@/api/libs/productos';
import { toast } from '@/components/ui/toast';

const loader = useLoaderStore();
const submited = ref<boolean>(false);

const marcas = ref<Marca[]>([]);
const proveedores = ref<Proveedor[]>([]);

const showError = ref<boolean>(false);
const errorMessage =ref<string>('');

const loadData = async()=>{
    try{
        loader.show();
        marcas.value = await marcasApi.getAll();
        proveedores.value = await proveedoresApi.getAll();
        loader.hide();
    } catch (err: any) {
        errorMessage.value=err.message as string
        showError.value = true;
        loader.hide();
    };
}

onMounted(async()=>{
    await loadData();
})

const newProducto = ref<{
    codProv: string,
    descripcion: string|undefined,
    precio: number,
    precioLista: number,
    categoria: CategoriaEnum|undefined,
    marca: {id: number|undefined},
    proveedor: {id: number|undefined},
}>({
    codProv: '',
    descripcion: undefined,
    precio: 0,
    precioLista: 0,
    categoria: undefined,
    marca: {id: undefined},
    proveedor: {id: undefined},
})
const isValidNewProducto = ref<{
    descripcion: boolean,
    codProv: boolean,
    precio: boolean,
    precioLista: boolean,
    categoria: boolean,
    marca: boolean,
    proveedor: boolean,
}>({
    descripcion:true,
    codProv:true,
    precio:true,
    precioLista:true,
    categoria:true,
    marca:true,
    proveedor:true,
})

const validateAndSubmit = async ()=>{
    submited.value=false;
    isValidNewProducto.value.codProv= newProducto.value.codProv.length<=8;
    isValidNewProducto.value.descripcion= Boolean(newProducto.value.descripcion);
    isValidNewProducto.value.precioLista=  isValidNumber(newProducto.value.precioLista) && newProducto.value.precioLista > 0;
    isValidNewProducto.value.precio=  isValidNumber(newProducto.value.precio) && newProducto.value.precio > 0;
    isValidNewProducto.value.categoria=  newProducto.value.categoria ? Object.keys(CategoriaEnum).includes(newProducto.value.categoria) : false;
    isValidNewProducto.value.marca = !!newProducto.value.marca.id && !isNaN(Number(newProducto.value.marca.id));
    isValidNewProducto.value.proveedor = !!newProducto.value.proveedor.id && !isNaN(Number(newProducto.value.proveedor.id));
    const success = Object.values(isValidNewProducto.value).every(Boolean)
    if(success && newProducto.value.precioLista<newProducto.value.precio){
        await onSubmit()
    }
    submited.value=true;

}

const onSubmit= async()=>{
    try{
        loader.show();
        await productosApi.create(newProducto.value)
        toast({
            title: 'Productos registrad con éxito',
        })
        router.push('/productos')
        loader.hide();
    } catch (err: any) {
        errorMessage.value=err.message as string
        showError.value = true;
        loader.hide()
    };
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
                    <SlashIcon/>
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                    <BreadcrumbLink href="/">
                        Parámetros
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                    <SlashIcon />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                    <BreadcrumbLink href="/proveedores">
                        Proveedores
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                    <SlashIcon />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                    <BreadcrumbPage>Nuevo Producto</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
        <div class="pt-2 flex w-full justify-center items-center" >
            <form @submit.prevent="validateAndSubmit" class="forms w-[45rem]">
                <h3 class="page-subtitle text-center" >Registrar Nuevo Proveedor</h3>
                <Separator class="my-6" />
                
                <div class="h-[5rem] w-full flex justify-center">
                    <div class="flex w-[33rem] flex-row items-center justify-start ">
                        <Label class="w-[9rem] text-right mr-[1.5rem]">Código</Label>
                        <Input class="w-[20rem]" type="text" v-model="newProducto.codProv" maxlength="10" />
                    </div>
                </div>

                <div class="h-[5rem] w-full flex justify-center">
                    <div class="flex w-[33rem] flex-row items-center justify-start ">
                        <Label class="w-[9rem] text-right mr-[1.5rem]">Descripción</Label>
                        <Input class="w-[20rem]" type="text" v-model="newProducto.descripcion"  />
                        <TooltipProvider  v-if="!isValidNewProducto.descripcion" >
                            <Tooltip>
                                <TooltipTrigger class="bg-transparent text-xs text-destructive ml-4"> <AsteriskIcon :size="14" /> </TooltipTrigger>
                                <TooltipContent class="text-destructive border-destructive font-thin text-xs">
                                    <p>Ingresar descripción del producto</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </div>
                
                <div class="h-[5rem] w-full flex justify-center">
                    <div class="flex w-[33rem] flex-row items-center justify-start ">
                        <Label class="w-[9rem] text-right mr-[1.5rem]">Precio de Lista</Label>
                         <div class="w-[20rem]">
                            <div class=" relative w-full max-w-sm items-center">
                                <Input 
                                    class="pl-12" 
                                    v-decimal 
                                    v-model="newProducto.precioLista"  
                                    @update:model-value="(value)=>{
                                        newProducto.precioLista = Number(value)
                                    }"
                                />
                                <span class="pl-4 text-sm text-[#757575] absolute start-0 inset-y-0 flex items-center justify-center px-2">$</span>
                            </div>
                        </div>
                        <TooltipProvider  v-if="!isValidNewProducto.precioLista" >
                            <Tooltip>
                                <TooltipTrigger class="bg-transparent text-xs text-destructive ml-4"> <AsteriskIcon :size="14" /> </TooltipTrigger>
                                <TooltipContent class="text-destructive border-destructive font-thin text-xs">
                                    <p>Ingresar precio de Lista</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider  v-if="newProducto.precio < newProducto.precioLista && submited" >
                            <Tooltip>
                                <TooltipTrigger class="bg-transparent text-xs text-destructive ml-4"> <AsteriskIcon :size="14" /> </TooltipTrigger>
                                <TooltipContent class="text-destructive border-destructive font-thin text-xs">
                                    <p>El precio de venta debe ser mayor al precio de lista</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </div>

                <div class="h-[5rem] w-full flex justify-center">
                    <div class="flex w-[33rem] flex-row items-center justify-start ">
                        <Label class="w-[9rem] text-right mr-[1.5rem] leading-5">Precio de Venta / Sugerido</Label>
                        <div class="w-[20rem]">
                            <div class=" relative w-full max-w-sm items-center">
                                <Input 
                                    class="pl-12" 
                                    v-decimal 
                                    v-model="newProducto.precio"  
                                    @update:model-value="(value)=>{
                                        newProducto.precio = Number(value)
                                    }"
                                />
                                <span class="pl-4 text-sm text-[#757575] absolute start-0 inset-y-0 flex items-center justify-center px-2">$</span>
                            </div>
                        </div>
                        <TooltipProvider  v-if="!isValidNewProducto.precio" >
                            <Tooltip>
                                <TooltipTrigger class="bg-transparent text-xs text-destructive ml-4"> <AsteriskIcon :size="14" /> </TooltipTrigger>
                                <TooltipContent class="text-destructive border-destructive font-thin text-xs">
                                    <p>Ingresar precio de venta</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider  v-if="newProducto.precio < newProducto.precioLista && submited" >
                            <Tooltip>
                                <TooltipTrigger class="bg-transparent text-xs text-destructive ml-4"> <AsteriskIcon :size="14" /> </TooltipTrigger>
                                <TooltipContent class="text-destructive border-destructive font-thin text-xs">
                                    <p>El precio de venta debe ser mayor al precio de lista</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </div>

                <!-- <span v-if="newProducto.precio < newProducto.precioLista && submited" class="h-[2rem] w-full flex justify-center">
                    <p class="text-sm text-destructive" >El precio de venta debe ser mayor al precio de lista</p>
                </span> -->


                <div class="h-[5rem] w-full flex justify-center">
                    <div class="flex w-[33rem] flex-row items-center justify-start ">
                    <Label class="w-[9rem] text-right mr-[1.5rem]">Categoría</Label>
                            <Select 
                                v-model="newProducto.categoria" 
                                @update:model-value="(value) => newProducto.categoria = value as CategoriaEnum"
                            >
                                <SelectTrigger class="w-[20rem]" >
                                <SelectValue placeholder="Seleccionar" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem 
                                            v-for="categ in Object.entries(CategoriaEnum)" 
                                            :key="categ[0]" 
                                            :value="categ[0]"
                                        >
                                            {{ categ[1] }}
                                        </SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <TooltipProvider  v-if="!isValidNewProducto.categoria" >
                                <Tooltip>
                                <TooltipTrigger class="bg-transparent text-xs text-destructive ml-4"> <AsteriskIcon :size="14" /> </TooltipTrigger>
                                <TooltipContent class="text-destructive border-destructive font-thin text-xs">
                                    <p>Seleccionar categoría del producto</p>
                                </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                    </div>
                </div>

                <div class="h-[5rem] w-full flex justify-center">
                    <div class="flex w-[33rem] flex-row items-center justify-start ">
                    <Label class="w-[9rem] text-right mr-[1.5rem]">Marca</Label>
                            <Select 
                                :v-model="newProducto.marca.id" 
                                @update:model-value="(value) => newProducto.marca.id = Number(value)"
                            >
                                <SelectTrigger class="w-[20rem]" >
                                <SelectValue placeholder="Seleccionar" />
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
                            <TooltipProvider  v-if="!isValidNewProducto.marca" >
                                <Tooltip>
                                <TooltipTrigger class="bg-transparent text-xs text-destructive ml-4"> <AsteriskIcon :size="14" /> </TooltipTrigger>
                                <TooltipContent class="text-destructive border-destructive font-thin text-xs">
                                    <p>Seleccionar marca del producto</p>
                                </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                    </div>
                </div>

                <div class="h-[5rem] w-full flex justify-center">
                    <div class="flex w-[33rem] flex-row items-center justify-start ">
                        <Label class="w-[9rem] text-right mr-[1.5rem]">Proveedor</Label>
                        <Select 
                            :v-model="newProducto.proveedor.id" 
                            @update:model-value="(value) => newProducto.proveedor.id = Number(value)"
                        >
                            <SelectTrigger class="w-[20rem]" >
                            <SelectValue placeholder="Seleccionar" />
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
                        <TooltipProvider  v-if="!isValidNewProducto.proveedor" >
                            <Tooltip>
                            <TooltipTrigger class="bg-transparent text-xs text-destructive ml-4"> <AsteriskIcon :size="14" /> </TooltipTrigger>
                            <TooltipContent class="text-destructive border-destructive font-thin text-xs">
                                <p>Seleccionar el proveedor del producto</p>
                            </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </div>



                <div class="w-full flex flex-row justify-end mt-8 mb-6 pr-14 ">
                    <Button variant="outline" class="w-[25%] mr-5"
                       type="button" @click="() => { router.push('/productos'); }">Cancelar</Button>
                    <Button type="submit" class="w-[25%] mr-2">Guardar</Button>
                </div>
            </form>
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
