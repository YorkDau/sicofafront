import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';
import { MARGENES_REPORTE } from 'src/app/constants';

export class ReporteAbogadoPDF {
  /**
   * @description genera reporte medida de protección
   */
  static medidaProteccion() {
    const pdf = new jsPDF('p', 'pt', 'a3');
    const pageWidth =
      pdf.internal.pageSize.width || pdf.internal.pageSize.getWidth();

    pdf.setFontSize(10);
    pdf.text(
      'LEY 294 DE 1995 MODIFICADA PARCIALMENTE POR LA LEY 575 DE 2000 Y LEY 2126 DE 2021',
      pageWidth / 2,
      110,
      { align: 'center' }
    );
    autoTable(pdf, {
      html: '#header-medida',
      useCss: true,
      margin: MARGENES_REPORTE,
    });
    autoTable(pdf, {
      html: '#numh-medida',
      startY: 150,
      useCss: true,
      margin: MARGENES_REPORTE,
    });
    autoTable(pdf, {
      html: '#lugar-medida',
      useCss: true,
      margin: MARGENES_REPORTE,
    });

    autoTable(pdf, {
      html: '#texto1-medida',
      useCss: true,
      margin: MARGENES_REPORTE,
    });
    autoTable(pdf, {
      html: '#quien-medida',
      useCss: true,
      margin: MARGENES_REPORTE,
    });
    autoTable(pdf, {
      html: '#agresor-medida',
      useCss: true,
      margin: MARGENES_REPORTE,
    });

    autoTable(pdf, {
      html: '#relato-medida',
      useCss: true,
      margin: MARGENES_REPORTE,
    });
    autoTable(pdf, {
      html: '#indique-medida',
      useCss: true,
      margin: MARGENES_REPORTE,
    });
    autoTable(pdf, {
      html: '#violencia-medida',
      useCss: true,
      margin: MARGENES_REPORTE,
    });
    autoTable(pdf, {
      html: '#pruebas-medida',
      useCss: true,
      margin: MARGENES_REPORTE,
    });
    autoTable(pdf, {
      html: '#testimonial-medida',
      useCss: true,
      margin: MARGENES_REPORTE,
    });
    autoTable(pdf, {
      html: '#firma-medida',
      useCss: true,
      margin: MARGENES_REPORTE,
    });

    this.paginador(pdf);

    window.open(URL.createObjectURL(pdf.output('blob')));
  }

  /**
   * @description genera reporte auto
   */
  static generarAuto() {
    const pdf = new jsPDF('p', 'pt', 'a3');

    autoTable(pdf, {
      html: '#header-medida',
      useCss: true,
      margin: MARGENES_REPORTE,
    });
    autoTable(pdf, {
      html: '#reporte-auto',
      useCss: true,
      margin: MARGENES_REPORTE,
    });
    autoTable(pdf, {
      html: '#firma-medida',
      useCss: true,
      margin: MARGENES_REPORTE,
    });

    this.paginador(pdf);
    window.open(URL.createObjectURL(pdf.output('blob')));
  }

  /**
   * @description genera reporte de juez
   * @param idReporte tipo de reporte a generar
   */
  static ReporteJuez(idReporte: string) {
    const pdf = new jsPDF('p', 'pt', 'a3');

    autoTable(pdf, {
      html: '#header-medida',
      useCss: true,
      margin: MARGENES_REPORTE,
    });
    autoTable(pdf, {
      html: idReporte,
      useCss: true,
      startY: 150,
      margin: MARGENES_REPORTE,
    });

    this.paginador(pdf);
    window.open(URL.createObjectURL(pdf.output('blob')));
  }

  /**
   * @description genera pdf incumplimiento medidas
   */
  static Incumplimiento() {
    const pdf = new jsPDF('p', 'pt', 'a3');

    autoTable(pdf, {
      html: '#header-medida',
      useCss: true,
      margin: MARGENES_REPORTE,
    });
    autoTable(pdf, {
      html: '#incumplimiento-medida',
      useCss: true,
      startY: 150,
      margin: MARGENES_REPORTE,
    });
    autoTable(pdf, {
      html: '#datos-denunciante',
      useCss: true,
      margin: MARGENES_REPORTE,
    });
    autoTable(pdf, {
      html: '#datos-denunciado',
      useCss: true,
      margin: MARGENES_REPORTE,
    });
    autoTable(pdf, {
      html: '#datos-victima',
      useCss: true,
      margin: MARGENES_REPORTE,
    });
    autoTable(pdf, {
      html: '#relacion-medida',
      useCss: true,
      margin: MARGENES_REPORTE,
    });
    autoTable(pdf, {
      html: '#medidas-complementarias',
      useCss: true,
      margin: MARGENES_REPORTE,
    });

    this.paginador(pdf);
    window.open(URL.createObjectURL(pdf.output('blob')));
  }

  /**
   * @description genera pdf incumplimiento medidas
   */
  static solicitudLevantamiento() {
    const pdf = new jsPDF('p', 'pt', 'a3');

    autoTable(pdf, {
      html: '#header-medida',
      useCss: true,
      margin: MARGENES_REPORTE,
    });
    autoTable(pdf, {
      html: '#solicitud-levantamiento',
      useCss: true,
      startY: 150,
      margin: MARGENES_REPORTE,
    });
    this.paginador(pdf);
    window.open(URL.createObjectURL(pdf.output('blob')));
  }

  /**
   * @description genera pdf incumplimiento medidas
   * @param idTabla id de la tabla a mostrar
   * @param idTabla2 parámetro opcional, muestra dos tablas más
   */
  static reportePARD(idTabla: string, idTabla2?: string) {
    const pdf = new jsPDF('p', 'pt', 'a3');

    autoTable(pdf, {
      html: '#header-medida',
      useCss: true,
      margin: MARGENES_REPORTE,
    });
    autoTable(pdf, {
      html: idTabla,
      useCss: true,
      startY: 150,
      margin: MARGENES_REPORTE,
    });
    if (idTabla2) {
      autoTable(pdf, {
        html: idTabla2,
        useCss: true,
        margin: MARGENES_REPORTE,
      });
      autoTable(pdf, {
        html: '#comentarios-notificaciones',
        useCss: true,
        margin: MARGENES_REPORTE,
      });
    }

    this.paginador(pdf);
    window.open(URL.createObjectURL(pdf.output('blob')));
  }

  /**
   * @description genera paginación pdf
   * @param pdf instancia pdf
   */
  static paginador(pdf: jsPDF) {
    const pageWidth =
      pdf.internal.pageSize.width || pdf.internal.pageSize.getWidth();
    const pageCount = pdf.getNumberOfPages();
    const pageSize = pdf.internal.pageSize;
    const pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
    let i = 0;
    pdf.setFontSize(10);

    for (i; i < pageCount; i++) {
      const pag = i + 1;
      const texto = `Página ${pag}  de ` + pageCount;
      pdf.setPage(pag);
      pdf.text(texto, pageWidth / 2, pageHeight - 10, { align: 'center' });
    }
  }
}
