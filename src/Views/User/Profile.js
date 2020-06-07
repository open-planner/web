import React, { Component } from 'react'
import { Card, Row, Col, Typography, Button, Form, Input, Modal, Skeleton, notification } from 'antd'
import moment from 'moment';
import {
  LockOutlined,
} from '@ant-design/icons';
import api from '../../Services/API';

const { Title, Paragraph, Text } = Typography
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

export default class Profile extends Component {
  state = {
    payload: {
      email: '',
      nome: '',
      dataNascimento: undefined,
    },
    canUpdate: false, // when changed contents the button update show
    updating: false,//when to update, feedback tooo user
    visible: false,
  }

  componentDidMount = async () => {
    this.setState({
      payload: await api.get('/me')
    })
  }

  update = async () => {
    const { payload } = this.state
    this.setState({
      updating: true
    })

    const data = await api.put(`/me`, {
      nome: payload.nome,
      dataNascimento: payload.dataNascimento,
      email: payload.email
    })

    if (data) {
      notification.open({
        message: 'Sucesso',
        description: `Dados alterado com sucesso.`,
      });

      this.setState({
        updating: false,
        canUpdate: false,
        payload: {
          nome: payload.nome,
          dataNascimento: payload.dataNascimento,
          email: payload.email
        }
      })
    }
  }

  handlerData = ({ str, name }) => {
    this.setState({ payload: { ...this.state.payload, [name]: str }, canUpdate: true });
  };

  changePassword = async values => {
    const data = await api.patch('/me/senha', {
      senhaAtual: values.oldPassword,
      senhaNova: values.password
    })

    if (data) {
      notification.open({
        message: 'Sucesso',
        description: `Senha alterada com sucesso.`,
      });

      this.setState({
        updating: false,
        canUpdate: false,
        visible: false
      })
    }
  }

  //RENDERS
  renderModalChangePass = () =>
    <Modal
      title="Alterar senha"
      visible={this.state.visible}
      okButtonProps={{ form: 'category-editor-form', key: 'submit', htmlType: 'submit' }}
      onCancel={() => this.setState({ visible: !this.state.visible })}>
      <Form id="category-editor-form" onFinish={this.changePassword} {...layout} name="nest-messages" validateMessages={validateMessages}>
        <Form.Item
          name="oldPassword"
          label="Senha Antiga"
          onChange={this.handlerInput}
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

        {/* new password */}
        <Form.Item
          name="password"
          label="Nova Senha"
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
      </Form>
    </Modal>


  render() {
    const { updating, canUpdate, payload } = this.state
    const { nome, email, dataNascimento } = payload

    return (
      <div>
        <this.renderModalChangePass {...this.props} />
        <Card>
          <Row>

            {/* side image and name */}
            <Col span={8}>
              <img style={{ width: '100%' }} className='rounded-half' src="https://image.freepik.com/vetores-gratis/ilustracao-do-conceito-de-portfolio_114360-210.jpg" />
            </Col>
            {/* side content user */}
            <Col offset={2}>
              <Text disabled>Nome:</Text>
              {
                nome ?
                  <Paragraph editable={{ onChange: str => this.handlerData({ str, name: 'nome' }) }}>{nome}</Paragraph>
                  : <Skeleton.Input active={true} size={"large"} />
              }
              <Text disabled>Email:</Text>
              {
                email ?
                  <Paragraph editable={{ onChange: str => this.handlerData({ str, name: 'email' }) }}>{email}</Paragraph>
                  : <Skeleton.Input active={true} size={"large"} />
              }
              <Text disabled>Data de Nascimento:</Text>
              {
                dataNascimento ?
                  <Paragraph editable={{ onChange: str => this.handlerData({ str, name: 'dataNascimento' }) }}>{moment(dataNascimento).format('DD/MM/YYYY')}</Paragraph>
                  : <Skeleton.Input active={true} size={"large"} />
              }
            </Col>
          </Row>
          <Row justify={'end'}>
            <Col>
              {
                canUpdate &&
                <Button type="primary" className="mr-6" onClick={this.update} loading={updating}>Atualizar</Button>
              }
              <Button icon={<LockOutlined />} type="default" onClick={() => this.setState({ visible: !this.state.visible })}>Alterar Senha</Button>
            </Col>
          </Row>
        </Card>
      </div>
    )
  }
}
