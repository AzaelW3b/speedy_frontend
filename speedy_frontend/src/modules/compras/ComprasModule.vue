<template>
    <q-layout>
      <div class="q-pa-md">
        <div div class="q-pa-md">
          <h4>Mis compras</h4>
        </div>
        <q-separator color="primary" class="q-my-md" inset />
        <div class="cards-dashboard">
          <q-card class="card">
            <q-card-section class="contenido-card">
              <span class="material-icons text-primary">shopping_bag</span>
              <h3>Compras hechas en el mes</h3>
              <p class="text-primary">{{  ventasCliente ? ventasCliente[0]?.totalCount : 0  }}</p>
            </q-card-section>
          </q-card>
          <q-card class="card">
            <q-card-section class="contenido-card">
              <span class="material-icons text-primary">currency_exchange </span>
              <h3>Total gastado en el mes</h3>
              <p class="text-primary">{{ ventasCliente ? formatoMoneda.format(ventasCliente[0]?.totalVentas || 0) : 0}}</p>
            </q-card-section>
        </q-card>
        <q-card class="card">
            <q-card-section class="contenido-card">
              <span class="material-icons text-primary">attach_money</span>
              <h3>Compras totales</h3>
              <p class="text-primary">{{ formatoMoneda.format(ventasTotales()) }}</p>
            </q-card-section>
        </q-card>
      </div>

        <q-table
          color="primary"
          :rows="ventasClienteId"
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
import { storeToRefs } from 'pinia'
import { useVentasStore } from 'src/stores/ventas'
import { useAutenticacionStore } from 'src/stores/autenticaciones'
import { formatearFecha } from '../../helpers/formatearFecha'
import ModalVentaCliente from 'src/components/ventas/ModalVentaCliente.vue'

const useVenta = useVentasStore()
const { obtenerClienteVenta, obtenerVentasId, obtenerVentasClienteId } = useVenta
const { ventasClienteId, ventasCliente } = storeToRefs(useVenta)

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
    name: 'fecha',
    label: 'Fecha de compra',
    field: row => formatearFecha(row.fecha),
    align: 'left',
    sortable: true
  },
  {
    name: 'acciones',
    label: 'Ver mis tickets',
    field: 'acciones',
    align: 'left',
    sortable: true
  }
]
console.log(ventasClienteId)
onMounted(() => obtenerVentasClienteId(usuarioAutenticado?.value?.usuario?._id))

const modalVentas = ref(null)
const modalVerVentaCliente = ref(null)
const modalVentaTeclado = ref(null)
const buscar = ref('')

const verCompraCliente = (venta) => {
  obtenerVentasId(venta._id)
  modalVerVentaCliente.value.abrir()
}

const ventasTotales = () => {
  const total = ventasClienteId?.value?.reduce((suma, venta) => venta.total + suma, 0)
  return total
}

</script>
