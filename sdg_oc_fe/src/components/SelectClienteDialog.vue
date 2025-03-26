<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  User,
} from 'lucide-vue-next'
import {ScrollArea} from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input'
import { MagnifyingGlassIcon } from '@radix-icons/vue';
import { ref } from 'vue';
import { Cliente } from '@/api/entities/clientes';
import { clientesApi } from '@/api/libs/clientes';
import { Button } from '@/components/ui/button';


const searchClientesTxt = ref <string>('');
const foundClientes = ref<Cliente[]>([]);


defineProps<{
  modelValue: boolean;
  title: string;
}>();

const emit = defineEmits(['update:modelValue', 'selectCliente']);

const selectCliente = (cliente: Cliente) => {
  emit('selectCliente', cliente);
};

const searchClientes = async()=>{
    foundClientes.value = await clientesApi.getAll({filtro: searchClientesTxt.value})
}


</script>


<template>
    <Dialog :open="modelValue"  @update:open="emit('update:modelValue', $event)" >
        <DialogTrigger as-child>
            <Button variant="default" size="icon" class="w-9 h-9 ml-4">
                <MagnifyingGlassIcon />
            </Button>
        </DialogTrigger>
        <DialogContent class="w-[60rem] h-[40rem] max-w-[60rem] px-8">
            <DialogHeader>
                <DialogTitle class="text-center">{{ title }}</DialogTitle>
            </DialogHeader>
            <Separator class="my-2" />
            <div class="flex flex-row justify-between px-4 h-2 mb-4">
                <Input type="text" v-model="searchClientesTxt" class="mr-4" @keyup.enter="searchClientes()" />
                <Button variant="default" size="icon" class="w-12 h-9" @click="searchClientes()">
                    <MagnifyingGlassIcon />
                </Button>
            </div>
            <ScrollArea class="h-[30rem] w-[51rem] pl-4 mt-4">
                <div v-for="cliente in foundClientes" 
                    :key="cliente.id" 
                    @click="selectCliente(cliente)"
                    class="cursor-pointer search-area-item hover:bg-secondary px-4 py-2 w-[49rem] flex flex-row justify-start items-center"
                >
                    <User :size="35" class="border-secondary rounded-full bg-secondary p-2" />
                    <span class="ml-4 text-sm">
                        {{ cliente.apellido }}, {{ cliente.nombre }}
                    </span>
                </div>
            </ScrollArea>
        </DialogContent>
    </Dialog>
</template>