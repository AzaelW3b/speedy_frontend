import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from 'src/boot/axios'
import { mensajeUsuario } from 'src/helpers/mensajes'

export const useProductosStore = defineStore('productos', () => {
  const productos = ref([])
  const producto = ref(null)
  const productoVenta = ref(null)

  // guardar productos
  const guardarProductos = async (producto) => {
    try {
      const { data } = await api.post('/productos', producto)
      productos.value = [data, ...productos.value]
      mensajeUsuario('positive', `Producto ${data?.nombreProducto} creado de manera correcta`)
    } catch (error) {
      mensajeUsuario('negative', `${error?.response?.data?.msg}`)
    }
  }
  // obtener productos
  const obtenerProductos = async () => {
    try {
      const { data } = await api.get('/productos')
      productos.value = data
    } catch (error) {
      mensajeUsuario('negative', `Algo fallo al obtener el inventario favor de reportar a soporte. ${error}`)
    }
  }
  // editar productos
  const editarProductos = async (producto) => {
    try {
      console.log(producto)
      const { data } = await api.put(`/productos/${producto._id}`, producto)
      const productoOriginal = productos.value.find(productoIndex => productoIndex._id === producto._id)
      Object.assign(productoOriginal, producto)
      mensajeUsuario('positive', `Producto ${data?.nombreProducto} editado de manera correcta`)
    } catch (error) {
      mensajeUsuario('negative', `${error?.response?.data?.msg}`)
    }
  }

  // eliminar productos
  const eliminarProductos = async (id) => {
    try {
      const { data } = await api.delete(`/productos/${id}`)
      productos.value = productos.value.filter(producto => producto._id !== id)
      mensajeUsuario('positive', `${data?.msg} de manera correcta`)
    } catch (error) {
      mensajeUsuario('negative', `${error?.response?.data?.msg}`)
    }
  }

  // obtener productos Id
  const obtenerProductosId = (id) => {
    producto.value = productos.value.find(producto => producto._id === id)
  }

  // buscar producto por código de barras
  const buscarProductoCodigo = (codigo) => {
    productoVenta.value = productos.value.find(producto => producto.codigoBarras === codigo)
  }
  return {
    // states
    productos,
    producto,
    productoVenta,
    // metodos
    guardarProductos,
    editarProductos,
    eliminarProductos,
    obtenerProductosId,
    obtenerProductos,
    buscarProductoCodigo
  }
})
