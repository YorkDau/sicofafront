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
        titulo: 'Consulta Involucrados',
        ruta: './involucrado',
      },
      {
        titulo: 'Consulta General',
        ruta: './consulta/comisaria-general'
      }
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
        titulo: 'Consulta Involucrados',
        ruta: './involucrado',
      },
      {
        titulo: 'Seguimientos',
        ruta: './psicologia/seguimientos',
      },
      {
        titulo: 'Consulta General',
        ruta: './consulta/comisaria-general'
      }
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
      {
        titulo: 'Consulta Involucrados',
        ruta: './involucrado',
      },
      {
        titulo: 'Consulta General',
        ruta: './consulta/comisaria-general'
      }
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
  {
    titulo: 'Consultas',
    icon: './assets/images/grafico-histograma.svg',
    ruta: null,
    subRutas: [
      {
        titulo: 'Apelaciones',
        ruta: './consulta/apelaciones',
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
        titulo: 'Consulta Involucrados',
        ruta: './involucrado',
      },
      {
        titulo: 'Seguimientos',
        ruta: './comisario/seguimientos',
      },
      {
        titulo: 'Consulta General',
        ruta: './consulta/comisaria-general'
      }
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
  {
    titulo: 'Tableros de Control',
    icon: './assets/images/grafico-histograma.svg',
    ruta: null,
    subRutas: [
      {
        titulo: 'Tablero General',
        ruta: './reportes/tablero1',
      },
     /**  {
        titulo: 'Tablero 2',
        ruta: './reportes/formatos-vacios',
      },
      {
        titulo: 'Tablero 3',
        ruta: './reportes/formatos-vacios',
      },
      {
        titulo: 'Tablero 4',
        ruta: './reportes/formatos-vacios',
      },**/
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
      {
        titulo: 'Consulta Involucrados',
        ruta: './involucrado',
      },
      {
        titulo: 'Seguimientos',
        ruta: './psicologia/seguimientos',
      },
      {
        titulo: 'Consulta General',
        ruta: './consulta/comisaria-general'
      }
    ],
  }
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
{
    titulo: 'Tableros de Control',
    icon: './assets/images/grafico-histograma.svg',
    ruta: null,
    subRutas: [
      {
        titulo: 'Tablero General',
        ruta: './reportes/tablero1',
      },
     /**  {
        titulo: 'Tablero 2',
        ruta: './reportes/formatos-vacios',
      },
      {
        titulo: 'Tablero 3',
        ruta: './reportes/formatos-vacios',
      },
      {
        titulo: 'Tablero 4',
        ruta: './reportes/formatos-vacios',
      },**/
    ],
  },
  // {
  //   titulo: 'Conversor de Archivos',
  //   icon: './assets/images/document-white.svg',
  //   ruta: '/conversor',
  //   subRutas: []
  // },
];
