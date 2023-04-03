
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
      { path: 'roles', icono: 'manage_accounts', label: 'Roles de usuario', name: 'roles', component: () => import('src/modules/roles/RolesModule.vue') },
      { path: 'usuarios', icono: 'person', label: 'Usuarios', name: 'usuarios', component: () => import('src/modules/usuarios/UsuariosModule.vue') },
      { path: 'clientes', icono: 'account_box', label: 'Clientes', name: 'clientes', component: () => import('src/modules/clientes/ClientesModule.vue') },
      { path: 'categorias', icono: 'category', label: 'Categorias', name: 'categorias', component: () => import('src/modules/categorias/CategoriasModule.vue') },
      { path: 'productos', icono: 'inventory', label: 'Productos', name: 'productos', component: () => import('src/modules/productos/ProductosModule.vue') },
      { path: 'ventas', icono: 'shopping_cart', label: 'Ventas', name: 'ventas', component: () => import('src/modules/ventas/VentasModule.vue') }
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
