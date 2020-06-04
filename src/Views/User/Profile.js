import React, { Component } from 'react'
import { Card, Row, Col, Typography, Button, Form, Input, Modal } from 'antd'
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
      name: '',
      birthday: moment().format('DD/MM/YYYY'),
    },
    canUpdate: false, // when changed contents the button update show
    updating: false,//when to update, feedback tooo user
    visible: false,
  }

  componentDidMount = async () => {
    const data = await api.get('/me')

    this.setState({
      payload: {
        ...data,
        birthday: data.dataNascimento,
        name: data.nome
      }
    })
  }

  update = async () => {
    const { payload } = this.state
    this.setState({
      updating: true
    })

    await api.put(`/usuarios/${payload.id}`, {
      dataNascimento: payload.birthday,
      email: payload.email,
      nome: payload.name,
      permissoes: [0]
    })

    this.setState({
      updating: false,
      canUpdate: false
    })
  }

  handlerData = ({ str, name }) => {
    this.setState({ payload: { ...this.state.payload, [name]: str }, canUpdate: true });
  };

  changePassword = (values) => {
    const data = api.patch('/me/senha', {
      senhaAtual: values.oldPassword,
      senhaNova: values.password
    })
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
    const { name, email, birthday } = payload

    return (
      <div>
        <this.renderModalChangePass {...this.props} />
        <Card>
          <Row>

            {/* side image and name */}
            <Col span={8}>
              <img width="200" className='rounded-half' src="https://avatars3.githubusercontent.com/u/7293460?s=460&u=21129945ae938a79315447fe67ef8aeff2d4294e&v=4" />
              <Title level={3} className="mt-6">{name}</Title>
            </Col>
            {/* side content user */}
            <Col offset={2}>
              <Text disabled>Email:</Text>
              <Paragraph editable={{ onChange: str => this.handlerData({ str, name: 'email' }) }}>{email}</Paragraph>
              <Text disabled>Data de Nascimento:</Text>
              <Paragraph editable={{ onChange: str => this.handlerData({ str, name: 'birthday' }) }}>{moment(birthday).format('DD/MM/YYYY')}</Paragraph>
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
