import React, { Component } from 'react'
import { Card, Row, Col, Typography, Button, notification, Switch, Radio, Form, Select, Skeleton } from 'antd'
import moment from 'moment';
import api from '../../Services/API';
import banner from '../../Assets/image/3075759.jpg'
import CheckableTag from 'antd/lib/tag/CheckableTag';
import ConvertStringDate from '../../Utils/ConvertStringDate';

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
    project: initalValue,
    canUpdate: false, // when changed contents the button update show
    updating: false,//when to update, feedback tooo user
    visible: false,
    status: [],
    priority: [],
    showRecorrencia: false,
    tags: {
      all: [],
      selected: []
    }
  }

  componentDidMount = async () => {
    const path = window.location.hash.split('/')
    const project = await api.get(`/projetos/${path[3]}`)

    this.setState({
      project,
      tags: {
        all: (await api.get('/tags')).content,
        selected: project.tags
      },
      showRecorrencia: project.notificacoes.length > 0,
      status: await api.get('/projetos/status'),
      priority: await api.get('/projetos/prioridades')
    })
  }

  update = async () => {
    const { project, tags } = this.state
    const id = project.id
    delete project.id
    delete project.tags

    // clean ids
    project.notificacoes = project.notificacoes.map(m => ({
      dataHora: m.dataHora,
      email: m.email
    }))

    this.setState({
      updating: true
    })

    await api.put(`/projetos/${id}`, {
      ...project,
      tags: tags.selected.map(m => m.id)
    })

    notification.open({
      message: 'Sucesso',
      description: `Projeto atualizado com sucesso.`,
    });

    this.setState({
      updating: false,
      canUpdate: false
    })
  }

  handlerData = ({ str, name }) => {
    this.setState({ project: { ...this.state.project, [name]: str }, canUpdate: true });
  }

  handlerDataDate = ({ str, name }) => {
    this.state.project.periodo[name] = str
    this.setState({ project: this.state.project, canUpdate: true });
  }

  handleChangeTags = (tag, checked) => {
    const { tags } = this.state;
    const nextSelectedTags = checked ? [...tags.selected, tag] : tags.selected.filter(t => t !== tag);
    this.setState({ tags: { ...tags, selected: nextSelectedTags }, canUpdate: true });
  }

  render() {
    const { updating, canUpdate, project, showRecorrencia, status, priority, tags } = this.state
    const { descricao, periodo, notificacoes } = project

    return (
      <div>
        <Card>
          <Row>
            {/* side image and name */}
            <Col span={8}>
              <img style={{ width: '100%' }} className='rounded-half' src={banner} alt="Summer vector created by gstudioimagen - www.freepik.com" />
              {/* <a href="https://www.freepik.com/free-photos-vectors/summer">Summer vector created by gstudioimagen - www.freepik.com</a> */}
            </Col>
            {/* side content user */}
            <Col span={14} offset={1}>
              <Text disabled>Descrição:</Text><br />
              {
                descricao ?
                  <Paragraph editable={{ onChange: str => this.handlerData({ str, name: 'descricao' }) }}>{descricao}</Paragraph>
                  : <Skeleton.Input active={true} size={"large"} />
              }
              <Text disabled>Data Início:</Text><br />
              {
                periodo.dataInicio ?
                  <Paragraph editable={{ onChange: str => this.handlerDataDate({ str: ConvertStringDate(str), name: 'dataInicio' }) }}>{moment(periodo.dataInicio).format('DD/MM/YYYY')}</Paragraph>
                  : <Skeleton.Input active={true} size={"large"} />
              }
              <Text disabled>Data Fim:</Text><br />
              {
                periodo.dataFim ?
                  <Paragraph editable={{ onChange: str => this.handlerDataDate({ str: ConvertStringDate(str), name: 'dataFim' }) }}>{moment(periodo.dataFim).format('DD/MM/YYYY')}</Paragraph>
                  : <Skeleton.Input active={true} size={"large"} />
              }
              <Text disabled>Status:</Text><br />
              {
                project.status ?
                  <Form.Item name={['project', 'status']} rules={[{ required: true }]}>
                    <Select placeholder="Selecione um status"
                      onChange={str => this.handlerData({ str, name: 'status' })}
                      defaultValue={project.status}>
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

              <Text disabled>Prioridade:</Text><br />
              {
                project.prioridade ?
                  <Form.Item name={['project', 'prioridade']} rules={[{ required: true }]}>
                    <Select placeholder="Selecione um prioridade"
                      onChange={str => this.handlerData({ str, name: 'prioridade' })}
                      defaultValue={project.prioridade}>
                      {
                        priority.map(item => (
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
              <Text disabled>Tags:</Text><br />
              {
                tags.all.length > 0 ?
                  tags.all.map(tag => (
                    <CheckableTag
                      key={tag.id}
                      checked={tags.selected.find(f => f.id === tag.id)}
                      onChange={checked => this.handleChangeTags(tag, checked)}
                    >
                      {tag.descricao}
                    </CheckableTag>
                  ))
                  : <Skeleton.Input active={true} size={"large"} />
              }

              <br />
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
