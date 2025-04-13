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
    <div class="page flex flex-col justify-center items-center w-ful h-[10rem]">
         <h1>No tiene permisos de administrador para acceder a la información solicitada</h1>
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