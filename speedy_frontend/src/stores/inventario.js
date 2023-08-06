import { defineStore, storeToRefs } from 'pinia'
import { ref } from 'vue'
import { api } from 'src/boot/axios'
import { useProductosStore } from './productos'
import { mensajeUsuario } from 'src/helpers/mensajes'

export const useInventariosStore = defineStore('inventarios', () => {
  const inventarios = ref([])
  const inventario = ref(null)
  const nuevoRegistro = ref(false)
  const busquedaCodigoBarras = ref('')

  const useProducto = useProductosStore()
  const { productos } = storeToRefs(useProducto)

  const guardarInventarios = async (inventario) => {
    try {
      const { data } = await api.post('/inventario', inventario)
      inventarios.value = [data, ...inventarios.value]
      mensajeUsuario('positive', `Producto ${data?.nombreProducto} agregado al inventario de manera correcta`)
    } catch (error) {
      mensajeUsuario('negative', `${error?.response?.data?.msg}`)
    }
  }
  const obtenerInventarios = async () => {
    try {
      const { data } = await api.get('/inventario')
      inventarios.value = data
    } catch (error) {
      mensajeUsuario('negative', `Algo fallo al obtener el inventario favor de reportar a soporte. ${error}`)
    }
  }
  const buscarProductoCodigo = (codigoBarras) => {
    inventario.value = productos.value.find(producto => producto.codigoBarras === codigoBarras)
    nuevoRegistro.value = true
  }
  const buscarInventario = (codigoBarras) => {
    inventario.value = inventarios.value.find(inventario => inventario.codigoBarras === codigoBarras)
    nuevoRegistro.value = false
    busquedaCodigoBarras.value = inventario.value.codigoBarras
  }
  const editarInventario = async (inventario) => {
    try {
      const { data } = await api.put(`/inventario/${inventario.codigoBarras}`, inventario)
      const inventarioOriginal = inventarios.value.find(inventarioIndex => inventarioIndex.codigoBarras === inventario.codigoBarras)
      Object.assign(inventarioOriginal, inventario)
      mensajeUsuario('positive', `Producto del inventario ${data?.nombreProducto} editado de manera correcta`)
    } catch (error) {
      mensajeUsuario('negative', `${error?.response?.data?.msg}`)
    }
  }
  const eliminarInventario = async (id) => {
    try {
      const { data } = await api.delete(`/inventario/${id}`)
      inventarios.value = inventarios.value.filter(inventario => inventario._id !== id)
      mensajeUsuario('positive', `Producto del ${data?.msg} de manera correcta`)
    } catch (error) {
      mensajeUsuario('negative', `${error?.response?.data?.msg}`)
    }
  }
  const actualizarCantidadInventario = async (inventario) => {
    try {
      for (const inventarioCodigoBarras of inventario.productos) {
        const inventarioOriginal = inventarios.value.find(inventarioIndex => inventarioIndex.codigoBarras === inventarioCodigoBarras.codigoBarras)
        const restaInventario = inventarioOriginal.cantidad - inventarioCodigoBarras.cantidad
        inventarioOriginal.cantidad = restaInventario
        await api.put(`/inventario/${inventarioOriginal.codigoBarras}`, inventarioOriginal)
        mensajeUsuario('positive', `Se actualizo la cantidad del producto ${inventarioOriginal.nombreProducto} en el inventario`)
      }
    } catch (error) {
      mensajeUsuario('negative', `${error?.response?.data?.msg}`)
    }
  }
  return {
    // states
    inventarios,
    inventario,
    nuevoRegistro,
    busquedaCodigoBarras,
    // metodos
    guardarInventarios,
    buscarProductoCodigo,
    obtenerInventarios,
    buscarInventario,
    editarInventario,
    eliminarInventario,
    actualizarCantidadInventario
  }
})
