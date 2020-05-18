import React, { Component } from 'react'
import { Button, Card, Result } from 'antd';
import { SmileOutlined } from '@ant-design/icons';
import "../Assets/css/EmailConfirm.scss"

export default class Login extends Component {
  render() {
    return (
      <div className="container-centered">
        <Card>
          <Result
            icon={<SmileOutlined />}
            title="Seja bem vindo, Sua conta agora esta confirmada, vamos entre!"
            extra={<Button type="primary" href="/">Acessar</Button>}
          />
        </Card>
      </div>
    )
  }
}
