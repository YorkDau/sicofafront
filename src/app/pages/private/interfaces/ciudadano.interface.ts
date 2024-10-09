export interface CiudadanoInterface {
  nombres: string;
  apellidos: string;
  tipo_documento?: string;
  numero_documento?: string;
  numero_solicitudes?: string;
  fecha_ult_solicitud?: string;
  idCiudadano: number;
}
export interface CiudadanoDetalleInterface {
  id?: number;
  nombre_ciudadano?: string;
  primer_apellido?: string;
  segundo_apellido?: string;
  tipo_documento?: string;
  numero_documento?: string;
  celular?: string;
  correo_electronico?: string;
  telefono_fijo?: string;
  edad?: string;
  fecha_nacimiento?: Date;
  registro_completo?: boolean;
  requiereModificacon?: boolean;

  pueblo_indigena?: string
  poblacion_lgtbi?: boolean
  nino_nina_adolecente?: boolean
  victima_conflicto_armado?: boolean
  persona_lider_defensor_DH?: boolean
  persona_habitalidad_calle?: boolean
  migrante?: boolean
}

export interface CiudadanoCompletoInterface {
  idCiudadano?: number;
  primerNombre: string;
  segundoNombre?: string;
  primerApellido: string;
  segundoApellido?: string;
  idTipoDocumento: number;
  numeroDocumento: string;
  fechaExpedicion: string;
  idlugarExpedicion: number;
  fechaNacimiento: string;
  edad: number;
  idPaisNacimiento: number;
  idDepartamentoNacimiento?: number;
  idMunicipioNacimiento?: number;
  idSexo?: number;
  idIdentidadGenero?: number;
  idOrientacionSexual?: number;
  idNivelAcademico: number;
  direccionResidencia: string;
  idLocalidad?: number;
  barrio: string;
  telefono?: string;
  celular?: string;
  correoElectronico?: string;
  idDiscapasidad?: number;
  estadoEmbarazo: EstadoEmbarazo;
  afiliadoSeguridadSocial: AfiliadoSeguridadSocial;
  poblacionLgtbi?: boolean;
  ninoNinaAdolocente?: boolean;
  migrante?: boolean;
  victimaConflictoArmado?: boolean;
  personasLideresDefensorasDH?: boolean;
  personasHabitalidadCalle?: boolean;
  puebloIndigena?: string;
}

export interface AfiliadoSeguridadSocial {
  estaAfiliado: string;
  eps?: string;
  ips?: string;
}

export interface EstadoEmbarazo {
  estadoEmbarazo: string;
  mesesEmbarazo?: number;
}

export interface NivelAcademicoInterface {
  id: number;
  nivelAcademico: string;
}

export interface PaisInterface {
  paisID: number;
  nombrePais: string;
}

export interface SexoInterface {
  sexoID: number;
  sexoNombre: string;
}

export interface TipoDocumentoInterface {
  idTipoDocumento: number;
  tipo_documento: string;
}

export interface DepartamentoInterface {
  departamentoID: number;
  departamentoNombre: string;
}

export interface MunicipioInterface {
  idDep: number;
  ciudmunID: number;
  nombCiudMun: string;
}

export interface DiscapacidadInterface {
  id_tipo_discapacidad: number;
  descripcion: string;
}

export interface DominioInterface {
  id_Dominio: number;
  tipo_Dominio: string;
  codigo: string;
  nombre_Dominio: string;
  tipo_Lista: string;
}

export interface LugarExpedicionInterface {
  idDep: number;
  ciudmunID: number;
  nombCiudMun: string;
  codigo: string;
}

export interface InformacionCiudadanoInterface {
  id: number;
  nombre_ciudadano: string;
  primer_apellido: string;
  segundo_apellido: string;
  tipo_documento: string;
  celular: string;
  telefono_fijo: string;
  edad: number;
  fecha_nacimiento: string;
  correo_electronico: string;
  numero_documento: string;
  registro_completo: boolean;
}
