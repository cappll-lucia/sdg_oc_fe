<script setup lang="ts">
import { useDialogOptions } from "@/lib/dialogConfig";
import { cn } from "@/lib/utils.recetas";
import { X } from "lucide-vue-next";
import {
  DialogClose,
  DialogContent,
  type DialogContentEmits,
  type DialogContentProps,
  DialogOverlay,
  DialogPortal,
  useForwardPropsEmits,
} from "radix-vue";
import {
  computed,
  type HTMLAttributes,
  onBeforeUnmount,
  onMounted,
  ref,
} from "vue";

const props = defineProps<
  DialogContentProps & { class?: HTMLAttributes["class"] }
>();
const emits = defineEmits<DialogContentEmits>();

// Obtener opciones predeterminadas
const dialogOptions = useDialogOptions();

// Control para restaurar el foco
const previousActiveElement = ref<HTMLElement | null>(null);
const dialogContentRef = ref<HTMLElement | null>(null);

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});

const forwarded = useForwardPropsEmits(delegatedProps, emits);

onMounted(() => {
  // Guardar el elemento activo actual
  if (dialogOptions.restoreFocus) {
    previousActiveElement.value = document.activeElement as HTMLElement;
  }

  // Aplicar autoFocus
  if (dialogOptions.autoFocus) {
    setTimeout(() => {
      if (dialogContentRef.value) {
        if (dialogOptions.autoFocus === "dialog") {
          dialogContentRef.value.focus();
        } else if (typeof dialogOptions.autoFocus === "string") {
          const focusElement = dialogContentRef.value.querySelector(
            dialogOptions.autoFocus as string
          ) as HTMLElement;
          if (focusElement) {
            focusElement.focus();
          }
        }
      }
    }, 0);
  }
});

onBeforeUnmount(() => {
  // Restaurar el foco al elemento anterior
  if (dialogOptions.restoreFocus && previousActiveElement.value) {
    previousActiveElement.value.focus();
  }
});
</script>

<template>
  <DialogPortal>
    <DialogOverlay
      class="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
    />
    <DialogContent
      ref="dialogContentRef"
      v-bind="forwarded"
      :class="
        cn(
          'fixed left-1/2 top-1/2 z-50 grid w-full max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg',
          props.class
        )
      "
      tabindex="-1"
    >
      <slot />

      <DialogClose
        class="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
      >
        <X class="w-4 h-4" />
        <span class="sr-only">Close</span>
      </DialogClose>
    </DialogContent>
  </DialogPortal>
</template>
