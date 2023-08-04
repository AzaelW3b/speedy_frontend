import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from 'src/boot/axios'

export const useCategoriasStore = defineStore('categorias', () => {
  const categorias = ref([])
  const categoria = ref(null)

  // guardar categorias
  const guardarCategorias = async (categoria) => {
    try {
      const { data } = await api.post('/categorias', categoria)
      categorias.value = [...categorias.value, data]
    } catch (error) {
      console.log(error.response.data.msg)
    }
  }
  // obtener categorias
  const obtenerCategorias = async () => {
    try {
      const { data } = await api.get('/categorias')
      categorias.value = data
    } catch (error) {
      console.log(error)
    }
  }

  // editar categorias
  const editarCategorias = async (categoria) => {
    try {
      const { data } = await api.put(`/categorias/${categoria._id}`, categoria)
      const categoriaOriginal = categorias.value.find(categoriaIndex => categoriaIndex._id === categoria._id)
      Object.assign(categoriaOriginal, categoria)
      console.log(data)
    } catch (error) {
      console.log(error.response.data.msg)
    }
  }
  // eliminar categorias
  const eliminarCategorias = async (id) => {
    try {
      const { data } = await api.delete(`/categorias/${id}`)
      console.log(data)
      categorias.value = categorias.value.filter(categoria => categoria._id !== id)
    } catch (error) {
      console.log(error.response.data.msg)
    }
  }
  // obtener categorias por id
  const obtenerCategoriasId = (id) => {
    categoria.value = categorias.value.find(categoria => categoria._id === id)
  }
  return {
    // states
    categorias,
    categoria,
    // metodos
    guardarCategorias,
    obtenerCategorias,
    editarCategorias,
    eliminarCategorias,
    obtenerCategoriasId
  }
})
