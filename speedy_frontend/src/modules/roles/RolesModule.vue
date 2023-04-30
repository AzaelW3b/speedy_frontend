<template>
  <q-layout>
    <div class="q-pa-md">
      <div div class="q-pa-md">
        <h4>Roles</h4>
      </div>
      <q-separator color="primary" class="q-my-md" inset />
      <q-btn
        label="Nuevo rol"
        color="primary"
        class="q-my-md"
        icon="add"
        @click="nuevoRol"
      />
      <q-table
        color="primary"
        :rows="roles"
        :columns="columns"
        :filter="buscar"

      >
      <template v-slot:body-cell-acciones="props">
          <q-td>
            <q-btn
              @click="rolEditarId(props.row._id)"
              flat
              color="dark"
              icon="edit"
            >
              <q-tooltip>{{ `Editar al cliente ${props.row.rol}` }}</q-tooltip>
            </q-btn>
            <q-btn
              @click="confirmarEliminarRol(props.row)"
              flat
              color="negative"
              icon="delete"
            >
              <q-tooltip>{{ `Eliminar al cliente ${props.row.rol}` }}</q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </q-table>
      <ModalRoles ref="modalRoles"/>
    </div>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { storeToRefs } from 'pinia'
import { useRolesStore } from 'src/stores/roles'
import ModalRoles from 'src/components/roles/ModalRoles.vue'

// const useAspirante = useAspirantesStore()
const useRol = useRolesStore()
const { obtenerRolesId, eliminarRoles } = useRol
const { roles } = storeToRefs(useRol)

const columns = [
  {
    name: 'Rol',
    label: 'Nombre del rol',
    field: 'rol',
    align: 'left',
    sortable: true
  },
  {
    name: 'acciones',
    label: 'Acciones',
    field: 'acciones',
    align: 'left',
    sortable: true
  }
]

// const modelEntrevista = ref(null)
const modalRoles = ref(null)
const buscar = ref('')
const notificacion = useQuasar()

const nuevoRol = () => {
  modalRoles.value.abrir(true)
}
const rolEditarId = (id) => {
  obtenerRolesId(id)
  modalRoles.value.abrir(false)
}

const confirmarEliminarRol = (rol) => {
  notificacion.dialog({
    title: `¿Deseas eliminar el ${rol.rol}?`,
    message: 'Una vez le des en "ok" no se podrá recuperar el rol',
    cancel: true,
    persistent: true
  }).onOk(() => {
    eliminarRoles(rol._id)
  }).onCancel(() => {
    console.log('cancelando.....')
  })
}

</script>

<style>
</style>
