import { h } from "vue";
import { ColumnDef } from "@tanstack/vue-table";
import DropdownAction from './data-table-dropdown.vue';
import { ObraSocial } from "@/api/entities/obraSocial";

export const columns: ColumnDef<ObraSocial>[] = [
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
          const obraSocial = row.original
          return h('div', { class: 'relative text-right right-10' }, h(DropdownAction, {
            obraSocial: { ...obraSocial, id: obraSocial.id, nombre: obraSocial.nombre },
          }))
        },
    }
]