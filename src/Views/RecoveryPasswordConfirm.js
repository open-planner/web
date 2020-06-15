import React, { Component } from 'react'
import { Button, Card, Result, Row, Form, Input } from 'antd';
import { SmileOutlined } from '@ant-design/icons';
import "../Assets/css/EmailConfirm.scss"
import api from '../Services/API';
import Validation from '../Utils/Validation'

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const validateMessages = {
  required: '${label} is obrigatório!',
  types: {
    email: '${label} não é um email valido!',
  }
};

export default class Login extends Component {
  state = {
    showFeedbackEmail: false,
    loading: false,
    token: undefined
  }

  componentDidMount = async () => {
    const path = window.location.hash.split('/')

    this.setState({
      token: path[2]
    })
  }

  loading = bool => this.setState({ loading: bool })

  onFinish = async values => {
    this.loading(true)

    const data = await api.patch('/public/usuarios/senha', {
      token: this.state.token,
      senha: values.senha
    })

    if (data) {
      this.setState({
        showFeedbackEmail: true
      })
    }
  };

  render() {
    const { showFeedbackEmail } = this.state
    return (
      <div className="container-centered">
        {
          !showFeedbackEmail ?
            <Card>
              <Form name="nest-messages" onFinish={this.onFinish} validateMessages={validateMessages}>
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
                <Form.Item>
                  <Row justify="space-between">
                    <Button type="default" href="/" className="mr-2">
                      voltar
                  </Button>
                    <Button type="primary" loading={this.state.loading} htmlType="submit">
                      Recuperar
                  </Button>
                  </Row>
                </Form.Item>
              </Form>
            </Card>
            :
            <Card>
              <Result
                icon={<SmileOutlined />}
                title={"Senha alterada com sucesso, entre agora no sistema usando sua nova senha."}
                extra={<Button type="primary" href="/">Acessar</Button>}
              />
            </Card>}
      </div>
    )
  }
}
