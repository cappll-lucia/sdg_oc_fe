<script lang="ts" setup>
import { Cliente } from "@/api/entities/clientes";
import { Localidad } from "@/api/entities/localidad";
import { clientesApi } from "@/api/libs/clientes";
import { localidadesApi } from "@/api/libs/localidades";
import AlertError from "@/components/AlertError.vue";
import { columns } from "@/components/tables/clientes/columns";
import DataTable from "@/components/tables/clientes/data-table.vue";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLoaderStore } from "@/stores/LoaderStore";
import { ReloadIcon, SlashIcon } from "@radix-icons/vue";
import { ChevronLeft, ChevronRight } from "lucide-vue-next";
import { onMounted, ref } from "vue";

const loader = useLoaderStore();
const clientes = ref<Cliente[]>([]);
const localidades = ref<Localidad[]>([]);
const selectedLocalidadId = ref<string>("");
const selectedSexo = ref<string>("");
const txtSearch = ref<string>("");
const currentLimit = ref<string>("10");
const currentOffset = ref<number>(0);
const nextPage = ref<number | null>(null);
const previousPage = ref<number | null>(null);

const showError = ref<boolean>(false);
const errorMessage = ref<string>("");

const loadData = async () => {
  await handleFilterClientes();
  localidades.value = await localidadesApi.getAll();
};

onMounted(async () => {
  loader.show();
  await loadData();
  loader.hide();
});

const clearFilters = async () => {
  txtSearch.value = "";
  selectedSexo.value = "";
  selectedLocalidadId.value = "";
  currentOffset.value = 0;
  currentLimit.value = "10";
  await handleFilterClientes();
};

const handleSearchClientes = async () => {
  try {
    const res = await clientesApi.getAll({
      filtro: txtSearch.value,
      sexo: selectedSexo.value,
      localidadId: selectedLocalidadId.value,
      offset: currentOffset.value,
      limit: currentLimit.value,
    });
    clientes.value = res.items.filter((c) => c.id != 0);
    nextPage.value = res.nextPage;
    previousPage.value = res.previousPage;
  } catch (err: any) {
    errorMessage.value = err.message as string;
    showError.value = true;
  }finally{
    loader.hide();
  }
};

const handleFilterClientes = async () => {
  loader.show();
  await handleSearchClientes();
  loader.hide();
}
const handlePageChange = async (targetOffset: number | null) => {
  if (targetOffset == null) return;
  currentOffset.value = targetOffset;
  await handleFilterClientes();
};

const handleLimitChange = async (newLimit: string) => {
  currentLimit.value = newLimit;
  currentOffset.value = 0;
  await handleFilterClientes();
};
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
          <BreadcrumbPage>Clientes</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
    <h1 class="page-title">Clientes</h1>
    <div class="pt-2">
      <div class="flex flex-row justify-between items-center py-4">
        <div class="search flex w-[65rem] flex-row justify-start gap-x-6">
          <Input
            class="max-w-sm"
            placeholder="Buscar cliente por nombre, apellido o documento  "
            v-model="txtSearch"
            @input="(e: any) => e.target.value.length >= 0 && handleSearchClientes()"
          />
          <Select
            v-model="selectedLocalidadId"
            @update:model-value="handleFilterClientes"
          >
            <SelectTrigger class="w-[200px]">
              <SelectValue placeholder="Filtrar por localidad" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem
                  v-for="localidad in localidades"
                  :value="localidad.id.toString()"
                  >{{ localidad.localidad }},
                  {{ localidad.provincia.provincia }}</SelectItem
                >
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button
            variant="ghost"
            @click="clearFilters"
            class="text-gray-500 text-xs font-light hover:bg-transparent hover:cursor-pointer hover:underline"
          >
            <ReloadIcon />
          </Button>
        </div>
        <Button class="text-xs"
          ><a href="/clientes/create">Registrar Nuevo Cliente</a></Button
        >
      </div>
      <DataTable :columns="columns" :data="clientes" />
    </div>
    <div class="mt-4 flex w-full justify-center">
      <div class="flex items-center gap-1 text-gray-500">
        <Button
          variant="outline"
          class="h-8"
          :disabled="previousPage === null"
          @click="handlePageChange(previousPage)"
        >
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
        <Button
          variant="outline"
          class="h-8"
          :disabled="nextPage === null"
          @click="handlePageChange(nextPage)"
        >
          <ChevronRight />
        </Button>
      </div>
    </div>
    <AlertError
      v-model="showError"
      title="Error"
      :message="errorMessage"
      button="Aceptar"
      :action="
        () => {
          showError = false;
        }
      "
    />
  </div>
</template>
