<template>
    <q-scroll-area class="fit">
      <q-list>
        <template v-for="(menuItem, index) in menulist" :key="index">
          <q-item
          v-if="!usuarioRol(menuItem?.meta?.roles)"
            clickable
            v-ripple
            :to="{ name: menuItem.name }"
            exact
            active-class="my-menu-link"
          >
            <q-item-section avatar>
              <q-icon :name="menuItem.icono" />
            </q-item-section>

            <q-item-section >
              {{ menuItem.label }}
            </q-item-section>
          </q-item>

          <q-separator />
        </template>
      </q-list>
    </q-scroll-area>
  </template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAutenticacionStore } from 'src/stores/autenticaciones'
import { storeToRefs } from 'pinia'
const menulist = ref([])
const router = useRouter()

onMounted(() => {
  menulist.value = router.options.routes
    .find((r) => {
      return r.name === 'principal'
    })
    .children.filter((route) => route.label)
  if (router.currentRoute.value.name === 'principal') {
    router.replace({ name: 'dashboard' })
  }
})
const usuarioRol = (rol) => {
  const useUsuarioAutenticado = useAutenticacionStore()
  const { usuarioAutenticado } = storeToRefs(useUsuarioAutenticado)
  console.log(usuarioAutenticado?.value?.usuario?.rol)
  return rol?.includes(usuarioAutenticado?.value?.usuario?.rol)
}
</script>

  <style lang="scss" scoped>
  .my-menu-link {
    color: white;
    background: $primary;
  }
  </style>
