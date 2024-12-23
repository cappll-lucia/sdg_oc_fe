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
            component: () => import('../views/Clientes.vue')
        },
        {
            path: '/recetas',
            name: 'recetas',
            component: () => import('../views/Recetas.vue')
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
            component: () => import('../views/RecetasCliente.vue')
        },
    ]
})