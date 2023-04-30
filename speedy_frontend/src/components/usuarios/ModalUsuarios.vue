<template>
  <q-dialog v-model="modalUsuarios">
     <q-card class="full-width">
       <q-card-section class="bg-primary text-white">
          <q-btn icon="close" flat round dense v-close-popup />
         <div class="text-h4 text-center" v-if="nuevoRegistro">
           Usuarios
         </div>
         <div class="text-h4 text-center" v-else>
           Editar usuario
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
        <q-card-section class="col-6 q-pt-none" v-if="nuevoRegistro">
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
        <div v-else></div>
        <!-- <q-card-section class="col-6 q-pt-none" v-else>
          <q-btn
              @click="cambiarPassword = !cambiarPassword"
              v-if="!cambiarPassword"
              color="primary"
              label="cambiar password"
            />
          <label v-if="cambiarPassword">Ingresa tu nuevo password</label>
          <q-input
                v-if="cambiarPassword"
                ref="contrasenaRef"
                v-model="nuevoPassword"
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

        </q-card-section> -->

        <q-card-section class="col-6 q-pt-none">
          <label>Rol</label>
            <q-select
                  outlined
                  v-model="usuarioObj.rol"
                  label="Selecciona el rol"
                  :options="rolesNuevos"
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
import { storeToRefs } from 'pinia'

export default {
  setup () {
    const modalUsuarios = ref(false)
    const isPassword = ref(false)
    const usuarioObj = reactive({
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

    const rolesNuevos = computed(() => {
      return roles.value.map(rol => rol.rol)
    })

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
    const guardarUsuario = () => {
      if (nuevoRegistro.value) {
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
      nuevoRegistro,
      // metodos
      abrir,
      guardarUsuario

    }
  }
}

</script>
