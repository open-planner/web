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
    priority: [],
    isLoadding: false,
    project: initalValue,
    tags: {
      selected: [],
      all: []
    },
  }

  componentDidMount = async () => {
    this.setState({
      status: await api.get('/projetos/status'),
      priority: await api.get('/projetos/prioridades'),
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

      if (values.project.notificacoes) {
        values.project.notificacoes = [
          {
            dataHora: moment(),
            email: true
          }
        ]
      }

      await api.post('/projetos', {
        ...values.project,
        tags: tags.selected.map(m => m.id)
      })
      // window.location.href = '/projects'
    } catch (err) {
      console.log(err)
    }

    this.loading(false)
  }

  render() {
    let { project, status, priority, tags } = this.state

    return (
      <div className="">
        {
          <Card>
            <Form {...layout} initialValues={{ project }} name="nest-messages" onFinish={this.onCreate} validateMessages={validateMessages}>
              <Form.Item name={['project', 'descricao']} label="Descrição" rules={[{ required: true }]}>
                <TextArea rows={4} defaultValue={project.descricao} />
              </Form.Item>
              <Form.Item name={['project', 'anotacoes']} label="Anotações" rules={[{ required: true }]}>
                <TextArea rows={4} defaultValue={project.anotacoes} />
              </Form.Item>
              <Form.Item name={['project', 'periodo', 'dataInicio']} label="Data Inicio" rules={[{ required: true }]}>
                <DatePicker placeholder="dd/MM/YYYY" defaultValue={project.dataInicio} />
              </Form.Item>
              <Form.Item name={['project', 'periodo', 'dataFim']} label="Data Fim" rules={[{ required: true }]}>
                <DatePicker placeholder="dd/MM/YYYY" defaultValue={project.dataFim} />
              </Form.Item>
              <Form.Item name={['project', 'status']} label="Status" rules={[{ required: true }]}>
                <Select placeholder="Selecione um status" defaultValue={project.status}>
                  {
                    status.map(item => (
                      <Option value={item.value}>
                        {item.label}
                      </Option>
                    ))
                  }
                </Select>
              </Form.Item>
              <Form.Item name={['project', 'prioridade']} label="Prioridade" rules={[{ required: true }]}>
                <Select placeholder="Selecione um status" defaultValue={project.priority}>
                  {
                    priority.map(item => (
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

              {/* notificações */}
              <Form.Item name={['project', 'notificacoes']} label="Notificar" rules={[{ required: false }]} valuePropName="checked">
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
