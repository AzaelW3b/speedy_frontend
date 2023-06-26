<template>
  <q-layout>
    <div class="q-pa-md">
      <div div class="q-pa-md">
        <h4>Registro de ventas</h4>
      </div>
      <q-separator color="primary" class="q-my-md" inset />
      <div class="cards-dashboard">
        <q-card class="card">
          <q-card-section class="contenido-card">
            <span class="material-icons text-primary">shopping_bag</span>
            <h3>Ventas del dia</h3>
            <p class="text-primary">{{ ventaDia?.cantidadVentas }}</p>
          </q-card-section>
        </q-card>
        <q-card class="card">
          <q-card-section class="contenido-card">
            <span class="material-icons text-primary">currency_exchange </span>
            <h3>Ingresos del dia</h3>
            <p class="text-primary">{{ formatoMoneda.format(ventaDia?.totalVentasDia) }}</p>
          </q-card-section>
      </q-card>
      <q-card class="card">
          <q-card-section class="contenido-card">
            <span class="material-icons text-primary">attach_money</span>
            <h3>Total de todas las ventas</h3>
            <p class="text-primary">{{ formatoMoneda.format(ventasTotales()) }}</p>
          </q-card-section>
      </q-card>
    </div>

    <q-btn
        label="Nueva venta con teclado"
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
              @click="verCompraCliente(props.row)"
              flat
              color="dark"
              icon="visibility"
            >
              <q-tooltip>{{ `Ver compra del cliente ${obtenerClienteVenta(props.row.clienteId)}` }}</q-tooltip>
            </q-btn>

            <q-btn
              v-if="usuarioAutenticado?.usuario?.rol === 'admin'"
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
      <ModalVentaCliente ref="modalVerVentaCliente"/>
      <ModalVentaTeclado ref="modalVentaTeclado"/>
    </div>
  </q-layout>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useQuasar } from 'quasar'
import { storeToRefs } from 'pinia'
import { useVentasStore } from 'src/stores/ventas'
import { useAutenticacionStore } from 'src/stores/autenticaciones'
import { formatearFecha } from '../../helpers/formatearFecha'
import ModalVentas from 'src/components/ventas/ModalVentas.vue'
import ModalVentaCliente from 'src/components/ventas/ModalVentaCliente.vue'
import ModalVentaTeclado from 'src/components/ventas/ModalVentaTeclado.vue'

const useVenta = useVentasStore()
const { eliminarVentas, obtenerClienteVenta, obtenerVentasId } = useVenta
const { ventas, ventaDia } = storeToRefs(useVenta)

const useAutenticacion = useAutenticacionStore()
const { usuarioAutenticado } = storeToRefs(useAutenticacion)

const formatoMoneda = ref(new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }))

const columns = [
  {
    name: 'cliente',
    label: 'Cliente',
    field: row => obtenerClienteVenta(row?.clienteId),
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
    field: row => formatoMoneda.value.format(row.total),
    align: 'left',
    sortable: true
  },
  {
    name: 'cashback',
    label: 'Dinero recuperado del cliente',
    field: row => formatoMoneda.value.format(row.cashback),
    align: 'left',
    sortable: true
  },
  {
    name: 'fecha',
    label: 'Fecha de compra',
    field: row => formatearFecha(row.fecha),
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
onMounted(() => {
  let ultimoCodigoScanneado = ''

  document.addEventListener('keypress', (e) => {
    const charCode = typeof e.which === 'number' ? e.which : e.keyCode
    if (charCode !== 13) {
      ultimoCodigoScanneado += String.fromCharCode(charCode)
    } else {
      if (ultimoCodigoScanneado === '') return
      procesarCodigo(ultimoCodigoScanneado)
      ultimoCodigoScanneado = ''
    }
  })
})
const modalVentas = ref(null)
const modalVerVentaCliente = ref(null)
const modalVentaTeclado = ref(null)
const buscar = ref('')
const notificacion = useQuasar()

function procesarCodigo (codigo) {
  console.log('Código escaneado:', codigo)
  if (codigo === '') return
  modalVentas.value.abrir({ abrir: true, codigo })
}
const verCompraCliente = (venta) => {
  obtenerVentasId(venta._id)
  modalVerVentaCliente.value.abrir()
}
const nuevaVenta = () => {
  modalVentaTeclado.value.abrir(true)
}
const ventasTotales = () => {
  const total = ventas?.value?.reduce((suma, venta) => venta.total + suma, 0)
  return total
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
