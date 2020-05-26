import React, { Component } from 'react'
import { Form, Select, Table, Space, Tag, Button, Col, Row, Popconfirm, Modal, Input, notification } from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import api from '../../Services/API';
import moment from 'moment'

const { Column, ColumnGroup } = Table;
const { Option } = Select;


export default class index extends Component {
  state = {
    visible: false,
    record: {},
    travels: [],
    descricao: '',
    cor: ''
  }

  componentDidMount = async () => {
    this.setState({
      travels: (await api.get('/viagens')).content
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
      description: `Tag ${travel.descricao} removida com sucesso.`,
    });

    this.setState({
      travels: this.state.travels.filter(f => f.id !== travel.id)
    })
  }


  render() {
    return (
      <div>
        <Row justify="end" className="mb-8">
          <Col>
            <Button
              href="/travels/create"
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
            title="Periodo Inicio"
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
                <Button type="dashed" icon={<EditOutlined />} href={`/travels/${record.id}`}>Editar</Button>
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
