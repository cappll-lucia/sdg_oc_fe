import { createRouter, createWebHistory } from "vue-router";

export const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes:[
        {
            path: '/',
            name: 'home',
            component: ()=> import('../views/Home.vue')
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('../views/Login.vue')
        },
        {
            path: '/clientes',
            name: 'clientes',
            component: () => import('../views/Clientes/Clientes.vue')
        },
        {
            path: '/clientes/create',
            name: 'clientes-create',
            component: () => import('../views/Clientes/Clientes.Create.vue')
        },
        {
            path: '/marcas',
            name: 'marcas',
            component: () => import('../views/Marcas/Marcas.vue')
        },
        {
            path: '/marcas/create',
            name: 'marcas-create',
            component: () => import('../views/Marcas/Marcas.Create.vue')
        },
        {
            path: '/marcas/edit/:id',
            name: 'marcas-edit',
            component: () => import('../views/Marcas/Marcas.Edit.vue')
        },
        {
            path: '/proveedores',
            name: 'proveedores',
            component: () => import('../views/Proveedores.vue')
        },
        {
            path: '/productos',
            name: 'productos',
            component: () => import('../views/Productos.vue')
        },
        {
            path: '/recetas',
            name: 'recetas',
            component: () => import('../views/Recetas/Recetas.vue')
        },        
        {
            path: '/audiometrias',
            name: 'recetas_audiometria',
            component: () => import('../views/Audiometrias.vue')
        },
        {
            path: '/audiometrias/:idCliente',
            name: 'audiometria',
            component: () => import('../views/AudiometriasCliente.vue')
        },
        {
            path: '/recetas/:idCliente',
            name: 'recetas_cliente',
            component: () => import('../views/Recetas/RecetasCliente.vue')
        },
    ]
})