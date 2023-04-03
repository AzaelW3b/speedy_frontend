import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUsuariosStore = defineStore('usuarios', () => {
  const usuarios = ref([])
  const usuario = ref(null)

  // guardar usuarios
  const guardarUsuarios = (usuario) => {
    usuarios.value = [...usuarios.value, usuario]
  }
  // obtener usuarios
  // editar usuarios
  const editarUsuarios = (usuario) => {
    const usuarioOriginal = usuarios.value.find(usuarioIndex => usuarioIndex._id === usuario._id)
    Object.assign(usuarioOriginal, usuario)
  }
  // eliminar usuarios
  const eliminarUsuarios = (id) => {
    usuarios.value = usuarios.value.filter(usuario => usuario._id !== id)
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
    editarUsuarios,
    eliminarUsuarios,
    obtenerUsuariosId

  }
})
