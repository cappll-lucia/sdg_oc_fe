import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { Updater } from '@tanstack/vue-table'
import type { Ref } from 'vue'
import {jsPDF} from "jspdf"; 
import autoTable from "jspdf-autotable"
import { RecetasAereos } from '@/api/entities/recetasAereos';
import { RecetaContacto } from '@/api/entities/recetasContacto';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function valueUpdater<T extends Updater<any>>(updaterOrValue: T, ref: Ref) {
  ref.value = typeof updaterOrValue === 'function'
    ? updaterOrValue(ref.value)
    : updaterOrValue
}

export const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

export function generateRecetasRecetadosPDF (recetas: RecetasAereos[], nombreCliente:string) {

    const doc = new jsPDF();
    let yOffset = 10; // Posición inicial en el eje Y

    recetas.forEach((receta) => {
        doc.setFontSize(16);
        doc.text(`Receta ${receta.id}`, 10, yOffset);
        doc.text(`Cliente: ${nombreCliente}`, 10, yOffset);

        yOffset += 10;

        doc.setFontSize(12);
        doc.text(`Tipo Receta: ${receta.tipoReceta}`, 10, yOffset);
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


export function generateRecetasContactoPDF (recetas: RecetaContacto[], nombreCliente:string) {

    const doc = new jsPDF();
    let yOffset = 10; // Posición inicial en el eje Y

    recetas.forEach((receta) => {
        doc.setFontSize(16);
        doc.text(`Receta ${receta.id}`, 10, yOffset);
        yOffset += 10;
        doc.text(`Cliente: ${nombreCliente}`, 10, yOffset);

        yOffset += 10;

        doc.setFontSize(12);
        doc.text(`Receta Lentes de Contacto`, 10, yOffset);
        doc.text(`Fecha Receta: ${receta.fecha.toISOString().split("T")[0]}`, 140, yOffset, { align: "right" });
        yOffset += 10;

        autoTable(doc, {
            startY: yOffset,
            head: [["Ojo", "C.B.", "Esf.", "Cil.", "Eje", "Diam."]],
            body: [
                [
                    "O.D.",
                    receta.odCb !== null && receta.odCb !== undefined ? receta.odCb.toFixed(2) : "--",
                    receta.odEsferico !== null && receta.odEsferico !== undefined ? receta.odEsferico.toFixed(2) : "--",
                    receta.odCilindrico !== null && receta.odCilindrico !== undefined ? receta.odCilindrico.toFixed(2): "--",
                    receta.odEje !== null && receta.odEje !== undefined ? receta.odEje + "°" : "--",
                    receta.odDiametro !== null && receta.odDiametro !== undefined ? receta.odDiametro : "--"

                ],
                [
                    "O.I.",
                    receta.oiCb !== null && receta.oiCb !== undefined ? receta.oiCb.toFixed(2) : "--",
                    receta.oiEsferico !== null && receta.oiEsferico !== undefined ? receta.oiEsferico.toFixed(2) : "--",
                    receta.oiCilindrico !== null && receta.oiCilindrico !== undefined ? receta.oiCilindrico.toFixed(2): "--",
                    receta.oiEje !== null && receta.oiEje !== undefined ? receta.oiEje + "°" : "--",
                    receta.oiDiametro !== null && receta.oiDiametro !== undefined ? receta.oiDiametro : "--"
                ],
            ],
            theme: "grid",
        });
        yOffset += 30;

       doc.text(`Marca: ${receta.marca || "--"}`, 10, yOffset);
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


export function isCuit(_cuit: string){
    if (typeof _cuit !== 'string') return false;
          return /^\d{2}-\d{8}-\d{1}$/.test(_cuit);
}