import { h } from "vue";
import { ColumnDef } from "@tanstack/vue-table";
import DropdownAction from './data-table-dropdown.vue';
import { Marca } from "@/api/entities";

export const columns: ColumnDef<Marca>[] = [
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
        id: 'actions',
        enableHiding: false,
        cell: ({ row }) => {
          const marca = row.original
          return h('div', { class: 'relative text-right right-10' }, h(DropdownAction, {
            marca: { ...marca, id: marca.id.toString() },
          }))
        },
    }
]