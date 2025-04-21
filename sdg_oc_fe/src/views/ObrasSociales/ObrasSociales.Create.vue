<script lang="ts" setup>
import CreateObrasSocialForm from '@/components/CreateObrasSocial.Form.vue';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { toast } from '@/components/ui/toast';
import { useRouter } from 'vue-router';

const router = useRouter();
import { SlashIcon } from 'lucide-vue-next';


const handleCreateObraSocial = async()=>{
    router.push(`/obras-sociales`)
    toast({
        title: 'Obra Social registrado con éxito',
    })
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
                    <BreadcrumbLink href="/parametros">
                        Parámetros
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                    <SlashIcon />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                    <BreadcrumbLink href="/obras-sociales">
                        Obras Sociales
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                    <SlashIcon />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                    <BreadcrumbPage>Nueva Obra Social</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>

        <CreateObrasSocialForm
            @handle-create-obra-social="handleCreateObraSocial"
            @handle-cancel="router.push('/obras-sociales')"
        />

    </div>
</template>