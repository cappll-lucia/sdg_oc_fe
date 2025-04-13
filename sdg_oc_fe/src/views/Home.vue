<script setup lang="ts">
import { ArrowDownUpIcon, BanknoteIcon, EarIcon, EyeIcon, Glasses, Receipt, Shield, ShoppingBag, Users2Icon } from 'lucide-vue-next';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import router from '@/router';
</script>

<template>
    <div class="page lg:px-60">
         <div class="grid grid-cols-3 grid-rows-[auto_auto_auto_auto] gap-4 p-6 0 h-[90vh]">
            <div @click="router.push(`/caja`)" class="box caja">
                <div class="flex flex-row items-center justify-center">
                    <BanknoteIcon class="mb-2" :size="25" />
                    <ArrowDownUpIcon  class="mb-2" :size="25" />
                </div>
                <span>Caja</span>
            </div>
            <div class=" flex justify-center items-center nueva-receta col-span-2 px-[10%]"> <img src="/logo_no_bg.png" /> </div>

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
            <div @click="router.push(`/obras-sociales`)" class="box productos">
                <Shield class="mb-2" :size="25" />
                <span>Obras Sociales</span>
            </div>

        </div>
    </div>
</template>


<style scoped>
.box {
  @apply rounded-lg text-[1.2rem] p-6 text-center flex flex-col justify-center items-center cursor-pointer;
  box-shadow: #F5F5F5 0px 3px 8px;
  /* box-shadow: rgba(9, 30, 66, 0.25) 0px 4px 8px -2px, rgba(9, 30, 66, 0.08) 0px 0px 0px 1px; */
  box-shadow: rgba(71, 70, 70, 0.15) 0px 2px 8px;
}
</style>