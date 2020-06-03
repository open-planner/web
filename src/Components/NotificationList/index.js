import React, { Component } from 'react'
import Text from 'antd/lib/typography/Text'
import { List, Divider } from 'antd'
import { Popover, Badge } from 'antd'
import {
  NotificationOutlined,
} from '@ant-design/icons';
import api from '../../Services/API';
import moment from 'moment'

export default class index extends Component {
  state = {
    notification: []
  }

  componentDidMount = async () => {
    this.setState({
      notification: (await api.get('notificacoes')).content
    })
  }

  render() {
    const { notification } = this.state

    return (
      <Popover placement="bottomRight" title={''}
        content={() => (
          <List
            size="small"
            dataSource={notification}
            renderItem={item => <List.Item>
              <Text>{item.descricao}</Text> <br />
              <Text type="secondary">{moment(item.dataHora).format('DD/MM/YYYY')}</Text>
            </List.Item>}
          />
        )} trigger="click">
        <Badge count={notification.length} dot>
          <NotificationOutlined />
        </Badge>
      </Popover>
    )
  }
}
