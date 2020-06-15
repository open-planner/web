import React, { Component } from 'react'
import { Button, Card, Result, Row, Form, Input } from 'antd';
import { SmileOutlined } from '@ant-design/icons';
import "../Assets/css/EmailConfirm.scss"
import api from '../Services/API';

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
    loading: false
  }

  loading = bool => this.setState({ loading: bool })

  onFinish = async values => {
    this.loading(true)
    const data = await api.post('/public/usuarios/recuperacao/senha', {
      ...values
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
                  name={'email'}
                  label="Email"
                  rules={[{ required: true }]}>
                  <Input placeholder="Informe seu email" />
                </Form.Item>
                <p>Você irá receber um email com mais detalhes para alterar a sua senha.</p>
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
                title={"Verifique sua caixa de email."}
              />
            </Card>}
      </div>
    )
  }
}
