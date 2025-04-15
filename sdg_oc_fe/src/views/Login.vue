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
import { Input } from '@/components/ui/input';
import Label from '@/components/ui/label/Label.vue';
import router from '@/router/index';
import { useUserStore } from '@/stores/UsersStore';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { AsteriskIcon } from 'lucide-vue-next';
import { ref } from 'vue';

const userStore = useUserStore();


const signinError = ref(false);
const errorMessage =ref<string>('');
const loading = ref<boolean>(false);

const loginData = ref<{username: string|undefined; password: string|undefined}>({
    username: undefined,
    password: undefined
})

const isValidLogin = ref<{username: boolean, password: boolean}>({
    username: true,
    password: true
})


const onSignin = async ()=>{
    loading.value=true;
    if(loginData.value.username && loginData.value.password){

        try{
            await userStore.singin(loginData.value.username, loginData.value.password);
            router.push('/');
        }catch(err: any){
            console.log(err)
            errorMessage.value = err?.response?.data.message as string;
            signinError.value=true;
            loading.value=false;
        }
    }else{
        isValidLogin.value.username = Boolean(loginData.value.username)
        isValidLogin.value.password = Boolean(loginData.value.password)
    }
}




</script>

<template>
    <div class="flex justify-center items-top h-[100vh] w-[100vw]">
        <form @submit.prevent="onSignin">
        <Card class="w-[350px] h-[450px] relative top-[200px]">
            <CardHeader class="text-center gap-0">
                <CardTitle><img src="../assets/logo_no_bg.png" /></CardTitle>
                <CardDescription class="text-lg">Sistema de Gestión</CardDescription>
            </CardHeader>
            <CardContent>
                <div class="grid items-center w-full gap-4">
                        <div class="h-[5rem]">
                            <div class="form-item">
                                <Label class="form-label">Nombre de Usuario</Label>
                                <div class="flex flex-row">

                                    <Input type="text" v-model="loginData.username" />
                                    <TooltipProvider  v-if="!isValidLogin.password" >
                                        <Tooltip>
                                            <TooltipTrigger class="bg-transparent text-xs text-destructive ml-4 "> <AsteriskIcon :size="14" /> </TooltipTrigger>
                                            <TooltipContent class="text-destructive border-destructive font-thin text-xs">
                                                <p>Ingrese su Nombre de Usuario</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                            </div>
                        </div>
                    
                        <div class="h-[5rem]">
                            <div class="form-item">
                                <Label class="form-label">Contraseña</Label>
                                <div class="flex flex-row">

                                    <Input type="password" v-model="loginData.password" />
                                    <TooltipProvider  v-if="!isValidLogin.password" >
                                        <Tooltip>
                                            <TooltipTrigger class="bg-transparent text-xs text-destructive ml-4 "> <AsteriskIcon :size="14" /> </TooltipTrigger>
                                            <TooltipContent class="text-destructive border-destructive font-thin text-xs">
                                                <p>Ingrese su Contraseña</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                            </div>
                        </div>
                </div>
                </CardContent>
                <CardFooter class="flex justify-center px-6 pb-6">
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