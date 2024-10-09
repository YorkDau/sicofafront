export interface SolicitudServicioInterface {
  id_solicitud_servicio?: number;
  codigo_solicitud?: number;
  fecha_solicitud?: Date;
  hora_solicitud?: Date;
  descripcion_de_hechos?: string;
  estado_de_la_solicitud?: string;
}
export interface SolicitudServicioDetalleInterface {
  codigo_solicitud: number;
  nombre_ciudaddano: string;
  fecha_solicitud: Date;
  hora_solicitud: Date;
  fecha_hecho_violento: Date;
  descripcion_de_hechos: string;
  es_victima: boolean;
  numero_victimas: number;
}
