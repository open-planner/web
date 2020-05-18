import React, { Component } from 'react'
import { Card, Row, Col, Table } from 'antd'
import Chart from 'chart.js';

const dataSource = [
  {
    key: '1',
    name: 'Mike',
    age: 32,
  },
  {
    key: '2',
    name: 'John',
    age: 42,
  },
];

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
  },
];

export default class index extends Component {
  componentDidMount = () => {
    this.renderChart()
  }

  renderChart = () => {
    var presets = window.chartColors;

    var data = {
      labels: ['casa', 'da', 'veia', 'man', 'doido'],
      datasets: [{
        borderColor: '#ff0000',
        data: [1, 3, 10, 4, 7],
        label: 'D0'
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

  render() {
    return (
      <div>
        <Card>
          <Row>
            <Col span={18}>
              <canvas id="life-wheel"></canvas>
            </Col>
            <Col>
              <Table dataSource={dataSource} columns={columns} />
            </Col>
          </Row>
        </Card>
      </div>
    )
  }
}
