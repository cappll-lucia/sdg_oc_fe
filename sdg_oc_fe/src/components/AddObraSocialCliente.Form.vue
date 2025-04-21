<script lang="ts" setup>
import { Cliente, createClienteObraSocialCustomValidator } from '@/api/entities/clientes';
import Label from './ui/label/Label.vue';
import Separator from './ui/separator/Separator.vue';
import { ObraSocial } from '@/api/entities/obraSocial';
import { computed, onMounted, ref } from 'vue';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent
} from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { AsteriskIcon, PlusCircleIcon } from 'lucide-vue-next';
import Button from './ui/button/Button.vue';
import CreateObrasSocialForm from './CreateObrasSocial.Form.vue';
import Input from './ui/input/Input.vue';
import { clientesApi } from '@/api/libs/clientes';
import LoaderForm from './LoaderForm.vue';
import AlertError from './AlertError.vue';
import { obrasSocialesApi } from '@/api/libs/obrasSociales';

const props = defineProps<{
    cliente: Cliente;
}>();
const emit = defineEmits(['handleAddObraSocialCliente']);

const newClienteObraSocial = ref<{ obraSocial: { id: number|undefined }, numeroSocio: string } >({
    obraSocial: {id: undefined},
    numeroSocio: ''
})
const isValidNewClienteOS = ref<{ obraSocial: boolean, numeroSocio: boolean}>({
    obraSocial: true,
    numeroSocio: true
})

const obrasSociales = ref<ObraSocial[]>([]);
onMounted(async()=>{
    obrasSociales.value = await obrasSocialesApi.getAll();
})

const openSelectOS = ref<boolean>(false);
const openNewOS = ref<boolean>(false);


const loadingForm = ref<boolean>(false);
const showError = ref<boolean>(false);
const errorMessage =ref<string>('');

const availableObrasSociales = computed(() => {
  const assignedIds = new Set(
    props.cliente.clienteObrasSociales
      .map(item => item.obraSocial?.id)
      .filter(id => id !== undefined)
  );
  
  return obrasSociales.value
    .filter(os => !assignedIds.has(os.id))
    .map(os => ({
      id: os.id,
      nombre: os.nombre,
    }));
});

const handleCreateObraSocial = async(newObraSocial: ObraSocial)=>{
    newClienteObraSocial.value.obraSocial.id=newObraSocial.id;
    obrasSociales.value.push(newObraSocial);
    openNewOS.value = false;

}

const submitNewObraSocial = async()=>{
    const validOs = createClienteObraSocialCustomValidator([newClienteObraSocial.value]);
    if(!validOs.success){
        isValidNewClienteOS.value = validOs.isValid[0] ?? {obraSocial: false, numeroSocio: false}
        return;
    }
    try{
        loadingForm.value=true;
        const obrasSociales = [...props.cliente.clienteObrasSociales, newClienteObraSocial.value]
        console.log("--", obrasSociales)
        await clientesApi.addObraSocial(props.cliente.id, obrasSociales);
        emit('handleAddObraSocialCliente', newClienteObraSocial.value.obraSocial.id );
        loadingForm.value=false;
    }catch(err: any) {
        errorMessage.value = err.message as string;
        loadingForm.value=false;
        showError.value = true;
    }
}


</script>

<template>
    <form @submit.prevent="submitNewObraSocial" class="w-[30rem] flex flex-col justify-start items-start " v-if="!loadingForm">
        <div class="px-4">
            <h3 class=" font-bold text-lg text-center">Asociar nueva obra social al cliente</h3>
            <Label>Cliente: {{ cliente.apellido }}, {{ cliente.nombre }} </Label>
        </div>    
        <Separator class="my-6" />
        <div class="flex flex-row justify-start items-center w-[28rem] mb-4">
                <Label  class="w-[10rem]  pr-[2rem] text-right ">Obra Social</Label>
                <Select
                    :model-value="newClienteObraSocial.obraSocial.id?.toString()"
                    v-model:open="openSelectOS"
                    @update:model-value="(value: string) => {
                        const id = parseInt(value, 10);
                        newClienteObraSocial.obraSocial.id = isNaN(id) ? undefined : id;
                    }"
                    >
                     <SelectTrigger class="w-[15rem] mr-4">
                         <SelectValue class="text-black"  >
                            {{
                                obrasSociales.find(
                                os => os.id === newClienteObraSocial.obraSocial?.id
                                )?.nombre || 'Seleccione obra social'
                            }}
                         </SelectValue>
                        </SelectTrigger>
                        <SelectContent class="max-h-[20rem] w-[15rem] pr-1">
                            <SelectGroup class="max-h-[20rem] w-[16rem] m-0 p-0 overflow-scroll">
                                <SelectItem class="w-[14rem]" 
                                v-for="os in availableObrasSociales " 
                                :key="os.id" 
                                :value="os.id.toString()"
                                >
                                {{ os.nombre}}
                            </SelectItem>
                            <Button @click="()=>{openSelectOS=false; openNewOS=true}" variant="ghost" class="w-full px-8 mb-2 pb-2 bg-secondary rounded-none items-start justify-start"><PlusCircleIcon/> Nueva obra social</Button>
                        </SelectGroup>
                    </SelectContent>
                </Select>

                <Dialog  v-model:open="openNewOS" >
                    <DialogContent class="max-w-[45rem]">
                        <CreateObrasSocialForm 
                            @handle-create-obra-social="handleCreateObraSocial"
                            @handle-cancel="openNewOS=false"
                        />
                    </DialogContent>
                </Dialog>
                <TooltipProvider  v-if="!isValidNewClienteOS.obraSocial" >
                    <Tooltip>
                        <TooltipTrigger class="bg-transparent text-xs text-destructive"> <AsteriskIcon :size="14" /> </TooltipTrigger>
                        <TooltipContent class="text-destructive border-destructive font-thin text-xs">
                            <p>Seleccionar obra social</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
        </div>
        <div class="flex flex-row justify-start items-center">
            <Label class="w-[10rem] pr-[2rem]  text-right">Número socio</Label>
            <Input type="text" class="w-[15rem]" v-model="newClienteObraSocial.numeroSocio" />
            <TooltipProvider  v-if="!isValidNewClienteOS.numeroSocio" >
                <Tooltip>
                    <TooltipTrigger class="bg-transparent text-xs text-destructive ml-4 "> <AsteriskIcon :size="14" /> </TooltipTrigger>
                    <TooltipContent class="text-destructive border-destructive font-thin text-xs">
                        <p>Ingresar número de socio</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
         <div class="w-full flex flex-row justify-end mt-8 mb-6 ">
            <Button type="submit" class="w-[25%] mr-20">Guardar</Button>
        </div>
    </form>
    <div v-else  class="flex w-full justify-center items-center h-[10rem]">
        <LoaderForm />
    </div>
     <AlertError v-model="showError" title="Error" :message="errorMessage" button="Aceptar"
            :action="()=>{showError=false}" />
</template>