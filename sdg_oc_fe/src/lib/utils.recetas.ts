import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { Updater } from '@tanstack/vue-table'
import type { Ref } from 'vue'
import { RecetasAereos } from '@/api/entities/recetasAereos';
import { RecetaContacto } from '@/api/entities/recetasContacto';
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function valueUpdater<T extends Updater<any>>(updaterOrValue: T, ref: Ref) {
  ref.value = typeof updaterOrValue === 'function'
    ? updaterOrValue(ref.value)
    : updaterOrValue
}

export const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

export function generateRecetasRecetadosPDF (recetas: RecetasAereos[], nombreCliente:string) {
  const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(`Recetas Anteojos Recetados`, 105, 20, { align: "center" });
    doc.setFontSize(14);
    doc.text(`${nombreCliente}`, 105, 30, { align: "center" });
  let y = 30;

  recetas.forEach((receta, index) => {
    doc.setFontSize(14);
    y+=10;
    doc.text(`Receta #${receta.id}`, 20, y);
    y += 6;

    const recetaInfo = [
      ["Fecha", new Date(receta.fecha).toLocaleDateString()],
      ["Oftalmólogo", receta.oftalmologo],
      ["Tipo", receta.tipoReceta],
      ["Cristal", receta.cristal],
      ["Color", receta.color],
      ["Tratamiento", receta.tratamiento],
      ["Armazón", receta.armazon ?? "Sin especificar"],
      ["Observaciones", receta.observaciones],
    ];

    autoTable(doc, {
      startY: y,
      theme: "striped",
      head: [["Campo", "Valor"]],
      body: recetaInfo,
      styles: { fontSize: 10 },
      margin: { left: 20, right: 20 },
    });

    y = (doc as any).lastAutoTable.finalY + 5;

    if (receta.detallesRecetaLentesAereos.length > 0) {
      const detalleRows = receta.detallesRecetaLentesAereos.flatMap((d) => [
        [
          d.tipo_detalle,
          "OD",
          d.od_esferico,
          d.od_cilindrico,
          d.od_grados,
          d.dnp,
        ],
        [
          d.tipo_detalle,
          "OI",
          d.oi_esferico,
          d.oi_cilindrico,
          d.oi_grados,
          d.dnp,
        ],
      ]);

      autoTable(doc, {
        startY: y,
        head: [["Tipo", "Ojo", "Esférico", "Cilíndrico", "Grados", "DNP"]],
        body: detalleRows,
        styles: { fontSize: 10 },
        margin: { left: 20, right: 20 },
        theme: "striped",
      });

      y = (doc as any).lastAutoTable.finalY + 10;
    } else {
      doc.setFontSize(10);
      doc.text("Sin detalles de lentes aéreos.", 20, y);
      y += 10;
    }

    if (y > 270 && index < recetas.length - 1) {
      doc.addPage();
      y = 20;
    }
  });
  doc.save(`Recetas_${nombreCliente}.pdf`);
};


export function generateRecetasContactoPDF (recetas: RecetaContacto[], nombreCliente:string) {
  const doc = new jsPDF();
  doc.setFontSize(18);
    doc.text(`Recetas Lentes de Contacto`, 105, 20, { align: "center" });
    doc.setFontSize(14);
    doc.text(`${nombreCliente}`, 105, 30, { align: "center" });

  let y = 30;

  recetas.forEach((receta, index) => {
    doc.setFontSize(14);
    y+=10;
    doc.text(`Receta #${receta.id}`, 20, y);
    y += 6;

    const infoGeneral = [
      ["Fecha", new Date(receta.fecha).toLocaleDateString()],
      ["Oftalmólogo", receta.oftalmologo],
      ["Observaciones", receta.observaciones],
    ];

    autoTable(doc, {
      startY: y,
      head: [["Campo", "Valor"]],
      body: infoGeneral,
      styles: { fontSize: 10 },
      margin: { left: 20, right: 20 },
    });

    y = (doc as any).lastAutoTable.finalY + 5;

    // Queterometría
    const queteBody = [
      ["M1 OD", receta.quet_m1_od, "M2 OD", receta.quet_m2_od],
      ["M1 OI", receta.quet_m1_oi, "M2 OI", receta.quet_m2_oi],
    ];

    autoTable(doc, {
      startY: y,
      head: [["Queterometría", "", "", ""]],
      body: queteBody,
      styles: { fontSize: 10 },
      margin: { left: 20, right: 20 },
    });

    y = (doc as any).lastAutoTable.finalY + 3;

    doc.setFontSize(10);
    y += 7;
    doc.text(`Observaciones Queterometría: ${receta.observaciones_queterometria}`, 20, y);
    y += 7;

    const booleanos = [
      ["Maquillaje", receta.maquillaje ? "Sí" : "No"],
      ["Tonicidad", receta.tonicidad ? "Sí" : "No"],
      ["Hendidura Palpebral", receta.hendidura_palpebral ? "Sí" : "No"],
      ["Altura Palpebral", receta.altura_palpebral ? "Sí" : "No"],
      ["Buen Parpadeo (Ritmo)", receta.buen_parpadeo_ritmo ? "Sí" : "No"],
      ["Buen Parpadeo (Amplitud)", receta.buen_parpadeo_amplitud ? "Sí" : "No"],
      ["Estesiometría", receta.estesiometria],
    ];

    autoTable(doc, {
      startY: y,
      head: [["Evaluación", "Resultado"]],
      body: booleanos,
      styles: { fontSize: 10 },
      margin: { left: 20, right: 20 },
    });

    y = (doc as any).lastAutoTable.finalY + 5;

    // Graduación OD / OI
    const graduacion = [
      [
        "OD",
        receta.od_cb,
        receta.od_esferico,
        receta.od_cilindrico,
        receta.od_eje,
        receta.od_diametro,
        receta.od_marca,
      ],
      [
        "OI",
        receta.oi_cb,
        receta.oi_esferico,
        receta.oi_cilindrico,
        receta.oi_eje,
        receta.oi_diametro,
        receta.oi_marca,
      ],
    ];

    autoTable(doc, {
      startY: y,
      head: [["Ojo", "CB", "Esférico", "Cilíndrico", "Eje", "Diámetro", "Marca"]],
      body: graduacion,
      styles: { fontSize: 10 },
      margin: { left: 20, right: 20 },
      theme: "striped",
    });

    y = (doc as any).lastAutoTable.finalY + 10;

    if (y > 270 && index < recetas.length - 1) {
      doc.addPage();
      y = 20;
    }
  });

     doc.save(`Recetas_${nombreCliente}.pdf`);
};


export function isCuit(_cuit: string){
    if (typeof _cuit !== 'string') return false;
          return /^\d{2}-\d{8}-\d{1}$/.test(_cuit);
}