<template>
    <div class="contenedor-login">
      <div class="informacion-login">
        <q-form
          class="bg-white formulario-login"
          @submit.prevent="login"
          ref="formulario"
        >
          <div class="q-pa-xl">
            <div class="contenedor-logo-gruver">
              <q-img
                src="../assets/speedy.png"
                spinner-color="white"
                class="q-mb-xl imagen-gruver"
              />
            </div>
            <div class="q-mb-md">
              <q-input
                filled
                ref="usuarioRef"
                v-model="usuarioObj.correo"
                label="Ingresa el usuario"
                :rules="[
                  (val) =>
                    (val && val.length > 0) ||
                    'Debes ingresar un nombre de usuario',
                ]"
              >
                <template v-slot:append>
                  <q-icon name="person" />
                </template>
              </q-input>
            </div>
            <div class="q-mb-md">
              <q-input
                ref="contrasenaRef"
                v-model="usuarioObj.password"
                filled
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
            </div>
            <div class="btn-login">
              <q-btn color="primary" type="submit" label="Iniciar Sesión" />
            </div>
          </div>
        </q-form>
      </div>
    </div>
  </template>
<script>
import { useAutenticacionStore } from '../stores/autenticaciones'
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'

export default {
  setup () {
    const useAutenticacion = useAutenticacionStore()
    const { iniciarSesion, iniciarSesionCliente } = useAutenticacion

    const isPassword = ref(true)
    const formulario = ref(null)
    const router = useRouter()

    const usuarioObj = reactive({
      correo: '',
      password: ''
    })

    const login = async () => {
      if (await formulario.value.validate()) {
        if (usuarioObj.correo.includes('speedy')) {
          await iniciarSesion(usuarioObj)
          router.push('/principal')
        } else {
          await iniciarSesionCliente(usuarioObj)
          router.push('/principal')
        }
      }
    }

    return {
      usuarioObj,
      isPassword,
      login,
      formulario
    }
  }
}
</script>

  <style scoped>
  h1 {
    margin-top: 0;
  }
  .contenedor-login {
    background-color: #f3f4f6;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  </style>
