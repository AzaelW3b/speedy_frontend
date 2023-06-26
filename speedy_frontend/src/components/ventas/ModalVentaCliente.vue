<template>
    <q-dialog persistent v-model="modalVenta">
      <q-card class="full-width">
        <q-card-section class="bg-primary text-white">
          <q-btn icon="close" flat round dense v-close-popup />
          <div class="text-h4 text-center ">
            Compra de {{ obtenerClienteId(venta.clienteId)?.nombreCliente }}
            <q-separator />
          </div>
        </q-card-section>

      <q-card  flat bordered class="my-card full-width">
        <q-card-section>
          <table class="q-pa-md tabla-venta">
            <tr>
              <th>Producto</th>
              <th>Cantidad de compra</th>
              <th>precio</th>
              <th>Total de compra</th>
            </tr>
            <tr class="venta-datos" v-for="venta in venta.productos" :key="venta.codigoBarras">
              <td>{{ venta.nombreProducto || venta.label }}</td>
              <td>{{ venta.cantidad }}</td>
              <td>{{ formatoMoneda.format(venta.precio) }}</td>
              <td>{{ formatoMoneda.format(venta.total) }}</td>
            </tr>
            <tr>
            </tr>
          </table>
        </q-card-section>
        <q-card-section>
            <p> <b>Total de compra: </b> {{ formatoMoneda.format(total) }} </p>
        </q-card-section>
      </q-card>
      </q-card>
    </q-dialog>
  </template>

<script>
import { ref } from 'vue'
import { useVentasStore } from 'src/stores/ventas'
import { useClientesStore } from 'src/stores/clientes'
import { storeToRefs } from 'pinia'

const formatoMoneda = ref(new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }))

export default {
  setup () {
    const modalVenta = ref(false)
    const total = ref(0)

    const useVentas = useVentasStore()
    const { venta } = storeToRefs(useVentas)

    const useClientes = useClientesStore()
    const { obtenerClienteId } = useClientes

    const abrir = () => {
      modalVenta.value = true
      sumarTotalVenta()
    }
    const sumarTotalVenta = () => {
      const totalVenta = venta?.value?.productos.reduce((suma, producto) => producto.total + suma, 0)
      total.value = totalVenta
    }
    return {
      // estados
      modalVenta,
      venta,
      total,
      formatoMoneda,
      // metodos
      abrir,
      sumarTotalVenta,
      obtenerClienteId

    }
  }
}

</script>
<style scoped>
table {
  font-size: 16px;
}
.tabla-venta tr th {
  padding: 5px;
}
.venta-datos td {
  text-align: center;
}
</style>
