export const routerRoutes = [
        {
            path: '/',
            name: 'home',
            component: ()=> import('../views/Home.vue'),
            meta: {
			    auth: true,
		    },
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('../views/Login.vue'),
            meta: {
			    auth: false,
		    },
        },
        {
            path: '/clientes',
            name: 'clientes',
            component: () => import('../views/Clientes/Clientes.vue'),
            meta: {
			    auth: true,
		    },
        },
        {
            path: '/clientes/create',
            name: 'clientes-create',
            component: () => import('../views/Clientes/Clientes.Create.vue'),
            meta: {
			    auth: true,
		    },
        },
        {
            path: '/clientes/edit/:id',
            name: 'clientes-edit',
            component: () => import('../views/Clientes/Clientes.Edit.vue'),
            meta: {
			    auth: true,
		    },
        },
        {
            path: '/marcas',
            name: 'marcas',
            component: () => import('../views/Marcas/Marcas.vue'),
            meta: {
			    auth: true,
		    },
        },
        {
            path: '/marcas/create',
            name: 'marcas-create',
            component: () => import('../views/Marcas/Marcas.Create.vue'),
            meta: {
			    auth: true,
		    },
        },
        {
            path: '/marcas/edit/:id',
            name: 'marcas-edit',
            component: () => import('../views/Marcas/Marcas.Edit.vue'),
            meta: {
			    auth: true,
		    },
        },
        {
            path: '/proveedores',
            name: 'proveedores',
            component: () => import('../views/Proveedores/Proveedores.vue'),
            meta: {
			    auth: true,
		    },
        },
        {
            path: '/proveedores/create',
            name: 'proveedores-create',
            component: () => import('../views/Proveedores/Proveedores.Create.vue'),
            meta: {
			    auth: true,
		    },
        },
        {
            path: '/proveedores/edit/:id',
            name: 'proveedores-edit',
            component: () => import('../views/Proveedores/Proveedores.Edit.vue'),
            meta: {
			    auth: true,
		    },
        },
        {
            path: '/obras-sociales',
            name: 'obras-sociales',
            component: () => import('../views/ObrasSociales/ObrasSociales.vue'),
            meta: {
			    auth: true,
		    },
        },
        {
            path: '/obras-sociales/create',
            name: 'obras-sociales-create',
            component: () => import('../views/ObrasSociales/ObrasSociales.Create.vue'),
            meta: {
			    auth: true,
		    },
        },
        {
            path: '/obras-sociales/edit/:id',
            name: 'obras-sociales-edit',
            component: ()=> import('../views/ObrasSociales/ObrasSociales.Edit.vue'),
            meta: {
			    auth: true,
		    },
        },
        {
            path: '/productos',
            name: 'productos',
            component: () => import('../views/Productos/Productos.vue'),
            meta: {
			    auth: true,
		    },
        },
        {
            path: '/productos/create/lote',
            name: 'productos_lote',
            component: () => import('../views/Productos/Productos.Create.Lote.vue'),
            meta: {
			    auth: true,
		    },
        },
        {
            path: '/recetas',
            name: 'recetas',
            component: () => import('../views/Recetas/Recetas.vue'),
            meta: {
			    auth: true,
		    },},      

        {
            path: '/audiometrias',
            name: 'recetas_audiometria',
            component: () => import('../views/Audiometrias/Audiometrias.vue'),
            meta: {
			    auth: true,
		    },
        },
        {
            path: '/audiometrias/create',
            name: 'create-audiometrias',
            component: () => import('../views/Audiometrias/Audiometrias.Create.vue'),
            meta: {
			    auth: true,
		    },
        },
        {
            path: '/audiometrias/edit/:id',
            name: 'edit-audiometrias',
            component: () => import('../views/Audiometrias/Audiometrias.Edit.vue'),
            meta: {
			    auth: true,
		    },
        },
        {
            path: '/audiometrias/:idCliente',
            name: 'audiometria',
            component: () => import('../views/Audiometrias/AudiometriasCliente.vue'),
            meta: {
			    auth: true,
		    },
        },
        {
            path: '/recetas/:idCliente',
            name: 'recetas_cliente',
            component: () => import('../views/Recetas/RecetasCliente.vue'),
            meta: {
			    auth: true,
		    },
        },
        {
            path: '/recetas/recetados/new',
            name: 'new_receta_recetados',
            component: () => import('../views/Recetas/RecetasRecetados.Create.vue'),
            meta: {
			    auth: true,
		    },
        },
        {
            path: '/recetas/recetados/edit/:id',
            name: 'edit_receta_recetados',
            component: () => import('../views/Recetas/RecetasRecetados.Edit.vue'),
            meta: {
			    auth: true,
		    },
        },
        {
            path: '/recetas/contacto/new',
            name: 'new_receta_contacto',
            component: () => import('../views/Recetas/RecetasContacto.Create.vue'),
            meta: {
			    auth: true,
		    },
        },
        {
            path: '/recetas/contacto/edit/:id',
            name: 'edit_receta_contado',
            component: () => import('../views/Recetas/RecetasContacto.Edit.vue'),
            meta: {
			    auth: true,
		    },
        },
        {
            path: '/ventas',
            name:'ventas',
            component: ()=> import('../views/Ventas/Ventas.vue'),
            meta: {
                auth: true
            }
        },
        {
            path: '/ventas/new',
            name:'new-venta',
            component: ()=> import('../views/Ventas/Ventas.New.vue'),
            meta: {
                auth: true
            }
        }
    ]