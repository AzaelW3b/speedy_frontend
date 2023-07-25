<template>
  <q-layout>
    <div class="q-pa-md">
      <div div class="q-pa-md">
        <h4>Productos</h4>
      </div>
      <q-separator color="primary" class="q-my-md" inset />
      <q-btn
        label="Nuevo producto"
        color="primary"
        class="q-my-md"
        icon="add"
        @click="nuevoProducto"
      />
      <q-table
        color="primary"
        :rows="productos"
        :columns="columns"
        :filter="buscar"

      >
      <template  v-slot:top>
            <div class="fit row q-gutter-sm justify-end">
              <div class="col-4">
                <q-input outlined dense debounce="300" clearable v-model="buscar" placeholder="Buscar producto">
                  <template v-slot:append>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </div>
            </div>
          </template>
      <template v-slot:body-cell-acciones="props">
          <q-td>
            <q-btn
              @click="productoEditarId(props.row._id)"
              flat
              color="dark"
              icon="edit"
            >
              <q-tooltip>{{ `Editar al cliente ${props.row.nombreProducto}` }}</q-tooltip>
            </q-btn>
            <q-btn
              @click="confirmarEliminarProducto(props.row)"
              flat
              color="negative"
              icon="delete"
            >
              <q-tooltip>{{ `Eliminar el producto ${props.row.nombreProducto}` }}</q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </q-table>
      <ModalProductos ref="modalProductos"/>
    </div>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { storeToRefs } from 'pinia'
import { useProductosStore } from 'src/stores/productos'
import ModalProductos from 'src/components/productos/ModalProductos.vue'

const useProducto = useProductosStore()
const { obtenerProductosId, eliminarProductos } = useProducto
const { productos } = storeToRefs(useProducto)

const columns = [
  {
    name: 'codigoBarras',
    label: 'Código de barras',
    field: 'codigoBarras',
    align: 'left',
    sortable: true
  },
  {
    name: 'nombreProducto',
    label: 'Nombre del producto',
    field: 'nombreProducto',
    align: 'left',
    sortable: true
  },
  {
    name: 'categoria',
    label: 'Categoria',
    field: 'categoria',
    align: 'left',
    sortable: true
  },
  {
    name: 'acciones',
    label: 'Acciones',
    field: 'acciones',
    align: 'left',
    sortable: true
  }
]

// const modelEntrevista = ref(null)
const modalProductos = ref(null)
const buscar = ref('')
const notificacion = useQuasar()

const nuevoProducto = () => {
  modalProductos.value.abrir(true)
}
const productoEditarId = (id) => {
  obtenerProductosId(id)
  modalProductos.value.abrir(false)
}

const confirmarEliminarProducto = (producto) => {
  notificacion.dialog({
    title: `¿Deseas eliminar el producto ${producto.nombreProducto}?`,
    message: 'Una vez le des en "ok" no se podrá recuperar el producto',
    cancel: true,
    persistent: true
  }).onOk(() => {
    eliminarProductos(producto._id)
  }).onCancel(() => {
    console.log('cancelando.....')
  })
}
</script>

<style>
</style>
