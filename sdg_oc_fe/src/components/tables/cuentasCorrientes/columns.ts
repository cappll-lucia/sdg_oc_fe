import { CuentaCorriente } from '@/api/entities/cuentaCorriente';
import { TipoDocumento } from '@/api/entities/clientes';
import { h } from 'vue'
import { ColumnDef } from '@tanstack/vue-table';
import Button from '@/components/ui/button/Button.vue';
import { router } from '@/router';
import { ChevronRightIcon } from 'lucide-vue-next';

export const columns: ColumnDef<CuentaCorriente>[] = [
    {
        accessorKey: 'nombre',
        header: () => h('div', 'Apellido y Nombre'),
        cell: ({row})=> `${row.original.cliente.apellido}, ${row.original.cliente.nombre} `
    },
    {
        accessorKey: 'documento',
        header: () => h('div', 'Tipo y Nro Documento'),
        cell: ({row})=> `${TipoDocumento[row.original.cliente.tipoDocumento]} - ${row.original.cliente.nroDocumento} `,
    }, 
    {
        accessorKey: 'estado',
        header: ()=> h('div', 'Estado'),
        cell: ({row})=> {
            const state = getState(row.original.saldo)
            return h('div', {class: getColor(state)}, state)
        }
    },
    {
        accessorKey: 'saldo',
        header: ()=> h('div', 'Saldo'),
        cell: ({row})=> {
            const state = getState(row.original.saldo)
            return h(
                'div', {class: getColor(state)} ,`$ ${row.original.saldo}`
            )
        }
    },
    {
        accessorKey: 'actions',
        header: () => h('div', ''),
        cell: ({ row }) =>
        h(Button, {
            variant: 'outline',
            size: 'icon',
            onClick: () => {
            router.push( `/clientes/dashboard/${row.original.cliente.id}`)
            }
        }, h(ChevronRightIcon, { class: 'w-4 h-4' }))
  }
]


function getColor(value:string){
    if(value=='Saldo negativo')
        return 'text-red-700';
    if(value=='Saldo a favor')
        return 'text-green-700';
    return ''
}

function getState(saldo: number){
    const value = saldo >= 0 
    ? ( saldo == 0
        ? '-'
        : 'Saldo a favor'
    ) 
    : 'Saldo negativo'; 
    return value
}