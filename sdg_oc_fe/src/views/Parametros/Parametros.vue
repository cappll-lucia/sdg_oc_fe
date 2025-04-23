<script setup lang="ts">
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { router } from "@/router";
import { SlashIcon } from "@radix-icons/vue";
import { onMounted } from "vue";

const loadData = async () => {};

onMounted(async () => {
  await loadData();
});
</script>

<template>
  <div class="page">
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/"> Inicio </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <SlashIcon />
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbPage>Parámetros</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
    <h1 class="page-title">Parámetros</h1>
    <div class="h-4/5 mt-10 flex flex-col justify-center items-center gap-y-20">
      <div
        @click="router.push('marcas')"
        class="cursor-pointer box flex justify-center items-center border rounded-lg h-16 w-3/6"
      >
        <span class="font-bold text-lg">Marcas</span>
      </div>
      <div
        @click="router.push('obras-sociales')"
        class="cursor-pointer box flex justify-center items-center border rounded-lg h-16 w-3/6"
      >
        <span class="font-bold text-lg">Obras Sociales</span>
      </div>
      <div
        @click="router.push('proveedores')"
        class="cursor-pointer box flex justify-center items-center border rounded-lg h-16 w-3/6"
      >
        <span class="font-bold text-lg">Proveedores</span>
      </div>
    </div>
  </div>
</template>
