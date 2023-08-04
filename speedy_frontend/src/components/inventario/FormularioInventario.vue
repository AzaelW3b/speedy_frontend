<template>
<div>
    <div class="q-mb-md">
        <q-input
            label="Buscar producto por codigo de barras"
            outlined
            :clearable="true"
            @clear="limpiarEstado"
            v-model="busquedaCodigoBarras"
            >
            <template v-slot:prepend>
                <q-icon name="search" />
            </template>
        </q-input>
    </div>
    <form
        @submit.prevent="guardarInventario"
        class="q-pa-md shadow-1"
        v-if="busquedaCodigoBarras !== ''"
        >
      <div v-if="inventario">
        <h2>{{ nuevoRegistro ? 'Agregar Nuevo Inventario' : 'Actualizar Inventario' }}</h2>

        <div class="q-my-sm">
            <label>Código de barras</label>
            <q-input
                v-model="inventario.codigoBarras"
                :label= "nuevoRegistro ?  'Ingresa el codigo de barras'  : 'Edita el codigo de barras'"
                outlined
            />
        </div>
        <div class=" q-my-sm">
            <label>Producto</label>
            <q-input
                v-model="inventario.nombreProducto"
                :label= "nuevoRegistro ? 'Ingresa el producto'  : 'Edita el producto'"
                outlined
            />
        </div>
        <div class=" q-my-sm" v-if="nuevoRegistro">
            <label>Cantidad</label>
            <q-input
                v-model="cantidad"
                type="number"
                :label= "nuevoRegistro ? 'Ingresa la cantidad del inventario': 'Edita la cantidad del inventario'"
                outlined
            />
        </div>

        <div class=" q-my-sm" v-else>
            <label>Cantidad</label>
            <q-input
                v-model="inventario.cantidad"
                type="number"
                :label= "nuevoRegistro ? 'Ingresa la cantidad del inventario': 'Edita la cantidad del inventario'"
                outlined
            />
        </div>

        <div class=" q-my-sm">
            <label>Precio de compra</label>
            <q-input
                v-model="inventario.precioCompra"
                type="number"
                :label= "nuevoRegistro ? 'Ingresa el precio de compra': 'Edita el precio de compra'"
                outlined
            />
        </div>

        <div class=" q-my-sm">
            <label>Precio de salida</label>
            <q-input
                v-model="inventario.precioSalida"
                type="number"
                :label= "nuevoRegistro ? 'Ingresa el precio de salida': 'Edita el precio de salida'"
                outlined
            />
        </div>

        <div class="q-my-md">
            <q-btn
                :label= "nuevoRegistro ? 'Guardar inventario' : 'Editar Inventario'"
                type="submit"
                color="primary"
            />
        </div>
      </div>
    </form>
    <div v-if="busquedaCodigoBarras === '' ">
        <q-card class="my-card">
            <q-card-section>
                <h4>Debes escanear el código de barras para encontrar un producto y agregarlo al inventario.</h4>
            </q-card-section>
        </q-card>
    </div>
</div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useInventariosStore } from 'src/stores/inventario'
import { storeToRefs } from 'pinia'

const useInventario = useInventariosStore()
const { buscarProductoCodigo, guardarInventarios, editarInventario } = useInventario
const { inventario, nuevoRegistro, busquedaCodigoBarras } = storeToRefs(useInventario)

const cantidad = ref(0)

onMounted(() => {
  let ultimoCodigoScanneado = ''

  document.addEventListener('keypress', (e) => {
    const charCode = typeof e.which === 'number' ? e.which : e.keyCode
    if (charCode !== 13) {
      ultimoCodigoScanneado += String.fromCharCode(charCode)
    } else {
      if (ultimoCodigoScanneado === '') return
      procesarCodigo()
      ultimoCodigoScanneado = ''
    }
  })
})
function procesarCodigo (codigo) {
  if (codigo === '') return
  buscarProductoCodigo(busquedaCodigoBarras.value)
}

const guardarInventario = () => {
  const nuevoInventario = {
    ...inventario.value,
    cantidad: parseInt(cantidad.value) || inventario?.value?.cantidad
  }
  if (nuevoRegistro.value) {
    guardarInventarios(nuevoInventario)
    limpiarEstado()
  } else {
    editarInventario(nuevoInventario)
    limpiarEstado()
  }
}
const limpiarEstado = () => {
  busquedaCodigoBarras.value = ''
}
</script>
