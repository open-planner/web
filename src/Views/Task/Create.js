import React, { Component } from 'react'
import { Form, Input, Select, Button, Card, Row, DatePicker, notification, Col, Switch, Radio } from 'antd';
import api from '../../Services/API';
import moment from 'moment'
import CheckableTag from 'antd/lib/tag/CheckableTag';

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
  anotacoes: "",
  dataHora: "",
  descricao: "",
  notificacoes: [
    {
      dataHora: "2020-06-04T00:13:50.095Z",
      email: true
    }
  ],
  recorrencia: {
    dataLimite: "",
    unidade: ""
  },
  status: [],
  tags: []
}

export default class Create extends Component {
  state = {
    unitTimes: [],
    isLoadding: false,
    task: initalValue,
    showRecorrencia: false,
    status: [],
    tags: {
      selected: [],
      all: []
    },
  }

  componentDidMount = async () => {
    this.setState({
      status: await api.get('/tarefas/status'),
      tags: {
        selected: [],
        all: (await api.get('/tags')).content
      },
      unitTimes: await api.get('/tarefas/recorrencias/time-units')
    })
  }

  // method to laoding
  loading = bool => this.setState({ isLoadding: bool })

  handleChange = (tag, checked) => {
    const { tags } = this.state;
    const nextSelectedTags = checked ? [...tags.selected, tag] : tags.selected.filter(t => t !== tag);
    this.setState({ tags: { ...tags, selected: nextSelectedTags } });
  }

  // create planos-ferias
  onCreate = async values => {
    const { tags } = this.state

    try {
      this.loading(true)

      if (values.task.notificacoes) {
        values.task.notificacoes = [
          {
            dataHora: moment(),
            email: true
          }
        ]
      }
      const tagFiltred = tags.selected.map(m => m.id)

      await api.post('/tarefas', {
        ...values.task,
        tags: tagFiltred.length ? tagFiltred : null
      })
      window.location.href = '/#/task'
    } catch (err) {
      console.log(err)
    }

    this.loading(false)
  }

  render() {
    let { task, unitTimes, showRecorrencia, status, tags } = this.state

    return (
      <div className="">
        {
          <Card>
            <Form {...layout} initialValues={{ task }} name="nest-messages" onFinish={this.onCreate} validateMessages={validateMessages}>
              <Form.Item name={['task', 'descricao']} label="Descrição" rules={[{ required: true }]}>
                <TextArea rows={4} defaultValue={task.descricao} />
              </Form.Item>
              <Form.Item name={['task', 'anotacoes']} label="Anotações" rules={[{ required: false }]}>
                <TextArea rows={4} defaultValue={task.anotacoes} />
              </Form.Item>
              <Form.Item name={['task', 'dataHora']} label="Data Hora" rules={[{ required: true }]}>
                <DatePicker placeholder="dd/MM/YYYY" defaultValue={task.dataHora} />
              </Form.Item>
              <Form.Item name={['task', 'status']} label="Status" rules={[{ required: true }]}>
                <Select placeholder="Selecione um status">
                  {
                    status.map(item => (
                      <Option value={item.value}>
                        {item.label}
                      </Option>
                    ))
                  }
                </Select>
              </Form.Item>
              {/* select the tags */}
              <Form.Item name={['project', 'notificacoes']} label="Tags" rules={[{ required: false }]} valuePropName="checked">
                {tags.all.map(tag => (
                  <CheckableTag
                    key={tag.id}
                    checked={tags.selected.indexOf(tag) > -1}
                    onChange={checked => this.handleChange(tag, checked)}
                  >
                    {tag.descricao}
                  </CheckableTag>
                ))}
              </Form.Item>
              <Form.Item name={['task', 'notificacoes']} label="Notificar" rules={[{ required: false }]} valuePropName="checked">
                <Switch onChange={() => this.setState({ showRecorrencia: !showRecorrencia })} />
              </Form.Item>
              {
                !showRecorrencia &&
                <>
                  <Form.Item name={['task', 'recorrencia', 'unidade']} label="Recorrência" rules={[{ required: false }]}>
                    <Radio.Group>
                      {
                        unitTimes.map(m => (
                          <Radio.Button value={m.value}>{m.label}</Radio.Button>
                        ))
                      }
                    </Radio.Group>
                  </Form.Item>
                  <Form.Item name={['task', 'recorrencia', 'dataLimite']} label="Data Limite" rules={[{ required: false }]}>
                    <DatePicker placeholder="dd/MM/YYYY" defaultValue={task.dataHora} />
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
