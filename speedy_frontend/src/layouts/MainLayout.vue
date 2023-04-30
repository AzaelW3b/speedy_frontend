<template>
  <q-layout view="hHh LpR fFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          {{ usuarioAutenticado?.usuario?.nombreUsuario || usuarioAutenticado?.nombreCliente }}
        </q-toolbar-title>
        <q-btn flat @click="logout">Cerrar sesión</q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above v-model="leftDrawerOpen" side="left" bordered>
        <div class="row justify-center contenedor-menu">
          <img src="../assets/speedy.png" id="target-img-1" style="height: 100px"/>
          <div
            class="absolute-bottom-right"
            style="border-top-left-radius: 5px"
          >
            <q-avatar class="avatar">

              <span style="font-weight: bold"></span>
            </q-avatar>
            <span style="font-weight: bold"></span>
          </div>
      </div>
      <NavBar/>
    </q-drawer>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import NavBar from '../components/NavBar.vue'
import { useRouter } from 'vue-router'
import { useAutenticacionStore } from '../stores/autenticaciones'
import { useRolesStore } from '../stores/roles'

const leftDrawerOpen = ref(false)
const router = useRouter()

const useUsuario = useAutenticacionStore()
const { autenticarUsuario, cerrarSesion } = useUsuario
const { usuarioAutenticado } = storeToRefs(useUsuario)

const useRol = useRolesStore()
const { obtenerRoles } = useRol

const logout = () => {
  router.push('/')
  cerrarSesion()
}
onMounted(() => {
  autenticarUsuario()
  obtenerRoles()
})
const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

</script>
