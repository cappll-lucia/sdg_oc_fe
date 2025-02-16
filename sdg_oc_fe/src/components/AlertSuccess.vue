<script setup lang="ts">
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel
} from '@/components/ui/alert-dialog';

defineProps<{
  modelValue: boolean;
  title: string;
  message: string;
  primaryBtn: string;
  secondaryBtn?: string;
  primaryAction?: () => void;  
  secondaryAction?: () => void; 
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
        <AlertDialogTitle>{{ title }}</AlertDialogTitle>
        <AlertDialogDescription>
          {{ message }}
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter class=" bg-red-500 flex  sm:justify-between  lg:justify-between  md:justify-between  xs:justify-between  xl:justify-between 2xl:justify-between w-full" >
        <AlertDialogCancel  class="w-[40%]" @click="secondaryAction ? secondaryAction() : closeDialog()">
          {{ secondaryBtn }}
        </AlertDialogCancel>
        <AlertDialogAction class="w-[40%]" @click="primaryAction ? primaryAction() : closeDialog()">
          {{ primaryBtn }}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
