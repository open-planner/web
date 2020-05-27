import React, { Component } from 'react'
import { Card, Row, Col, Typography, Button, notification, Switch, Radio, DatePicker } from 'antd'
import moment from 'moment';
import api from '../../Services/API';

const { Paragraph, Text } = Typography

const initalValue = {
  dataHora: '',
  descricao: ""
}

export default class extends Component {
  state = {
    event: initalValue,
    canUpdate: false, // when changed contents the button update show
    updating: false,//when to update, feedback tooo user
    visible: false,
    showRecorrencia: false,
    unitTimes: []
  }

  componentDidMount = async () => {
    const path = window.location.pathname.split('/')
    const event = await api.get(`/eventos/${path[3]}`)

    this.setState({
      event,
      unitTimes: await api.get('/eventos/recorrencias/time-units'),
      showRecorrencia: event.notificacoes.length > 0
    })
  }

  update = async () => {
    const { event } = this.state
    const id = event.id
    delete event.id
    delete event.relacao

    // clean ids
    event.notificacoes = event.notificacoes.map(m => ({
      dataHora: m.dataHora,
      email: m.email
    }))

    this.setState({
      updating: true
    })

    await api.put(`/eventos/${id}`, event)

    notification.open({
      message: 'Sucesso',
      description: `Evento atualizado com sucesso.`,
    });

    this.setState({
      updating: false,
      canUpdate: false
    })
  }

  handlerData = ({ str, name }) => {
    this.setState({ event: { ...this.state.event, [name]: str }, canUpdate: true });
  };

  render() {
    const { updating, canUpdate, event, showRecorrencia, unitTimes } = this.state
    const { descricao, dataHora, notificacoes, recorrencia } = event

    return (
      <div>
        <Card>
          <Row>
            {/* side image and name */}
            <Col span={8}>
              <img width="450" className='rounded-half' src="https://image.freepik.com/free-vector/people-celebrating-together_23-2148399973.jpg" alt="Summer vector created by gstudioimagen - www.freepik.com" />
              {/* <a href="https://www.freepik.com/free-photos-vectors/summer">Summer vector created by gstudioimagen - www.freepik.com</a> */}
            </Col>
            {/* side content user */}
            <Col offset={1}>
              <Text disabled>Descrição:</Text><br />
              <Paragraph editable={{ onChange: str => this.handlerData({ str, name: 'descricao' }) }}>{descricao}</Paragraph>
              <Text disabled>Data Hora:</Text><br />
              <Paragraph editable={{ onChange: str => this.handlerData({ str, name: 'dataHora' }) }}>{moment(dataHora).format('DD/MM/YYYY')}</Paragraph>
              <Text disabled>Ativar Notificação:</Text><br />
              <Switch onChange={() => this.setState({ showRecorrencia: !showRecorrencia })} defaultChecked={showRecorrencia} />
              <br /><br />
              {
                showRecorrencia &&
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
