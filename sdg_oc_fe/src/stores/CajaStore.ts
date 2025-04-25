// src/stores/CajaStore.ts
import { cajaApi } from "@/api/libs/caja";
import { defineStore } from "pinia";

export const useCajaStore = defineStore("CajaStore", {
  actions: {
    async isCajaOpenedToday() {
      const today = getFechaUTC3();
      const apertura = await cajaApi.getApertura(today);
      return Boolean(apertura);
    },
    async isCajaClosedToday() {
      const today = getFechaUTC3();
      const cierre = await cajaApi.getCierre(today);
      return Boolean(cierre);
    },
  },
});
function getFechaUTC3() {
  return new Date()
    .toLocaleDateString("es-AR", {
      timeZone: "America/Argentina/Buenos_Aires",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
    .split("/")
    .reverse()
    .join("-");
}
