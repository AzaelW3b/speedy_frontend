<template>
    <q-dialog v-model="modalProductos">
       <q-card class="full-width">
         <q-card-section class="bg-primary text-white">
            <q-btn icon="close" flat round dense v-close-popup />
           <div class="text-h4 text-center ">
             Productos
             <q-separator/>
           </div>
         </q-card-section>

         <div class="row q-my-sm" >
          <q-card-section class="col-6 q-pt-none">
            <label>Codigo de barras</label>
            <q-input
              v-model="productoObj.codigoBarras"
              label="Ingresa el codigo de barras"
              outlined
              />
          </q-card-section>

          <q-card-section class="col-6 q-pt-none">
            <label>Nombre del producto</label>
            <q-input
              v-model="productoObj.nombreProducto"
              label="Ingresa el nombre del producto"
              outlined
              />
          </q-card-section>
        </div>

        <div class="row q-my-sm" >
          <q-card-section class="col-6 q-pt-none">
            <label>Precio</label>
            <q-input
              type="number"
              v-model="productoObj.precio"
              label="Ingresa el precio"
              outlined
              />
          </q-card-section>

          <q-card-section class="col-6 q-pt-none">
            <label>Categoria</label>
              <q-select
                    outlined
                    v-model="productoObj.categoria"
                    use-input
                    input-debounce="0"
                    label="Selecciona la categoria"
                    :options="categoriasNuevas"
                    @filter="parametrosFiltradosRoles"
                    behavior="menu"
                  >
                    <template v-slot:no-option>
                      <q-item>
                        <q-item-section class="text-grey">
                          No se encontraron resultados
                        </q-item-section>
                      </q-item>
                    </template>
                </q-select>
          </q-card-section>
        </div>

        <q-card-actions align="right">
          <q-btn
            label="Guardar producto"
            @click="guardarProducto"
            color="primary"
            v-close-popup
          />
        </q-card-actions>
       </q-card>
     </q-dialog>
  </template>

<script>
import { ref, reactive, computed } from 'vue'
import { useProductosStore } from 'src/stores/productos'
import { useCategoriasStore } from 'src/stores/categorias'
import { editarRegistros } from 'src/helpers/editarRegistros'
import { storeToRefs } from 'pinia'
import { filtradoBusquedaObj } from 'src/helpers/filtradoBusquedaObj'

export default {
  setup () {
    const modalProductos = ref(false)

    const productoObj = reactive({
      codigoBarras: '',
      nombreProducto: '',
      precio: 0,
      categoria: ''

    })
    const nuevoRegistro = ref(true)

    const useProductos = useProductosStore()
    const { guardarProductos, editarProductos } = useProductos
    const { producto } = storeToRefs(useProductos)

    const useCategorias = useCategoriasStore()
    const { categorias } = storeToRefs(useCategorias)

    const categoriasOpciones = computed(() => {
      return categorias.value.map(categoria => {
        return {
          id: categoria._id,
          label: categoria.nombreCategoria,
          value: categoria.nombreCategoria
        }
      })
    })

    const categoriasNuevas = ref(categoriasOpciones.value)

    const abrir = (esNuevoRegistro) => {
      const productoNuevo = {
        codigoBarras: '',
        nombreProducto: '',
        precio: 0,
        categoria: ''
      }
      if (!esNuevoRegistro) {
        productoNuevo._id = null
      }
      Object.keys(producto.value || productoObj).forEach(key => {
        productoObj[key] = editarRegistros(productoNuevo, producto.value, esNuevoRegistro)[key]
      })

      modalProductos.value = true
      nuevoRegistro.value = esNuevoRegistro
    }
    const parametrosFiltradosRoles = (val, update) => {
      filtradoBusquedaObj(val, update, categoriasOpciones.value, categoriasNuevas)
    }
    const guardarProducto = () => {
      if (nuevoRegistro.value) {
        const productoNuevo = { ...productoObj }
        productoNuevo.categoria = productoNuevo.categoria.value
        guardarProductos(productoNuevo)
      } else {
        editarProductos(productoObj)
      }
    }

    return {
      // estados
      modalProductos,
      productoObj,
      categoriasNuevas,
      // metodos
      abrir,
      guardarProducto,
      parametrosFiltradosRoles

    }
  }
}

</script>
