import React, { Component } from 'react'
import { Form, Input, Select, Button, Card, Row, DatePicker, notification, Col } from 'antd';
import api from '../../Services/API';

const { Option } = Select;
const { TextArea } = Input;
const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
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

const initalValue = {
  destino: "",
  id: 0,
  periodo: {
    dataFim: "",
    dataInicio: ""
  },
  status: "",
  tipo: "",
  anotacoes: ""
}

export default class Create extends Component {
  state = {
    types: [],
    status: [],
    isLoadding: false,
    travel: initalValue,
    isCreate: true
  }

  componentDidMount = async () => {
    const path = window.location.pathname.split('/')
    let travel = initalValue
    let isCreate = true

    if (path.length > 2) {
      travel = await api.get(`/viagens/${path[2]}`)
      isCreate = false
    }

    this.setState({
      travel,
      isCreate,
      types: await api.get('/viagens/tipos'),
      status: await api.get('/viagens/status')
    })
  }

  // method to laoding
  loading = bool => this.setState({ isLoadding: bool })

  // create viagens
  onCreate = async values => {
    this.loading(true)

    await api.post('/viagens', {
      ...values.travel
    })

    this.loading(false)
    window.location.href = '/travels'
  }

  // create viagens
  onUpdate = async values => {
    this.loading(true)

    const result = await api.put('/viagens', {
      ...values.travel
    })

    this.loading(false)
    window.location.href = '/travels'
  }

  render() {
    let { types, status, travel } = this.state

    return (
      <div className="">
        {
          <Card>
            <Form {...layout} initialValues={{ travel }} name="nest-messages" onFinish={this.state.isCreate ? this.onCreate : this.onUpdate} validateMessages={validateMessages}>
              <Form.Item name={['travel', 'destino']} label="Destino" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item name={['travel', 'periodo', 'dataInicio']} label="Data Inicio" rules={[{ required: true }]}>
                <DatePicker placeholder="dd/MM/YYYY" defaultValue={travel.periodo.dataInicio} />
              </Form.Item>
              <Form.Item name={['travel', 'periodo', 'dataFim']} label="Data fim" rules={[{ required: true }]}>
                <DatePicker placeholder="dd/MM/YYYY" defaultValue={travel.periodo.dataFim} />
              </Form.Item>
              <Form.Item name={['travel', 'status']} label="Status" rules={[{ required: true }]}>
                <Select placeholder="Selecione um status" defaultValue={travel.status}>
                  {
                    status.map(item => (
                      <Option value={item.value}>
                        {item.label}
                      </Option>
                    ))
                  }
                </Select>
              </Form.Item>
              <Form.Item name={['travel', 'tipo']} label="Tipo" rules={[{ required: true }]}>
                <Select placeholder="Selecione um tipo" defaultValue={travel.tipo}>
                  {
                    types.map(type => (
                      <Option value={type.value}>
                        {type.label}
                      </Option>
                    ))
                  }
                </Select>
              </Form.Item>
              <Form.Item name={['travel', 'anotacoes']} label="Anotações" rules={[{ required: true }]}>
                <TextArea rows={4} defaultValue={travel.anotacoes} />
              </Form.Item>
              <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
                <Row justify="end">
                  <Button type="primary" loading={this.state.isLoadding} htmlType="submit">
                    Salvar
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
