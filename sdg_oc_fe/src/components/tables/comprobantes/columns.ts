import {h} from 'vue';
import { ColumnDef } from "@tanstack/vue-table";
import DropdownAction from './data-table-dropdown.vue'
import { formatDate } from "@/lib/utils.recetas";
import { tipoComprobanteDisplay } from "@/lib/utils";
import { Comprobante } from "@/api/entities/comprobante";

export const columns: ColumnDef<Comprobante>[]=[
    {
        accessorKey: 'fechaEmision',
        header: () => h('div', 'Fecha'),
       cell: info => h('span', formatDate(info.getValue() as string))
    },
    {
        accessorKey: 'cliente',
        header: () => h('div', 'Cliente'),
        cell: ({row})=> getClienteValue(row.original)
    },
    {
        accessorKey: 'importe',
        header: () => h('div', 'Importe Total'),
        cell: ({row})=> `$ ${row.original.importeTotal.toFixed(2)}`
    },
    {
        accessorKey: 'tipoComprobante',
        header: () => h('div', 'Tipo Factura'),
        cell: ({row})=>  row.original.tipoComprobante 
                        ? `${tipoComprobanteDisplay(row.original.tipoComprobante)?.nombre} ${tipoComprobanteDisplay(row.original.tipoComprobante)?.letra}`
                        : ' Pendiente '
    },
    {
        accessorKey: 'numeroComprobante',
        header: () => h('div', 'Número Comprobante'),
        cell: ({row})=>  row.original.numeroComprobante ? row.original.numeroComprobante : ' Pendiente '
    },
    {
        accessorKey: 'CAE',
        header: () => h('div', 'CAE'),
       cell: ({row})=>  row.original.CAE
    },
    {
        id: 'actions',
        enableHiding: false,
        cell: ({ row }) => {
          const comprobante = row.original
          return h('div', { class: 'relative text-right right-10' }, h(DropdownAction, {
            comprobante: comprobante as Comprobante
          }))
        },
    }
]


const getClienteValue = (comprobante: Comprobante)=>{
    let cliente
    if(comprobante.venta){
        cliente = comprobante.venta.cliente
    }else{
        cliente= comprobante.facturaRelacionada.venta.cliente
    }
    return cliente.id!=0 ? `${cliente.apellido}, ${cliente.nombre}` : "Consumidor Final"
}