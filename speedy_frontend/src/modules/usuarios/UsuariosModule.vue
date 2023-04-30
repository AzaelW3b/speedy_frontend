<template>
  <q-layout>
    <div class="q-pa-md">
      <div div class="q-pa-md">
        <h4>Usuarios</h4>
      </div>
      <q-separator color="primary" class="q-my-md" inset />
      <q-btn
        label="Nuevo usuario"
        color="primary"
        class="q-my-md"
        icon="add"
        @click="nuevoUsuario"
      />
      <q-table
        color="primary"
        :rows="usuarios"
        :columns="columns"
        :filter="buscar"

      >
      <template v-slot:body-cell-acciones="props">
          <q-td>
            <q-btn
              @click="usuarioEditarId(props.row._id)"
              flat
              color="dark"
              icon="edit"
            >
              <q-tooltip>{{ `Editar al usuario ${props.row.nombreUsuario}` }}</q-tooltip>
            </q-btn>
            <q-btn
              @click="confirmarEliminarUsuario(props.row)"
              flat
              color="negative"
              icon="delete"
            >
              <q-tooltip>{{ `Eliminar al usuario ${props.row.nombreUsuario}` }}</q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </q-table>
      <ModalUsuarios ref="modalUsarios"/>
    </div>
  </q-layout>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useQuasar } from 'quasar'
import { storeToRefs } from 'pinia'
import { useUsuariosStore } from 'src/stores/usuarios'
import ModalUsuarios from 'src/components/usuarios/ModalUsuarios.vue'

// const useAspirante = useAspirantesStore()
const useUsuario = useUsuariosStore()
const { obtenerUsuariosId, eliminarUsuarios, obtenerUsuarios } = useUsuario
const { usuarios } = storeToRefs(useUsuario)

const columns = [
  {
    name: 'nombreUsuario',
    label: 'Nombre completo',
    field: 'nombreUsuario',
    align: 'left',
    sortable: true
  },
  {
    name: 'correo',
    label: 'Correo',
    field: 'correo',
    align: 'left',
    sortable: true
  },
  {
    name: 'rol',
    label: 'Rol del usuario',
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
const modalUsarios = ref(null)
const buscar = ref('')
const notificacion = useQuasar()

const nuevoUsuario = () => {
  modalUsarios.value.abrir(true)
}
const usuarioEditarId = (id) => {
  obtenerUsuariosId(id)
  modalUsarios.value.abrir(false)
}

const confirmarEliminarUsuario = (usuario) => {
  notificacion.dialog({
    title: `¿Deseas eliminar el ${usuario.nombreUsuario}?`,
    message: 'Una vez le des en "ok" no se podrá recuperar del usuario',
    cancel: true,
    persistent: true
  }).onOk(() => {
    eliminarUsuarios(usuario._id)
  }).onCancel(() => {
    console.log('cancelando.....')
  })
}
onMounted(() => obtenerUsuarios())
</script>

<style>
</style>
