import React, { Component } from 'react'
import { Form, Input, Button, Checkbox, Card, notification } from 'antd';
import "../../Assets/css/Login.scss"
import api from '../../Services/API';
import Auth from '../../Utils/Auth';

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

export default class Login extends Component {
  onFinish = async values => {
    delete values.remember

    const result = await api.post('/oauth/token', {
      ...values,
      grant_type: 'password'
    })

    if (result) {
      Auth.setToken(result.access_token)
      Auth.setUser({ name: result.nome })
      notification.open({
        message: 'Success',
        description: "Logado com sucesso.",
      });
      window.location.href = '/'
    } else {
      notification.open({
        message: 'Acesso',
        description: "Login ou senha errada.",
      });
    }
  };

  render() {
    return (
      <div className="container-centered">
        <Card>
          <Form
            {...layout}
            name="basic"
            initialValues={{ remember: true }}
            onFinish={this.onFinish}
          >
            <Form.Item
              label="Usuário"
              name="username"
              rules={[{ required: false, message: 'Por favor insira seu email.' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Senha"
              name="password"
              rules={[{ required: false, message: 'Por favor insira sua senha.' }]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item {...tailLayout} name="remember" valuePropName="checked">
              <Checkbox>Lembrar de mim?</Checkbox>
            </Form.Item>

            <Form.Item {...tailLayout}>
              <Button type="primary" htmlType="submit">
                Entrar
              </Button>
            </Form.Item>
          </Form >
        </Card>
      </div>
    )
  }
}
