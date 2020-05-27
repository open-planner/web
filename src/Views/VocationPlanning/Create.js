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
    status: [],
    isLoadding: false,
    vocationPlanning: initalValue
  }

  componentDidMount = async () => {
    this.setState({
      status: await api.get('/planos-ferias/status')
    })
  }

  // method to laoding
  loading = bool => this.setState({ isLoadding: bool })

  // create planos-ferias
  onCreate = async values => {
    this.loading(true)

    await api.post('/planos-ferias', {
      ...values.vocationPlanning
    })

    this.loading(false)
    window.location.href = '/vocation-planning'
  }

  render() {
    let { status, vocationPlanning } = this.state

    return (
      <div className="">
        {
          <Card>
            <Form {...layout} initialValues={{ vocationPlanning }} name="nest-messages" onFinish={this.onCreate} validateMessages={validateMessages}>
              <Form.Item name={['vocationPlanning', 'destino']} label="Destino" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item name={['vocationPlanning', 'periodo', 'dataInicio']} label="Data Inicio" rules={[{ required: true }]}>
                <DatePicker placeholder="dd/MM/YYYY" defaultValue={vocationPlanning.periodo.dataInicio} />
              </Form.Item>
              <Form.Item name={['vocationPlanning', 'periodo', 'dataFim']} label="Data fim" rules={[{ required: true }]}>
                <DatePicker placeholder="dd/MM/YYYY" defaultValue={vocationPlanning.periodo.dataFim} />
              </Form.Item>
              <Form.Item name={['vocationPlanning', 'status']} label="Status" rules={[{ required: true }]}>
                <Select placeholder="Selecione um status" defaultValue={vocationPlanning.status}>
                  {
                    status.map(item => (
                      <Option value={item.value}>
                        {item.label}
                      </Option>
                    ))
                  }
                </Select>
              </Form.Item>
              <Form.Item name={['vocationPlanning', 'anotacoes']} label="Anotações" rules={[{ required: true }]}>
                <TextArea rows={4} defaultValue={vocationPlanning.anotacoes} />
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
