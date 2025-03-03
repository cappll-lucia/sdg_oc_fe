import { Venta } from "@/api/entities/venta";
import {h} from 'vue';
import { ColumnDef } from "@tanstack/vue-table";
import DropdownAction from './data-table-dropdown.vue'
import { formatDate } from "@/lib/utils.recetas";

export const columns: ColumnDef<Venta>[]=[
    {
        accessorKey: 'id',
        header: () => h('div', 'ID'),
        cell: info=> info.getValue()
    },
    {
        accessorKey: 'fecha',
        header: () => h('div', 'Fecha (dd/mm/yyyy)'),
       cell: info => h('span', formatDate(info.getValue() as string))
    },
    {
        accessorKey: 'cliente',
        header: () => h('div', 'Cliente'),
        cell: ({row})=>`${row.original.cliente.apellido}, ${row.original.cliente.nombre}`
    },
    {
        accessorKey: 'importe',
        header: () => h('div', 'Importe Total'),
        cell: ({row})=> `$ ${row.original.importe.toFixed(2)}`
    },
    {
        accessorKey: 'mediosPago',
        header: () => h('div', 'Medios de Pago'),
        cell: ({ row }) => h('div', 
            row.original.mediosDePago.map((mp) => 
                h('span', { class: 'px-2 py-1 bg-secondary rounded-md mr-2' }, mp.tipoMedioDePago)
            )
        )
    },
    {
        accessorKey: 'numeroFactura',
        header: () => h('div', 'Numero Factura'),
        cell: info=> info.getValue() || ' - '
    },
    {
        id: 'actions',
        enableHiding: false,
        cell: ({ row }) => {
          const venta = row.original
          return h('div', { class: 'relative text-right right-10  ' }, h(DropdownAction,{
            venta: { ...venta, id: venta.id },
          }))
        },
    }
]