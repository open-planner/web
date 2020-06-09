import React, { Component } from 'react'
import { Form, DatePicker, Table, Space, Select, Button, Col, Row, Popconfirm, notification, Skeleton, Input } from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined
} from '@ant-design/icons';
import api from '../../Services/API';
import moment from 'moment'

const { Option } = Select;
const { Column } = Table;
const { RangePicker } = DatePicker;

export default class index extends Component {
  state = {
    visible: false,
    record: {},
    travels: [],
    descricao: '',
    cor: '',
    type: [],
    status: []
  }

  componentDidMount = async () => {
    this.setState({
      travels: (await api.get('/viagens', { params: { sort: 'periodo.dataInicio,asc' } })).content,
      status: await api.get('/viagens/status'),
      type: await api.get('/viagens/tipos')
    })
  }

  create = async values => {
    const data = await api.post('/viagens', {
      cor: values.cor,
      descricao: values.descricao
    })

    this.setState({
      travels: [...this.state.travels, data],
      visible: false
    })
  }

  update = async values => {
    const { record } = this.state
    const dataToUpdate = {
      cor: values.cor || record.cor,
      descricao: values.descricao || record.descricao,
    }

    await api.put(`/travels/${record.id}`, dataToUpdate)

    this.setState({
      travels: this.state.travels.map(m => m.id === record.id ? { ...dataToUpdate, id: record.id } : m),
      visible: false
    })
  }

  // remove travel
  delete = async travel => {

    await api.delete(`/viagens/${travel.id}`)

    notification.open({
      message: 'Sucesso',
      description: `Viagem removida com sucesso.`,
    });

    this.setState({
      travels: this.state.travels.filter(f => f.id !== travel.id)
    })
  }

  filter = async values => {
    values.data = values.data ? values.data.format('YYYY-MM-DD') : undefined
    this.setState({
      travels: (await api.get('/viagens', { params: values })).content
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
                  Data: <br />
                  <Form.Item name="data">
                    <DatePicker />
                  </Form.Item>
                </Col>
                <Col>
                  Tipo: <br />
                  {
                    this.state.type ?
                      <Form.Item name={'tipo'} rules={[{ required: false }]}>
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
                  Destino: <br />
                  <Form.Item name={'destino'}>
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
              href="/#/travels/create"
              type="primary"
              size="large"
              icon={<PlusOutlined />}>
              Adicionar
            </Button>
          </Col>
        </Row>
        <Table dataSource={this.state.travels}>
          <Column title="Destino" dataIndex="destino" key="destino" />
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
          <Column title="Status" dataIndex="status" key="status" />
          <Column title="Tipo" dataIndex="tipo" key="tipo" />
          <Column
            title=""
            key="action"
            align='right'
            render={(text, record) => (
              <Space size="middle">
                <Button type="dashed" icon={<EditOutlined />} href={`/#/travels/${record.id}`}>Editar</Button>
                <Popconfirm title="Deseja remover a travel?" okText="Sim" cancelText="Não" onConfirm={() => this.delete(record)}>
                  <Button type="dashed" danger icon={<DeleteOutlined />}>Deletar</Button>
                </Popconfirm>
              </Space>
            )}
          />
        </Table>
      </div >
    )
  }
}
