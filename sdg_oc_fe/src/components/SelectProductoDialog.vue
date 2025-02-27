<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {ScrollArea} from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input'
import { MagnifyingGlassIcon } from '@radix-icons/vue';
import { onMounted, ref } from 'vue';
import { productosApi } from '@/api/libs/productos';
import { Button } from '@/components/ui/button';
import { Producto } from '@/api/entities/producto';
import Label from './ui/label/Label.vue';


const searchProdDscTxt = ref <string>('');
const searchProdIdTxt = ref <string>('');
const foundProductos = ref<Producto[]>([]);


defineProps<{
  modelValue: boolean;
  title: string;
}>();

const emit = defineEmits(['update:modelValue', 'selectProducto']);

const selectProducto = (producto: Producto) => {
    emit('selectProducto', producto);
    searchProdDscTxt.value='';
    searchProdIdTxt.value='';
};

const searchProducto = async()=>{
    foundProductos.value = await productosApi.getAll({
        id: searchProdIdTxt.value,
        descripcion: searchProdDscTxt.value
    })
}

onMounted(async ()=>{
    foundProductos.value = await productosApi.getAll({})
})

</script>


<template>
    <Dialog :open="modelValue"  @update:open="emit('update:modelValue', $event)" >
        <DialogContent class="w-[60rem] h-[40rem] max-w-[60rem] px-8">
            <DialogHeader>
                <DialogTitle class="text-center">{{ title }}</DialogTitle>
            </DialogHeader>
            <Separator class="my-2" />
            <div class="flex flex-row justify-between px-6 h-2 mb-4">
                <Input type="text" v-model="searchProdIdTxt" class=" w-[12%] mr-4 text-center" placeholder="ID" @keyup.enter="searchProducto()" />
                <Input type="text" v-model="searchProdDscTxt" class="mr-4" placeholder="Descripción" @keyup.enter="searchProducto()" />
                <Button variant="default" size="icon" class="w-12 h-9" @click="searchProducto()">
                    <MagnifyingGlassIcon />
                </Button>
            </div>
            <ScrollArea class="h-[30rem] w-[51rem] pl-4 mt-4">
                <div v-for="prod in foundProductos" 
                    :key="prod.id" 
                    @click="selectProducto(prod)"
                    class="cursor-pointer search-area-item rounded-sm hover:bg-secondary px-4 py-2 w-[49rem] h-12 flex flex-row justify-between items-center"
                >
                    <div class="w-[85%] flex flex-row justify-start items-center">
                        <Label class=" w-[10%] text-sm text-center">{{ prod.id }}</Label>
                        <Label class="text-sm text-center">-</Label>
                        <Label class="ml-6 text-sm font-bold">{{ prod.descripcion }}</Label>
                    </div>
                    <Label class="ml-6 text-sm "> $ {{ prod.precio.toFixed(2) }}</Label>
                </div>
            </ScrollArea>
        </DialogContent>
    </Dialog>
</template>