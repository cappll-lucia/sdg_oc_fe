// src/stores/CajaStore.ts
import { defineStore } from 'pinia';

export const useCajaStore = defineStore('CajaStore', {
  state: () => ({
    lastOpenedDate: '' as string | undefined, 
  }),

  actions: {
    openCaja() {
      this.lastOpenedDate = new Date().toISOString().split('T')[0]; 
    }
  },

  getters: {
    isCajaOpenedToday: (state) => {
      const fechaHoy = new Date().toISOString().split('T')[0]; 
      return state.lastOpenedDate === fechaHoy; 
    }
  }
});