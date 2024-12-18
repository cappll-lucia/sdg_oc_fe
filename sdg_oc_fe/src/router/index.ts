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
        }
    ]
})