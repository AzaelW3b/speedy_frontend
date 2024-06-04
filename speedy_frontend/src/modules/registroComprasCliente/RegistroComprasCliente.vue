<template>
    <q-layout>
      <div class="q-pa-md">
        <div div class="q-pa-md">
          <h4>Registro de compras del cliente</h4>
        </div>
        <q-separator color="primary" class="q-my-md" inset />
        <q-btn
          label="Nueva compra"
          color="primary"
          class="q-my-md"
          icon="add"
          @click="nuevoRegistroCompraCliente"
        />
        <q-table
          color="primary"
          :rows="ventas"
          :columns="columns"
          :filter="buscar"
        >
        <template  v-slot:top>
              <div class="fit row q-gutter-sm justify-end">
                <div class="col-4">
                  <q-input outlined dense debounce="300" clearable v-model="buscar" placeholder="Buscar usuario">
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
                @click="usuarioEditarId(props.row._id)"
                flat
                color="dark"
                icon="edit"
              >
                <q-tooltip>{{ `Editar al usuario ${props.row.nombreUsuario}` }}</q-tooltip>
              </q-btn>
              <q-btn
                @click="confirmarEliminarUsuario(props.row)"
                flat
                color="negative"
                icon="delete"
              >
                <q-tooltip>{{ `Eliminar al usuario ${props.row.nombreUsuario}` }}</q-tooltip>
              </q-btn>
            </q-td>
          </template>
        </q-table>
        <ModalRegistroCompraCliente ref="modalRegistroCompraCliente"/>
      </div>
    </q-layout>
  </template>
<script setup>
import { onMounted, ref } from 'vue'
import { useQuasar } from 'quasar'
import { storeToRefs } from 'pinia'
import ModalRegistroCompraCliente from 'src/components/comprasClientes/ModalRegistroCompraCliente.vue'
import { useVentasStore } from 'src/stores/ventas'
import { formatearFecha } from '../../helpers/formatearFecha'

const useVenta = useVentasStore()
const { obtenerVentas } = useVenta
const { ventas } = storeToRefs(useVenta)

const columns = [
  {
    name: 'folio',
    label: 'Folio',
    field: 'folio',
    align: 'left',
    sortable: true
  },
  {
    name: 'clienteId',
    label: 'Cliente',
    field: row => row?.clienteId?.nombreCliente,
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
    name: 'nivel',
    label: 'Nivel',
    field: 'nivel',
    align: 'left',
    sortable: true
  },
  {
    name: 'totalCompra',
    label: 'Total de compra',
    field: 'totalCompra',
    align: 'left',
    sortable: true
  },
  {
    name: 'cashback',
    label: 'Bono residual',
    field: 'cashback',
    align: 'left',
    sortable: true
  },
  {
    name: 'fecha',
    label: 'Fecha de venta',
    field: row => formatearFecha(row?.fecha),
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

const modalRegistroCompraCliente = ref(null)
const buscar = ref('')
const notificacion = useQuasar()

const nuevoRegistroCompraCliente = () => {
  modalRegistroCompraCliente.value.abrir(true)
}

const usuarioEditarId = (id) => {
  // obtenerUsuariosId(id)
  modalRegistroCompraCliente.value.abrir(false)
}

const confirmarEliminarUsuario = (usuario) => {
  notificacion.dialog({
    title: `¿Deseas eliminar el ${usuario.nombreUsuario}?`,
    message: 'Una vez le des en "ok" no se podrá recuperar del usuario',
    cancel: true,
    persistent: true
  }).onOk(() => {
    // eliminarUsuarios(usuario._id)
  }).onCancel(() => {
    console.log('cancelando.....')
  })
}
onMounted(() => obtenerVentas())
</script>
