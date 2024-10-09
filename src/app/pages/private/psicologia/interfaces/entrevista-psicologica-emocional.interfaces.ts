export interface DatosIdendificacionVictima {
  fechaEntrevista?: "Date"
  fechaInforme?: "Date"
  fechaNacimiento?: "Date"
  nombres?: "string"
  apellidos?: "string"
  nombreTipoDocumento?: "string"
  numeroDocumento?: "string"
  edad?: number
  servicioSalud?: "string"
  nombreEscolaridad?: "string"
  telefono?: "string"
  direccion?: "string"
  barrio?: "string"
  nombreContacto?: "string"
  telefonoContacto?: "string"
  direccionContacto?: "string"
}


export interface RedesDeApoyoDTO {
  redFamiliar?: boolean
  redSocialAmigos?: boolean
  redTrabajo?: boolean
  redGrupoReligioso?: boolean
  redGrupoPolitico?: boolean
  redOrganizacionSocial?: boolean
  detalleRedesApollo?: string
  tipoApoyoEmocional?: boolean
  tipoApoyoEconomico?: boolean
  tipoApoyoCuidadoHijos?: boolean
  tipoApoyoHospedaje?: boolean
  tipoApoyoDiligencias?: boolean
  detalleTiposApollo?: string
}

export interface PercepcionVictimaDTO {
  redFamiliar?: boolean
  redSocialAmigos?: boolean
  redTrabajo?: boolean
  redGrupoReligioso?: boolean
  redGrupoPolitico?: boolean
  redOrganizacionSocial?: boolean
  detalleRedesApollo?: string
  tipoApoyoEmocional?: boolean
  tipoApoyoEconomico?: boolean
  tipoApoyoCuidadoHijos?: boolean
  tipoApoyoHospedaje?: boolean
  tipoApoyoDiligencias?: boolean
  detalleTiposApollo?: string
}
