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
                requireAdmin: true,
		    },
        },
        {
            path: '/marcas/create',
            name: 'marcas-create',
            component: () => import('../views/Marcas/Marcas.Create.vue'),
            meta: {
			    auth: true,
                requireAdmin: true,

		    },
        },
        {
            path: '/marcas/edit/:id',
            name: 'marcas-edit',
            component: () => import('../views/Marcas/Marcas.Edit.vue'),
            meta: {
			    auth: true,
                requireAdmin: true,
		    },
        },
        {
            path: '/proveedores',
            name: 'proveedores',
            component: () => import('../views/Proveedores/Proveedores.vue'),
            meta: {
			    auth: true,
                requireAdmin: true,
		    },
        },
        {
            path: '/proveedores/create',
            name: 'proveedores-create',
            component: () => import('../views/Proveedores/Proveedores.Create.vue'),
            meta: {
			    auth: true,
                requireAdmin: true,
		    },
        },
        {
            path: '/proveedores/edit/:id',
            name: 'proveedores-edit',
            component: () => import('../views/Proveedores/Proveedores.Edit.vue'),
            meta: {
			    auth: true,
                requireAdmin: true,
		    },
        },
        {
            path: '/obras-sociales',
            name: 'obras-sociales',
            component: () => import('../views/ObrasSociales/ObrasSociales.vue'),
            meta: {
			    auth: true,
                requireAdmin: true,
		    },
        },
        {
            path: '/obras-sociales/create',
            name: 'obras-sociales-create',
            component: () => import('../views/ObrasSociales/ObrasSociales.Create.vue'),
            meta: {
			    auth: true,
                requireAdmin: true,
		    },
        },
        {
            path: '/obras-sociales/edit/:id',
            name: 'obras-sociales-edit',
            component: ()=> import('../views/ObrasSociales/ObrasSociales.Edit.vue'),
            meta: {
			    auth: true,
                requireAdmin: true,
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
            name: 'productos_lote_create',
            component: () => import('../views/Productos/Productos.Create.Lote.vue'),
            meta: {
			    auth: true,
		    },
        },
        {
            path: '/productos/create/single',
            name: 'producto_create',
            component: () => import('../views/Productos/Productos.Create.vue'),
            meta: {
			    auth: true,
		    },
        },
        {
            path: '/productos/edit/:id',
            name: 'producto_edit',
            component: () => import('../views/Productos/Productos.Edit.vue'),
            meta: {
			    auth: true,
		    },
        },
        {
            path: '/productos/update-price/lote',
            name: 'productos_lote_update',
            component: () => import('../views/Productos/Productos.UpdatePrice.Lote.vue'),
            meta: {
			    auth: true,
                requireAdmin: true,
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
            path: '/recetas/contacto/historia-clinica/new',
            name: 'new_historia_clinica',
            component: () => import('../views/Recetas/RecetasContacto.CreateHistoriaClinica.vue'),
            meta: {
			    auth: true,
		    },
        },
        {
            path: '/recetas/contacto/historia-clinica/edit/:id',
            name: 'edit_historia_clinica',
            component: () => import('../views/Recetas/RecetasContacto.EditHistoriaClinica.vue'),
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
        },
        {
            path: '/ventas/view/:id',
            name:'view-venta',
            component: ()=> import('../views/Ventas/Ventas.View.vue'),
            meta: {
                auth: true
            }
        },
        {
            path: '/nota-credito/new',
            name:'nc-new',
            component: ()=> import('../views/Comprobantes/NotaCredito.Create.vue'),
            meta: {
                auth: true
            }
        },
        {
            path: '/nota-debito/new',
            name:'nd-new',
            component: ()=> import('../views/Comprobantes/NotaDebito.Create.vue'),
            meta: {
                auth: true
            }
        },
        {
            path: '/nota-credito-debito/view/:id',
            name:'nc-view',
            component: ()=> import('../views/Comprobantes/NotaCreditoDebito.View.vue'),
            meta: {
                auth: true
            }
        },
        {
            path: '/comprobantes',
            name:'comprobantes',
            component: ()=> import('../views/Comprobantes/Comprobantes.vue'),
            meta: {
                auth: true
            }
        },
        {
            path: '/cuentas-corrientes',
            name:'cuentas-corrientes',
            component: ()=> import('../views/CuentasCorrientes/CtasCorrientes.vue'),
            meta: {
                auth: true
            }
        },
        {
            path: '/clientes/dashboard/:id',
            name:'dashboard_cliente',
            component: ()=> import('../views/Clientes/Clientes.Individual.Dashboard.vue'),
            meta: {
                auth: true
            }
        },
        {
            path: '/caja',
            name:'caja',
            component: ()=> import('../views/Caja/Caja.vue'),
            meta: {
                auth: true
            }
        },
        {
            path: '/parametros',
            name:'parametros',
            component: ()=> import('../views/Parametros/Parametros.vue'),
            meta: {
                auth: true,
                requireAdmin: true,
            }
        },
        {
            path: '/reportes/obras-sociales',
            name:'reportes-obras-sociales',
            component: ()=> import('../views/Reportes/Reportes.ObrasSociales.vue'),
            meta: {
                auth: true,
                requireAdmin: true,
            }
        },
        {
            path: '/reportes/ventas',
            name:'reportes-ventas',
            component: ()=> import('../views/Reportes/Reportes.Ventas.vue'),
            meta: {
                auth: true,
                requireAdmin: true,
            }
        },
        {
            path: '/:pathMatch(.*)*',
            name:'not-found',
            component: ()=> import('../views/Redirects/NotFound.vue'),
            meta: {
                auth: true,
            }
        },
        {
            path: '/not-admin',
            name:'not-admin',
            component: ()=> import('../views/Redirects/NotAdmin.vue'),
            meta: {
                auth: true,
            }
        },
        {
            path: '/preguntas',
            name:'preguntas',
            component: ()=> import('../views/Preguntas/PreguntasFrecuentes.vue'),
            meta: {
                auth: true,
            }
        },
    ]