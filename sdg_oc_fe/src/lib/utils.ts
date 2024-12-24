import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { Updater } from '@tanstack/vue-table'
import type { Ref } from 'vue'
import { RecetaRecetados } from '@/api/entities';
import {jsPDF} from "jspdf"; 
import autoTable from "jspdf-autotable"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function valueUpdater<T extends Updater<any>>(updaterOrValue: T, ref: Ref) {
  ref.value = typeof updaterOrValue === 'function'
    ? updaterOrValue(ref.value)
    : updaterOrValue
}


export function generateRecetasPDF (recetas: RecetaRecetados[], nombreCliente:string) {

    const doc = new jsPDF();
    let yOffset = 10; // Posición inicial en el eje Y

    recetas.forEach((receta) => {
        doc.setFontSize(16);
        doc.text(`Receta ${receta.id}`, 10, yOffset);
        yOffset += 10;

        doc.setFontSize(12);
        doc.text(`Tipo Receta: ${receta.tipo}`, 10, yOffset);
        doc.text(`Fecha Receta: ${receta.fecha.toISOString().split("T")[0]}`, 140, yOffset, { align: "right" });
        yOffset += 10;

        autoTable(doc, {
            startY: yOffset,
            head: [["Ojo", "Esf.", "Cil.", "A"]],
            body: [
                [
                    "O.D.",
                    receta.odEsf !== null && receta.odEsf !== undefined ? receta.odEsf.toFixed(2) : "--",
                    receta.odCil !== null && receta.odCil !== undefined ? receta.odCil.toFixed(2): "--",
                    receta.odA !== null && receta.odA !== undefined ? receta.odA + "°" : "--"
                ],
                [
                    "O.I.",
                    receta.oiEsf !== null && receta.oiEsf !== undefined ? receta.oiEsf.toFixed(2) : "--",
                    receta.oiCil !== null && receta.oiCil !== undefined ? receta.oiCil.toFixed(2) : "--",
                    receta.oiA !== null && receta.oiA !== undefined ? receta.oiA + "°" : "--"
                ],
            ],
            theme: "grid",
        });
        yOffset += 25;

        autoTable(doc, {
            startY: yOffset,
            head: [["DNP", "Phi"]],
            body: [
                [ receta.dnp1 || "--", receta.dnp2 || "--"],
            ],
            theme: "grid",
        });
        yOffset +=25;

       doc.text(`Cristal: ${receta.cristal || "--"}`, 10, yOffset);
        yOffset += 10; 

        doc.text(`Color: ${receta.color || "--"}`, 10, yOffset);
        yOffset += 10; 

        doc.text(`Tratamiento: ${receta.tratamiento || "--"}`, 10, yOffset);
        yOffset += 10; 

        doc.text(`Observaciones: ${receta.observaciones || "--"}`, 10, yOffset);
        yOffset += 20;

        if (yOffset > 200) {
            doc.addPage();
            yOffset = 20;
        }
    });


    doc.save(`Recetas_${nombreCliente}.pdf`);
};