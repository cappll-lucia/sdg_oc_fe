import { ClienteConRecetaRecetados } from "@/api/entities";
import {h} from 'vue';
import { ColumnDef } from "@tanstack/vue-table";
import { Button } from "@/components/ui/button";
import { ChevronRightIcon } from '@radix-icons/vue';
import {router} from '@/router'
export const columns: ColumnDef<ClienteConRecetaRecetados>[] = [
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
    header: ()=> h('div', 'Fecha Ultima Receta'),
    cell: ({row})=>{
        const fechas = row.original.recetasRecetados.map((rec)=>rec.fecha)
        return fechas.reduce((max, current)=>(current > max ? current : max)).toISOString().split("T")[0]
    }
  },
  {
    accessorKey: 'cantidad_recetas',
    header: ()=> h('div', 'Cantidad Recetas Anteojos Recetados'),
    cell: ({row})=>row.original.recetasRecetados.length
  },
{
    accessorKey: 'acciones',
    header: () => h('div', ''),
    cell: ({ row }) =>
      h(Button, {
        variant: 'outline',
        size: 'icon',
        onClick: () => {
         router.replace( `/recetas/${row.original.id}`)
        }
      }, h(ChevronRightIcon, { class: 'w-4 h-4' }))
  }
]