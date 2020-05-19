import React, { Component } from 'react'
import { Form, Select, Table, Space, Tag, Button, Col, Row, Popconfirm, Modal, Input } from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import api from '../../Services/API';

const { Column, ColumnGroup } = Table;
const { Option } = Select;

export default class index extends Component {
  state = {
    visible: false,
    record: {},
    tags: []
  }

  componentDidMount = async () => {
    this.setState({
      tags: (await api.get('/tags')).content
    })
  }

  create = async values => {
    const data = await api.post('/tags', {
      cor: values.color,
      descricao: values.tagname
    })

    this.setState({
      tags: [...this.state.tags, data],
      visible: false
    })
  }

  update = async values => {
    const data = await api.put(`/tags/${values.id}`, {
      cor: values.color,
      descricao: values.tagname
    })

    this.setState({
      tags: [...this.state.tags, data],
      visible: false
    })
  }

  delete = () => {
    // TODO - remove tag
  }

  renderModalCreate = () => {
    const { cor, descricao } = this.state.record
    return (
      <Modal
        title="Criar Tag"
        visible={this.state.visible}
        okButtonProps={{ form: 'form-create-tag', key: 'submit', htmlType: 'submit' }}
        onCancel={() => this.setState({ visible: !this.state.visible, record: {} })}
      >
        <Form onFinish={!descricao ? this.create : this.update} id="form-create-tag">
          <Form.Item
            label="Nome da tag"
            name="tagname"
            rules={[{ required: true, message: 'Informe o nome para a tag!' }]}
          >
            <Input defaultValue={descricao} />
          </Form.Item>

          <Form.Item
            name="color"
            label="Cor"
            hasFeedback
            rules={[{ required: true, message: 'Selecione uma cor' }]}
          >
            <Select placeholder="Selecione uma cor" defaultValue={cor}>
              <Option value="magenta">
                <Tag color="magenta">magenta</Tag>
              </Option>
              <Option value="red">
                <Tag color="red">red</Tag>
              </Option>
              <Option value="volcano">
                <Tag color="volcano">volcano</Tag>
              </Option>
              <Option value="orange">
                <Tag color="orange">orange</Tag>
              </Option>
              <Option value="gold">
                <Tag color="gold">gold</Tag>
              </Option>
              <Option value="lime">
                <Tag color="lime">lime</Tag>
              </Option>
              <Option value="green">
                <Tag color="green">green</Tag>
              </Option>
              <Option value="cyan">
                <Tag color="cyan">cyan</Tag>
              </Option>
              <Option value="blue">
                <Tag color="blue">blue</Tag>
              </Option>
              <Option value="geekblue">
                <Tag color="geekblue">geekblue</Tag>
              </Option>
              <Option value="purple">
                <Tag color="purple">purple</Tag>
              </Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    )
  }

  render() {
    return (
      <div>
        <this.renderModalCreate {...this.state.record} />
        <Row justify="end" className="mb-8">
          <Col>
            <Button
              onClick={() => this.setState({ visible: true })}
              type="primary"
              size="large"
              icon={<PlusOutlined />}>
              Adicionar
            </Button>
          </Col>
        </Row>
        <Table dataSource={this.state.tags}>
          <Column title="Nome" dataIndex="descricao" key="descricao" />
          <Column
            title="Tag Exemplo"
            key="cor"
            render={(text, record) => (
              <Tag color={text.cor}>{record.descricao}</Tag>
            )}
          />
          <Column
            title=""
            key="action"
            align='right'
            render={(text, record) => (
              <Space size="middle">
                <Button type="dashed" icon={<EditOutlined />} onClick={() => this.setState({ visible: true, record })}>Editar</Button>
                <Popconfirm title="Deseja remover a tag?" okText="Sim" cancelText="Não" onConfirm={this.delete}>
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
