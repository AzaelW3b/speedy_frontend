<template>
    <div class="q-mb-md">
        <q-input
            label="Buscar producto por codigo de barras"
            outlined
            :clearable="limpiarCodigo"
            v-model="codigoBarras"
            >
            <template v-slot:prepend>
                <q-icon name="search" />
            </template>
        </q-input>
    </div>
    <form
        @submit.prevent="guardarInventario"
        class="q-pa-md shadow-1"
        v-if="productoEncontrado || inventario"
        >
        <h2>{{ inventario ? 'Actualizar Inventario' : 'Agregar Nuevo Inventario' }}</h2>
            <div class="q-my-sm" v-if="productoEncontrado">
                <label>Código de barras</label>
                <q-input
                    v-model="productoEncontrado.codigoBarras"
                    label="Ingresa el codigo de barras"
                    outlined
                />
            </div>
            <div class=" q-my-sm" v-if="productoEncontrado">
                <label>Producto</label>
                <q-input
                    v-model="productoEncontrado.nombreProducto"
                    label="Ingresa el nombre de producto"
                    outlined
                />
            </div>
            <div class=" q-my-sm" v-if="productoEncontrado">
                <label>Cantidad</label>
                <q-input
                    v-model="cantidad"
                    type="number"
                    label="Ingresa el codigo de barras"
                    outlined
                />
            </div>

            <div class="q-my-sm" v-if="inventario">
                <label>Código de barras</label>
                <q-input
                    v-model="inventario.codigoBarras"
                    label="Ingresa el codigo de barras"
                    outlined
                />
            </div>
            <div class=" q-my-sm" v-if="inventario">
                <label>Producto</label>
                <q-input
                    v-model="inventario.nombreProducto"
                    label="Ingresa el nombre de producto"
                    outlined
                />
            </div>
            <div class=" q-my-sm" v-if="inventario">
                <label>Cantidad</label>
                <q-input
                    v-model="inventario.cantidad"
                    type="number"
                    label="Ingresa el codigo de barras"
                    outlined
                />
            </div>

            <div class="q-my-md">
                <q-btn
                    :label= "inventario ? 'Editar Inventario' : 'Guardar inventario'"
                    type="submit"
                    color="primary"
                />
            </div>
    </form>
    <div v-if="inventario === null && productoEncontrado === null">
        <q-card class="my-card">
            <q-card-section>
                <h4>Debes escanear el código de barras para encontrar un producto y agregarlo al inventario.</h4>
            </q-card-section>
        </q-card>
    </div>

</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useInventariosStore } from 'src/stores/inventario'
import { storeToRefs } from 'pinia'

const useInventario = useInventariosStore()
const { buscarProductoCodigo, guardarInventarios } = useInventario
const { productoEncontrado, inventario } = storeToRefs(useInventario)

const cantidad = ref(0)
const codigoBarras = ref('')
const limpiarCodigo = ref(true)
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
  buscarProductoCodigo(codigoBarras.value)
}

const guardarInventario = () => {
  const nuevoInventario = {
    ...productoEncontrado.value,
    cantidad: parseInt(cantidad.value)
  }
  // nuevo registro
  if (productoEncontrado) {
    guardarInventarios(nuevoInventario)
    return
  }
  // editando el registro
  if (inventario) {
    guardarInventario()
  }
//   guardarInventarios(nuevoInventario)
}
</script>
