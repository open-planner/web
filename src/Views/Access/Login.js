import React, { Component } from 'react'
import { Form, Input, Button, Checkbox, Card } from 'antd';
import "../../Assets/css/Login.scss"

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

export default class Login extends Component {
  onFinish = values => {
    // TODO - quando salvar oo login deve efetuar oo mesmo
  };

  onFinishFailed = errorInfo => {
    // TODO - quando der erro no login pode fazer alguma coisa
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
            onFinishFailed={this.onFinishFailed}
          >
            <Form.Item
              label="Username"
              name="username"
              rules={[{ required: true, message: 'Please input your username!' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: 'Please input your password!' }]}
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
