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
        title: 'Registrar',
        icon: '',
        link: '/register'
      },
      {
        title: 'Login',
        icon: '',
        link: '/login'
      },
      {
        title: 'Perfil',
        icon: '',
        link: '/profile/id-here'
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
  },
  {
    title: 'Avaliação',
    icon: CheckOutlined,
    link: '/avaliable',
    children: []
  }
]