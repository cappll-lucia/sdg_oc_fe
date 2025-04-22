<script setup lang="ts">
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';

defineProps<{
  modelValue: boolean;
  title: string;
  message: string;
  primaryBtn: string;
  primaryAction?: () => void;  
}>();

const emit = defineEmits(['update:modelValue']);

const closeDialog = () => {
  emit('update:modelValue', false);
};
</script>

<template>
  <AlertDialog :open="modelValue">
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle class="text-center">{{ title }}</AlertDialogTitle>
        <AlertDialogDescription class="text-center">
          {{ message }}
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter class=" mt-4 flex sm:justify-center  lg:justify-center  md:justify-center  xs:justify-center  xl:justify-center 2xl:justify-center w-full" >
        <AlertDialogAction class="w-[45%]" @click="primaryAction ? primaryAction() : closeDialog()">
          {{ primaryBtn }}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
