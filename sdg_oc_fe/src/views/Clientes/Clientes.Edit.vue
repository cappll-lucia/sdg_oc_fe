<script lang="ts" setup>
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button'
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormLabel
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/components/ui/toast'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input'
import { SlashIcon } from '@radix-icons/vue';
import { Cliente, editClienteValidator } from '@/api/entities/clientes';
import AlertError from '@/components/AlertError.vue';
import router from '@/router/index';
import { clientesApi } from '@/api/libs/clientes';
import { onMounted, ref } from 'vue'
import { Localidad } from '@/api/entities/localidad';
import { localidadesApi } from '@/api/libs/localidades';
import { ObraSocial } from '@/api/entities/obraSocial';
import { obrasSocialesApi } from '@/api/libs/obrasSociales';
import {Cross2Icon} from '@radix-icons/vue';
import { useRoute } from 'vue-router';



const currentCliente = ref<Cliente>();
const route = useRoute();


const showSuccess = ref<boolean>(false);
const showError = ref<boolean>(false);
const errorMessage =ref<string>('');
const loading = ref<boolean>(false);
const submitted = ref<boolean>(false);

const localidades = ref<Localidad[]>([]);
const obrasSociales = ref<ObraSocial[]>([]);
const selectedObrasSociales = ref<{ obraSocial: { id: number | null }, numeroSocio: string }[]>([]);

const fechaNac = ref({
  day: '',
  month: '',
  year: ''
})

const formSchema = toTypedSchema(editClienteValidator)
const {handleSubmit, setValues } = useForm({ 
   validationSchema: formSchema,
    initialValues: { }
})

onMounted(async()=>{
    currentCliente.value = await clientesApi.getOne(Number(route.params.id))
    localidades.value = await localidadesApi.getAll();
    obrasSociales.value = await obrasSocialesApi.getAll();
    if(currentCliente.value){
        const date = new Date(currentCliente.value.fechaNac);
        fechaNac.value.day = date.getUTCDate().toString();
        fechaNac.value.month = (date.getUTCMonth() +1 ).toString();
        fechaNac.value.year = date.getUTCFullYear().toString();
        setValues({
            dni: currentCliente.value.dni,
            nombre: currentCliente.value.nombre ,
            apellido: currentCliente.value.apellido ,
            email: currentCliente.value.email , 
            telefono:  currentCliente.value.telefono ,
            sexo: "Masculino"===currentCliente.value.sexo || "Femenino"===currentCliente.value.sexo ? currentCliente.value.sexo : undefined , 
            observaciones: currentCliente.value.observaciones || '' ,
            domicilio: currentCliente.value.domicilio , 
            localidad:{id: currentCliente.value.localidad.id},
            fechaNac: {  
                day: fechaNac.value.day,
                month: fechaNac.value.month,
                year: fechaNac.value.year
            },
        });
        currentCliente.value.fechaNac = new Date(currentCliente.value.fechaNac)
        currentCliente.value.clienteObrasSociales.forEach((cliOs)=>{
            selectedObrasSociales.value.push({obraSocial: {id: cliOs.obraSocial.id}, numeroSocio: cliOs.numeroSocio})
        })
    }
})

const addObraSocial = ()=>{
    selectedObrasSociales.value.push({obraSocial:{id: null }, numeroSocio: ''});
}

const removeObraSocial = (index: number) => {
  selectedObrasSociales.value.splice(index, 1);
};


const onSubmit = handleSubmit(async (values) => {
    submitted.value = true;
    loading.value = true;
    const osCliente = selectedObrasSociales.value.filter(os => os.obraSocial.id !== null) as {obraSocial: {id:number}, numeroSocio: string}[];
     if (osCliente.find(os=> os.numeroSocio=='') )return;
     loading.value = true;
  try {
    if(currentCliente.value){
        await clientesApi.edit(currentCliente.value?.id, values, osCliente);
        loading.value = false;
        showSuccess.value = true;
        router.push('/clientes');
        toast({ title: 'Cliente actualizado con éxito' });
    }
  } catch (err: any) {
    errorMessage.value = err.message as string;
    showError.value = true;
    loading.value = false;
  }
});

const validateAndSubmit = async()=>{
    submitted.value =true;
    await onSubmit()
}



const filteredObrasSociales = (index: number) => {
  const selectedIds = selectedObrasSociales.value
    .map((os, i) => (i !== index ? os.obraSocial.id : null))
    .filter(id => id);
  return obrasSociales.value.filter(os => {
    if (selectedObrasSociales.value[index]?.obraSocial.id === os.id) {
      return true;
    }
    return !selectedIds.includes(os.id);
  });
};

const getObraSocialName = (id:number)=> {
    return obrasSociales.value.find(os=> os.id ==id)?.nombre || 'Selec'
}



</script>

<template>
<div class="page">
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink href="/">
                        Inicio
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                    <SlashIcon />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                    <BreadcrumbLink href="/clientes">
                        Clientes
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                    <SlashIcon />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                    <BreadcrumbPage>Editar</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
        <div class="pt-2 mb-4 " >
            <form @submit.prevent="validateAndSubmit" class="forms-wide flex flex-col justify-between items-start bg-red-500 px-[5rem] ">
                <div class="w-full ">
                    <h3 class="page-subtitle text-center" >Actualizar Cliente</h3>
                    <Separator class="my-6 w-full" />
                </div>
                <div class="flex flex-col w-full  justify-evenly items-start">

                    <div class="flex flex-row w-full  justify-evenly items-start">
                        <div class="flex flex-col w-[40%]">
                        <FormField v-slot="{ componentField, errorMessage }" name="dni">
                        <FormItem class="h-[5rem] mt-8">
                            <div class="form-item-wide">
                                <FormLabel class="form-label">DNI</FormLabel>
                                <FormControl>
                                    <Input type="number" v-bind="componentField" />
                                </FormControl>
                            </div>
                            <FormMessage class="form-message-wide" v-if="submitted && errorMessage">{{ errorMessage }}</FormMessage>
                        </FormItem>
                        </FormField>

                        <FormField v-slot="{ componentField, errorMessage }" name="nombre">
                        <FormItem class="h-[5rem] mt-8">
                            <div class="form-item-wide">
                            <FormLabel class="form-label">Nombre</FormLabel>
                            <FormControl>
                                <Input type="text" v-bind="componentField" />
                            </FormControl>
                            </div>
                            <FormMessage class="form-message-wide" v-if="submitted && errorMessage">{{ errorMessage }}</FormMessage>
                        </FormItem>
                        </FormField>

                        <FormField v-slot="{ componentField, errorMessage }" name="apellido">
                        <FormItem class="h-[5rem] mt-8">
                            <div class="form-item-wide">
                            <FormLabel class="form-label">Apellido</FormLabel>
                                <FormControl>
                                    <Input type="text" v-bind="componentField" />
                                </FormControl>
                            </div>
                            <FormMessage class="form-message-wide" v-if="submitted && errorMessage">{{ errorMessage }}</FormMessage>
                        </FormItem>
                        </FormField>

                        <FormField v-slot="{ componentField, errorMessage }" name="email">
                        <FormItem class="h-[5rem] mt-8">
                            <div class="form-item-wide">
                            <FormLabel class="form-label">Email</FormLabel>
                                <FormControl>
                                    <Input type="text" v-bind="componentField" />
                                </FormControl>
                            </div>
                            <FormMessage class="form-message-wide" v-if="submitted && errorMessage">{{ errorMessage }}</FormMessage>
                        </FormItem>
                        </FormField>

                        <FormField v-slot="{ componentField, errorMessage }" name="sexo">
                            <FormItem class="h-[5rem] mt-8">
                                <div class="form-item-wide">
                                <FormLabel class="form-label" >Sexo</FormLabel>
                                    <Select v-bind="componentField">
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Seleccionar" />
                                                </SelectTrigger>
                                            </FormControl>
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
                                    </div>
                            <FormMessage class="form-message-wide" v-if="submitted && errorMessage">{{ errorMessage }}</FormMessage>
                            </FormItem>
                        </FormField>
                        
                        
                    </div>
                    
                    <div class="flex flex-col w-[40%]">
                            
                        <FormField v-slot="{ handleChange, errorMessage }" name="fechaNac">
                            <FormItem class="h-[5rem] mt-8">
                                <div class="form-item-wide justify-start">
                                <FormLabel class="form-label">Fecha de Nacimiento</FormLabel>
                                <FormControl>
                                    <div class="flex gap-2 w-full">
                                    <Input type="text" v-model="fechaNac.day" placeholder="DD" class="w-16 text-center" maxlength="2"
                                        @input="handleChange({ ...fechaNac, day: $event.target.value.trim() })"/>
                                    <Input type="text" v-model="fechaNac.month" placeholder="MM" class="w-16 text-center" maxlength="2"
                                        @input="handleChange({ ...fechaNac, month: $event.target.value.trim() })"/>
                                    <Input type="text" v-model="fechaNac.year" placeholder="AAAA" class="w-20 text-center" maxlength="4"
                                        @input="handleChange({ ...fechaNac, year: $event.target.value.trim() })"/>
                                    </div>
                                </FormControl>
                            </div>
                            <FormMessage class="form-message-wide" v-if="submitted && errorMessage">{{ errorMessage }}</FormMessage>
                            </FormItem>
                        </FormField>

                        <FormField v-slot="{ field, errorMessage }" name="localidad">
                            <FormItem class="h-[5rem] mt-8">
                                <div class="form-item-wide">
                                    <FormLabel class="form-label">Localidad</FormLabel>
                                    <Select
                                    :model-value="field.value?.id?.toString()"
                                    @update:model-value="(value) => field.onChange({ id: Number(value) })"
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                            <SelectValue class="text-black" :placeholder="currentCliente?.localidad.localidad" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectGroup>
                                            <SelectItem 
                                                v-for="loc in localidades" 
                                                :key="loc.id" 
                                                :value="loc.id.toString()"
                                            >
                                                {{ `${loc.localidad}, ${loc.provincia.provincia}` }}
                                            </SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                            <FormMessage class="form-message-wide" v-if="submitted && errorMessage">{{ errorMessage }}</FormMessage>
                            </FormItem>
                        </FormField>



                        <FormField v-slot="{ componentField, errorMessage }" name="domicilio">
                            <FormItem class="h-[5rem] mt-8">
                                <div class="form-item-wide">
                                <FormLabel class="form-label">Domicilio</FormLabel>
                                    <FormControl>
                                        <Input type="text" v-bind="componentField" />
                                    </FormControl>
                                </div>
                            <FormMessage class="form-message-wide" v-if="submitted && errorMessage">{{ errorMessage }}</FormMessage>

                            </FormItem>
                        </FormField>

                        <FormField v-slot="{ componentField, errorMessage }" name="telefono">
                            <FormItem class="h-[5rem] mt-8">
                                <div class="form-item-wide">
                                <FormLabel class="form-label">Telefono</FormLabel>
                                    <FormControl>
                                        <Input type="text" v-bind="componentField" />
                                    </FormControl>
                                </div>
                            <FormMessage class="form-message-wide" v-if="submitted && errorMessage">{{ errorMessage }}</FormMessage>
                            </FormItem>
                        </FormField>

                        
                        <FormField v-slot="{ componentField }" name="observaciones">
                            <FormItem class="h-[5rem] mt-8">
                                <div class="form-item-wide form-item-wide-area">
                                <FormLabel class="form-label">Observaciones</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            class="resize-none"
                                            v-bind="componentField"
                                        />
                                        </FormControl>
                                </div>
                                <FormMessage />
                            </FormItem>
                        </FormField>

                    

                        </div>

                    </div>
                    <Separator class="mt-12 m-b-4 w-full" />
                    
                    
                    <div class="flex flex-row justify-start items-start  ml-[6%] ">
                        <FormField name="clienteObrasSociales" >
                            <FormItem class="min-h-[5rem] mt-8">
                                <div class="form-item-wide-area-os">
                                <FormLabel class="form-label">Obras Sociales</FormLabel>
                                    <div class="flex flex-col w-[40rem] justify-start items-start p-0 m-0">
                                        <div v-for="(_, index) in selectedObrasSociales" :key="index" class="flex flex-col mb-3 w-[50rem]">
                                            <div class="flex flex-row gap-2 items-start justify-start ">
                                            <FormField :name="`clienteObrasSociales.${index}.obraSocial.id`" v-slot="{ field }" class="w-60">
                                                <FormControl class="w-60">
                                                    <!-- :model-value="selectedObrasSociales[index]?.obraSocial.id?.toString()"˚ -->

                                                    <Select
                                                        :model-value="field.value?.id?.toString() "
                                                        @update:model-value="(value) => {
                                                            if (!selectedObrasSociales[index]) {
                                                                selectedObrasSociales[index] = { obraSocial: { id: null }, numeroSocio: '' };
                                                            }
                                                            selectedObrasSociales[index].obraSocial.id = Number(value);
                                                        }"
                                                    >
                                                        <SelectTrigger class="w-60">
                                                            <SelectValue 
                                                            :class="{
                                                                'text-black': (selectedObrasSociales[index]?.obraSocial.id || 0) !== 0,
                                                                'text-gray-500': (selectedObrasSociales[index]?.obraSocial.id || 0) === 0
                                                            }"
                                                            :placeholder="getObraSocialName(selectedObrasSociales[index]?.obraSocial.id || 0)" />
                                                        </SelectTrigger>
                                                        <SelectContent class="w-60">
                                                            <SelectGroup>
                                                                <SelectItem 
                                                                    v-for="obraSocial in filteredObrasSociales(index)" 
                                                                    :key="obraSocial.id" 
                                                                    :value="obraSocial.id.toString()"
                                                                    class="w-60"
                                                                >
                                                                    {{ obraSocial.nombre }}
                                                                </SelectItem>
                                                            </SelectGroup>
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                            </FormField>
                                            <FormField :name="`clienteObrasSociales.${index}.obraSocial.numeroSocio`" >
                                                <FormControl>
                                                    <Input 
                                                        type="text"
                                                        :model-value="selectedObrasSociales[index]?.numeroSocio || ''"
                                                        @update:model-value="(value) => {
                                                            if (!selectedObrasSociales[index]) {
                                                                selectedObrasSociales[index] = { obraSocial:{id: null}, numeroSocio: '' };
                                                            }
                                                            selectedObrasSociales[index].numeroSocio = value.toString();
                                                        }"
                                                        placeholder="Número de socio" 
                                                        class="w-40 text-center"
                                                    />
                                                </FormControl>
                                            </FormField>
                                            <Button variant="ghost" @click="removeObraSocial(index)">
                                                <Cross2Icon />
                                            </Button>
                                            <span class="d-block text-end font-medium text-sm text-destructive mt-2 mr-9" v-if="submitted && selectedObrasSociales[index]?.obraSocial.id && selectedObrasSociales[index]?.numeroSocio=='' ">Indique el Número de socio</span>
                                        </div>
                                        </div>
                                        <Button type="button" variant="link" size="sm" class="mt-1 p-0" id="add-os" @click="addObraSocial">
                                            + Agregar Obra Social
                                        </Button>
                                    </div>
                                </div>
                            </FormItem>
                        </FormField>
                    </div>
                </div>
                <div class="form-footer w-full flex flex-row justify-end mt-8 mb-6 pr-[6rem]">
                    <Button variant="outline" class="w-[15%] mr-5">Cancelar</Button>

                    <Button type="submit" class="w-[15%]">{{ loading ? 'Cargando...' : 'Guardar' }}</Button>
                </div>
            </form>
        </div>

        <AlertError 
            v-model="showError"
            title="Error"
            :message="errorMessage"
            button="Aceptar"
            :action="()=>{showError=false}"
        />

    
    </div>
</template>


<style>
#add-os{
    color: gray;
}
</style>