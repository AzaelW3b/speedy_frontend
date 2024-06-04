<template>
  <q-dialog persistent v-model="modalRegistroCompraCliente">
    <q-card class="full-width">
      <q-card-section class="bg-primary text-white">
        <q-btn icon="close" flat round dense v-close-popup />
        <div class="text-h4 text-center ">
          Registrar nueva compra del cliente
          <q-separator />
        </div>
      </q-card-section>

      <div class="row q-my-sm">
        <q-card-section class="col-12 q-pt-none">
          <label>Cliente</label>
          <q-select outlined v-model="ventaRegistroCompraObj.clienteId" use-input input-debounce="0"
            label="Selecciona el cliente" :options="clientesNuevos" @filter="parametrosFiltradosClientes"
            behavior="menu">
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  No se encontraron resultados
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </q-card-section>
      </div>

      <div v-if="clienteSeleccionado" class="row q-my-sm">
        <q-card-section class="col-6 q-pt-none">
          <label>Tipo de membresia</label>
          <q-input readonly disabled v-model="ventaRegistroCompraObj.tipoMembresia" type="text"
            label="Ingresa el precio" outlined />
        </q-card-section>
        <q-card-section class="col-6 q-pt-none">
          <label>Nivel</label>
          <q-input readonly disabled v-model="ventaRegistroCompraObj.nivel" type="text"
            label="Ingresa el tipo de membresia" outlined />
        </q-card-section>
      </div>
      <div v-if="clienteSeleccionado" class="row q-my-sm">
        <q-card-section class="col-6 q-pt-none">
          <label>Total de compra</label>
          <q-input v-model="ventaRegistroCompraObj.totalCompra" type="number" label="Ingresa el precio" outlined />
        </q-card-section>

        <q-card-section class="col-6 q-pt-none">
          <label>Bono Residual</label>
          <q-input v-model="ventaRegistroCompraObj.cashback" type="number" label="Ingresa el precio" outlined />
        </q-card-section>
      </div>

      <q-card-actions align="right">
        <q-btn label="Guardar venta" @click="guardarVenta" color="primary" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { ref, reactive, computed, watch } from 'vue'
import { useClientesStore } from 'src/stores/clientes'
import { useVentasStore } from 'src/stores/ventas'
import { editarRegistros } from 'src/helpers/editarRegistros'
import { storeToRefs } from 'pinia'
import { filtradoBusquedaObj } from 'src/helpers/filtradoBusquedaObj'
import { formatearFecha } from '../../helpers/formatearFecha'

export default {
  setup () {
    const modalRegistroCompraCliente = ref(false)
    const clienteSeleccionado = ref(false)
    const ventaRegistroCompraObj = reactive({
      clienteId: null,
      tipoMembresia: '',
      nivel: 0,
      cashback: 0.0,
      totalCompra: 0

    })
    const nuevoRegistro = ref(true)

    const columns = [
      {
        name: 'label',
        label: 'Producto',
        field: 'label',
        align: 'left',
        sortable: true
      },
      {
        name: 'cantidad',
        label: 'cantidad',
        field: 'cantidad',
        align: 'left',
        sortable: true
      },
      {
        name: 'precio',
        label: 'Precio',
        field: 'precio',
        align: 'left',
        sortable: true
      },
      {
        name: 'total',
        label: 'Total',
        field: 'total',
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

    const useVentas = useVentasStore()
    const { guardarVentas, editarVentas } = useVentas
    const { venta } = storeToRefs(useVentas)

    const useClientes = useClientesStore()
    const { clientes } = storeToRefs(useClientes)

    const clientesOpciones = computed(() => {
      return clientes.value.map(cliente => {
        return {
          id: cliente._id,
          label: cliente.nombreCliente,
          value: cliente._id
        }
      })
    })

    const clientesNuevos = ref(clientesOpciones.value)
    const abrir = (esNuevoRegistro) => {
      const ventaNueva = {
        clienteId: null,
        tipoMembresia: '',
        nivel: 0,
        cashback: 0.0,
        totalCompra: 0
      }
      if (!esNuevoRegistro) {
        ventaNueva._id = null
      }
      Object.keys(venta.value || ventaRegistroCompraObj).forEach(key => {
        ventaRegistroCompraObj[key] = editarRegistros(ventaNueva, venta.value, esNuevoRegistro)[key]
      })

      modalRegistroCompraCliente.value = true
      nuevoRegistro.value = esNuevoRegistro
    }

    const parametrosFiltradosClientes = (val, update) => {
      filtradoBusquedaObj(val, update, clientesOpciones.value, clientesNuevos)
    }
    const guardarVenta = () => {
      if (nuevoRegistro.value) {
        const ventaNueva = { ...ventaRegistroCompraObj }
        ventaNueva.clienteId = ventaNueva?.clienteId?.value
        console.log('la venta antes de guardar en la bd', ventaNueva)
        guardarVentas(ventaNueva)
      } else {
        editarVentas(ventaRegistroCompraObj)
      }
    }

    watch(ventaRegistroCompraObj, newValue => {
      if (newValue.clienteId !== null) {
        clienteSeleccionado.value = true
        const cliente = clientes?.value?.find(clienteIndex => clienteIndex._id === newValue?.clienteId.id)
        if (cliente === undefined || cliente === null) return
        // evaluación del nivel
        let BONO_RESIDUAL = 0
        switch (cliente.niveles > 0) {
          case cliente.tipoMembresia === 'A':
            if (cliente.niveles === 1) {
              BONO_RESIDUAL = ventaRegistroCompraObj.totalCompra * 0.03
            }
            if (cliente.niveles === 2) {
              BONO_RESIDUAL = ventaRegistroCompraObj.totalCompra * 0.03
            }
            if (cliente.niveles === 3) {
              BONO_RESIDUAL = ventaRegistroCompraObj.totalCompra * 0.08
            }
            break
          case cliente.tipoMembresia === 'B':
            if (cliente.niveles === 1) {
              BONO_RESIDUAL = ventaRegistroCompraObj.totalCompra * 0.04
            }
            if (cliente.niveles === 2) {
              BONO_RESIDUAL = ventaRegistroCompraObj.totalCompra * 0.04
            }
            if (cliente.niveles === 3) {
              BONO_RESIDUAL = ventaRegistroCompraObj.totalCompra * 0.09
            }
            break
          case cliente.tipoMembresia === 'C':
            if (cliente.niveles === 1) {
              BONO_RESIDUAL = ventaRegistroCompraObj.totalCompra * 0.05
            }
            if (cliente.niveles === 2) {
              BONO_RESIDUAL = ventaRegistroCompraObj.totalCompra * 0.05
            }
            if (cliente.niveles === 3) {
              BONO_RESIDUAL = ventaRegistroCompraObj.totalCompra * 0.10
            }
            break
        }
        ventaRegistroCompraObj.tipoMembresia = cliente.tipoMembresia
        ventaRegistroCompraObj.nivel = cliente.niveles
        ventaRegistroCompraObj.cashback = BONO_RESIDUAL
      } else {
        clienteSeleccionado.value = false
        ventaRegistroCompraObj.totalCompra = 0
      }
    })

    return {
      // estados
      modalRegistroCompraCliente,
      ventaRegistroCompraObj,
      clientesNuevos,
      columns,
      clienteSeleccionado,
      // metodos
      abrir,
      guardarVenta,
      parametrosFiltradosClientes
    }
  }
}

</script>
