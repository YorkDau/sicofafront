export class RecepcionPsicologicaFilter {
  nombres?: string
  primerApellido?: string
  segundoApellido?: string
  numeroDocumento?: string
  codSolicitud?: string
  fecha?: string
  estado?: string
  componenteRequest?= "CasosPsicologoPendientesComponente"
  userID?: number
  codPerfil?= "PSI"
}
