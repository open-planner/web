import Home from '../Views/Home'
import Register from '../Views/Access/Register'
import Login from '../Views/Access/Login'
import EmailConfirm from '../Views/EmailConfirm'
import Profile from '../Views/User/Profile'
import LifeWheel from '../Views/LifeWheel'

import ROUTE_TYPE from '../Utils/Enums/RouteType'

export default [
  {
    path: '/',
    title: 'Inicio',
    component: Home,
    type: ROUTE_TYPE.PRIVATE
  },
  {
    path: '/login',
    title: '',
    component: Login,
    type: ROUTE_TYPE.PUBLIC
  },
  {
    path: '/register',
    title: '',
    component: Register,
    type: ROUTE_TYPE.PUBLIC
  },
  {
    path: '/email-confirm',
    title: '',
    component: EmailConfirm,
    type: ROUTE_TYPE.PUBLIC
  },
  {
    path: '/life-wheel',
    title: 'Roda da Vida',
    component: LifeWheel,
    type: ROUTE_TYPE.PRIVATE
  },
  {
    path: '/profile/:id',
    title: 'Perfil',
    component: Profile,
    type: ROUTE_TYPE.PRIVATE
  }
]