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
    projects: [],
    descricao: '',
    cor: ''
  }

  componentDidMount = async () => {
    this.setState({
      projects: (await api.get('/projetos')).content
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

  render() {
    return (
      <div>
        <Row justify="end" className="mb-8">
          <Col>
            <Button
              href="/project/create"
              type="primary"
              size="large"
              icon={<PlusOutlined />}>
              Adicionar
            </Button>
          </Col>
        </Row>
        <Table dataSource={this.state.projects}>
          <Column
            title="Destino"
            dataIndex="descricao"
            key="descricao" />
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
                <Button type="dashed" icon={<EditOutlined />} href={`/project/details/${record.id}`}>Detalhes</Button>
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
