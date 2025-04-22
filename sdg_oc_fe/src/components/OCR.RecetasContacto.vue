<script lang="ts" setup>
import Button from '@/components/ui/button/Button.vue';
import Input from '@/components/ui/input/Input.vue';
import Label from '@/components/ui/label/Label.vue';
import Separator from '@/components/ui/separator/Separator.vue';
import { AsteriskIcon, ImageOffIcon } from 'lucide-vue-next';
import { ref } from 'vue';
import TooltipProvider from '@/components/ui/tooltip/TooltipProvider.vue';
import Tooltip from '@/components/ui/tooltip/Tooltip.vue';
import TooltipTrigger from '@/components/ui/tooltip/TooltipTrigger.vue';
import TooltipContent from '@/components/ui/tooltip/TooltipContent.vue';
import AlertError from '@/components/AlertError.vue';
import { useLoaderStore } from '@/stores/LoaderStore';
import LoaderForm from './LoaderForm.vue';

const loader = useLoaderStore();
const loadingForm =ref<boolean>(false);

const emit = defineEmits(['hanldeSubmit', 'handleCancel']);

const showError = ref<boolean>(false);
const errorMessage =ref<string>('');

const imageFile1= ref<any>();
const imageFile1URL= ref<any>();
const imageFile2= ref<any>();
const imageFile2URL= ref<any>();

const isValidForm = ref<{image1: boolean, image2: boolean}>({
    image1: true,
    image2: true,
})



const validateAndSubmit = async () => {
    loadingForm.value=true;
    console.log('aaa')
};

const onSubmit = async()=>{
    try{
        emit('hanldeSubmit', 'holaaaa')
    } catch (err: any) {
        errorMessage.value=err.message as string
        showError.value = true;
        loader.hide();
    };
}

const handleImage1Upload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    const file = target.files[0];
    const allowedExtensions = ['.png', '.jpg', '.jpeg'];
    if(file){
        const fileExtension = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
        if (!allowedExtensions.includes(fileExtension)) {
            isValidForm.value.image1 = false;
        } else {
            imageFile1.value = file;
            imageFile1URL.value = URL.createObjectURL(file);
            isValidForm.value.image1 = true;
        }
    }
  }
};

const handleImage2Upload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    const file = target.files[0];
    const allowedExtensions = ['.png', '.jpg', '.jpeg'];
    if(file){
        const fileExtension = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
        if (!allowedExtensions.includes(fileExtension)) {
            isValidForm.value.image2 = false;
        } else {
            imageFile2.value = file;
            imageFile2URL.value = URL.createObjectURL(file);
            isValidForm.value.image2 = true;
        }
    }
  }
};


const handleCancel = ()=>{
    emit('handleCancel');
}


</script>

<template>
    <form @submit.prevent="validateAndSubmit"  class="forms-wide h-[40rem] w-full flex flex-col justify-start items-start  px-[5rem]">
            <div class="w-full h-[4rem] ">
                <h3 class="font-bold text-[1.3rem] text-center">Carga de receta de lentes de contacto mediante imágenes</h3>
                <Separator class="my-6 w-full" />
            </div>
            <div v-if="!loadingForm" class="w-full h-[35rem]" >
                <div class="flex flex-col w-[100%] h-[25rem] px-4 justify-between items-start">
                    <div class=" flex h-[5rem] w-full  justify-center items-center text-gray-800 ">
                        <h5 class="text-[1.1rem] text-center">Subí dos imágenes similares a los ejemplos para que el sistema pueda extraer los datos de tu receta.</h5>
                    </div>
                <div class="flex flex-row w-full justify-evenly h-[20rem]">
                    <div class="flex flex-col w-[45%]  justify-center items-start  h-[20rem] ">
                        <div class="h-[5rem] flex flex-row justify-center w-full  items-center ">
                            <Label class="w-[5rem] mr-4 text-right">Imagen 1</Label>
                            <Input type="file" class="w-[22rem]" accept=".jpg, .jpeg, .png" @change="handleImage1Upload" />
                            <TooltipProvider  v-if="!isValidForm.image1" >
                                <Tooltip>
                                    <TooltipTrigger class="bg-transparent text-xs text-destructive ml-4"> <AsteriskIcon :size="14" /> </TooltipTrigger>
                                    <TooltipContent class="text-destructive border-destructive font-thin text-xs">
                                        <p>Archivo inválido, debe ser un archivo .jpg, .jpeg, .png</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                        <div class="flex flex-col w-full h-[15rem] items-center justify-center ">
                                <div v-if="imageFile1" class="w-full h-[15rem] border rounded-lg overflow-auto flex  items-center justify-center">
                                    <img :src="imageFile1URL" alt="" class=" overflow-x-scroll overflow-y-scroll"   />
                                </div>
                                <div v-else class="flex flex-col justify-center items-center  w-full h-full border text-gray-600 rounded-md">
                                    <ImageOffIcon :size="40" class="text-gray-600 mb-4" />
                                    <span class="font-light text-gray-600">Ninguna imagen seleccionada</span>
                                    <TooltipProvider >
                                        <Tooltip>
                                            <TooltipTrigger class="bg-transparent text-xs underline mt-2"> Ejemplo imagen 1</TooltipTrigger>
                                            <TooltipContent class="font-thin text-xs ">
                                                    <img src="/example-ocr-img1.png " alt="" class="w-[300px] h-auto"   />
                                                
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                        </div>
                    </div>
                    <div class="flex flex-col w-[45%]  justify-center items-start  h-[20rem] ">
                        <div class="h-[5rem] flex flex-row justify-center w-full  items-center ">
                            <Label class="w-[5rem] mr-4 text-right">Imagen 2</Label>
                            <Input type="file" class="w-[22rem]" accept=".jpg, .jpeg, .png" @change="handleImage2Upload" />
                            <TooltipProvider  v-if="!isValidForm.image2" >
                                <Tooltip>
                                    <TooltipTrigger class="bg-transparent text-xs text-destructive ml-4"> <AsteriskIcon :size="14" /> </TooltipTrigger>
                                    <TooltipContent class="text-destructive border-destructive font-thin text-xs">
                                        <p>Archivo inválido, debe ser un archivo .jpg, .jpeg, .png</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                        <div class="flex flex-col w-full mr-7 h-[15rem] items-center justify-center ">
                                <div v-if="imageFile2" class="w-full h-[15rem] border rounded-lg overflow-auto flex  items-center justify-center">
                                    <img :src="imageFile2URL" alt="" class=" overflow-x-scroll overflow-y-scroll"   />
                                </div>
                                <div v-else class="flex flex-col justify-center items-center  w-full h-full border text-gray-600 rounded-md">
                                    <ImageOffIcon :size="40" class="text-gray-600 mb-4" />
                                    <span class="font-light text-gray-600">Ninguna imagen seleccionada</span>
                                    <TooltipProvider >
                                        <Tooltip>
                                            <TooltipTrigger class="bg-transparent text-xs underline mt-2"> Ejemplo imagen 2</TooltipTrigger>
                                            <TooltipContent class="font-thin text-xs ">
                                                    <img src="/example-ocr-img2.png " alt="" class="w-[300px] h-auto"   />
                                                
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                        </div>
                    </div>
                </div>
                </div>
                <div class="form-footer w-full flex flex-row justify-end mt-8 mb-6 pr-8">
                    <Button variant="outline" type="button" class="w-[15%] mr-5"
                        @click="handleCancel">Cancelar</Button>
                    <Button type="submit" class="w-[15%]">Guardar</Button>
                </div>
            </div>
            <div v-else  class="flex flex-col w-full h-[30rem] px-4 justify-center items-center bg-secondary" >
                <LoaderForm />
            </div>
    </form>

    <AlertError v-model="showError" title="Error" :message="errorMessage" button="Aceptar"
                :action="()=>{showError=false}" />
</template>
