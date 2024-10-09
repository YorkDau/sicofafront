import { MenuInterface } from '../interfaces/menu.interface';

export const perfilAuxiliar: MenuInterface[] = [
  {
    titulo: 'Inicio Recepción',
    icon: './assets/images/home-free-icon-font.svg',
    ruta: '/recepcion-auxiliar',
    subRutas: [],
    inicioTitulo: 'Auxiliar',
  },
  {
    titulo: 'Comisaría',
    icon: './assets/images/documento-firmado.svg',
    ruta: null,
    subRutas: [
      {
        titulo: 'Consulta Ciudadanos',
        ruta: './ciudadano',
      },
      {
        titulo: 'Seguimientos',
        ruta: './agenda',
      },
    ],
  },
  {
    titulo: 'Configuración',
    icon: './assets/images/documento-firmado.svg',
    ruta: null,
    subRutas: [
      {
        titulo: 'Usuarios',
        ruta: './usuario',
      },
      {
        titulo: 'Permisos',
        ruta: './permiso',
      },
      {
        titulo: 'Perfiles',
        ruta: './perfil',
      },
    ],
  },
  {
    titulo: 'Reportes',
    icon: './assets/images/grafico-histograma.svg',
    ruta: null,
    subRutas: [
      {
        titulo: 'Formatos Vacios',
        ruta: './reportes/formatos-vacios',
      },
    ],
  },
];

export const perfilPsicologo: MenuInterface[] = [
  {
    titulo: 'Inicio Psicología',
    icon: './assets/images/home-free-icon-font.svg',
    ruta: './psicologia',
    subRutas: [],
    inicioTitulo: 'Psicologia',
  },
  {
    titulo: 'Comisaría',
    icon: './assets/images/documento-firmado.svg',
    ruta: null,
    subRutas: [
      {
        titulo: 'Consulta Ciudadanos',
        ruta: './ciudadano',
      },
      {
        titulo: 'Seguimientos',
        ruta: './psicologia/seguimientos',
      },
    ],
  },
  {
    titulo: 'Reportes',
    icon: './assets/images/grafico-histograma.svg',
    ruta: null,
    subRutas: [
      {
        titulo: 'Formatos Vacios',
        ruta: './reportes/formatos-vacios',
      },
    ],
  },
];

export const perfilAbogado: MenuInterface[] = [
  {
    titulo: 'Inicio Revisión Legal',
    icon: './assets/images/home-free-icon-font.svg',
    ruta: './abogado/casos',
    subRutas: [],
    inicioTitulo: 'Abogado',
  },
  {
    titulo: 'Comisaría',
    icon: './assets/images/documento-firmado.svg',
    ruta: null,
    subRutas: [
      {
        titulo: 'Seguimientos',
        ruta: './abogado/seguimientos',
      },
    ],
  },
  {
    titulo: 'Reportes',
    icon: './assets/images/grafico-histograma.svg',
    ruta: null,
    subRutas: [
      {
        titulo: 'Formatos Vacios',
        ruta: './reportes/formatos-vacios',
      },
    ],
  },
];

export const perfilComisario: MenuInterface[] = [
  {
    titulo: 'Inicio Comisario',
    icon: './assets/images/home-free-icon-font.svg',
    ruta: './comisario/casos',
    subRutas: [],
    inicioTitulo: 'Comisario',
  },
  {
    titulo: 'Comisaría',
    icon: './assets/images/documento-firmado.svg',
    ruta: null,
    subRutas: [
      {
        titulo: 'Consulta Ciudadanos',
        ruta: './ciudadano',
      },
      {
        titulo: 'Seguimientos',
        ruta: './comisario/seguimientos',
      },
    ],
  },
  {
    titulo: 'Administracion',
    icon: './assets/images/resistente-a-los-neumaticos.svg',
    ruta: null,
    subRutas: [
      {
        titulo: 'Gestión de Usuarios',
        ruta: './comisario/gestion-usuarios',
      },
      {
        titulo: 'Actualizar Comisaría',
        ruta: './comisario/actualizar-comisaria',
      },
    ],
  },
];

export const perfilTrabajadorSocial: MenuInterface[] = [
  {
    titulo: 'Inicio Trabajador Social',
    icon: './assets/images/home-free-icon-font.svg',
    ruta: './trabajador-social/casos',
    subRutas: [],
    inicioTitulo: 'Trabajador Social',
  },
  {
    titulo: 'Comisaría',
    icon: './assets/images/documento-firmado.svg',
    ruta: null,
    subRutas: [
      {
        titulo: 'Consulta Ciudadanos',
        ruta: './ciudadano',
      },
    ],
  },
];

export const perfilAdministrador: MenuInterface[] = [
  {
    titulo: 'Administración',
    icon: './assets/images/resistente-a-los-neumaticos.svg',
    ruta: null,
    subRutas: [
      {
        titulo: 'Comisarias',
        ruta: './administrador/listado-comisarias',
      },
      {
        titulo: 'Gestión de Dominios',
        ruta: './comisario/gestion-dominios',
      },
    ],
    inicioTitulo: 'Administrador',
  },
  {
    titulo: 'Reportes',
    icon: './assets/images/grafico-histograma.svg',
    ruta: null,
    subRutas: [
      {
        titulo: 'Generar Reportes',
        ruta: './reportes/generar-reportes',
      },
      {
        titulo: 'Formatos Vacios',
        ruta: './reportes/formatos-vacios',
      },
    ],
  },
];
