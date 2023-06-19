<template>
    <q-layout>
      <div class="q-pa-md">
        <div div class="q-pa-md">
          <h4>Clientes</h4>
        </div>
        <q-separator color="primary" class="q-my-md" inset />
        <q-btn
          label="Nuevo cliente"
          color="primary"
          class="q-my-md"
          icon="add"
          @click="nuevoCliente"
        />
        <q-table
          color="primary"
          :rows="clientes"
          :columns="columns"
          :filter="buscar"
          >
          <template v-slot:body-cell-acciones="props">
            <q-td>
              <q-btn
                @click="generarMembresia(props.row)"
                flat
                color="dark"
                icon="card_membership"
              >
                <q-tooltip>{{ `Generar la membresia del cliente ${props.row.nombreCliente}` }}</q-tooltip>
              </q-btn>
              <q-btn
                @click="clienteEditarId(props.row._id)"
                flat
                color="dark"
                icon="edit"
              >
                <q-tooltip>{{ `Editar al cliente ${props.row.nombreCliente}` }}</q-tooltip>
              </q-btn>
              <q-btn
                @click="confirmarEliminarCliente(props.row)"
                flat
                color="negative"
                icon="delete"
              >
                <q-tooltip>{{ `Eliminar al cliente ${props.row.nombreCliente}` }}</q-tooltip>
              </q-btn>
            </q-td>
          </template>
        </q-table>
        <ModalClientes ref="modalClientes"/>

      </div>
    </q-layout>
  </template>
<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { storeToRefs } from 'pinia'
import { useClientesStore } from 'src/stores/clientes'
import ModalClientes from '../../components/clientes/ModalClientes.vue'
import { PDFDocument } from 'pdf-lib'
import jsbarcode from 'jsbarcode'
// , StandardFonts
// import speedyImg from '../../assets/speedy.png'

const useClientes = useClientesStore()
const { obtenerClienteId, eliminarClientes } = useClientes
const { clientes } = storeToRefs(useClientes)

const columns = [
  {
    name: 'nombreCliente',
    label: 'Nombre del cliente',
    field: 'nombreCliente',
    align: 'left',
    sortable: true
  },
  {
    name: 'telefono',
    label: 'Teléfono',
    field: 'telefono',
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
    name: 'invitadoPorId',
    label: 'Invitado por',
    field: row => row.invitadoPor ? obtenerNombreCliente(row.invitadoPor) : 'No fue invitado por alguien',
    align: 'left',
    sortable: true
  },
  {
    name: 'invitados',
    label: 'Cantidad de invitados',
    field: row => row?.invitados?.length,
    align: 'left',
    sortable: true
  },
  {
    name: 'rol',
    label: 'Rol',
    field: 'rol',
    align: 'left',
    sortable: true
  },
  {
    name: 'tipoMembresia',
    label: 'Tipo de membresia',
    field: 'tipoMembresia',
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

const modalClientes = ref(null)
const buscar = ref('')
const notificacion = useQuasar()

const nuevoCliente = () => {
  modalClientes.value.abrir(true)
}

const clienteEditarId = (id) => {
  obtenerClienteId(id)
  modalClientes.value.abrir(false)
}
const obtenerNombreCliente = (id) => {
  const clienteNombre = clientes.value.find(cliente => cliente._id === id)
  return clienteNombre?.nombreCliente
}
const generarMembresia = async (cliente) => {
  const jpgUrl = 'https://scontent-qro1-2.xx.fbcdn.net/v/t39.30808-6/300852363_1113950009545109_2152687438122050667_n.jpg?_nc_cat=101&cb=99be929b-59f725be&ccb=1-7&_nc_sid=09cbfe&_nc_eui2=AeFBNOCiXIql1Ct0biQd1ydU1LoWQHC64MvUuhZAcLrgy4dimOeKJ5Fi3X5kArPnDMxzUjwo9UMBBHQYsLMmU03T&_nc_ohc=38t9sgXOaYQAX-xWYda&_nc_ht=scontent-qro1-2.xx&oh=00_AfDWDUG38ISf99EBchSK2cyHT1yQFksqjiugeq5WlfXHTw&oe=6494FDFB'
  const jpgImageBytes = await fetch(jpgUrl).then(res => res.arrayBuffer())
  const pdfDoc = await PDFDocument.create()

  const pageWidth = 85.6
  const pageHeight = 53.98
  const pageOne = pdfDoc.addPage([pageWidth, pageHeight])

  const jpgImage = await pdfDoc.embedJpg(jpgImageBytes)

  const jpgDims = jpgImage.scale(0.1)

  const x = (pageWidth - jpgDims.width) / 2
  const y = (pageHeight - jpgDims.height) / 2

  pageOne.drawImage(jpgImage, {
    x,
    y,
    width: jpgDims.width,
    height: jpgDims.height
  })

  const pageTwo = pdfDoc.addPage([pageWidth, pageHeight])
  const font = await pdfDoc.embedFont('Helvetica')
  const size = 5
  pageTwo.setFontSize(1)

  const textWidth = font.widthOfTextAtSize(cliente.nombreCliente, size)
  const x2 = (pageWidth - textWidth) / 2
  const y2 = pageHeight - 20

  pageTwo.drawText(cliente.nombreCliente, {
    x: x2,
    y: y2,
    font,
    size,
    alignment: 'center'
  })

  const membresiaX = x2 + 4
  const membresiaY = y2 - 8

  pageTwo.drawText(`Membresia tipo ${cliente.tipoMembresia}`, {
    x: membresiaX,
    y: membresiaY,
    font,
    size,
    alignment: 'left'
  })

  const correoX = membresiaX - 7
  const correoY = membresiaY - 8

  pageTwo.drawText(`${cliente.correo}`, {
    x: correoX,
    y: correoY,
    font,
    size,
    alignment: 'left'
  })
  const barcodeCanvas = document.createElement('canvas')

  jsbarcode(barcodeCanvas, cliente.codigoBarras, {
    format: 'CODE128',
    width: 1.5,
    height: 30,
    displayValue: false
  })
  const barcodeImage = await pdfDoc.embedPng(barcodeCanvas.toDataURL())
  const barcodeDims = barcodeImage.scale(0.5)
  const barcodeX = x2 + 10
  const barcodeY = correoY - 30

  pageTwo.drawImage(barcodeImage, {
    x: barcodeX,
    y: barcodeY,
    width: barcodeDims.width,
    height: barcodeDims.height
  })

  const pdfBytes = await pdfDoc.save()
  const blob = new Blob([pdfBytes], { type: 'application/pdf' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.download = `membresia${cliente.nombreCliente}.pdf`
  link.click()

  URL.revokeObjectURL(url)
}
const confirmarEliminarCliente = (cliente) => {
  notificacion.dialog({
    title: `¿Deseas eliminar al cliente ${cliente.nombreCliente}?`,
    message: 'Una vez le des en "ok" no se podrá recuperar al cliente',
    cancel: true,
    persistent: true
  }).onOk(() => {
    eliminarClientes(cliente._id)
  }).onCancel(() => {
    console.log('cancelando.....')
  })
}
</script>
