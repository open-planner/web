import React, { Component } from 'react'
import { Form, Input, InputNumber, Button, Card, Row, DatePicker, notification } from 'antd';
import logo from '../../Assets/image/cotton-bureau-brands.svg'
import api from '../../Services/API';
import _ from 'lodash'
import Title from 'antd/lib/typography/Title';
import Validation from '../../Utils/Validation'
import locale from 'antd/es/date-picker/locale/pt_BR';

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const validateMessages = {
  required: '${label} is obrigatório!',
  types: {
    email: '${label} não é um email valido!',
  },
  number: {
    range: '${label} must be between ${min} and ${max}',
  },
};

export default class Register extends Component {
  state = {
    showFeedbackEmail: false
  }
  onFinish = async values => {
    await api.post('/public/usuarios', {
      ...values.user,
      senha: values.senha
    })

    this.setState({
      showFeedbackEmail: true
    })
  };

  render() {
    return (
      <div className="container-centered">
        {
          this.state.showFeedbackEmail ?
            <Card>
              <div style={{ textAlign: 'center', margin: 30 }}>
                <img width="100" src={logo} />
                <h1>Open Planner  </h1>
                <Title level={3}>Você receberá um email de confirmação em breve.</Title>
                <Button type={'primary'} href={'/login'}>Voltar</Button>
              </div>
            </Card>
            : <Card>
              <div style={{ textAlign: 'center', margin: 30 }}>
                <img width="100" src={logo} />
                <h1>Open Planner  </h1>
              </div>
              <Form {...layout} name="nest-messages" onFinish={this.onFinish} validateMessages={validateMessages}>
                <Form.Item name={['user', 'nome']} label="Primeiro Nome" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
                <Form.Item name={['user', 'email']} label="Email" rules={[{ type: 'email', required: true }]}>
                  <Input />
                </Form.Item>
                <Form.Item name={['user', 'dataNascimento']} label="Data Nascimento" rules={[{ required: true }]}>
                  <DatePicker placeholder="Selecione a data" locale={locale} />
                </Form.Item>
                <Form.Item
                  name={'senha'}
                  label="Senha"
                  rules={[
                    {
                      required: true,
                      message: 'Por favor insira uma senha!',
                    },
                    ({ getFieldValue }) => ({
                      validator(rule, value) {
                        if (!value || Validation.password(value)) {
                          return Promise.resolve();
                        }
                        return Promise.reject('Deve possuir letras(Maiúscula e Minúscula), número, char especial e ser maior que 8 char.');
                      },
                    })
                  ]}
                  hasFeedback
                >
                  <Input.Password />
                </Form.Item>
                <Form.Item
                  name="confirm"
                  label="Confirmar senha"
                  dependencies={['senha']}
                  hasFeedback
                  rules={[
                    {
                      required: true,
                      message: 'Por favor confirme sua senha!',
                    },
                    ({ getFieldValue }) => ({
                      validator(rule, value) {
                        if (!value || getFieldValue('senha') === value) {
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
                      Cadastrar
              </Button>
                  </Row>
                </Form.Item>
              </Form>
            </Card>
        }

      </div>
    )
  }
}
