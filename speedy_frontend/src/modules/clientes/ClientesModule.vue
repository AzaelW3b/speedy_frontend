<template>
    <q-layout>
      <div class="q-pa-md">
        <div div class="q-pa-md">
          <h4>Clientes</h4>
        </div>
        <q-separator color="primary" class="q-my-md" inset />
        <q-btn
          label="Nuevo cliente"
          color="primary"
          class="q-my-md"
          icon="add"
          @click="nuevoCliente"
        />
        <q-table
          color="primary"
          :rows="clientes"
          :columns="columns"
          :filter="buscar"
          >
          <template  v-slot:top>
            <div class="fit row q-gutter-sm justify-end">
              <div class="col-4">
                <q-input outlined dense debounce="300" clearable v-model="buscar" placeholder="Buscar cliente">
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
                @click="generarMembresia(props.row)"
                flat
                color="dark"
                icon="card_membership"
              >
                <q-tooltip>{{ `Generar la membresia del cliente ${props.row.nombreCliente}` }}</q-tooltip>
              </q-btn>
              <q-btn
                @click="clienteEditarId(props.row._id)"
                flat
                color="dark"
                icon="edit"
              >
                <q-tooltip>{{ `Editar al cliente ${props.row.nombreCliente}` }}</q-tooltip>
              </q-btn>
              <q-btn
                @click="confirmarEliminarCliente(props.row)"
                flat
                color="negative"
                icon="delete"
              >
                <q-tooltip>{{ `Eliminar al cliente ${props.row.nombreCliente}` }}</q-tooltip>
              </q-btn>
            </q-td>
          </template>
        </q-table>
        <ModalClientes ref="modalClientes"/>

      </div>
    </q-layout>
  </template>
<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { storeToRefs } from 'pinia'
import { useClientesStore } from 'src/stores/clientes'
import ModalClientes from '../../components/clientes/ModalClientes.vue'
import { generateAndDownloadBarcodeInPDF } from 'src/helpers/codigoBarras'

const useClientes = useClientesStore()
const { obtenerClienteId, eliminarClientes } = useClientes
const { clientes } = storeToRefs(useClientes)

const columns = [
  {
    name: 'nombreCliente',
    label: 'Nombre del cliente',
    field: 'nombreCliente',
    align: 'left',
    sortable: true
  },
  {
    name: 'telefono',
    label: 'Teléfono',
    field: 'telefono',
    align: 'left',
    sortable: true
  },
  {
    name: 'correo',
    label: 'Correo',
    field: 'correo',
    align: 'left',
    sortable: true
  },
  {
    name: 'invitadoPorId',
    label: 'Invitado por',
    field: row => row.invitadoPor ? obtenerNombreCliente(row.invitadoPor) : 'No fue invitado por alguien',
    align: 'left',
    sortable: true
  },
  {
    name: 'invitados',
    label: 'Cantidad de invitados',
    field: row => row?.invitados?.length,
    align: 'left',
    sortable: true
  },
  {
    name: 'rol',
    label: 'Rol',
    field: 'rol',
    align: 'left',
    sortable: true
  },
  {
    name: 'tipoMembresia',
    label: 'Tipo de membresia',
    field: 'tipoMembresia',
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

const modalClientes = ref(null)
const buscar = ref('')
const notificacion = useQuasar()

const nuevoCliente = () => {
  modalClientes.value.abrir(true)
}

const clienteEditarId = (id) => {
  obtenerClienteId(id)
  modalClientes.value.abrir(false)
}
const obtenerNombreCliente = (id) => {
  const clienteNombre = clientes.value.find(cliente => cliente._id === id)
  return clienteNombre?.nombreCliente
}
const generarMembresia = async (cliente) => {
  generateAndDownloadBarcodeInPDF(cliente)
}
const confirmarEliminarCliente = (cliente) => {
  notificacion.dialog({
    title: `¿Deseas eliminar al cliente ${cliente.nombreCliente}?`,
    message: 'Una vez le des en "ok" no se podrá recuperar al cliente',
    cancel: true,
    persistent: true
  }).onOk(() => {
    eliminarClientes(cliente._id)
  }).onCancel(() => {
    console.log('cancelando.....')
  })
}

</script>
