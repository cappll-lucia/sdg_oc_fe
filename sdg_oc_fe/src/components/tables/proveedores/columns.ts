import { h } from "vue";
import { ColumnDef } from "@tanstack/vue-table";
import DropdownAction from './data-table-dropdown.vue';
import { Proveedor } from "@/api/entities/proveedor";

export const columns: ColumnDef<Proveedor>[] =[
    {
        accessorKey: 'id',
        header: () => h('div', 'ID'),
        cell: info=> info.getValue()
    },
    {
        accessorKey: 'razonSocial',
        header: () => h('div', 'Razon Social'),
        cell: info=> info.getValue(),
    },
    {
        accessorKey: 'cuit',
        header: () => h('div', 'CUIT'),
        cell: info=> info.getValue(),
    },
    {
        accessorKey: 'telefono',
        header: () => h('div', 'Teléfono'),
        cell: info=> info.getValue(),
    },
    {
        accessorKey: 'email',
        header: () => h('div', 'Email'),
        cell: info=> info.getValue(),
    },
    {
        id: 'actions',
        enableHiding: false,
        cell: ({ row }) => {
          const proveedor = row.original
          return h('div', { class: 'relative text-right right-10' }, h(DropdownAction, {
            proveedor: { ...proveedor, id: proveedor.id, razonSocial: proveedor.razonSocial   },
          }))
        },
    }
]