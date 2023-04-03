<template>
    <q-layout>
      <div class="q-pa-md">
        <div div class="q-pa-md">
          <h4>Categorias</h4>
        </div>
        <q-separator color="primary" class="q-my-md" inset />
        <q-btn
          label="Nueva categoria"
          color="primary"
          class="q-my-md"
          icon="add"
          @click="nuevaCategoria"
        />
        <q-table
          color="primary"
          :rows="categorias"
          :columns="columns"
          :filter="buscar"

        >
        <template v-slot:body-cell-acciones="props">
            <q-td>
              <q-btn
                @click="categoriaEditarId(props.row._id)"
                flat
                color="dark"
                icon="edit"
              >
                <q-tooltip>{{ `Editar al cliente ${props.row.nombreCliente}` }}</q-tooltip>
              </q-btn>
              <q-btn
                @click="confirmarEliminarCategoria(props.row)"
                flat
                color="negative"
                icon="delete"
              >
                <q-tooltip>{{ `Eliminar al cliente ${props.row.nombreCliente}` }}</q-tooltip>
              </q-btn>
            </q-td>
          </template>
        </q-table>
        <ModalCategorias ref="modalCategorias"/>
      </div>
    </q-layout>
  </template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { storeToRefs } from 'pinia'
import { useCategoriasStore } from 'src/stores/categorias'
import ModalCategorias from 'src/components/categorias/ModalCategorias.vue'

// const useAspirante = useAspirantesStore()
const useCategoria = useCategoriasStore()
const { obtenerCategoriasId, eliminarCategorias } = useCategoria
const { categorias } = storeToRefs(useCategoria)

const columns = [
  {
    name: 'nombreCategoria',
    label: 'Nombre',
    field: 'nombreCategoria',
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
const modalCategorias = ref(null)
const buscar = ref('')
const notificacion = useQuasar()

const nuevaCategoria = () => {
  modalCategorias.value.abrir(true)
}
const categoriaEditarId = (id) => {
  obtenerCategoriasId(id)
  modalCategorias.value.abrir(false)
}

const confirmarEliminarCategoria = (categoria) => {
  notificacion.dialog({
    title: `¿Deseas eliminar la categoria ${categoria.nombreCategoria}?`,
    message: 'Una vez le des en "ok" no se podrá recuperar la categoria',
    cancel: true,
    persistent: true
  }).onOk(() => {
    eliminarCategorias(categoria._id)
  }).onCancel(() => {
    console.log('cancelando.....')
  })
}
</script>

  <style>
  </style>
