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
        console.log(cliente)
        cliente.invitadoPor = cliente.invitadoPor.id
        const clienteQueInvito = cliente.invitadoPor
        const { data } = await api.post('/clientes', cliente)
        console.log(clienteQueInvito)
        // buscamos el cliente que invito, para actualizar su información nivel 1
        const clienteQueInvitoObj = clientes.value.find(clienteInvito => clienteInvito._id === clienteQueInvito)
        // evaluamos si el que invito alguien más lo invito primero (para sacar el nivel 2)
        const clientePrincipal = clienteQueInvitoObj.invitadoPor ? clientes.value.find(clientePrincipalIndex => clientePrincipalIndex._id === clienteQueInvitoObj.invitadoPor) : null
        // evaluar si el cliente que lo invito, alguien más lo invito nivel 3
        const primerCliente = clientePrincipal?.invitadoPor ? clientes.value.find(primercliente => primercliente._id === clientePrincipal.invitadoPor) : null
        console.log('cliente principal: ', clientePrincipal)
        console.log('cliente que invito: ', clienteQueInvitoObj)
        console.log('primer cliente', primerCliente)

        // evaluación del nivel 1
        let nivel = 0
        if (clienteQueInvitoObj !== null) {
          nivel = 1
          clienteQueInvitoObj.niveles = 1

          clienteQueInvitoObj.invitados =
            [...clienteQueInvitoObj.invitados, { cliente: data._id, nivel }]
          console.log(clienteQueInvito)
          // actualizamos el registro
          const respuesta = await api.put(`/clientes/${clienteQueInvitoObj._id}`, clienteQueInvitoObj)
          console.log(respuesta.data)
        }
        // evaluación del nivel 2
        if (clientePrincipal !== null) {
          nivel = 2
          clientePrincipal.niveles = 2
          clientePrincipal.invitados =
            [...clientePrincipal.invitados, { cliente: data._id, nivel }]
          const respuesta = await api.put(`/clientes/${clientePrincipal._id}`, clientePrincipal)
          console.log(respuesta.data)
        }

        // evaluación nivel 3
        if (primerCliente !== null) {
          nivel = 3
          primerCliente.niveles = 3
          primerCliente.invitados =
          [...primerCliente.invitados, { cliente: data._id, nivel }]
          const respuesta = await api.put(`/clientes/${primerCliente._id}`, primerCliente)
          console.log(respuesta.data)
        }
        clientes.value = [...clientes.value, data]
      } else {
        const { data } = await api.post('/clientes', cliente)
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
