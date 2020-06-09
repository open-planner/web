import React, { Component } from 'react'
import Text from 'antd/lib/typography/Text'
import { List, Divider } from 'antd'
import { Popover, Badge } from 'antd'
import {
  NotificationOutlined,
} from '@ant-design/icons';
import api from '../../Services/API';
import moment from 'moment'
import { Link } from 'react-router-dom';

export default class index extends Component {
  state = {
    notification: []
  }

  componentDidMount = async () => {
    let notification = (await api.get('notificacoes', { params: { sort: 'dataHora,desc' } })).content
    notification = await Promise.all(notification.map(async m => {
      let type
      let typeLink

      switch (m.tipo) {
        case 'Projeto':
          type = 'projetos'
          typeLink = 'project'
          break;
        case 'Tarefa':
          type = 'tarefas'
          typeLink = 'task'
          break;
      }

      const item = (await api.get(`/${type}`, { params: { dataHora: m.dataHora, descricao: m.descricao } })).content[0]

      return {
        ...m,
        link: `/${typeLink}/details/${item.id}`
      }
    }))

    this.setState({
      notification
    })
  }

  clickedLink = async id => {
    await api.patch(`/notificacoes/${id}/lida`)
  }

  render() {
    const { notification } = this.state

    return (
      <Popover placement="bottomRight" title={''}
        content={() => (
          <List
            size="small"
            dataSource={notification}
            renderItem={item =>
              <List.Item>
                <Link to={item.link} onClick={() => this.clickedLink(item.id)}>
                  <Text>{item.descricao}</Text> <br />
                  <Text type="secondary">{moment(item.dataHora).format('DD/MM/YYYY')}</Text>
                </Link>
              </List.Item>
            }
          />
        )} trigger="click">
        <Badge count={notification.length} dot>
          <NotificationOutlined />
        </Badge>
      </Popover>
    )
  }
}
