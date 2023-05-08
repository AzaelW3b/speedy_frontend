import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from 'src/boot/axios'

export const useClientesStore = defineStore('clientes', () => {
  const clientes = ref([])
  const cliente = ref(null)

  // guardar
  const guardarClientes = async (cliente) => {
    try {
      const { data } = await api.post('/clientes', cliente)
      clientes.value = [...clientes.value, data]
    } catch (error) {
      console.log(error.response.data.msg)
    }
  }
  // obtener
  const obtenerClientes = async () => {
    try {
      const { data } = await api.get('/clientes')
      clientes.value = data
    } catch (error) {
      console.log(error)
    }
  }
  // editar
  const editarClientes = async (cliente) => {
    try {
      const { data } = await api.put(`/clientes/${cliente._id}`, cliente)
      const clienteOriginal = clientes.value.find(clienteIndex => clienteIndex._id === cliente._id)
      Object.assign(clienteOriginal, data)
      console.log(data)
    } catch (error) {
      console.log(error)
    }
  }
  // eliminar
  const eliminarClientes = async (id) => {
    try {
      const { data } = await api.delete(`/clientes/${id}`)
      clientes.value = clientes.value.filter(cliente => cliente._id !== id)
      console.log(data)
    } catch (error) {
      console.log(error)
    }
  }

  // obtener por Id
  const obtenerClienteId = (id) => {
    cliente.value = clientes.value.find(cliente => cliente._id === id)
  }
  return {
    // states
    clientes,
    cliente,
    // metodos
    guardarClientes,
    editarClientes,
    obtenerClientes,
    eliminarClientes,
    obtenerClienteId
  }
})
