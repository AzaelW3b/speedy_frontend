<template>
  <q-dialog persistent v-model="modalVentas">
    <q-card class="full-width">
      <q-card-section class="bg-primary text-white">
        <q-btn icon="close" flat round dense v-close-popup />
        <div class="text-h4 text-center ">
          Registrar nueva venta
          <q-separator />
        </div>
      </q-card-section>
      <q-card flat bordered class="my-card" v-if="cliente">

      <q-card-section class="q-pt-md text-h4">
       <b>Socio: </b>{{ cliente?.nombreCliente }}
      </q-card-section>

      <q-separator inset />

      <q-card-section class="text-h4">
        <b>Tipo de membresia: </b>{{`${cliente?.tipoMembresia}` }}
      </q-card-section>
    </q-card>
    <q-card flat bordered class="my-card" v-else>
      <q-card-section>
        <div class="text-h4 text-center"> Captura o vuelve capturar la membresia del Socio </div>
      </q-card-section>
    </q-card>

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
        <q-btn label="Cancelar Venta" @click="limpiarEstadoProductos"  v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { ref, reactive, computed } from 'vue'
import { useClientesStore } from 'src/stores/clientes'
import { useProductosStore } from 'src/stores/productos'
import { useVentasStore } from 'src/stores/ventas'
import { useInventariosStore } from 'src/stores/inventario'
import { storeToRefs } from 'pinia'
import { filtradoBusquedaObj } from 'src/helpers/filtradoBusquedaObj'

export default {
  setup () {
    const modalVentas = ref(false)
    const generandoNuevaVenta = ref(false)
    const cliente = ref(null)
    const informacionInventario = ref(null)
    const ventaObj = reactive({
      clienteId: null,
      productos: [],
      total: 0,
      cashback: 0.0

    })
    const nuevoRegistro = ref(true)

    const columns = [
      {
        name: 'nombreProducto',
        label: 'Producto',
        field: 'nombreProducto',
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
    const { guardarVentas, editarVentas, obtenerVentaDia } = useVentas
    const useProductos = useProductosStore()
    const { productos, productoVenta } = storeToRefs(useProductos)

    const useClientes = useClientesStore()
    const { clientes } = storeToRefs(useClientes)

    const useInventario = useInventariosStore()
    const { actualizarCantidadInventario } = useInventario
    const { inventarios } = storeToRefs(useInventario)

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

    const abrir = (informacion) => {
      modalVentas.value = true
      const { abrir, codigo } = informacion

      let clienteEncontrado = null
      let productoEncontrado = null
      // evaluación si es un código de barras de la membresia
      if (codigo.includes('S')) {
        clienteEncontrado = clientes.value.find(cliente => cliente.folio === codigo)
      } else {
        productoEncontrado = productos.value.find(producto => producto.codigoBarras === codigo)
      }
      cliente.value = clienteEncontrado
      const ventaNueva = {
        ...productoEncontrado,
        cantidad: 1,
        total: productoEncontrado?.precio
      }

      const productoExiste = ventaObj?.productos?.findIndex(producto => producto.codigoBarras === ventaNueva.codigoBarras)

      if (productoExiste !== -1) {
        for (const venta of ventaObj?.productos) {
          if (venta.codigoBarras === ventaNueva.codigoBarras) {
            const precioBase = parseFloat(venta.precio)
            venta.cantidad++
            venta.total = precioBase * venta.cantidad
          }
        }
      } else {
        if (ventaNueva.total === undefined) return
        ventaObj.productos = [...ventaObj.productos, ventaNueva]
      }

      generandoNuevaVenta.value = true
      nuevoRegistro.value = abrir
      informacionInventario.value = inventarios.value.find(inventario => inventario.codigoBarras === ventaNueva.codigoBarras)
      console.log(informacionInventario)
    }
    const parametrosFiltradosClientes = (val, update) => {
      filtradoBusquedaObj(val, update, clientesOpciones.value, clientesNuevos)
    }
    const guardarVenta = () => {
      ventaObj.cashback = ventaObj.total * 0.05
      if (nuevoRegistro.value) {
        const ventaNueva = { ...ventaObj }
        ventaNueva.clienteId = cliente.value._id
        guardarVentas(ventaNueva)
        actualizarCantidadInventario(ventaNueva)
        generandoNuevaVenta.value = false
        limpiarEstadoProductos()
      } else {
        editarVentas(ventaObj)
      }
      obtenerVentaDia()
    }
    const limpiarEstadoProductos = () => {
      ventaObj.productos = []
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
      productoVenta,
      limpiarEstadoProductos,
      cliente,
      // metodos
      abrir,
      guardarVenta,
      parametrosFiltradosClientes,
      createValue,
      filterFn,
      sumarTotal,
      aumentarCantidadProducto,
      obtenerVentaDia,
      disminuirCantidadProducto

    }
  }
}

</script>
