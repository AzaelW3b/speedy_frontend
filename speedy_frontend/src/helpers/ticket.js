import JsPdf from 'jspdf'

export const generarTicket = (venta) => {
  const doc = new JsPdf({
    unit: 'mm',
    format: [80, 150]
  })

  // Añade el contenido del ticket al PDF
  const img = new Image()
  img.src = 'https://speedyapp.netlify.app/assets/speedy.3883bbfb.png'

  img.onload = () => {
    const imgWidth = 40
    const imgHeight = (imgWidth * img.naturalHeight) / img.naturalWidth

    function centrarVerticalmente (texto, altura) {
      const textoWidth = doc.getStringUnitWidth(texto) * doc.internal.getFontSize() / doc.internal.scaleFactor
      const xPos = (doc.internal.pageSize.getWidth() - textoWidth) / 2
      const yPos = (doc.internal.pageSize.getHeight() - altura) / 2
      doc.text(texto, xPos, yPos)
    }

    doc.setFontSize(12)
    centrarVerticalmente('¡Gracias por comprar en Speedy!', imgHeight + 20)

    // Muestra los productos en una tabla o lista
    doc.setFontSize(10)
    let yPos = imgHeight + 30 // Ajusta la posición vertical para los productos
    for (let i = 0; i < venta.productos.length; i++) {
      doc.text(`Producto: ${venta.productos[i]?.label || venta.productos[i]?.nombreProducto}`, 10, yPos)
      doc.text('   ' + `Precio: ${venta.productos[i].precio.toString()}`, 40, yPos)
      yPos += 5 // Ajusta el espaciado vertical entre productos
    }

    // Muestra el total en negrita y ubicado en la parte inferior
    const totalYPos = doc.internal.pageSize.getHeight() - 10
    doc.text('TOTAL:', 10, totalYPos)
    doc.text(venta.total.toString(), 40, totalYPos)

    // Obtiene los datos del PDF como una URL
    const pdfDataUri = doc.output('datauristring')

    // Crea una ventana emergente con el contenido del PDF
    const printWindow = window.open('', '_blank')
    printWindow.document.write(`<iframe width="100%" height="100%" src="${pdfDataUri}"></iframe>`)
  }
}
