import { defineStore, storeToRefs } from 'pinia'
import { ref } from 'vue'
import { api } from 'src/boot/axios'
import { useClientesStore } from './clientes'
import { mensajeUsuario } from 'src/helpers/mensajes'

export const useVentasStore = defineStore('ventas', () => {
  const ventas = ref([])
  const venta = ref(null)
  const ventaDia = ref(null)
  const ventasCliente = ref(null)
  const ventasClienteId = ref([])
  // guardar productos
  const guardarVentas = async (venta) => {
    try {
      const { data } = await api.post('/ventas', venta)
      ventas.value = [data, ...ventas.value]
      mensajeUsuario('positive', 'Se Registro la venta de manera correcta')
    } catch (error) {
      mensajeUsuario('negative', `${error?.response?.data?.msg}`)
    }
  }

  // obtener productos
  const obtenerVentas = async () => {
    try {
      const { data } = await api.get('/ventas')
      ventas.value = data
    } catch (error) {
      mensajeUsuario('negative', `Algo fallo al obtener las ventas, favor de reportar a soporte. ${error}`)
    }
  }
  // editar productos
  const editarVentas = async (venta) => {
    try {
      await api.put(`/ventas/${venta._id}`, venta)
      const ventaOriginal = ventas.value.find(ventaIndex => ventaIndex._id === venta._id)
      Object.assign(ventaOriginal, venta)
      mensajeUsuario('positive', 'Venta editada de manera correcta')
    } catch (error) {
      mensajeUsuario('negative', `${error?.response?.data?.msg}`)
    }
  }

  // eliminar productos
  const eliminarVentas = async (id) => {
    try {
      const { data } = await api.delete(`/ventas/${id}`)
      ventas.value = ventas.value.filter(venta => venta._id !== id)
      mensajeUsuario('positive', `${data?.msg} de manera correcta`)
    } catch (error) {
      mensajeUsuario('negative', `${error?.response?.data?.msg}`)
    }
  }

  const obtenerVentasCliente = async (id) => {
    try {
      const { data } = await api.get(`/ventas/ventasCliente/${id}`)
      ventasCliente.value = data
    } catch (error) {
      mensajeUsuario('negative', `Algo fallo al obtener las ventas del cliente, favor de reportar a soporte. ${error}`)
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
  const obtenerVentasClienteId = async (id) => {
    try {
      const { data } = await api.get(`/ventas/ventasClienteId/${id}`)
      ventasClienteId.value = data
    } catch (error) {
      mensajeUsuario('negative', `Algo fallo al obtener las ventas del cliente, favor de reportar a soporte. ${error}`)
    }
  }
  const obtenerVentaDia = async () => {
    try {
      const { data } = await api.get('/ventas/ventasDia')
      ventaDia.value = data
    } catch (error) {
      mensajeUsuario('negative', `Algo fallo al obtener las ventas por dia, favor de reportar a soporte. ${error}`)
    }
  }
  return {
    // states
    ventas,
    venta,
    ventasCliente,
    ventasClienteId,
    // metodos
    guardarVentas,
    editarVentas,
    eliminarVentas,
    obtenerVentasId,
    obtenerVentas,
    obtenerClienteVenta,
    obtenerVentaDia,
    ventaDia,
    obtenerVentasCliente,
    obtenerVentasClienteId
  }
})
