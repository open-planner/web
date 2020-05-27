import React, { Component } from 'react'
import { Form, Select, Table, Space, Tag, Button, Col, Row, Popconfirm, notification } from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import api from '../../Services/API';
import moment from 'moment'
import { Link } from 'react-router-dom';

const { Column, ColumnGroup } = Table;
const { Option } = Select;


export default class index extends Component {
  state = {
    visible: false,
    record: {},
    vocationPlanning: [],
    descricao: '',
    cor: ''
  }

  componentDidMount = async () => {
    this.setState({
      vocationPlanning: (await api.get('/planos-ferias')).content
    })
  }

  create = async values => {
    const data = await api.post('/planos-ferias', {
      cor: values.cor,
      descricao: values.descricao
    })

    this.setState({
      vocationPlanning: [...this.state.vocationPlanning, data],
      visible: false
    })
  }

  update = async values => {
    const { record } = this.state
    const dataToUpdate = {
      cor: values.cor || record.cor,
      descricao: values.descricao || record.descricao,
    }

    await api.put(`/planos-ferias/${record.id}`, dataToUpdate)

    this.setState({
      vocationPlanning: this.state.vocationPlanning.map(m => m.id === record.id ? { ...dataToUpdate, id: record.id } : m),
      visible: false
    })
  }

  // remove travel
  delete = async travel => {

    await api.delete(`/planos-ferias/${travel.id}`)

    notification.open({
      message: 'Sucesso',
      description: `Plano de férias removida com sucesso.`,
    });

    this.setState({
      vocationPlanning: this.state.vocationPlanning.filter(f => f.id !== travel.id)
    })
  }

  render() {
    return (
      <div>
        <Row justify="end" className="mb-8">
          <Col>
            <Button
              href="/vocation-planning/create"
              type="primary"
              size="large"
              icon={<PlusOutlined />}>
              Adicionar
            </Button>
          </Col>
        </Row>
        <Table dataSource={this.state.vocationPlanning}>
          <Column
            title="Destino"
            dataIndex="destino"
            key="destino" render={(text, record) => {
              return <Link to={`/vocation-planning/details/${record.id}`}>{text}</Link>
            }} />
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
          <Column
            title=""
            key="action"
            align='right'
            render={(text, record) => (
              <Space size="middle">
                <Button type="dashed" icon={<EditOutlined />} href={`/vocation-planning/details/${record.id}`}>Editar</Button>
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
