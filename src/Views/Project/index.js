import React, { Component } from 'react'
import { Form, Select, Table, Space, Tag, Button, Col, Row, Popconfirm, notification, Skeleton, DatePicker, Input } from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined
} from '@ant-design/icons';
import api from '../../Services/API';
import moment from 'moment'

const { Column, ColumnGroup } = Table;
const { Option } = Select;


export default class index extends Component {
  state = {
    visible: false,
    record: {},
    projects: [],
    descricao: '',
    cor: '',
    type: [],
    status: []
  }

  componentDidMount = async () => {
    this.setState({
      projects: (await api.get('/projetos', { params: { sort: 'periodo.dataInicio,asc' } })).content,
      status: await api.get('/projetos/status'),
      type: await api.get('/projetos/prioridades')
    })
  }

  create = async values => {
    const data = await api.post('/projetos', {
      cor: values.cor,
      descricao: values.descricao
    })

    this.setState({
      projects: [...this.state.projects, data],
      visible: false
    })
  }

  // remove travel
  delete = async project => {

    await api.delete(`/projetos/${project.id}`)

    notification.open({
      message: 'Sucesso',
      description: `Plano de férias removida com sucesso.`,
    });

    this.setState({
      projects: this.state.projects.filter(f => f.id !== project.id)
    })
  }

  filter = async values => {
    window.document.getElementById('form-filter-project').reset()
    values.data = values.data ? values.data.format('YYYY-MM-DD') : undefined
    this.setState({
      projects: (await api.get('/projetos', { params: values })).content
    })
  }

  render() {
    return (
      <div>
        <Row justify="end" className="mb-8">
          {/* filtro de dados */}
          <Col span={24}>
            <Form id='form-filter-project' name="time_related_controls" onFinish={this.filter}>
              <Row gutter={16}>
                <Col>
                  Data: <br />
                  <Form.Item name="data">
                    <DatePicker />
                  </Form.Item>
                </Col>
                <Col>
                  Prioridades: <br />
                  {
                    this.state.type ?
                      <Form.Item name={'prioridade'} rules={[{ required: false }]}>
                        <Select placeholder="Selecione um tipo">
                          {
                            this.state.type.map(item => (
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
                  Descrição: <br />
                  <Form.Item name={'descricao'}>
                    <Input />
                  </Form.Item>
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
              href="/#/project/create"
              type="primary"
              size="large"
              icon={<PlusOutlined />}>
              Adicionar
            </Button>
          </Col>
        </Row>
        <Table dataSource={this.state.projects}>
          <Column
            title="Descrição"
            dataIndex="descricao"
            key="descricao" />
          <Column
            title="Anotações"
            dataIndex="anotacoes"
            key="anotacoes" />
          <Column
            title="Periodo Inicio"
            dataIndex="periodo.dataInicio"
            key="periodo.dataInicio"
            render={(text, record) => {
              return <p>{moment(record.periodo.dataInicio).format('DD/MM/YYYY')}</p>
            }} />
          <Column
            title="Periodo Fim"
            dataIndex="periodo.dataFim"
            key="periodo.dataFim"
            render={(text, record) => {
              return <p>{moment(record.periodo.dataFim).format('DD/MM/YYYY')}</p>
            }} />
          <Column
            title="Prioridade"
            dataIndex="prioridade"
            key="prioridade" />
          <Column
            title="Status"
            dataIndex="status"
            key="status" />
          <Column
            title="Tags"
            dataIndex="tags"
            key="tags"
            render={(text, record) => (
              <>
                {
                  record.tags.map(tag =>
                    <Tag color={tag.cor}>{tag.descricao}</Tag>
                  )
                }
              </>
            )} />
          <Column
            title=""
            key="action"
            align='right'
            render={(text, record) => (
              <Space size="middle">
                <Button type="dashed" icon={<EditOutlined />} href={`/#/project/details/${record.id}`}>Detalhes</Button>
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
