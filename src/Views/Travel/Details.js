import React, { Component } from 'react'
import { Card, Row, Col, Typography, Button, notification, Form, Select, Skeleton } from 'antd'
import moment from 'moment';
import api from '../../Services/API';
import banner from '../../Assets/image/3075759.jpg'
import ConvertStringDate from '../../Utils/ConvertStringDate'

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
    travel: initalValue,
    canUpdate: false, // when changed contents the button update show
    updating: false,//when to update, feedback tooo user
    visible: false,
    status: [],
    type: [],
    tags: {
      all: [],
      selected: []
    }
  }

  componentDidMount = async () => {
    const path = window.location.hash.split('/')
    const travel = await api.get(`/viagens/${path[2]}`)

    this.setState({
      travel,
      status: await api.get('/viagens/status'),
      type: await api.get('/viagens/tipos')
    })
  }

  update = async () => {
    const { travel } = this.state

    const id = travel.id
    delete travel.id

    this.setState({
      updating: true
    })

    travel.tipo = travel.tipo.toUpperCase()
    travel.status = travel.status.toUpperCase()

    try {
      await api.put(`/viagens/${id}`, travel)

      notification.open({
        message: 'Sucesso',
        description: `Evento atualizado com sucesso.`,
      });
    } catch (err) {
      console.log(err)
    }

    this.setState({
      updating: false,
      canUpdate: false
    })
  }

  handlerData = ({ str, name }) => {
    this.setState({ travel: { ...this.state.travel, [name]: str }, canUpdate: true });
  }

  handlerDataDate = ({ str, name }) => {
    this.state.travel.periodo[name] = str
    this.setState({ travel: this.state.travel, canUpdate: true });
  }

  render() {
    const { updating, canUpdate, travel, status, type } = this.state
    const { destino, periodo, anotacoes } = travel

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
              <Text disabled>Destino:</Text><br />
              {
                destino ?
                  <Paragraph editable={{ onChange: str => this.handlerData({ str, name: 'destino' }) }}>{destino}</Paragraph>
                  : <Skeleton.Input active={true} size={"large"} />
              }
              <Text disabled>Anotações:</Text><br />
              {
                anotacoes ?
                  <Paragraph editable={{ onChange: str => this.handlerData({ str, name: 'anotacoes' }) }}>{anotacoes}</Paragraph>
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
                travel.status ?
                  <Form.Item name={['travel', 'status']} rules={[{ required: true }]}>
                    <Select placeholder="Selecione um status"
                      onChange={str => this.handlerData({ str, name: 'status' })}
                      defaultValue={travel.status}>
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

              <Text disabled>tipo:</Text><br />
              {
                travel.tipo ?
                  <Form.Item name={['travel', 'tipo']} rules={[{ required: true }]}>
                    <Select placeholder="Selecione um tipo"
                      onChange={str => this.handlerData({ str, name: 'tipo' })}
                      defaultValue={travel.tipo}>
                      {
                        type.map(item => (
                          <Option value={item.value}>
                            {item.label}
                          </Option>
                        ))
                      }
                    </Select>
                  </Form.Item>
                  : <Skeleton.Input active={true} size={"large"} />
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
