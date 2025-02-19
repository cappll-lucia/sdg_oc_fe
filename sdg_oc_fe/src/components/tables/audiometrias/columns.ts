import { ClienteConAudiometria } from "@/api/entities/entities";
import {h} from 'vue';
import { ColumnDef } from "@tanstack/vue-table";
import { Button } from "@/components/ui/button";
import { ChevronRightIcon } from "@radix-icons/vue";
import router from '@/router/index';

export const columns: ColumnDef<ClienteConAudiometria>[] = [
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
    accessorKey: 'ultima_receta',
    header: ()=> h('div', 'Fecha Ultima Audiometría'),
    cell: ({row})=>{
        const fechas = row.original.audiometrias.map((a)=>a.fechaInforme)
        return fechas.reduce((max, current)=>(current > max ? current : max), new Date(0)).toISOString().split("T")[0] || 0
       
    }
  },
  {
    accessorKey: 'acciones',
    header: () => h('div', ''),
    cell: ({ row }) =>
      h(Button, {
        variant: 'outline',
        size: 'icon',
        onClick: () => {
         router.replace( `/audiometrias/${row.original.id}`)
        }
      }, h(ChevronRightIcon, { class: 'w-4 h-4' }))
  }
]