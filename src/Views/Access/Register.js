import React, { Component } from 'react'
import { Form, Input, InputNumber, Button, Card, Row } from 'antd';

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const validateMessages = {
  required: '${label} is required!',
  types: {
    email: '${label} is not validate email!',
    number: '${label} is not a validate number!',
  },
  number: {
    range: '${label} must be between ${min} and ${max}',
  },
};

export default class Register extends Component {
  onFinish = values => {
    // TODO - deve salvar as alterações do usuário
  };

  render() {
    return (
      <div className="container-centered">
        <Card>
          <Form {...layout} name="nest-messages" onFinish={this.onFinish} validateMessages={validateMessages}>
            <Form.Item name={['user', 'name']} label="Nome" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name={['user', 'email']} label="Email" rules={[{ type: 'email', required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name={['user', 'age']} label="Data Nascimento" rules={[{ type: 'date', min: 0, max: 99 }]}>
              <InputNumber />
            </Form.Item>
            <Form.Item
              name="password"
              label="Senha"
              rules={[
                {
                  required: true,
                  message: 'Please input your password!',
                },
              ]}
              hasFeedback
            >
              <Input.Password />
            </Form.Item>
            <Form.Item
              name="confirm"
              label="Confirmar senha"
              dependencies={['password']}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: 'Por favor confirme sua senha!',
                },
                ({ getFieldValue }) => ({
                  validator(rule, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject('As senhas não conferem.');
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
              <Row justify="space-between">
                <Button type="default" href="/" className="mr-2">
                  voltar
              </Button>
                <Button type="primary" htmlType="submit">
                  Submit
              </Button>
              </Row>
            </Form.Item>
          </Form>
        </Card>
      </div>
    )
  }
}
