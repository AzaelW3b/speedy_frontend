import { storeToRefs } from 'pinia'
import { useAutenticacionStore } from 'src/stores/autenticaciones'

function checarRole (to, from, next, rol) {
  const useAutenticacion = useAutenticacionStore()
  const { usuarioAutenticado } = storeToRefs(useAutenticacion)

  if (usuarioAutenticado && rol?.includes(usuarioAutenticado?.value?.usuario?.rol)) {
    console.log(usuarioAutenticado?.value?.usuario?.rol === rol)
    next()
  } else {
    // console.log('toooo', to)
    // console.log('froooom', from)
    next({ name: 'dashboard' })
  }
}

const routes = [
  {
    path: '/',
    name: 'login',
    component: () => import('pages/LoginPage.vue')
  },
  {
    path: '/principal',
    name: 'principal',
    meta: { auth: true },
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', icono: 'dashboard', label: 'Inicio', name: 'dashboard', component: () => import('src/modules/dashboard/DashBoard.vue') },
      {
        path: 'roles',
        icono: 'manage_accounts',
        label: 'Roles de usuario ',
        // se ponen los roles que no debe ver cierto usuario
        meta: { roles: ['cajero', 'socio'] },
        name: 'roles',
        component: () => import('src/modules/roles/RolesModule.vue'),
        // usuario que si puede ver
        beforeEnter: (to, from, next) => checarRole(to, from, next, 'admin')
      },
      {
        path: 'usuarios',
        icono: 'person',
        label: 'Usuarios',
        // se ponen los roles que no debe ver cierto usuario
        meta: { roles: ['cajero', 'socio'] },
        name: 'usuarios',
        // usuario que si puede ver
        component: () => import('src/modules/usuarios/UsuariosModule.vue'),
        beforeEnter: (to, from, next) => checarRole(to, from, next, 'admin')
      },
      {
        path: 'clientes',
        icono: 'account_box',
        label: 'Clientes',
        name: 'clientes',
        // se ponen los roles que no debe ver cierto usuario
        meta: { roles: ['socio'] },
        // usuario que si puede ver
        component: () => import('src/modules/clientes/ClientesModule.vue'),
        beforeEnter: (to, from, next) => checarRole(to, from, next, ['admin', 'cajero'])

      },
      {
        path: 'categorias',
        icono: 'category',
        label: 'Categorias',
        name: 'categorias',
        // se ponen los roles que no debe ver cierto usuario
        meta: { roles: ['socio'] },
        component: () => import('src/modules/categorias/CategoriasModule.vue'),
        // usuario que si puede ver
        beforeEnter: (to, from, next) => checarRole(to, from, next, ['admin', 'cajero'])

      },
      {
        path: 'productos',
        icono: 'inventory',
        label: 'Productos',
        name: 'productos',
        // se ponen los roles que no debe ver cierto usuario
        meta: { roles: ['socio'] },
        // usuario que si puede ver
        component: () => import('src/modules/productos/ProductosModule.vue'),
        beforeEnter: (to, from, next) => checarRole(to, from, next, ['admin', 'cajero'])

      },
      {
        path: 'inventario',
        icono: 'storefront',
        label: 'Control de inventario',
        name: 'inventario',
        // se ponen los roles que no debe ver cierto usuario
        meta: { roles: ['socio'] },
        // usuario que si puede ver
        component: () => import('src/modules/inventario/InventarioModule.vue'),
        beforeEnter: (to, from, next) => checarRole(to, from, next, ['admin', 'cajero'])

      },
      {
        path: 'ventas',
        icono: 'shopping_cart',
        label: 'Ventas',
        name: 'ventas',
        // se ponen los roles que no debe ver cierto usuario
        meta: { roles: ['socio'] },
        // usuario que si puede ver
        component: () => import('src/modules/ventas/VentasModule.vue'),
        beforeEnter: (to, from, next) => checarRole(to, from, next, ['admin', 'cajero'])

      },
      {
        path: 'compras',
        icono: 'shopping_cart',
        label: 'Mis compras',
        name: 'compras',
        // se ponen los roles que no debe ver cierto usuario
        meta: { roles: ['admin', 'cajero'] },
        // usuario que si puede ver
        component: () => import('src/modules/compras/ComprasModule.vue'),
        beforeEnter: (to, from, next) => checarRole(to, from, next, 'socio')
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
