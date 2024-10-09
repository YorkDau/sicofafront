import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';
import { MARGENES_REPORTE } from 'src/app/constants';

export class ReporteTrabajadorSocialPDF {
  /**
   * @description genera reporte acta verificación derechos
   */
  static actaVerificacionDerechos() {
    const pdf = new jsPDF('p', 'pt', 'a3');

    autoTable(pdf, {
      html: '#header-medida',
      useCss: true,
      margin: MARGENES_REPORTE,
    });
    autoTable(pdf, {
      html: '#verificacion-derechos',
      useCss: true,
      startY: 150,
      margin: MARGENES_REPORTE,
    });
    autoTable(pdf, {
      html: '#listado-derechos',
      useCss: true,
      margin: MARGENES_REPORTE,
    });
    autoTable(pdf, {
      html: '#listado-derechos2',
      useCss: true,
      margin: MARGENES_REPORTE,
    });

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
