import Home from '../Views/Home'
import Register from '../Views/Access/Register'
import Login from '../Views/Access/Login'
import EmailConfirm from '../Views/EmailConfirm'
import Profile from '../Views/User/Profile'
import LifeWheel from '../Views/LifeWheel'
import Tags from '../Views/Tags'
import Travel from '../Views/Travel'
import TravelCreate from '../Views/Travel/Create'
import TravelDetails from '../Views/Travel/Details'
import VocationPlanning from '../Views/VocationPlanning'
import VocationPlanningCreate from '../Views/VocationPlanning/Create'
import VocationPlanningDetails from '../Views/VocationPlanning/Details'
import Event from '../Views/Event'
import EventCreate from '../Views/Event/Create'
import EventDetails from '../Views/Event/Details'
import Project from '../Views/Project'
import ProjectCreate from '../Views/Project/Create'
import ProjectDetails from '../Views/Project/Details'
import Goal from '../Views/Goal'
import GoalCreate from '../Views/Goal/Create'
import GoalDetails from '../Views/Goal/Details'
import Task from '../Views/Task'
import TaskCreate from '../Views/Task/Create'
import TaskDetails from '../Views/Task/Details'
import AlterEmailConfirm from '../Views/AlterEmailConfirm'
import RecoveryPassword from '../Views/RecoveryPassword'
import RecoveryPasswordConfirm from '../Views/RecoveryPasswordConfirm'
import ROUTE_TYPE from '../Utils/Enums/RouteType'

export default [
  {
    path: '/',
    title: 'Inicio',
    component: Home,
    type: ROUTE_TYPE.PRIVATE
  },
  {
    path: '/login',
    title: '',
    component: Login,
    type: ROUTE_TYPE.PUBLIC
  },
  {
    path: '/register',
    title: '',
    component: Register,
    type: ROUTE_TYPE.PUBLIC
  },
  {
    path: '/mail-activation/:token',
    title: '',
    component: EmailConfirm,
    type: ROUTE_TYPE.PUBLIC
  },
  {
    path: '/update-mail/:token',
    title: '',
    component: AlterEmailConfirm,
    type: ROUTE_TYPE.PUBLIC
  },
  {
    path: '/recovery-password',
    title: '',
    component: RecoveryPassword,
    type: ROUTE_TYPE.PUBLIC
  },
  {
    path: '/recovery-password/:token',
    title: '',
    component: RecoveryPasswordConfirm,
    type: ROUTE_TYPE.PUBLIC
  },
  {
    path: '/life-wheel',
    title: 'Roda da Vida',
    component: LifeWheel,
    type: ROUTE_TYPE.PRIVATE
  },
  {
    path: '/profile',
    title: 'Perfil',
    component: Profile,
    type: ROUTE_TYPE.PRIVATE
  },
  {
    path: '/tags',
    title: 'Tags',
    component: Tags,
    type: ROUTE_TYPE.PRIVATE
  },
  {
    path: '/travels',
    title: 'Viagens',
    component: Travel,
    type: ROUTE_TYPE.PRIVATE
  },
  {
    path: '/travels/create',
    title: 'Viagens',
    component: TravelCreate,
    type: ROUTE_TYPE.PRIVATE
  },
  {
    path: '/travels/:id',
    title: 'Viagens',
    component: TravelDetails,
    type: ROUTE_TYPE.PRIVATE
  },
  {
    path: '/vocation-planning',
    title: 'Planos de Férias',
    component: VocationPlanning,
    type: ROUTE_TYPE.PRIVATE
  },
  {
    path: '/vocation-planning/create',
    title: 'Planos de Férias',
    component: VocationPlanningCreate,
    type: ROUTE_TYPE.PRIVATE
  },
  {
    path: '/vocation-planning/details/:id',
    title: 'Planos de Férias',
    component: VocationPlanningDetails,
    type: ROUTE_TYPE.PRIVATE
  },
  {
    path: '/events',
    title: 'Eventos',
    component: Event,
    type: ROUTE_TYPE.PRIVATE
  },
  {
    path: '/events/create',
    title: 'Evento',
    component: EventCreate,
    type: ROUTE_TYPE.PRIVATE
  },
  {
    path: '/events/details/:id',
    title: 'Evento',
    component: EventDetails,
    type: ROUTE_TYPE.PRIVATE
  },
  {
    path: '/project',
    title: 'Projetos',
    component: Project,
    type: ROUTE_TYPE.PRIVATE
  },
  {
    path: '/project/create',
    title: 'Projeto',
    component: ProjectCreate,
    type: ROUTE_TYPE.PRIVATE
  },
  {
    path: '/project/details/:id',
    title: 'Projeto',
    component: ProjectDetails,
    type: ROUTE_TYPE.PRIVATE
  },
  {
    path: '/goal',
    title: 'Metas',
    component: Goal,
    type: ROUTE_TYPE.PRIVATE
  },
  {
    path: '/goal/create',
    title: 'Metas',
    component: GoalCreate,
    type: ROUTE_TYPE.PRIVATE
  },
  {
    path: '/goal/details/:id',
    title: 'Metas',
    component: GoalDetails,
    type: ROUTE_TYPE.PRIVATE
  },
  {
    path: '/task',
    title: 'Tarefas',
    component: Task,
    type: ROUTE_TYPE.PRIVATE
  },
  {
    path: '/task/create',
    title: 'Tarefas',
    component: TaskCreate,
    type: ROUTE_TYPE.PRIVATE
  },
  {
    path: '/task/details/:id',
    title: 'Tarefas',
    component: TaskDetails,
    type: ROUTE_TYPE.PRIVATE
  }
]