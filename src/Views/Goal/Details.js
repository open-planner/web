import React, { Component } from 'react'
import { Card, Row, Col, Typography, Button, notification, Switch, Radio, Form, Select, Skeleton } from 'antd'
import moment from 'moment';
import api from '../../Services/API';
import banner from '../../Assets/image/3075759.jpg'
import CheckableTag from 'antd/lib/tag/CheckableTag';

const { Paragraph, Text } = Typography
const { Option } = Select;

const initalValue = {
  anotacoes: "",
  descricao: "",
  notificacoes: [
    {
      dataHora: "2020-06-01T23:19:40.639Z",
      email: true
    }
  ],
  periodo: {
    dataFim: "",
    dataInicio: ""
  },
  prioridade: "",
  status: "",
  tags: [
    0
  ]
}

export default class extends Component {
  state = {
    goal: initalValue,
    canUpdate: false, // when changed contents the button update show
    updating: false,//when to update, feedback tooo user
    visible: false,
    status: [],
    showRecorrencia: false,
    tags: {
      all: [],
      selected: []
    }
  }

  componentDidMount = async () => {
    const path = window.location.hash.split('/')
    const goal = await api.get(`/metas/${path[3]}`)

    this.setState({
      goal,
      tags: {
        all: (await api.get('/tags')).content,
        selected: goal.tags
      },
      showRecorrencia: goal.notificacoes.length > 0,
      status: await api.get('/metas/status'),
    })
  }

  update = async () => {
    const { goal, tags } = this.state
    const id = goal.id
    delete goal.id
    delete goal.tags

    // clean ids
    goal.notificacoes = goal.notificacoes.map(m => ({
      dataHora: m.dataHora,
      email: m.email
    }))

    this.setState({
      updating: true
    })

    await api.put(`/metas/${id}`, {
      ...goal,
      tags: tags.selected.map(m => m.id)
    })

    notification.open({
      message: 'Sucesso',
      description: `Meta atualizado com sucesso.`,
    });

    this.setState({
      updating: false,
      canUpdate: false
    })
  }

  handlerData = ({ str, name }) => {
    this.setState({ goal: { ...this.state.goal, [name]: str }, canUpdate: true });
  }

  handleChangeTags = (tag, checked) => {
    const { tags } = this.state;
    const nextSelectedTags = checked ? [...tags.selected, tag] : tags.selected.filter(t => t !== tag);
    this.setState({ tags: { ...tags, selected: nextSelectedTags } });
  }

  render() {
    const { updating, canUpdate, goal, showRecorrencia, status, priority, tags } = this.state
    const { descricao, data, notificacoes, anotacoes } = goal

    return (
      <div>
        <Card>
          <Row>
            {/* side image and name */}
            <Col span={8}>
              <img width="450" className='rounded-half' src={banner} alt="Summer vector created by gstudioimagen - www.freepik.com" />
              {/* <a href="https://www.freepik.com/free-photos-vectors/summer">Summer vector created by gstudioimagen - www.freepik.com</a> */}
            </Col>
            {/* side content user */}
            <Col span={14} offset={1}>
              <Text disabled>Descrição:</Text><br />
              {
                descricao ?
                  <>
                    <Paragraph editable={{ onChange: str => this.handlerData({ str, name: 'descricao' }) }}>{descricao}</Paragraph>
                  </>
                  : <Skeleton.Input active={true} size={"large"} />
              }
              <Text disabled>Anotações:</Text><br />
              {
                anotacoes ?
                  <Paragraph editable={{ onChange: str => this.handlerData({ str, name: 'anotacoes' }) }}>{anotacoes}</Paragraph>
                  : <Skeleton.Input active={true} size={"large"} />
              }
              <Text disabled>Data:</Text><br />
              {
                data ?
                  <Paragraph editable={{ onChange: str => this.handlerData({ str, name: 'periodo.data' }) }}>{moment(data).format('DD/MM/YYYY')}</Paragraph>
                  : <Skeleton.Input active={true} size={"large"} />
              }
              <Text disabled>Status:</Text><br />
              {
                status.length ?
                  <Form.Item name={['goal', 'status']} rules={[{ required: true }]}>
                    <Select placeholder="Selecione um status"
                      onChange={str => this.handlerData({ str, name: 'status' })}
                      defaultValue={goal.status}>
                      {
                        status.map(item => (
                          <Option value={item.value}>
                            {item.label}
                          </Option>
                        ))
                      }
                    </Select>
                  </Form.Item>
                  : <Skeleton.Input active={true} size={"large"} />
              }

              {/* tags */}
              {tags.all.map(tag => (
                <CheckableTag
                  key={tag.id}
                  checked={tags.selected.find(f => f.id === tag.id)}
                  onChange={checked => this.handleChangeTags(tag, checked)}
                >
                  {tag.descricao}
                </CheckableTag>
              ))}

              <br />
              <Text disabled>Ativar Notificação:</Text><br />
              <Switch onChange={() => this.handlerData({ str: !showRecorrencia, name: 'showRecorrencia' })} defaultChecked={notificacoes.length > 0} />
              <br /><br />
              {
                showRecorrencia ?
                  <>
                    <Text disabled>Data Limite:</Text> <br />
                    <Paragraph editable={{ onChange: str => this.handlerData({ str, name: 'recorrencia.dataLimite' }) }}>{moment(notificacoes[0].dataHora).format('DD/MM/YYYY')}</Paragraph>
                  </>
                  : null
              }
            </Col>
          </Row>
          <Row justify={'end'}>
            <Col>
              {
                canUpdate &&
                <Button type="primary" className="mr-6" onClick={this.update} loading={updating}>Atualizar</Button>
              }
            </Col>
          </Row>
        </Card>
      </div>
    )
  }
}
