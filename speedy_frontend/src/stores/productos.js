import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useProductosStore = defineStore('productos', () => {
  const productos = ref([])
  const producto = ref(null)

  // guardar productos
  const guardarProductos = (producto) => {
    productos.value = [...productos.value, producto]
  }
  // obtener productos

  // editar productos
  const editarProductos = (producto) => {
    const productoOriginal = productos.value.find(productoIndex => productoIndex._id === producto._id)
    Object.assign(productoOriginal, producto)
  }

  // eliminar productos
  const eliminarProductos = (id) => {
    productos.value = productos.value.filter(producto => producto._id !== id)
  }

  // obtener productos Id
  const obtenerProductosId = (id) => {
    producto.value = productos.value.find(producto => producto._id === id)
  }
  return {
    // states
    productos,
    producto,
    // metodos
    guardarProductos,
    editarProductos,
    eliminarProductos,
    obtenerProductosId
  }
})
