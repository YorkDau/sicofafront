import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';
import { MARGENES_REPORTE } from 'src/app/constants';

export class ReporteAutoPDF {
  /**
   * @description genera reporte del auto con medidas
   */
  static generarAuto() {
    const pdf = new jsPDF('p', 'pt', 'a3');
    const pageWidth =
      pdf.internal.pageSize.width || pdf.internal.pageSize.getWidth();

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

    window.open(URL.createObjectURL(pdf.output('blob')));
  }
}
