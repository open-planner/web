import {
  HomeOutlined,
  DashboardOutlined,
  TagsOutlined,
  UserOutlined,
  CheckOutlined,
  DingtalkOutlined,
  BookOutlined,
  CalendarOutlined
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
  },
  {
    title: 'Viagens',
    icon: DingtalkOutlined,
    link: '/travels',
    children: []
  },
  {
    title: 'Plano de Férias',
    icon: BookOutlined,
    link: '/vocation-planning',
    children: []
  },
  {
    title: 'Eventos',
    icon: CalendarOutlined,
    link: '/events',
    children: []
  },
  {
    title: 'Projetos',
    icon: CalendarOutlined,
    link: '/project',
    children: []
  },
  {
    title: 'Metas',
    icon: CalendarOutlined,
    link: '/goal',
    children: []
  },
  {
    title: 'Tarefas',
    icon: CalendarOutlined,
    link: '/task',
    children: []
  }
]