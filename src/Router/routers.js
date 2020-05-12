import Home from '../Views/Home'
import Register from '../Views/Access/Register'
import Login from '../Views/Access/Login'

import ROUTE_TYPE from '../Utils/Enums/RouteType'

export default [
  {
    path: '/',
    component: Home,
    type: ROUTE_TYPE.PRIVATE
  },
  {
    path: '/login',
    component: Login,
    type: ROUTE_TYPE.PUBLIC
  },
  {
    path: '/register',
    component: Register,
    type: ROUTE_TYPE.PUBLIC
  }
]