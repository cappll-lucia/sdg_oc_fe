<script setup lang="ts">
import { ArrowDownUpIcon, AsteriskIcon, BanknoteIcon, EarIcon, EyeIcon, Glasses, Receipt, SettingsIcon, ShoppingBag, Users2Icon } from 'lucide-vue-next';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import router from '@/router';
import { useCajaStore } from '@/stores/CajaStore';
import { onMounted, ref } from 'vue';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import Label from '@/components/ui/label/Label.vue';
import Input from '@/components/ui/input/Input.vue';
import Button from '@/components/ui/button/Button.vue';
import LoaderForm from '@/components/LoaderForm.vue';
import { cajaApi } from '@/api/libs/caja';


const loadingForm = ref<boolean>(false);
const cajaStore = useCajaStore();

const importeOpenCaja = ref<number>(0);
const isValidImporteOpenCaja = ref<boolean>(true);
const showError = ref<boolean>(false);
const errorMessage =ref<string>('');
const openDialogOpenCaja = ref<boolean>(false);


onMounted(async ()=>{
    const opened = await cajaStore.isCajaOpenedToday();
    openDialogOpenCaja.value = !opened;
})

const abrirCajaDiaria = async()=>{
    try{
        if(importeOpenCaja.value >= 0){
            loadingForm.value=true;
            await cajaApi.apertura(importeOpenCaja.value);
            openDialogOpenCaja.value=false;
            loadingForm.value=false;
        }
    }catch(e: any){
        errorMessage.value = e.message as string;
        loadingForm.value=false
        showError.value = true;
    }
}
</script>

<template>
    <div class="page lg:px-60 ">
         <div class="grid grid-cols-3 grid-rows-[auto_auto_auto_auto] gap-4 p-6 0 h-[90vh] ">
            <div @click="router.push(`/caja`)" class="box caja">
                <div class="flex flex-row items-center justify-center">
                    <BanknoteIcon class="mb-2" :size="25" />
                    <ArrowDownUpIcon  class="mb-2" :size="25" />
                </div>
                <span>Caja</span>
            </div>
            <div class=" flex justify-center items-center nueva-receta col-span-2 px-[10%]"> <img src="/image.png" class="w-[300px]" /> </div>

            <div @click="router.push(`/ventas/new`)" class="box menu-venta">
                <ShoppingBag class="mb-2" :size="25" />
                <span>Nueva Venta</span>
            </div>
            <div @click="router.push(`/comprobantes`)" class="box obras-sociales">
                <Receipt class="mb-2" :size="25" />
                <span>Contabilidad</span>
            </div>
            <div @click="router.push(`/clientes`)" class="box clientes row-span-2">
                <Users2Icon class="mb-2" :size="25" />
                <span>Clientes</span>
            </div>

            <DropdownMenu>
                <DropdownMenuTrigger class="box nueva-receta col-span-2">
                        <EyeIcon class="mb-2" :size="25" />
                        <span>Nueva Receta</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent class="w-[40rem]" >
                    <DropdownMenuLabel class="cursor-pointer font-normal text-[1.5rem]" @click="router.push('/recetas/recetados/new')"  >Receta Anteojos Recetados</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel class="cursor-pointer font-normal text-[1.5rem]" @click="router.push('/recetas/contacto/new')" >Receta Lentes de Contacto</DropdownMenuLabel>
                </DropdownMenuContent>
            </DropdownMenu>
            
            <div @click="router.push(`/productos`)" class="box productos">
                <Glasses class="mb-2" :size="25" />
                <span>Productos</span>
            </div>
            <div @click="router.push(`/audiometrias/create`)" class="box nuevo-audiom">
                <EarIcon class="mb-2" :size="25" />
                <span>Nueva Audiometría</span>
            </div>
            <div @click="router.push(`/parametros`)" class="box productos">
                <SettingsIcon class="mb-2" :size="25" />
                <span>Parámetros</span>
            </div>

        </div>
    </div>
    <Dialog v-model:open="openDialogOpenCaja" >
        <DialogContent class="max-w-[530px] min-h-[15rem] pl-[50px] py-[50px] ">
            <DialogHeader>
                <DialogTitle>Abrir Caja del Día</DialogTitle>
                <DialogDescription>
                    Ingrese el importe en EFECTIVO con el que abre la caja de hoy
                </DialogDescription>
            </DialogHeader>
            <form @submit.prevent="abrirCajaDiaria()" v-if="!loadingForm" >
            <div class="flex flex-row">
                <div class="flex flex-row items-center justify-start mb-4">
                    <Label class="text-left w-[150px]">Importe Efectivo</Label>
                    <div class=" w-[270px] flex flex-row items-center justify-start">
                        <Label class="w-[30px]  text-center">$</Label>
                        <Input v-decimal type="number" v-model="importeOpenCaja"   />
                    </div>
                    <div class="w-[20px]">
                        <TooltipProvider  v-if="!isValidImporteOpenCaja" >
                            <Tooltip>
                                <TooltipTrigger class="bg-transparent text-xs text-destructive ml-4"> <AsteriskIcon :size="14" /> </TooltipTrigger>
                                <TooltipContent class="text-destructive border-destructive font-thin text-xs">
                                    <p>Ingresar Importe</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </div>
            </div>
            <DialogFooter>
                <Button type="submit" class="mr-[30px]">
                Abrir Caja
                </Button>
            </DialogFooter>
            </form>
            <div v-else>
                <LoaderForm />
            </div>
        </DialogContent>
    </Dialog>
</template>


<style scoped>
.box {
  @apply rounded-lg text-[1.2rem] p-6 text-center flex flex-col justify-center items-center cursor-pointer;
  box-shadow: #F5F5F5 0px 3px 8px;
  /* box-shadow: rgba(9, 30, 66, 0.25) 0px 4px 8px -2px, rgba(9, 30, 66, 0.08) 0px 0px 0px 1px; */
  box-shadow: rgba(71, 70, 70, 0.15) 0px 2px 8px;
}
</style>