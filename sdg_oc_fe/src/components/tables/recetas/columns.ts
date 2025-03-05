import { ClienteRecetasCount } from '@/api/entities/clientes';
import {h} from 'vue';
import { ColumnDef } from "@tanstack/vue-table";
import { Button } from "@/components/ui/button";
import { ChevronRightIcon } from '@radix-icons/vue';
import router from "@/router/index";
import { formatDate } from "@/lib/utils.recetas";


export const columns: ColumnDef<ClienteRecetasCount>[] = [
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
    accessorKey: 'fecha_ultima_receta',
    header: ()=> h('div', 'Fecha Ultima Receta'),
    cell: ({row})=> row.original.fechaUltimaReceta ? formatDate(row.original.fechaUltimaReceta.toString()) : '-' },

  {
    accessorKey: 'cantidad_recetas_recetados',
    header: ()=> h('div', 'Cantidad Recetas Anteojos Recetados'),
    cell: ({row})=>row.original.cantidadRecetasLentesAereos  },
    {
    accessorKey: 'cantidad_recetas_contacto',
    header: ()=> h('div', 'Cantidad Recetas Lentes de Contacto'),
    cell: ({row})=>row.original.cantidadRecetasLentesContacto
  },
{
    accessorKey: 'acciones',
    header: () => h('div', ''),
    cell: ({ row }) =>
      h(Button, {
        variant: 'outline',
        size: 'icon',
        onClick: () => {
         router.replace( `/recetas/${row.original.clienteId}`)
        }
      }, h(ChevronRightIcon, { class: 'w-4 h-4' }))
  }
]