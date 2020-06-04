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
  descricao: "",
  notificacoes: [
    {
      dataHora: "2020-06-01T23:19:40.639Z",
      email: true
    }
  ],
  periodo: {
    dataFim: "",
    dataInicio: ""
  },
  prioridade: "",
  status: "",
  tags: [
    0
  ]
}

export default class Create extends Component {
  state = {
    status: [],
    isLoadding: false,
    goal: initalValue,
    tags: {
      selected: [],
      all: []
    },
  }

  componentDidMount = async () => {
    this.setState({
      status: await api.get('/metas/status'),
      tags: {
        selected: [],
        all: (await api.get('/tags')).content
      }
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
    try {
      const { tags } = this.state
      this.loading(true)

      if (values.goal.notificacoes) {
        values.goal.notificacoes = [
          {
            dataHora: moment(),
            email: true
          }
        ]
      }
      const tagFiltred = tags.selected.map(m => m.id)

      await api.post('/metas', {
        ...values.goal,
        tags: tagFiltred.length ? tagFiltred : null
      })

      window.location.href = '/#/goal'
    } catch (err) {
      console.log(err)
    }

    this.loading(false)
  }

  render() {
    let { goal, status, priority, tags } = this.state

    return (
      <div className="">
        {
          <Card>
            <Form {...layout} initialValues={{ goal }} name="nest-messages" onFinish={this.onCreate} validateMessages={validateMessages}>
              <Form.Item name={['goal', 'descricao']} label="Descrição" rules={[{ required: true }]}>
                <TextArea rows={4} defaultValue={goal.descricao} />
              </Form.Item>
              <Form.Item name={['goal', 'anotacoes']} label="Anotações" rules={[{ required: true }]}>
                <TextArea rows={4} defaultValue={goal.anotacoes} />
              </Form.Item>
              <Form.Item name={['goal', 'data']} label="Data" rules={[{ required: true }]}>
                <DatePicker placeholder="dd/MM/YYYY" defaultValue={goal.dataInicio} />
              </Form.Item>
              <Form.Item name={['goal', 'status']} label="Status" rules={[{ required: true }]}>
                <Select placeholder="Selecione um status" defaultValue={goal.status}>
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
              <Form.Item name={['goal', 'notificacoes']} label="Tags" rules={[{ required: false }]} valuePropName="checked">
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

              {/* notificações */}
              <Form.Item name={['goal', 'notificacoes']} label="Notificar" rules={[{ required: false }]} valuePropName="checked">
                <Switch />
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
