import { Venta } from "@/api/entities/venta";
import {h} from 'vue';
import { ColumnDef } from "@tanstack/vue-table";
import DropdownAction from './data-table-dropdown.vue'
import { formatDate } from "@/lib/utils.recetas";
import { tipoComprobanteDisplay } from "@/lib/utils";

export const columns: ColumnDef<Venta>[]=[
    {
        accessorKey: 'fecha',
        header: () => h('div', 'Fecha'),
       cell: info => h('span', formatDate(info.getValue() as string))
    },
    {
        accessorKey: 'cliente',
        header: () => h('div', 'Cliente'),
        cell: ({row})=> row.original.cliente.id!=0 
            ?  `${row.original.cliente.apellido}, ${row.original.cliente.nombre}`
            : 'Consumidor Final'
    },
    {
        accessorKey: 'importe',
        header: () => h('div', 'Importe Total'),
        cell: ({row})=> `$ ${totalVenta(row.original).toFixed(2)}`
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
        accessorKey: 'tipoFactura',
        header: () => h('div', 'Tipo Factura'),
        cell: ({row})=>  row.original.factura 
        ? `${tipoComprobanteDisplay(row.original.factura.tipoComprobante)?.nombre} ${tipoComprobanteDisplay(row.original.factura.tipoComprobante)?.letra}`
        : h('span', { class: 'block text-center w-full pr-10' }, '-' )
    },
    {
        accessorKey: 'numeroFactura',
        header: () => h('div', 'Número Factura'),
        cell: ({ row }) => {
            const numero = row.original.factura?.numeroComprobante;
            return h(
            'div',
            { class: numero ? '' : 'text-red-700 ' },
            numero || 'Pendiente'
            );
        }
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


const totalVenta = (venta: Venta)=>{
    const totalBruto = venta.lineasDeVenta.reduce((total, linea) => {
            return total + (linea.precioIndividual ? linea.precioIndividual * linea.cantidad : 0);
        }, 0);
    const montoOS = venta.ventaObraSocial.reduce((total, os)=>{
            return total + os.importe
        }, 0);
    const totalFinalVenta = totalBruto - montoOS; 
    const montoDto = totalFinalVenta * venta.descuentoPorcentaje / 100
    return totalFinalVenta - montoDto
}   