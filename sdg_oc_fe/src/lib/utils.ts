import type { Updater } from '@tanstack/vue-table'
import type { Ref } from 'vue'
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge';
import { z } from 'zod';


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function valueUpdater<T extends Updater<any>>(updaterOrValue: T, ref: Ref) {
  ref.value
    = typeof updaterOrValue === 'function'
      ? updaterOrValue(ref.value)
      : updaterOrValue
}

export const fechaValidator= z
    .object({
      day: z.string(),
      month: z.string(),
      year: z.string(),
    })
    .transform(({ day, month, year }) => {
      let dayNumber = Number(day) +1 ;
      const formattedDate = `${year}-${month.padStart(2, '0')}-${(dayNumber.toString()).padStart(2, '0')}T00:00:00.000Z`;
      return formattedDate;
    })
    .refine((date) => !isNaN(Date.parse(date)));

export const isValidNumber = (value: unknown): value is number => {
  if (typeof value === "number") return true;
  if (typeof value === "string" && value.trim() !== "" && !isNaN(Number(value))) {
    return true;
  }
  return false;
};