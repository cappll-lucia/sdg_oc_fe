// src/stores/CajaStore.ts
import { cajaApi } from '@/api/libs/caja';
import { defineStore } from 'pinia';

export const useCajaStore = defineStore('CajaStore', {

  actions: {
    async isCajaOpenedToday() {
      const today = new Date().toISOString().split('T')[0] ||  new Date().toISOString(); 
      const apertura = await cajaApi.getApertura(today);
      return Boolean(apertura)
    },
    async isCajaClosedToday() {
      const today = new Date().toISOString().split('T')[0] ||  new Date().toISOString(); 
      const cierre = await cajaApi.getCierre(today);
      return Boolean(cierre)
    }
  }
});