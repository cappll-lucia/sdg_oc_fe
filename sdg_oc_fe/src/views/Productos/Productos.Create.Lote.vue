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
import { router } from '@/router';
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

const marcas = ref<Marca[]>([]);
const proveedores = ref<Proveedor[]>([]);


const selectedMarcaId = ref<string|undefined>();
const selectedProveedorId = ref<string|undefined>();
const uploadedFile = ref<any>();

const showError = ref<boolean>(false);
const errorMessage =ref<string>('');


const isValidLote = ref<{marca: boolean, proveedor: boolean, file: boolean}>({marca:true, proveedor:true, file:true})

onMounted(async()=>{
    marcas.value = await marcasApi.getAll();
    proveedores.value = await proveedoresApi.getAll();
})

const steps: Array<{ step: number; title: string; description: string; description2?: string }> = [
    {
        step: 1,
        title: 'Descargar o abrir la plantilla',
        description: 'Si aún no se dispone de la plantilla, descargarla ',
        description2: 'Si la plantilla ya fue descargada, limpiarla desde Productos > Borrar todo.',
    },
    {
        step: 2,
        title: 'Habilitar macros',
        description: 'Al abrir el archivo en Excel, asegurarse de habilitar los permisos para macros para garantizar su correcto funcionamiento.',
    },
    {
        step: 3,
        title: 'Completar la información de los productos',
        description: 'Ingresar todos los datos requeridos en la plantilla, verificando que sean correctos y estén bien estructurados.',
        description2: 'Recordá que si no completas la columna código proveedor, el sistema lo generará automáticamente.',
    },
    {
        step: 4,
        title: 'Validar los datos ingresados',
        description: 'Desde la pestaña Productos > Validar, ejecutar la validación de datos.',
        description2: 'Corregir cualquier error detectado y repetir la validación si es necesario.',
    },
    {
        step: 5,
        title: 'Guardar el archivo',
        description: 'Una vez validados los datos, guardar el archivo en el equipo.',
    },
    {
        step: 6,
        title: 'Subir el archivo en el formulario',
        description: 'Acceder al formulario correspondiente y adjuntar el archivo.',
        description2: 'Indicar la marca y el proveedor del grupo de productos.',
    }
];


const handleFileUpload = (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
        const file = target.files[0];
        if (!file?.name.endsWith('.xlsm')) {
            isValidLote.value.file = false;
        } else {
            uploadedFile.value = file;
        }
    }
};

const validateAndSubmit = async () => {
    loading.value=true;
    isValidLote.value.marca = !!selectedMarcaId.value && !isNaN(Number(selectedMarcaId.value));
    isValidLote.value.proveedor = !!selectedProveedorId.value && !isNaN(Number(selectedProveedorId.value));
    isValidLote.value.file = !!uploadedFile.value && uploadedFile.value?.name.endsWith('.xlsm') ;
    if(isValidLote.value.file && isValidLote.value.marca && isValidLote.value.proveedor){
        await onSubmit()
    }
    loading.value=false;
};

const onSubmit = async()=>{
    try{
        if(selectedMarcaId.value && selectedProveedorId.value && uploadedFile.value){
            await productosApi.createLote(selectedMarcaId.value, selectedProveedorId.value, uploadedFile.value)
            toast({
                title: 'Lote de productos registrado con éxito',
            })
            router.push('/productos')
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
                    <BreadcrumbPage>Registrar Lote</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
        <div class="pt-2 flex w-full justify-center items-center">
            <form @submit.prevent="validateAndSubmit"
                class="forms-wide h-[50rem] w-full flex flex-col justify-start items-start  px-[5rem]">
                <div class="w-full ">
                    <h3 class="page-subtitle text-center">Registrar Lote de Productos</h3>
                    <Separator class="my-6 w-full" />
                </div>
                <div class="flex flex-row w-[100%] h-[40rem] px-4 justify-between items-start">

                    <div class=" flex flex-col w-[45%] h-full justify-start items-start text-gray-800 ">
                        <h5 class="page-subtitle">Instrucciones</h5>
                        <div v-for="step in steps" class="mt-4 ">
                            <Label class=" font-bold text-[1rem]">{{ `${step.step}. ${step.title}` }}</Label>
                            <p class="pl-5 text-sm">- {{ step.description }} <a class="text-blue-600 underline" v-if="step.step==1" href="../../../public/productos_upload_template.xlsm">en este enlace.</a> </p>
                            <p class="pl-5 text-sm" v-if="step.description2">- {{ step.description2 }}</p>
                        </div>
                    </div>
                    <div class="flex flex-col w-[45%] mr-7 h-full">
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
                            <Label class="w-[7rem] mr-4 text-right">Archivo</Label>
                            <Input type="file" class="w-[22rem]" accept=".xlsm" @change="handleFileUpload" />
                            <TooltipProvider  v-if="!isValidLote.file" >
                                <Tooltip>
                                <TooltipTrigger class="bg-transparent text-xs text-destructive ml-4"> <AsteriskIcon :size="14" /> </TooltipTrigger>
                                <TooltipContent class="text-destructive border-destructive font-thin text-xs">
                                    <p>Archivo inválido, debe ser un archivo .xlsm</p>
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
