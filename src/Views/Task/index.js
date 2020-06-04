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
    tasks: [],
    descricao: '',
    cor: ''
  }

  componentDidMount = async () => {
    this.setState({
      tasks: (await api.get('/tarefas')).content
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

  render() {
    return (
      <div>
        <Row justify="end" className="mb-8">
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
