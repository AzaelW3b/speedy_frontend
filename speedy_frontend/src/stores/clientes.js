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
        // buscamos el cliente que invito, para actualizar su información
        const clienteQueInvitoObj = clientes.value.find(clienteInvito => clienteInvito._id === clienteQueInvito)
        // evaluamos si el que invito alguien más lo invito primero (para sacar el nivel)
        const clientePrincipal = clienteQueInvitoObj.invitadoPor ? clientes.value.find(clientePrincipalIndex => clientePrincipalIndex._id === clienteQueInvitoObj.invitadoPor) : null
        console.log('cliente principal: ', clientePrincipal)
        console.log('cliente que invito: ', clienteQueInvitoObj)

        // evaluación de niveles
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
        // switch (clienteQueInvitoObj !== null || clientePrincipal !== null) {
        //   // los que yo invité
        //   case clienteQueInvitoObj !== null:

        //     break
        // los invitados de mis invitados
        // case clientePrincipal !== null:
        //   nivel = 2
        //   clientePrincipal.niveles = 2
        //   break
        // case clienteQueInvitoObj.niveles === 2:
        //   nivel = 3
        //   clienteQueInvitoObj.niveles = 3
        //   break
        // case clienteQueInvitoObj.niveles === 3:
        //   nivel = 1
        //   clienteQueInvitoObj.niveles = 0
        //   break
        // }
        // clientePrincipal.niveles
        // console.log(clienteQueInvitoObj)

        // debemos buscar al cliente que lo invito
        // const clienteInvito = clientes.value.find(clienteInvitado => clienteInvitado._id === cliente.invitadoPor)
        // clienteInvito.invitadosCantidad++

        // if (clienteInvito.invitadosCantidad > 3) {
        //   console.log('El cliente, ya llego al maximo de invitados', clienteInvito.nombreCliente)
        //   clienteInvito.invitadosCantidad = 3
        //   return
        // }
        // const { data } = await api.post('/clientes', cliente)

        // // logica de clientes
        // if (clienteInvito.invitadosCantidad === 1) {
        //   // primer cliente que invita
        //   clienteInvito.clienteInvitadoUno = data._id
        // }
        // if (clienteInvito.invitadosCantidad === 2) {
        //   clienteInvito.clienteInvitadoDos = data._id
        // }
        // if (clienteInvito.invitadosCantidad === 3) {
        //   clienteInvito.clienteInvitadoTres = data._id
        // }
        // console.log(clienteInvito)
        // clientes.value = [...clientes.value, data]
        // await api.put(`/clientes/${clienteInvito._id}`, clienteInvito)
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
