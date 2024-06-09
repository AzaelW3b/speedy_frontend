import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from 'src/boot/axios'
import { mensajeUsuario } from 'src/helpers/mensajes'

export const useClientesStore = defineStore('clientes', () => {
  const clientes = ref([])
  const cliente = ref(null)
  const invitadosNivelUno = ref([])
  const invitadosNivelDos = ref([])
  const invitadosNivelTres = ref([])
  const invitados = ref([])

  // guardar
  const guardarClientes = async (cliente) => {
    try {
      if (cliente.fueInvitado) {
        cliente.invitadoPor = cliente.invitadoPor.id
        const clienteQueInvito = cliente.invitadoPor
        const { data } = await api.post('/clientes', cliente)
        // buscamos el cliente que invito, para actualizar su información nivel 1
        const clienteQueInvitoObj = clientes.value.find(clienteInvito => clienteInvito._id === clienteQueInvito)
        // evaluamos si el que invito alguien más lo invito primero (para sacar el nivel 2)
        const clientePrincipal = clienteQueInvitoObj.invitadoPor ? clientes.value.find(clientePrincipalIndex => clientePrincipalIndex._id === clienteQueInvitoObj.invitadoPor) : null
        // evaluar si el cliente que lo invito, alguien más lo invito nivel 3
        const primerCliente = clientePrincipal?.invitadoPor ? clientes.value.find(primercliente => primercliente._id === clientePrincipal.invitadoPor) : null

        // evaluación del nivel 1
        let nivel = 0
        if (clienteQueInvitoObj !== null) {
          nivel = 1
          clienteQueInvitoObj.niveles = 1

          clienteQueInvitoObj.invitados =
            [...clienteQueInvitoObj.invitados, { cliente: data._id, nivel }]
          // actualizamos el registro
          const respuesta = await api.put(`/clientes/${clienteQueInvitoObj._id}`, clienteQueInvitoObj)
          mensajeUsuario('positive', `Cliente ${respuesta?.data?.nombreCliente} lleva ${respuesta?.data?.invitados?.length} invitados.`)
        }
        // evaluación del nivel 2
        if (clientePrincipal !== null) {
          nivel = 2
          clientePrincipal.niveles = 2
          clientePrincipal.invitados =
            [...clientePrincipal.invitados, { cliente: data._id, nivel }]
          const respuesta = await api.put(`/clientes/${clientePrincipal._id}`, clientePrincipal)
          mensajeUsuario('positive', `Cliente ${respuesta?.data?.nombreCliente} lleva ${respuesta?.data?.invitados?.length} invitados.`)
        }

        // evaluación nivel 3
        if (primerCliente !== null) {
          nivel = 3
          primerCliente.niveles = 3
          primerCliente.invitados =
          [...primerCliente.invitados, { cliente: data._id, nivel }]
          const respuesta = await api.put(`/clientes/${primerCliente._id}`, primerCliente)
          mensajeUsuario('positive', `Cliente ${respuesta?.data?.nombreCliente} lleva ${respuesta?.data?.invitados?.length} invitados.`)
        }
        clientes.value = [data, ...clientes.value]
        mensajeUsuario('positive', `Cliente ${data?.nombreCliente} creado de manera correcta`)
      } else {
        const { data } = await api.post('/clientes', cliente)
        clientes.value = [data, ...clientes.value]
        mensajeUsuario('positive', `Cliente ${data?.nombreCliente} creado de manera correcta`)
      }
    } catch (error) {
      mensajeUsuario('negative', `Algo fallo en la creación del cliente favor de reportar a soporte. ${error}`)
    }
  }
  // obtener
  const obtenerClientes = async () => {
    try {
      const { data } = await api.get('/clientes')
      clientes.value = data
    } catch (error) {
      mensajeUsuario('negative', `Error al obtener clientes favor de reportar a soporte. ${error}`)
    }
  }
  // editar
  const editarClientes = async (cliente) => {
    try {
      const { data } = await api.put(`/clientes/${cliente._id}`, cliente)
      const clienteOriginal = clientes.value.find(clienteIndex => clienteIndex._id === cliente._id)
      Object.assign(clienteOriginal, data)
      mensajeUsuario('positive', `${data?.msg || 'Cliente editado'} de manera correcta`)
    } catch (error) {
      mensajeUsuario('negative', `Algo fallo en la edición del cliente favor de reportar a soporte. ${error}`)
    }
  }
  // eliminar
  const eliminarClientes = async (id) => {
    try {
      const { data } = await api.delete(`/clientes/${id}`)
      clientes.value = clientes.value.filter(cliente => cliente._id !== id)
      mensajeUsuario('positive', `${data?.msg} de manera correcta`)
    } catch (error) {
      mensajeUsuario('negative', `Algo fallo en la eliminación del cliente favor de reportar a soporte. ${error}`)
    }
  }

  // obtener por Id
  const obtenerClienteId = (id) => {
    cliente.value = clientes.value.find(cliente => cliente._id === id)
    return cliente.value
  }

  const obtenerInvitados = async (id) => {
    try {
      const { data } = await api.get(`/clientes/invitados/${id}`)
      invitados.value = data
      invitadosNivelUno.value = data?.filter(invitado => invitado.nivel === 1)
      invitadosNivelDos.value = data?.filter(invitado => invitado.nivel === 2)
      invitadosNivelTres.value = data?.filter(invitado => invitado.nivel === 3)
      console.log(invitadosNivelUno.value)
      console.log(invitadosNivelDos.value)
      console.log(invitadosNivelTres.value)
    } catch (error) {
      console.log(error)
    }
  }
  return {
    // states
    clientes,
    cliente,
    invitadosNivelUno,
    invitadosNivelDos,
    invitadosNivelTres,
    invitados,
    // metodos
    guardarClientes,
    editarClientes,
    obtenerClientes,
    eliminarClientes,
    obtenerClienteId,
    obtenerInvitados
  }
})
