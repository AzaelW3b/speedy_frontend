import dayjs from 'dayjs'
import { es } from 'dayjs/locale/es'

export const formatearFecha = (stringFecha) => dayjs(stringFecha).locale('es').format('DD/MMMM/YYYY')
console.log(es)
