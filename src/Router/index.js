import React, { Component } from 'react'
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'
import routes from './routers'
import App from '../Views/App'
import Page404 from '../Views/Page404'
import RouteType from '../Utils/Enums/RouteType'
import Auth from '../Utils/Auth'

const renderAppBase = ({ props, route }) => (
  <>
    {
      route.type === RouteType.PRIVATE ?
        Auth.getToken() ?
          <App
            {...props}
            {...route}
            content={route.component}>
          </App>
          : <Redirect to="/login" />
        : <route.component {...props} />
    }
  </>
)
export default class index extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          {
            routes.map((route, i) => <Route key={i} path={route.path} exact={true} render={props => renderAppBase({ props, route })} />)
          }
          <Route path='*' component={Page404} />
        </Switch>
      </ BrowserRouter>
    )
  }
}
