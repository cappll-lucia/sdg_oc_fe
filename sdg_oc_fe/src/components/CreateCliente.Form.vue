<script lang="ts" setup>
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Label from '@/components/ui/label/Label.vue';
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input'
import { createClienteCustomValidator, createClienteObraSocialCustomValidator, TipoDocumento } from '@/api/entities/clientes';
import AlertError from '@/components/AlertError.vue';
import { computed, onMounted, ref } from 'vue'
import { Localidad } from '@/api/entities/localidad';
import { localidadesApi } from '@/api/libs/localidades';
import { ObraSocial } from '@/api/entities/obraSocial';
import { obrasSocialesApi } from '@/api/libs/obrasSociales';
import {Cross2Icon} from '@radix-icons/vue';
import { CondicionIva } from '@/api/entities/venta';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { AsteriskIcon } from 'lucide-vue-next';
import { condicionIvaDisplay } from '@/lib/utils';
import { clientesApi } from '@/api/libs/clientes';
import { useLoaderStore } from '@/stores/LoaderStore';

const tipoDocumentoOptions = [
  { value: TipoDocumento.CUIT, label: "CUIT" },
  { value: TipoDocumento.DNI, label: "DNI" }
];

const emit = defineEmits(['handleCreateCliente']);

const loader = useLoaderStore();

const showError = ref<boolean>(false);
const errorMessage =ref<string>('');

const localidades = ref<Localidad[]>([]);
const obrasSociales = ref<ObraSocial[]>([]);

const fechaNac = ref({
  day: '',
  month: '',
  year: ''
})

const newCliente = ref<{
    nroDocumento: number| undefined,
    tipoDocumento: TipoDocumento| undefined,
    categoriaFiscal: CondicionIva| undefined,
    nombre: string | undefined, 
    apellido: string | undefined, 
    email: string | undefined, 
    sexo:  string| undefined, 
    telefono: string | undefined, 
    domicilio: string | undefined, 
    fechaNac: Date | undefined, 
    observaciones: string | undefined, 
    localidad: { id: number| undefined}
}>({
    nroDocumento: undefined,
    tipoDocumento: undefined,
    categoriaFiscal: undefined,
    nombre: undefined, 
    apellido: undefined, 
    email: undefined, 
    sexo:  undefined, 
    telefono: undefined, 
    domicilio: undefined, 
    fechaNac: undefined, 
    observaciones: undefined, 
    localidad: { id: undefined}
})

const clienteObrasSociales = ref<{
    obraSocial: {id: number| undefined},
    numeroSocio: string,
}[]>([])

const isValidCliente = ref<{
    nroDocumento:boolean,
    tipoDocumento:boolean,
    categoriaFiscal:boolean,
    nombre:boolean,
    apellido:boolean,
    email:boolean,
    sexo:boolean,
    telefono:boolean,
    domicilio:boolean,
    fechaNac:boolean,
    localidad:boolean,
}>({
    nroDocumento: true,
    tipoDocumento: true,
    categoriaFiscal: true,
    nombre: true,
    apellido: true,
    email: true,
    sexo: true,
    telefono: true,
    domicilio: true,
    fechaNac: true,
    localidad: true,
})

const isValidClienteObraSocial = ref<{obraSocial: boolean, numeroSocio: boolean}[]>([]);

onMounted(async ()=>{
    localidades.value = await localidadesApi.getAll();
    obrasSociales.value = await obrasSocialesApi.getAll();
})

const addObraSocial = ()=>{
    clienteObrasSociales.value.push({obraSocial:{id: undefined }, numeroSocio: ''});
    isValidClienteObraSocial.value.push({obraSocial: true, numeroSocio:true});
}

const removeObraSocial = (index: number) => {
  clienteObrasSociales.value.splice(index, 1);
  isValidClienteObraSocial.value.splice(index, 1);
};

const condicionIvaOptions = Object.values(CondicionIva)
  .filter(value => typeof value === 'number')
  .map(value => value);

const validateAndSubmit = async()=>{
    const validCliente = createClienteCustomValidator (newCliente.value, fechaNac.value);
    isValidCliente.value = validCliente.isValid;
    const validOS = createClienteObraSocialCustomValidator(clienteObrasSociales.value)
    isValidClienteObraSocial.value =validOS.isValid;
    console.log(validCliente)
    console.log(validOS)
    if(validCliente.success && validOS.success){
        await onSubmit()
    }else{
        console.log('no')
    }
}


const onSubmit = async()=>{
    loader.show();
    try{
        newCliente.value.fechaNac = new Date(parseInt(fechaNac.value.year), parseInt(fechaNac.value.month)-1, parseInt(fechaNac.value.day))
        const createdCliente = await clientesApi.create(newCliente.value, clienteObrasSociales.value)
        emit('handleCreateCliente', createdCliente);
        loader.hide();
    }catch (err: any) {
        errorMessage.value = err.message as string;
        loader.hide();
        showError.value = true;
    }
    
}



const availableObrasSociales = computed(() => {
  const assignedIds = new Set(
    clienteObrasSociales.value
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


</script>

<template>
    <form @submit.prevent="validateAndSubmit" class="forms-wide w-full flex flex-col justify-between items-start p2-[5rem] ">
                <div class="w-full ">
                    <h3 class="page-subtitle text-center" >Registrar Nuevo Cliente</h3>
                    <Separator class="my-6 w-full" />
                </div>
                <div class="flex flex-col w-full  justify-evenly items-start">

                    <div class="flex flex-row w-full  justify-evenly items-start">
                    <div class="flex flex-col w-[45%] mt-4 items-center mr-4">
                        <div class="h-[5rem] w-[33rem] mt-2 flex flex-row justify-start items-center">
                                <Label  class="w-[7rem]  pr-[2rem] text-right ">Tipo Documento</Label>
                                <div class="flex flex-row justify-start items-center w-[25rem]">
                                    <Select :v-model="newCliente.tipoDocumento " @update:model-value="(value) => newCliente.tipoDocumento= Number(value) as TipoDocumento"  >
                                        <SelectTrigger class="w-[22rem]">
                                            <SelectValue class="text-black"  />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectItem 
                                                v-for="tipo in tipoDocumentoOptions " 
                                                :key="tipo.value" 
                                                :value="tipo.value.toString()"
                                                >
                                                {{ tipo.label }}
                                                </SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    <TooltipProvider  v-if="!isValidCliente.tipoDocumento" >
                                        <Tooltip>
                                            <TooltipTrigger class="bg-transparent text-xs text-destructive ml-4 "> <AsteriskIcon :size="14" /> </TooltipTrigger>
                                            <TooltipContent class="text-destructive border-destructive font-thin text-xs">
                                                <p>Seleccionar tipo documento</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                            </div>

                            <div class="h-[5rem] w-[33rem] mt-2 flex flex-row justify-start items-center">
                                <Label  class="w-[7rem]  pr-[2rem] text-right ">Número Documento</Label>
                                <div class="flex flex-row justify-start items-center w-[25rem]">
                                    <Input type="number" class="w-[22rem]" v-model="newCliente.nroDocumento" />
                                    <TooltipProvider  v-if="!isValidCliente.nroDocumento" >
                                        <Tooltip>
                                            <TooltipTrigger class="bg-transparent text-xs text-destructive ml-4 "> <AsteriskIcon :size="14" /> </TooltipTrigger>
                                            <TooltipContent class="text-destructive border-destructive font-thin text-xs">
                                                <p>Ingresar número documento</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                            </div>
                        
                            <div class="h-[5rem] w-[33rem] mt-2 flex flex-row justify-start items-center">
                                <Label  class="w-[7rem]  pr-[2rem] text-right ">Categoría Fiscal</Label>
                                <div class="flex flex-row justify-start items-center w-[25rem]">
                                    <Select
                                        :v-model="newCliente.categoriaFiscal"
                                        @update:model-value="(value) => newCliente.categoriaFiscal = Number(value)"
                                    >
                                            <SelectTrigger class="text-black w-[22rem] ">
                                                <SelectValue   />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectItem 
                                                        v-for="condicion in condicionIvaOptions" 
                                                        :key="condicion" 
                                                        :value="condicion.toString()"
                                                    >
                                                        {{ condicionIvaDisplay(Number(condicion)) }}
                                                    </SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    <TooltipProvider  v-if="!isValidCliente.categoriaFiscal" >
                                        <Tooltip>
                                            <TooltipTrigger class="bg-transparent text-xs text-destructive ml-4 "> <AsteriskIcon :size="14" /> </TooltipTrigger>
                                            <TooltipContent class="text-destructive border-destructive font-thin text-xs">
                                                <p>Seleccionar tipo documento</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                            </div>
                            
                            
                         <div class="h-[5rem] w-[33rem] mt-2 flex flex-row justify-start items-center">
                                <Label  class="w-[7rem]  pr-[2rem] text-right ">Nombre</Label>
                                <div class="flex flex-row justify-start items-center w-[25rem]">
                                    <Input type="text" class="w-[22rem]" v-model="newCliente.nombre" />
                                    <TooltipProvider  v-if="!isValidCliente.nombre" >
                                        <Tooltip>
                                            <TooltipTrigger class="bg-transparent text-xs text-destructive ml-4 "> <AsteriskIcon :size="14" /> </TooltipTrigger>
                                            <TooltipContent class="text-destructive border-destructive font-thin text-xs">
                                                <p>Ingresar nombre</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                            </div>

                        <div class="h-[5rem] w-[33rem] mt-2 flex flex-row justify-start items-center">
                                <Label  class="w-[7rem]  pr-[2rem] text-right ">Apellido</Label>
                                <div class="flex flex-row justify-start items-center w-[25rem]">
                                    <Input type="text" class="w-[22rem]" v-model="newCliente.apellido" />
                                    <TooltipProvider  v-if="!isValidCliente.apellido" >
                                        <Tooltip>
                                            <TooltipTrigger class="bg-transparent text-xs text-destructive ml-4 "> <AsteriskIcon :size="14" /> </TooltipTrigger>
                                            <TooltipContent class="text-destructive border-destructive font-thin text-xs">
                                                <p>Ingresar apellido</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                            </div>

                        <div class="h-[5rem] w-[33rem] mt-2 flex flex-row justify-start items-center">
                                <Label  class="w-[7rem]  pr-[2rem] text-right ">Email</Label>
                                <div class="flex flex-row justify-start items-center w-[25rem]">
                                    <Input type="text" class="w-[22rem]" v-model="newCliente.email" />
                                    <TooltipProvider  v-if="!isValidCliente.email" >
                                        <Tooltip>
                                            <TooltipTrigger class="bg-transparent text-xs text-destructive ml-4 "> <AsteriskIcon :size="14" /> </TooltipTrigger>
                                            <TooltipContent class="text-destructive border-destructive font-thin text-xs">
                                                <p>Ingresar email válido</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                            </div>

                            <div class="h-[5rem] w-[33rem] mt-2 flex flex-row justify-start items-center">
                                <Label  class="w-[7rem]  pr-[2rem] text-right ">Sexo</Label>
                                <div class="flex flex-row justify-start items-center w-[25rem]">
                                    <Select :v-model="newCliente.sexo " @update:model-value="(value) => newCliente.sexo= value"  >
                                        <SelectTrigger class="w-[22rem]">
                                            <SelectValue class="text-black"  />
                                        </SelectTrigger>
                                        <SelectContent>
                                                <SelectGroup>
                                                    <SelectItem value="Masculino">
                                                        Masculino
                                                    </SelectItem>
                                                    <SelectItem value="Femenino">
                                                        Femenino
                                                    </SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                    </Select>
                                    <TooltipProvider  v-if="!isValidCliente.sexo" >
                                        <Tooltip>
                                            <TooltipTrigger class="bg-transparent text-xs text-destructive ml-4 "> <AsteriskIcon :size="14" /> </TooltipTrigger>
                                            <TooltipContent class="text-destructive border-destructive font-thin text-xs">
                                                <p>Seleccionar sexo</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                            </div>                        
                    </div>
                    
                    <div class="flex flex-col w-[45%] mt-4 items-center ml-4">
                        <div class="h-[5rem] w-[33rem] mt-2 flex flex-row justify-start items-center">
                                <Label  class="w-[7rem]  pr-[2rem] text-right ">Fecha Nacimiento</Label>
                                <div class="flex flex-row justify-start items-center w-[25rem]">
                                    <div class="flex gap-2 w-[60%]">
                                        <Input type="text" v-model="fechaNac.day" placeholder="DD" class="w-16 text-center" maxlength="2" />
                                        <Input type="text" v-model="fechaNac.month" placeholder="MM" class="w-16 text-center" maxlength="2" />
                                        <Input type="text" v-model="fechaNac.year" placeholder="AAAA" class="w-20 text-center" maxlength="4" />
                                    </div>
                                    <TooltipProvider  v-if="!isValidCliente.fechaNac" >
                                        <Tooltip>
                                            <TooltipTrigger class="bg-transparent text-xs text-destructive ml-4 "> <AsteriskIcon :size="14" /> </TooltipTrigger>
                                            <TooltipContent class="text-destructive border-destructive font-thin text-xs">
                                                <p>Ingresar fecha nacimeinto válida</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                            </div>

                            <div class="h-[5rem] w-[33rem] mt-2 flex flex-row justify-start items-center">
                                <Label  class="w-[7rem]  pr-[2rem] text-right ">Localidad</Label>
                                <div class="flex flex-row justify-start items-center w-[25rem]">
                                    <Select :v-model="newCliente.localidad.id " @update:model-value="(value) => newCliente.localidad.id =  Number(value)"  >
                                        <SelectTrigger class="w-[22rem]">
                                            <SelectValue class="text-black"  />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectItem 
                                                v-for="loc in localidades " 
                                                :key="loc.id" 
                                                :value="loc.id.toString()"
                                                >
                                                {{ loc.localidad }}, {{ loc.provincia.provincia }}
                                                </SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    <TooltipProvider  v-if="!isValidCliente.localidad" >
                                        <Tooltip>
                                            <TooltipTrigger class="bg-transparent text-xs text-destructive ml-4 "> <AsteriskIcon :size="14" /> </TooltipTrigger>
                                            <TooltipContent class="text-destructive border-destructive font-thin text-xs">
                                                <p>Seleccionar tipo documento</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                            </div>



                        <div class="h-[5rem] w-[33rem] mt-2 flex flex-row justify-start items-center">
                            <Label  class="w-[7rem]  pr-[2rem] text-right ">Domicilio</Label>
                            <div class="flex flex-row justify-start items-center w-[25rem]">
                                <Input type="text" class="w-[22rem]" v-model="newCliente.domicilio" />
                                <TooltipProvider  v-if="!isValidCliente.domicilio" >
                                    <Tooltip>
                                        <TooltipTrigger class="bg-transparent text-xs text-destructive ml-4 "> <AsteriskIcon :size="14" /> </TooltipTrigger>
                                        <TooltipContent class="text-destructive border-destructive font-thin text-xs">
                                            <p>Ingresar domicilio</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                        </div>

                        <div class="h-[5rem] w-[33rem] mt-2 flex flex-row justify-start items-center">
                            <Label  class="w-[7rem]  pr-[2rem] text-right ">Teléfono</Label>
                            <div class="flex flex-row justify-start items-center w-[25rem]">
                                <Input type="number" class="w-[22rem]" v-model="newCliente.telefono" />
                                <TooltipProvider  v-if="!isValidCliente.telefono" >
                                    <Tooltip>
                                        <TooltipTrigger class="bg-transparent text-xs text-destructive ml-4 "> <AsteriskIcon :size="14" /> </TooltipTrigger>
                                        <TooltipContent class="text-destructive border-destructive font-thin text-xs">
                                            <p>Ingresar teléfono</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                        </div>

                        <div class="h-[5rem] w-[33rem] mt-7 flex flex-row justify-start items-start">
                            <Label  class="w-[7rem]  pr-[2rem] pt-3 text-right ">Observaciones</Label>
                            <div class="flex flex-row justify-start items-center w-[25rem]">
                                <Textarea class="w-[22rem] h-[8rem] resize-none" v-model="newCliente.observaciones" />
                            </div>
                        </div>

                    

                    </div>

                    </div>
                    <Separator class="my-10 w-full" />
                    <div class="flex flex-col justify-start items-start ml-[6rem]  ">
                        <h3 class="font-bold mb-4">Obras Sociales</h3>
                        <div v-for="(_, index) in clienteObrasSociales" class="w-full flex flex-row justify-start items-center mb-6">
                            <div v-if="clienteObrasSociales[index]" class="flex flex-row justify-start items-center w-[28rem]">

                                <Label  class="w-[7rem]  pr-[2rem] text-right ">Obra Social</Label>
                                <Select 
                                :v-model="clienteObrasSociales[index].obraSocial.id " 
                                @update:model-value="(value)=>{
                                    if (!clienteObrasSociales[index]) {
                                        clienteObrasSociales[index] = { obraSocial: { id: undefined }, numeroSocio: '' };
                                    }
                                    clienteObrasSociales[index].obraSocial.id = Number(value);
                                }"
                                     >
                                     <SelectTrigger class="w-[15rem] mr-4">
                                         <SelectValue class="text-black"  >
                                            {{
                                                obrasSociales.find(
                                                os => os.id === clienteObrasSociales[index]?.obraSocial?.id
                                                )?.nombre || 'Seleccione obra social'
                                            }}
                                         </SelectValue>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectItem 
                                                v-for="os in availableObrasSociales " 
                                                :key="os.id" 
                                                :value="os.id.toString()"
                                                >
                                                {{ os.nombre}}
                                            </SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                <TooltipProvider  v-if="!isValidClienteObraSocial[index]?.obraSocial" >
                                    <Tooltip>
                                        <TooltipTrigger class="bg-transparent text-xs text-destructive"> <AsteriskIcon :size="14" /> </TooltipTrigger>
                                        <TooltipContent class="text-destructive border-destructive font-thin text-xs">
                                            <p>Seleccionar obra social</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                            <div v-if="clienteObrasSociales[index]" class="flex flex-row justify-start items-center w-[22rem]">
                                <Label class="w-[8rem] pr-[2rem]  text-right">Número socio</Label>
                                <Input type="text" class="w-[10rem]" v-model="clienteObrasSociales[index].numeroSocio" />
                                <TooltipProvider  v-if="!isValidClienteObraSocial[index]?.numeroSocio" >
                                    <Tooltip>
                                        <TooltipTrigger class="bg-transparent text-xs text-destructive ml-4 "> <AsteriskIcon :size="14" /> </TooltipTrigger>
                                        <TooltipContent class="text-destructive border-destructive font-thin text-xs">
                                            <p>Seleccionar obra social</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                            <Button variant="ghost" @click="removeObraSocial(index)">
                                <Cross2Icon />
                            </Button>
                        </div>
                        <Button type="button" variant="link" size="lg" class="mt-1 p-0" id="add-os" @click="addObraSocial">
                            + Agregar Obra Social
                        </Button>
                    </div>
                </div>
                <div class="form-footer w-full flex flex-row justify-end mt-8 mb-6 pr-[6rem]">
                    <Button variant="outline" class="w-[15%] mr-5">Cancelar</Button>
                    <Button type="submit" class="w-[15%]">Guardar</Button>
                </div>
            </form>
        <AlertError 
            v-model="showError"
            title="Error"
            :message="errorMessage"
            button="Aceptar"
            :action="()=>{showError=false}"
        />
</template>


<style>
#add-os{
    color: gray;
}
</style>