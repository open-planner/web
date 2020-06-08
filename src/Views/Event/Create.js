import React, { Component } from 'react'
import { Form, Input, Select, Button, Card, Row, DatePicker, notification, Col, Switch, Radio } from 'antd';
import api from '../../Services/API';
import moment from 'moment'

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
  }
};

const initalValue = {
  descricao: "",
  id: 0,
  dataHora: ""
}

export default class Create extends Component {
  state = {
    unitTimes: [],
    isLoadding: false,
    event: initalValue,
    showRecorrencia: false
  }

  componentDidMount = async () => {
    this.setState({
      unitTimes: await api.get('/eventos/recorrencias/time-units')
    })
  }

  // method to laoding
  loading = bool => this.setState({ isLoadding: bool })

  // create planos-ferias
  onCreate = async values => {
    try {
      this.loading(true)

      if (values.event.notificacoes) {
        values.event.notificacoes = [
          {
            dataHora: moment(),
            email: true
          }
        ]
      }

      await api.post('/eventos', {
        ...values.event
      })
      window.location.href = '/#/events'
    } catch (err) {
      console.log(err)
    }

    this.loading(false)
  }

  render() {
    let { event, unitTimes, showRecorrencia } = this.state

    return (
      <div className="">
        {
          <Card>
            <Form {...layout} initialValues={{ event }} name="nest-messages" onFinish={this.onCreate} validateMessages={validateMessages}>
              <Form.Item name={['event', 'descricao']} label="Descrição" rules={[{ required: true }]}>
                <TextArea rows={4} defaultValue={event.descricao} />
              </Form.Item>
              <Form.Item name={['event', 'dataHora']} label="Data Hora" rules={[{ required: true }]}>
                <DatePicker placeholder="dd/MM/YYYY" defaultValue={event.dataHora} />
              </Form.Item>
              <Form.Item name={['event', 'notificacoes']} label="Notificar" rules={[{ required: false }]} valuePropName="checked">
                <Switch onChange={() => this.setState({ showRecorrencia: !showRecorrencia })} />
              </Form.Item>
              {
                showRecorrencia &&
                <>
                  <Form.Item name={['event', 'recorrencia', 'unidade']} label="Recorrência" rules={[{ required: false }]}>
                    <Radio.Group>
                      {
                        unitTimes.map(m => (
                          <Radio.Button value={m.value}>{m.label}</Radio.Button>
                        ))
                      }
                    </Radio.Group>
                  </Form.Item>
                  <Form.Item name={['event', 'recorrencia', 'dataLimite']} label="Data Limite" rules={[{ required: false }]}>
                    <DatePicker placeholder="dd/MM/YYYY" defaultValue={event.dataHora} />
                  </Form.Item>
                </>
              }

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
