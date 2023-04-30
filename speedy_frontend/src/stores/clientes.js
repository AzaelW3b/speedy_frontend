import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useClientesStore = defineStore('clientes', () => {
  const clientes = ref([])
  const cliente = ref(null)

  // guardar
  const guardarClientes = (cliente) => {
    clientes.value = [...clientes.value, cliente]
  }
  // obtener

  // editar
  const editarClientes = (cliente) => {
    const clienteOriginal = clientes.value.find(clienteIndex => clienteIndex._id === cliente._id)
    Object.assign(clienteOriginal, cliente)
  }
  // eliminar
  const eliminarClientes = (id) => {
    clientes.value = clientes.value.filter(cliente => cliente._id !== id)
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
    eliminarClientes,
    obtenerClienteId
  }
})
