<template>
    <div class="contenedor">
      <h2>Inicio</h2>
      <q-separator color="primary" class="q-my-md" inset />
      <div class="cards-dashboard">
        <q-card class="card">
          <q-card-section class="contenido-card">
            <span class="material-icons text-primary">person</span>
            <h3>Clientes registrados</h3>
            <p class="text-primary">0</p>
          </q-card-section>
        </q-card>

        <q-card class="card">
          <q-card-section class="contenido-card">
            <span class="material-icons text-primary">payments</span>
            <h3>Ventas del dia</h3>
            <p class="text-primary">0</p>
          </q-card-section>
        </q-card>

        <q-card class="card">
          <q-card-section class="contenido-card">
            <span class="material-icons text-primary">shopping_cart</span>
            <h3>Total de productos</h3>
            <p class="text-primary">0</p>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </template>

<script>
export default {
  setup () {
    return {
    }
  }
}
</script>

  <style scoped>
  .link-tablero {
    text-decoration: none;
    color: black;
    cursor: pointer;
    user-select: none;
  }
  </style>
