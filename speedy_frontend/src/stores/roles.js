import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from 'src/boot/axios'
import { mensajeUsuario } from 'src/helpers/mensajes'

export const useRolesStore = defineStore('roles', () => {
  const roles = ref([])
  const rol = ref(null)

  // guardar roles
  const guardarRoles = async (rol) => {
    try {
      const { data } = await api.post('/roles', rol)
      roles.value = [data, ...roles.value]
      mensajeUsuario('positive', `Rol ${data?.rol} creado de manera correcta.`)
    } catch (error) {
      console.log(error.response.data.msg)
    }
  }
  // obtener roles
  const obtenerRoles = async () => {
    try {
      const { data } = await api.get('/roles')
      roles.value = data
    } catch (error) {
      console.log(error.response.data.msg)
    }
  }
  // editar roles
  const editarRoles = async (rol) => {
    try {
      const { data } = await api.put(`/roles/${rol._id}`, rol)
      const rolOriginal = roles.value.find(rolIndex => rolIndex._id === rol._id)
      Object.assign(rolOriginal, rol)
      mensajeUsuario('positive', `${data?.msg} de manera correcta`)
    } catch (error) {
      console.log(error.response.data.msg)
    }
  }
  // eliminar roles
  const eliminarRoles = async (id) => {
    try {
      const { data } = await api.delete(`/roles/${id}`)
      roles.value = roles.value.filter(rol => rol._id !== id)
      mensajeUsuario('positive', `${data?.msg} de manera correcta`)
    } catch (error) {
      console.log(error.response.data.msg)
    }
  }

  const obtenerRolesId = (id) => {
    rol.value = roles.value.find(rol => rol._id === id)
  }
  return {
    // states
    roles,
    rol,
    // metodos
    guardarRoles,
    editarRoles,
    eliminarRoles,
    obtenerRolesId,
    obtenerRoles

  }
})
