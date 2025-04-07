import {h} from 'vue';
import { ColumnDef } from "@tanstack/vue-table";
import { Button } from "@/components/ui/button";
import { ChevronRightIcon } from "@radix-icons/vue";
import router from '@/router/index';
import { ClienteAudiometriasFecha } from "@/api/entities/audiometrias";
import { formatDate } from '@/lib/utils.recetas';

export const columns: ColumnDef<ClienteAudiometriasFecha>[] = [
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
    accessorKey: 'fechaUltimaAudiometria',
    header: ()=> h('div', 'Fecha Ultima Audiometría'),
    cell: ({row})=>row.original.fechaUltimaAudiometria ? formatDate(row.original.fechaUltimaAudiometria.toString()) : ' - ' 
  },
  {
    accessorKey: 'acciones',
    header: () => h('div', ''),
    cell: ({ row }) =>
      h(Button, {
        variant: 'outline',
        size: 'icon',
        onClick: () => {
         router.push( `/audiometrias/${row.original.clienteId}`)
        }
      }, h(ChevronRightIcon, { class: 'w-4 h-4' }))
  }
]