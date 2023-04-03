import { defineStore } from 'pinia'
import { apiUsuarios } from 'src/boot/axiosUsuarios'
import { ref } from 'vue'
// import { notificacion } from 'src/helpers/mensajes'

export const useAutenticacionStore = defineStore('autenticaciones', () => {
  const usuarioAutenticado = ref(null)
  const isLogin = ref(false)
  const idPortal = ref(0)

  const iniciarSesion = async (usuario) => {
    try {
      const { data } = await apiUsuarios.post('/usuarios/login', usuario)
      // autenticarUsuario()
      idPortal.value = data.idPortal
      isLogin.value = true
      localStorage.setItem('token', data.token)
      localStorage.setItem('idPortal', data.idPortal)
    } catch (error) {
    //   notificacion('negative', error.response.data.msg)
    }
  }

  // reseteamos el store de la autenticacion
  const cerrarSesion = async () => {
    try {
      usuarioAutenticado.value = null
      localStorage.removeItem('token')
      localStorage.removeItem('idPortal')
      isLogin.value = false
      idPortal.value = 0
    } catch (error) {
      console.log(error)
    }
  }

  const autenticarUsuario = async () => {
    const token = localStorage.getItem('token')

    if (!token) {
      console.log('No hay token')
      return
    }

    const configuracion = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    }

    try {
      idPortal.value = parseInt(localStorage.getItem('idPortal'))
      isLogin.value = true

      const { data } = await apiUsuarios.get('/usuarios/perfil', configuracion)
      usuarioAutenticado.value = { ...data }
    } catch (error) {
      console.log(error.response.msg)
    }
  }

  return {
    iniciarSesion,
    cerrarSesion,
    autenticarUsuario,
    usuarioAutenticado,
    idPortal,
    isLogin
  }
})
