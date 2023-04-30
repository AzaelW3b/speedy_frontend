<template>
    <q-dialog v-model="modalRoles">
       <q-card class="full-width">
         <q-card-section class="bg-primary text-white">
            <q-btn icon="close" flat round dense v-close-popup />
           <div class="text-h4 text-center ">
             Roles
             <q-separator/>
           </div>
         </q-card-section>

         <div class="row q-my-sm" >
          <q-card-section class="col-12 q-pt-none">
            <label>Nombre del rol</label>
            <q-input
              v-model="rolObj.rol"
              label="Ingresa el nombre del rol"
              outlined
              />
          </q-card-section>
        </div>

        <q-card-actions align="right">
          <q-btn
            label="Guardar rol"
            @click="guardarRol"
            color="primary"
            v-close-popup
          />
        </q-card-actions>
       </q-card>
     </q-dialog>
 </template>

<script>
import { ref, reactive } from 'vue'
import { useRolesStore } from 'src/stores/roles'
import { editarRegistros } from 'src/helpers/editarRegistros'
import { storeToRefs } from 'pinia'

export default {
  setup () {
    const modalRoles = ref(false)

    const rolObj = reactive({
      rol: ''

    })
    const nuevoRegistro = ref(true)

    const useRoles = useRolesStore()
    const { guardarRoles, editarRoles } = useRoles
    const { rol } = storeToRefs(useRoles)

    const abrir = (esNuevoRegistro) => {
      const rolNueva = {
        _id: '',
        rol: ''
      }
      Object.keys(rol.value || rolObj).forEach(key => {
        rolObj[key] = editarRegistros(rolNueva, rol.value, esNuevoRegistro)[key]
      })

      modalRoles.value = true
      nuevoRegistro.value = esNuevoRegistro
    }
    const guardarRol = () => {
      if (nuevoRegistro.value) {
        const rolNuevo = { ...rolObj }
        guardarRoles(rolNuevo)
      } else {
        editarRoles(rolObj)
      }
    }

    return {
      // estados
      modalRoles,
      rolObj,
      // metodos
      abrir,
      guardarRol

    }
  }
}

</script>
