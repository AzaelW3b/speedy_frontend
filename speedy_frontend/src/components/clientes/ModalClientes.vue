<template>
    <q-dialog v-model="modalClientes">
       <q-card class="full-width">
         <q-card-section class="bg-primary text-white">
            <q-btn icon="close" flat round dense v-close-popup />
           <div class="text-h4 text-center ">
             Clientes
             <q-separator/>
           </div>
         </q-card-section>

         <div class="row q-my-sm" >
          <q-card-section class="col-6 q-pt-none">
            <label>Nombre</label>
            <q-input
              v-model="clienteObj.nombreCliente"
              label="Ingresa el nombre del cliente"
              outlined

              />
          </q-card-section>
          <q-card-section class="col-6 q-pt-none">
            <label>Telefono</label>
            <q-input
              v-model="clienteObj.telefono"
              label="Ingresa el telefono"
              outlined

            />
          </q-card-section>
        </div>

        <div class="row q-my-sm" >
          <q-card-section class="col-6 q-pt-none">
            <label>Correo</label>
            <q-input
              v-model="clienteObj.correo"
              label="Ingresa el correo"
              outlined

              />
          </q-card-section>
          <q-card-section class="col-6 q-pt-none">
            <label>¿Fue invitado por alguien?</label>
           <div>
              <q-radio
                v-model="clienteObj.fueInvitado"
                checked-icon="task_alt"
                unchecked-icon="panorama_fish_eye"
                :val="true"
                label="Si"
              />
              <q-radio
                v-model="clienteObj.fueInvitado"
                checked-icon="task_alt"
                unchecked-icon="panorama_fish_eye"
                :val="false"
                label="No"
              />
           </div>

          </q-card-section>

          <q-card-section class="col-12 q-pt-none" v-if="clienteObj.fueInvitado">
            <label>Selecciona el cliente que invito</label>
              <q-select
                  outlined
                  v-model="clienteObj.invitadoPorId"
                  use-input
                  input-debounce="0"
                  label="Selecciona el cliente que invito"
                  :options="clientesNuevos"
                  @filter="parametrosFiltradosClientes"
                  behavior="menu"
                >
                  <template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-grey">
                        No se encontraron resultados
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>

          </q-card-section>
        </div>
        <q-card-actions align="right">
          <q-btn
            label="Guardar cliente"
            @click="guardarCliente"
            color="primary"
            v-close-popup
          />
        </q-card-actions>
       </q-card>
     </q-dialog>
 </template>

<script>
import { ref, reactive, computed } from 'vue'
import { useClientesStore } from 'src/stores/clientes'
import { editarRegistros } from 'src/helpers/editarRegistros'
import { v4 as uuidv4 } from 'uuid'
import { storeToRefs } from 'pinia'
import { filtradoBusquedaObj } from 'src/helpers/filtradoBusquedaObj'

export default {
  setup () {
    const modalClientes = ref(false)

    const clienteObj = reactive({
      _id: '',
      nombreCliente: '',
      telefono: '',
      correo: '',
      fueInvitado: false,
      invitadoPorId: '',
      clienteInvitadoUno: '',
      clienteInvitadoDos: '',
      clienteInvitadoTres: '',
      invitados: 0

    })
    const nuevoRegistro = ref(true)

    const useClientes = useClientesStore()
    const { guardarClientes, editarClientes } = useClientes
    const { cliente, clientes } = storeToRefs(useClientes)

    const clientesOpciones = computed(() => {
      return clientes.value.map(cliente => {
        return {
          id: cliente._id,
          label: cliente.nombreCliente,
          value: cliente._id
        }
      })
    })
    const clientesNuevos = ref(clientesOpciones.value)

    const abrir = (esNuevoRegistro) => {
      const clienteNuevo = {
        _id: '',
        nombreCliente: '',
        telefono: '',
        correo: '',
        fueInvitado: false,
        invitadoPorId: '',
        clienteInvitadoUno: '',
        clienteInvitadoDos: '',
        clienteInvitadoTres: '',
        invitados: 0
      }
      Object.keys(cliente.value || clienteObj).forEach(key => {
        clienteObj[key] = editarRegistros(clienteNuevo, cliente.value, esNuevoRegistro)[key]
      })

      modalClientes.value = true
      nuevoRegistro.value = esNuevoRegistro
    }
    const guardarCliente = () => {
      if (nuevoRegistro.value) {
        clienteObj._id = uuidv4()
        const clienteNuevo = { ...clienteObj }
        guardarClientes(clienteNuevo)
      } else {
        editarClientes(clienteObj)
      }
    }
    const parametrosFiltradosClientes = (val, update) => {
      filtradoBusquedaObj(val, update, clientesOpciones.value, clientesNuevos)
    }

    return {
      // estados
      modalClientes,
      clienteObj,
      clientesNuevos,
      // metodos
      abrir,
      guardarCliente,
      parametrosFiltradosClientes

    }
  }
}

</script>
