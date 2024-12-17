<script setup lang='ts'>
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
import { Label } from '@/components/ui/label';
</script>

<template>
    <div class="flex justify-center items-center h-[100vh] w-[100vw">
        <Card class="w-[350px]">
            <CardHeader class="text-center gap-0">
                <CardTitle><img src="../assets/logo_no_bg.png" /></CardTitle>
                <CardDescription class="text-lg">Sistema de Gestión</CardDescription>
            </CardHeader>
            <CardContent>
                <form>
                    <div class="grid items-center w-full gap-4">
                        <div class="flex flex-col space-y-1.5">
                            <Label for="email">Email</Label>
                            <Input id="email" />
                        </div>
                        <div class="flex flex-col space-y-1.5">
                            <Label for="password">Password</Label>
                            <Input id="password" type="password" />
                        </div>
                    </div>
                </form>
            </CardContent>
            <CardFooter class="flex justify-end px-6 pb-6">
                <Button>Iniciar Sesión</Button>
            </CardFooter>
        </Card>
    </div>
</template>