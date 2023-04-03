<template>
  <q-layout view="hHh LpR fFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          <!-- <q-avatar class="logo-inicio">
          </q-avatar> -->
          {{ 'Azael Garcia Jaimes' }}
        </q-toolbar-title>
        <q-btn flat @click="logout"> Cerrar sesión</q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above v-model="leftDrawerOpen" side="left" bordered>
      <!-- drawer content -->
        <div class="row justify-center contenedor-menu">
          <img src="../assets/speedy.png" id="target-img-1" style="height: 100px"/>
          <div
            class="absolute-bottom-right"
            style="border-top-left-radius: 5px"
          >
            <q-avatar class="avatar">

              <span style="font-weight: bold"></span>
            </q-avatar>
            <!-- {{ usuarioAutenticado?.nombre }}
            <span style="font-weight: bold"></span> -->
          </div>
        <!-- </q-img> -->
      </div>
      <NavBar/>
    </q-drawer>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'

import NavBar from '../components/NavBar.vue'

const leftDrawerOpen = ref(false)
// const router = useRouter()

// const logout = () => {
//   router.push('/')
//   cerrarSesion()
// }
const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

</script>
