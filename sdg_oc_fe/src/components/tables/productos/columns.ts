import { h } from "vue";
import { ColumnDef } from "@tanstack/vue-table";
import DropdownAction from './data-table-dropdown.vue';
import { Producto } from "@/api/entities";

export const columns: ColumnDef<Producto>[] = [
    {
        accessorKey: 'id',
        header: () => h('div', 'ID'),
        cell: info=> info.getValue()
    },
    {
        accessorKey: 'nombre',
        header: () => h('div', 'Nombre'),
        cell: info=> info.getValue(),
    },
    {
        accessorKey: 'categoria',
        header: () => h('div', 'Categoria'),
        cell: info=> info.getValue(),
    },
    {
        accessorKey: 'marca',
        header: () => h('div', 'Marca'),
        cell: info=> info.getValue(),
    },
    {
        accessorKey: 'proveedor',
        header: () => h('div', 'Proveedor'),
        cell: info=> info.getValue(),
    },
    {
        accessorKey: 'precio',
        header: () => h('div', 'Precio'),
        cell: info=> info.getValue(),
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