import { HttpErrorResponse } from '@angular/common/http';
import { FormGroup } from '@angular/forms';
import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';
import { MARGENES_REPORTE } from 'src/app/constants';

export class SharedFunctions {
  static getBasicError(error: any, print: boolean = false): any {
    if (print) {
      console.error(error.stack);
    }
    if (error instanceof Error) {
      return error;
    }
    if (error instanceof HttpErrorResponse) {
      return error.error;
    }
    return error;
  }
  static getErrorMessage(error: any, print: boolean = true): string {
    error = this.getBasicError(error);
    if (print) {
      console.error(error.stack);
    }
    return error.message ? error.message : 'Error en la petición';
  }

  /**{
   * }
   * Pone en mayusculas la inicial de cada palabra y en minusculas el resto de las letras en una cadena.
   * @param cad
   * @param split
   */
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

  /**
   * Pone en mayusculas la inicial de cada frase separandola por puntos (.)
   * @param cad
   */
  static toPhraseCase(cad: string) {
    return this.toTitleCase(cad, '.');
  }

  static findInvalidControls(form: FormGroup) {
    const invalid = [];
    const controls = form.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }

  /**
   * @description Solo permite ingresar numeros
   */
  static soloNumero(campo: string, formulario: FormGroup) {
    return formulario.controls[campo]?.setValue(
      formulario.controls[campo]?.value.replace(/[^0-9]/g, '')
    );
  }

  /**
   * @description Solo permite ingresar expresion regular
   */
  static soloLetras(campo: string, formulario: FormGroup) {
    return formulario.controls[campo]?.setValue(
      formulario.controls[campo]?.value.replace(
        /[^A-Z||a-z||*#@ñÑáéíóúÁÉÍÓÚ]/g,
        ''
      )
    );
  }

  static generatePdfAutoTable(
    html: string[] | HTMLTableElement[],
    addPage: boolean = true,
    orientation: 'p' | 'portrait' | 'l' | 'landscape' = 'p',
    unit: 'pt' | 'px' | 'in' | 'mm' | 'cm' | 'ex' | 'em' | 'pc' = 'pt',
    format: string | number[] = 'letter',
    compressPdf: boolean = true,
    useCss: boolean = true
  ) {
    const pdf = new jsPDF(orientation, unit, format, compressPdf);
    const pageWidth =
      pdf.internal.pageSize.width || pdf.internal.pageSize.getWidth();
    pdf.setFontSize(10);

    html.forEach((element, idx) => {
      autoTable(pdf, {
        html: element,
        useCss,
        margin: MARGENES_REPORTE,
      });
      if (idx < html.length - 1 && addPage) pdf.addPage();
    });

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

  /**
   * @description Genera PDF Instrumento de riesgo
   */
  static generarPdfInstrumentoRiesgo(filasHijos?: number) {
    const filaDescripcionHechos =
      filasHijos !== 0 && filasHijos ? filasHijos + 25 : 25;
    const pdf = new jsPDF('p', 'pt', 'letter');
    const pageWidth =
      pdf.internal.pageSize.width || pdf.internal.pageSize.getWidth();
    pdf.setFontSize(10);
    console.log('imprimirPDFCompleto');

    autoTable(pdf, {
      html: '#instrumento-riesgo',
      useCss: true,
      columnStyles: {
        0: { cellWidth: 140 },
        1: { cellWidth: 100 },
        2: { cellWidth: 140 },
      },
      margin: [120, 60, 40, 60],
      didParseCell: (data) => {
        if (data.row.index == 101) {
          data.cell.styles.minCellHeight = 80;
          data.cell.styles.valign = 'top';
        }
        if (data.row.index == 102) {
          data.cell.styles.minCellHeight = 50;
          data.cell.styles.valign = 'top';
        }
        if (data.row.index == filaDescripcionHechos) {
          data.cell.styles.minCellHeight = 90;
          data.cell.styles.valign = 'top';
        }
      },
      didDrawPage: (data) => {
        autoTable(pdf, {
          html: '#encabezado',
          useCss: true,
          margin: [40, 60, 40, 60],
        });
      },
    });

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

  /**
   * @description Genera PDF Entrevista
   */
  static generarPdfEntrevista() {
    const pdf = new jsPDF('p', 'pt', 'letter');
    const pageWidth =
      pdf.internal.pageSize.width || pdf.internal.pageSize.getWidth();
    pdf.setFontSize(10);

    autoTable(pdf, {
      html: '#entrevista-emocional',
      useCss: true,
      columnStyles: {
        0: { cellWidth: 140 },
        1: { cellWidth: 100 },
        2: { cellWidth: 140 },
      },
      margin: [120, 40, 40, 40],
      didParseCell: (data) => {
        let index = data.row.index;
        if (
          index == 9 ||
          index == 11 ||
          index == 14 ||
          index == 17 ||
          index == 22 ||
          index == 27 ||
          index == 31 ||
          index == 35 ||
          index == 37 ||
          index == 39
        ) {
          data.cell.styles.minCellHeight = 140;
          data.cell.styles.valign = 'top';
        }
      },
      didDrawPage: (data) => {
        autoTable(pdf, { html: '#encabezado', useCss: true, margin: 40 });
      },
    });

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

  /**
   * @description Genera PDF Orientaciones y recomendaciones
   */
  static generarPdfOrientaciones() {
    const pdf = new jsPDF('p', 'pt', 'letter');
    const pageWidth =
      pdf.internal.pageSize.width || pdf.internal.pageSize.getWidth();
    pdf.setFontSize(10);

    autoTable(pdf, {
      html: '#seguridad',
      useCss: true,
      columnStyles: {
        0: { cellWidth: 25, halign: 'right' },
      },
      margin: [60, 55, 40, 55],
      didDrawCell: (data) => {
        let index = data.row.index;

        if (
          (index >= 3 && index <= 5) ||
          (index >= 22 && index <= 25) ||
          (index >= 44 && index <= 50)
        ) {
          let valorY = data.cell.y + 12;
          pdf.circle(72, valorY, 2, 'F');
        }
      },
    });

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
