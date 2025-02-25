<script setup lang="ts">
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-vue-next'

defineProps<{
  modelValue: boolean;
  title: string;
  message: string;
  button: string;
  action?: () => void;  
}>();

const emit = defineEmits(['update:modelValue']);

const closeDialog = () => {
  emit('update:modelValue', false);
};
</script>

<template>
  <AlertDialog :open="modelValue">
    <AlertDialogContent>
        <Alert variant="destructive">
          <div  class="flex justify-center">
            <AlertCircle class="w-4 h-4 mr-2" />
            <AlertTitle>{{ title }}</AlertTitle>
          </div>
          <AlertDescription class="text-center">{{ message }}</AlertDescription>
        </Alert>
        <AlertDialogFooter>
        <AlertDialogAction @click="action ? action() : closeDialog()">
          {{ button }}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
