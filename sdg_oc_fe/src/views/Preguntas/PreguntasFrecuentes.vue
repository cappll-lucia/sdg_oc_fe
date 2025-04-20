<script lang="ts" setup>
import { CircleHelp } from 'lucide-vue-next';
import { ref } from 'vue';


const preguntas = ref<{question: string, response: string}[]>([
    
{

   question: "¿Cómo doy de alta un nuevo cliente? ",
    response: "Ingresá a la sección Clientes y hacé clic en 'Nuevo cliente'. Completá los campos obligatorios como nombre, DNI y datos de contacto."
},    

    {

    question:    "¿Cómo registro una receta para un cliente existente? ",
     response:    "Desde la ficha del cliente, seleccioná la pestaña Recetas y presioná 'Agregar receta'. Ingresá los valores correspondientes para OD y OI."
    },

    {

    question:    "¿Puedo modificar una receta ya cargada? ",
     response:    "Sí. Desde el historial de recetas del cliente, hacé clic en el ícono de edición sobre la receta que querés modificar."
    },

    {

    question:    "¿Cómo veo el historial de recetas de un cliente? ",
     response:    "Entrá al perfil del cliente y seleccioná la pestaña Recetas. Ahí verás una lista con todas las recetas cargadas, ordenadas por fecha."
    },

    {

    question:    "¿Puedo cargar una receta sin asignarla a una venta? ",
     response:    "Sí, las recetas pueden cargarse de forma independiente. Luego podés vincularlas a una venta desde el módulo de ventas."
    },

    

    {

    question:    "¿Cómo registro una nueva venta? ",
     response:    "Dirigite a la sección Ventas y seleccioná 'Nueva venta'. Buscá al cliente, seleccioná productos y completá el medio de pago."
    },

    {

    question:    "¿Dónde puedo ver el estado actual de la caja? ",
     response:    "Ingresá en la sección Caja para ver ingresos, egresos y saldo actual."
    },

    {

    question:    "¿Qué significa 'cerrar caja'? ",
     response:    "Cerrar caja permite generar un reporte PDF del movimiento diario y reiniciar el flujo para el siguiente día."
    },

    {

    question:    "¿Cómo registro un ingreso o egreso sin que esté asociado a una venta? ",
     response:    "Desde la sección Caja, seleccioná 'Nuevo movimiento' y elegí si es un ingreso o egreso manual. Indicá el motivo y el monto."
    },

    {

    question:    "¿Qué tipos de medios de pago se pueden registrar? ",
     response:    "Efectivo, transferencia, tarjeta de crédito, tarjeta de débito, o pagos con obras sociales."
    },

    {

    question:    "Un cliente paga una parte ahora y el resto después. ¿Cómo lo registro? ",
     response:    "Al registrar la venta, seleccioná el medio de pago que corresponda con el importe entregado y para el saldo pendiente, indicá cuenta corriente como medio de pago."
    },



    {

    question:    "¿Cómo agrego un nuevo producto al sistema? ",
     response:    "Entrá en Productos y usá el botón 'Nuevo producto'. Completá los datos como marca, proveedor y precio."
    },

    {

    question:    "¿Cómo agrego una nueva marca o proveedor? ",
     response:    "Ingresá en la sección Parámetros, luego Marcas o Proveedores. Usá los botones 'Nueva marca' o 'Nuevo proveedor' según lo que necesites cargar."
    },
    {

    question:    "¿Cómo asigno una obra social a un cliente? ",
     response:    "En el perfil del cliente, seleccioná 'Editar' y luego elegí una obra social del listado."
    },

    {

    question:    "¿El sistema factura automáticamente con AFIP? ",
     response:    "Sí, para todas las ventas se genera automáticamente una factura."
    },
    {
    question:    "Un cliente quiere saber qué receta usó para sus anteojos actuales. ¿Dónde lo veo? ",
     response:    "Entrá al historial del cliente y buscá la receta asociada a su última venta. Podés abrirla y ver los valores cargados."
    },
])

</script>



<template>
    <div class="page mt-8 ml-8">

        <h1 class="page-title mb-4  flex flex-row items-center">
            <CircleHelp  class="mr-4" :size="30"/>
            Preguntas frecuentes</h1>
        
        <div class=" flex flex-col justify-start items-start w-full">
            <div v-for="(qts, index) in preguntas" class="flex flex-col justify-start items-start mb-[2rem]">
                <h1 class="font-bold text-lg">{{ index+1 }}. {{ qts.question }}</h1>
                <span class="text-md">{{ qts.response }}</span>
            </div>
        </div>
    </div>
</template>