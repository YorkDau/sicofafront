import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'textoAuto',
})
export class TextoAutoPipe implements PipeTransform {
  transform(value: string): string {
    return value.replace(/\n/g, '\r\n');
  }
}
