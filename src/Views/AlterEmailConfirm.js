import React, { Component } from 'react'
import { Button, Card, Result } from 'antd';
import { SmileOutlined } from '@ant-design/icons';
import "../Assets/css/EmailConfirm.scss"
import api from '../Services/API';

export default class Login extends Component {
  state = {
    alreadyConfirmed: false
  }
  componentDidMount = async () => {
    const path = window.location.hash.split('/')

    const result = await api.post('/public/usuarios/atualizacao/email', {
      token: path[2]
    })

    if (result) {
      this.setState({
        alreadyConfirmed: true
      })
    }
  }

  render() {
    const { alreadyConfirmed } = this.state
    return (
      <div className="container-centered">
        {
          alreadyConfirmed &&
          <Card>
            <Result
              icon={<SmileOutlined />}
              title={"Seu email foi alterado e confirmado com sucesso, faça login."}
              extra={<Button type="primary" href="/">Acessar</Button>}
            />
          </Card>}
      </div>
    )
  }
}
