import React, { Component } from 'react'
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'
import routes from './routers'
import App from '../Views/App'
import Page404 from '../Views/Page404'
import RouteType from '../Utils/Enums/RouteType'
import Auth from '../Utils/Auth'

export default class index extends Component {
  renderAppBase = route => (
    <>
      {
        route.type === RouteType.PRIVATE ?
          Auth.getToken() ?
            <App
              {...this.props}
              {...route}
              content={route.component}>
            </App>
            : <Redirect to="/login" />
          : <route.component {...this.props} />
      }
    </>
  )

  render() {
    return (
      <BrowserRouter>
        <Switch>
          {
            routes.map(route => <Route path={route.path} exact={true} component={() => this.renderAppBase(route)} />)
          }
          <Route path='*' component={Page404} />
        </Switch>
      </ BrowserRouter>
    )
  }
}
