import React, { Component } from 'react'
import { Card, Row, Col, Typography, Button, Form, Input, Modal } from 'antd'
import moment from 'moment';
import {
  LockOutlined,
} from '@ant-design/icons';
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
    email: 'casinha@gg.com.br',
    name: 'Joerverson Santos',
    birthday: moment().format('DD/MM/YYYY'),
    canUpdate: false, // when changed contents the button update show
    updating: false,//when to update, feedback tooo user
    visible: false
  }

  update = () => {
    this.setState({
      updating: true
    })

    setTimeout(() => {
      this.setState({
        updating: false,
        canUpdate: false
      })
    }, 3000);
  }

  handlerData = ({ str, name }) => {
    this.setState({ [name]: str, canUpdate: true });
  };

  //RENDERS
  renderModalChangePass = () =>
    <Modal
      title="Alterar senha"
      visible={this.state.visible}
      onOk={this.handleOk}
      onCancel={() => this.setState({ visible: !this.state.visible })}>
      <Form {...layout} name="nest-messages" onFinish={this.onFinish} validateMessages={validateMessages}>
        <Form.Item
          name="password"
          label="Senha Antiga"
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
    const { updating, canUpdate, name, email, birthday } = this.state
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
              <Text disabled>Data de aniversário:</Text>
              <Paragraph editable={{ onChange: str => this.handlerData({ str, name: 'birthday' }) }}>{birthday}</Paragraph>
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
