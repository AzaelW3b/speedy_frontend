import { Notify } from 'quasar'

export const mensajeUsuario = (tipo, mensaje) => {
  Notify.create({
    type: tipo,
    message: mensaje,
    class: 'glosy',
    actions: [
      { label: 'Cerrar', color: 'white', handler: () => {} }
    ]
  })
}
