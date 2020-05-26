import React, { Component } from 'react'
import { Form, Select, Table, Space, Tag, Button, Col, Row, Popconfirm, Modal, Input, notification } from 'antd';
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
    tags: [],
    descricao: '',
    cor: ''
  }

  componentDidMount = async () => {
    this.setState({
      tags: (await api.get('/tags')).content
    })
  }

  create = async values => {
    const data = await api.post('/tags', {
      cor: values.cor,
      descricao: values.descricao
    })

    this.setState({
      tags: [...this.state.tags, data],
      visible: false
    })
  }

  update = async values => {
    const { record } = this.state
    const dataToUpdate = {
      cor: values.cor || record.cor,
      descricao: values.descricao || record.descricao,
    }

    await api.put(`/tags/${record.id}`, dataToUpdate)

    this.setState({
      tags: this.state.tags.map(m => m.id === record.id ? { ...dataToUpdate, id: record.id } : m),
      visible: false
    })
  }

  // remove tag
  delete = async tag => {
    await api.delete(`/tags/${tag.id}`)

    notification.open({
      message: 'Sucesso',
      description: `Tag ${tag.descricao} removida com sucesso.`,
    });

    this.setState({
      tags: this.state.tags.filter(f => f.id !== tag.id)
    })
  }

  renderModalCreate = () => {
    const { record, visible, tags } = this.state
    let data = [...tags, { cor: '', descricao: '', id: -1 }].find(f => f.id === record.id)

    return (
      <>
        {
          data &&
          <Modal
            title="Criar Tag"
            visible={visible}
            okButtonProps={{ form: 'form-create-tag', key: 'submit', htmlType: 'submit' }}
            onCancel={() => this.setState({ visible: !this.state.visible, record: {} })}
          >
            <Form onFinish={!data.descricao ? this.create : this.update} id="form-create-tag">
              <Form.Item
                label="Nome da tag"
                name="descricao"
                rules={[{ required: !!!data.descricao, message: 'Informe o nome para a tag!' }]}
              >
                <Input defaultValue={data.descricao} />
              </Form.Item>

              <Form.Item
                name="cor"
                label="Cor"
                hasFeedback
                rules={[{ required: !!!data.cor, message: 'Selecione uma cor' }]}
              >
                <Select placeholder="Selecione uma cor" defaultValue={data.cor}>
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
        }
      </>
    )
  }



  render() {
    return (
      <div>
        <this.renderModalCreate />
        <Row justify="end" className="mb-8">
          <Col>
            <Button
              onClick={() => this.setState({ visible: true, record: { cor: '', descricao: '', id: -1 } })}
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
                <Popconfirm title="Deseja remover a tag?" okText="Sim" cancelText="Não" onConfirm={() => this.delete(record)}>
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
