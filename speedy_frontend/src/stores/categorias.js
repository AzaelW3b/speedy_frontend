import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCategoriasStore = defineStore('categorias', () => {
  const categorias = ref([])
  const categoria = ref(null)

  // guardar categorias
  const guardarCategorias = (categoria) => {
    categorias.value = [...categorias.value, categoria]
  }
  // obtener categorias

  // editar categorias
  const editarCategorias = (categoria) => {
    const categoriaOriginal = categorias.value.find(categoriaIndex => categoriaIndex._id === categoria._id)
    Object.assign(categoriaOriginal, categoria)
  }
  // eliminar categorias
  const eliminarCategorias = (id) => {
    categorias.value = categorias.value.filter(categoria => categoria._id !== id)
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
    editarCategorias,
    eliminarCategorias,
    obtenerCategoriasId
  }
})
