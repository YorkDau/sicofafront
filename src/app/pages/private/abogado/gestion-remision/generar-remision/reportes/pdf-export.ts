import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DataReporteByID, DataReporteInterface } from 'src/app/pages/private/interfaces/data-reporte.interface';
import { formatDate } from '@angular/common';

export class PdfExport {
  private static pdf: jsPDF;
  /**
   * @description Genera PDF de OFICIO REMISORIO AL INSTITUTO NACIONAL DE MEDICINA LEGAL Y CIENCIAS FORENSES*/
  static generarPdfOficioMedicinaLegal(dataReporte: DataReporteInterface, dataReporteByID: DataReporteByID) {
    let ciudadRemision = dataReporte.ciudadRemision
      ? dataReporte.ciudadRemision
      : '________________';
    let comisaria = dataReporteByID.item1;
    let comisario = dataReporteByID.item2; 
    this.pdf = new jsPDF('p', 'pt', 'letter');
    const pageWidth =
      this.pdf.internal.pageSize.width || this.pdf.internal.pageSize.getWidth();
    this.pdf.setFontSize(10);
    const dia = formatDate(new Date(), 'dd', 'es');
    const mes = formatDate(new Date(), 'MMMM', 'es');
    const anio = formatDate(new Date(), 'yyyy', 'es');
    const nombreReporte =
      'OFICIO REMISORIO AL INSTITUTO NACIONAL DE MEDICINA LEGAL Y CIENCIAS FORENSES';
    this.crearEncabezado(nombreReporte, 42);

    /**Ciudad, fecha */
    this.pdf.text(ciudadRemision, 70, 140, { align: 'left' });
    this.pdf.text(dia + ' de ' + mes + ' de ' + anio + '', 70, 155);

    /**Datos destinatario */
    this.pdf.text('SEÑORES', 70, 195);
    this.pdf.text(
      'INSTITUTO NACIONAL DE MEDICINA LEGAL Y CIENCIAS FORENSES',
      70,
      207
    );
    this.pdf.text('Dirección:', 70, 219);
    this.pdf.text('Ciudad:', 70, 231);

    /**Cuerpo */
    this.pdf.text('Respetados señores:', 70, 263);
    autoTable(this.pdf, {
      html: '#comedidamente',
      startY: 285,
      useCss: true,
      margin: {
        top: 36,
        left: 70,
        right: 72,
      },
    });

    this.pdf.text(
      'MALTRATO INFANTIL       VIOLENCIA DE (EX)-PAREJA           VIOLENCIA OTR@S',
      70,
      354
    );

    this.pdf.setLineWidth(1);
    this.pdf.setDrawColor(0, 0, 0);
    this.pdf.rect(177, 345, 8, 8);
    this.pdf.rect(335, 345, 8, 8);
    this.pdf.rect(460, 345, 8, 8);
    this.pdf.rect(70, 388, 8, 8);

    this.pdf.text(
      'presuntos actos contra la Libertad, integridad y Formación Sexual',
      70,
      365
    );

    this.pdf.text(
      'SEXOLÓGICO: fecha y hora del último suceso ____________________________  ',
      87,
      397
    );
    this.pdf.rect(70, 407, 8, 8);

    this.pdf.text('EDAD: para definir competencia _____________ ', 87, 415);
    this.pdf.rect(70, 425, 8, 8);

    this.pdf.text(
      'EMBRIAGUEZ: fecha y hora de la última dosis ________________ ',
      87,
      433
    );
    this.pdf.text(
      'Sírvanse entregar copia del resultado al señor(a) ________________________________.',
      70,
      475
    );

    this.pdf.line(70, 492, 540, 492);

    this.pdf.text('Cordialmente,', 70, 537);

    /**Firma */
    this.pdf.setLineWidth(1);
    this.pdf.setFontSize(13);
    this.pdf.text(comisario , pageWidth / 2, 550, {align: 'center'});
    this.pdf.line(230, 557, 383, 557);
    this.pdf.setFontSize(10);
    this.pdf.text('Comisario(a) de Familia', pageWidth / 2, 567, {
      align: 'center',
    });
    this.pdf.text(comisaria , pageWidth / 2, 580, {align: 'center'});


    /**Pie de pagina */
    this.crearPiePagina();

    window.open(URL.createObjectURL(this.pdf.output('blob')));
  }

  /**
   * @description Genera PDF de OFICIO REMISORIO SECRETARÍA DE LA MUJER U ORGANO QUE HAGA SUS FUNCIONES A NIVEL DEPARTAMENTAL Y/O MUNICIPAL
   */
  static generarPdfOficioSecretariaMujer(dataReporte: DataReporteInterface, dataReporteByID: DataReporteByID) {
    let nombreVictima = dataReporte.nombreVictima
      ? dataReporte.nombreVictima
      : '_______________';
    let ciudadRemision = dataReporte.ciudadRemision
      ? dataReporte.ciudadRemision
      : '_____________';
    let comisaria = dataReporteByID.item1;
    let comisario = dataReporteByID.item2; 
    this.pdf = new jsPDF('p', 'pt', 'letter');
    this.pdf.setFontSize(10);
    const dia = formatDate(new Date(), 'dd', 'es');
    const mes = formatDate(new Date(), 'MMMM', 'es');
    const anio = formatDate(new Date(), 'yyyy', 'es');

    const nombreReporte =
      'OFICIO REMISORIO SECRETARÍA DE LA MUJER U ORGANO QUE HAGA SUS FUNCIONES A NIVEL DEPARTAMENTAL Y/O MUNICIPAL';
    this.crearEncabezado(nombreReporte, 47);

    /**Ciudad, fecha */
    if (ciudadRemision) {
      this.pdf.text(ciudadRemision, 70, 140, { align: 'left' });
    }
    this.pdf.text(dia + ' de ' + mes + ' de ' + anio, 70, 185, {
      align: 'left',
    });

    /**Datos destinatario */
    this.pdf.text(
      'SECRETARÍA DE LA MUJER U ORGANO QUE HAGA SUS FUNCIONES A NIVEL ',
      100,
      230
    );
    this.pdf.text('DEPARTAMENTAL Y/O MUNICIPAL', 100, 242);
    this.pdf.text('Dirección: __________________', 100, 274);
    if (ciudadRemision) {
      this.pdf.text(ciudadRemision, 100, 286);
    }

    this.pdf.text(
      'REFERENCIA: Remisión de la señora: ' + this.toTitleCase(nombreVictima),
      100,
      324
    );
    this.pdf.text('MEDIDA DE PROTECCIÓN No. ____ - 20___', 100, 363);

    /**Cuerpo */

    autoTable(this.pdf, {
      html: '#comedidamente',
      startY: 416,
      useCss: true,
      margin: {
        top: 36,
        left: 100,
        right: 72,
      },
    });

    this.pdf.text(
      'Agradezco la atención brindada a esta solicitud y nos puedan informar sobre los logros alcanzados.',
      100,
      548
    );

    this.pdf.text('Cordialmente,', 100, 589);

    /**Firma */
    this.pdf.setLineWidth(1);
    this.pdf.setDrawColor(0, 0, 0);
    this.pdf.setFontSize(13);
    this.pdf.text(comisario, 100, 640);
    this.pdf.line(100, 645, 290, 645);
    this.pdf.setFontSize(10);
    this.pdf.text('SECRETARIO DE COMISARÍA DE FAMILIA', 100, 657);
    this.pdf.text(comisaria, 100, 670);

    /**Pie de pagina */
    this.crearPiePagina();

    window.open(URL.createObjectURL(this.pdf.output('blob')));
  }

  /**
   *
   * @description Genera PDF DE REMISION PROCESO A PSICOLOGÍA EXTERNA
   */
  static generarPdfRemisionPsicologia(dataReporte: DataReporteInterface, dataReporteByID: DataReporteByID) {
    let ciudadRemision = dataReporte.ciudadRemision
      ? dataReporte.ciudadRemision
      : '________________';
    let comisaria = dataReporteByID.item1;
    let comisario = dataReporteByID.item2; 
    this.pdf = new jsPDF('p', 'pt', 'letter');
    this.pdf.setFontSize(10);
    const dia = formatDate(new Date(), 'dd', 'es');
    const mes = formatDate(new Date(), 'MMMM', 'es');
    const anio = formatDate(new Date(), 'yyyy', 'es');

    const nombreReporte = 'REMISION PROCESO A PSICOLOGÍA EXTERNA';
    this.crearEncabezado(nombreReporte, 42);

    /**Ciudad, fecha */
    this.pdf.text(ciudadRemision, 70, 126, { align: 'left' });
    this.pdf.text(dia + ' de ' + mes + ' de' + anio, 70, 138, {
      align: 'left',
    });

    /**Datos destinatario */
    this.pdf.text('SEÑORES', 70, 175);
    this.pdf.text('ENTIDAD U ORGANIZACIÓN', 70, 187);

    this.pdf.text('SERVICIO DE PSICOLOGÍA', 70, 199);
    this.pdf.text('DIRECCIÓN', 70, 211);
    this.pdf.text('TELEFONO', 70, 223);
    this.pdf.text('CIUDAD', 70, 235);

    this.pdf.text('Referencia: MP – VIF¹: _____________', 70, 255);
    this.pdf.text('Cordial Saludo:', 70, 290);

    /**Cuerpo */

    autoTable(this.pdf, {
      html: '#cuerpo',
      startY: 300,
      useCss: true,
      margin: {
        top: 36,
        left: 70,
        right: 72,
      },
    });

    autoTable(this.pdf, {
      html: '#items',
      startY: 390,
      useCss: true,
      margin: {
        top: 36,
        left: 90,
        right: 72,
      },
      didDrawPage: (data) => {
        this.pdf.setLineWidth(1);
        this.pdf.setDrawColor(0, 0, 0);
        this.pdf.rect(185, 392, 8, 8);
        this.pdf.rect(238, 392, 8, 8);
        this.pdf.rect(134, 440, 8, 8);
        this.pdf.rect(187, 440, 8, 8);
      },
    });

    this.pdf.text(
      `De antemano agradecemos su interés y esfuerzo manifiesto por contribuir al bienestar de la comunidad a`,
      75,
      550
    );
    this.pdf.text(
      `través de esta orientación a la familia en mención y los invitamos a continuar desarrollando esfuerzos por`,
      75,
      560
    );
    this.pdf.text(
      `la promoción y defensa de los derechos individuales y colectivos de las personas con quienes ustedes`,
      75,
      570
    );
    this.pdf.text(`interactúan.`, 75, 580);

    /**Firma */
    this.pdf.setLineWidth(1);
    this.pdf.setDrawColor(0, 0, 0);
    this.pdf.setFontSize(13);
    this.pdf.text(comisario, 70, 640);
    this.pdf.line(70, 645, 260, 645);
    this.pdf.setFontSize(10);
    this.pdf.text('Comisario(a) de Familia', 70, 657);
    this.pdf.text(comisaria , 70, 669);

    /**Medida deprotección VIF */
    this.pdf.line(70, 705, 250, 705);
    this.pdf.setFontSize(8);
    this.pdf.text(
      '¹ ¹MP: Medida de Protección - VIF: Violencia en el contexto Familiar',
      70,
      717
    );

    /**Pie de pagina */
    this.crearPiePagina();

    window.open(URL.createObjectURL(this.pdf.output('blob')));
  }

  /**
   *
   * @description Genera PDF de APOYO POLICIVO CUANDO LA VICTIMA ES UNA MUJER
   */
  static generarPdfApoyoPolicivoMujer(dataReporte: DataReporteInterface, dataReporteByID: DataReporteByID) {
    let ciudadRemision = dataReporte.ciudadRemision
      ? dataReporte.ciudadRemision
      : '________________';
    let comisaria = dataReporteByID.item1;
    let comisario = dataReporteByID.item2; 
    this.pdf = new jsPDF('p', 'pt', 'letter');
    this.pdf.setFontSize(10);

    const nombreReporte = 'APOYO POLICIVO CUANDO LA VICTIMA ES UNA MUJER';
    const dia = formatDate(new Date(), 'dd', 'es');
    const mes = formatDate(new Date(), 'MMMM', 'es');
    const anio = formatDate(new Date(), 'yyyy', 'es');

    this.crearEncabezado(nombreReporte, 42);
    /**Ciudad, fecha */
    this.pdf.text(ciudadRemision, 85, 140);
    this.pdf.text(dia + ' de ' + mes + ' de' + anio, 85, 152);

    /** Señores */
    this.pdf.text('Señores', 85, 188);
    this.pdf.text('COMANDANTE / ESTACIÓN POLICÍA / CAI RESPECTIVO:', 85, 200);
    this.pdf.text('Correo electrónico: _______________', 85, 212);

    /* REFERENCIA */
    this.pdf.text(
      'REF: PROTECCIÓN TEMPORAL POLICIVA / MEDIDA DE PROTECCIÓN PROVISIONAL POR',
      85,
      247
    );

    this.pdf.text(
      'VIOLENCIA EN EL CONTEXTO FAMILIAR ____________________',
      85,
      259
    );

    /*CUERPO */
    autoTable(this.pdf, {
      html: '#cuerpo',
      startY: 290,
      useCss: true,
      margin: {
        top: 36,
        left: 80,
        right: 65,
      },
    });
    this.pdf.addPage();
    this.crearEncabezado(nombreReporte, 42);
    autoTable(this.pdf, {
      html: '#cuerpo2',
      startY: 110,
      useCss: true,
      margin: {
        top: 36,
        left: 80,
        right: 65,
      },
    });

    this.pdf.text('Atentamente,', 85, 450);

    /**Firma */
    this.pdf.setLineWidth(1);
    this.pdf.setDrawColor(0, 0, 0);
    this.pdf.setFontSize(13);
    this.pdf.text(comisario, 85, 500);
    this.pdf.line(85, 508, 230, 508);
    this.pdf.setFontSize(10);
    this.pdf.text('Comisario/a de Familia', 85, 523);
    this.pdf.text(comisaria, 85, 537);
    this.crearPiePagina();

    window.open(URL.createObjectURL(this.pdf.output('blob')));
  }

  /**
   * @description Genera PDF DENUNCIA FISCALIA
   */
  static generarPdfDenunciaFiscalia(dataReporte: DataReporteInterface, dataReporteByID: DataReporteByID) {
    let ciudadRemision = dataReporte.ciudadRemision
      ? dataReporte.ciudadRemision
      : '________________';
    let comisaria = dataReporteByID.item1;
    let comisario = dataReporteByID.item2; 
    this.pdf = new jsPDF('p', 'pt', 'letter');
    this.pdf.setFontSize(10);
    const dia = formatDate(new Date(), 'dd', 'es');
    const mes = formatDate(new Date(), 'MMMM', 'es');
    const anio = formatDate(new Date(), 'yyyy', 'es');

    const nombreReporte = 'RECEPCIÓN DENUNCIA';
    this.crearEncabezado(nombreReporte, 42);

    /**Ciudad, fecha */
    this.pdf.text(ciudadRemision, 70, 125);
    this.pdf.text(+dia + ' de ' + mes + ' del ' + anio, 70, 137);

    /*Señores */
    this.pdf.text('Señores', 70, 165);
    this.pdf.text('FISCALIA GENERAL DE LA NACIÓN', 70, 177);
    this.pdf.text('@fiscalia.gov.co', 70, 189);

    /*Referencia */
    this.pdf.text(
      'REFERENCIA: DENUNCIA PENAL POR VIOLENCIA INTRAFAMILIAR',
      70,
      216
    );
    this.pdf.text('Radicado Comisaría de Familia ', 70, 228);
    this.pdf.text('MP /VIF No. ____________- __________ ', 70, 240);

    /* CUERPO */
    this.pdf.text('Respetados señores:', 70, 265);
    autoTable(this.pdf, {
      html: '#cuerpo',
      startY: 275,
      useCss: true,
      margin: {
        top: 36,
        left: 70,
        right: 72,
      },
    });

    autoTable(this.pdf, {
      html: '#datosReferencia',
      startY: 340,
      useCss: true,
      margin: {
        top: 36,
        left: 70,
        right: 72,
      },
    });

    autoTable(this.pdf, {
      html: '#datosSolicitante',
      startY: 385,
      useCss: true,
      margin: {
        top: 36,
        left: 70,
        right: 72,
      },
    });

    autoTable(this.pdf, {
      html: '#datosVictima',
      startY: 574,
      useCss: true,
      margin: {
        top: 36,
        left: 70,
        right: 72,
      },
    });
    this.pdf.addPage();
    this.crearEncabezado(nombreReporte, 42);
    autoTable(this.pdf, {
      html: '#datosVictima2',
      startY: 125,
      useCss: true,
      margin: {
        top: 36,
        left: 70,
        right: 72,
      },
    });

    autoTable(this.pdf, {
      html: '#datosAgresor',
      startY: 153,
      useCss: true,
      margin: {
        top: 36,
        left: 70,
        right: 72,
      },
    });

    autoTable(this.pdf, {
      html: '#relatoHechos',
      startY: 330,
      useCss: true,
      margin: {
        top: 36,
        left: 70,
        right: 72,
      },
    });

    autoTable(this.pdf, {
      html: '#anexo',
      startY: 500,
      useCss: true,
      margin: {
        top: 36,
        left: 70,
        right: 72,
      },
    });

    /*FIRMA */
    this.pdf.setLineWidth(1);
    this.pdf.setDrawColor(0, 0, 0);
    this.pdf.setFontSize(13);
    this.pdf.text(comisario, 70, 705);
    this.pdf.line(70, 710, 230, 710);
    this.pdf.setFontSize(10);
    this.pdf.text('Comisario(a) de Familia', 70, 722);
    this.pdf.text(comisaria, 70, 735);

    /**Pie de pagina */
    this.crearPiePagina();

    window.open(URL.createObjectURL(this.pdf.output('blob')));
  }
  /**
   * @description Genera PDF de AUTO ORDENANDO VISISTA DOMICILIARIA
   */
  static generarPdfVisitaDomiciliaria(dataReporte: DataReporteInterface, dataReporteByID: DataReporteByID) {
    let ciudadRemision = dataReporte.ciudadRemision
      ? dataReporte.ciudadRemision
      : '________________';
    let comisaria = dataReporteByID.item1;
    let comisario = dataReporteByID.item2; 
    this.pdf = new jsPDF('p', 'pt', 'letter');
    this.pdf.setFontSize(10);
    const dia = formatDate(new Date(), 'dd', 'es');
    const mes = formatDate(new Date(), 'MMMM', 'es');
    const anio = formatDate(new Date(), 'yyyy', 'es');

    const nombreReporte = 'AUTO ORDENANDO VISITA DOMICILIARIA';
    this.crearEncabezado(nombreReporte, 45);

    /**Ciudad, fecha */
    this.pdf.text(
      ciudadRemision + ', ' + dia + ' de ' + mes + ' de ' + anio + '',
      70,
      140
    );

    /**REFERENCIA */
    this.pdf.text('REF:', 70, 185);

    autoTable(this.pdf, {
      html: '#referencia',
      startY: 206,
      useCss: true,
      margin: {
        top: 36,
        left: 70,
        right: 72,
      },
    });

    /** ORDENA */
    this.pdf.text('ORDENA:', 70, 278);

    autoTable(this.pdf, {
      html: '#ordena',
      startY: 300,
      useCss: true,
      margin: {
        top: 36,
        left: 70,
        right: 70,
      },
    });

    this.pdf.text('CÚMPLASE', 70, 490);

    /**FIRMA */
    this.pdf.setFontSize(13);
    this.pdf.text(comisario, 155, 533);
    this.pdf.setFontSize(10);
    this.pdf.text('El Comisario(a);', 70, 540);
    this.pdf.text(comisaria, 70, 560);
    this.pdf.setLineWidth(1);
    this.pdf.setDrawColor(0, 0, 0);
    this.pdf.line(150, 540, 350, 540);

    /**Pie de pagina */
    this.crearPiePagina();

    window.open(URL.createObjectURL(this.pdf.output('blob')));
  }

  /**
   * @description Genera PDF de FORMATO FALLO CUANDO NO COMPARECE EL ACCIONADO A LA AUDIENCIA Y SE IMPONEN MEDIDAS DE PROTECCIÓN
   */
  static generarPdfRemisionSistemaSalud(dataReporte: DataReporteInterface, dataReporteByID: DataReporteByID) {
    let ciudadRemision = dataReporte.ciudadRemision
      ? dataReporte.ciudadRemision
      : '________________';
    let comisaria = dataReporteByID.item1;
    let comisario = dataReporteByID.item2; 
    this.pdf = new jsPDF('p', 'pt', 'legal');
    const pageWidth =
      this.pdf.internal.pageSize.width || this.pdf.internal.pageSize.getWidth();
    this.pdf.setFontSize(10);
    const dia = formatDate(new Date(), 'dd', 'es');
    const mes = formatDate(new Date(), 'MMMM', 'es');
    const anio = formatDate(new Date(), 'yyyy', 'es');
    const nombreReporte =
      'FORMATO FALLO CUANDO NO COMPARECE EL ACCIONADO A LA AUDIENCIA Y SE IMPONEN MEDIDAS DE PROTECCIÓN';
    this.crearEncabezado(nombreReporte, 47);

    /**Ciudad, fecha */
    this.pdf.text(
      ciudadRemision + ', ' + dia + ' de ' + mes + ' de ' + anio,
      70,
      140
    );

    /**Señores */
    this.pdf.text('Señores:', 70, 187);
    this.pdf.text('SISTEMA DE SALUD CORRESPONDIENTE (EPS - SISBEN)', 70, 202);
    this.pdf.text('La ciudad', 70, 217);

    /**MP */
    this.pdf.text('MP: ________ del _________', 70, 240);

    /** CUERPO */
    this.pdf.circle(70, 371, 2, 'F');
    this.pdf.circle(70, 454, 2, 'F');

    autoTable(this.pdf, {
      html: '#saludo',
      startY: 278,
      useCss: true,
      margin: {
        top: 36,
        left: 70,
        right: 70,
      },
    });

    autoTable(this.pdf, {
      html: '#items',
      startY: 360,
      useCss: true,
      margin: {
        top: 36,
        left: 80,
        right: 70,
      },
    });

    autoTable(this.pdf, {
      html: '#final',
      startY: 550,
      useCss: true,
      margin: {
        top: 36,
        left: 70,
        right: 70,
      },
    });

    /**FIRMA */

    this.pdf.setLineWidth(1);
    this.pdf.setDrawColor(0, 0, 0);
    this.pdf.setFontSize(13);
    this.pdf.text(comisario, pageWidth / 2, 640, {
      align: 'center',
    });
    this.pdf.setFontSize(10);
    this.pdf.line(230, 645, 383, 645);
    this.pdf.text('Comisario(a) de Familia', pageWidth / 2, 657, {
      align: 'center',
    });
    this.pdf.text(comisaria, pageWidth / 2, 670, {
      align: 'center',
    });
    /**RECIBIDO */
    this.pdf.line(124, 710, 280, 710);
    this.pdf.text('RECIBIDO:', 70, 710);

    /**Pie de pagina */
    this.crearPiePagina(2);

    window.open(URL.createObjectURL(this.pdf.output('blob')));
  }

  /**
   * @description Genera PDF de PROTOCOLO DE RIESGO
   */
  static generarPdfProtocoloRiesgo(dataReporte: DataReporteInterface, dataReporteByID: DataReporteByID) {
    let ciudadRemision = dataReporte.ciudadRemision
      ? dataReporte.ciudadRemision
      : '________________';
    let comisaria = dataReporteByID.item1;
    let comisario = dataReporteByID.item2; 
    this.pdf = new jsPDF('p', 'pt', 'legal');
    this.pdf.setFontSize(10);
    const dia = formatDate(new Date(), 'dd', 'es');
    const mes = formatDate(new Date(), 'MMMM', 'es');
    const anio = formatDate(new Date(), 'yyyy', 'es');

    const nombreReporte =
      'FORMATO FALLO CUANDO NO COMPARECE EL ACCIONADO A LA AUDIENCIA Y SE IMPONEN MEDIDAS DE PROTECCIÓN';
    this.crearEncabezado(nombreReporte, 47);

    /**Ciudad, fecha */
    this.pdf.text(
      ciudadRemision + ', ' + dia + ' de ' + mes + ' de ' + anio,
      70,
      140
    );

    /**Señores */
    this.pdf.text('Señor:', 70, 187);
    this.pdf.text(
      'Comandante Estación de Policía / C.A.I. Autoridades de policía.',
      70,
      202,
      { charSpace: 1 }
    );
    this.pdf.text('La ciudad', 70, 217, { charSpace: 1 });

    /**REFERENCIA */
    this.pdf.text(
      'Referencia:          M.P. N° _____________ del _______',
      70,
      243
    );

    /** CUERPO */
    autoTable(this.pdf, {
      html: '#cuerpo',
      startY: 256,
      useCss: true,
      margin: {
        top: 36,
        left: 68,
        right: 72,
      },
    });

    autoTable(this.pdf, {
      html: '#items',
      startY: 390,
      useCss: true,
      margin: {
        top: 36,
        left: 68,
        right: 72,
      },
    });

    this.pdf.addPage();
    this.crearEncabezado(nombreReporte, 47);
    autoTable(this.pdf, {
      html: '#conformidad',
      startY: 140,
      useCss: true,
      margin: {
        top: 36,
        left: 68,
        right: 72,
      },
    });

    /**FIRMA */
    this.pdf.setLineWidth(1);
    this.pdf.setDrawColor(0, 0, 0);
    this.pdf.setFontSize(13);
    this.pdf.text(comisario, 70, 275);
    this.pdf.line(70, 280, 220, 280);
    this.pdf.setFontSize(10);
    this.pdf.text('Comisario(a) de Familia', 70, 292);
    this.pdf.text(comisaria, 70, 307);

    /**RECIBIDO */
    this.pdf.line(124, 380, 280, 380);
    this.pdf.text('RECIBIDO:', 70, 380);

    /**Pie de pagina */
    this.crearPiePagina(2);

    window.open(URL.createObjectURL(this.pdf.output('blob')));
  }

  /**
   * @description Genera PDF de PROTOCOLO DE RIESGO
   */
  static generarPdfHistoriaClinica(dataReporte: DataReporteInterface, dataReporteByID: DataReporteByID) {
    let ciudadRemision = dataReporte.ciudadRemision
      ? dataReporte.ciudadRemision
      : '________________';
    let comisaria = dataReporteByID.item1;
    let comisario = dataReporteByID.item2; 
    this.pdf = new jsPDF('p', 'pt', 'letter');
    const pageWidth =
      this.pdf.internal.pageSize.width || this.pdf.internal.pageSize.getWidth();
    this.pdf.setFontSize(10);

    const nombreReporte = 'SOLICITUD HISTORIA CLÍNICA';
    this.crearEncabezado(nombreReporte, 45);
    const fecha = formatDate(new Date(), 'dd/MM/yyyy', 'es');

    /**Ciudad, fecha */
    this.pdf.text(ciudadRemision + '.', 70, 125);
    this.pdf.text('Fecha ' + fecha, 70, 137);

    /**Señores */
    this.pdf.text('Señor', 70, 172);
    this.pdf.text('COMANDANTE', 70, 184);
    this.pdf.text('ESTACIÓN DE POLICÍA / C.A.I. CORRESPONDIENTE', 70, 196);
    this.pdf.text('Ciudad', 70, 208);

    /**ASUNTO */
    this.pdf.text('Asunto: Medidas de Atención', 70, 251);

    /** CUERPO */
    autoTable(this.pdf, {
      html: '#cuerpo',
      startY: 308,
      useCss: true,
      margin: {
        left: 68,
        right: 72,
      },
    });

    /**FIRMA */
    this.pdf.setLineWidth(1);
    this.pdf.setDrawColor(0, 0, 0);
    this.pdf.setFontSize(13);
    this.pdf.text(comisario, pageWidth / 2, 595, {
      align: 'center',
    });
    this.pdf.setFontSize(10);
    this.pdf.line(220, 602, 400, 602);
    this.pdf.text('Comisario(a) de Familia', pageWidth / 2, 612, {
      align: 'center',
    });
    this.pdf.text(comisaria, pageWidth / 2, 625, {
      align: 'center',
    });
    /**NNA  */
    this.pdf.line(70, 700, 230, 700);
    this.pdf.setFontSize(8);
    this.pdf.text('¹ Niño, Niña o adolescente', 70, 712);

    /** FIN DE PAGINA 1 */

    this.pdf.addPage();
    /**INICIO DE PAGINA 2 */
    /**ENCABEZADO */
    this.crearEncabezado(nombreReporte, 45);
    this.pdf.setFontSize(10);

    /**Ciudad, fecha */
    this.pdf.text(ciudadRemision + '.', 70, 125);
    this.pdf.text('Fecha ' + fecha, 70, 137);

    /**Señores */
    this.pdf.text('Señores', 70, 172);
    this.pdf.text('SISTEMA DE SALUD', 70, 184);
    this.pdf.text('RÉGIMEN CONTRIBUTIVO EPS O REGIMEN SUBSIDIADO', 70, 196);
    this.pdf.text('O EMPRESA SOCIAL DEL ESTADO', 70, 208);
    this.pdf.text('Atención a Víctimas de Violencia Intrafamiliar', 70, 220);
    this.pdf.text('Ciudad Municipio', 70, 232);

    /**REFERENCIA */
    this.pdf.text('REF: MEDIDIAS DE ATENCIÓN EN SALUD', 70, 270);
    autoTable(this.pdf, {
      html: '#cuerpo2',
      startY: 300,
      useCss: true,
      margin: {
        left: 68,
        right: 72,
      },
    });

    /**CORDIALMENTE */
    this.pdf.text(
      'COMISARIO(A) DE FAMILIA, JUEZ CIVIL MUNICIPAL, JUEZ PROMISCUO MUNICIPAL',
      70,
      600
    );

    /**NNA  */
    this.pdf.setLineWidth(1);
    this.pdf.setDrawColor(0, 0, 0);
    this.pdf.line(70, 700, 230, 700);
    this.pdf.setFontSize(8);
    this.pdf.text('² Niño, Niña o adolescente', 70, 712);

    /**Pie de pagina */
    this.crearPiePagina();

    window.open(URL.createObjectURL(this.pdf.output('blob')));
  }

  /**
   * @description Genera PDF de REMISIÓN PERSONERÍA
   */
  static generarPdfRemisionPersoneria(dataReporte: DataReporteInterface, dataReporteByID: DataReporteByID) {
    let ciudadRemision = dataReporte.ciudadRemision
      ? dataReporte.ciudadRemision
      : '________________';
    let comisaria = dataReporteByID.item1;
    let comisario = dataReporteByID.item2; 
    this.pdf = new jsPDF('p', 'pt', 'legal');
    const pageWidth =
      this.pdf.internal.pageSize.width || this.pdf.internal.pageSize.getWidth();
    this.pdf.setFontSize(10);
    const dia = formatDate(new Date(), 'dd', 'es');
    const mes = formatDate(new Date(), 'MMMM', 'es');
    const anio = formatDate(new Date(), 'yyyy', 'es');
    const nombreReporte =
      'FORMATO FALLO CUANDO NO COMPARECE EL ACCIONADO A LA AUDIENCIA Y SE IMPONEN MEDIDAS DE PROTECCIÓN';
    this.crearEncabezado(nombreReporte, 47);

    /**Ciudad, fecha */
    this.pdf.text(
      ciudadRemision + ', ' + dia + ' de ' + mes + ' de ' + anio,
      72,
      140
    );

    /**Señores */
    this.pdf.text('Señores:', 72, 187);
    this.pdf.text('PERSONERÍA DE ______________', 72, 202);
    this.pdf.text('La ciudad', 72, 217);

    /**ASUNTO */
    this.pdf.text('Asunto:   M.P¹. _____ del _______', 72, 252);

    /** CUERPO */
    autoTable(this.pdf, {
      html: '#cuerpo',
      startY: 265,
      useCss: true,
      margin: {
        top: 36,
        left: 68,
        right: 72,
      },
    });

    /**FIRMA */

    this.pdf.setLineWidth(1);
    this.pdf.setDrawColor(0, 0, 0);
    this.pdf.setFontSize(13);
    this.pdf.text(comisario, pageWidth / 2, 485, {
      align: 'center',
    });
    this.pdf.line(230, 490, 383, 490);
    this.pdf.setFontSize(10);
    this.pdf.text('Comisario(a) de Familia', pageWidth / 2, 502, {
      align: 'center',
    });
    this.pdf.text(comisaria, pageWidth / 2, 515, {
      align: 'center',
    });
    /**MP  */
    this.pdf.line(70, 940, 230, 940);
    this.pdf.setFontSize(8);
    this.pdf.text('¹ MP: Medidad de protección:', 70, 952);

    /**Pie de pagina */
    this.crearPiePagina(2);

    window.open(URL.createObjectURL(this.pdf.output('blob')));
  }

  /**
   * @description Genera PDF de REMISIÓN PERSONERÍA
   */
  static generarPdfOtorgamientoMedidas(dataReporte: DataReporteInterface) {
    let ciudadRemision = dataReporte.ciudadRemision
      ? dataReporte.ciudadRemision
      : '________________';

    this.pdf = new jsPDF('p', 'pt', [576, 936]);
    this.pdf.setFontSize(10);
    const fecha = formatDate(new Date(), 'dd/MM/yyyy', 'es');

    const nombreReporte = 'OTORGAMIENTO DE LAS MEDIDAS DE ATENCIÓN';
    this.crearEncabezado(nombreReporte, 45, true);

    this.pdf.text(
      'MEDIDAS DE ATENCION DENTRO DE LA MP No. _______________',
      70,
      155
    );

    /**Ciudad, fecha */
    this.pdf.text(ciudadRemision, 70, 176);
    this.pdf.text('Fecha ' + fecha, 70, 188);

    /** CUERPO */
    autoTable(this.pdf, {
      html: '#cuerpo',
      startY: 220,
      useCss: true,
      margin: {
        top: 36,
        left: 68,
        right: 72,
      },
    });

    /**FIRMA */
    this.pdf.text('Comisario(a) de Familia', 70, 820);

    /**NNA  */
    this.pdf.setLineWidth(1);
    this.pdf.setDrawColor(0, 0, 0);
    this.pdf.line(70, 860, 230, 860);
    this.pdf.setFontSize(8);
    this.pdf.text('¹ Niño, Niña o Adolescente', 70, 870);

    /**Pie de pagina */
    this.crearPiePagina(3);

    window.open(URL.createObjectURL(this.pdf.output('blob')));
  }

  /**
   *@description Crea encabezado del documento */
  static crearEncabezado(
    nombreReporte: string,
    valorY: number,
    otraMedida?: boolean
  ) {
    const left = otraMedida ? 60 : 73;
    const right = otraMedida ? 60 : 75;
    const valorXImg = otraMedida ? 70 : 80;
    autoTable(this.pdf, {
      margin: {
        top: 36,
        left: left,
        right: right,
      },
      body: [
        [
          { content: '', rowSpan: 2, styles: { halign: 'center' } },
          { content: 'FORMATO', styles: { halign: 'center' } },
          {
            content: 'Versión: 01',
            rowSpan: 2,
            styles: { halign: 'center', valign: 'middle' },
          },
        ],
        [
          {
            content: nombreReporte,
            styles: {
              halign: 'center',
              cellPadding: { left: 20, right: 20, top: 5 },
              textColor: [64, 64, 65],
              fontStyle: 'bold',
              minCellHeight: 45,
            },
          },
        ],
      ],
      columnStyles: {
        0: { cellWidth: 150 },
        1: { cellWidth: 244 },
      },
      styles: { lineWidth: 0.5, lineColor: [0, 0, 0] },
      theme: 'plain',
    });

    const logo = new Image();
    logo.src = 'assets/images/minjusticia.png';
    this.pdf.addImage(logo, 'PNG', valorXImg, valorY, 125, 50);
  }

  /*
   **@description Crea pie de pagina del documento
   ** @param formato: Tamaño de la hoja del pdf ? = letter, 2 = legal, [576,936]=3
   */
  static crearPiePagina(formato?: number) {
    const logoUNDP = new Image();
    logoUNDP.src = 'assets/images/Logo_UNDP_Azul.png';
    let valorYNumPagina: number;
    let valorYLogo: number;
    let valorXLogo = formato == 3 ? 480 : 510;

    if (formato == 2) {
      valorYNumPagina = 975;
      valorYLogo = 940;
    } else if (formato == 3) {
      valorYNumPagina = 900;
      valorYLogo = 865;
    } else {
      valorYNumPagina = 750;
      valorYLogo = 720;
    }

    this.pdf.setFontSize(8);
    var pageCount = this.pdf.getNumberOfPages();
    const pageWidth =
      this.pdf.internal.pageSize.width || this.pdf.internal.pageSize.getWidth();
    for (let i = 0; i < pageCount; i++) {
      const pag = i + 1;
      this.pdf.setPage(pag);
      this.pdf.text(
        `Página ${pag}  de ` + pageCount,
        pageWidth / 2,
        valorYNumPagina,
        {
          align: 'center',
        }
      );
      this.pdf.addImage(logoUNDP, 'PNG', valorXLogo, valorYLogo, 29, 55);
    }
  }

  static toTitleCase(cad: string, split: string = ' ') {
    cad = cad.trim().toLowerCase();
    if (cad) {
      let arr = cad.split(split);
      cad = '';
      arr.forEach((e) => {
        if (e) {
          cad += e[0].toUpperCase() + e.substring(1) + ' ';
        }
      });
    }
    return cad;
  }
}
