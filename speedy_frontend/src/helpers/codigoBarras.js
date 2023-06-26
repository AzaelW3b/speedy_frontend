import JsPdf from 'jspdf'
import JsBarcode from 'jsbarcode'
const generateAndDownloadBarcodeInPDF = (cliente) => {
  const makeBase64Image = convertTextToBase64Barcode(cliente.folio)

  convertBase64ToPNGImage(makeBase64Image).then((realImage) => {
    const doc = new JsPdf({
      orientation: 'landscape',
      unit: 'mm',
      format: [85, 54]
    })
    doc.addImage('dist/spa/assets/speedy.3883bbfb.png', 'PNG', 0, 0, doc.internal.pageSize.getWidth(), doc.internal.pageSize.getHeight())

    doc.addPage()
    // Texto a centrar
    const nombreCliente = cliente.nombreCliente
    const tipoMembresia = cliente.tipoMembresia.includes('Sin') ? 'Sin Tipo de Membresia' : `Membresia tipo ${cliente.tipoMembresia}`
    const pageWidth = doc.internal.pageSize.getWidth()

    // Obtener el ancho del nombreCliente
    const fontSize = 15 // Tamaño de la fuente
    const textWidthCliente = doc.getStringUnitWidth(nombreCliente) * fontSize / doc.internal.scaleFactor
    const textWidthMembresia = doc.getStringUnitWidth(tipoMembresia) * fontSize / doc.internal.scaleFactor

    // Calcular la posición horizontal centrada
    const xPosition = (pageWidth - textWidthCliente) / 2
    const xPositionMembresia = (pageWidth - textWidthMembresia) / 2
    // Agregar contenido en la nueva página
    doc.text(xPosition, 16, nombreCliente)
    doc.text(xPositionMembresia, 25, tipoMembresia)

    doc.addImage(realImage, 'PNG', 3, 41, 80, 10)

    doc.save(`Membresia ${cliente.nombreCliente}`)
  })
}

const convertBase64ToPNGImage = (url) => {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.src = url
  })
}

const convertTextToBase64Barcode = (text) => {
  const canvas = document.createElement('canvas')
  JsBarcode(canvas, text, { format: 'CODE39' })
  return canvas.toDataURL('image/png')
}

export { generateAndDownloadBarcodeInPDF }
