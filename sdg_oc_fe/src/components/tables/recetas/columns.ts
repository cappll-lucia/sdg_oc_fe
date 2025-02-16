import { ClienteConReceta } from "@/api/entities/entities";
import {h} from 'vue';
import { ColumnDef } from "@tanstack/vue-table";
import { Button } from "@/components/ui/button";
import { ChevronRightIcon } from '@radix-icons/vue';
import {router} from '@/router'
export const columns: ColumnDef<ClienteConReceta>[] = [
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
        const fechas_recetados = row.original.recetasRecetados.map((rec)=>rec.fecha)
        const fechas_contacto = row.original.recetasContacto.map((rec)=>rec.fecha)
        const max_recetados = fechas_recetados.reduce((max, current)=>(current > max ? current : max), new Date(0)).toISOString().split("T")[0] || 0
        const max_contacto = fechas_contacto.reduce((max, current)=>(current > max ? current : max), new Date(0)).toISOString().split("T")[0] || 0
        return max_contacto > max_recetados ? max_contacto : max_recetados
    }
  },
  {
    accessorKey: 'cantidad_recetas_recetados',
    header: ()=> h('div', 'Cantidad Recetas Anteojos Recetados'),
    cell: ({row})=>row.original.recetasRecetados.length
  },
    {
    accessorKey: 'cantidad_recetas_contacto',
    header: ()=> h('div', 'Cantidad Recetas Lentes de Contacto'),
    cell: ({row})=>row.original.recetasContacto.length
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