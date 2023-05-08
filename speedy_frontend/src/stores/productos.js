import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from 'src/boot/axios'

export const useProductosStore = defineStore('productos', () => {
  const productos = ref([])
  const producto = ref(null)

  // guardar productos
  const guardarProductos = async (producto) => {
    try {
      const { data } = await api.post('/productos', producto)
      productos.value = [...productos.value, data]
    } catch (error) {
      console.log(error.response.data.msg)
    }
  }
  // obtener productos
  const obtenerProductos = async () => {
    try {
      const { data } = await api.get('/productos')
      productos.value = data
    } catch (error) {
      console.log(error)
    }
  }
  // editar productos
  const editarProductos = async (producto) => {
    try {
      const { data } = await api.put(`/productos/${producto._id}`, producto)
      const productoOriginal = productos.value.find(productoIndex => productoIndex._id === producto._id)
      Object.assign(productoOriginal, producto)
      console.log(data)
    } catch (error) {
      console.log(error.response.data.msg)
    }
  }

  // eliminar productos
  const eliminarProductos = async (id) => {
    try {
      const { data } = await api.delete(`/productos/${id}`)
      productos.value = productos.value.filter(producto => producto._id !== id)
      console.log(data)
    } catch (error) {
      console.log(error.response.data.msg)
    }
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
    obtenerProductosId,
    obtenerProductos
  }
})
