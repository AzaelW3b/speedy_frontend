import { defineStore, storeToRefs } from 'pinia'
import { ref } from 'vue'
import { api } from 'src/boot/axios'
import { useProductosStore } from './productos'

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
      inventarios.value = [...inventarios.value, data]
      console.log(data)
    } catch (error) {
      console.log(error)
    }
  }
  const obtenerInventarios = async () => {
    try {
      const { data } = await api.get('/inventario')
      inventarios.value = data
    } catch (error) {
      console.log(error)
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
    console.log(inventario.value)
  }
  const editarInventario = async (inventario) => {
    try {
      const { data } = await api.put(`/inventario/${inventario.codigoBarras}`, inventario)
      const inventarioOriginal = inventarios.value.find(inventarioIndex => inventarioIndex.codigoBarras === inventario.codigoBarras)
      Object.assign(inventarioOriginal, inventario)
      console.log(data)
    } catch (error) {
      console.log(error.response.data.msg)
    }
  }
  const eliminarInventario = async (id) => {
    try {
      const { data } = await api.delete(`/inventario/${id}`)
      inventarios.value = inventarios.value.filter(inventario => inventario._id !== id)
      console.log(data)
    } catch (error) {
      console.log(error.response.data.msg)
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
    eliminarInventario
  }
})
