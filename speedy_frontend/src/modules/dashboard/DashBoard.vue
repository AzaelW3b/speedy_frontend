<template>
  <div class="contenedor">
    <h2>Inicio</h2>
    <q-separator color="primary" class="q-my-md" inset />
    <div class="cards-dashboard"
      v-if="usuarioAutenticado?.usuario?.rol === 'admin' || usuarioAutenticado?.usuario?.rol === 'cajero'">
      <q-card class="card">
        <q-card-section class="contenido-card">
          <span class="material-icons text-primary">person</span>
          <h3>Clientes registrados</h3>
          <p class="text-primary">{{ clientes.length }}</p>
        </q-card-section>
      </q-card>

      <q-card class="card">
        <q-card-section class="contenido-card">
          <span class="material-icons text-primary">payments</span>
          <h3>Ventas del dia</h3>
          <p class="text-primary">{{ ventaDia?.cantidadVentas }}</p>
        </q-card-section>
      </q-card>

      <q-card class="card">
        <q-card-section class="contenido-card">
          <span class="material-icons text-primary">payments</span>
          <h3>Ingresos del dia</h3>
          <p class="text-primary">{{ formatoMoneda.format(ventaDia?.totalVentasDia) }}</p>
        </q-card-section>
      </q-card>
    </div>
    <div class="cards-dashboard" v-if="usuarioAutenticado?.usuario?.rol === 'socio'">
      <q-card class="card">
        <q-card-section class="contenido-card">
          <span class="material-icons text-primary">shopping_bag</span>
          <h3>Compras hechas en el mes</h3>
          <p class="text-primary">{{ ventasCliente ? ventasCliente[0]?.totalCount : 0 }}</p>
        </q-card-section>
      </q-card>

      <q-card class="card">
        <q-card-section class="contenido-card">
          <span class="material-icons text-primary">payments</span>
          <h3>Total gastado en el mes</h3>
          <p class="text-primary">{{ ventasCliente ? formatoMoneda.format(ventasCliente[0]?.totalVentas || 0) : 0 }}</p>
        </q-card-section>
      </q-card>

      <q-card class="card">
        <q-card-section class="contenido-card">
          <span class="material-icons text-primary">credit_score</span>
          <h3>Cashback</h3>
          <p class="text-primary">0</p>
        </q-card-section>
      </q-card>
    </div>

    <div class="cards-dashboard" v-if="usuarioAutenticado?.usuario?.rol === 'socio'">
      <q-card class="card">
        <q-card-section class="contenido-card">
          <span class="material-icons text-primary">person</span>
          <h3>Socios invitados</h3>
          <p class="text-primary">{{ invitados?.length }}</p>
        </q-card-section>
      </q-card>

      <q-card class="card">
        <q-card-section class="contenido-card">
          <span class="material-icons text-primary">contact_mail</span>
          <h3>Tipo de membresia</h3>
          <p class="text-primary">{{ usuarioAutenticado?.usuario?.tipoMembresia }}</p>
        </q-card-section>
      </q-card>

      <q-card class="card">
        <q-card-section class="contenido-card">
          <span class="material-icons text-primary">group</span>
          <h3>Invitado por</h3>
          <p class="text-primary text-center">{{ usuarioAutenticado?.usuario?.invitadoPor ?
            usuarioAutenticado?.usuario?.invitadoPor?.nombreCliente : 'No fuiste invitado por alguien' }}</p>
        </q-card-section>
      </q-card>
    </div>
    <div v-if="usuarioAutenticado?.usuario?.rol === 'socio'">
      <q-separator color="primary" class="q-my-md" inset />
    </div>
    <div v-if="usuarioAutenticado?.usuario?.rol === 'socio'">
      <div class="q-pa-md">
        <h1 class="text-h3 text-center">{{ usuarioAutenticado?.usuario?.nombreCliente }}</h1>
          <p class="text-subtitle5 text-grey text-center">Socio principal</p>
        </div>
        <p class="text-h3" v-if="invitadosNivelUno.length === 0 && invitadosNivelDos.length === 0 && invitadosNivelTres.length === 0">Aún no tienes invitados.</p>
        <div v-if="invitadosNivelUno.length > 0">
          <p class="text-h3">Socios nivel 1</p>
          <div class="contenedor-cards-socios">
            <q-card class="q-mt-md q-pa-md border-card" v-for="invitadoNivelUno in invitadosNivelUno" :key="invitadoNivelUno._id">
              <p class="text-h4"> <b>Nombre: </b>{{ invitadoNivelUno.cliente?.nombreCliente }}</p>
              <p class="text-h4"> <b>Teléfono: </b>{{ invitadoNivelUno.cliente?.telefono }}</p>
              <p class="text-h4"> <b>Correo: </b>{{ invitadoNivelUno.cliente?.correo }}</p>
              <p class="text-h4"> <b>Membresia: </b>{{ invitadoNivelUno.cliente?.tipoMembresia }}</p>
              <p class="text-subtitle4"><b>Invitado por:</b> {{ buscarCliente(invitadoNivelUno?.cliente?.invitadoPor) }}</p>
            </q-card>
           </div>
        </div>
         <div class="q-mt-md"  v-if="invitadosNivelDos.length > 0">
          <p class="text-h3">Socios nivel 2</p>
          <div class="contenedor-cards-socios">
            <q-card class="q-mt-md q-pa-md border-card" v-for="invitadoNivelDos in invitadosNivelDos" :key="invitadoNivelDos._id">
              <p class="text-h4"> <b>Nombre: </b>{{ invitadoNivelDos.cliente?.nombreCliente }}</p>
              <p class="text-h4"> <b>Teléfono: </b>{{ invitadoNivelDos.cliente?.telefono }}</p>
              <p class="text-h4"> <b>Correo: </b>{{ invitadoNivelDos.cliente?.correo }}</p>
              <p class="text-h4"> <b>Membresia: </b>{{ invitadoNivelDos.cliente?.tipoMembresia }}</p>
              <p class="text-subtitle4"><b>Invitado por:</b> {{ buscarCliente(invitadoNivelDos?.cliente?.invitadoPor) }}</p>
            </q-card>
           </div>
        </div>
         <div class="q-mt-md" v-if="invitadosNivelTres.length > 0">
          <p class="text-h3">Socios nivel 3</p>
          <div class="contenedor-cards-socios">
            <q-card class="q-mt-md q-pa-md border-card" v-for="invitadoNivelTres in invitadosNivelTres" :key="invitadoNivelTres._id">
              <p class="text-h4"> <b>Nombre: </b>{{ invitadoNivelTres.cliente?.nombreCliente }}</p>
              <p class="text-h4"> <b>Teléfono: </b>{{ invitadoNivelTres.cliente?.telefono }}</p>
              <p class="text-h4"> <b>Correo: </b>{{ invitadoNivelTres.cliente?.correo }}</p>
              <p class="text-h4"> <b>Membresia: </b>{{ invitadoNivelTres.cliente?.tipoMembresia }}</p>
              <p class="text-subtitle4"><b>Invitado por:</b> {{ buscarCliente(invitadoNivelTres?.cliente?.invitadoPor) }}</p>
            </q-card>
           </div>
        </div>
    </div>
  </div>
</template>

<script setup>
import { useClientesStore } from 'src/stores/clientes'
import { useVentasStore } from 'src/stores/ventas'
import { useAutenticacionStore } from 'src/stores/autenticaciones'
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'

const useCliente = useClientesStore()
const { obtenerInvitados } = useCliente
const { clientes, invitadosNivelUno, invitadosNivelDos, invitadosNivelTres, invitados } = storeToRefs(useCliente)

const useAutenticacion = useAutenticacionStore()
const { autenticarUsuario } = useAutenticacion
const { usuarioAutenticado } = storeToRefs(useAutenticacion)

const useVenta = useVentasStore()
const { obtenerVentaDia } = useVenta
const { ventaDia, ventasCliente } = storeToRefs(useVenta)
const formatoMoneda = ref(new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }))

const buscarCliente = (id) => {
  const cliente = clientes.value.find(cliente => cliente._id === id)
  return cliente?.nombreCliente
}
onMounted(async () => {
  await autenticarUsuario()
  obtenerVentaDia()
  if (usuarioAutenticado?.value?.usuario?.rol === 'socio') {
    obtenerInvitados(usuarioAutenticado?.value?.usuario?._id)
  }
})
</script>

<style scoped>
.link-tablero {
  text-decoration: none;
  color: black;
  cursor: pointer;
  user-select: none;
}
.invitado-card {
  background-color: #F7F9FC;
  border-left: 4px solid #013565;
  border-radius: 4px;
  color: #616161;
  margin-bottom: 10px;
}
.card-section div {
  margin-bottom: 10px;
}
</style>
