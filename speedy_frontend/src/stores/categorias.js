import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from 'src/boot/axios'
import { mensajeUsuario } from 'src/helpers/mensajes'

export const useCategoriasStore = defineStore('categorias', () => {
  const categorias = ref([])
  const categoria = ref(null)

  // guardar categorias
  const guardarCategorias = async (categoria) => {
    try {
      const { data } = await api.post('/categorias', categoria)
      categorias.value = [data, ...categorias.value]
      mensajeUsuario('positive', `Categoria ${data?.nombreCategoria} creada de manera correcta`)
    } catch (error) {
      mensajeUsuario('negative', `Algo fallo en la creación de la categoria favor de reportar a soporte. ${error}`)
    }
  }
  // obtener categorias
  const obtenerCategorias = async () => {
    try {
      const { data } = await api.get('/categorias')
      categorias.value = data
    } catch (error) {
      mensajeUsuario('negative', `Algo fallo al obtener las categoria favor de reportar a soporte. ${error}`)
    }
  }

  // editar categorias
  const editarCategorias = async (categoria) => {
    try {
      const { data } = await api.put(`/categorias/${categoria._id}`, categoria)
      const categoriaOriginal = categorias.value.find(categoriaIndex => categoriaIndex._id === categoria._id)
      Object.assign(categoriaOriginal, categoria)
      mensajeUsuario('positive', `${data?.nombreCategoria} editada de manera correcta`)
    } catch (error) {
      mensajeUsuario('negative', `Algo fallo en la edición de la categoria favor de reportar a soporte. ${error}`)
    }
  }
  // eliminar categorias
  const eliminarCategorias = async (id) => {
    try {
      const { data } = await api.delete(`/categorias/${id}`)
      console.log(data)
      categorias.value = categorias.value.filter(categoria => categoria._id !== id)
      mensajeUsuario('positive', `${data?.msg} de manera correcta`)
    } catch (error) {
      mensajeUsuario('negative', `Algo fallo en la eliminación del cliente favor de reportar a soporte. ${error?.response?.data?.msg}`)
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
