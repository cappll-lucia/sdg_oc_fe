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
import { onMounted, ref } from 'vue';
import { JwtUser } from '@/api/entities/jwtUser';

const userStore = useUserStore();
const userData = ref<JwtUser|null>();

onMounted(async()=>{
    userData.value = userStore.getMe
})


const ventasItems: { title: string, href: string, description?: string; }[] = [
    {
        title: 'Nueva Venta',
        href: '/ventas/new',
    },
    {
        title: 'Historial de Ventas',
        href: '/ventas',
    },
    {
        title: 'Facturación Electrónica',
        href: '/docs/components/progress',
        description:
            'Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.',
    }
];

const parametrosItems: { title: string, href: string}[] = [
    {
        title: 'Obras Sociales',
        href: '/obras-sociales'
    },
    {
        title: 'Marcas',
        href: '/marcas'
    },
    {
        title: 'Proveedores',
        href: '/proveedores'
    }
];

</script>

<template>
    <NavigationMenu v-if="$route.name!='login'" class="border-y max-w-100 py-2 px-4 justify-between">
        <NavigationMenuList>
            <NavigationMenuItem>
                <NavigationMenuLink href="/recetas" :class="navigationMenuTriggerStyle()">
                    Recetas
                </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
                <NavigationMenuTrigger >Ventas</NavigationMenuTrigger>
                <NavigationMenuContent>
                    <ul class=" grid w-[300px] gap-3 p-4 md:w-[300px] md:grid-cols-1 lg:w-[300px] item-venta ">
                        <li v-for="item in ventasItems" :key="item.title">
                            <NavigationMenuLink as-child>
                                <a :href="item.href"
                                    class="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                                    <div class="text-sm font-medium leading-none">{{ item.title }}</div>
                                    <p v-if="item.description" class="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                        {{ item.description }}
                                    </p>
                                </a>
                            </NavigationMenuLink>
                        </li>
                    </ul>
                </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
                <NavigationMenuLink href="/clientes" :class="navigationMenuTriggerStyle()">
                    Clientes
                </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
                <NavigationMenuLink href="/docs/introduction" :class="navigationMenuTriggerStyle()">
                    Cuentas Corrientes
                </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
                <NavigationMenuLink href="/productos" :class="navigationMenuTriggerStyle()">
                    Productos
                </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
                <NavigationMenuLink href="/audiometrias" :class="navigationMenuTriggerStyle()">
                    Audiometrías
                </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
                <NavigationMenuTrigger>Parámetros</NavigationMenuTrigger>
                <NavigationMenuContent>
                    <ul class=" grid w-[100vw] gap-3 p-4 md:w-[100vw] md:grid-cols-1 lg:w-[100vw]">
                        <li v-for="item in parametrosItems" :key="item.title">
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
        <div class="px-2 flex justify-between w-[13rem] items-center ">
            <Button class="text-xs" @click="router.replace('/ventas/new')" >Nueva Venta</Button>
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <Avatar>
                        <AvatarImage src="https://github.com/radix-vue.png" alt="@radix-vue" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent class="mr-4 w-[8rem]">
                    <DropdownMenuLabel>{{ userData?.username }}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem @click="userStore.signOut()" >Cerrar sesión</DropdownMenuItem>
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