import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'
import { ref } from 'vue'
import { mensajeUsuario } from 'src/helpers/mensajes'

export const useAutenticacionStore = defineStore('autenticaciones', () => {
  const usuarioAutenticado = ref(null)
  const isLogin = ref(false)
  const isAdmin = ref(0)

  // iniciar sesion usuario administrador
  const iniciarSesion = async (usuario) => {
    try {
      const { data } = await api.post('/usuarios/login', usuario)
      isLogin.value = true
      isAdmin.value = data.isAdmin
      localStorage.setItem('token', data.token)
      localStorage.setItem('isAdmin', data.isAdmin)
    } catch (error) {
      mensajeUsuario('negative', error.response.data.msg)
    }
  }

  // iniciar sesion como cliente
  const iniciarSesionCliente = async (usuario) => {
    try {
      const { data } = await api.post('/clientes/login', usuario)
      isLogin.value = true
      isAdmin.value = data.isAdmin

      localStorage.setItem('token', data.token)
      localStorage.setItem('isAdmin', data.isAdmin)
    } catch (error) {
      mensajeUsuario('negative', error.response.data.msg)
    }
  }

  // reseteamos el store de la autenticacion
  const cerrarSesion = async () => {
    try {
      usuarioAutenticado.value = null
      localStorage.removeItem('token')
      localStorage.removeItem('isAdmin')

      isLogin.value = false
      isAdmin.value = 0
    } catch (error) {
      console.log(error)
    }
  }

  const autenticarUsuario = async () => {
    const token = localStorage.getItem('token')

    if (!token) {
      mensajeUsuario('negative', 'Se ha cerrado sesión, inicia nuevamente.')
      return
    }

    const configuracion = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    }

    try {
      isLogin.value = true
      isAdmin.value = parseInt(localStorage.getItem('isAdmin'))

      if (isAdmin.value === 1) {
        const { data } = await api.get('/usuarios/perfil', configuracion)
        usuarioAutenticado.value = { ...data }
      } else {
        const { data } = await api.get('/clientes/perfil', configuracion)
        usuarioAutenticado.value = { ...data }
      }
    } catch (error) {
      mensajeUsuario('negative', error.response.data.msg)
    }
  }

  return {
    iniciarSesion,
    cerrarSesion,
    autenticarUsuario,
    iniciarSesionCliente,
    usuarioAutenticado,
    isLogin,
    isAdmin
  }
})
