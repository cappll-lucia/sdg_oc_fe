import type { Proveedor } from "../entities";

export const proveedores: Proveedor[] = [
  {
    id: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    cuit: '20-12345678-1',
    razonSocial: 'Distribuidora Visual',
    email: 'ventas@distribuidoravisual.com',
    telefono: '111-111-1111'
  },
  {
    id: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    cuit: '20-87654321-9',
    razonSocial: 'Audifonos Express',
    email: 'info@audifonosexpress.com',
    telefono: '222-222-2222'
  },
  {
    id: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    cuit: '27-11223344-5',
    razonSocial: 'Lentes y Más',
    email: 'contacto@lentesymas.com',
    telefono: '333-333-3333'
  }
];