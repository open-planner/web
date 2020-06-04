import React, { Component } from 'react'
import { Form, Select, Table, Space, Tag, Button, Col, Row, Popconfirm, notification } from 'antd';
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
    goals: [],
    descricao: '',
    cor: ''
  }

  componentDidMount = async () => {
    this.setState({
      goals: (await api.get('/metas')).content
    })
  }

  create = async values => {
    const data = await api.post('/metas', {
      cor: values.cor,
      descricao: values.descricao
    })

    this.setState({
      goals: [...this.state.goals, data],
      visible: false
    })
  }

  // remove travel
  delete = async goal => {

    await api.delete(`/metas/${goal.id}`)

    notification.open({
      message: 'Sucesso',
      description: `Plano de férias removida com sucesso.`,
    });

    this.setState({
      goals: this.state.goals.filter(f => f.id !== goal.id)
    })
  }

  render() {
    return (
      <div>
        <Row justify="end" className="mb-8">
          <Col>
            <Button
              href="/#/goal/create"
              type="primary"
              size="large"
              icon={<PlusOutlined />}>
              Adicionar
            </Button>
          </Col>
        </Row>
        <Table dataSource={this.state.goals}>
          <Column
            title="Data"
            dataIndex="data"
            key="data"
            render={(text, record) => {
              return <p>{moment(record.data).format('DD/MM/YYYY')}</p>
            }} />
          <Column
            title="Descrição"
            dataIndex="descricao"
            key="descricao" />
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
                <Button type="dashed" icon={<EditOutlined />} href={`/#/goal/details/${record.id}`}>Detalhes</Button>
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
