<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
    CircleXIcon,
    PlusIcon,
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
import CreateClienteForm from './CreateCliente.Form.vue';


const searchClientesTxt = ref <string>('');
const foundClientes = ref<Cliente[]>([]);
const showCreateForm = ref<boolean>(false);

defineProps<{
  modelValue: boolean;
  title: string;
}>();

const emit = defineEmits(['update:modelValue', 'selectCliente']);

const selectCliente = (cliente: Cliente) => {
  emit('selectCliente', cliente);
};

const searchClientes = async()=>{
    const res = await clientesApi.getAll({filtro: searchClientesTxt.value});
    foundClientes.value = res.items;
    showCreateForm.value=false;
}

const handleCreateCliente = (cliente: Cliente)=>{
    selectCliente(cliente)
}


</script>


<template>
    <Dialog :open="modelValue"  @update:open="emit('update:modelValue', $event)" >
        <DialogTrigger as-child>
            <Button variant="default" size="icon" class="w-9 h-9 ml-4">
                <MagnifyingGlassIcon />
            </Button>
        </DialogTrigger>
        <DialogContent class="w-[85rem] h-[45rem] max-w-[85rem] px-8">
            <DialogHeader>
                <DialogTitle class="text-center">{{ title }}</DialogTitle>
            </DialogHeader>
            <Separator class="my-2" />
            <div class="flex flex-row justify-end w-full px-4 h-2 mb-4 ">
                <div class="flex justify-center w-[60rem]">
                    <Input type="text" v-model="searchClientesTxt" class="w-[30rem] ml-[6rem]" @keyup.enter="searchClientes()" />
                    <Button variant="default" size="icon" class="w-12 h-9 mx-4" @click="searchClientes()">
                        <MagnifyingGlassIcon />
                    </Button>
                </div>
                <Button variant="default" size="icon" class="w-[10rem] h-9" @click="showCreateForm=true">
                    Nuevo Cliente <PlusIcon />
                </Button>
            </div>
            <div v-if="!showCreateForm" class="flex justify-center">
                <ScrollArea class="h-[30rem] w-[30rem] mt-4">
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
            </div>
            <div v-if="showCreateForm">
                <div class="flex flex-row w-full justify-end pr-4">
                    <Button @click="showCreateForm=false"  variant="ghost" > <CircleXIcon /> </Button>
                </div>
                <ScrollArea class="h-[30rem] w-[80rem] pl-4 rounded-lg">
                    <CreateClienteForm
                        @handle-create-cliente="handleCreateCliente"
                        @handle-cancel="showCreateForm=false"
                    />
                </ScrollArea>
            </div>
        </DialogContent>
    </Dialog>
</template>