import { Cliente } from '@/api/entities/clientes';
import { h } from 'vue'
import { ColumnDef } from '@tanstack/vue-table';
import DropdownAction from './data-table-dropdown.vue'

export const columns: ColumnDef<Cliente>[] = [
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
    accessorKey: 'apellido',
    header: () => h('div', 'Apellido'),
    cell: info=> info.getValue(),
  },
  {
    accessorKey: 'email',
    header: () => h('div', 'Email'),
    cell: info=> info.getValue()
  },
    {
    accessorKey: 'telefono',
    header: () => h('div', 'Telefono'),
    cell: info=> info.getValue()
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const cliente = row.original
      return h('div', { class: 'relative text-right right-10  ' }, h(DropdownAction, {
        cliente: { ...cliente, id: cliente.id.toString() },
      }))
    },
}
]