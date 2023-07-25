<template>
    <q-layout>
      <div class="q-pa-md">
        <div div class="q-pa-md">
          <h4>Control de inventario</h4>
        </div>
        <q-separator color="primary" class="q-my-md" inset />

        <div class="row">
          <div class="col-xs-12 col-md-8 q-mr-xl">
            <q-table
              color="primary"
              :rows="inventarios"
              :columns="columns"
              :filter="buscar">
              <template  v-slot:top>
                  <div class="fit row q-gutter-sm">
                    <div class="col-6">
                      <q-input outlined dense debounce="300" clearable v-model="buscar" placeholder="Buscar en inventario">
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
                    @click="inventarioEditarId(props.row)"
                    flat
                    color="dark"
                    icon="edit"
                  >
                    <q-tooltip
                      >{{ `Editar al cliente ${props.row.nombreProducto}` }}</q-tooltip
                    >
                  </q-btn>
                  <q-btn
                    @click="confirmarEliminarProducto(props.row)"
                    flat
                    color="negative"
                    icon="delete"
                  >
                    <q-tooltip
                      >{{ `Eliminar el producto ${props.row.nombreProducto}` }}</q-tooltip
                    >
                  </q-btn>
                </q-td>
              </template>
            </q-table>
          </div>
          <div class="col-xs-12 col-md-3">
            <FormularioInventario />
          </div>
        </div>
      </div>
    </q-layout>
  </template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { storeToRefs } from 'pinia'
import { useInventariosStore } from 'src/stores/inventario'
import FormularioInventario from 'src/components/inventario/FormularioInventario.vue'
const useInventario = useInventariosStore()
const { buscarInventario, eliminarInventario } = useInventario
const { inventarios } = storeToRefs(useInventario)
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
    name: 'cantidad',
    label: 'Cantidad actual en inventario',
    field: 'cantidad',
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

const buscar = ref('')
const notificacion = useQuasar()

const inventarioEditarId = (inventario) => {
  buscarInventario(inventario.codigoBarras)
}

const confirmarEliminarProducto = (inventario) => {
  notificacion.dialog({
    title: `¿Deseas eliminar el producto ${inventario.nombreProducto}?`,
    message: 'Una vez le des en "ok" no se podrá recuperar el producto',
    cancel: true,
    persistent: true
  }).onOk(() => {
    eliminarInventario(inventario._id)
  }).onCancel(() => {
    console.log('cancelando.....')
  })
}
</script>
