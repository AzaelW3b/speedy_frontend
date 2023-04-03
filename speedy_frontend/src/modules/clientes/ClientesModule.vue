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
          <template v-slot:body-cell-acciones="props">
            <q-td>
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
        <!-- <FormularioEntrevista ref="modelEntrevista"></FormularioEntrevista> -->
      </div>
    </q-layout>
  </template>
<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { storeToRefs } from 'pinia'
import { useClientesStore } from 'src/stores/clientes'
import ModalClientes from '../../components/clientes/ModalClientes.vue'

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
    field: row => row.invitadoPorId ? row.invitadoPorId.label : 'No fue invitado por alguien',
    align: 'left',
    sortable: true
  },
  {
    name: 'invitados',
    label: 'Cantidad de invitados',
    field: 'invitados',
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
