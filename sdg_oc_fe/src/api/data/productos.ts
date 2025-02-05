import type { Producto } from "../entities";

export const productos: Producto[] = [
  {
    id: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    nombre: 'Lentes Ray-Ban Aviator',
    descripcion: 'Clásicos lentes de sol modelo Aviator con protección UV.',
    categoria: 'anteojos sol',
    precio: 25000.0,
    stock: 20,
    marca: { id: 1, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), nombre: 'Marca A' },
    proveedor: {
        id: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        cuit: '20-12345678-1',
        razonSocial: 'Distribuidora Visual',
        email: 'ventas@distribuidoravisual.com',
        telefono: '111-111-1111'
    }
  },
  {
    id: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    nombre: 'Lentes Oakley Deportivos',
    descripcion: 'Lentes deportivos de alto rendimiento con tecnología antiempañante.',
    categoria: 'anteojos sol',
    precio: 30000.0,
    stock: 15,
    marca: { id: 2, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), nombre: 'Marca B' },
    proveedor: {
        id: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        cuit: '20-12345678-1',
        razonSocial: 'Distribuidora Visual',
        email: 'ventas@distribuidoravisual.com',
        telefono: '111-111-1111'
    }
  },
  {
    id: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    nombre: 'Lentes de Receta Essilor',
    descripcion: 'Lentes con cristales personalizados para corrección visual.',
    categoria: 'anteojos receta',
    precio: 18000.0,
    stock: 25,
    marca: { id: 3, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), nombre: 'Marca C' },
    proveedor: {
        id: 3,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        cuit: '27-11223344-5',
        razonSocial: 'Lentes y Más',
        email: 'contacto@lentesymas.com',
        telefono: '333-333-3333'
    }
  },
  {
    id: 4,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    nombre: 'Audífono Siemens Pure 312',
    descripcion: 'Audífono digital con conectividad Bluetooth.',
    categoria: 'audifono',
    precio: 75000.0,
    stock: 10,
    marca:{ id: 4, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), nombre: 'Marca D' },
    proveedor: {
        id: 2,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        cuit: '20-87654321-9',
        razonSocial: 'Audifonos Express',
        email: 'info@audifonosexpress.com',
        telefono: '222-222-2222'
    }
  },
  {
    id: 5,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    nombre: 'Lentes Kodak Blue Light',
    descripcion: 'Lentes para bloqueo de luz azul ideal para pantallas.',
    categoria: 'anteojos receta',
    precio: 20000.0,
    stock: 18,
    marca: { id: 4, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), nombre: 'Marca D' },
    proveedor: {
        id: 3,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        cuit: '27-11223344-5',
        razonSocial: 'Lentes y Más',
        email: 'contacto@lentesymas.com',
        telefono: '333-333-3333'
    }
  },
  {
    id: 6,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    nombre: 'Lentes Ray-Ban Wayfarer',
    descripcion: 'Diseño icónico Wayfarer con lentes polarizados.',
    categoria: 'anteojos sol',
    precio: 27000.0,
    stock: 12,
    marca: { id: 1, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), nombre: 'Marca A' },
    proveedor: {
        id: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        cuit: '20-12345678-1',
        razonSocial: 'Distribuidora Visual',
        email: 'ventas@distribuidoravisual.com',
        telefono: '111-111-1111'
    }
  },
  {
    id: 7,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    nombre: 'Lentes Oakley para Ciclismo',
    descripcion: 'Lentes especiales para ciclistas con ajuste ergonómico.',
    categoria: 'anteojos sol',
    precio: 35000.0,
    stock: 8,
    marca: { id: 2, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), nombre: 'Marca B' },
    proveedor: {
        id: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        cuit: '20-12345678-1',
        razonSocial: 'Distribuidora Visual',
        email: 'ventas@distribuidoravisual.com',
        telefono: '111-111-1111'
    }
  },
  {
    id: 8,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    nombre: 'Cristales Essilor Transitions',
    descripcion: 'Cristales con tecnología fotocromática para adaptación a la luz.',
    categoria: 'anteojos receta',
    precio: 22000.0,
    stock: 30,
    marca: { id: 3, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), nombre: 'Marca C' },
    proveedor: {
        id: 3,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        cuit: '27-11223344-5',
        razonSocial: 'Lentes y Más',
        email: 'contacto@lentesymas.com',
        telefono: '333-333-3333'
    }
  },
  {
    id: 9,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    nombre: 'Audífono Siemens Motion 13P',
    descripcion: 'Audífono con control de ruido avanzado y recargable.',
    categoria: 'audifono',
    precio: 90000.0,
    stock: 5,
    marca: { id: 5, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), nombre: 'Marca E' },
    proveedor: {
        id: 2,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        cuit: '20-87654321-9',
        razonSocial: 'Audifonos Express',
        email: 'info@audifonosexpress.com',
        telefono: '222-222-2222'
    }
  },
  {
    id: 10,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    nombre: 'Lentes Kodak High Index',
    descripcion: 'Lentes ultra delgados para altas graduaciones.',
    categoria: 'anteojos receta',
    precio: 24000.0,
    stock: 10,
    marca: { id: 4, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), nombre: 'Marca D' },
    proveedor: {
        id: 3,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        cuit: '27-11223344-5',
        razonSocial: 'Lentes y Más',
        email: 'contacto@lentesymas.com',
        telefono: '333-333-3333'
    }
  },
  {
    id: 11,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    nombre: 'Lentes Ray-Ban Clubmaster',
    descripcion: 'Diseño retro con lentes polarizados y resistentes.',
    categoria: 'anteojos sol',
    precio: 26000.0,
    stock: 14,
    marca: { id: 1, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), nombre: 'Marca A' },
    proveedor: {
        id: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        cuit: '20-12345678-1',
        razonSocial: 'Distribuidora Visual',
        email: 'ventas@distribuidoravisual.com',
        telefono: '111-111-1111'
    }
  },
  {
    id: 12,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    nombre: 'Lentes Oakley EvZero',
    descripcion: 'Lentes ultraligeros ideales para actividades deportivas.',
    categoria: 'anteojos sol',
    precio: 32000.0,
    stock: 6,
    marca: { id: 2, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), nombre: 'Marca B' },
    proveedor: {
        id: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        cuit: '20-12345678-1',
        razonSocial: 'Distribuidora Visual',
        email: 'ventas@distribuidoravisual.com',
        telefono: '111-111-1111'
    }
  },
  {
    id: 13,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    nombre: 'Cristales Essilor Varilux',
    descripcion: 'Cristales progresivos de alta calidad.',
    categoria: 'anteojos receta',
    precio: 28000.0,
    stock: 20,
    marca: { id: 3, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), nombre: 'Marca C' },
    proveedor: {
        id: 3,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        cuit: '27-11223344-5',
        razonSocial: 'Lentes y Más',
        email: 'contacto@lentesymas.com',
        telefono: '333-333-3333'
    }
  },
  {
    id: 14,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    nombre: 'Audífono Siemens Signia Styletto',
    descripcion: 'Audífono elegante y compacto con batería de larga duración.',
    categoria: 'audifono',
    precio: 85000.0,
    stock: 7,
    marca: { id: 5, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), nombre: 'Marca E' },
    proveedor: {
        id: 2,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        cuit: '20-87654321-9',
        razonSocial: 'Audifonos Express',
        email: 'info@audifonosexpress.com',
        telefono: '222-222-2222'
    }
  },
  {
    id: 15,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    nombre: 'Lentes Kodak Anti Reflect',
    descripcion: 'Lentes con tratamiento antirreflejo para mayor comodidad visual.',
    categoria: 'anteojos receta',
    precio: 21000.0,
    stock: 22,
    marca: { id: 4, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), nombre: 'Marca D' },
    proveedor: {
        id: 3,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        cuit: '27-11223344-5',
        razonSocial: 'Lentes y Más',
        email: 'contacto@lentesymas.com',
        telefono: '333-333-3333'
    }
  }
];
