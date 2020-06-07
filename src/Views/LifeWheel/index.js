import React, { Component } from 'react'
import { Card, Row, Col, Table, Button, Typography } from 'antd'
import Chart from 'chart.js';
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import api from '../../Services/API';
import _ from 'lodash'

const { Paragraph } = Typography;
const { Column } = Table;

export default class index extends Component {
  state = {
    lifeWheel: [],
    dataGraph: {
      labels: [],
      data: []
    }
  }

  componentDidMount = async () => {
    const data = await api.get('/roda-vida')
    const labels = []
    const dataItens = []
    const lifeWheel = []

    _.forEach(data, (value, key) => {
      labels.push(key)
      dataItens.push(value)
      lifeWheel.push({
        avaliacao: key,
        value
      })
    })

    this.setState({
      lifeWheel,
      dataGraph: {
        labels,
        data: dataItens
      }
    })
    this.renderChart()
  }

  renderChart = () => {
    var data = {
      labels: this.state.dataGraph.labels,
      datasets: [{
        borderColor: '#ff0000',
        data: this.state.dataGraph.data,
        label: 'Avaliações'
      }]
    };

    var options = {
      maintainAspectRatio: true,
      spanGaps: false,
      elements: {
        line: {
          tension: 0.0000000001
        }
      },
      scale: {
        angleLines: {
          display: false
        },
        ticks: {
          suggestedMin: 0,
          suggestedMax: 1
        }
      },
      plugins: {
        filler: {
          propagate: false
        },
        'samples-filler-analyser': {
          target: 'chart-analyser'
        }
      }
    };

    new Chart('life-wheel', {
      type: 'radar',
      data: data,
      options: options
    });
  }

  // prepare the object to send update
  prepareObjectLifWheel = (data) => {
    const lifeWheel = {}

    data.forEach(item => {
      lifeWheel[item.avaliacao] = item.value
    })

    return lifeWheel
  }

  onChangeValue = async (value, record) => {
    value = value.replace('%', '') / 100
    const { lifeWheel, dataGraph } = this.state
    // add the value in lifewheel
    const data = lifeWheel.map((l, i) => {
      if (l.avaliacao === record.avaliacao) {
        l.value = value
        dataGraph.data[i] = value
      }
      return l
    })

    // atualizando noo banco de dados
    await api.put('/roda-vida', this.prepareObjectLifWheel(data))

    // alterando visualmente
    this.setState({
      lifeWheel: data,
      dataGraph
    })

    // update chart
    this.renderChart()
  }

  render() {
    return (
      <div>
        <Card>
          <Row>
            <Col span={18}>
              <canvas id="life-wheel"></canvas>
            </Col>
            <Col span={6}>
              <Table dataSource={this.state.lifeWheel} pagination={false}>
                <Column title="Avaliações" dataIndex="avaliacao" key="avaliacao" />
                <Column title="Porcentagem" dataIndex="value" key="value" render={(text, record) => <Paragraph editable={{ onChange: (e) => this.onChangeValue(e, record) }}>{(text * 100).toFixed(1) + '%'}</Paragraph>} />
              </Table>
            </Col>
          </Row>
        </Card>
      </div>
    )
  }
}
