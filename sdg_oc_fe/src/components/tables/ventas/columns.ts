import { TipoMedioDePagoEnum } from "@/api/entities/mediosDePago";
import { Venta } from "@/api/entities/venta";
import { tipoComprobanteDisplay } from "@/lib/utils";
import { formatDate } from "@/lib/utils.recetas";
import { ColumnDef } from "@tanstack/vue-table";
import { h } from "vue";
import DropdownAction from "./data-table-dropdown.vue";

export const columns: ColumnDef<Venta>[] = [
  {
    accessorKey: "fecha",
    header: () => h("div", "Fecha"),
    cell: (info) => h("span", formatDate(info.getValue() as string)),
  },
  {
    accessorKey: "cliente",
    header: () => h("div", "Cliente"),
    cell: ({ row }) =>
      row.original.cliente.id != 0
        ? `${row.original.cliente.apellido}, ${row.original.cliente.nombre}`
        : "Consumidor Final",
  },
  {
    accessorKey: "importe",
    header: () => h("div", "Importe Total"),
    cell: ({ row }) => `$ ${row.original.importe.toFixed(2)}`,
  },
  {
    accessorKey: "mediosPago",
    header: () => h("div", "Medios de Pago"),
    cell: ({ row }) =>
      h(
        "div",

        row.original.mediosDePago.map((mp, i) =>
          h(
            "span",
            {
              class:
                i === 0
                  ? "mr-1 p-1 border rounded-lg  text-center"
                  : "p-1 border rounded-lg  text-center",
            },
            TipoMedioDePagoEnum[
              mp.tipoMedioDePago as keyof typeof TipoMedioDePagoEnum
            ]
          )
        )
      ),
  },
  {
    accessorKey: "factura",
    header: () => h("div", "Factura"),
    cell: ({ row }) =>
      row.original.factura
        ? `${
            tipoComprobanteDisplay(row.original.factura.tipoComprobante)?.nombre
          } ${
            tipoComprobanteDisplay(row.original.factura.tipoComprobante)?.letra
          } - ${row.original.factura?.numeroComprobante}`
        : h("span", { class: "block w-full pr-10 text-red-700" }, "Pendiente"),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const venta = row.original;
      return h(
        "div",
        { class: "relative text-right right-10  " },
        h(DropdownAction, {
          venta: { ...venta, id: venta.id },
        })
      );
    },
  },
];
