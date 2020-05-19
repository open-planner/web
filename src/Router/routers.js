import Home from '../Views/Home'
import Register from '../Views/Access/Register'
import Login from '../Views/Access/Login'
import EmailConfirm from '../Views/EmailConfirm'
import Profile from '../Views/User/Profile'
import LifeWheel from '../Views/LifeWheel'
import Tags from '../Views/Tags'
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
    path: '/profile',
    title: 'Perfil',
    component: Profile,
    type: ROUTE_TYPE.PRIVATE
  },
  {
    path: '/tags',
    title: 'Tags',
    component: Tags,
    type: ROUTE_TYPE.PRIVATE
  }
]