import React, { Component } from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import routes from './routers'
import App from '../Views/App'
import Page404 from '../Views/Page404'
import RouteType from '../Utils/Enums/RouteType'

export default class index extends Component {
  renderAppBase = route => (
    <>
      {
        route.type === RouteType.PRIVATE ?
          <App
            {...this.props}
            content={route.component}>
          </App>
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
