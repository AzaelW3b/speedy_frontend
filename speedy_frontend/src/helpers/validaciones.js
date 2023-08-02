
export const validacionCampoVacio = (valor, mensaje) => {
  return (valor && valor.length > 0) || mensaje
}
