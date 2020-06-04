import React, { Component } from 'react'
import { Card, Row, Col, Typography, Button, notification, Switch, Radio, DatePicker, Skeleton } from 'antd'
import moment from 'moment';
import api from '../../Services/API';
import banner from '../../Assets/image/481712-PGZG0V-372.jpg'

const { Paragraph, Text } = Typography

const initalValue = {
  dataHora: '',
  descricao: ""
}

export default class extends Component {
  state = {
    task: initalValue,
    canUpdate: false, // when changed contents the button update show
    updating: false,//when to update, feedback tooo user
    visible: false,
    showRecorrencia: false,
    unitTimes: [],
    status: []
  }

  componentDidMount = async () => {
    const path = window.location.hash.split('/')
    const task = await api.get(`/tarefas/${path[3]}`)

    this.setState({
      task,
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

  render() {
    const { updating, canUpdate, task, showRecorrencia, unitTimes } = this.state
    const { descricao, dataHora, notificacoes, recorrencia, anotacoes } = task

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
            <Col offset={1}>
              <Text disabled>Descrição:</Text><br />
              {
                descricao ?
                  <Paragraph editable={{ onChange: str => this.handlerData({ str, name: 'descricao' }) }}>{descricao}</Paragraph>
                  : <Skeleton.Input active={true} size={"large"} />
              }
              <Text disabled>Data Hora:</Text><br />
              {
                dataHora ?
                  <Paragraph editable={{ onChange: str => this.handlerData({ str, name: 'dataHora' }) }}>{moment(dataHora).format('DD/MM/YYYY')}</Paragraph>
                  : <Skeleton.Input active={true} size={"large"} />
              }
              <Text disabled>Ativar Notificação:</Text><br />
              <Switch onChange={() => this.setState({ showRecorrencia: !showRecorrencia })} defaultChecked={showRecorrencia} />
              <br />
              {
                showRecorrencia ?
                  <>
                    <Text disabled>Recorrência:</Text><br />
                    <Radio.Group>
                      {
                        unitTimes.map(m => (
                          <Radio.Button value={m.value}>{m.label}</Radio.Button>
                        ))
                      }
                    </Radio.Group><br /><br />

                    <Text disabled>Data Limite:</Text> <br />
                    <Paragraph editable={{ onChange: str => this.handlerData({ str, name: 'recorrencia.dataLimite' }) }}>{moment(recorrencia.dataLimite).format('DD/MM/YYYY')}</Paragraph>
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
