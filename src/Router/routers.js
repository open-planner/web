import Home from '../Views/Home'
import Register from '../Views/Access/Register'
import ROUTE_TYPE from '../Utils/Enums/RouteType'

export default [
  {
    path: '/',
    component: Home,
    type: ROUTE_TYPE.PRIVATE
  },
  {
    path: '/register',
    component: Register,
    type: ROUTE_TYPE.PUBLIC
  }
]