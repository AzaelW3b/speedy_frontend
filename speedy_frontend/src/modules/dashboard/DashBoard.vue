<template>
    <div class="contenedor">
      <h2>Inicio</h2>
      <q-separator color="primary" class="q-my-md" inset />
      <div class="cards-dashboard">
        <q-card class="card">
          <q-card-section class="contenido-card">
            <span class="material-icons text-primary">person</span>
            <h3>Clientes registrados</h3>
            <p class="text-primary">{{ clientes.length }}</p>
          </q-card-section>
        </q-card>

        <q-card class="card">
          <q-card-section class="contenido-card">
            <span class="material-icons text-primary">payments</span>
            <h3>Ventas del dia</h3>
            <p class="text-primary">{{ ventaDia?.cantidadVentas}}</p>
            <!-- <p class="text-primary">{{ v }}</p> -->
          </q-card-section>
        </q-card>

        <q-card class="card">
          <q-card-section class="contenido-card">
            <span class="material-icons text-primary">payments</span>
            <h3>Ingresos del dia</h3>
            <p class="text-primary">{{ formatoMoneda.format(ventaDia?.totalVentasDia) }}</p>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </template>

<script setup>
import { useClientesStore } from 'src/stores/clientes'
// import { useProductosStore } from 'src/stores/productos'
import { useVentasStore } from 'src/stores/ventas'
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'

const useCliente = useClientesStore()
const { clientes } = storeToRefs(useCliente)

// const useProducto = useProductosStore()
// const { productos } = storeToRefs(useProducto)

const useVenta = useVentasStore()
const { obtenerVentaDia } = useVenta
const { ventaDia } = storeToRefs(useVenta)

const formatoMoneda = ref(new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }))

onMounted(() => obtenerVentaDia())
</script>

  <style scoped>
  .link-tablero {
    text-decoration: none;
    color: black;
    cursor: pointer;
    user-select: none;
  }
  </style>
