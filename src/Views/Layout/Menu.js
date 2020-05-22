import {
  HomeOutlined,
  DashboardOutlined,
  TagsOutlined,
  UserOutlined,
  CheckOutlined,
} from '@ant-design/icons';

export default [
  {
    title: 'Início',
    icon: HomeOutlined,
    link: '/',
    children: []
  },
  {
    title: 'Usuário',
    icon: UserOutlined,
    link: '',
    children: [
      {
        title: 'Perfil',
        icon: '',
        link: '/profile'
      }
    ]
  },
  {
    title: 'Roda da Vida',
    icon: DashboardOutlined,
    link: '/life-wheel',
    children: []
  },
  {
    title: 'Tags',
    icon: TagsOutlined,
    link: '/tags',
    children: []
  }
]