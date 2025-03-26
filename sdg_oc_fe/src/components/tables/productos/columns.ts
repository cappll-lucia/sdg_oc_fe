import { h } from "vue";
import { ColumnDef } from "@tanstack/vue-table";
import DropdownAction from './data-table-dropdown.vue';
import { Producto } from "@/api/entities/producto";
import { CategoriaEnum } from "@/api/entities/producto";

export const columns: ColumnDef<Producto>[] = [
    {
        accessorKey: 'id',
        header: () => h('div', 'ID'),
        cell: info=> info.getValue()
    },
    {
        accessorKey: 'descripcion',
        header: () => h('div', 'Descripción'),
        cell: info=> info.getValue(),
    },
    {
        accessorKey: 'categoria',
        header: () => h('div', 'Categoría'),
        cell: ({row})=>h('div', { class: 'capitalize'}, CategoriaEnum[row.original.categoria as keyof typeof CategoriaEnum].toLowerCase() || row.original.categoria.toLowerCase()),
    },
    {
        accessorKey: 'marca',
        header: () => h('div', 'Marca'),
        cell: ({row})=> row.original.marca.nombre

    },
    {
        accessorKey: 'proveedor',
        header: () => h('div', 'Proveedor'),
        cell: ({row})=>row.original.proveedor.razonSocial
    },
    {
        accessorKey: 'precio',
        header: () => h('div', 'Precio'),
        cell: ({row})=>`$ ${row.original.precio.toFixed(2)}`

    },
    {
        id: 'actions',
        enableHiding: false,
        cell: ({ row }) => {
          const producto = row.original
          return h('div', { class: 'relative text-right right-10' }, h(DropdownAction, {
            producto: { ...producto, id: producto.id.toString() },
          }))
        },
    }
]