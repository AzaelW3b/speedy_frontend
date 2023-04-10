<template>
  <q-layout>
    <div class="q-pa-md">
      <div div class="q-pa-md">
        <h4>Registro de ventas</h4>
      </div>
      <q-separator color="primary" class="q-my-md" inset />
      <q-btn
        label="Registrar nueva venta"
        color="primary"
        class="q-my-md"
        icon="add"
        @click="nuevaVenta"
      />

      <q-table
        color="primary"
        :rows="ventas"
        :columns="columns"
        :filter="buscar"
      >
      <template v-slot:body-cell-acciones="props">
          <q-td>
            <q-btn
              @click="ventaEditarId(props.row._id)"
              flat
              color="dark"
              icon="edit"
            >
              <q-tooltip>{{ `Editar al cliente ${props.row.nombreProducto}` }}</q-tooltip>
            </q-btn>
            <q-btn
              @click="confirmarEliminarVenta(props.row)"
              flat
              color="negative"
              icon="delete"
            >
              <q-tooltip>{{ `Eliminar el producto ${props.row.nombreProducto}` }}</q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </q-table>
      <ModalVentas ref="modalVentas"/>
    </div>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { storeToRefs } from 'pinia'
import { useVentasStore } from 'src/stores/ventas'
import ModalVentas from 'src/components/ventas/ModalVentas.vue'

const useVenta = useVentasStore()
const { obtenerVentasId, eliminarVentas } = useVenta
const { ventas } = storeToRefs(useVenta)

const columns = [
  {
    name: 'cliente',
    label: 'Cliente',
    field: row => row?.cliente?.label,
    align: 'left',
    sortable: true
  },
  {
    name: 'productos',
    label: 'Total de productos comprados',
    field: row => row?.productos?.reduce((suma, producto) => suma + producto.cantidad, 0),
    align: 'left',
    sortable: true
  },
  {
    name: 'total',
    label: 'Total del compra',
    field: 'total',
    align: 'left',
    sortable: true
  },
  {
    name: 'cashback',
    label: 'Dinero recuperado del cliente',
    field: 'cashback',
    align: 'left',
    sortable: true
  },
  {
    name: 'fecha',
    label: 'Fecha de compra',
    field: 'fecha',
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
const modalVentas = ref(null)
const buscar = ref('')
const notificacion = useQuasar()

const nuevaVenta = () => {
  modalVentas.value.abrir(true)
}
const ventaEditarId = (id) => {
  obtenerVentasId(id)
  modalVentas.value.abrir(false)
}

const confirmarEliminarVenta = (venta) => {
  notificacion.dialog({
    title: '¿Deseas eliminar la venta?',
    message: 'Una vez le des en "ok" no se podrá recuperar la venta',
    cancel: true,
    persistent: true
  }).onOk(() => {
    eliminarVentas(venta._id)
  }).onCancel(() => {
    console.log('cancelando.....')
  })
}
</script>

<style>
</style>
