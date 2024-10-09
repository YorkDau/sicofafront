export interface MenuPerfilInterface {
  inicioTitulo: string;
  rutaInicio: string;
  rutaComisaria: MenuRutaComisaria;
  administracion: MenuRutaAdministracion;
  reportes: MenuRutaReporte;
}

export interface MenuRutaComisaria {
  consultaCiudadano: string;
  consultaSolicitudes: string;
  seguimientos: string;
}

export interface MenuRutaAdministracion {
  rolesPermiso: string;
  auditoria: string;
  gestionDominios: string;
  gestionUsuarios: string;
}

export interface MenuRutaReporte {
  informes: string;
  formatosVacios: string;
}

export interface MenuInterface {
  titulo: string;
  icon: string;
  ruta: string | null;
  subRutas: MenuRutaInterface[];
  inicioTitulo?: string;
}
export interface MenuRutaInterface {
  titulo: string;
  ruta: string;
}
