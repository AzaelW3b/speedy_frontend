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
          <p class="text-primary">{{ usuarioAutenticado?.usuario?.invitados.length }}</p>
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
      <h2>Mi piramide</h2>
      <q-separator color="primary" class="q-my-md" inset />
    </div>
    <div v-if="usuarioAutenticado?.usuario?.rol === 'socio'">
      <q-card class="q-pa-md">
        <div class="text-h2 text-center">Socio principal</div>
        <q-card class="q-mt-md">
          <q-card-section class="q-pa-md">
            <div class="text-h3">{{ usuarioAutenticado?.usuario?.nombreCliente }}</div>
            <div class="text-subtitle5 text-grey">Socio principal</div>
          </q-card-section>
          <div class="q-pa-md">
            <div class="q-gutter-md">
              <q-card class="q-py-sm q-px-md invitado-card" v-for="(cliente, index) in usuarioAutenticado?.usuario.invitados" :key="index">
                <q-card-section class="q-pa-md card-section">
                  <div class="text-h4" ><strong>Nombre: </strong>{{ cliente?.cliente?.nombreCliente }}</div>
                  <div class="text-h4" ><strong>Correo: </strong>{{ cliente?.cliente?.correo }}</div>
                  <div class="text-h4" ><strong>Teléfono: </strong>{{ cliente?.cliente?.telefono }}</div>
                  <div class="text-h4" ><strong>Tipo de Membresia: </strong>{{ cliente?.cliente?.tipoMembresia }}</div>
                  <div class="text-h4" ><strong>Cantidad que han invitado: </strong>{{ cliente?.cliente?.invitados.length}}</div>
                  <div class="text-subtitle4 text-grey">Invitado por {{ buscarCliente(cliente?.cliente?.invitadoPor) }}
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </q-card>
      </q-card>
    </div>
  </div>
</template>

<script setup>
import { useClientesStore } from 'src/stores/clientes'
// import { useProductosStore } from 'src/stores/productos'
import { useVentasStore } from 'src/stores/ventas'
import { useAutenticacionStore } from 'src/stores/autenticaciones'
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'

const useCliente = useClientesStore()
const { clientes } = storeToRefs(useCliente)

const useAutenticacion = useAutenticacionStore()
const { usuarioAutenticado } = storeToRefs(useAutenticacion)

const useVenta = useVentasStore()
const { obtenerVentaDia } = useVenta
const { ventaDia, ventasCliente } = storeToRefs(useVenta)

const formatoMoneda = ref(new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }))

const buscarCliente = (id) => {
  const cliente = clientes.value.find(cliente => cliente._id === id)
  return cliente?.nombreCliente
}
onMounted(() => {
  obtenerVentaDia()
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
