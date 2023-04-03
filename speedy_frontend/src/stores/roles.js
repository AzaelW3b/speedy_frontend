import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useRolesStore = defineStore('roles', () => {
  const roles = ref([])
  const rol = ref(null)

  // guardar roles
  const guardarRoles = (rol) => {
    roles.value = [...roles.value, rol]
  }
  // obtener roles
  // editar roles
  const editarRoles = (rol) => {
    const rolOriginal = roles.value.find(rolIndex => rolIndex._id === rol._id)
    Object.assign(rolOriginal, rol)
  }
  // eliminar roles
  const eliminarRoles = (id) => {
    roles.value = roles.value.filter(rol => rol._id !== id)
  }

  const obtenerRolesId = (id) => {
    rol.value = roles.value.find(rol => rol._id === id)
  }

  // obtener roles por id
  return {
    // states
    roles,
    rol,
    // metodos
    guardarRoles,
    editarRoles,
    eliminarRoles,
    obtenerRolesId

  }
})
