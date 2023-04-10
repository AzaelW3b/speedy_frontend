import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useVentasStore = defineStore('ventas', () => {
  const ventas = ref([])
  const venta = ref(null)

  // guardar productos
  const guardarVentas = (venta) => {
    ventas.value = [...ventas.value, venta]
  }
  // obtener productos

  // editar productos
  const editarVentas = (venta) => {
    const ventaOriginal = ventas.value.find(ventaIndex => ventaIndex._id === venta._id)
    Object.assign(ventaOriginal, venta)
  }

  // eliminar productos
  const eliminarVentas = (id) => {
    ventas.value = ventas.value.filter(venta => venta._id !== id)
  }

  // obtener productos Id
  const obtenerVentasId = (id) => {
    venta.value = ventas.value.find(venta => venta._id === id)
  }
  return {
    // states
    ventas,
    venta,
    // metodos
    guardarVentas,
    editarVentas,
    eliminarVentas,
    obtenerVentasId
  }
})
