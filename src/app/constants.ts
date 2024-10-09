import { environment } from 'src/environments/environment';

export const PATH_SERVER = environment.path;

export const CodigosRespuesta = {
  OK: 200,
  Bad: 400,
};

export const Mensajes = {
  CAMPO_OBLIGATORIO: 'Campo Obligatorio',
  MENSAJE_CITA: `En caso de urgencia recuerda que puedes acercarte a la comisaría de familia
    más cercana donde te atenderán de inmediato.`,
  MENSAJE_OBLIGATORIO: 'Debe seleccionar la CF para continuar',
  MENSAJE_NUMERO: `Recibe ayuda rápidamente llamando al (601) 380 84 00`,
  MENSAJE_ERROR: `Se presentó un error durante el envío de los datos, intente en 1 minuto`,
  MENSAJE_ERROR_G: `En estos momentos presentamos inconvenientes en la comunicación del sistema, intenta más tarde o espera 5 minutos para volver a intentarlo`,
  MENSAJE_NO_EXISTE_CORREO: `No existe un usuario con ese correo electronico`,
  MENSAJE_EXITO_CITA: `Se ha agendado exitosamente tu cita presencial para la `,
  MENSAJE_CITA_OC: `El horario seleccionado no está disponible, seleccione otro`,
  MENSAJE_DATOS_CONTACTO: `Debe ingresar por lo menos un dato de contacto `,
  MENSAJE_CORREO: `Debe ingresar un correo válido`,
  MENSAJE_DATOS_AFILIACION: `Debe ingresar por lo menos un dato de afiliación `,
  MENSAJE_EXITO_SOL: `Se ha creado la solicitud de servicio exitosamente. El caso ha sido enviado a la evaluación inicial en el área de psicología.`,
  MENSAJE_EXITO_CIUDADANO: `Ciudadano registrado de manera exitosa.`,
  MENSAJE_SOL_EXITO: `Solicitud de servicio creada exitosamente`,
  MENSAJE_CANCELAR_SOL: `Está a punto de realizar la cancelación de la solicitud de servicio. ¿Está seguro que desea continuar?`,
  MENSAJE_CANCELAR_MODAL: `Está a punto de cancelar, si lo hace es probable que se pierda la información ingresada. ¿desea continuar?`,
  MENSAJE_ARCHIVAR_DILIGENCIAS: `Está a punto de archivar las diligencias de esta solicitud, esto desvinculará la solicitud de todas las tareas asociadas. ¿desea continuar?`,
  MENSAJE_CORREO_INV: `Correo inválido`,
  MENSAJE_CAMPO_INV: `Campo inválido`,
  MENSAJE_FECHA_INFERIOR: `La fecha final no puede ser inferior a la inicial.`,
  MENSAJE_FECHA_MENOR_ACTUAL: `La fecha no puede ser inferior a la actual.`,
  MENSAJE_CHK_OBLIGATORIOS: `Debe marcar por lo menos una opcion`,
  MENSAJE_FORM_BUSCINV: `Para realizar la búsqueda debe ingresar por lo menos un campo de consulta`,
  MENSAJE_OK: `Se ha registrado correctamente`,
  MENSAJE_CERRAR_ACT: `Al cerrar las actuaciones no  podrá volver a ver esta solicitud de nuevo. ¿Desea continuar?`,
  MENSAJE_NO_MEDIDAS: `No se marcaron medidas, esta solicitud no podrá continuar al proceso de Seguimiento. ¿Desea continuar?`,
  MENSAJE_CARGA: `Archivo cargado exitosamente`,
  MENSAJE_CARGA_ERROR: `Error al cargar el archivo`,
  MENSAJE_CERRAR_SOLICITUD: `Solicitud cerrada exitosamente.`,
  MENSAJE_SIN_ARCHIVO: `Debe cargar un archivo para poder continuar.`,
  MENSAJE_EDITAR_ARCHIVO: `Se editó correctamente el documento`,
  MENSAJE_CANCELAR_SOL_AUDIENCIA: `Está a punto de cancelar la solicitud de agendamiento de la audiencia. ¿Está seguro que desea continuar?`,
  MENSAJE_NO_INFO_VICTIMA: 'No se encontro informacion para la victima',
  MENSAJE_NO_INFO_CASOS_VICTIMA:
    'No se encontro información de casos asociados a la victima',
  MENSAJE_CAMPO_OBSERVACIONES: `Campo observaciones obligatorio`,
  MENSAJE_SEG_EXITO: `Seguimiento creado exitosamente`,
  MENSAJE_EXITO: `Se guardó exitosamente`,
  MENSAJE_EXITO_PERFIL: `Perfil registrado de manera exitosa.`,
  MENSAJE_EXITO_ACTUALIZAR_PERFIL: `Perfil actualizado de manera exitosa.`,
};

export const Regex = {
  TEXTO: /^[a-zA-Z\u00C0-\u024F\u1E00-\u1EFF ]*$/,
  NUMERO: /^\d*$/,
  NUMERO_G: /\D/g,
  ALFA: /^[a-zA-Z0-9\u00C0-\u017F ]*$/,
  EMAIL: /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i,
};

export const CodigosPerfil = {
  ABOGADO: 'ABO',
  AUXILIAR: 'AUX',
  COMISARIO: 'COM',
  PSICOLOGO: 'PSI',
  TRABAJADORSOCIAL: 'TSO',
  ADMINISTRADOR: 'ADM',
  
};

export const MensajeSolicitudXPerfil = {
  ABOGADO:
    'No se presentan solicitudes de servicio por Revisión Legal por ahora.',
  PSICOLOGO:
    'No se presentan solicitudes de servicio a cargo del área de psicología por ahora.',
  OTRO: 'Sin registros.',
};

export const ImagenesModal = {
  EXCLAMACION: 'assets/images/exclamacion.svg',
  OK: 'assets/images/check.svg',
};

export const InfoRecepcionMensaje = {
  ABOGADOT: 'CASOS PENDIENTES REVISIÓN LEGAL',
  ABOGADOP1: 'Casos para revisión legal',
  TITULOA:
    'Seleccione un caso para iniciar o continuar su evaluación en el área legal.',
  PSICOLOGIAT: 'CASOS PENDIENTES DE ATENCIÓN PSICOLÓGICA Y EMOCIONAL',
  PSICOLOGIAP1: 'Casos para revisión psicológica',
  TITULOP:
    'Seleccione un caso para iniciar su evaluación inicial en psicología.',
  COMISARIOT: 'CASOS PENDIENTES REVISIÓN COMISARIO',
  COMISARIOP1: 'Casos por revisión de comisario',
  TITULOC:
    'Seleccione un caso para realizar revisiones y actuaciones como comisario.',
  TRABAJADORST: 'CASOS PENDIENTES TRABAJADOR SOCIAL',
  TRABAJADORP1: 'Casos para revisión',
  TITULOT: 'Seleccione un caso para iniciar su evaluación inicial.',
};

export const DominiosEvaluacionOrientacion = {
  Persistencia: 'Persistencia',
  Red_apoyo: 'Red_apoyo',
  Tipo_red_apoyo: 'Tipo_red_apoyo',
  Motivo: 'Motivo',
  conclusiones: 'Conclusion y Recomendaciones',
  relato: 'Relato de los hechos',
  metodologia: 'metodología',
  antecedente: 'Antecedentes importantes y situación actual',
};

export enum TipoReportePdf {
  IDENTIFICACION_RIESGO,
  ENTREVISTA_PSICOLOGICA_EMOCIONAL,
  SEGURIDAD_REDES_APOYO,
  EJEMPLO,
}

export const MARGENES_REPORTE = [40, 60, 40, 60];

export enum TipoRemisiones {
  'Oficio Remisorio Medicina legal',
  'emisión secretaría de la Mujer u otro órgano',
  'Remisión Proceso Psicología Externa',
  'Remisión Apoyo Policivo Víctima Mujer',
  'Remisión Proceso Psicología Externa-',
  'Recepción Denuncia Fiscalía',
  'Remisión Visita domiciliaria',
  'Solicitud afiliación Régimen de salud',
  'Solicitud Protocolo de Riesgo',
  'Solicitud Historia Clínica',
}

export const LIMITE_CARGA = '4';

export enum TiposDocumentoCarga {
  IDENTIFICACION_DEL_RIESGO = 'identificacion_del_riesgo',
  ENTREVISTA_PSICOLOGICA_EMOCIONAL = 'entrevista_psicologica_emocional',
  SUGERENCIAS_DE_APOYO_EXTERNO = 'sugerencias_de_apoyo_externo',
  SOLICITUD_DE_MEDIDAS_DE_PROTECCIÓN = 'solicitud_de_medidas_de_protección',
  PRUEBA_MULTIPLE = 'prueba_multiple',
  QUORUM_MULTIPLE = 'prueba_multiple',
  NOTIFICACION_MEDIDA_PROTECCION = 'notificacion_medida_de_proteccion',
  PRUEBAS_PERICIALES = 'pruebas_periciales',
  PRUEBAS_ACCIONANTE_ACCIONADO = 'pruebas_accionante_accionado',
  ASISTENCIA_QUORUM = 'asistencia_quorum',
  PRUEBA_JUEZ = 'prueba_juez',
  INCUMPLIMIENTO_MEDIDAS_PROTECCION = 'Incumplimiento_medidas_proteccion',
  AUTO_MEDIDAS_PROTECCION = 'AUTO_MEDIDAS_PROTECCION',
  Prorroga_De_Medida = 'Prorroga_De_Medida',
  ACTA_VERIFICACION_DERECHOS = 'Acta_Verificacion_Derechos',
  DECRETAR_DESISTIR_PARD = 'Anexo_Decreto_Pard',
  NOTIFICAR_INVOLUCRADOS_PARD = 'Notificacion_Pard',
}

export enum EstadosNotificacionImplicado {
  RECIBIDO = 'recibido',
  NO_ENVIADO = 'No enviado',
  ENVIADO = 'enviado',
}

export enum EstadoQuorum {
  NO_ASISTE = 0,
  ASISTE = 1,
  EXCUSA_JUSTA = 2,
  EXCUSA_INJUSTA = 3,
}

export enum EtiquetaFlujoTarea {
  REPROGRAMAR_AUDIENCIA_MOD5 = 'INVEXC',
}

export enum RecepcionGenerarCargar {
  SOLICITUD_INCUMPLIMIENTO = 'INCUMPLIMIENTO DE MÉDIDAS DE PROTECCIÓN',
  SOLICITUD_LEVANTAMIENTO = 'DILIGENCIAR SOLICITUD DE LEVANTAMIENTO',
}

export enum DescargasExcel {
  EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
  EXTENSION = '.xlsx',
  INFORMES_SOLICITUDES = 'Informe solicitudes',
  NOMBRE_HOJA_INOFORME = 'Informe',
}

export const InvolucradosPARD = {
  EDAD_MAXIMA_ACCIONADO: 200,
  EDAD_MAXIMA_ACCIONANTE: 17,
  MSJ_EDAD_ACCIONADO: 'Edad inválida',
  MSJ_EDAD_ACCIONANTE: 'Rango de edad entre 0 y 17',
};
