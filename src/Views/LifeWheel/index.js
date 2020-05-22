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

  onChangeValue = (value, record) => {
    const { lifeWheel, dataGraph } = this.state

    this.setState({
      lifeWheel: lifeWheel.map((l, i) => {
        if (l.avaliacao === record.avaliacao) {
          l.value = value
          dataGraph.data[i] = parseInt(value)
        }
        return l
      }),
      dataGraph
    })

    this.renderChart()
  }

  render() {
    return (
      <div>
        <Card>
          <Row>
            <Col span={14}>
              <canvas id="life-wheel"></canvas>
            </Col>
            <Col span={10}>
              <Table dataSource={this.state.lifeWheel}>
                <Column title="Avaliações" dataIndex="avaliacao" key="avaliacao" />
                <Column title="Valor" dataIndex="value" key="value" render={(text, record) => <Paragraph editable={{ onChange: (e) => this.onChangeValue(e, record) }}>{text}</Paragraph>} />
              </Table>
            </Col>
          </Row>
        </Card>
      </div>
    )
  }
}
