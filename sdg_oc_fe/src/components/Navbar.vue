<script setup lang="ts">
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import{Button} from '@/components/ui/button'
import router from '@/router';
import { useUserStore } from '@/stores/UsersStore';
import { computed } from 'vue';
import { ArrowDownUpIcon, BanknoteIcon, ChartColumnIcon, GlassesIcon, HomeIcon, LogOutIcon, Receipt, SettingsIcon, ShoppingBag, UserIcon, Wallet2Icon } from 'lucide-vue-next';
import { QuestionMarkCircledIcon } from '@radix-icons/vue';


const userStore = useUserStore();

const userData = computed(() => userStore.getMe);

const reportes: { title: string, href: string}[] = [
    {
        title: 'Reportes Obras Sociales',
        href: '/reportes/obras-sociales'
    },
    {
        title: 'Reportes Ventas',
        href: '/reportes/ventas'
    }
];

</script>

<template>
    <NavigationMenu v-if="$route.name!='login'" class="border-y max-w-100 py-2 justify-between ">
        <NavigationMenuList>
            <NavigationMenuItem class="mr-[1rem] ">
                <NavigationMenuLink href="/" :class="navigationMenuTriggerStyle()">
                    <HomeIcon class="w-4 h-4 mr-2" />
                    Inicio
                </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem class="mr-[1rem] " >
                <NavigationMenuLink href="/clientes" :class="navigationMenuTriggerStyle()">
                    <UserIcon class="w-4 h-4 mr-2"  />
                    Clientes
                </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem class="mr-[1rem] ">
                <NavigationMenuLink href="/ventas" :class="navigationMenuTriggerStyle()">
                    <ShoppingBag class="w-4 h-4 mr-2" />
                    Ventas
                </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem class="mr-[1rem] ">
                <NavigationMenuLink href="/comprobantes" :class="navigationMenuTriggerStyle()">
                    <Receipt class="w-4 h-4 mr-2"/>
                    Comprobantes
                </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem class="mr-[1rem] ">
                <NavigationMenuLink href="/cuentas-corrientes" :class="navigationMenuTriggerStyle()">
                    <Wallet2Icon  class="w-4 h-4 mr-2" />
                    Cuentas Corrientes
                </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem class="mr-[1rem] ">
                <NavigationMenuLink href="/productos" :class="navigationMenuTriggerStyle()">
                    <GlassesIcon  class="w-4 h-4 mr-2" />
                    Productos
                </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem class="mr-[1rem] ">
                <NavigationMenuLink href="/caja" :class="navigationMenuTriggerStyle()">
                    <BanknoteIcon class="w-5 h-5" />
                    <ArrowDownUpIcon  class="w-3 h-3 mr-2" />
                    Caja
                </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem v-if="userData?.role=='admin'" class="mr-[1rem] ">
                <NavigationMenuTrigger> <ChartColumnIcon  class="w-4 h-4 mr-2" />Reportes</NavigationMenuTrigger>
                <NavigationMenuContent>
                    <ul class=" grid w-[100vw] gap-3 p-4 md:w-[100vw] md:grid-cols-1 lg:w-[100vw]">
                        <li v-for="item in reportes" :key="item.title">
                            <NavigationMenuLink as-child>
                                <a :href="item.href"
                                    class="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                                    <div class="text-sm font-medium leading-none">{{ item.title }}</div>
                                </a>
                            </NavigationMenuLink>
                        </li>
                    </ul>
                </NavigationMenuContent>
            </NavigationMenuItem>
        </NavigationMenuList>
        <div class="px-2 flex justify-between w-[13rem] items-center z-40 ">
            <Button class="text-xs" @click="router.push('/ventas/new')" >Nueva Venta</Button>
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <Avatar class="border border-gray-950">
                        <AvatarImage src="/favicon.svg" alt="@radix-vue" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent class="px-4 w-[15rem]">
                    <DropdownMenuLabel>{{ userData?.username }}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem @click="router.push('/preguntas')" ><QuestionMarkCircledIcon /> Preguntas frecuentes</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem @click="router.push('/parametros')" > <SettingsIcon />Parámetros</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem class="font-bold" @click="userStore.signOut()"> <LogOutIcon/> Cerrar sesión</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    </NavigationMenu>
</template>

<style>
.item-venta:fi{
    background-color: yellowgreen;
    position: absolute;
    left: 3rem;
}
</style>