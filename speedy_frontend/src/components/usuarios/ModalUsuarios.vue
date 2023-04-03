<template>
  <q-dialog v-model="modalUsuarios">
     <q-card class="full-width">
       <q-card-section class="bg-primary text-white">
          <q-btn icon="close" flat round dense v-close-popup />
         <div class="text-h4 text-center ">
           Usuarios
           <q-separator/>
         </div>
       </q-card-section>

       <div class="row q-my-sm" >
        <q-card-section class="col-6 q-pt-none">
          <label>Nombre completo</label>
          <q-input
            v-model="usuarioObj.nombreUsuario"
            label="Ingresa el nombre completo del usuario"
            outlined
            />
        </q-card-section>

        <q-card-section class="col-6 q-pt-none">
          <label>Correo</label>
          <q-input
            v-model="usuarioObj.correo"
            label="Ingresa el correo del usuario"
            outlined
            />
        </q-card-section>
      </div>

      <div class="row q-my-sm" >
        <q-card-section class="col-6 q-pt-none">
          <label>Password</label>
          <q-input
                ref="contrasenaRef"
                v-model="usuarioObj.password"
                outlined
                :type="isPassword ? 'password' : 'text'"
                label="Ingresa la contraseña"
              >
                <template v-slot:append>
                  <q-icon
                    :name="isPassword ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="isPassword = !isPassword"
                  />
                </template>
              </q-input>
        </q-card-section>

        <q-card-section class="col-6 q-pt-none">
          <label>Rol</label>
            <q-select
                  outlined
                  v-model="usuarioObj.rol"
                  use-input
                  input-debounce="0"
                  label="Selecciona el cliente que invito"
                  :options="rolesNuevos"
                  @filter="parametrosFiltradosRoles"
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
          label="Guardar usuario"
          @click="guardarUsuario"
          color="primary"
          v-close-popup
        />
      </q-card-actions>
     </q-card>
   </q-dialog>
</template>

<script>
import { ref, reactive, computed } from 'vue'
import { useUsuariosStore } from 'src/stores/usuarios'
import { useRolesStore } from 'src/stores/roles'
import { editarRegistros } from 'src/helpers/editarRegistros'
import { v4 as uuidv4 } from 'uuid'
import { storeToRefs } from 'pinia'
import { filtradoBusquedaObj } from 'src/helpers/filtradoBusquedaObj'

export default {
  setup () {
    const modalUsuarios = ref(false)
    const isPassword = ref(false)

    const usuarioObj = reactive({
      _id: '',
      nombreUsuario: '',
      correo: '',
      password: 'speedy123',
      rol: ''

    })
    const nuevoRegistro = ref(true)

    const useUsuarios = useUsuariosStore()
    const { guardarUsuarios, editarUsuarios } = useUsuarios
    const { usuario } = storeToRefs(useUsuarios)

    const useRol = useRolesStore()
    const { roles } = storeToRefs(useRol)

    const rolesOpciones = computed(() => {
      return roles.value.map(rol => {
        return {
          id: rol._id,
          label: rol.rol,
          value: rol._id
        }
      })
    })

    const rolesNuevos = ref(rolesOpciones.value)

    const abrir = (esNuevoRegistro) => {
      const usuarioNuevo = {
        _id: '',
        nombreUsuario: '',
        correo: '',
        password: 'speedy123',
        rol: ''
      }
      Object.keys(usuario.value || usuarioObj).forEach(key => {
        usuarioObj[key] = editarRegistros(usuarioNuevo, usuario.value, esNuevoRegistro)[key]
      })

      modalUsuarios.value = true
      nuevoRegistro.value = esNuevoRegistro
    }
    const parametrosFiltradosRoles = (val, update) => {
      filtradoBusquedaObj(val, update, rolesOpciones.value, rolesNuevos)
    }
    const guardarUsuario = () => {
      if (nuevoRegistro.value) {
        usuarioObj._id = uuidv4()
        const usuarioNuevo = { ...usuarioObj }
        guardarUsuarios(usuarioNuevo)
      } else {
        editarUsuarios(usuarioObj)
      }
    }

    return {
      // estados
      isPassword,
      modalUsuarios,
      usuarioObj,
      rolesNuevos,
      // metodos
      abrir,
      guardarUsuario,
      parametrosFiltradosRoles

    }
  }
}

</script>
