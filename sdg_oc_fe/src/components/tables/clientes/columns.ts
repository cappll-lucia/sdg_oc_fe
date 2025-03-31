import { Cliente, TipoDocumento } from '@/api/entities/clientes';
import { h } from 'vue'
import { ColumnDef } from '@tanstack/vue-table';
import DropdownAction from './data-table-dropdown.vue'

export const columns: ColumnDef<Cliente>[] = [
  {
    accessorKey: 'nombre',
    header: () => h('div', 'Apellido y Nombre'),
    cell: ({row})=> `${row.original.apellido}, ${row.original.nombre} `
  },
  {
    accessorKey: 'documento',
    header: () => h('div', 'Tipo y Nro Documento'),
    cell: ({row})=> `${TipoDocumento[row.original.tipoDocumento]} - ${row.original.nroDocumento} `,
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