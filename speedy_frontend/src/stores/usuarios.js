import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from 'src/boot/axios'

export const useUsuariosStore = defineStore('usuarios', () => {
  const usuarios = ref([])
  const usuario = ref(null)

  // guardar usuarios
  const guardarUsuarios = async (usuario) => {
    try {
      const { data } = await api.post('/usuarios', usuario)
      usuarios.value = [...usuarios.value, data]
    } catch (error) {
      console.log(error)
    }
  }
  // obtener usuarios
  const obtenerUsuarios = async () => {
    try {
      const { data } = await api.get('/usuarios')
      usuarios.value = data
    } catch (error) {
      console.log(error)
    }
  }
  // editar usuarios
  const editarUsuarios = async (usuario) => {
    try {
      const { data } = await api.put(`/usuarios/${usuario._id}`, usuario)
      const usuarioOriginal = usuarios.value.find(usuarioIndex => usuarioIndex._id === usuario._id)
      Object.assign(usuarioOriginal, usuario)
      console.log(data)
    } catch (error) {
      console.log(error)
    }
  }
  // eliminar usuarios
  const eliminarUsuarios = async (id) => {
    try {
      const { data } = await api.delete(`/usuarios/${id}`)
      console.log(data)
      usuarios.value = usuarios.value.filter(usuario => usuario._id !== id)
    } catch (error) {
      console.log(error)
    }
  }

  const obtenerUsuariosId = (id) => {
    usuario.value = usuarios.value.find(usuario => usuario._id === id)
  }

  // obtener usuarios por id
  return {
    // states
    usuarios,
    usuario,
    // metodos
    guardarUsuarios,
    obtenerUsuarios,
    editarUsuarios,
    eliminarUsuarios,
    obtenerUsuariosId

  }
})
