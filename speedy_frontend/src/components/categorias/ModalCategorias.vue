<template>
    <q-dialog v-model="modalCategorias">
       <q-card class="full-width">
         <q-card-section class="bg-primary text-white">
            <q-btn icon="close" flat round dense v-close-popup />
           <div class="text-h4 text-center ">
             Categorias
             <q-separator/>
           </div>
         </q-card-section>

         <div class="row q-my-sm" >
          <q-card-section class="col-12 q-pt-none">
            <label>Nombre de la categoria</label>
            <q-input
              v-model="categoriaObj.nombreCategoria"
              label="Ingresa el nombre de la categoria"
              outlined
              />
          </q-card-section>
        </div>

        <q-card-actions align="right">
          <q-btn
            label="Guardar categoria"
            @click="guardarCategoria"
            color="primary"
            v-close-popup
          />
        </q-card-actions>
       </q-card>
     </q-dialog>
 </template>

<script>
import { ref, reactive } from 'vue'
import { useCategoriasStore } from 'src/stores/categorias'
import { editarRegistros } from 'src/helpers/editarRegistros'
import { v4 as uuidv4 } from 'uuid'
import { storeToRefs } from 'pinia'

export default {
  setup () {
    const modalCategorias = ref(false)

    const categoriaObj = reactive({
      _id: '',
      nombreCategoria: ''

    })
    const nuevoRegistro = ref(true)

    const useCategorias = useCategoriasStore()
    const { guardarCategorias, editarCategorias } = useCategorias
    const { categoria } = storeToRefs(useCategorias)

    const abrir = (esNuevoRegistro) => {
      const categoriaNueva = {
        _id: '',
        nombreCategoria: ''
      }
      Object.keys(categoria.value || categoriaObj).forEach(key => {
        categoriaObj[key] = editarRegistros(categoriaNueva, categoria.value, esNuevoRegistro)[key]
      })

      modalCategorias.value = true
      nuevoRegistro.value = esNuevoRegistro
    }
    const guardarCategoria = () => {
      if (nuevoRegistro.value) {
        categoriaObj._id = uuidv4()
        const categoriaNueva = { ...categoriaObj }
        guardarCategorias(categoriaNueva)
      } else {
        editarCategorias(categoriaObj)
      }
    }

    return {
      // estados
      modalCategorias,
      categoriaObj,
      // metodos
      abrir,
      guardarCategoria

    }
  }
}

</script>
