import React, { Component } from 'react'
import { Form, Select, Table, Space, Button, Col, Row, Popconfirm, notification, DatePicker, Skeleton } from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined
} from '@ant-design/icons';
import api from '../../Services/API';
import moment from 'moment'

const { Column } = Table;
const { Option } = Select;


export default class index extends Component {
  state = {
    visible: false,
    record: {},
    tasks: [],
    descricao: '',
    cor: '',
    status: []
  }

  componentDidMount = async () => {
    this.setState({
      tasks: (await api.get('/tarefas')).content,
      status: await api.get('/viagens/status'),
    })
  }

  create = async values => {
    const data = await api.post('/tarefas', {
      cor: values.cor,
      descricao: values.descricao
    })

    this.setState({
      tasks: [...this.state.tasks, data],
      visible: false
    })
  }

  // remove travel
  delete = async task => {

    await api.delete(`/tarefas/${task.id}`)

    notification.open({
      message: 'Sucesso',
      description: `Plano de férias removida com sucesso.`,
    });

    this.setState({
      tasks: this.state.tasks.filter(f => f.id !== task.id)
    })
  }

  filter = async values => {
    values.data = values.data ? values.data.format('YYYY-MM-DD') : undefined
    this.setState({
      tasks: (await api.get('/tarefas', { params: values })).content
    })
  }

  render() {
    return (
      <div>
        <Row justify="end" className="mb-8">
          {/* filtro de dados */}
          <Col span={24}>
            <Form name="time_related_controls" onFinish={this.filter}>
              <Row gutter={16}>
                <Col>
                  Período: <br />
                  <Form.Item name="data">
                    <DatePicker />
                  </Form.Item>
                </Col>
                <Col>
                  Status: <br />
                  {
                    this.state.status ?
                      <Form.Item name={'status'} rules={[{ required: false }]}>
                        <Select placeholder="Selecione um status">
                          {
                            this.state.status.map(item => (
                              <Option value={item.value}>
                                {item.label}
                              </Option>
                            ))
                          }
                        </Select>
                      </Form.Item>
                      : <Skeleton.Input active={true} size={"large"} />
                  }
                </Col>
                <Col>
                  <Form.Item>
                    <br />
                    <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                      filtrar
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Col>

          {/* boootão de adicionar */}
          <Col>
            <Button
              href="/#/task/create"
              type="primary"
              size="large"
              icon={<PlusOutlined />}>
              Adicionar
            </Button>
          </Col>
        </Row>
        <Table dataSource={this.state.tasks}>
          <Column
            title="Data"
            dataIndex="dataHora"
            key="dataHora"
            render={(text, record) => {
              return <p>{moment(record.dataHora).format('DD/MM/YYYY')}</p>
            }} />
          <Column
            title="Destino"
            dataIndex="descricao"
            key="descricao" />
          <Column
            title="Status"
            dataIndex="status"
            key="status" />
          <Column
            title=""
            key="action"
            align='right'
            render={(text, record) => (
              <Space size="middle">
                <Button type="dashed" icon={<EditOutlined />} href={`/#/task/details/${record.id}`}>Detalhes</Button>
                <Popconfirm title="Deseja remover a travel?" okText="Sim" cancelText="Não" onConfirm={() => this.delete(record)}>
                  <Button type="dashed" danger icon={<DeleteOutlined />}>Deletar</Button>
                </Popconfirm>
              </Space>
            )}
          />
        </Table>
      </div>
    )
  }
}
