<script setup lang='ts'>
import AlertError from '@/components/AlertError.vue';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input';
import router from '@/router/index';
import { useUserStore } from '@/stores/UsersStore';
import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';
import { ref } from 'vue';
import { z } from 'zod';

const userStore = useUserStore();


const signinError = ref(false);
const errorMessage =ref<string>('');
const loading = ref<boolean>(false);



const formSchema = toTypedSchema(
    z.object({
        username: z.string({message:"Requerido"}),
        password: z.string({message:"Requerido"})
    })
);
const {handleSubmit} = useForm({
    validationSchema: formSchema
})

const onSignin = handleSubmit(async (values)=>{
    loading.value=true;
    try{
        await userStore.singin(values.username, values.password);
        router.push('/');
    }catch(err: any){
        console.log(err)
        errorMessage.value = err?.response?.data.message as string;
        signinError.value=true;
        loading.value=false;
    }
})




</script>

<template>
    <div class="flex justify-center items-top h-[100vh] w-[100vw]">
        <form @submit="onSignin">
        <Card class="w-[350px] h-[400px] relative top-[200px]">
            <CardHeader class="text-center gap-0">
                <CardTitle><img src="../assets/logo_no_bg.png" /></CardTitle>
                <CardDescription class="text-lg">Sistema de Gestión</CardDescription>
            </CardHeader>
            <CardContent>
                <div class="grid items-center w-full gap-4">
                    <FormField v-slot="{ componentField }" name="username">
                        <FormItem class="h-[5rem]">
                            <div class="form-item">
                                <FormLabel class="form-label">Nombre de Usuario</FormLabel>
                                <FormControl>
                                    <Input type="text" v-bind="componentField" />
                                </FormControl>
                            </div>
                            <FormMessage/>
                        </FormItem>
                    </FormField>
                    
                    <FormField v-slot="{ componentField }" name="password">
                        <FormItem class="h-[5rem]">
                            <div class="form-item">
                                <FormLabel class="form-label">contraseña</FormLabel>
                                <FormControl>
                                    <Input type="password" v-bind="componentField" />
                                </FormControl>
                            </div>
                            <FormMessage/>
                        </FormItem>
                    </FormField>
                </div>
                </CardContent>
                <CardFooter class="flex justify-end px-6 pb-6">
                    <Button type="submit">Iniciar Sesión</Button>
                </CardFooter>
            </Card>
        </form>
    </div>
    <AlertError 
        v-model="signinError"
        title="Error al Iniciar Sesion"
        :message="errorMessage"
        button="Aceptar"
        @action="()=>{signinError=false}"
    />
</template>