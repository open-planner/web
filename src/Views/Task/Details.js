import React, { Component } from 'react'
import { Card, Row, Col, Typography, Button, notification, Switch, Radio, Skeleton, Select } from 'antd'
import moment from 'moment';
import api from '../../Services/API';
import banner from '../../Assets/image/481712-PGZG0V-372.jpg'
import CheckableTag from 'antd/lib/tag/CheckableTag';

const { Paragraph, Text } = Typography
const { Option } = Select;
const initalValue = {
  dataHora: '',
  descricao: "",
  status: "",
}

export default class extends Component {
  state = {
    task: initalValue,
    canUpdate: false, // when changed contents the button update show
    updating: false,//when to update, feedback tooo user
    visible: false,
    showRecorrencia: false,
    unitTimes: [],
    status: [],
    tags: {
      all: [],
      selected: []
    }
  }

  componentDidMount = async () => {
    const path = window.location.hash.split('/')
    const task = await api.get(`/tarefas/${path[3]}`)

    this.setState({
      task,
      tags: {
        all: (await api.get('/tags')).content,
        selected: task.tags
      },
      status: await api.get('/tarefas/status'),
      unitTimes: await api.get('/tarefas/recorrencias/time-units'),
      showRecorrencia: task.notificacoes.length > 0
    })
  }

  update = async () => {
    const { task } = this.state
    const id = task.id
    delete task.id
    delete task.relacao

    // clean ids
    task.notificacoes = task.notificacoes.map(m => ({
      dataHora: m.dataHora,
      email: m.email
    }))

    this.setState({
      updating: true
    })

    await api.put(`/tarefas/${id}`, task)

    notification.open({
      message: 'Sucesso',
      description: `Tarefas atualizado com sucesso.`,
    });

    this.setState({
      updating: false,
      canUpdate: false
    })
  }

  handlerData = ({ str, name }) => {
    this.setState({ task: { ...this.state.task, [name]: str }, canUpdate: true });
  };


  handleChangeTags = (tag, checked) => {
    const { tags } = this.state;
    const nextSelectedTags = checked ? [...tags.selected, tag] : tags.selected.filter(t => t !== tag);
    this.setState({ tags: { ...tags, selected: nextSelectedTags }, canUpdate: true });
  }

  render() {
    const { updating, canUpdate, task, showRecorrencia, unitTimes, status, tags } = this.state
    const { descricao, dataHora, notificacoes, recorrencia, anotacoes } = task

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
            <Col offset={1}>
              <Text disabled>Descrição:</Text><br />
              {
                descricao ?
                  <Paragraph editable={{ onChange: str => this.handlerData({ str, name: 'descricao' }) }}>{descricao}</Paragraph>
                  : <Skeleton.Input active={true} size={"large"} />
              }
              <Text disabled>Anotações:</Text><br />
              {
                anotacoes ?
                  <Paragraph editable={{ onChange: str => this.handlerData({ str, name: 'anotacoes' }) }}>{anotacoes}</Paragraph>
                  : <Skeleton.Input active={true} size={"large"} />
              }
              <Text disabled>Data Hora:</Text><br />
              {
                dataHora ?
                  <Paragraph editable={{ onChange: str => this.handlerData({ str, name: 'dataHora' }) }}>{moment(dataHora).format('DD/MM/YYYY')}</Paragraph>
                  : <Skeleton.Input active={true} size={"large"} />
              }
              <Text disabled>Status:</Text><br />
              {
                task.status ?
                  <Select placeholder="Selecione um status"
                    onChange={str => this.handlerData({ str, name: 'status' })}
                    defaultValue={task.status}>
                    {
                      status.map(item => (
                        <Option value={item.value}>
                          {item.label}
                        </Option>
                      ))
                    }
                  </Select>
                  : <Skeleton.Input active={true} size={"large"} />
              }

              <br />
              <br />
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
              <Switch onChange={() => this.setState({ showRecorrencia: !showRecorrencia })} defaultChecked={!showRecorrencia} />
              <br />
              <br />
              {
                showRecorrencia ?
                  <>
                    <Text disabled>Recorrência:</Text><br />
                    {
                      unitTimes.length ?
                        <>
                          <Radio.Group defaultValue={recorrencia.unidade}>
                            {
                              unitTimes.map(m => (
                                <Radio.Button value={m.value}>{m.label}</Radio.Button>
                              ))
                            }
                          </Radio.Group><br /><br />
                        </>
                        : <Skeleton.Input active={true} size={"large"} />
                    }

                    <Text disabled>Data Limite:</Text> <br />
                    {
                      recorrencia.dataLimite ?
                        <Paragraph editable={{ onChange: str => this.handlerData({ str, name: 'recorrencia.dataLimite' }) }}>{moment(recorrencia.dataLimite).format('DD/MM/YYYY')}</Paragraph>
                        : <Skeleton.Input active={true} size={"large"} />
                    }
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
