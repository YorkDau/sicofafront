import { formatDate } from '@angular/common';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import { SharedFunctions } from '../../../../functions';
import { DataSeguimiento } from '../../../interfaces/seguimiento.interface';

export class PdfExport {
  private static pdf: jsPDF;

  /**
   * @description Genera PDF del formato Constacia de Seguimiento Contacto Telefonico
   */

  static generarPdfConstanciaSeguimientoContactoTelefonico(dataReporte?: DataSeguimiento) {
    this.pdf = new jsPDF('p', 'pt', 'letter');
    const pageWidth =
      this.pdf.internal.pageSize.width || this.pdf.internal.pageSize.getWidth();
    this.pdf.setFontSize(10);
    const dia = formatDate(new Date(), 'dd', 'es');
    const mes = formatDate(new Date(), 'MMMM', 'es');
    const anio = formatDate(new Date(), 'yyyy', 'es');
    const nombreFormato = 'CONSTANCIA DE SEGUIMIENTO CONTACTO TELEFONICO';
    const telefono = dataReporte!.numeroTelVictima ? dataReporte!.numeroTelVictima : '____________________________';
    const correo    = dataReporte!.correoVictima ? dataReporte!.correoVictima : '____________________________';
    this.crearEncabezado(nombreFormato, 42);
    this.pdf.setLineWidth(1);
    this.pdf.setDrawColor(0, 0, 0);

    /** Fecha y datos de seguimiento */
    this.pdf.text('FECHA: ' + dia + ' de ' + mes + ' de ' + anio, 85, 130);
    this.pdf.text(
      'MEDIDA DE PROTECCIÓN: _________________________________',
      85,
      150
    );
    this.pdf.text(
      'NÚMERO DE TELÉFONO: '+ telefono,
      85,
      170
    );
    this.pdf.text(
      'CORREO ELECTRÓNICO: ' + correo,
      85,
      190
    );
    this.pdf.text(
      'PERSONA QUE ATIENDE LA LLAMADA: ____________________________________',
      85,
      210
    );
    this.pdf.text(
      'PARENTESCO: ___________________________________________',
      85,
      230
    );

    /** Cuerpo */
    this.pdf.text('SITUACIÓN REPORTADA Y/O ENCONTRADA:', 85, 270);
    this.pdf.line(85, 285, 518, 285);
    this.pdf.line(85, 300, 518, 300);
    this.pdf.line(85, 315, 518, 315);
    this.pdf.line(85, 330, 518, 330);
    this.pdf.line(85, 345, 518, 345);

    this.pdf.text('ACCIONES A SEGUIR:', 85, 400);
    this.pdf.line(85, 415, 518, 415);
    this.pdf.line(85, 430, 518, 430);
    this.pdf.line(85, 445, 518, 445);
    this.pdf.line(85, 460, 518, 460);
    this.pdf.line(85, 475, 518, 475);

    this.pdf.text(
      'No Constestaron                                  No viven en el lugar',
      85,
      520
    );
    this.pdf.rect(165, 511, 10, 10);
    this.pdf.rect(350, 511, 10, 10);

    this.pdf.line(160, 620, 450, 620);
    this.pdf.text(
      'NOMBRE Y FIRMA DEL PROFESIONAL RESPONSABLE',
      pageWidth / 2,
      630,
      {
        align: 'center',
      }
    );

    this.crearPiePagina();

    window.open(URL.createObjectURL(this.pdf.output('blob')));
  }

  /**
   * @description Genera PDF del formato AUTO ORDENANDO VISITA DOMICILIARIA
   */

  static generarPdfAutoOrdenandoVisitaDomiciliaria(dataReporte?: DataSeguimiento) {
    
    this.pdf = new jsPDF('p', 'pt', 'letter');
    this.pdf.setFontSize(10);
    const dia = formatDate(new Date(), 'dd', 'es');
    const mes = formatDate(new Date(), 'MMMM', 'es');
    const anio = formatDate(new Date(), 'yyyy', 'es');
    const ciudad = dataReporte!.ciudadRemision ? dataReporte!.ciudadRemision : '________________';
    const nombreFormato = 'AUTO ORDENANDO VISITA DOMICILIARIA';
    this.crearEncabezado(nombreFormato, 42);

    /** Ciudad y fecha*/
    this.pdf.text(`${ciudad}, ` + dia + ' de ' + mes + ' de ' + anio, 85, 130);

    /** Cuerpo */
    this.pdf.text('REF:', 85, 150);

    autoTable(this.pdf, {
      html: '#ref',
      startY: 170,
      useCss: true,
      margin: {
        left: 85,
        right: 85,
      },
    });

    this.pdf.text('ORDENA:', 85, 240);

    autoTable(this.pdf, {
      html: '#ordena',
      startY: 260,
      useCss: true,
      margin: {
        left: 85,
        right: 85,
      },
    });

    autoTable(this.pdf, {
      html: '#ordena-2',
      startY: 370,
      useCss: true,
      margin: {
        left: 85,
        right: 85,
      },
    });

    this.pdf.text('CÚMPLASE:', 85, 440);

    /** Firma Comisario */
    this.pdf.text('El Comisario(a): _______________________________', 85, 520);

    this.crearPiePagina();

    window.open(URL.createObjectURL(this.pdf.output('blob')));
  }

  /**
   * @description Genera PDF del formato Informe de Seguimiento Entrevista interventiva
   */

  static generarPdfInformeSeguimientoEntrevistaInterventiva(dataReporte?: DataSeguimiento) {
    this.pdf = new jsPDF('p', 'pt', 'letter');
    this.pdf.setFontSize(10);
    const dia = formatDate(new Date(), 'dd', 'es');
    const mes = formatDate(new Date(), 'MMMM', 'es');
    const anio = formatDate(new Date(), 'yyyy', 'es');
    const ciudad = dataReporte!.ciudadRemision ? dataReporte!.ciudadRemision : '________________';
    const nombreFormato = 'INFORME DE SEGUIMIENTO ENTREVISTA INTERVENTIVA';
    this.pdf.setLineWidth(1);
    this.crearEncabezado(nombreFormato, 42);

    /** Ciudad, Fecha y Medida de protección */

    this.pdf.text(ciudad, 85, 130);
    this.pdf.text('Fecha: ' + dia + ' / ' + mes + ' / ' + anio, 85, 145);
    this.pdf.text('MP - VIF: ______________________________', 85, 160);

    /**Nombres Entrevistados */

    this.pdf.text('Nombre(s) Personas entrevistadas:', 85, 180);
    this.pdf.setDrawColor(0, 0, 0);
    this.pdf.line(85, 200, 350, 200);
    this.pdf.line(85, 220, 350, 220);

    /**Numeral 1 */

    autoTable(this.pdf, {
      html: '#Numeral-1',
      startY: 240,
      useCss: true,
      margin: {
        left: 85,
        right: 85,
      },
    });
    this.pdf.setDrawColor(0, 0, 0);
    this.pdf.line(85, 280, 530, 280);
    this.pdf.line(85, 295, 530, 295);
    this.pdf.line(85, 310, 530, 310);
    this.pdf.line(85, 325, 530, 325);
    this.pdf.line(85, 340, 530, 340);
    this.pdf.line(85, 355, 530, 355);

    /**Numera 2 */
    autoTable(this.pdf, {
      html: '#Numeral-2',
      startY: 375,
      useCss: true,
      margin: {
        left: 85,
        right: 85,
      },
    });
    this.pdf.setDrawColor(0, 0, 0);
    this.pdf.line(85, 415, 530, 415);
    this.pdf.line(85, 430, 530, 430);
    this.pdf.line(85, 445, 530, 445);
    this.pdf.line(85, 460, 530, 460);
    this.pdf.line(85, 475, 530, 475);
    this.pdf.line(85, 490, 530, 490);

    /**Numeral 3 */
    autoTable(this.pdf, {
      html: '#Numeral-3',
      startY: 510,
      useCss: true,
      margin: {
        left: 85,
        right: 85,
      },
    });
    this.pdf.setDrawColor(0, 0, 0);
    this.pdf.line(85, 550, 530, 550);
    this.pdf.line(85, 565, 530, 565);
    this.pdf.line(85, 580, 530, 580);
    this.pdf.line(85, 595, 530, 595);
    this.pdf.line(85, 610, 530, 610);
    this.pdf.line(85, 625, 530, 625);

    this.pdf.addPage();
    this.crearEncabezado(nombreFormato, 42);

    /**Numeral 4 */
    autoTable(this.pdf, {
      html: '#Numeral-4',
      startY: 125,
      useCss: true,
      margin: {
        left: 85,
        right: 85,
      },
    });
    this.pdf.setDrawColor(0, 0, 0);
    this.pdf.line(85, 165, 530, 165);
    this.pdf.line(85, 180, 530, 180);
    this.pdf.line(85, 195, 530, 195);
    this.pdf.line(85, 210, 530, 210);
    this.pdf.line(85, 225, 530, 225);
    this.pdf.line(85, 240, 530, 240);

    /**Numeral 5*/
    autoTable(this.pdf, {
      html: '#Numeral-5',
      startY: 260,
      useCss: true,
      margin: {
        left: 85,
        right: 85,
      },
    });
    this.pdf.setDrawColor(0, 0, 0);
    this.pdf.line(85, 300, 530, 300);
    this.pdf.line(85, 315, 530, 315);
    this.pdf.line(85, 330, 530, 330);
    this.pdf.line(85, 345, 530, 345);
    this.pdf.line(85, 360, 530, 360);
    this.pdf.line(85, 375, 530, 375);

    /**Firmas */
    this.pdf.line(85, 440, 250, 440);
    this.pdf.line(305, 440, 480, 440);
    this.pdf.text(
      'Firma citante y C.C                                                 Firma citado y C.C',
      85,
      450
    );

    this.pdf.line(85, 520, 250, 520);
    this.pdf.text('Firma profesional', 85, 530);

    this.pdf.line(85, 600, 250, 600);
    this.pdf.text('Profesional de seguimiento', 85, 610);

    this.crearPiePagina();

    window.open(URL.createObjectURL(this.pdf.output('blob')));
  }

  /**
   * @description Genera PDF del formato de Seguimiento Medidas de Proteccion
   */

  static generarPdfFormatoSeguimientoMedidasProteccion(dataReporte?: DataSeguimiento) {
    this.pdf = new jsPDF('p', 'pt', 'letter');
    this.pdf.setFontSize(10);
    const dia = formatDate(new Date(), 'dd', 'es');
    const mes = formatDate(new Date(), 'MMMM', 'es');
    const anio = formatDate(new Date(), 'yyyy', 'es');
    const ciudad = dataReporte!.ciudadRemision ? dataReporte!.ciudadRemision : '________________';
    const nombreVictima = dataReporte!.nombreVictima ? dataReporte!.nombreVictima : '__________________________________________________';
    const nombreFormato = 'FORMATO SEGUIMIENTO MEDIDAS PROTECCION';
    this.crearEncabezado(nombreFormato, 42);

    /** Ciudad, fecha y medida de protección */
    this.pdf.text('Ciudad: '+ ciudad, 85, 130);
    this.pdf.text('Fecha: ' + dia + ' / ' + mes + ' / ' + anio, 85, 145);
    this.pdf.text('MP-VIF: _____________________', 85, 160);

    /** Nombre y aplicacion de formato */
    this.pdf.text(
      'Nombre Completo: ' + nombreVictima,
      85,
      200
    );
    this.pdf.text('Aplicado a través de:', 85, 215);

    this.pdf.setLineJoin(1);
    this.pdf.setDrawColor(0, 0, 0);

    this.pdf.rect(125, 225, 10, 10);
    this.pdf.text('Consulta en Domicilio', 140, 235);
    this.pdf.rect(125, 245, 10, 10);
    this.pdf.text('Audiencia de seguimiento', 140, 255);
    this.pdf.rect(125, 265, 10, 10);
    this.pdf.text('Contacto Telefónico', 140, 275);
    this.pdf.rect(125, 285, 10, 10);
    this.pdf.text('Taller vivencial de seguimiento', 140, 295);
    this.pdf.rect(125, 305, 10, 10);
    this.pdf.text('Otra ¿Cúal? ____________________', 140, 315);

    /** Preguntas */

    autoTable(this.pdf, {
      html: '#preguntas-aplicables',
      startY: 340,
      useCss: true,
      margin: {
        left: 85,
        right: 80,
      },
    });

    this.pdf.addPage();

    this.crearEncabezado(nombreFormato, 42);

    autoTable(this.pdf, {
      html: '#preguntas-aplicables-2',
      startY: 130,
      useCss: true,
      margin: {
        left: 85,
        right: 80,
      },
    });

    this.pdf.addPage();

    this.crearEncabezado(nombreFormato, 42);

    /**Observaciones y firmas */
    this.pdf.text(
      'Observaciones del (la) profesional/ Conducta a seguir:',
      85,
      140
    );
    this.pdf.setDrawColor(0, 0, 0);
    this.pdf.line(85, 155, 520, 155);
    this.pdf.line(85, 170, 520, 170);
    this.pdf.line(85, 185, 520, 185);
    this.pdf.line(85, 200, 520, 200);
    this.pdf.line(85, 215, 520, 215);
    this.pdf.line(85, 230, 520, 230);
    this.pdf.line(85, 245, 520, 245);
    this.pdf.line(85, 260, 520, 260);

    this.pdf.line(85, 320, 250, 320);
    this.pdf.text('Nombre del usuario(a)', 85, 330);
    this.pdf.text('C.C.', 85, 340);

    this.pdf.line(85, 370, 250, 370);
    this.pdf.text('Profesional que realiza la intervención', 85, 380);

    this.pdf.line(85, 420, 250, 420);
    this.pdf.text('Nombre Profesional de seguimiento', 85, 430);

    this.crearPiePagina();

    window.open(URL.createObjectURL(this.pdf.output('blob')));
  }

  /**
   * @description Genera PDF para el formato de seguimiento Instumento de verificación de la efectividad de la medida de proteccion
   */

  static generarPdfInstrumentoVerificacionEfectividadMedidasProteccion() {
    this.pdf = new jsPDF('p', 'pt', 'letter');

    const nombreFormato =
      'INSTRUMENTO VERIFICACIÓN DE LA EFECTIVIDAD DE LA MEDIDA DE PROTECCIÓN';
    this.crearEncabezado(nombreFormato, 42);
    this.pdf.setLineWidth(0.5);
    this.pdf.setDrawColor(0, 0, 0);

    /** cuadricula */
    this.crearCuadricula(true);

    /** Titulo */
    autoTable(this.pdf, {
      html: '#titulo',
      useCss: true,
      startY: 102.5,
      margin: {
        left: 73,
        right: 75,
      },
    });
    this.verificar(195);

    autoTable(this.pdf, {
      html: '#titulo-1',
      useCss: true,
      startY: 215,
      margin: {
        left: 75,
        right: 84,
      },
    });

    /** Tabla para respuestas lista de chequeo */
    this.cuadroListasCequeo(430, 270, 130, '1.1.1', '1.1.2');
    //cuadros lado izquierdo
    this.pdf.line(430, 340, 460, 340);
    this.pdf.line(460, 340, 460, 400);
    this.pdf.line(430, 351, 460, 351);
    this.pdf.line(430, 361, 460, 361);
    this.pdf.line(430, 374, 460, 374);
    this.pdf.line(430, 387, 460, 387);
    //cuadros lado derecho
    this.pdf.line(480, 340, 510, 340);
    this.pdf.line(480, 340, 480, 400);
    this.pdf.line(480, 351, 510, 351);
    this.pdf.line(480, 361, 510, 361);
    this.pdf.line(480, 374, 510, 374);
    this.pdf.line(480, 387, 510, 387);

    /** Pregunta 1.1 */
    this.cuadroSiYNo(330, 325, 75);
    this.pdf.line(330, 351, 375, 351);
    this.pdf.line(330, 361, 375, 361);
    this.pdf.line(330, 374, 375, 374);
    this.pdf.line(330, 387, 375, 387);

    autoTable(this.pdf, {
      html: '#preguntas',
      useCss: true,
      startY: 340,
      margin: {
        left: 80,
        right: 300,
      },
    });

    //Pregunta 1.2
    this.cuadroListasCequeo(430, 430, 100, '1.2.1', '1.2.2');
    //lineas lado izquierdo
    this.pdf.line(430, 500, 460, 500);
    this.pdf.line(460, 500, 460, 530);
    this.pdf.line(430, 515, 460, 515);
    //lineas lado derecho
    this.pdf.line(480, 500, 510, 500);
    this.pdf.line(480, 500, 480, 530);
    this.pdf.line(480, 515, 510, 515);
    //texto
    autoTable(this.pdf, {
      html: '#titulo-2',
      useCss: true,
      startY: 450,
      margin: {
        left: 75,
        right: 300,
      },
    });
    //tabla SI NO N/A
    this.cuadroSiYNo(330, 485, 45);

    //Pregunt 1.3
    autoTable(this.pdf, {
      html: '#titulo-3',
      useCss: true,
      startY: 570,
      margin: {
        left: 75,
        right: 300,
      },
    });
    //Cuadros Si y No
    this.pdf.setDrawColor(0, 0, 0);
    this.pdf.text('SÍ', 435, 590);
    this.pdf.rect(430, 600, 30, 30);
    this.pdf.text('NO', 485, 590);
    this.pdf.rect(480, 600, 30, 30);

    this.pdf.addPage();

    this.crearEncabezado(nombreFormato, 42);
    this.crearCuadricula(true);

    autoTable(this.pdf, {
      html: '#titulo-medida-1',
      useCss: true,
      startY: 102.5,
      margin: {
        left: 73,
        right: 75,
      },
    });
    this.verificar(180);

    //pregunta 2.1
    autoTable(this.pdf, {
      html: '#titulo-4',
      useCss: true,
      startY: 210,
      margin: {
        left: 75,
        right: 300,
      },
    });
    //SI NO N/A
    this.cuadroSiYNo(330, 210, 45);

    //pregunta 2.2
    autoTable(this.pdf, {
      html: '#titulo-5',
      useCss: true,
      startY: 290,
      margin: {
        left: 75,
        right: 300,
      },
    });
    this.cuadroListasCequeo(430, 290, 110, '2.2.1', '2.2.2');
    //lineas lado izquierdo
    this.pdf.line(430, 370, 460, 370);
    this.pdf.line(460, 370, 460, 400);
    //lineas lado derecho
    this.pdf.line(480, 370, 510, 370);
    this.pdf.line(480, 370, 480, 400);
    //Cuadro SI NO N/A
    this.cuadroSiYNo(330, 350, 50);

    autoTable(this.pdf, {
      html: ' #explicacion-respuesta',
      useCss: true,
      startY: 430,
      margin: {
        left: 75,
        right: 90,
      },
    });

    //pregunta 2.3
    autoTable(this.pdf, {
      html: '#titulo-6',
      useCss: true,
      startY: 515,
      margin: {
        left: 75,
        right: 300,
      },
    });
    this.cuadroListasCequeo(430, 480, 100, '2.3.1', '2.3.2');
    //lineas lado izquierdo
    this.pdf.line(430, 550, 460, 550);
    this.pdf.line(460, 550, 460, 580);
    //lineas lado derecho
    this.pdf.line(480, 550, 510, 550);
    this.pdf.line(480, 550, 480, 580);
    //Cuadro SI NO N/A
    this.cuadroSiYNo(330, 530, 50);

    //pregunta 2.4
    autoTable(this.pdf, {
      html: '#titulo-7',
      useCss: true,
      startY: 620,
      margin: {
        left: 75,
        right: 300,
      },
    });
    //Cuadros Si y No
    this.pdf.setDrawColor(0, 0, 0);
    this.pdf.text('SÍ', 435, 620);
    this.pdf.rect(430, 630, 30, 30);
    this.pdf.text('NO', 485, 620);
    this.pdf.rect(480, 630, 30, 30);

    this.pdf.addPage();

    this.crearEncabezado(nombreFormato, 42);
    this.crearCuadricula(true);

    //tercera medida
    autoTable(this.pdf, {
      html: '#titulo-medida-2',
      useCss: true,
      startY: 102.5,
      margin: {
        left: 73,
        right: 75,
      },
    });
    this.verificar(165);

    //pregunta 3.1
    autoTable(this.pdf, {
      html: '#titulo-8',
      useCss: true,
      startY: 240,
      margin: {
        left: 75,
        right: 300,
      },
    });
    this.cuadroListasCequeo(430, 200, 100, '3.1.1', '3.1.2');
    //lineas lado izquierdo
    this.pdf.line(430, 270, 460, 270);
    this.pdf.line(460, 270, 460, 300);
    //lineas lado derecho
    this.pdf.line(480, 270, 510, 270);
    this.pdf.line(480, 270, 480, 300);
    //Cuadro SI NO N/A
    this.cuadroSiYNo(330, 250, 50);

    //pregunta 3.2
    autoTable(this.pdf, {
      html: '#titulo-9',
      useCss: true,
      startY: 350,
      margin: {
        left: 75,
        right: 300,
      },
    });
    //Cuadros Si y No
    this.pdf.setDrawColor(0, 0, 0);
    this.pdf.text('SÍ', 435, 360);
    this.pdf.rect(430, 370, 30, 30);
    this.pdf.text('NO', 485, 360);
    this.pdf.rect(480, 370, 30, 30);

    //cuarta medida
    autoTable(this.pdf, {
      html: '#titulo-medida-3',
      useCss: true,
      startY: 410,
      margin: {
        left: 73,
        right: 75,
      },
    });
    this.verificar(470);

    //pregunta 4.1
    autoTable(this.pdf, {
      html: '#titulo-10',
      useCss: true,
      startY: 550,
      margin: {
        left: 75,
        right: 300,
      },
    });
    //cuadro lista de chequeo
    this.cuadroListasCequeo(430, 490, 100, '4.1.1', '4.1.2');
    //lineas lado izquierdo
    this.pdf.line(430, 560, 460, 560);
    this.pdf.line(460, 560, 460, 590);
    //lineas lado derecho
    this.pdf.line(480, 560, 510, 560);
    this.pdf.line(480, 560, 480, 590);
    //cuadro SI NO N/A
    this.cuadroSiYNo(330, 540, 50);

    //pregunta 4.2
    autoTable(this.pdf, {
      html: '#titulo-11',
      useCss: true,
      startY: 620,
      margin: {
        left: 75,
        right: 300,
      },
    });
    //cuadro SI NO N/A
    this.cuadroSiYNo(330, 640, 50);

    this.pdf.addPage();
    this.crearEncabezado(nombreFormato, 42);
    this.crearCuadricula(true);

    //pregunta 4.3
    autoTable(this.pdf, {
      html: '#titulo-12',
      useCss: true,
      startY: 110,
      margin: {
        left: 75,
        right: 300,
      },
    });
    //cuadros SI NO
    this.pdf.setDrawColor(0, 0, 0);
    this.pdf.text('SÍ', 435, 130);
    this.pdf.rect(430, 140, 30, 30);
    this.pdf.text('NO', 485, 130);
    this.pdf.rect(480, 140, 30, 30);
    //Explicacion respuesta
    autoTable(this.pdf, {
      html: ' #explicacion-respuesta',
      useCss: true,
      startY: 190,
      margin: {
        left: 75,
        right: 90,
      },
    });

    //quinta medida medida
    autoTable(this.pdf, {
      html: '#titulo-medida-4',
      useCss: true,
      startY: 220,
      margin: {
        left: 73,
        right: 75,
      },
    });
    this.verificar(260);

    //pregunta 5.1
    autoTable(this.pdf, {
      html: '#titulo-13',
      useCss: true,
      startY: 340,
      margin: {
        left: 75,
        right: 300,
      },
    });
    //cuadro lista de chequeo
    this.cuadroListasCequeo(430, 290, 100, '4.1.1', '4.1.2');
    //lineas lado izquierdo
    this.pdf.line(430, 360, 460, 360);
    this.pdf.line(460, 360, 460, 390);
    //lineas lado derecho
    this.pdf.line(480, 360, 510, 360);
    this.pdf.line(480, 360, 480, 390);
    //cuadro SI NO N/A
    this.cuadroSiYNo(330, 340, 50);
    //pregunta 5.2
    autoTable(this.pdf, {
      html: '#titulo-14',
      useCss: true,
      startY: 430,
      margin: {
        left: 75,
        right: 300,
      },
    });
    //cuadros SI NO
    this.pdf.setDrawColor(0, 0, 0);
    this.pdf.text('SÍ', 435, 450);
    this.pdf.rect(430, 460, 30, 30);
    this.pdf.text('NO', 485, 450);
    this.pdf.rect(480, 460, 30, 30);

    //sexta medida
    autoTable(this.pdf, {
      html: '#titulo-medida-5',
      useCss: true,
      startY: 520,
      margin: {
        left: 73,
        right: 75,
      },
    });
    this.verificar(570);
    //pregunta 6.1
    autoTable(this.pdf, {
      html: '#titulo-15',
      useCss: true,
      startY: 600,
      margin: {
        left: 75,
        right: 300,
      },
    });
    //cuadro SI NO N/A
    this.cuadroSiYNo(330, 620, 50);

    this.pdf.addPage();
    this.crearEncabezado(nombreFormato, 42);
    this.crearCuadricula(true);

    //pregunta 6.2
    autoTable(this.pdf, {
      html: '#titulo-16',
      useCss: true,
      startY: 115,
      margin: {
        left: 75,
        right: 300,
      },
    });
    //cuadros SI NO
    this.pdf.setDrawColor(0, 0, 0);
    this.pdf.text('SÍ', 435, 125);
    this.pdf.rect(430, 135, 30, 30);
    this.pdf.text('NO', 485, 125);
    this.pdf.rect(480, 135, 30, 30);

    //Septima medida
    autoTable(this.pdf, {
      html: '#titulo-medida-6',
      useCss: true,
      startY: 180,
      margin: {
        left: 73,
        right: 75,
      },
    });
    this.verificar(230);
    //pregunta 7.1
    autoTable(this.pdf, {
      html: '#titulo-17',
      useCss: true,
      startY: 320,
      margin: {
        left: 75,
        right: 300,
      },
    });
    //cuadro lista de chequeo
    this.cuadroListasCequeo(430, 260, 100, '4.1.1', '4.1.2');
    //lineas lado izquierdo
    this.pdf.line(430, 330, 460, 330);
    this.pdf.line(460, 330, 460, 360);
    //lineas lado derecho
    this.pdf.line(480, 330, 510, 330);
    this.pdf.line(480, 330, 480, 360);
    //cuadro SI NO N/A
    this.cuadroSiYNo(330, 310, 50);
    //pregunta 7.2
    autoTable(this.pdf, {
      html: '#titulo-18',
      useCss: true,
      startY: 390,
      margin: {
        left: 75,
        right: 300,
      },
    });
    //cuadros SI NO
    this.pdf.setDrawColor(0, 0, 0);
    this.pdf.text('SÍ', 435, 400);
    this.pdf.rect(430, 410, 30, 30);
    this.pdf.text('NO', 485, 400);
    this.pdf.rect(480, 410, 30, 30);

    autoTable(this.pdf, {
      html: ' #explicacion-respuesta',
      useCss: true,
      startY: 470,
      margin: {
        left: 75,
        right: 90,
      },
    });

    //Octava medida
    autoTable(this.pdf, {
      html: '#titulo-medida-7',
      useCss: true,
      startY: 500,
      margin: {
        left: 73,
        right: 75,
      },
    });
    this.verificar(570);
    //pregunta8.1
    autoTable(this.pdf, {
      html: '#titulo-19',
      useCss: true,
      startY: 610,
      margin: {
        left: 75,
        right: 300,
      },
    });
    //cuadro SI NO N/A
    this.cuadroSiYNo(330, 620, 50);

    this.pdf.setFontSize(8);
    this.pdf.text('Si existe la solicitud, continúe a 8.2', 85, 690);

    this.pdf.addPage();
    this.crearEncabezado(nombreFormato, 42);
    this.crearCuadricula(true);

    //pregunta 8.2
    autoTable(this.pdf, {
      html: '#titulo-20',
      useCss: true,
      startY: 160,
      margin: {
        left: 75,
        right: 300,
      },
    });
    //cuadro lista de chequeo
    this.cuadroListasCequeo(430, 110, 100, '4.1.1', '4.1.2');
    //lineas lado izquierdo
    this.pdf.line(430, 180, 460, 180);
    this.pdf.line(460, 180, 460, 210);
    //lineas lado derecho
    this.pdf.line(480, 180, 510, 180);
    this.pdf.line(480, 180, 480, 210);
    //cuadro SI NO N/A
    this.cuadroSiYNo(330, 160, 50);

    //pregunta 8.3
    autoTable(this.pdf, {
      html: '#titulo-21',
      useCss: true,
      startY: 240,
      margin: {
        left: 75,
        right: 300,
      },
    });
    //cuadros SI NO
    this.pdf.setDrawColor(0, 0, 0);
    this.pdf.text('SÍ', 435, 250);
    this.pdf.rect(430, 260, 30, 30);
    this.pdf.text('NO', 485, 250);
    this.pdf.rect(480, 260, 30, 30);

    // novena medida
    autoTable(this.pdf, {
      html: '#titulo-medida-8',
      useCss: true,
      startY: 310,
      margin: {
        left: 73,
        right: 75,
      },
    });
    this.verificar(360);

    //pregunta 9.1
    autoTable(this.pdf, {
      html: '#titulo-22',
      useCss: true,
      startY: 420,
      margin: {
        left: 75,
        right: 300,
      },
    });
    //cuadro lista de chequeo
    this.cuadroListasCequeo(430, 400, 120, '4.1.1', '4.1.2');
    //lineas lado izquierdo
    this.pdf.line(430, 470, 460, 470);
    this.pdf.line(460, 470, 460, 520);
    this.pdf.line(430, 495, 460, 495);
    //lineas lado derecho
    this.pdf.line(480, 470, 510, 470);
    this.pdf.line(480, 470, 480, 520);
    this.pdf.line(480, 495, 510, 495);
    //cuadro SI NO N/A
    this.cuadroSiYNo(330, 450, 70);
    this.pdf.line(330, 490, 375, 490);
    this.pdf.text('Policía Nacional', 250, 485);
    this.pdf.text('Otras autoridades (Especifique cuáles)', 170, 500);
    this.pdf.line(100, 520, 310, 520);

    //pregunta 9.2
    autoTable(this.pdf, {
      html: '#titulo-23',
      useCss: true,
      startY: 560,
      margin: {
        left: 75,
        right: 300,
      },
    });
    //cuadros SI NO
    this.pdf.setDrawColor(0, 0, 0);
    this.pdf.text('SÍ', 435, 570);
    this.pdf.rect(430, 580, 30, 30);
    this.pdf.text('NO', 485, 570);
    this.pdf.rect(480, 580, 30, 30);

    autoTable(this.pdf, {
      html: ' #explicacion-respuesta',
      useCss: true,
      startY: 670,
      margin: {
        left: 75,
        right: 90,
      },
    });

    this.pdf.addPage();
    this.crearEncabezado(nombreFormato, 42);
    this.crearCuadricula(true);

    // decima medida
    autoTable(this.pdf, {
      html: '#titulo-medida-9',
      useCss: true,
      startY: 102.5,
      margin: {
        left: 73,
        right: 75,
      },
    });
    this.verificar(165);
    //pregunta 10.1
    autoTable(this.pdf, {
      html: '#titulo-24',
      useCss: true,
      startY: 210,
      margin: {
        left: 75,
        right: 300,
      },
    });
    //Cuadro SI NO N/A
    this.cuadroSiYNo(330, 200, 50);
    this.pdf.setFontSize(8);
    this.pdf.text(
      'En caso que la víctima haya solicitado la medida, pero desconozca la información  de los inmuebles, responda la 10.1.1.',
      75,
      270
    );

    //pregunta 10.1.1
    autoTable(this.pdf, {
      html: '#titulo-25',
      useCss: true,
      startY: 340,
      margin: {
        left: 75,
        right: 300,
      },
    });
    //cuadro
    this.pdf.setDrawColor(0, 0, 0);
    this.pdf.setFillColor(225, 225, 225);
    this.pdf.setFontSize(8);
    this.pdf.rect(430, 300, 80, 100, 'FD');
    this.pdf.text('Lista de chequeo', 440, 310);
    this.pdf.text('10.0.1', 455, 325);
    this.pdf.text('SI', 460, 340);
    this.pdf.text('res. Si', 457, 355);
    //lineas para el cuadrado
    this.pdf.line(455, 370, 485, 370);
    this.pdf.line(455, 370, 455, 400);
    this.pdf.line(485, 370, 485, 400);
    //Cuadro SI NO N/A
    this.cuadroSiYNo(330, 350, 50);

    //pregunta 10.2
    autoTable(this.pdf, {
      html: '#titulo-26',
      useCss: true,
      startY: 460,
      margin: {
        left: 75,
        right: 300,
      },
    });
    // cuadro lista de chequeo
    this.cuadroListasCequeo(430, 430, 100, '10.2.1', '10.2.2');
    //lineas lado izquierdo
    this.pdf.line(430, 500, 460, 500);
    this.pdf.line(460, 500, 460, 530);
    //lineas lado derecho
    this.pdf.line(480, 500, 510, 500);
    this.pdf.line(480, 500, 480, 530);
    //cuadro SI NO N/A
    this.cuadroSiYNo(330, 480, 50);

    //pregunta 10.3
    autoTable(this.pdf, {
      html: '#titulo-27',
      useCss: true,
      startY: 560,
      margin: {
        left: 75,
        right: 300,
      },
    });
    //Cuadro SI NO
    this.pdf.setDrawColor(0, 0, 0);
    this.pdf.text('SÍ', 435, 570);
    this.pdf.rect(430, 580, 30, 30);
    this.pdf.text('NO', 485, 570);
    this.pdf.rect(480, 580, 30, 30);

    this.pdf.addPage();
    this.crearEncabezado(nombreFormato, 42);
    this.crearCuadricula(true);

    autoTable(this.pdf, {
      html: '#titulo-28',
      useCss: true,
      startY: 120,
      margin: {
        left: 75,
        right: 260,
      },
    });
    //Cuadro SI NO
    this.pdf.setDrawColor(0, 0, 0);
    this.pdf.text('SÍ', 435, 120);
    this.pdf.rect(430, 130, 30, 30);
    this.pdf.text('NO', 485, 120);
    this.pdf.rect(480, 130, 30, 30);

    // Cuadros Aclaraciones
    autoTable(this.pdf, {
      html: '#aclaraciones-1',
      useCss: true,
      startY: 210,
      margin: {
        left: 85,
        right: 280,
      },
    });
    autoTable(this.pdf, {
      html: '#aclaraciones-2',
      useCss: true,
      startY: 280,
      margin: {
        left: 85,
        right: 280,
      },
    });
    this.pdf.setDrawColor(0, 0, 0);
    //Lineas para conectar el primer cuadro
    this.pdf.line(445, 160, 445, 230);
    this.pdf.line(332, 230, 445, 230);
    //Lineas para conectar el segundo cuadro
    this.pdf.line(495, 160, 495, 300);
    this.pdf.line(332, 300, 495, 300);

    //Aclaracion final
    autoTable(this.pdf, {
      html: '#aclaracion-final',
      useCss: true,
      startY: 350,
      margin: {
        left: 85,
        right: 90,
      },
    });

    //firmas
    this.pdf.setDrawColor(0, 0, 0);
    this.pdf.setFontSize(10);
    this.pdf.line(90, 440, 390, 440);
    this.pdf.text(
      '12. Firma de quien realizó el seguimiento  a las medidas de protección',
      75,
      455
    );
    this.pdf.text('Nombre:', 90, 475);
    this.pdf.text('Cargo:', 90, 495);

    this.crearPiePagina(4);
    window.open(URL.createObjectURL(this.pdf.output('blob')));
  }

  static generarPdfInstrumentoSeguimientoEfectividadMedidasAtencion(){
    this.pdf = new jsPDF('p', 'pt', 'letter');

    const nombreFormato =
      'INSTRUMENTO PARA EL SEGUIMIENTO A LAS MEDIDAS DE ATENCION';
    this.crearEncabezado(nombreFormato, 42,true);
    this.pdf.setLineWidth(0.5);
    this.pdf.setDrawColor(0, 0, 0);

    //cuadricula
    this.crearCuadricula(false);
    //titulo 1 y datos instutucionales
    autoTable(this.pdf, {
      html: '#titulo',
      useCss: true,
      startY: 102.5,
      margin: {
        left: 60,
        right: 60,
      },
    });

    //campos de datos 
    this.pdf.setFontSize(9);
    this.pdf.text('1. Comisaría de familia de _____________________',62, 160);
    this.pdf.text('2. Departamento: ___________________', 62, 180);
    this.pdf.text('3. Municipio: _______________________',62,200);
    this.pdf.setLineWidth(0.5);
    this.pdf.setDrawColor(0, 0, 0);
    this.pdf.line(310,137,310,220);
    this.pdf.text('4. Fecha de diligenciamiento', 312, 160);
    this.pdf.text('5. Expediente número',312, 200);
    //cuadros para el numero de expediente y la fecha
    this.pdf.setLineWidth(1);
    this.pdf.setDrawColor(0, 0, 0);
    //cuadro numero expedidente
    //cuadro fecha
    this.pdf.rect(440,150,80,15);
    //lineas dentro de lo cuadro fecha
    this.pdf.line(450,150,450,165);
    this.pdf.line(460,150,460,165);
    this.pdf.line(470,150,470,165);
    this.pdf.line(480,150,480,165);
    this.pdf.line(490,150,490,165);
    this.pdf.line(500,150,500,165);
    this.pdf.line(510,150,510,165);
    this.pdf.setFontSize(7);
    this.pdf.text('DÍA',442,175);
    this.pdf.text('MES',462,175);
    this.pdf.text('AÑO',492,175);
    this.pdf.rect(440,190,80,15);
    //lineas dentro del cuadro numero expediente
    this.pdf.line(450,190,450,205);
    this.pdf.line(460,190,460,205);
    this.pdf.line(470,190,470,205);
    this.pdf.line(480,190,480,205);
    this.pdf.line(490,190,490,205);
    this.pdf.line(500,190,500,205);
    this.pdf.line(510,190,510,205);

    //segundo titulo 
    autoTable(this.pdf, {
      html: '#titulo-blanco-1',
      useCss: true,
      startY: 220,
      margin: {
        left: 60,
        right: 60,
      },
    });
    this.pdf.setFontSize(9);
    this.pdf.text('6. Nombre:',62,260);
    // epsacios para nombres y apellidos;
    this.pdf.setLineWidth(1);
    this.pdf.setDrawColor(0, 0, 0);
    this.pdf.rect(130,250,150,15);
    //apellidos
    this.pdf.setFontSize(7);
    this.pdf.text('1er Apellido', 285, 260);
    this.pdf.rect(325,250,90,15);
    this.pdf.text('2do Apellido', 420,260);
    this.pdf.rect(460,250,92,15);
    //7 identificación
    this.pdf.setFontSize(9);
    this.pdf.text('7. Identificación:',62, 300);
    //Cuadro RC
    this.pdf.rect(140,290,30,15);
    this.pdf.setFontSize(7);
    this.pdf.text('RC',142,300);
    this.pdf.line(155,290,155,305);
    //cuadro CC
    this.pdf.rect(180,290,30,15);
    this.pdf.text('CC',182,300);
    this.pdf.line(195,290,195,305);
    //Cuadro TI
    this.pdf.rect(220,290,30,15);
    this.pdf.text('TI',222,300);
    this.pdf.line(235,290,235,305);
    //Cuadro CE
    this.pdf.rect(260,290,30,15);
    this.pdf.text('CE',262,300);
    this.pdf.line(275,290,275,305);
    //Cuadro PA
    this.pdf.rect(300,290,30,15);
    this.pdf.text('PA',302,300);
    this.pdf.line(315,290,315,305);
    //Cuadro SD
    this.pdf.rect(340,290,30,15);
    this.pdf.text('SD',342,300);
    this.pdf.line(355,290,355,305);
    //cuadro otro
    this.pdf.text('Otro:',400,300);
    this.pdf.rect(420,290,100,15);
    //cuadro N
    this.pdf.text('No.',400,330);
    this.pdf.rect(420,320,100,15);

    //8. Relación con el agresor/a:
    this.pdf.setFontSize(9);
    this.pdf.text('8. Relación con el agresor/a:',62,360);
    //cuadro para conyuge
    this.pdf.setLineWidth(1);
    this.pdf.setDrawColor(0, 0, 0);
    this.pdf.setFontSize(7);
    this.pdf.rect(190,350,100,15);
    this.pdf.text('Cónyuge/compañero/a',192,360);
    this.pdf.line(275,350,275,365);
    //cuadro para exconyuge
    this.pdf.rect(300,350,110,15);
    this.pdf.text('Excónyuge/Excompañero/a',302,360);
    this.pdf.line(395,350,395,365);
    //cuadro para padre o madre
    this.pdf.rect(420,350,100,15);
    this.pdf.text('Padre/Madre',422,360);
    this.pdf.line(505,350,505,365);

    //cuadro hijo
    this.pdf.rect(65,380,60,15);
    this.pdf.text('Hijo/a',67,390);
    this.pdf.line(110,380,110,395);
    //cuadro hijastro
    this.pdf.rect(135,380,60,15);
    this.pdf.text('Hijastro/a',137,390);
    this.pdf.line(180,380,180,395);
    //cuadro Hermano
    this.pdf.rect(205,380,60,15);
    this.pdf.text('Hermano/a',207,390);
    this.pdf.line(250,380,250,395);
    //cuadro Hermanastro
    this.pdf.rect(275,380,70,15);
    this.pdf.text('Hermanastro/a',277,390);
    this.pdf.line(330,380,330,395);
    //cuadro tio 
    this.pdf.rect(355,380,50,15);
    this.pdf.text('Tio/a',357,390);
    this.pdf.line(390,380,390,395);
    //cuadro primo
    this.pdf.rect(415,380,50,15);
    this.pdf.text('Primo/a',417,390);
    this.pdf.line(450,380,450,395);
    //cuadro abuelo
    this.pdf.rect(475,380,60,15);
    this.pdf.text('Abuelo/a',477,390);
    this.pdf.line(510,380,510,395);
    
    //cuadro nieto
    this.pdf.rect(65,410,60,15);
    this.pdf.text('Nieto/a',67,420);
    this.pdf.line(110,410,110,425);
    //cuadro suegro
    this.pdf.rect(135,410,60,15);
    this.pdf.text('Suegro/a',137,420);
    this.pdf.line(180,410,180,425);
    //cuadro sobrino
    this.pdf.rect(205,410,60,15);
    this.pdf.text('Sobrino/a',207,420);
    this.pdf.line(250,380,250,395);
    //cuadro otro pariente
    this.pdf.rect(275,410,70,15);
    this.pdf.text('Otro pariente',277,420);
    this.pdf.line(330,410,330,425);
    //cuadro SD
    this.pdf.rect(355,410,50,15);
    this.pdf.text('SD',357,420);
    this.pdf.line(390,410,390,425);


    //9. Tiene hijos: 
    this.pdf.setFontSize(9)
    this.pdf.text('9. Tiene hijos: ', 65, 460);
    //cuadros si y no
    this.pdf.setFontSize(7);
    this.pdf.rect(135,450,40,15);
    this.pdf.text('NO',137,460);
    this.pdf.line(155,450,155,465);
    this.pdf.rect(185,450,40,15);
    this.pdf.text('SI',187,460);
    this.pdf.line(205,450,205,465);

    //cuadro Cuantos 
    this.pdf.text('¿Cuántos?', 240, 460);
    this.pdf.rect(280,450,20,15);
    
    autoTable(this.pdf,{
      html: '#tabla-hijos',
      useCss: true,
      startY: 480,
      margin:{
        left: 100,
        right: 100
      }
    });
    this.pdf.setLineWidth(1);
    this.pdf.setDrawColor(0, 0, 0);
    this.pdf.line(60, 590, 554, 590);

    //10. ¿La víctima tiene usted alguna discapacidad?
    this.pdf.setFontSize(9);
    this.pdf.text('10. ¿La víctima tiene usted alguna discapacidad?',65,610);
    //cuadro No
    this.pdf.setFontSize(7);
    this.pdf.rect(270,600,30,15);
    this.pdf.text('NO',272, 610);
    this.pdf.line(285,600,285,615);
    //Cuadro si
    this.pdf.rect(310,600,30,15);
    this.pdf.text('SI',312, 610);
    this.pdf.line(325,600,325,615);
    //campo cual
    this.pdf.text('¿Cuál?', 352, 610);
    this.pdf.rect(350,600,80,15);

    //lineas para la flecha 
    this.pdf.line(320,615,320,630);
    this.pdf.line(140,630,320,630);
    this.pdf.line(140,630,140,640)
     //11.  ¿La víctima tiene cuidador/a?
     this.pdf.setFontSize(9);
     this.pdf.text('11.  ¿La víctima tiene cuidador/a?',65,650);
     //cuadro No
    this.pdf.setFontSize(7);
    this.pdf.rect(270,640,30,15);
    this.pdf.text('NO',272, 650);
    this.pdf.line(285,640,285,655);
    //Cuadro si
    this.pdf.rect(310,640,30,15);
    this.pdf.text('SI',312, 650);
    this.pdf.line(325,640,325,655);

    //12. ¿La víctima se encuentra en estado de embarazo?
    this.pdf.setFontSize(9);
    this.pdf.text('12. ¿La víctima se encuentra en estado de embarazo?',65,680);
    //cuadro No
    this.pdf.setFontSize(7);
    this.pdf.rect(290,670,30,15);
    this.pdf.text('NO',292, 680);
    this.pdf.line(305,670,305,685);
    //Cuadro si
    this.pdf.rect(330,670,30,15);
    this.pdf.text('SI',332, 680);
    this.pdf.line(345,670,345,685);
    //campo cual
    this.pdf.text('¿Cuántos meses?', 382, 680);
    this.pdf.rect(380,670,80,15);
    this.pdf.line(445,670,445,685);
    //campo SD 
    this.pdf.rect(470,670,30,15);
    this.pdf.text('SD',472, 680);
    this.pdf.line(485,670,485,685);
    //campo NA 
    this.pdf.rect(510,670,30,15);
    this.pdf.text('NA',512, 680);
    this.pdf.line(525,670,525,685);

    this.pdf.addPage();
    this.crearEncabezado(nombreFormato, 42,true);
    //cuadricula
    this.crearCuadricula(false);
    //segundo titulo 
    autoTable(this.pdf, {
      html: '#titulo-blanco-2',
      useCss: true,
      startY: 102.5,
      margin: {
        left: 60,
        right: 60,
      },
    });

    this.pdf.setFontSize(9);
    this.pdf.text('Revise los siguientes en el expediente: (consigne ideas generales)', 65, 130);

    //13. Resumen de la historia clínica de la mujer víctima. Este resumen de historia clínica debe contener:
    this.pdf.text('13. Resumen de la historia clínica de la mujer víctima. Este resumen de historia clínica debe contener:' ,65,150);
    //punto a
    this.pdf.text('a. El diagnóstico inicial de la afectación de la violencia en la salud física y mental  de las mujeres víctimas', 85,170);
    this.pdf.setLineWidth(1);
    this.pdf.setDrawColor(0, 0, 0);
    this.pdf.line(85, 190, 510, 190);
    this.pdf.line(85, 210, 510, 210);
    this.pdf.line(85, 230, 510, 230);
    //punto b
    this.pdf.text('b. El plan de tratamiento a seguir', 85,250);
    this.pdf.line(85, 270, 510, 270);
    this.pdf.line(85, 290, 510, 290);
    this.pdf.line(85, 310, 510, 310);
    //14. Situación especial de riesgo en que se encuentre la víctima
    this.pdf.text('14. Situación especial de riesgo en que se encuentre la víctima', 65,330);
    this.pdf.line(85, 350, 510, 350);
    this.pdf.line(85, 370, 510, 370);
    this.pdf.line(85, 390, 510, 390);

    autoTable(this.pdf, {
      html: '#titulo-1',
      useCss: true,
      startY: 400,
      margin: {
        left: 60,
        right: 60,
      },
    });
    //15. Fecha de la medida de atención ordenada
    this.pdf.text('15. Fecha de la medida de atención ordenada', 65,470);
    this.pdf.setLineWidth(1);
    this.pdf.setDrawColor(0, 0, 0);
    this.pdf.rect(270,460,80,15);
    //lineas dentro de lo cuadro fecha
    this.pdf.line(280,460,280,475);
    this.pdf.line(290,460,290,475);
    this.pdf.line(300,460,300,475);
    this.pdf.line(310,460,310,475);
    this.pdf.line(320,460,320,475);
    this.pdf.line(330,460,330,475);
    this.pdf.line(340,460,340,475);
    this.pdf.setFontSize(7);
    this.pdf.text('DÍA',275,482);
    this.pdf.text('MES',295,482);
    this.pdf.text('AÑO',325,482);

    //16. Tiempo de la medida de atención
    this.pdf.setFontSize(9);
    this.pdf.text('16. Tiempo de la medida de atención', 65,500);
    this.pdf.setLineWidth(1);
    this.pdf.setDrawColor(0, 0, 0);
    this.pdf.rect(270,490,40,15);
    this.pdf.line(280,490,280,505);
    this.pdf.line(290,490,290,505);
    this.pdf.line(300,490,300,505);
    //17. Mecanismo de seguimiento establecido en el fallo
    this.pdf.text('17. Mecanismo de seguimiento establecido en el fallo', 65,530);
    this.pdf.rect(400,520,50,50);
    this.pdf.line(425,520,425,570);
    this.pdf.line(400,540,450,540);
    this.pdf.text('SI',410,535);
    this.pdf.text('NO',430,535);
    
    this.pdf.text('Indique Sí o No el fallo determinó algún mecanismo de seguimiento',100,560);
    //17.1 Transcriba en el instrumento el mecanismo de seguimiento.
    this.pdf.text('17.1 Transcriba en el instrumento el mecanismo de seguimiento.',65,630);
    this.pdf.line(85,650,370,650);
    this.pdf.line(85,670,370,670);

    this.pdf.line(420,575,420,590);
    this.pdf.line(120,590,420,590);
    this.pdf.line(120,590,120,615);

    this.pdf.line(440,575,440,625);
    autoTable(this.pdf, {
      html: '#tabla-informacion',
      useCss: true,
      startY: 630,
      margin: {
        left: 430,
        right: 70,
      },
    });

    this.pdf.addPage();
    this.crearEncabezado(nombreFormato, 42,true);
    //cuadricula
    this.crearCuadricula(false);

    //18. Cumplimiento del seguimiento.
    this.pdf.text('18. Cumplimiento del seguimiento.', 65,130);
    this.pdf.rect(400,130,50,50);
    this.pdf.line(425,130,425,180);
    this.pdf.line(400,150,450,150);
    this.pdf.text('SI',410,145);
    this.pdf.text('NO',430,145);

    autoTable(this.pdf, {
      html: '#verifique',
      useCss: true,
      startY: 140,
      margin: {
        left: 80,
        right: 250,
      },
    });
    this.pdf.setLineWidth(1);
    this.pdf.setDrawColor(0, 0, 0);
    this.pdf.line(440,183,440,205);
    autoTable(this.pdf, {
      html: '#tabla-informacion-1',
      useCss: true,
      startY: 210,
      margin: {
        left: 430,
        right: 70,
      },
    });

    autoTable(this.pdf, {
      html: '#titulo-blanco-3',
      useCss: true,
      startY: 260,
      margin: {
        left: 60,
        right: 60,
      },
    });
    //pregunta 19
    autoTable(this.pdf, {
      html: '#pregunta-19',
      useCss: true,
      startY: 310,
      margin: {
        left: 65,
        right: 250,
      },
    });

    this.pdf.setLineWidth(1);
    this.pdf.setDrawColor(0, 0, 0);
    this.pdf.rect(400,290,50,50);
    this.pdf.line(425,290,425,340);
    this.pdf.line(400,310,450,310);
    this.pdf.text('SI',410,305);
    this.pdf.text('NO',430,305);

    this.pdf.line(440,345,440,365);
    autoTable(this.pdf, {
      html: '#tabla-informacion-2',
      useCss: true,
      startY: 370,
      margin: {
        left: 430,
        right: 70,
      },
    });
    //pregunta 20
    autoTable(this.pdf, {
      html: '#pregunta-20',
      useCss: true,
      startY: 410,
      margin: {
        left: 65,
        right: 250,
      },
    });

    this.pdf.setLineWidth(1);
    this.pdf.setDrawColor(0, 0, 0);
    this.pdf.rect(400,510,20,20);
    this.pdf.rect(400,550,20,20);
    this.pdf.rect(400,590,20,20);

    this.pdf.addPage();
    this.crearEncabezado(nombreFormato, 42,true);
    //cuadricula
    this.crearCuadricula(false);

    autoTable(this.pdf, {
      html: '#pregunta-20-d',
      useCss: true,
      startY: 120,
      margin: {
        left: 65,
        right: 75,
      },
    });

    this.pdf.setFontSize(9);
    this.pdf.text('Marque con una X cuando se haya enviado el oficio y se haya anexado la copia al expediente', 75, 200);
    this.pdf.setLineWidth(1);
    this.pdf.setDrawColor(0, 0, 0);
    this.pdf.rect(480,190,20,20);

    //pregunta 21
    autoTable(this.pdf, {
      html: '#pregunta-21',
      useCss: true,
      startY: 230,
      margin: {
        left: 65,
        right: 250,
      },
    });

    this.pdf.setLineWidth(1);
    this.pdf.setDrawColor(0, 0, 0);
    this.pdf.rect(430,230,50,50);
    this.pdf.line(455,230,455,280);
    this.pdf.line(430,250,480,250);
    this.pdf.text('SI',440,240);
    this.pdf.text('NO',460,240);

    this.pdf.line(440,285,440,350);
    this.pdf.line(90,350,440,350);
    this.pdf.line(90,350,90,370);

    this.pdf.text('CASA REFUGIO',75,380);
    this.pdf.text('ALBERGUE TEMPORAL',75,400);
    this.pdf.text('SERVICIOS HOTELEROS',75,420);
    this.pdf.rect(200,370,20,50); 
    this.pdf.line(200,385,220,385);
    this.pdf.line(200,401,220,401);

    this.pdf.text('Registre el nombre y dirección del sitio donde se está prestando la medida', 75,455);
    this.pdf.line(75,475,400,475);
    this.pdf.line(75,495,400,495);

    this.pdf.line(460,285,460,535);
    this.pdf.line(90,535,460,535);
    this.pdf.line(90,535,90,550);

    this.pdf.rect(460,610,20,20);

    this.pdf.addPage();
    this.crearEncabezado(nombreFormato, 42,true);
    //cuadricula
    this.crearCuadricula(false);

    //pregunta 22
    autoTable(this.pdf, {
      html: '#pregunta-22',
      useCss: true,
      startY: 120,
      margin: {
        left: 65,
        right: 250,
      },
    });
    this.pdf.setLineWidth(1);
    this.pdf.setDrawColor(0, 0, 0);
    this.pdf.rect(430,120,50,50);
    this.pdf.line(455,120,455,170);
    this.pdf.line(430,140,480,140);
    this.pdf.text('SI',440,130);
    this.pdf.text('NO',460,130);

    this.pdf.line(460,175,460,218);

    this.pdf.line(440,175,440,200);
    this.pdf.line(120,200,440,200);
    this.pdf.line(120,200,120,218);

    autoTable(this.pdf, {
      html: '#pregunta-22-2',
      useCss: true,
      startY: 220,
      margin: {
        left: 430,
        right: 70,
      },
    });

    autoTable(this.pdf, {
      html: '#pregunta-23',
      useCss: true,
      startY: 300,
      margin: {
        left: 65,
        right: 70,
      },
    });
    autoTable(this.pdf, {
      html: '#pregunta-23-a',
      useCss: true,
      startY: 360,
      margin: {
        left: 65,
        right: 250,
      },
    });

    this.pdf.setLineWidth(1);
    this.pdf.setDrawColor(0, 0, 0);
    this.pdf.rect(430,360,50,50);
    this.pdf.line(455,360,455,410);
    this.pdf.line(430,380,480,380);
    this.pdf.text('SI',440,370);
    this.pdf.text('NO',460,370);

    this.pdf.line(75,480,480,480);
    this.pdf.line(75,500,480,500);
    this.pdf.line(75,520,480,520);

    this.pdf.rect(430,560,50,50);
    this.pdf.line(455,560,455,610);
    this.pdf.line(430,580,480,580);
    this.pdf.text('SI',440,570);
    this.pdf.text('NO',460,570);

    this.pdf.addPage();
    this.crearEncabezado(nombreFormato, 42,true);
    //cuadricula
    this.crearCuadricula(false);

    autoTable(this.pdf, {
      html: '#pregunta-24',
      useCss: true,
      startY: 120,
      margin: {
        left: 65,
        right: 250,
      },
    });
    this.pdf.setLineWidth(1);
    this.pdf.setDrawColor(0, 0, 0);
    this.pdf.rect(430,120,50,50);
    this.pdf.line(455,120,455,170);
    this.pdf.line(430,140,480,140);
    this.pdf.text('SI',440,140);
    this.pdf.text('NO',460,140);

    this.pdf.line(440,175,440,190);
    this.pdf.line(120,190,440,190);
    this.pdf.line(120,190,120,205);

    this.pdf.rect(430,210,50,50);
    this.pdf.line(455,210,455,260);
    this.pdf.line(430,230,480,230);
    this.pdf.text('SI',440,220);
    this.pdf.text('NO',460,220);

    autoTable(this.pdf, {
      html: '#titulo-blanco-4',
      useCss: true,
      startY: 270,
      margin: {
        left: 60,
        right: 60,
      },
    });

    autoTable(this.pdf, {
      html: '#pregunta-25',
      useCss: true,
      startY: 290,
      margin: {
        left: 65,
        right: 70,
      },
    });
    autoTable(this.pdf, {
      html: '#pregunta-25-a',
      useCss: true,
      startY: 330,
      margin: {
        left: 65,
        right: 250,
      },
    });
    this.pdf.setLineWidth(1);
    this.pdf.setDrawColor(0, 0, 0);
    this.pdf.rect(430,340,50,80);
    this.pdf.line(455,340,455,420);
    this.pdf.line(430,360,480,360);
    this.pdf.line(430,380,480,380);
    this.pdf.line(430,400,480,400);
    this.pdf.text('SI',440,350);
    this.pdf.text('NO',460,350);

    autoTable(this.pdf, {
      html: '#pregunta-25-1',
      useCss: true,
      startY: 460,
      margin: {
        left: 65,
        right: 70,
      },
    });
    
    this.pdf.addPage();
    this.crearEncabezado(nombreFormato, 42,true);
    //cuadricula
    this.crearCuadricula(false);
    
    autoTable(this.pdf, {
      html: '#pregunta-26',
      useCss: true,
      startY: 120,
      margin: {
        left: 65,
        right: 70,
      },
    });
    this.pdf.setLineWidth(1);
    this.pdf.setDrawColor(0, 0, 0);
    this.pdf.line(85,220,500,220);
    this.pdf.line(85,240,500,240);
    this.pdf.line(85,260,500,260);

    autoTable(this.pdf, {
      html: '#pregunta-27',
      useCss: true,
      startY: 330,
      margin: {
        left: 65,
        right: 250,
      },
    });

    this.pdf.setLineWidth(1);
    this.pdf.setDrawColor(0, 0, 0);
    this.pdf.rect(430,330,50,50);
    this.pdf.line(455,330,455,380);
    this.pdf.line(430,350,480,350);
    this.pdf.text('SI',440,340);
    this.pdf.text('NO',460,340);

    this.pdf.line(440,385,440,410);
    this.pdf.line(120,410,440,410);
    this.pdf.line(120,410,120,425);


    this.pdf.rect(430,470,50,60);
    this.pdf.line(455,470,455,530);
    this.pdf.line(430,490,480,490);
    this.pdf.line(430,510,480,510);
    this.pdf.text('SI',440,480);
    this.pdf.text('NO',460,480);

    this.pdf.rect(430,620,50,60);
    this.pdf.line(455,620,455,680);
    this.pdf.line(430,640,480,640);
    this.pdf.line(430,660,480,660);
    this.pdf.text('SI',440,630);
    this.pdf.text('NO',460,630);

    this.pdf.addPage();
    this.crearEncabezado(nombreFormato, 42,true);
    //cuadricula
    this.crearCuadricula(false);

    autoTable(this.pdf, {
      html: '#titulo-blanco-5',
      useCss: true,
      startY: 102.5,
      margin: {
        left: 60,
        right: 60,
      },
    });
    
    this.pdf.setFontSize(9);

    this.pdf.text('29. Realice una valoración de los informes mensuales y determine, si la Comisaría de Familia debe:',65,130);
    this.pdf.text('a. Prorrogar la medida de atención.', 75,150);
    this.pdf.text('b. Revocar la medida de atención.', 75,175);
    this.pdf.text('c. Continuar con el seguimiento mensual.', 75,195);

    this.pdf.setLineWidth(1);
    this.pdf.setDrawColor(0, 0, 0);
    this.pdf.rect(250,140,20,60);
    this.pdf.line(250,160,270,160);
    this.pdf.line(250,180,270,180);

    this.pdf.text('Asegúrese de informar al Comisario(a) el resultado de la valoración para que proceda mediante auto la respectiva orden.', 65, 230);

    this.pdf.text('30. Observaciones', 65, 250);
    this.pdf.line(75,270,520,270);
    this.pdf.line(75,290,520,290);
    this.pdf.line(75,310,520,310);
    this.pdf.line(75,330,520,330);


    this.pdf.text('Firma de quien realizó el seguimiento',75, 400);
    this.pdf.text('Nombre',75,420);
    this.pdf.text('Cargo:',75,440);


    this.crearPiePagina(4);
    window.open(URL.createObjectURL(this.pdf.output('blob')));
  }

  /**
   * @description genera la cuadricula para los formatos de verificacion de medidas
   */
  static crearCuadricula(tamaño: boolean) {
    if (tamaño) {
      this.pdf.setDrawColor(0, 0, 0);
      this.pdf.rect(73, 103, 464, 680);
      this.pdf.line(73, 715, 536.5, 715);
    } else {
      this.pdf.setDrawColor(0, 0, 0);
      this.pdf.rect(60, 103, 492, 680);
      this.pdf.line(60, 715, 554, 715);
    }
    
  }

  /**
   * @description genera la tabla de verificar
   */

  static verificar(starY: number) {
    autoTable(this.pdf, {
      html: '#verificar',
      useCss: true,
      startY: starY,
      margin: {
        left: 75,
        right: 78,
      },
    });
  }

  /**
   * @description genera el cuadro para las listas de chequeo
   */
  static cuadroListasCequeo(
    posicionX: number,
    posicionY: number,
    alto: number,
    texto1: string,
    texto2: string
  ) {
    this.pdf.setDrawColor(0, 0, 0);
    this.pdf.setFillColor(225, 225, 225);
    this.pdf.setFontSize(8);
    this.pdf.rect(posicionX, posicionY, 80, alto, 'FD');
    this.pdf.text('Lista de chequeo', posicionX + 5, posicionY + 10);
    this.pdf.text(texto1, posicionX + 5, posicionY + 25);
    this.pdf.text(texto2, posicionX + 35, posicionY + 25);
    this.pdf.text('SI             SI', posicionX + 5, posicionY + 40);
    this.pdf.text('res. Si        res. No', posicionX + 5, posicionY + 55);
  }

  /**
   * @description genera el Cuadro para las Caracteristicas SI, NO y N/A
   */
  static cuadroSiYNo(posicionX: number, posicionY: number, alto: number) {
    this.pdf.setDrawColor(0, 0, 0);
    this.pdf.setFontSize(8);

    this.pdf.text('Sí', posicionX + 3, posicionY + 10);
    this.pdf.text('NO', posicionX + 16, posicionY + 10);
    this.pdf.text('N/A', posicionX + 32, posicionY + 10);

    // 330, 325 , 75
    this.pdf.rect(posicionX, posicionY, 45, alto);
    this.pdf.line(posicionX + 15, posicionY, posicionX + 15, posicionY + alto);
    this.pdf.line(posicionX + 30, posicionY, posicionX + 30, posicionY + alto);
    this.pdf.line(posicionX, posicionY + 15, posicionX + 45, posicionY + 15);
  }

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
    } else if (formato == 4) {
      valorYNumPagina = 750;
      valorYLogo = 725;
      valorXLogo = 480;
    } else {
      valorYNumPagina = 750;
      valorYLogo = 720;
    }

    this.pdf.setFontSize(8);
    let pageCount = this.pdf.getNumberOfPages();
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
