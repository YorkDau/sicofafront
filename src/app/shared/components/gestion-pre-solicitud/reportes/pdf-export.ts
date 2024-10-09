import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { formatDate } from '@angular/common';
import autoTable from 'jspdf-autotable';

export class PdfExport {

    private static pdf: jsPDF;

    // static generarPdfAutoTramite() {
    //     const DATA: HTMLElement | null = document.getElementById('htmlData');
    //     const doc = new jsPDF('p', 'pt', 'a4');
    //     const options = {
    //         background: 'white',
    //         scale: 3
    //     };

    //     html2canvas(DATA!, options).then((canvas) => {

    //         const img = canvas.toDataURL('image/PNG');

    //         // Add image Canvas to PDF
    //         const bufferX = 15;
    //         const bufferY = 15;
    //         const imgProps = (doc as any).getImageProperties(img);
    //         const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
    //         const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    //         doc.addImage(img, 'PNG', bufferX, bufferY, pdfWidth, pdfHeight, undefined, 'FAST');
    //         return doc;
    //       }).then((docResult) => {
    //         docResult.save(`${new Date().toISOString()}_tutorial.pdf`);
    //       });

    // }

    static generarPdfAutoTramite() {
        let ciudadRemision = "________________";

        this.pdf = new jsPDF('p', 'pt', 'legal');
        const pageWidth = this.pdf.internal.pageSize.width || this.pdf.internal.pageSize.getWidth();
        this.pdf.setFontSize(10);
        const dia = formatDate(new Date(), 'dd', 'es');
        const mes = formatDate(new Date(), 'MMMM', 'es');
        const anio = formatDate(new Date(), 'yyyy', 'es');
        const nombreReporte = 'FORMATO FALLO CUANDO NO COMPARECE EL ACCIONADO A LA AUDIENCIA Y SE IMPONEN MEDIDAS DE PROTECCIÓN';
        this.crearEncabezado(nombreReporte, 47);

        /**Ciudad, fecha */
        this.pdf.text(ciudadRemision + ', ' + dia + ' de ' + mes + ' de ' + anio, 72, 140);

        /**Señores */
        this.pdf.text('Señores:', 72, 187);
        this.pdf.text('PERSONERÍA DE ______________', 72, 202);
        this.pdf.text('La ciudad', 72, 217);

        /**ASUNTO */
        this.pdf.text('Asunto:   M.P¹. _____ del _______', 72, 252);


        /** CUERPO */
        autoTable(this.pdf, {
            html: '#cuerpo', startY: 265, useCss: true, margin: {
                top: 36,
                left: 68,
                right: 72,
            }
        });

        /**FIRMA */

        this.pdf.setLineWidth(1);
        this.pdf.setDrawColor(0, 0, 0)
        this.pdf.line(230, 490, 383, 490);
        this.pdf.text('Comisario(a) de Familia', pageWidth / 2, 502, { align: 'center' });

        /**MP  */
        this.pdf.line(70, 940, 230, 940);
        this.pdf.setFontSize(8);
        this.pdf.text('¹ MP: Medidad de protección:', 70, 952);


        /**Pie de pagina */
        //   this.crearPiePagina(2);

        window.open(URL.createObjectURL(this.pdf.output('blob')));
    }

    /**
*@description Crea encabezado del documento */
    static crearEncabezado(nombreReporte: string, valorY: number, otraMedida?: boolean) {

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

    /**
   * @description Genera PDF Orientaciones y recomendaciones
   */
    static generarPdfOrientaciones() {
        const pdf = new jsPDF('p', 'pt', 'letter');
        const pageWidth =
            pdf.internal.pageSize.width || pdf.internal.pageSize.getWidth();
        pdf.setFontSize(10);

        autoTable(pdf, {
            html: '#seguridad', useCss: true, margin: [60, 55, 80, 55]
        }
        );


        const pageCount = pdf.getNumberOfPages();
        const pageSize = pdf.internal.pageSize;
        const pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
        let i = 0;
        for (i; i < pageCount; i++) {
            const pag = i + 1;
            const texto = `Página ${pag}  de ` + pageCount;
            pdf.setPage(pag);
            pdf.text(texto, pageWidth / 2, pageHeight - 10, { align: 'center' });
        }
        window.open(URL.createObjectURL(pdf.output('blob')));
    }

}