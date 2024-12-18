import { Cliente } from '@/api/entities';
import { h } from 'vue'
import { ColumnDef } from '@tanstack/vue-table';
import DropdownAction from './data-table-dropdown.vue'

export const columns: ColumnDef<Cliente>[] = [
  {
    accessorKey: 'id',
    header: () => h('div', 'ID'),
  },
    {
    accessorKey: 'email',
    header: () => h('div', 'Email'),
  },
      {
    accessorKey: 'nombre',
    header: () => h('div', 'Nombre'),
  },
    {
    accessorKey: 'apellido',
    header: () => h('div', 'Apellido'),
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const cliente = row.original
      return h('div', { class: 'relative' }, h(DropdownAction, {
        cliente: { ...cliente, id: cliente.id.toString() },
      }))
    },
}
]