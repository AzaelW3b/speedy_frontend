import { defineStore, storeToRefs } from 'pinia'
import { ref } from 'vue'
import { api } from 'src/boot/axios'
import { useClientesStore } from './clientes'

export const useVentasStore = defineStore('ventas', () => {
  const ventas = ref([])
  const venta = ref(null)

  // guardar productos
  const guardarVentas = async (venta) => {
    try {
      const { data } = await api.post('/ventas', venta)
      ventas.value = [...ventas.value, data]
    } catch (error) {
      console.log(error.response.data.msg)
    }
  }
  // obtener productos
  const obtenerVentas = async () => {
    try {
      const { data } = await api.get('/ventas')
      ventas.value = data
    } catch (error) {
      console.log(error.response.data.msg)
    }
  }
  // editar productos
  const editarVentas = async (venta) => {
    try {
      const { data } = await api.put(`/ventas/${venta._id}`, venta)
      const ventaOriginal = ventas.value.find(ventaIndex => ventaIndex._id === venta._id)
      Object.assign(ventaOriginal, venta)
      console.log(data)
    } catch (error) {
      console.log(error.response.data.msg)
    }
  }

  // eliminar productos
  const eliminarVentas = async (id) => {
    try {
      const { data } = await api.delete(`/ventas/${id}`)
      ventas.value = ventas.value.filter(venta => venta._id !== id)
      console.log(data)
    } catch (error) {
      console.log(error)
    }
  }

  // obtener productos Id
  const obtenerVentasId = (id) => {
    venta.value = ventas.value.find(venta => venta._id === id)
  }

  // obtener cliente por Id
  const obtenerClienteVenta = (id) => {
    const useCliente = useClientesStore()
    const { clientes } = storeToRefs(useCliente)
    const cliente = clientes.value.find(cliente => cliente._id === id)
    return cliente?.nombreCliente
  }
  return {
    // states
    ventas,
    venta,
    // metodos
    guardarVentas,
    editarVentas,
    eliminarVentas,
    obtenerVentasId,
    obtenerVentas,
    obtenerClienteVenta
  }
})
