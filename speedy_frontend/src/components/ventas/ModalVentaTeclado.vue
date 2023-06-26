<template>
    <q-dialog v-model="modalVentas">
      <q-card class="full-width">
        <q-card-section class="bg-primary text-white">
          <q-btn icon="close" flat round dense v-close-popup />
          <div class="text-h4 text-center ">
            Registrar nueva venta
            <q-separator />
          </div>
        </q-card-section>

        <div class="row q-my-sm">
          <q-card-section class="col-6 q-pt-none">
            <label>Cliente</label>
            <q-select outlined v-model="ventaObj.clienteId" use-input input-debounce="0" label="Selecciona el cliente"
              :options="clientesNuevos" @filter="parametrosFiltradosClientes" behavior="menu">
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No se encontraron resultados
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </q-card-section>

          <q-card-section class="col-6 q-pt-none">
            <label>Productos</label>
            <q-select outlined v-model="ventaObj.productos" use-input use-chips multiple label="Selecciona un producto"
              input-debounce="0" @new-value="createValue" :options="productosNuevos" @filter="filterFn"
              style="width: 250px">
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
        <div class="row q-my-sm">
          <q-card-section class="col-12 q-pt-none">
            <label>Fecha de compra</label>
            <q-input outlined type="date" v-model="ventaObj.fecha" label="Fecha de compra" />

          </q-card-section>
        </div>

        <div class="q-pa-md">
          <q-table v-if="ventaObj?.productos.length > 0" :rows="ventaObj?.productos" :columns="columns" row-key="name">
            <template v-slot:body-cell-acciones="props">
              <q-td>
                <q-btn @click="aumentarCantidadProducto(props.row)" flat color="dark" icon="add">
                  <q-tooltip>Aumentar cantidad de producto </q-tooltip>
                </q-btn>
                <q-btn @click="disminuirCantidadProducto(props.row)" flat color="negative" icon="horizontal_rule">
                  <q-tooltip>Disminuir la cantidad de productos</q-tooltip>
                </q-btn>
              </q-td>
            </template>
          </q-table>
        </div>

        <div class="row q-my-sm">
          <q-card-section class="col-6 q-pt-none">
            <p class="text-h4">{{ `Total: $${sumarTotal(ventaObj?.productos || [])}` }}</p>
          </q-card-section>
        </div>
        <q-card-actions align="right">
          <q-btn label="Guardar venta" @click="guardarVenta" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </template>

<script>
import { ref, reactive, computed } from 'vue'
import { useClientesStore } from 'src/stores/clientes'
import { useProductosStore } from 'src/stores/productos'
import { useVentasStore } from 'src/stores/ventas'
import { editarRegistros } from 'src/helpers/editarRegistros'
import { storeToRefs } from 'pinia'
import { filtradoBusquedaObj } from 'src/helpers/filtradoBusquedaObj'

export default {
  setup () {
    const modalVentas = ref(false)
    const ventaObj = reactive({
      clienteId: null,
      productos: [],
      total: 0,
      fecha: '',
      cashback: 0.0

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
    const useProductos = useProductosStore()
    // const { guardarProductos } = useProductos
    const { productos } = storeToRefs(useProductos)

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
    const productosOpciones = ref(
      productos.value.map(producto => {
        return {
          id: producto._id,
          label: producto.nombreProducto,
          children: producto.nombreProducto,
          precio: producto.precio,
          cantidad: 1,
          total: producto.precio
        }
      })
    )
    const clientesNuevos = ref(clientesOpciones.value)
    const productosNuevos = ref(productosOpciones.value)
    const abrir = (esNuevoRegistro) => {
      const ventaNueva = {
        clienteId: null,
        productos: [],
        total: 0,
        fecha: '',
        cashback: 0.0
      }

      if (nuevoRegistro.value && ventaObj.productos.length > 0) {
        // limpiar el estado
        for (const producto of ventaObj.productos) {
          producto.cantidad = 1
          producto.total = producto.precio
        }
      }
      if (!esNuevoRegistro) {
        ventaNueva._id = null
      }
      Object.keys(venta.value || ventaObj).forEach(key => {
        ventaObj[key] = editarRegistros(ventaNueva, venta.value, esNuevoRegistro)[key]
      })

      modalVentas.value = true
      nuevoRegistro.value = esNuevoRegistro
    }
    const parametrosFiltradosClientes = (val, update) => {
      filtradoBusquedaObj(val, update, clientesOpciones.value, clientesNuevos)
    }
    const guardarVenta = () => {
      ventaObj.cashback = ventaObj.total * 0.05
      if (nuevoRegistro.value) {
        const ventaNueva = { ...ventaObj }
        ventaNueva.clienteId = ventaNueva?.clienteId?.value
        guardarVentas(ventaNueva)
      } else {
        editarVentas(ventaObj)
      }
    }
    const createValue = (val, done) => {
      if (val.length > 2) {
        if (!productosOpciones.value.includes(val)) {
          done(val, 'add-unique')
        }
      }
    }

    const filterFn = (val, update) => {
      update(() => {
        if (val === '') {
          productosNuevos.value = productosOpciones.value
        } else {
          const needle = val.toLowerCase()
          productosNuevos.value = productosOpciones.value.filter(v => v.label.toLowerCase().indexOf(needle) > -1)
        }
      })
    }
    const sumarTotal = (productos) => {
      ventaObj.total = productos.reduce((suma, producto) => suma + parseFloat(producto.total), 0)
      return ventaObj.total
    }

    const aumentarCantidadProducto = (producto) => {
      const productoOriginal = { ...producto }
      const precioBase = parseFloat(productoOriginal.precio)
      producto.cantidad++
      producto.total = precioBase * producto.cantidad
    }
    const disminuirCantidadProducto = (producto) => {
      if (producto.cantidad <= 1) return
      const productoOriginal = { ...producto }
      const precioBase = parseFloat(productoOriginal.precio)
      producto.cantidad--
      producto.total = precioBase * producto.cantidad
    }

    return {
      // estados
      modalVentas,
      ventaObj,
      clientesNuevos,
      productosNuevos,
      columns,
      // metodos
      abrir,
      guardarVenta,
      parametrosFiltradosClientes,
      createValue,
      filterFn,
      sumarTotal,
      aumentarCantidadProducto,
      disminuirCantidadProducto

    }
  }
}

</script>
