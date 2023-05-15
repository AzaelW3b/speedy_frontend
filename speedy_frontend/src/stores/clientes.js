import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from 'src/boot/axios'

export const useClientesStore = defineStore('clientes', () => {
  const clientes = ref([])
  const cliente = ref(null)

  // guardar
  const guardarClientes = async (cliente) => {
    try {
      if (cliente.fueInvitado) {
        cliente.invitadoPor = cliente.invitadoPorId.id
        // debemos buscar al cliente que lo invito
        const clienteInvito = clientes.value.find(clienteInvitado => clienteInvitado._id === cliente.invitadoPor)
        clienteInvito.invitadosCantidad++

        if (clienteInvito.invitadosCantidad > 3) {
          console.log('El cliente, ya llego al maximo de invitados', clienteInvito.nombreCliente)
          clienteInvito.invitadosCantidad = 3
          return
        }
        const { data } = await api.post('/clientes', cliente)

        // logica de clientes
        if (clienteInvito.invitadosCantidad === 1) {
          // primer cliente que invita
          clienteInvito.clienteInvitadoUno = data._id
        }
        if (clienteInvito.invitadosCantidad === 2) {
          clienteInvito.clienteInvitadoDos = data._id
        }
        if (clienteInvito.invitadosCantidad === 3) {
          clienteInvito.clienteInvitadoTres = data._id
        }
        console.log(clienteInvito)
        // lo añadimos al state
        clientes.value = [...clientes.value, data]
        // actualizamos el registro
        await api.put(`/clientes/${clienteInvito._id}`, clienteInvito)
      } else {
        const { data } = await api.post('/clientes', cliente)
        // console.log(cliente)
        clientes.value = [...clientes.value, data]
      }
    } catch (error) {
      console.log(error)
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
    return cliente.value
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
