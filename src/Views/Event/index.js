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
    events: [],
    descricao: '',
    cor: ''
  }

  componentDidMount = async () => {
    this.setState({
      events: (await api.get('/eventos')).content
    })
  }

  create = async values => {
    const data = await api.post('/eventos', {
      cor: values.cor,
      descricao: values.descricao
    })

    this.setState({
      events: [...this.state.events, data],
      visible: false
    })
  }

  // remove travel
  delete = async event => {

    await api.delete(`/eventos/${event.id}`)

    notification.open({
      message: 'Sucesso',
      description: `Plano de férias removida com sucesso.`,
    });

    this.setState({
      events: this.state.events.filter(f => f.id !== event.id)
    })
  }

  render() {
    return (
      <div>
        <Row justify="end" className="mb-8">
          <Col>
            <Button
              href="/#/events/create"
              type="primary"
              size="large"
              icon={<PlusOutlined />}>
              Adicionar
            </Button>
          </Col>
        </Row>
        <Table dataSource={this.state.events}>
          <Column
            title="Destino"
            dataIndex="descricao"
            key="descricao" />
          <Column
            title="Periodo Inicio"
            dataIndex="periodo.dataFim"
            key="periodo.dataFim"
            render={(text, record) => {
              return <p>{moment(record.dataHora).format('DD/MM/YYYY')}</p>
            }} />
          <Column
            title=""
            key="action"
            align='right'
            render={(text, record) => (
              <Space size="middle">
                <Button type="dashed" icon={<EditOutlined />} href={`/#/events/details/${record.id}`}>Detalhes</Button>
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
