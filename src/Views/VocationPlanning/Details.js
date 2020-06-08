import React, { Component } from 'react'
import { Card, Row, Col, Typography, Button, Form, Select, Modal, notification, Skeleton } from 'antd'
import moment from 'moment';
import ConvertStringDate from '../../Utils/ConvertStringDate'
import api from '../../Services/API';

const { Option } = Select;
const { Paragraph, Text } = Typography
const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const initalValue = {
  destino: "",
  id: 0,
  periodo: {
    dataFim: "",
    dataInicio: ""
  },
  status: "",
  tipo: "",
  anotacoes: ""
}

export default class extends Component {
  state = {
    vocationPlanning: initalValue,
    canUpdate: false, // when changed contents the button update show
    updating: false,//when to update, feedback tooo user
    visible: false,
    status: []
  }

  componentDidMount = async () => {
    const path = window.location.hash.split('/')
    const vocationPlanning = await api.get(`/planos-ferias/${path[3]}`)

    this.setState({
      vocationPlanning,
      status: await api.get('/planos-ferias/status')
    })
  }

  update = async () => {
    const { vocationPlanning } = this.state
    const id = vocationPlanning.id
    delete vocationPlanning.id

    this.setState({
      updating: true
    })

    await api.put(`/planos-ferias/${id}`, vocationPlanning)

    notification.open({
      message: 'Sucesso',
      description: `Plano de férias atualizado com sucesso.`,
    });

    this.setState({
      updating: false,
      canUpdate: false
    })
  }

  handlerData = ({ str, name }) => {
    this.setState({ vocationPlanning: { ...this.state.vocationPlanning, [name]: str }, canUpdate: true });
  };

  handlerDataDate = ({ str, name }) => {
    this.state.vocationPlanning.periodo[name] = str
    this.setState({ vocationPlanning: this.state.vocationPlanning, canUpdate: true });
  };

  render() {
    const { updating, canUpdate, vocationPlanning, status } = this.state
    const { destino, periodo, anotacoes } = vocationPlanning

    return (
      <div>
        <Card>
          <Row>
            {/* side image and name */}
            <Col span={8}>
              <img style={{ width: '100%' }} className='rounded-half' src="https://image.freepik.com/free-vector/beach-vacations_24908-53916.jpg" alt="Summer vector created by gstudioimagen - www.freepik.com" />
              {/* <a href="https://www.freepik.com/free-photos-vectors/summer">Summer vector created by gstudioimagen - www.freepik.com</a> */}
            </Col>
            {/* side content user */}
            <Col span={14} offset={1}>
              <Text disabled>Destino:</Text>
              {
                destino ?
                  <Paragraph editable={{ onChange: str => this.handlerData({ str, name: 'destino' }) }}>{destino}</Paragraph>
                  : <Skeleton.Input active={true} size={"large"} />
              }
              <Text disabled>Data Início:</Text>
              {
                periodo.dataInicio ?
                  <Paragraph editable={{ onChange: str => this.handlerDataDate({ str: ConvertStringDate(str), name: 'dataInicio' }) }}>{moment(periodo.dataInicio).format('DD/MM/YYYY')}</Paragraph>
                  : <Skeleton.Input active={true} size={"large"} />
              }
              <Text disabled>Data Fim:</Text>
              {
                periodo.dataFim ?
                  <Paragraph editable={{ onChange: str => this.handlerDataDate({ str: ConvertStringDate(str), name: 'pediododataFim' }) }}>{moment(periodo.dataFim).format('DD/MM/YYYY')}</Paragraph>
                  : <Skeleton.Input active={true} size={"large"} />
              }

              <Text disabled>Status:</Text>
              {
                vocationPlanning.status ?
                  <Form.Item name={['travel', 'status']} rules={[{ required: true }]}>
                    <Select placeholder="Selecione um status"
                      onChange={str => this.handlerData({ str, name: 'status' })}
                      defaultValue={vocationPlanning.status}>
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
              <Text disabled>Anotações</Text>
              {
                anotacoes ?
                  <Paragraph editable={{ onChange: str => this.handlerData({ str, name: 'anotacoes' }) }}>{anotacoes}</Paragraph>
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
