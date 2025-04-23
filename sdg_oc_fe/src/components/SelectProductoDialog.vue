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
import LoaderForm from './LoaderForm.vue';
import { ChevronLeft, ChevronRight } from 'lucide-vue-next';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const searchProdDscTxt = ref <string>('');
const searchProdCodTxt = ref <string>('');
const foundProductos = ref<Producto[]>([]);
const loadingForm = ref<boolean>(false);

const currentLimit = ref<string>('10');
const currentOffset = ref<number>(0);

const nextPage=ref<number | null>(null);
const previousPage=ref<number | null>(null);

const showError = ref<boolean>(false);
const errorMessage =ref<string>('');

defineProps<{
  modelValue: boolean;
  title: string;
}>();

const emit = defineEmits(['update:modelValue', 'selectProducto']);

const selectProducto = (producto: Producto) => {
    emit('selectProducto', producto);
    searchProdDscTxt.value='';
    searchProdCodTxt.value='';
};

onMounted(async ()=>{
    loadingForm.value=true;
    await handleFilterProducts();
    loadingForm.value=false;
})

const handleFilterProducts = async () => {
    try{
        const resp = await productosApi.getAll({
            codigo: searchProdCodTxt.value,
            descripcion: searchProdDscTxt.value,
            offset: currentOffset.value,
            limit: currentLimit.value
        });
        foundProductos.value = resp.items;
        nextPage.value = resp.nextPage;
        previousPage.value =resp.previousPage;
    }catch(err: any){
        errorMessage.value=err.message as string
        showError.value = true;
        loadingForm.value=false;
    }
};

const handlePageChange = async(targetOffset: number | null) => {
    if (targetOffset == null) return;
    currentOffset.value = targetOffset;
    await handleFilterProducts();
};

const handleLimitChange = async (newLimit: string) => {
    currentLimit.value = newLimit;
    currentOffset.value = 0;
    await handleFilterProducts();
};


</script>


<template>
    <Dialog :open="modelValue"  @update:open="emit('update:modelValue', $event)" >
        <DialogContent class="w-[60rem] h-[45rem] max-w-[60rem] px-8">
            <DialogHeader>
                <DialogTitle class="text-center">{{ title }}</DialogTitle>
            </DialogHeader>
            <Separator class="my-2" />
            <div class="flex flex-row justify-between px-6 h-2 mb-4">
                <Input type="text" v-model="searchProdCodTxt" class=" w-[23%] mr-4 text-center" placeholder="Código" @keyup.enter="handleFilterProducts()"  @input="(e: any) => e.target.value.length >= 0 && handleFilterProducts()" />
                <Input type="text" v-model="searchProdDscTxt" class="mr-4" placeholder="Descripción" @keyup.enter="handleFilterProducts()"  @input="(e: any) => e.target.value.length >= 0 && handleFilterProducts()" />
                <Button variant="default" size="icon" class="w-12 h-9" @click="handleFilterProducts()">
                    <MagnifyingGlassIcon />
                </Button>
            </div>
            <ScrollArea v-if="!loadingForm" class="h-[30rem] w-[51rem] pl-4 mt-4">
                <div v-for="prod in foundProductos" 
                    :key="prod.id" 
                    @click="selectProducto(prod)"
                    class="cursor-pointer search-area-item rounded-sm hover:bg-secondary px-4 py-2 w-[49rem] h-12 flex flex-row justify-between items-center"
                    >
                    <div class="w-[85%] flex flex-row justify-start items-center">
                        <Label class=" w-[23%] text-sm text-center">{{ prod.codProv }}</Label>
                        <Label class="text-sm text-center">-</Label>
                        <Label class="ml-6 text-sm font-bold">{{ prod.descripcion }}</Label>
                    </div>
                    <Label class="ml-6 text-sm "> $ {{ prod.precio.toFixed(2) }}</Label>
                </div>
            </ScrollArea>
            <div v-else class="h-[30rem] w-full">
                <LoaderForm  class="mt-20 " />
            </div>
             <div class="mt-4 flex w-full justify-center">
                <div class="flex items-center gap-1 text-gray-500 ">
                    <Button variant="outline"  class="h-8" :disabled="previousPage === null" @click="handlePageChange(previousPage)" >
                        <ChevronLeft />
                    </Button>
                    <Select v-model="currentLimit" @update:model-value="handleLimitChange">
                        <SelectTrigger class="w-[80px] h-8">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="10">10</SelectItem>
                                <SelectItem value="20">20</SelectItem>
                                <SelectItem value="30">30</SelectItem>
                                <SelectItem value="40">40</SelectItem>
                                <SelectItem value="50">50</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <Button variant="outline" class="h-8" :disabled="nextPage === null" @click="handlePageChange(nextPage)" >
                        <ChevronRight />
                    </Button>
                </div>
            </div>
        </DialogContent>
    </Dialog>
</template>