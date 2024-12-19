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
            path: '/recetas/recetados',
            name: 'recetas_recetados',
            component: () => import('../views/RecetasRecetados.vue')
        },
                {
            path: '/recetas/contacto',
            name: 'recetas_contacto',
            component: () => import('../views/RecetasContacto.vue')
        },        {
            path: '/recetas/audiometrias',
            name: 'recetas_audiometria',
            component: () => import('../views/RecetasAudiometrias.vue')
        },
    ]
})